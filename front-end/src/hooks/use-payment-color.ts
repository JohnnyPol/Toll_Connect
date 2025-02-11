import { useContext} from 'react';
import { PaymentColorsContext, PaymentColorsContextType } from '@/context/payment-colors-context.tsx';

export const usePaymentColors = (): PaymentColorsContextType => {
  const context = useContext(PaymentColorsContext);
  if (!context) {
    throw new Error('usePaymentColors must be used within a ColorSchemeProvider');
  }
  return context;
};