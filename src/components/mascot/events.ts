export const CAPY_SUCCESS = "sirs:capy-success";

export function celebrateWithCapy() {
    window.dispatchEvent(new Event(CAPY_SUCCESS));
}
