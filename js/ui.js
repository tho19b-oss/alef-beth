// Brücke zu den Design-System-Helfern: js/alefbeth.js (klassisches Skript,
// in index.html vor app.js geladen) legt window.AlefBeth an. Die Module
// importieren von hier, statt überall auf window zuzugreifen. Dazu kommen
// zwei App-Helfer, die das Design System nur als Markup beschreibt.

export const {
  icon, hydrate, replay, countUp, setProgress, ring,
  confetti, sparks, xp, feedback, toast, swap, splash, reducedMotion,
} = window.AlefBeth;

// Hebräischer Text als eigener Abschnitt: richtige Schrift, Leserichtung und
// Aussprache für Screenreader, ohne die deutsche Zeile drumherum zu verdrehen.
export function he(text, cls = '') {
  return `<span${cls ? ` class="${cls}"` : ''} lang="he" dir="rtl">${text}</span>`;
}

// Ersatz für confirm(): ein modaler Dialog im Stil des Design Systems.
// Weitermachen ist groß, aufhören leise – bei danger umgekehrt betont, weil
// dort das Bestätigen die folgenschwere Handlung ist. Escape oder ein Tipp
// neben den Dialog brechen ab. Liefert true, wenn bestätigt wurde.
export function confirmDialog({ title, text, art = 'book', confirm, cancel, danger = false }) {
  return new Promise((resolve) => {
    const dlg = document.createElement('dialog');
    dlg.className = `ab-dialog${danger ? ' ab-dialog--danger' : ''}`;
    dlg.setAttribute('aria-labelledby', 'ab-dialog-title');
    dlg.setAttribute('aria-describedby', 'ab-dialog-text');
    dlg.innerHTML = `
      <div class="ab-dialog__art">${icon(art)}</div>
      <h2 class="ab-dialog__title text-heading" id="ab-dialog-title"></h2>
      <p class="ab-dialog__text text-body" id="ab-dialog-text"></p>
      <form method="dialog" class="ab-dialog__actions">
        <button class="ab-btn ${danger ? 'ab-btn--secondary' : ''} text-button" value="cancel" autofocus></button>
        <button class="ab-btn ${danger ? 'ab-btn--danger' : 'ab-btn--ghost ab-btn--danger'} text-button" value="ok"></button>
      </form>`;
    dlg.querySelector('.ab-dialog__title').textContent = title;
    dlg.querySelector('.ab-dialog__text').textContent = text;
    dlg.querySelector('[value="cancel"]').textContent = cancel;
    dlg.querySelector('[value="ok"]').textContent = confirm;

    dlg.addEventListener('click', (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dlg.close('cancel');
    });
    dlg.addEventListener('close', () => {
      resolve(dlg.returnValue === 'ok');
      dlg.remove();
    });
    document.body.append(dlg);
    dlg.showModal();
  });
}
