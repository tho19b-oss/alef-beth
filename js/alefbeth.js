/* Alef Beth — Bewegungs- und Icon-Helfer aus dem Alef Beth Design System.
   Ein klassisches Skript ohne Abhängigkeiten; legt window.AlefBeth an.
   Die App-Module greifen über js/ui.js darauf zu. Alles respektiert
   reduzierte Bewegung (System oder html[data-motion="reduced"]). */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  var ICONS = {"check":"<path d=\"M5 12.6l4.4 4.4L19 7.4\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/>","close":"<path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/>","chevron":"<path d=\"M9.5 5.5L16 12l-6.5 6.5\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.8\"/>","lock":"<path d=\"M8 10.4V8.3a4 4 0 0 1 8 0v2.1\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.6\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M7.6 10h8.8a3.1 3.1 0 0 1 3.1 3.1v5a3.1 3.1 0 0 1-3.1 3.1H7.6a3.1 3.1 0 0 1-3.1-3.1v-5A3.1 3.1 0 0 1 7.6 10zm4.4 3.8a1.75 1.75 0 1 0 0 3.5a1.75 1.75 0 1 0 0-3.5z\"/>","flame":"<path data-s fill=\"currentColor\" d=\"M12.3 2.2c.5 2.9 2.2 4.4 3.9 6.1 1.9 1.9 3.3 4 3.3 6.9 0 4.2-3.3 7.1-7.5 7.1S4.5 19.4 4.5 15.4c0-2.7 1.3-4.8 3.1-6.3.1 1.6.8 2.8 2 3.4-.4-3.9.5-7.3 2.7-10.3z\"/><path class=\"i-accent\" d=\"M12.2 11.6c.4 1.8 1.6 2.7 2.4 3.6.7.8 1.1 1.7 1.1 2.7 0 2.1-1.6 3.4-3.6 3.4s-3.6-1.3-3.6-3.3c0-1.6.8-2.8 2-3.7.1.8.5 1.3 1.1 1.6-.2-1.5 0-3 .6-4.3z\"/>","bolt":"<path data-s fill=\"currentColor\" d=\"M13.6 2.6L5.3 13.3c-.4.5 0 1.2.6 1.2h5l-1.2 7c-.1.7.8 1.1 1.2.5l8.3-10.7c.4-.5 0-1.2-.6-1.2h-5l1.2-7c.1-.7-.8-1.1-1.2-.5z\"/>","crown":"<path data-s fill=\"currentColor\" d=\"M4.2 8.3l3.9 3.4 3.1-6.2a.9.9 0 0 1 1.6 0l3.1 6.2 3.9-3.4a.8.8 0 0 1 1.3.8l-1.9 8.4a1.2 1.2 0 0 1-1.2.9H6a1.2 1.2 0 0 1-1.2-.9L2.9 9.1a.8.8 0 0 1 1.3-.8z\"/><rect data-s x=\"5.4\" y=\"19.3\" width=\"13.2\" height=\"2.3\" rx=\"1.15\" fill=\"currentColor\"/>","star":"<path data-s fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linejoin=\"round\" d=\"M12 3.2l2.53 6 6.51.56-4.95 4.27 1.49 6.36L12 16.8l-5.58 3.59 1.49-6.36-4.95-4.27 6.51-.56z\"/>","sparkle":"<path data-s fill=\"currentColor\" d=\"M12 3c.9 5.1 3.9 8.1 9 9-5.1.9-8.1 3.9-9 9-.9-5.1-3.9-8.1-9-9 5.1-.9 8.1-3.9 9-9z\"/>","speaker":"<path fill=\"currentColor\" d=\"M3.5 9.6c0-.6.5-1.1 1.1-1.1h2.8l4.2-3.6c.6-.5 1.6-.1 1.6.7v12.8c0 .8-1 1.2-1.6.7l-4.2-3.6H4.6c-.6 0-1.1-.5-1.1-1.1z\"/><path class=\"w1\" d=\"M16.2 9.2a4.2 4.2 0 0 1 0 5.6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/><path class=\"w2\" d=\"M19 6.4a8.2 8.2 0 0 1 0 11.2\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/>","book":"<path fill=\"currentColor\" d=\"M11 6.5C8.8 5.2 6.3 4.8 3.6 5.3a1 1 0 0 0-.8 1v11.6a1 1 0 0 0 1.2 1c2.4-.5 4.7-.1 7 1.2zM13 6.5c2.2-1.3 4.7-1.7 7.4-1.2a1 1 0 0 1 .8 1v11.6a1 1 0 0 1-1.2 1c-2.4-.5-4.7-.1-7 1.2z\"/>","repeat":"<path d=\"M20 11.5A8 8 0 0 0 6.3 6.3L4 8.6M4 4v4.6h4.6M4 12.5a8 8 0 0 0 13.7 5.2L20 15.4M20 20v-4.6h-4.6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/>","sliders":"<path d=\"M4 7h9.4M18.6 7H20M4 17h1.4M10.6 17H20\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/><circle cx=\"16\" cy=\"7\" r=\"2.6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/><circle cx=\"8\" cy=\"17\" r=\"2.6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/>","trophy":"<path data-s fill=\"currentColor\" d=\"M7 3.5h10v6a5 5 0 0 1-10 0z\"/><path d=\"M7 5.6H4.8a.8.8 0 0 0-.8.8v.6a4 4 0 0 0 3.6 4M17 5.6h2.2a.8.8 0 0 1 .8.8v.6a4 4 0 0 1-3.6 4M12 14.6v3\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.2\"/><rect data-s x=\"7.5\" y=\"17.6\" width=\"9\" height=\"3.3\" rx=\"1.4\" fill=\"currentColor\"/>","bell":"<path fill=\"currentColor\" d=\"M12 3.2c-3.1 0-5.6 2.5-5.6 5.6v3.6l-1.6 3c-.4.7.1 1.6.9 1.6h12.6c.8 0 1.3-.9.9-1.6l-1.6-3V8.8c0-3.1-2.5-5.6-5.6-5.6zM9.6 18.9a2.5 2.5 0 0 0 4.8 0z\"/>","target":"<circle cx=\"12\" cy=\"12\" r=\"8.6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/><circle cx=\"12\" cy=\"12\" r=\"4.6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\"/><circle cx=\"12\" cy=\"12\" r=\"1.7\" fill=\"currentColor\"/>","bulb":"<path fill=\"currentColor\" d=\"M12 2.8a6.4 6.4 0 0 0-3.9 11.5c.6.5 1 1.2 1.1 1.9h5.6c.1-.7.5-1.4 1.1-1.9A6.4 6.4 0 0 0 12 2.8z\"/><path d=\"M9.6 18.6h4.8M10.4 21.1h3.2\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.2\"/>"};

  // ---------- Grundlagen ----------

  function reducedMotion() {
    if (root.getAttribute('data-motion') === 'reduced') return true;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function token(name) {
    return getComputedStyle(root).getPropertyValue('--' + name).trim();
  }

  function ms(name, fallback) {
    var v = token(name);
    var n = parseFloat(v);
    if (isNaN(n)) return fallback;
    return /ms$/.test(v) ? n : n * 1000;
  }

  function easing(name, fallback) {
    return token(name) || fallback || 'ease-out';
  }

  function el(tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function resolve(target) {
    return typeof target === 'string' ? doc.querySelector(target) : target;
  }

  function centerOf(target) {
    if (target && typeof target.x === 'number' && typeof target.y === 'number' && !target.getBoundingClientRect) {
      return { x: target.x, y: target.y };
    }
    var node = resolve(target);
    if (!node) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function fxLayer() {
    var layer = doc.querySelector('.ab-fx');
    if (!layer) {
      layer = el('div', 'ab-fx');
      layer.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(layer);
    }
    return layer;
  }

  function finished(anim) {
    return anim && anim.finished ? anim.finished.catch(function () {}) : Promise.resolve();
  }

  // ---------- Icons ----------

  function icon(name, opts) {
    opts = opts || {};
    var body = ICONS[name];
    if (!body) return '';
    var cls = 'ab-icon' + (opts.className ? ' ' + opts.className : '');
    var label = opts.label
      ? ' role="img" aria-label="' + String(opts.label).replace(/"/g, '&quot;') + '"'
      : ' aria-hidden="true"';
    return '<svg class="' + cls + '" viewBox="0 0 24 24" focusable="false"' + label + '>' + body + '</svg>';
  }

  // Ersetzt <i data-icon="flame" class="…"></i> durch das Inline-SVG (Klassen bleiben).
  function hydrate(scope) {
    var nodes = (scope || doc).querySelectorAll('i[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var holder = el('span', null, icon(node.getAttribute('data-icon'), {
        className: node.className.replace(/\bab-icon\b/, '').trim(),
        label: node.getAttribute('aria-label'),
      }));
      if (holder.firstChild) node.parentNode.replaceChild(holder.firstChild, node);
    }
    return scope;
  }

  // ---------- Kleine Bewegungen ----------

  // Startet eine CSS-Animationsklasse neu (z. B. is-bump, is-nope).
  function replay(node, cls) {
    node = resolve(node);
    if (!node) return;
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
    var done = function () { node.classList.remove(cls); node.removeEventListener('animationend', done); };
    node.addEventListener('animationend', done);
  }

  var fmt = new Intl.NumberFormat('de-DE');

  // Zählt eine Zahl hoch (XP, Serie, Prozent).
  function countUp(node, to, opts) {
    node = resolve(node);
    opts = opts || {};
    if (!node) return Promise.resolve();
    var from = opts.from != null ? opts.from : parseInt(String(node.textContent).replace(/[^\d-]/g, ''), 10) || 0;
    var prefix = opts.prefix || '';
    var suffix = opts.suffix || '';
    var write = function (v) { node.textContent = prefix + fmt.format(Math.round(v)) + suffix; };
    if (reducedMotion() || from === to) { write(to); return Promise.resolve(); }
    var duration = opts.duration || ms('dur-epic', 900);
    var start = performance.now();
    return new Promise(function (res) {
      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var e = 1 - Math.pow(1 - t, 3);
        write(from + (to - from) * e);
        if (t < 1) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    });
  }

  // Setzt einen Fortschrittsbalken (.ab-progress) auf 0–100 und lässt den Lichtstreif laufen.
  function setProgress(bar, value) {
    bar = resolve(bar);
    if (!bar) return;
    var pct = Math.max(0, Math.min(100, value <= 1 && value > 0 && value % 1 !== 0 ? value * 100 : value));
    var fill = bar.querySelector('.ab-progress__fill');
    if (fill) fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    bar.classList.toggle('is-complete', pct >= 100);
    replay(bar, 'is-bumped');
  }

  // Setzt einen Tagesziel-Ring (.ab-goal) auf value/goal.
  // opts.confetti: false lässt das Konfetti beim Erreichen weg – etwa wenn auf
  // demselben Screen schon eine größere Feier läuft.
  function ring(node, value, goal, opts) {
    node = resolve(node);
    opts = opts || {};
    if (!node) return;
    goal = goal || 1;
    var ratio = Math.max(0, Math.min(1, value / goal));
    var bar = node.querySelector('.ab-goal__bar');
    if (bar) {
      bar.style.strokeDashoffset = String(100 - ratio * 100);
      bar.style.opacity = ratio > 0 ? '1' : '0';
    }
    var label = node.querySelector('.ab-goal__value');
    if (label) countUp(label, Math.min(value, goal), { duration: ms('dur-slow', 420) });
    var wasComplete = node.classList.contains('is-complete');
    node.classList.toggle('is-complete', ratio >= 1);
    if (ratio >= 1 && !wasComplete && opts.confetti !== false) confetti({ origin: node, count: 36, spread: 360, power: 0.55 });
  }

  // ---------- Konfetti ----------

  var PALETTE = ['granat', 'gold', 'minze', 'tekhelet', 'koralle'];

  function confetti(opts) {
    opts = opts || {};
    if (reducedMotion()) return Promise.resolve();
    var layer = fxLayer();
    var o = centerOf(opts.origin);
    var colors = (opts.colors || PALETTE).map(function (c) { return token(c) || c; });
    var count = opts.count || 80;
    var spread = opts.spread != null ? opts.spread : 120;
    var angle = opts.angle != null ? opts.angle : -90;
    var power = opts.power || 1;
    var jobs = [];
    for (var i = 0; i < count; i++) {
      var p = el('i', 'ab-confetti');
      var w = 7 + Math.random() * 6;
      var shape = Math.random();
      p.style.width = w + 'px';
      p.style.height = (shape < 0.5 ? w * 0.45 : w) + 'px';
      p.style.borderRadius = shape > 0.8 ? '50%' : '2px';
      p.style.background = colors[i % colors.length];
      p.style.left = o.x + 'px';
      p.style.top = o.y + 'px';
      layer.appendChild(p);
      var a = (angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
      var v = (220 + Math.random() * 300) * power;
      var dx = Math.cos(a) * v;
      var dy = Math.sin(a) * v;
      var fall = 260 + Math.random() * 280;
      var spin = (Math.random() - 0.5) * 1440;
      var flip = 360 + Math.random() * 720;
      var dur = 1300 + Math.random() * 900;
      var anim = p.animate([
        { transform: 'translate(-50%, -50%) translate(0, 0) rotate(0deg) rotate3d(1, 1, 0, 0deg)', opacity: 1, easing: 'cubic-bezier(0.12, 0.8, 0.3, 1)' },
        { transform: 'translate(-50%, -50%) translate(' + dx + 'px, ' + dy + 'px) rotate(' + spin * 0.4 + 'deg) rotate3d(1, 1, 0, ' + flip * 0.4 + 'deg)', opacity: 1, offset: 0.32, easing: 'cubic-bezier(0.45, 0, 0.9, 0.65)' },
        { transform: 'translate(-50%, -50%) translate(' + dx * 1.25 + 'px, ' + (dy + fall) + 'px) rotate(' + spin + 'deg) rotate3d(1, 1, 0, ' + flip + 'deg)', opacity: 0 }
      ], { duration: dur, delay: Math.random() * 120, fill: 'forwards' });
      jobs.push(finished(anim).then((function (node) { return function () { node.remove(); }; })(p)));
    }
    return Promise.all(jobs);
  }

  // ---------- Funken: fliegen von A nach B ----------

  function sparks(from, to, opts) {
    opts = opts || {};
    var a = centerOf(from);
    var b = centerOf(to);
    if (reducedMotion()) return Promise.resolve();
    var layer = fxLayer();
    var n = opts.count || 7;
    var first = null;
    var all = [];
    for (var i = 0; i < n; i++) {
      var s = el('i', 'ab-spark');
      if (opts.color) s.style.background = token(opts.color) || opts.color;
      layer.appendChild(s);
      var cx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 220;
      var cy = Math.min(a.y, b.y) - 60 - Math.random() * 120;
      var frames = [];
      for (var k = 0; k <= 10; k++) {
        var t = k / 10;
        var x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x;
        var y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;
        var sc = t < 0.15 ? 0.4 + t * 4 : 1 - t * 0.55;
        frames.push({ transform: 'translate(' + x + 'px, ' + y + 'px) rotate(' + (45 + t * 270) + 'deg) scale(' + sc + ')', opacity: t > 0.92 ? 0 : 1 });
      }
      var anim = s.animate(frames, {
        duration: ms('dur-epic', 900) * (0.75 + Math.random() * 0.35),
        delay: i * 45,
        easing: easing('ease-in-out'),
        fill: 'forwards',
      });
      var p = finished(anim).then((function (node) { return function () { node.remove(); }; })(s));
      if (!first) first = p;
      all.push(p);
    }
    return first;
  }

  // ---------- XP ----------

  // „+10 XP“ steigt an der Quelle auf; mit opts.to fliegen Funken zum Zähler,
  // der dann hüpft und hochzählt (opts.total = neuer Endstand).
  function xp(from, amount, opts) {
    opts = opts || {};
    var o = centerOf(from);
    var target = resolve(opts.to);
    var counter = target ? (target.querySelector('[data-count]') || target) : null;
    var bump = function () {
      if (!target) return;
      replay(target, 'is-bump');
      if (counter && opts.total != null) countUp(counter, opts.total, { duration: ms('dur-slow', 420) * 1.5 });
    };
    if (reducedMotion()) { bump(); return Promise.resolve(); }
    var layer = fxLayer();
    var pill = el('div', 'ab-xp-float text-label', icon('bolt') + '<span>+' + amount + ' XP</span>');
    pill.style.left = o.x + 'px';
    pill.style.top = o.y + 'px';
    layer.appendChild(pill);
    var rise = pill.animate([
      { transform: 'translate(-50%, -30%) scale(0.5)', opacity: 0 },
      { transform: 'translate(-50%, -80%) scale(1.12)', opacity: 1, offset: 0.18 },
      { transform: 'translate(-50%, -95%) scale(1)', opacity: 1, offset: 0.3 },
      { transform: 'translate(-50%, -190%) scale(1)', opacity: 1, offset: 0.75 },
      { transform: 'translate(-50%, -240%) scale(0.95)', opacity: 0 }
    ], { duration: ms('dur-epic', 900) * 1.6, easing: easing('ease-out'), fill: 'forwards' });
    var done = finished(rise).then(function () { pill.remove(); });
    if (target) {
      return sparks(from, target, { count: opts.sparks || 7 }).then(bump).then(function () { return done; });
    }
    return done;
  }

  // ---------- Feedback-Leiste ----------

  // feedback(sheet, { tone: 'correct'|'wrong'|'neutral', title, detail, xp, action })
  function feedback(sheet, opts) {
    sheet = resolve(sheet);
    opts = opts || {};
    var tone = opts.tone || 'neutral';
    sheet.classList.remove('ab-sheet--correct', 'ab-sheet--wrong', 'ab-sheet--neutral', 'is-open');
    sheet.classList.add('ab-sheet--' + tone);
    var q = function (sel) { return sheet.querySelector(sel); };
    var iconBox = q('[data-sheet-icon]');
    if (iconBox) iconBox.innerHTML = icon(tone === 'wrong' ? 'close' : 'check');
    var title = q('[data-sheet-title]');
    if (title) title.textContent = opts.title || (tone === 'correct' ? 'Richtig!' : tone === 'wrong' ? 'Nicht ganz.' : '');
    var detail = q('[data-sheet-detail]');
    if (detail) detail.innerHTML = opts.detail || '';
    var xpBox = q('[data-sheet-xp]');
    if (xpBox) {
      xpBox.hidden = !opts.xp;
      if (opts.xp) xpBox.innerHTML = icon('bolt') + '<span>+' + opts.xp + ' XP</span>';
    }
    var action = q('[data-sheet-action]');
    if (action && opts.action) action.textContent = opts.action;
    sheet.hidden = false;
    void sheet.offsetWidth;
    sheet.classList.add('is-open');
    if (action && opts.focus !== false) {
      setTimeout(function () { action.focus({ preventScroll: true }); }, 30);
    }
    return {
      close: function () {
        sheet.classList.remove('is-open');
        return new Promise(function (res) { setTimeout(res, reducedMotion() ? 0 : ms('dur-base', 260)); });
      },
    };
  }

  // ---------- Toast ----------

  // toast('Neue Version verfügbar', { tone: 'info'|'success'|'reward'|'error', icon, duration, action, onAction })
  function toast(text, opts) {
    opts = opts || {};
    var tone = opts.tone || 'info';
    var icons = { info: 'bell', success: 'check', reward: 'bolt', error: 'close' };
    var host = doc.querySelector('.ab-toaster');
    if (!host) {
      host = el('div', 'ab-toaster');
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      doc.body.appendChild(host);
    }
    var duration = opts.duration != null ? opts.duration : 4000;
    var t = el('div', 'ab-toast ab-toast--' + tone);
    t.innerHTML =
      '<span class="ab-toast__icon">' + icon(opts.icon || icons[tone] || 'bell') + '</span>' +
      '<p class="ab-toast__text text-strong"></p>' +
      (opts.action ? '<button type="button" class="ab-btn ab-btn--ghost ab-btn--sm text-label"></button>' : '') +
      (duration ? '<span class="ab-toast__timer" style="--_t:' + duration + 'ms"></span>' : '');
    t.querySelector('.ab-toast__text').textContent = text;
    var closed = false;
    var close = function () {
      if (closed) return;
      closed = true;
      if (reducedMotion()) { t.remove(); return; }
      t.classList.add('is-leaving');
      t.addEventListener('animationend', function () { t.remove(); }, { once: true });
    };
    if (opts.action) {
      var b = t.querySelector('button');
      b.textContent = opts.action;
      b.addEventListener('click', function () { if (opts.onAction) opts.onAction(); close(); });
    }
    host.appendChild(t);
    if (duration) setTimeout(close, duration);
    return { close: close, node: t };
  }

  // ---------- Screenwechsel ----------

  // swap(host, htmlOrRenderFn, { direction: 'forward'|'back'|'fade' })
  // Nutzt die View Transitions API, sonst eine CSS-Animation.
  function swap(host, render, opts) {
    host = resolve(host);
    opts = opts || {};
    var dir = opts.direction || 'forward';
    var apply = function () {
      if (typeof render === 'function') render(host); else host.innerHTML = render;
      hydrate(host);
    };
    if (reducedMotion()) { apply(); return Promise.resolve(); }
    if (doc.startViewTransition && opts.viewTransition !== false) {
      root.setAttribute('data-ab-vt', dir);
      host.style.viewTransitionName = 'ab-screen';
      var vt = doc.startViewTransition(apply);
      return vt.finished.catch(function () {}).then(function () {
        root.removeAttribute('data-ab-vt');
        host.style.viewTransitionName = '';
      });
    }
    return new Promise(function (res) {
      host.classList.add('ab-swap-out-' + dir);
      setTimeout(function () {
        host.classList.remove('ab-swap-out-' + dir);
        apply();
        host.classList.add('ab-swap-in-' + dir);
        setTimeout(function () { host.classList.remove('ab-swap-in-' + dir); res(); }, ms('dur-slow', 420));
      }, ms('dur-base', 260));
    });
  }

  // ---------- Startbildschirm ----------

  // splash(node, { to, reveal }) spielt den Startbildschirm (.ab-splash) ab:
  // Das Icon sinkt um seine Kante ein, federt zurück und dockt dann an opts.to
  // an – in der App die Marke der Kopfleiste. Sobald es losfliegt, ruft es
  // opts.reveal(), damit der Screen darunter hereingleitet; ohne Ziel blendet
  // es aus. Antippen oder eine Taste überspringt. Löst auf, sobald er weg ist.
  function splash(node, opts) {
    node = resolve(node);
    opts = opts || {};
    if (!node) return Promise.resolve();
    var target = resolve(opts.to);
    var timers = [];
    var revealed = false;
    var over = false;
    var settle;
    var gone = new Promise(function (res) { settle = res; });
    var later = function (fn, t) { timers.push(setTimeout(fn, t)); };
    // Hat er sich mangels Skript schon selbst ausgeblendet (ab-vanish)?
    var vanished = function () { return getComputedStyle(node).visibility === 'hidden'; };
    var reveal = function () {
      if (revealed) return;
      revealed = true;
      if (opts.reveal) opts.reveal();
    };
    var done = function () {
      if (over) return;
      over = true;
      timers.forEach(clearTimeout);
      node.removeEventListener('pointerdown', skip);
      doc.removeEventListener('keydown', skip);
      if (target) target.style.opacity = '';
      node.remove();
      settle();
    };
    var skip = function () {
      if (over) return;
      timers.forEach(clearTimeout);
      reveal();
      node.classList.add('is-skipped');
      later(done, ms('dur-quick', 160));
    };
    var dock = function () {
      var icon = node.querySelector('.ab-splash__icon');
      var face = node.querySelector('.ab-splash__face');
      var a = face && face.getBoundingClientRect();
      var b = target && target.getBoundingClientRect();
      if (!a || !a.width || !b || !b.width || !icon.animate) {
        reveal();
        node.classList.add('is-leaving');
        later(done, ms('dur-base', 260));
        return;
      }
      var scale = b.width / a.width;
      var dx = b.left + b.width / 2 - (a.left + a.width / 2);
      var dy = b.top + b.height / 2 - (a.top + a.height / 2);
      var radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      var timing = { duration: ms('dur-slow', 420), easing: easing('ease-in-out'), fill: 'forwards' };
      icon.animate([
        { transform: 'none' },
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + scale + ')' }
      ], timing);
      face.animate([
        { borderRadius: getComputedStyle(face).borderTopLeftRadius },
        { borderRadius: radius / scale + 'px' }
      ], timing);
      target.style.opacity = '0';
      node.classList.add('is-docking');
      reveal();
      later(function () {
        target.style.opacity = '';
        replay(target, 'is-bump');
        done();
      }, timing.duration);
    };
    var play = function () {
      if (over || node.classList.contains('is-skipped')) return;
      if (vanished()) { reveal(); done(); return; }
      node.classList.add('is-playing');
      // Die Zeit zählt ab dem echten Start der Bewegung, nicht ab der Klasse:
      // Einsinken (dur-press), Hüpfer und Funken (dur-slow), kurz stehen
      // lassen (dur-base) – dann andocken.
      var face = node.querySelector('.ab-splash__face');
      var press = face && face.getAnimations ? face.getAnimations()[0] : null;
      var started = press && press.ready ? press.ready.catch(function () {}) : Promise.resolve();
      started.then(function () {
        if (over || node.classList.contains('is-skipped')) return;
        later(dock, ms('dur-press', 90) + ms('dur-slow', 420) + ms('dur-base', 260));
      });
    };
    // Weniger Bewegung gewünscht, oder schon von selbst ausgeblendet: nur aufräumen.
    if (reducedMotion() || vanished()) {
      reveal();
      done();
      return gone;
    }
    node.addEventListener('pointerdown', skip);
    doc.addEventListener('keydown', skip);
    // Erst den Screen darunter einmal zeichnen lassen, dann spielen – sonst
    // fällt der Anfang der Bewegung in das lange erste Bild der App.
    requestAnimationFrame(function () { requestAnimationFrame(play); });
    return gone;
  }

  var api = {
    version: '1.0.0',
    reducedMotion: reducedMotion,
    token: token,
    icon: icon,
    icons: Object.keys(ICONS),
    hydrate: hydrate,
    replay: replay,
    countUp: countUp,
    setProgress: setProgress,
    ring: ring,
    confetti: confetti,
    sparks: sparks,
    xp: xp,
    feedback: feedback,
    toast: toast,
    swap: swap,
    splash: splash,
  };
  window.AlefBeth = Object.assign(window.AlefBeth || {}, api);

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function () { hydrate(doc); });
  } else {
    hydrate(doc);
  }
})();
