// Brücke zu den Design-System-Helfern: js/alefbeth.js (klassisches Skript,
// in index.html vor app.js geladen) legt window.AlefBeth an. Die Module
// importieren von hier, statt überall auf window zuzugreifen.

export const {
  icon, hydrate, replay, countUp, setProgress, ring,
  confetti, sparks, xp, feedback, toast, swap, reducedMotion,
} = window.AlefBeth;
