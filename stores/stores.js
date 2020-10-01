import { writable } from 'svelte/store';

export const activeDevice = writable(0);
export const devices = writable([]);