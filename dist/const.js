//#region src/base/const.ts
const BREAK = "-.../.-././.-/-.-";
const CONTINUE = void 0;
const nif = () => void 0;
const nip = new Promise(nif);
const MAX = "MAX";
const MIN = "MIN";
const OPTIONAL = false;
const REQUIRED = !OPTIONAL;
const INCR = "INCR";
const DECR = "DECR";
const ZeroValues = [
	null,
	"",
	void 0,
	0,
	0n,
	0,
	"0",
	"0.0",
	"0.00",
	"0000-00-00",
	"00:00:00",
	"0000-00-00 00:00:00"
];

//#endregion
export { BREAK, CONTINUE, DECR, INCR, MAX, MIN, OPTIONAL, REQUIRED, ZeroValues, nif, nip };