/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { useState } from 'react';
import { Plus, BookOpen, Calendar, Edit, Trash2, X, Loader2, Upload, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
// 💡 RTK Query হুক থেকে refetch বের করুন
import { useGetMyProfileQuery } from '@/app/redux/features/apis/auth-api';
import Cookies from 'js-cookie';

export default function EducationTab() {
  // 💡 refetch ব্যবহার করে API রিফ্রেশ করা হবে
  const { data: profile, isLoading, refetch } = useGetMyProfileQuery(undefined);

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // লোডিং স্টেট
  
  const [formData, setFormData] = useState({ 
    degree: '', 
    institution: '', 
    year: '', 
    result: '', 
    certificateUrls: [] as string[] 
  });
  
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const educations = profile?.educationDetails || [];

  const handleEditClick = (index: number, edu: any) => {
    setEditingIndex(index);
    setFormData({
      degree: edu.degree || '',
      institution: edu.institution || '',
      year: edu.year || '',
      result: edu.result || '',
      certificateUrls: edu.certificateUrls || [],
    });
    setCertificateFiles([]); 
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ degree: '', institution: '', year: '', result: '', certificateUrls: [] });
    setCertificateFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setCertificateFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingUrl = async (urlIndex: number) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই সার্টিফিকেটটি মুছে ফেলতে চান?")) return;
    
    const updatedFormData = {
      ...formData,
      certificateUrls: formData.certificateUrls.filter((_, i) => i !== urlIndex)
    };
    setFormData(updatedFormData);

    const updatedEducations = [...educations];
    if (editingIndex !== null) {
      updatedEducations[editingIndex] = updatedFormData;
    }

    try {
      setIsUpdating(true);
      const formDataObj = new FormData();
      formDataObj.append('educationDetails', JSON.stringify(updatedEducations));
      
      // এখানে editingIndex পাঠানো জরুরি
      formDataObj.append('editingIndex', editingIndex !== null ? editingIndex.toString() : 'null');

      const token = Cookies.get('token') || localStorage.getItem('token'); 

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (!res.ok) throw new Error('মুছে ফেলতে সমস্যা হয়েছে');
      
      toast.success('ফাইলটি সফলভাবে মুছে ফেলা হয়েছে!');
      
      // ডাটা রিফ্রেশ করা
      await refetch(); 

    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে!');
      setFormData(formData); 
    } finally {
      setIsUpdating(false);
    }
  };

    // 💡 সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const newEdu = { ...formData };
      let updatedEducations;
      
      if (editingIndex !== null) {
        updatedEducations = [...educations];
        updatedEducations[editingIndex] = newEdu;
      } else {
        updatedEducations = [...educations, newEdu];
      }

      const formDataObj = new FormData();
      formDataObj.append('educationDetails', JSON.stringify(updatedEducations));
      formDataObj.append('editingIndex', editingIndex !== null ? editingIndex.toString() : 'null');

      // নতুন ফাইল থাকলে যুক্ত করা
      if (certificateFiles.length > 0) {
        certificateFiles.forEach((file) => {
          formDataObj.append('files', file); 
        });
      }

      const token = Cookies.get('token') || localStorage.getItem('token'); 

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // ⚠️ Content-Type দিবেন না
        },
        body: formDataObj,
      });

      if (!res.ok) throw new Error('আপডেট ব্যর্থ হয়েছে!');
      
      toast.success('তথ্য সফলভাবে আপডেট হয়েছে!');
      handleCancel();
      await refetch(); // নতুন ডাটা লোড

    } catch (error: any) {
      toast.error(error.message || 'সমস্যা হয়েছে!');
    } finally {
      setIsUpdating(false);
    }
  };

  // 💡 সম্পূর্ণ এডুকেশন ডিলিট হ্যান্ডলার
  const handleDelete = async (index: number) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই শিক্ষাগত তথ্যটি সম্পূর্ণ মুছে ফেলতে চান?")) return;
    setIsUpdating(true);

    try {
      const updatedEducations = educations.filter((_: any, i: number) => i !== index);
      
      const formDataObj = new FormData();
      formDataObj.append('educationDetails', JSON.stringify(updatedEducations));

      const token = Cookies.get('token') || localStorage.getItem('token'); 
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      if (!res.ok) throw new Error('মুছে ফেলতে সমস্যা হয়েছে');
      
      toast.success('তথ্য সফলভাবে মুছে ফেলা হয়েছে!');
      await refetch();
      
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে!');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* ... আপনার আগের UI কোডগুলো (হুবহু একই থাকবে) ... */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Educational Qualifications</h2>
        <button 
          onClick={() => { handleCancel(); setIsAdding(true); }}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Education
        </button>
      </div>

      {isAdding && (
        <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-5 mb-4 relative animate-in slide-in-from-top-2">
          <button onClick={handleCancel} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5"/>
          </button>
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            {editingIndex !== null ? 'তথ্য পরিবর্তন করুন' : 'নতুন শিক্ষাগত তথ্য যোগ করুন'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">ডিগ্রির নাম *</label>
              <select 
                required 
                value={formData.degree} 
                onChange={(e) => setFormData({...formData, degree: e.target.value})} 
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 bg-white"
              >
                <option value="">বাছাই করুন</option>
                <option value="SSC">এসএসসি (SSC)</option>
                <option value="HSC">এইচএসসি (HSC)</option>
                <option value="Honors">অনার্স (Honors)</option>
                <option value="Masters">মাস্টার্স (MSC/Masters)</option>
                <option value="Diploma">ডিপ্লোমা (Diploma)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">প্রতিষ্ঠানের নাম *</label>
              <input type="text" placeholder="যেমন: Dhaka College" required value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">পাসের সাল *</label>
              <input type="text" placeholder="যেমন: 2020 - 2024" required value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">ফলাফল *</label>
              <input type="text" placeholder="যেমন: CGPA 3.50" required value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            
            {/* মাল্টিপল সার্টিফিকেট আপলোড */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">সার্টিফিকেট আপলোড (একাধিক ফাইল)</label>
              <div className="mt-1">
                <label className="flex w-max cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-600 transition">
                  <Upload className="h-4 w-4" /> 
                  ফাইল সিলেক্ট করুন
                  <input type="file" accept=".pdf,image/*" multiple className="hidden" onChange={handleFileChange} />
                </label>

                {/* সিলেক্ট করা নতুন ফাইলগুলোর প্রিভিউ */}
                {certificateFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {certificateFiles.map((file, idx) => {
                      const isImage = file.type.startsWith('image/');
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">
                          <div className="flex items-center gap-2 truncate">
                            {isImage ? (
                              <img src={URL.createObjectURL(file)} alt="preview" className="h-8 w-8 rounded object-cover border border-slate-100" />
                            ) : (
                              <FileText className="h-5 w-5 text-emerald-600 flex-none" />
                            )}
                            <span className="text-emerald-600 font-medium truncate">{file.name}</span>
                          </div>
                          <button type="button" onClick={() => removeSelectedFile(idx)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* আগে থেকে আপলোড করা ফাইলগুলোর লিস্ট */}
                {formData.certificateUrls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 mb-1">পূর্বে আপলোড করা সার্টিফিকেট:</p>
                    {formData.certificateUrls.map((url, idx) => {
                      const isPdf = url.toLowerCase().endsWith('.pdf');
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg w-max gap-4">
                          <a href={url} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline flex items-center gap-1 font-medium text-sm">
                            {isPdf ? <FileText className="h-4 w-4 text-rose-500"/> : <ImageIcon className="h-4 w-4 text-blue-500"/>}
                            সার্টিফিকেট {idx + 1} দেখুন
                          </a>
                          {/* 💡 পুরোনো ফাইল ডিলিট করার বাটন */}
                          <button type="button" onClick={() => removeExistingUrl(idx)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" disabled={isUpdating}
              className="md:col-span-2 mt-2 flex justify-center items-center rounded-lg bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition disabled:opacity-70"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingIndex !== null ? 'আপডেট করুন' : 'সেভ করুন')}
            </button>
          </form>
        </div>
      )}

      {/* লিস্ট ভিউ */}
      <div className="space-y-3">
        {educations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            কোনো শিক্ষাগত তথ্য যোগ করা হয়নি।
          </div>
        ) : (
          educations.map((edu: any, index: number) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-600 flex-none">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-sm font-medium text-slate-600">{edu.institution}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> {edu.year}</span>
                    <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{edu.result}</span>
                    
                    {/* একাধিক সার্টিফিকেট ডিসপ্লে */}
                    {edu.certificateUrls && edu.certificateUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {edu.certificateUrls.map((url: string, i: number) => {
                          const isPdf = url.toLowerCase().endsWith('.pdf');
                          
                          return isPdf ? (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-rose-600 hover:underline font-semibold bg-rose-50 px-2 py-1 rounded border border-rose-100">
                              <FileText className="h-3.5 w-3.5" /> PDF {i + 1}
                            </a>
                          ) : (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className="relative group block">
                              <img src={url} alt={`cert-${i}`} className="h-10 w-10 object-cover rounded border border-slate-200" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded">
                                <ExternalLink className="h-4 w-4 text-white" />
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 self-end md:self-center">
                <button onClick={() => handleEditClick(index, edu)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(index)} disabled={isUpdating} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition disabled:opacity-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}