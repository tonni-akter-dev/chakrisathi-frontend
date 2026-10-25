import { AlertCircle, ChevronRight } from 'lucide-react';

const todos = [
  { id: 'CS2310-AB12', name: 'রাকিব হাসান', status: 'পেন্ডিং', why: 'পেমেন্ট ও কাগজ যাচাই করুন', deadline: '২ দিন বাকি', isUrgent: true },
  { id: 'CS2310-CD34', name: 'সাদিয়া আক্তার', status: 'অনুমোদিত', why: 'ইউজার অনুমোদন দিয়েছেন — চূড়ান্ত জমা দিন', deadline: '১ দিন বাকি', isUrgent: true },
  { id: 'CS2310-EF56', name: 'মেহেদী রহমান', status: 'প্রসেসিং', why: 'ফর্ম পূরণ করে রিভিউতে পাঠান', deadline: '৪ দিন বাকি', isUrgent: false },
];

export default function TodoList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 p-5">
        <AlertCircle className="h-5 w-5 text-brand-600" />
        <h3 className="text-base font-bold text-slate-900">এখনই করণীয়</h3>
        <span className="text-xs text-slate-500 font-medium ml-auto">ডেডলাইন অনুযায়ী</span>
      </div>
      <div className="divide-y divide-slate-100">
        {todos.map((todo) => (
          <div key={todo.id} className="flex cursor-pointer items-center gap-4 p-4 hover:bg-slate-50">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              todo.status === 'পেন্ডিং' ? 'bg-amber-100 text-amber-700' :
              todo.status === 'অনুমোদিত' ? 'bg-blue-100 text-blue-700' : 'bg-brand-100 text-brand-700'
            }`}>
              {todo.status}
            </span>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900">
                {todo.id} · {todo.name}
              </div>
              <div className="text-xs text-slate-500">{todo.why}</div>
            </div>
            <div className={`text-xs font-bold ${todo.isUrgent ? 'text-rose-600' : 'text-slate-500'}`}>
              {todo.deadline}
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
}