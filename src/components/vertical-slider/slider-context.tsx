import { createContext, useContext } from 'react';

interface ISliderContext {
  register: (ref: HTMLDivElement, index?: number) => number;
}

export const SliderContext = createContext<ISliderContext>(undefined!);

export const useSliderContext = () => useContext(SliderContext);
