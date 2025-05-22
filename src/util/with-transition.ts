export const withTransition = <T extends unknown[]>(
  fn: (...args: T) => void
) => {
  return (...args: T) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => fn(...args));
      return;
    }

    fn(...args);
  };
};

export const runTransition = (fn: () => void) => withTransition(fn)();
