import { atom } from "jotai";

export const conversationAtom = atom<{ question: string; answer: string; source: string[] }[]>([]);
export const answerAtom = atom("");
export const sourceAtom = atom([]);
export const tocAtom = atom(false);
export const questionAtom = atom("");
export const searchAtom = atom(true);
export const languageAtom = atom("english");
export const loadingAtom = atom(false);
export const errorAtom = atom("");
export const selectedDocAtom = atom<string | null>("");
export const docSelectStateAtom = atom("");
