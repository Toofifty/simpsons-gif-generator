import { createContext, useContext } from 'react';
import { useGenerator } from './useGenerator';

export const GeneratorContext = createContext<ReturnType<typeof useGenerator>>(
  undefined!
);

export const useGeneratorContext = () => useContext(GeneratorContext);
