/* =========================================================
   7CUBEZ BUILDERS — Site interactions (no libraries needed)
   Settings live in js/config.js
   ========================================================= */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  /* ---------- WhatsApp links ---------- */
  var waNumber = String(cfg.whatsappNumber || '').replace(/\D/g, '');
  var defaultMsg = cfg.whatsappDefaultMessage ||
    'Hello 7CUBEZ BUILDERS, I would like to know more about your home designs and construction services.';

  function waUrl(message) {
    var text = encodeURIComponent(String(message || defaultMsg).trim());
    // With no number set, wa.me/?text= lets the visitor pick a contact (still works).
    return waNumber ? 'https://wa.me/' + waNumber + '?text=' + text : 'https://wa.me/?text=' + text;
  }

  function setWa(el) {
    el.href = waUrl(el.getAttribute('data-wa'));
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }
  $$('[data-wa]').forEach(setWa);

  if (!waNumber && /^(localhost|127\.0\.0\.1|)$/.test(location.hostname)) {
    console.warn('[7CUBEZ] WhatsApp number is not set in js/config.js');
  }

  /* ---------- Contact details from config ---------- */
  var tel = cfg.phone ? 'tel:' + String(cfg.phone).replace(/[^\d+]/g, '') : '';

  ['officeAddress', 'serviceAreas', 'established', 'workingHours'].forEach(function (key) {
    var dd = $('[data-fact="' + key + '"]');
    if (!dd) return;
    if (cfg[key]) dd.textContent = cfg[key];
    else dd.classList.add('empty');
  });

  function icon(name) {
    return '<svg class="icon"><use href="#i-' + name + '"/></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var methods = $('#contactMethods');
  var footerContact = $('#footerContact');
  var hasFooterContact = false;

  function addMethod(iconName, title, text, href) {
    var tag = href ? 'a' : 'div';
    var attrs = href ? ' href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '') : '';
    methods.insertAdjacentHTML('beforeend',
      '<' + tag + ' class="method"' + attrs + '><span class="m-icon">' + icon(iconName) + '</span>' +
      '<span><strong>' + esc(title) + '</strong><small>' + esc(text) + '</small></span></' + tag + '>');
  }
  function addFooter(iconName, text, href) {
    hasFooterContact = true;
    footerContact.insertAdjacentHTML('beforeend', href
      ? '<li><a href="' + esc(href) + '" style="display:inline-flex;gap:12px">' + icon(iconName) + esc(text) + '</a></li>'
      : '<li>' + icon(iconName) + '<span>' + esc(text) + '</span></li>');
  }

  if (cfg.phone) { addMethod('phone', 'Call us', cfg.phone, tel); addFooter('phone', cfg.phone, tel); }
  if (cfg.email) { addMethod('mail', 'Email', cfg.email, 'mailto:' + cfg.email); addFooter('mail', cfg.email, 'mailto:' + cfg.email); }
  if (cfg.instagramUrl) addMethod('ig', 'Instagram', cfg.instagramHandle || 'Follow our latest work', cfg.instagramUrl);
  if (cfg.officeAddress) { addMethod('pin', 'Office', cfg.officeAddress); addFooter('pin', cfg.officeAddress); }
  if (cfg.workingHours) addMethod('clock', 'Working hours', cfg.workingHours);
  if (hasFooterContact) { var fb = $('.f-fallback', footerContact); if (fb) fb.remove(); }

  // Instagram buttons
  if (cfg.instagramUrl) {
    var igBtn = $('#igButton');
    igBtn.href = cfg.instagramUrl; igBtn.target = '_blank'; igBtn.rel = 'noopener noreferrer'; igBtn.hidden = false;
    if (cfg.instagramHandle) $('span', igBtn).textContent = 'Follow ' + cfg.instagramHandle;
    $('#igSoon').hidden = true;
    $('#igAlt').hidden = true;
    var fIg = $('#footerIg');
    fIg.href = cfg.instagramUrl; fIg.target = '_blank'; fIg.rel = 'noopener noreferrer'; fIg.hidden = false;
  }

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state, active link, mobile menu ---------- */
  var header = $('#siteHeader');
  var toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    var show = y > 700;
    toTop.classList.toggle('show', show);
    toTop.tabIndex = show ? 0 : -1;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var sectionIds = ['home', 'about', 'homes', 'designs', 'construction', 'contact'];
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('.nav-link, .mobile-menu a').forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  var menuBtn = $('#menuToggle');
  var menu = $('#mobileMenu');
  function setMenu(open) {
    menu.hidden = !open;
    header.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1024 && !menu.hidden) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Lightbox ---------- */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbCaption = $('#lbCaption'),
      lbCount = $('#lbCount'), lbBadge = $('#lbBadge'), lbEnquire = $('#lbEnquire'),
      lbPrev = $('#lbPrev'), lbNext = $('#lbNext'), lbClose = $('#lbClose');
  var slides = [], current = 0, lastFocus = null;

  function renderSlide() {
    var s = slides[current];
    lbImg.src = s.img; lbImg.alt = s.alt || s.title;
    lbTitle.textContent = s.title;
    lbCaption.textContent = s.caption || '';
    lbBadge.hidden = !s.placeholder;
    lbCount.textContent = slides.length > 1 ? (current + 1) + ' / ' + slides.length : '';
    lbPrev.hidden = lbNext.hidden = slides.length < 2;
    if (s.wa) { lbEnquire.href = waUrl(s.wa); lbEnquire.hidden = false; } else { lbEnquire.hidden = true; }
  }
  function openLightbox(list, index) {
    slides = list; current = index; lastFocus = document.activeElement;
    renderSlide();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function step(d) { current = (current + d + slides.length) % slides.length; renderSlide(); }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight' && slides.length > 1) step(1);
    if (e.key === 'ArrowLeft' && slides.length > 1) step(-1);
    if (e.key === 'Tab') {
      var f = $$('button:not([hidden]), a[href]:not([hidden])', lb);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // Featured homes
  var homeCards = $$('.home-card');
  var homeSlides = homeCards.map(function (c) {
    var sample = c.getAttribute('data-sample') === 'true';
    return {
      img: c.getAttribute('data-img'),
      title: c.getAttribute('data-title'),
      caption: c.getAttribute('data-desc') + (sample ? ' (Sample design — illustration only.)' : ''),
      alt: c.getAttribute('data-title'),
      placeholder: sample,
      wa: $('[data-wa]', c) ? $('[data-wa]', c).getAttribute('data-wa') : ''
    };
  });
  homeCards.forEach(function (c, i) {
    $$('.js-view', c).forEach(function (b) { b.addEventListener('click', function () { openLightbox(homeSlides, i); }); });
  });

  /* ---------- Gallery filters ---------- */
  var gallery = $('#gallery');
  var items = $$('li', gallery);
  var filterBtns = $$('#galleryFilters button');
  var status = $('#galleryStatus');
  var activeFilter = 'all';

  // Add counts and hide empty categories
  filterBtns.forEach(function (b) {
    var f = b.getAttribute('data-filter');
    var n = f === 'all' ? items.length : items.filter(function (li) { return li.getAttribute('data-cat') === f; }).length;
    if (!n) { b.hidden = true; return; }
    b.insertAdjacentHTML('beforeend', ' <span class="count">' + n + '</span>');
    b.addEventListener('click', function () { applyFilter(f, b); });
  });

  function visibleItems() { return items.filter(function (li) { return !li.hidden; }); }

  function applyFilter(f, btn) {
    activeFilter = f;
    filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    items.forEach(function (li) {
      li.hidden = !(f === 'all' || li.getAttribute('data-cat') === f);
      // restart entrance animation
      li.style.animation = 'none'; void li.offsetWidth; li.style.animation = '';
    });
    gallery.classList.toggle('filtered', f !== 'all');
    var n = visibleItems().length;
    status.textContent = 'Showing ' + n + (n === 1 ? ' design' : ' designs') + (f === 'all' ? '' : ' in ' + btn.textContent.replace(/\d+$/, '').trim()) + '.';
  }

  items.forEach(function (li) {
    var btn = $('.g-item', li);
    btn.addEventListener('click', function () {
      var vis = visibleItems();
      var list = vis.map(function (v) {
        var b = $('.g-item', v), img = $('img', v);
        return {
          img: img.getAttribute('src'), alt: img.alt,
          title: $('.g-cap strong', v).textContent, caption: b.getAttribute('data-label'),
          placeholder: b.classList.contains('is-placeholder')
        };
      });
      openLightbox(list, vis.indexOf(li));
    });
  });
  if (!$('.g-item.is-placeholder')) { var gn = $('#galleryNote'); if (gn) gn.hidden = true; }

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = $('#enquiryForm');
  var done = $('#formDone');
  var touched = {};
  var fields = {
    name: $('#f-name'), phone: $('#f-phone'), location: $('#f-location'),
    houseType: $('#f-type'), budget: $('#f-budget'), message: $('#f-message')
  };

  function validate() {
    var e = {};
    var name = fields.name.value.trim();
    if (!name) e.name = 'Please enter your full name.';
    else if (name.length < 2) e.name = 'Name looks too short.';
    else if (!/^[A-Za-zÀ-ɏऀ-৿ .'-]+$/.test(name)) e.name = 'Please use letters only.';

    var phone = fields.phone.value.trim();
    var digits = phone.replace(/\D/g, '');
    if (!phone) e.phone = 'Please enter your phone number.';
    else if (/[^\d+\s()-]/.test(phone)) e.phone = 'Phone number can contain digits, spaces, + and - only.';
    else if (!/^(?:(?:91|0)?[6-9]\d{9}|\d{10,15})$/.test(digits)) e.phone = 'Enter a valid 10-digit mobile number (with country code if outside India).';

    if (!fields.houseType.value) e.houseType = 'Please choose a house type.';
    if (fields.location.value.trim().length > 80) e.location = 'Please keep the location under 80 characters.';
    if (fields.message.value.trim().length > 800) e.message = 'Please keep the message under 800 characters.';
    return e;
  }

  var errorIds = { name: 'f-name-error', phone: 'f-phone-error', location: 'f-location-error', houseType: 'f-type-error', message: 'f-message-error' };

  function showErrors(errs) {
    Object.keys(errorIds).forEach(function (k) {
      var msg = touched[k] ? errs[k] : '';
      var el = document.getElementById(errorIds[k]);
      el.textContent = msg || '';
      if (msg) { fields[k].setAttribute('aria-invalid', 'true'); fields[k].setAttribute('aria-describedby', errorIds[k]); }
      else { fields[k].removeAttribute('aria-invalid'); fields[k].removeAttribute('aria-describedby'); }
    });
  }

  Object.keys(fields).forEach(function (k) {
    fields[k].addEventListener('blur', function () { touched[k] = true; showErrors(validate()); });
    fields[k].addEventListener('input', function () { if (touched[k]) showErrors(validate()); });
    fields[k].addEventListener('change', function () { if (touched[k]) showErrors(validate()); });
  });

  function buildMessage() {
    var v = function (k) { return fields[k].value.trim(); };
    var lines = ['*Name:* ' + v('name'), '*Phone:* ' + v('phone')];
    if (v('location')) lines.push('*Preferred location:* ' + v('location'));
    lines.push('*House type:* ' + v('houseType'));
    if (v('budget')) lines.push('*Approximate budget:* ' + v('budget'));
    if (v('message')) lines.push('*Message:* ' + v('message'));
    return 'Hello 7CUBEZ BUILDERS, I would like to enquire about building a home.\n\n' + lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    Object.keys(fields).forEach(function (k) { touched[k] = true; });
    var errs = validate();
    showErrors(errs);
    var first = Object.keys(errorIds).filter(function (k) { return errs[k]; })[0];
    if (first) { fields[first].focus(); return; }

    var url = waUrl(buildMessage());
    $('#waAgain').href = url;
    form.hidden = true;
    done.hidden = false;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  $('#newEnquiry').addEventListener('click', function () {
    form.reset(); touched = {}; showErrors({});
    done.hidden = true; form.hidden = false;
    fields.name.focus();
  });
})();
