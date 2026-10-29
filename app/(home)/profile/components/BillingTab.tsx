import { CheckCircle2 } from 'lucide-react';

const transactions = [
  { id: 'TRX-998231', date: '২৪ অক্টো, ২০২৬', amount: '২২৭', method: 'bKash', status: 'Paid' },
  { id: 'TRX-998232', date: '২০ অক্টো, ২০২৬', amount: '১১২', method: 'Nagad', status: 'Paid' },
  { id: 'TRX-998233', date: '১৫ অক্টো, ২০২৬', amount: '১৫০', method: 'Rocket', status: 'Pending' },
];

export default function BillingTab() {
  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-slate-900">Transaction & Billing</h2>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Transaction ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Method</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">{trx.date}</td>
                <td className="px-6 py-4 font-mono text-slate-600">{trx.id}</td>
                <td className="px-6 py-4 text-slate-900">{trx.method}</td>
                <td className="px-6 py-4 font-bold text-slate-900">৳{trx.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    trx.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {trx.status === 'Paid' && <CheckCircle2 className="h-3 w-3" />} {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}