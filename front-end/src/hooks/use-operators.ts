import { useContext} from 'react';
import { OperatorContext, OperatorContextType } from '@/context/operator-context.tsx';

export const useOperators = (): OperatorContextType => {
  const context = useContext(OperatorContext);
  if (context === undefined) {
    throw new Error('useOperators must be used within an OperatorProvider');
  }
  return context;
};