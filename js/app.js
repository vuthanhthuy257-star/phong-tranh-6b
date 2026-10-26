'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const artworks = (Array.isArray(window.ARTWORKS) ? window.ARTWORKS : [])
    .filter(a => a && a.published === true)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  const dialog = $('viewer');
  const stage = $('media-stage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, activeVideo = null, returnFocus = null, mediaGeneration = 0;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function imageFor(artwork, lazy = false) {
    const img = el('img');
    img.src = artwork.image || 'images/unavailable.svg';
    img.alt = artwork.demo ? `Hình giữ chỗ minh họa cho ${artwork.title}` : artwork.title;
    img.loading = lazy ? 'lazy' : 'eager';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      img.onerror = null;
      if (!img.src.endsWith('/images/unavailable.svg')) img.src = 'images/unavailable.svg';
    }, { once: true });
    return img;
  }
  artworks.forEach((a, index) => {
    const article = el('article', 'artwork');
    const button = el('button'); button.type = 'button';
    button.setAttribute('aria-label', `Mở tác phẩm ${a.title}, ${a.author}`);
    const wall = el('div', 'artwork-wall');
    wall.append(el('span', 'work-number', String(index + 1).padStart(2, '0')));
    const frame = el('div', 'frame'); frame.append(imageFor(a, true)); wall.append(frame);
    const type = el('span', 'work-type'); type.append(el('i', '', a.video ? '▷' : '◇'), document.createTextNode(a.video ? 'TRANH CHUYỂN ĐỘNG' : 'TRANH TĨNH')); wall.append(type);
    const meta = el('div', 'artwork-meta'); const text = el('div');
    text.append(el('h3', '', a.title), el('p', 'author', a.author));
    if (a.demo) text.append(el('p', 'demo-label', 'NỘI DUNG MINH HỌA'));
    meta.append(text, el('span', 'artwork-arrow', '↗')); button.append(wall, meta);
    button.addEventListener('click', () => open(index, button)); article.append(button); $('gallery').append(article);
  });
  $('gallery-count').textContent = `${String(artworks.length).padStart(2, '0')} tác phẩm`;
  // Phần mở đầu tự dùng tranh đầu tiên, giáo viên không phải sửa HTML.
  const heroImage = document.querySelector('.hero-frame img');
  const heroLabel = document.querySelector('.corner-label');
  if (artworks.length) {
    heroImage.src = artworks[0].image;
    heroLabel.hidden = !artworks[0].demo;
  }
  document.querySelector('.demo-notice').hidden = !artworks.some(a => a.demo);

  if (!artworks.length) $('gallery').append(el('p', '', 'Phòng tranh đang được chuẩn bị. Mời bạn trở lại khi những nét vẽ sẵn sàng.'));
  function stopMedia() {
    mediaGeneration++;
    if (activeVideo) {
      activeVideo.pause(); activeVideo.removeAttribute('src'); activeVideo.load(); activeVideo = null;
    }
    stage.replaceChildren(); $('manual-play').hidden = true; $('media-status').textContent = '';
  }
  function showMode(mode) {
    stopMedia(); const a = artworks[current]; const generation = mediaGeneration;
    const motion = mode === 'motion' && Boolean(a.video);
    $('show-original').setAttribute('aria-pressed', String(!motion));
    $('show-motion').setAttribute('aria-pressed', String(motion));
    if (!motion) { stage.append(imageFor(a)); return; }
    const video = el('video'); activeVideo = video;
    video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
    video.setAttribute('playsinline', ''); video.setAttribute('aria-label', `Video ${a.title}`);
    video.controls = true; video.preload = 'metadata'; video.poster = a.image; video.src = a.video;
    stage.append(video); $('media-status').textContent = 'Đang chuẩn bị video…';
    const isCurrent = () => generation === mediaGeneration && activeVideo === video && dialog.open;
    video.addEventListener('loadeddata', () => { if (isCurrent()) $('media-status').textContent = a.demo ? 'Video thử nghiệm kỹ thuật · Không phải video Veo 3 hay tranh học sinh.' : ''; });
    video.addEventListener('playing', () => { if (isCurrent()) { $('manual-play').hidden = true; $('media-status').textContent = a.demo ? 'Video thử nghiệm kỹ thuật · Không phải video Veo 3 hay tranh học sinh.' : ''; } });
    video.addEventListener('error', () => {
      if (!isCurrent()) return;
      stopMedia(); stage.append(imageFor(a)); $('show-original').setAttribute('aria-pressed', 'true'); $('show-motion').setAttribute('aria-pressed', 'false');
      $('media-status').textContent = 'Chưa tải được video. Bạn đang xem tranh gốc; có thể chọn “Tranh chuyển động” để thử lại.';
    });
    if (reducedMotion.matches) {
      $('media-status').textContent = 'Đã tắt tự phát theo tùy chọn giảm chuyển động của bạn.'; $('manual-play').hidden = false;
    } else {
      video.play().catch(() => { if (isCurrent()) { $('manual-play').hidden = false; $('media-status').textContent = 'Video chưa tự phát. Chạm “Phát video” để bắt đầu.'; } });
    }
  }
  function render() {
    const a = artworks[current];
    $('viewer-title').textContent = a.title; $('viewer-author').textContent = a.author;
    $('viewer-description').textContent = a.description || '';
    $('viewer-category').textContent = a.demo ? 'TÁC PHẨM MINH HỌA · BẢN DEMO' : 'NÉT VẼ CỦA HỌC SINH LỚP 6B';
    $('viewer-counter').textContent = `${current + 1} / ${artworks.length}`;
    $('show-motion').hidden = !a.video;
    $('viewer-hint').textContent = a.video ? 'Đổi giữa tranh gốc và chuyển động để khám phá cùng một tác phẩm.' : 'Tác phẩm được trưng bày dưới dạng tranh tĩnh.';
    $('previous').disabled = $('next').disabled = artworks.length < 2;
    showMode(a.video ? 'motion' : 'original');
  }
  function open(index, trigger) {
    current = index; returnFocus = trigger;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('scroll-locked'); render(); $('close-viewer').focus(); dialog.scrollTop = 0;
  }
  function navigate(offset) { current = (current + offset + artworks.length) % artworks.length; render(); }
  function close() { dialog.close(); }
  dialog.addEventListener('close', () => { stopMedia(); document.body.classList.remove('scroll-locked'); returnFocus?.focus({preventScroll:true}); });
  $('close-viewer').addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
  $('previous').addEventListener('click', () => navigate(-1)); $('next').addEventListener('click', () => navigate(1));
  $('show-original').addEventListener('click', () => showMode('original'));
  $('show-motion').addEventListener('click', () => showMode('motion'));
  $('manual-play').addEventListener('click', () => { const video = activeVideo; video?.play().catch(() => { if (activeVideo === video) $('media-status').textContent = 'Không thể phát video. Bạn có thể xem tranh gốc hoặc thử lại sau.'; }); });
  dialog.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT','VIDEO'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
  });
  reducedMotion.addEventListener('change', e => { if (e.matches && activeVideo) { activeVideo.pause(); $('manual-play').hidden = false; $('media-status').textContent = 'Đã dừng tự phát theo tùy chọn giảm chuyển động.'; } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && activeVideo) { activeVideo.pause(); $('manual-play').hidden = false; } });
})();
