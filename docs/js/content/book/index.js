// Every question from the study guide (reworded), grouped into sets in book order per module.
import m1 from './m1.js'; import m2 from './m2.js'; import m3 from './m3.js'; import m4 from './m4.js';
import m5 from './m5.js'; import m6 from './m6.js'; import m7 from './m7.js';

export const BOOK = [...m1, ...m2, ...m3, ...m4, ...m5, ...m6, ...m7];
export const bookSet = id => BOOK.find(s => s.id === id);
export const bookSetsForModule = mod => BOOK.filter(s => s.mod === mod);
export const KIND = {
  byb: { icon: '🌱', name: 'Before you begin', tip: 'Warm-up: try before (or while) doing the lessons' },
  question: { icon: '❓', name: 'In-module question', tip: 'Do after the lessons it covers' },
  quick: { icon: '⚡', name: 'Quick revision', tip: 'Do after the lessons it covers' },
  revision: { icon: '🏁', name: 'Revision questions', tip: 'End-of-module test, exam style' },
};
