type HeaderHideAPI = {
  hide: () => void;
  show: () => void;
};

let headerAPI: HeaderHideAPI | null = null;

export const headerScrollLock = {
  active: false,
  timer: null as ReturnType<typeof setTimeout> | null,

  registerHeader(api: HeaderHideAPI) {
    headerAPI = api;
  },

  unregisterHeader() {
    headerAPI = null;
  },

  lockAndHide(durationMs = 1600) {
    if (this.timer) clearTimeout(this.timer);
    this.active = true;
    headerAPI?.hide();

    this.timer = setTimeout(() => {
      this.active = false;
      this.timer = null;
    }, durationMs);
  },
};