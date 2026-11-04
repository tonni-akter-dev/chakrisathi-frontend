'use client';

import { useState } from 'react';
import { Check, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  nidError,
  phoneError,
  uploadFile,
  type ApplicantForm,
  type ApplicationDocuments,
} from '@/utils/applications';

// text-base: মোবাইলে input-এ চাপলে পেজ zoom হয় না
const inputCls =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50';
const labelCls = 'mb-1.5 block text-sm font-bold text-slate-700';

type TextKey = keyof ApplicantForm;

export function PersonalFields({
  form,
  onChange,
}: {
  form: ApplicantForm;
  onChange: (key: TextKey, value: string) => void;
}) {
  const field = (key: TextKey, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, error = '') => (
    <div>
      <label htmlFor={`field-${key}`} className={labelCls}>{label}</label>
      <input
        id={`field-${key}`}
        className={inputCls}
        value={form[key]}
        onChange={(e) => onChange(key, e.target.value)}
        {...extra}
      />
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">{field('name', 'পূর্ণ নাম', { autoComplete: 'name' })}</div>
      {field('father', 'পিতার নাম')}
      {field('mother', 'মাতার নাম')}
      {field('dob', 'জন্ম তারিখ', { type: 'date' })}
      {field('nid', 'NID নম্বর', { inputMode: 'numeric' }, nidError(form.nid))}
      {field('mobile', 'মোবাইল নম্বর', { inputMode: 'tel', autoComplete: 'tel', placeholder: '01XXXXXXXXX' }, phoneError(form.mobile))}
      {field('education', 'সর্বোচ্চ শিক্ষাগত যোগ্যতা')}
      <div className="sm:col-span-2">
        <label htmlFor="field-address" className={labelCls}>ঠিকানা</label>
        <textarea
          id="field-address"
          rows={3}
          className={inputCls}
          value={form.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </div>
    </div>
  );
}

type DocKey = keyof ApplicationDocuments;

export function DocumentFields({
  documents,
  onChange,
  onBusyChange,
}: {
  documents: ApplicationDocuments;
  onChange: (update: (prev: ApplicationDocuments) => ApplicationDocuments) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [uploading, setUploading] = useState<Partial<Record<DocKey, boolean>>>({});

  const setBusy = (key: DocKey, busy: boolean) =>
    setUploading((prev) => {
      const next = { ...prev, [key]: busy };
      onBusyChange?.(Object.values(next).some(Boolean));
      return next;
    });

  const handleFiles = async (key: DocKey, list: FileList | null, multiple: boolean) => {
    if (!list?.length) return;
    setBusy(key, true);
    const results = await Promise.all(
      Array.from(list).map(async (file) => {
        try {
          return await uploadFile(file);
        } catch (error) {
          toast.error(`${file.name}: ${(error as Error).message}`);
          return null;
        }
      }),
    );
    const urls = results.filter((url): url is string => Boolean(url));
    if (urls.length) {
      onChange((prev) => ({
        ...prev,
        [key]: multiple ? [...(prev[key] as string[]), ...urls] : urls[0],
      }));
    }
    setBusy(key, false);
  };

  const remove = (key: DocKey, index?: number) =>
    onChange((prev) => ({
      ...prev,
      [key]: index === undefined ? '' : (prev[key] as string[]).filter((_, i) => i !== index),
    }));

  const uploadBox = (key: DocKey, label: string, hint: string, multiple = false) => {
    const value = documents[key];
    const urls = Array.isArray(value) ? value : value ? [value] : [];
    const isUploading = Boolean(uploading[key]);

    return (
      <div key={key} className="flex flex-col gap-2">
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-dashed p-4 transition ${
            urls.length ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 bg-white hover:border-brand-400'
          }`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className={`grid h-10 w-10 flex-none place-items-center rounded-lg ${urls.length ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : urls.length ? <Check className="h-5 w-5" strokeWidth={3} /> : <Upload className="h-5 w-5" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-800">{label}</span>
              <span className="block text-xs text-slate-500">
                {isUploading ? 'আপলোড হচ্ছে...' : urls.length ? `${urls.length}টি ফাইল আপলোড হয়েছে` : hint}
              </span>
            </span>
          </span>
          <span className={`flex-none rounded-full px-3 py-1 text-xs font-bold ${urls.length ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>
            {urls.length && !multiple ? 'বদলান' : urls.length ? 'আরও যোগ' : 'আপলোড'}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple={multiple}
            className="sr-only"
            disabled={isUploading}
            onChange={(e) => {
              handleFiles(key, e.target.files, multiple);
              e.target.value = '';
            }}
          />
        </label>

        {urls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {urls.map((url, index) => (
              <span key={url} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                <a href={url} target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:underline">
                  ফাইল {index + 1} দেখুন
                </a>
                <button
                  type="button"
                  aria-label={`${label}: ফাইল ${index + 1} সরান`}
                  onClick={() => remove(key, multiple ? index : undefined)}
                  className="rounded p-0.5 text-rose-500 hover:bg-rose-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {uploadBox('photo', 'পাসপোর্ট সাইজ ছবি', 'JPG/PNG, সর্বোচ্চ ৫MB')}
        {uploadBox('signature', 'স্বাক্ষর', 'JPG/PNG, সর্বোচ্চ ৫MB')}
        {uploadBox('nidPhoto', 'NID-এর ছবি', 'JPG/PNG/PDF, একাধিক দেওয়া যাবে', true)}
      </div>
      <div className="border-t border-slate-100 pt-4">
        <h3 className="mb-3 text-sm font-bold text-slate-800">শিক্ষাগত সনদ</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {uploadBox('ssc', 'SSC', 'PDF/JPG', true)}
          {uploadBox('hsc', 'HSC', 'PDF/JPG', true)}
          {uploadBox('graduation', 'স্নাতক', 'PDF/JPG', true)}
          {uploadBox('masters', 'স্নাতকোত্তর', 'PDF/JPG', true)}
        </div>
      </div>
    </div>
  );
}
