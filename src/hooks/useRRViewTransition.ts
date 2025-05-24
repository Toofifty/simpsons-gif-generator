import { useContext } from 'react';
import { UNSAFE_ViewTransitionContext } from 'react-router-dom';
import { assert } from '../utils';

type MinimalLocation = {
  pathname?: string;
  search?: string;
};

export const matchLocation = (l1: MinimalLocation) => (l2: MinimalLocation) => {
  if (l1.pathname !== l2.pathname) return false;
  const l1Params = new URLSearchParams(l1.search);
  const l2Params = new URLSearchParams(l2.search);
  return (
    l1Params.get('begin') === l2Params.get('begin') &&
    l1Params.get('end') === l2Params.get('end') &&
    l1Params.get('offset') === l2Params.get('offset') &&
    l1Params.get('extend') === l2Params.get('extend')
  );
};

export const matchesGenerator = (location: MinimalLocation) =>
  (location.pathname?.startsWith('/generate') && !!location.search) ?? false;

interface RRViewTransitionOptions {
  location?: MinimalLocation;
  match: 'from' | 'to' | 'both';
  matcher?: (location: MinimalLocation) => boolean;
}

export const useRRViewTransition = ({
  location,
  match,
  matcher,
}: RRViewTransitionOptions) => {
  assert(location || matcher, 'Either location or matcher must be provided');

  const matchFn = matcher ?? matchLocation(location!);

  let matchesFrom = false;
  let matchesTo = false;
  const ctx = useContext(UNSAFE_ViewTransitionContext);
  if (ctx.isTransitioning) {
    matchesFrom =
      (match === 'from' || match === 'both') && matchFn(ctx.currentLocation);
    matchesTo =
      (match === 'to' || match === 'both') && matchFn(ctx.nextLocation);
  }

  return {
    isTransitioning: matchesFrom || matchesTo,
    vt: (viewTransitionName: string) =>
      matchesFrom || matchesTo ? { viewTransitionName } : undefined,
  };
};
