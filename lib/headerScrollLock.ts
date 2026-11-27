type HeaderHideAPI = {
  hide: () => void;
  show: () => void;
};

let headerAPI: HeaderHideAPI | null = null;

export const headerScrollLock = {
  // Lock end time. A deadline (instead of a timer that clears a flag) cannot get stuck:
  // browsers delay timers in background tabs, which kept the header ignoring scrolling.
  until: 0,
  timer: null as ReturnType<typeof setTimeout> | null,

  get active() {
    return Date.now() < this.until;
  },

  registerHeader(api: HeaderHideAPI) {
    headerAPI = api;
  },

  unregisterHeader() {
    headerAPI = null;
  },

  lockAndHide(durationMs = 1600) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.until = Date.now() + durationMs;
    headerAPI?.hide();
  },
};