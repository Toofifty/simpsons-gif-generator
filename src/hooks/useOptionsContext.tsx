import { createContext, useContext } from 'react';
import { useGenerationOptions } from './useGenerationOptions';

type OptionsContextType = ReturnType<typeof useGenerationOptions>;

export const OptionsContext = createContext<OptionsContextType>(undefined!);

export const useOptionsContext = () => useContext(OptionsContext);
