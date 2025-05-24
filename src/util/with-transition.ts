export const withTransition = <T extends unknown[]>(
  fn: (...args: T) => void | Promise<void>
) => {
  return (...args: T) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => fn(...args));
      return;
    }

    fn(...args);
  };
};

export const runTransition = (fn: () => void | Promise<void>) =>
  withTransition(fn)();
