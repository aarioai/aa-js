export type t_loopsignal = Symbol | void
// a signal from callback function to break forEach((value,key)) iterator
export const BREAK: t_loopsignal = Symbol.for('BREAK')  // Morse code of BREAK
export const CONTINUE: t_loopsignal = Symbol.for('CONTINUE')  // return Continue in a loop is not important, but better for people to read







