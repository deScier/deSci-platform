declare module 'embla-carousel/react' {
  interface EmblaEventType {
    'autoScroll:play': () => void;
    'autoScroll:stop': () => void;
    reInit: () => void;
  }
}
