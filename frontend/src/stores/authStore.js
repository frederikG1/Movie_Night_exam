import { writable } from "svelte/store";

export const isLoggedIn = writable(null);

//Both Nav and protected pages knows if user is logged in without passing props around