'use client';
import { useState } from 'react';
import { Save, Wallet, Phone, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Demo Settings State
  const [settings, setSettings] = useState({
    smsFee: 15,
    tiers: [100, 180, 250, 310, 360],
    extraPer: 50,
    helpline: '01700000000',
    methods: [
      { id: 'bkash', name: 'বিকাশ', number: '01700-000000', type: 'পার্সোনাল', active: true },
      { id: 'nagad', name: 'নগদ', number: '01700-000000', type: 'পার্সোনাল', active: true },
      { id: 'rocket', name: 'রকেট', number: '01700-0000000', type: 'পার্সোনাল', active: false },
    ]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">সেটিংস</h1>
        <p className="text-sm text-slate-500">প্লাটফর্মের ফি, পেমেন্ট নম্বর ও অ্যাডমিন সেটিংস পরিবর্তন করুন।</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Row 1: Fees & Payment Methods */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Card 1: Fee Settings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Wallet className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">ফি সেটিংস</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">SMS চার্জ (প্রতি পদে, টাকা)</label>
                <input
                  type="number"
                  value={settings.smsFee}
                  onChange={(e) => setSettings({ ...settings, smsFee: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">সার্ভিস চার্জ (মোট, পদ সংখ্যা অনুযায়ী)</label>
                <div className="grid grid-cols-5 gap-2">
                  {settings.tiers.map((tier, i) => (
                    <div key={i}>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500">{i + 1}টি পদ</label>
                      <input
                        type="number"
                        value={tier}
                        onChange={(e) => {
                          const newTiers = [...settings.tiers];
                          newTiers[i] = Number(e.target.value);
                          setSettings({ ...settings, tiers: newTiers });
                        }}
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm text-center outline-none focus:border-brand-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">৫টির বেশি হলে প্রতি অতিরিক্ত পদে (৳)</label>
                <input
                  type="number"
                  value={settings.extraPer}
                  onChange={(e) => setSettings({ ...settings, extraPer: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Payment Methods */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Phone className="h-5 w-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">পেমেন্ট নম্বর</h2>
            </div>
            
            <div className="space-y-4">
              {settings.methods.map((method, i) => (
                <div key={method.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 sm:w-1/3">
                    <input
                      type="checkbox"
                      checked={method.active}
                      onChange={(e) => {
                        const newMethods = [...settings.methods];
                        newMethods[i].active = e.target.checked;
                        setSettings({ ...settings, methods: newMethods });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm font-bold text-slate-900">{method.name}</span>
                  </div>
                  <input
                    type="text"
                    value={method.number}
                    onChange={(e) => {
                      const newMethods = [...settings.methods];
                      newMethods[i].number = e.target.value;
                      setSettings({ ...settings, methods: newMethods });
                    }}
                    placeholder="নম্বর"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-400"
                  />
                  <select
                    value={method.type}
                    onChange={(e) => {
                      const newMethods = [...settings.methods];
                      newMethods[i].type = e.target.value;
                      setSettings({ ...settings, methods: newMethods });
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-400"
                  >
                    <option value="পার্সোনাল">পার্সোনাল</option>
                    <option value="এজেন্ট">এজেন্ট</option>
                    <option value="মার্চেন্ট">মার্চেন্ট</option>
                  </select>
                </div>
              ))}

              <div className="pt-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">হেল্পলাইন নম্বর</label>
                <input
                  type="text"
                  value={settings.helpline}
                  onChange={(e) => setSettings({ ...settings, helpline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Security */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">অ্যাডমিন সিকিউরিটি</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">নতুন পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="খালি রাখলে আগেরটাই থাকবে"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">পাসওয়ার্ড নিশ্চিত করুন</label>
              <input
                type="password"
                placeholder="আবার পাসওয়ার্ড দিন"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-70"
          >
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}
          </button>
        </div>

      </form>
    </div>
  );
}