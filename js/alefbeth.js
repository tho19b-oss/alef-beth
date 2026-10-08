/* Alef Beth — Bewegungs-, Klang- und Icon-Helfer aus dem Alef Beth Design System.
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

  // ---------- Klang ----------

  // Glockenspiel-Töne für Antworten und Feiern, live per Web Audio erzeugt –
  // keine Audiodateien, offline von Anfang an dabei. Alle Töne stehen in einer
  // Tonleiter (D-Dur-Pentatonik), damit nichts schief klingt, wenn sich zwei
  // Klänge überlappen. Die Lautstärken folgen den Feier-Stufen: „Richtig“
  // kommt dutzendmal pro Lektion und ist deshalb leiser als die Feiern.
  // html[data-sound="off"] schaltet alles ab – die App setzt das aus ihrer
  // Einstellung „Soundeffekte“.

  var AC = window.AudioContext || window.webkitAudioContext;

  function soundSupported() {
    return !!AC;
  }

  function soundOn() {
    return !!AC && root.getAttribute('data-sound') !== 'off';
  }

  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  function pickOne(list) { return list[Math.floor(Math.random() * list.length)]; }

  // D-Dur-Pentatonik von D5 bis D7: die Leiter für Richtig und Kombo.
  var LADDER = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95, 98];
  // Paare finden: ein D-Dur-Akkord, Ton für Ton (bis zu fünf Paare).
  var PAIRS = [86, 90, 93, 98, 102];

  // Kleiner, warmer Raum: Rauschen, das abklingt und nach hinten dunkler wird.
  function roomImpulse(ctx, seconds) {
    var len = Math.floor(ctx.sampleRate * seconds);
    var fade = ctx.sampleRate * 0.006;
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      var lp = 0;
      for (var i = 0; i < len; i++) {
        var x = i / len;
        lp += (0.6 - 0.45 * x) * (Math.random() * 2 - 1 - lp);
        d[i] = lp * Math.pow(1 - x, 3.4) * Math.min(1, i / fade);
      }
    }
    return buf;
  }

  // Sicherheitsnetz, falls viele Töne zugleich klingen: Spitzen über 0,8 werden
  // weich gerundet statt hart abgeschnitten.
  function softCurve() {
    var curve = new Float32Array(2049);
    for (var i = 0; i < curve.length; i++) {
      var x = i / 1024 - 1;
      var a = Math.abs(x);
      curve[i] = a < 0.8 ? x : Math.sign(x) * (0.8 + 0.2 * Math.tanh((a - 0.8) / 0.2));
    }
    return curve;
  }

  // Baut die Klangkette für einen AudioContext – oder für einen
  // OfflineAudioContext, um die Klänge ohne Lautsprecher zu prüfen.
  function soundEngine(ctx, output) {
    output = output || ctx.destination;
    var sr = ctx.sampleRate;

    var out = ctx.createGain();
    out.gain.value = 0.9;
    var limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 6;
    limiter.ratio.value = 4;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.2;
    var soft = ctx.createWaveShaper();
    soft.curve = softCurve();
    out.connect(limiter);
    limiter.connect(soft);
    soft.connect(output);

    var room = ctx.createConvolver();
    room.buffer = roomImpulse(ctx, 1.5);
    room.connect(out);

    var noise = ctx.createBuffer(1, sr, sr);
    var nd = noise.getChannelData(0);
    for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // Ein Klang = ein Kanal mit eigener Lautstärke: trocken in den Ausgang,
    // ein Teil (wet) in den Raum.
    function channel(wet, level) {
      var g = ctx.createGain();
      g.gain.value = level == null ? 1 : level;
      g.connect(out);
      var send = ctx.createGain();
      send.gain.value = wet;
      g.connect(send);
      send.connect(room);
      return g;
    }

    // Schnell an, dann exponentiell ausklingen (tau = Zeitkonstante).
    function envelope(g, t, peak, attack, tau) {
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + attack);
      g.gain.setTargetAtTime(0, t + attack, tau);
      return t + attack + tau * 8 + 0.02;
    }

    function tone(dest, f, t, o) {
      var peak = o.peak != null ? o.peak : 0.3;
      var attack = o.attack != null ? o.attack : 0.002;
      var tau = o.tau != null ? o.tau : 0.3;
      var from = o.from || 0;
      var glide = o.glide != null ? o.glide : 0.03;
      if (f > sr * 0.45) return;
      var osc = ctx.createOscillator();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(from ? f * from : f, t);
      if (from) osc.frequency.exponentialRampToValueAtTime(f, t + glide);
      var g = ctx.createGain();
      var end = envelope(g, t, peak, attack, tau);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(end);
    }

    function hiss(dest, t, o) {
      var peak = o.peak != null ? o.peak : 0.2;
      var attack = o.attack != null ? o.attack : 0.002;
      var tau = o.tau != null ? o.tau : 0.02;
      var f = o.f != null ? o.f : 2000;
      var sweep = o.sweep != null ? o.sweep : 0.2;
      var src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      var filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = o.q != null ? o.q : 1;
      filter.frequency.setValueAtTime(f, t);
      if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, t + sweep);
      var g = ctx.createGain();
      var end = envelope(g, t, peak, attack, tau);
      src.connect(filter);
      filter.connect(g);
      g.connect(dest);
      src.start(t, Math.random() * 0.5);
      src.stop(end);
    }

    // Glockenspiel: die unharmonischen Teiltöne eines frei schwingenden
    // Metallstabs (1 : 2,76 : 5,4 : 8,93), die hohen klingen schneller ab.
    // len < 1 klingt kürzer – für Töne, die oft kommen.
    function bell(dest, midi, t, v, len) {
      if (v == null) v = 1;
      if (len == null) len = 1;
      var f = hz(midi);
      var k = len * Math.pow(1000 / f, 0.3);
      tone(dest, f, t, { peak: 0.4 * v, attack: 0.001, tau: 0.85 * k });
      tone(dest, f * 2.76, t, { peak: 0.14 * v, attack: 0.001, tau: 0.32 * k });
      tone(dest, f * 5.4, t, { peak: 0.07 * v, attack: 0.001, tau: 0.14 * k });
      tone(dest, f * 8.93, t, { peak: 0.03 * v, attack: 0.001, tau: 0.07 * k });
      hiss(dest, t, { peak: 0.05 * v, tau: 0.003, f: 7500, q: 1.5 });
    }

    // Akkord leicht gezupft statt auf einen Schlag: klingt weicher und
    // vermeidet Spitzen, wenn alle Töne zugleich einsetzen.
    function chord(dest, midis, t, v) {
      midis.forEach(function (m, i) { bell(dest, m, t + i * 0.012, v); });
    }

    // Glitzer: ein paar hohe Töne zufällig verteilt, wie Konfetti.
    function sparkle(dest, t, span, count, peak) {
      for (var i = 0; i < count; i++) {
        bell(dest, pickOne([93, 95, 98, 100, 102, 105]), t + Math.random() * span, peak * (0.6 + Math.random() * 0.4));
      }
    }

    // Holz: kurzer Ton, der minimal zu hoch einsetzt, dazu das Klicken des Schlägels.
    function wood(dest, f, t, peak, tau) {
      tone(dest, f, t, { peak: peak, attack: 0.001, tau: tau, from: 1.25, glide: 0.012 });
      hiss(dest, t, { peak: peak * 0.35, tau: 0.004, f: Math.min(f * 2.2, 8000), q: 2 });
    }

    // Eine Flamme faucht kurz auf (Kombo, Serie).
    function flame(dest, t, v) {
      hiss(dest, t, { peak: 0.24 * v, attack: 0.1, tau: 0.09, f: 450, to: 2200, sweep: 0.25, q: 0.9 });
    }

    // Plopp: ein Ton, der blitzschnell nach oben gleitet – etwas erscheint.
    function pop(dest, t, peak) {
      tone(dest, 1050, t, { peak: peak, attack: 0.002, tau: 0.035, from: 0.45, glide: 0.04 });
    }

    // Ein metallisches Klacken, wie ein Schloss.
    function latch(dest, t, f) {
      hiss(dest, t, { peak: 0.45, tau: 0.005, f: f, q: 4 });
      tone(dest, f * 0.75, t, { peak: 0.08, attack: 0.001, tau: 0.012 });
    }

    // Weicher Klangteppich aus leicht verstimmten Dreiecksschwingungen.
    function pad(dest, midis, t, o) {
      var lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1800;
      lowpass.Q.value = 0.5;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(1, t + o.attack);
      g.gain.setValueAtTime(1, t + o.attack + o.hold);
      g.gain.setTargetAtTime(0, t + o.attack + o.hold, o.release / 4);
      lowpass.connect(g);
      g.connect(dest);
      var end = t + o.attack + o.hold + o.release * 2;
      midis.forEach(function (m) {
        [-7, 7].forEach(function (cents) {
          var osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.value = hz(m);
          osc.detune.value = cents;
          var og = ctx.createGain();
          og.gain.value = o.peak;
          osc.connect(og);
          og.connect(lowpass);
          osc.start(t);
          osc.stop(end);
        });
      });
    }

    // Jeder Klang plant ab Zeitpunkt t und gibt seine Länge in Sekunden zurück.
    var SOUNDS = {
      // Zwei Töne aufwärts, mit dem ✓. Bei Treffern in Folge klettert step die
      // Leiter hoch (ein Fehler setzt zurück); flame: die Kombo-Flamme erscheint.
      richtig: function (t, o) {
        var ch = channel(0.16, 0.5);
        var s = Math.max(0, Math.min(o.step || 0, 5));
        var v = 1 - s * 0.05; // hohe Töne wirken lauter: leicht ausgleichen
        bell(ch, LADDER[3 + s], t, 0.75 * v, 0.6);
        bell(ch, LADDER[5 + s], t + 0.075, v, 0.6);
        if (o.flame) flame(ch, t + 0.02, 0.8);
        return 0.55;
      },
      // Ein einzelner, gedämpfter Holzton: sagt nur „angekommen“, wertet nicht.
      falsch: function (t) {
        wood(channel(0.06, 0.62), 300, t, 0.4, 0.06);
        return 0.3;
      },
      // Paare finden: Antippen klickt leise wie Holz …
      paarTipp: function (t) {
        wood(channel(0.04, 1.4), 1500, t, 0.16, 0.025);
        return 0.15;
      },
      // … jedes gefundene Paar (k = 0, 1, …) klingt einen Ton höher, das
      // letzte von n schließt den Akkord.
      paar: function (t, o) {
        var k = o.k || 0;
        var n = o.n != null ? o.n : 3;
        var ch = channel(0.2, 0.75);
        bell(ch, PAIRS[Math.min(k, PAIRS.length - 1)], t, 0.9, 0.7);
        if (k < n - 1) return 0.6;
        chord(ch, PAIRS.slice(0, n), t + 0.16, 0.32);
        sparkle(ch, t + 0.2, 0.5, 4, 0.07);
        return 1.3;
      },
      // Feier-Screen (Stufe 3): ein Lauf aufwärts, der Akkord fällt genau mit
      // dem Konfetti (380 ms), danach glitzert es nach.
      lektion: function (t) {
        var ch = channel(0.22);
        [74, 78, 81, 86].forEach(function (m, i) { bell(ch, m, t + i * 0.085, 0.75 + i * 0.05); });
        var hit = t + 0.38;
        chord(ch, [86, 90, 93], hit, 0.55);
        bell(ch, 98, hit + 0.01, 0.45);
        sparkle(ch, hit + 0.08, 0.7, 6, 0.07);
        return 1.8;
      },
      // Unter 60 %: keine Fanfare, nur ein warmer Akkord – wie das fehlende Konfetti.
      lektionSanft: function (t) {
        var ch = channel(0.25, 0.78);
        [74, 81, 86].forEach(function (m, i) { bell(ch, m, t + i * 0.03, 0.5); });
        return 1.2;
      },
      // Neues Abzeichen (Stufe 4): Lauf über einem Klangteppich, Glitzer beim
      // Lichtstreif über die Medaille (350 ms) und beim großen Konfetti (420 ms).
      abzeichen: function (t) {
        var ch = channel(0.3, 1.1);
        pad(ch, [62, 66, 69, 74], t, { attack: 0.3, hold: 1, release: 1, peak: 0.05 });
        [86, 90, 93, 98, 102].forEach(function (m, i) { bell(ch, m, t + 0.05 + i * 0.07, 0.42 + i * 0.04); });
        [105, 102, 100, 98, 95, 93].forEach(function (m, i) { bell(ch, m, t + 0.36 + i * 0.03, 0.12); });
        chord(ch, [74, 81, 86, 90], t + 0.42, 0.4);
        sparkle(ch, t + 0.5, 1, 8, 0.06);
        return 2.6;
      },
      // Tagesziel voll (Stufe 3): Der Ring füllt sich, zugleich ploppt die
      // Krone. Ein schneller Lauf aufwärts, der Akkord trifft den Höhepunkt
      // des Ploppens, dazu glitzert das kleine Konfetti.
      tagesziel: function (t) {
        var ch = channel(0.2);
        [74, 76, 78, 81, 83].forEach(function (m, i) { bell(ch, m, t + i * 0.03, 0.3 + i * 0.07); });
        var top = t + 0.15;
        pop(ch, top, 0.22);
        chord(ch, [86, 90, 93], top, 0.45);
        sparkle(ch, top + 0.05, 0.4, 3, 0.06);
        return 1.1;
      },
      // Bonus abholen (Stufe 2): Klimpern beim Tippen, dann schwirren die
      // Funken zum XP-Chip. Ihre Flugzeit ist zufällig (0,7–1 s), der Klang
      // landet nach 0,85 s.
      bonus: function (t) {
        var ch = channel(0.22, 0.8);
        bell(ch, 93, t, 0.5);
        bell(ch, 98, t + 0.075, 0.7);
        for (var i = 0; i < 7; i++) bell(ch, pickOne([98, 100, 102, 105]), t + 0.15 + i * 0.045, 0.09);
        hiss(ch, t + 0.15, { peak: 0.035, attack: 0.3, tau: 0.12, f: 2500, to: 6000, sweep: 0.6, q: 2 });
        var land = t + 0.85;
        pop(ch, land, 0.12);
        bell(ch, 98, land, 0.5);
        bell(ch, 102, land + 0.07, 0.4);
        return 1.4;
      },
      // Station frei (Lernpfad): Das Schloss klackt bei jedem Wackeln, nach
      // 420 ms ploppt die Station in Granat auf.
      stationFrei: function (t) {
        var ch = channel(0.12);
        latch(ch, t + 0.1, 3400);
        latch(ch, t + 0.21, 2700);
        pop(ch, t + 0.42, 0.28);
        bell(ch, 86, t + 0.43, 0.6);
        return 1;
      },
      // Einheit geschafft (Stufe 4): ein kleines Erkennungsmotiv, kurz, kurz,
      // lang. Der volle Akkord kommt nach 0,55 s – zusammen mit dem Konfetti.
      einheit: function (t) {
        var ch = channel(0.26, 1.1);
        bell(ch, 86, t, 0.7);
        bell(ch, 86, t + 0.12, 0.7);
        bell(ch, 93, t + 0.24, 0.9);
        bell(ch, 98, t + 0.24, 0.35);
        var hit = t + 0.55;
        pad(ch, [62, 69, 74, 78], hit - 0.05, { attack: 0.08, hold: 0.6, release: 0.9, peak: 0.03 });
        chord(ch, [74, 81, 86, 90, 98], hit, 0.42);
        sparkle(ch, hit + 0.05, 0.9, 7, 0.06);
        return 2.4;
      },
      // Serie verlängert (Erfolge): Die Flamme faucht auf, der heutige Punkt
      // der Woche ploppt mit zwei Tönen.
      serie: function (t) {
        var ch = channel(0.2);
        flame(ch, t, 1);
        var p = t + 0.12;
        pop(ch, p, 0.2);
        bell(ch, 81, p, 0.55);
        bell(ch, 86, p + 0.09, 0.7);
        return 1;
      },
    };

    return {
      play: function (name, t, opts) {
        var make = SOUNDS[name];
        return make ? make(t, opts || {}) : 0;
      },
    };
  }

  var SOUND_NAMES = ['richtig', 'falsch', 'paarTipp', 'paar', 'lektion', 'lektionSanft', 'abzeichen',
    'tagesziel', 'bonus', 'stationFrei', 'einheit', 'serie'];
  var audio = null;    // AudioContext – erst beim ersten Klang oder Antippen
  var engine = null;
  var touched = false; // gab es schon eine Berührung? Vorher lässt der Browser keinen Ton zu
  var quietAt = 0;     // Zeit im AudioContext, zu der der letzte Klang verklungen ist
  var sleepTimer = 0;

  function wakeAudio() {
    if (!audio) {
      audio = new AC();
      engine = soundEngine(audio);
    }
    if (audio.state !== 'running') audio.resume().catch(function () {});
  }

  // Ein laufender AudioContext hält am Handy die Audio-Hardware wach und kostet
  // Akku – nach dem letzten Ton schläft er deshalb wieder ein.
  function sleepLater(seconds) {
    clearTimeout(sleepTimer);
    sleepTimer = setTimeout(function () {
      if (audio.state === 'running') audio.suspend().catch(function () {});
    }, seconds * 1000);
  }

  // sound('richtig', { step, flame }) · sound('paar', { k, n }) · sound('lektion') …
  // Ein Fehler beim Abspielen darf nie die Übung aufhalten – dann bleibt es still.
  // Vor der ersten Berührung (etwa wenn eine Seite direkt mit einer Feier
  // startet) bleibt es ebenfalls still: Der Browser hielte den Ton sonst
  // zurück und holte ihn beim nächsten Tippen verspätet nach.
  function sound(name, opts) {
    if (!touched || !soundOn()) return;
    try {
      wakeAudio();
      var start = audio.currentTime + 0.02;
      quietAt = Math.max(quietAt, start + engine.play(name, start, opts));
      sleepLater(quietAt - audio.currentTime + 3); // + Nachklang
    } catch (e) {
      if (window.console) console.warn('Klang konnte nicht abgespielt werden:', e);
    }
  }

  // Am iPhone darf Web Audio erst nach einer Berührung starten. Jede Berührung
  // weckt den Klang deshalb vorsorglich – so klingen auch die Feiern, die
  // zeitversetzt nach dem letzten Tippen kommen.
  function wakeOnTouch() {
    touched = true;
    if (!soundOn()) return;
    try {
      wakeAudio();
      sleepLater(Math.max(0, quietAt - audio.currentTime) + 3);
    } catch (e) {
      // ohne Klang geht es auch
    }
  }
  ['click', 'touchend', 'keydown'].forEach(function (type) {
    window.addEventListener(type, wakeOnTouch, { capture: true, passive: true });
  });

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
    sound: sound,
    sounds: SOUND_NAMES,
    soundOn: soundOn,
    soundSupported: soundSupported,
    soundEngine: soundEngine,
  };
  window.AlefBeth = Object.assign(window.AlefBeth || {}, api);

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function () { hydrate(doc); });
  } else {
    hydrate(doc);
  }
})();
