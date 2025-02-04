import { PaymentCard } from '@/components/payment-card.tsx';


export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
    <PaymentCard
      paymentId="123456"
      operatorName="John Doe"
      operatorImage="https://randomuser.me/api/portraits/male/1.jpg"
      amount={100}
    />
    <PaymentCard
      paymentId="123456"
      operatorName="John Doe"
      operatorImage="https://randomuser.me/api/portraits/male/1.jpg"
      amount={100}
    />
    <PaymentCard
      paymentId="123456"
      operatorName="John Doe"
      operatorImage="https://randomuser.me/api/portraits/male/1.jpg"
      amount={100}
    />
    </div>
  );
}
