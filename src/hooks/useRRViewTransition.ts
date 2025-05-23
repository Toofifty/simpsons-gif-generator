import { useContext } from 'react';
import { UNSAFE_ViewTransitionContext } from 'react-router-dom';

type MinimalLocation = {
  pathname: string;
  search: string;
};

const matchLocation = (l1: MinimalLocation, l2: MinimalLocation) => {
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

interface RRViewTransitionOptions {
  location: {
    pathname: string;
    search: string;
  };
  match: 'from' | 'to' | 'both';
  matcher?: (l1: MinimalLocation, l2: MinimalLocation) => boolean;
}

export const useRRViewTransition = ({
  location,
  match,
  matcher = matchLocation,
}: RRViewTransitionOptions) => {
  let matchesFrom = false;
  let matchesTo = false;
  const ctx = useContext(UNSAFE_ViewTransitionContext);
  if (ctx.isTransitioning) {
    matchesFrom =
      (match === 'from' || match === 'both') &&
      matcher(location, ctx.currentLocation);
    matchesTo =
      (match === 'to' || match === 'both') &&
      matcher(location, ctx.nextLocation);
  }

  return {
    isTransitioning: matchesFrom || matchesTo,
    vt: (viewTransitionName: string) =>
      matchesFrom || matchesTo ? { viewTransitionName } : undefined,
  };
};
