import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

class ViewTransitionController {
  private current:
    | {
        id: string;
        promise: Promise<void>;
        resolve?: () => void;
      }
    | undefined = undefined;

  public startTransition(
    id: string,
    cb: () => void,
    onFinish: () => void,
    { wait }: { wait?: boolean } = {}
  ) {
    if (!document.startViewTransition) {
      cb();
      onFinish();
      return;
    }

    console.log('start transition:', id);
    if (!wait) {
      this.current = undefined;
      return document.startViewTransition(() => {
        console.log('immediate transition:', id);
        cb();
        onFinish();
      });
    }
    this.current = {
      id,
      promise: new Promise<void>((res) => {
        if (this.current) {
          this.current.resolve = res;
        }
      }),
    };
    return document.startViewTransition(async () => {
      console.log('delayed transition:', id);
      cb();
      console.log('delayed transition complete:', id);
      if (this.current?.promise) {
        await this.current?.promise;
        console.log('promise awaited:', id);
      }
      this.current = undefined;
      console.log('delayed transition completerer:', id);
      onFinish();
      console.log('finish transition:', id);
    });
  }

  public resolve(id: string) {
    if (this.current?.id === id && this.current.resolve) {
      this.current.resolve();
    }
  }
}

const controller = new ViewTransitionController();

interface ViewTransitionOptions {
  onPrepare?: () => void;
  onCleanup?: () => void;
  wait?: boolean;
  markAsCompleted?: boolean;
}

export const useViewTransition = (
  id: string,
  { onPrepare, onCleanup, wait, markAsCompleted }: ViewTransitionOptions
) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (markAsCompleted) {
      controller.resolve(id);
    }
  }, [markAsCompleted]);

  return {
    startTransition: (cb: () => void) => {
      onPrepare?.();
      setIsTransitioning(true);
      setTimeout(() => {
        controller.startTransition(id, cb, () => setIsTransitioning(false), {
          wait,
        });
      }, 1000);
    },
    isTransitioning,
  };
};
