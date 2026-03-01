import { writable } from "svelte/store";

export const isnotAdding = writable(true);
export const isnotprocessing = writable(true);
export const inprogress = writable([]);
export const second = writable('');
export const stoptimer = writable(false);
export const expectedtime = writable('');
export const nowdate = writable('');