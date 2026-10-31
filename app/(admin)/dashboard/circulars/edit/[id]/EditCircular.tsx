/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Upload, Plus, Trash2, Save, 
  CheckCircle2, Loader2, FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function EditCircular() {
  const router = useRouter();
  const params = useParams();
  const circularId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orgName: '',
    orgEn: '',
    ab: '',
    circularTitle: '',
    location: '',
    startDate: '',
    endDate: '',
    externalLink: '', 
    allowSelfApply: true,
    allowServiceApply: true,
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string>('');

  // 💡 ১. পুরোনো ডাটা লোড করা
  useEffect(() => {
    const fetchCircular = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/circulars/${circularId}`);
        if (!res.ok) throw new Error('সার্কুলার পাওয়া যায়নি');
        
        const data = await res.json();
        
        // তারিখ ফরম্যাট (YYYY-MM-DD)
        const start = data.start ? new Date(data.start).toISOString().split('T')[0] : '';
        const end = data.end ? new Date(data.end).toISOString().split('T')[0] : '';

        setFormData({
          orgName: data.org || '',
          orgEn: data.orgEn || '',
          ab: data.ab || '',
          circularTitle: data.title || '',
          location: data.loc || '',
          startDate: start,
          endDate: end,
          externalLink: data.link || '',
          allowSelfApply: data.allowSelfApply ?? true,
          allowServiceApply: data.allowServiceApply ?? true,
        });

        // পোস্টগুলো সেট করা
        const formattedPosts = data.posts?.map((p: any) => ({
          title: p.n || '',
          vacancies: p.v?.toString() || '',
          grade: p.g || '',
          salary: p.sal || '',
          requirements: p.q || '',
        })) || [];
        
        setPosts(formattedPosts.length > 0 ? formattedPosts : [{ title: '', vacancies: '', grade: '', salary: '', requirements: '' }]);
        
        setExistingPdfUrl(data.pdfUrl || '');

      } catch (error: any) {
        toast.error(error.message);
        router.push('/dashboard/circulars');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCircular();
  }, [circularId, router]);

  const addPostRow = () => {
    setPosts([...posts, { title: '', vacancies: '', grade: '', salary: '', requirements: '' }]);
  };

  const removePostRow = (index: number) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
  };

  const handlePostChange = (index: number, field: string, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    setPosts(newPosts);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  // 💡 ২. আপডেট সাবমিট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      // নতুন ফাইল সিলেক্ট করলে পাঠাবে, না হলে পুরোনোটা থাকবে
      if (pdfFile) {
        data.append('pdf', pdfFile);
      }

      const payload = {
        title: formData.circularTitle,
        org: formData.orgName,
        orgEn: formData.orgEn || formData.orgName.replace(/\s+/g, ''), 
        ab: formData.ab || (formData.orgEn ? formData.orgEn.substring(0, 4).toUpperCase() : 'ORG'), 
        loc: formData.location,
        cat: 'govt', 
        start: formData.startDate,
        end: formData.endDate,
        link: formData.externalLink,
        allowSelfApply: formData.allowSelfApply,
        allowServiceApply: formData.allowServiceApply,
        posts: posts.map(p => ({
          n: p.title,
          v: Number(p.vacancies) || 1,
          g: p.grade,
          sal: p.salary,
          q: p.requirements
        }))
      };

      data.append('data', JSON.stringify(payload));

      const token = Cookies.get('token');
      // 💡 PUT রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/circulars/${circularId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) throw new Error('আপডেট করতে সমস্যা হয়েছে!');

      toast.success('সার্কুলার সফলভাবে আপডেট হয়েছে!');
      router.push('/dashboard/circulars');

    } catch (error: any) {
      toast.error(error.message || 'সার্ভার এরর!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-10">
      
      {/* হেডার */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/circulars" className="grid h-10 w-10 place-items-center rounded-full bg-white border border-slate-200 hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Circular</h1>
          <p className="text-sm text-slate-500">সার্কুলারের তথ্য ও পিডিএফ আপডেট করুন।</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* === ১. বেসিক ইনফরমেশন === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Organization Name (Bangla) *</label>
              <input type="text" required value={formData.orgName} onChange={(e) => setFormData({...formData, orgName: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Organization Name (English)</label>
              <input type="text" value={formData.orgEn} onChange={(e) => setFormData({...formData, orgEn: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Short Name / Abbreviation</label>
              <input type="text" value={formData.ab} onChange={(e) => setFormData({...formData, ab: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Location / District</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Circular Title *</label>
              <input type="text" required value={formData.circularTitle} onChange={(e) => setFormData({...formData, circularTitle: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Application Start Date *</label>
              <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Application End Date *</label>
              <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
            </div>
          </div>
        </div>

        {/* === ২. অ্যাপ্লিকেশন মোড === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4">Application Mode</h2>
          
          <div>
            <label className="text-sm font-semibold text-slate-700">Original Apply Link (Teletalk/Website)</label>
            <input type="url" value={formData.externalLink} onChange={(e) => setFormData({...formData, externalLink: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.allowSelfApply} onChange={(e) => setFormData({...formData, allowSelfApply: e.target.checked})} className="w-4 h-4 text-brand-600 rounded" />
              <span className="text-sm font-medium text-slate-700">ইউজার নিজে আবেদন করতে পারবে</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.allowServiceApply} onChange={(e) => setFormData({...formData, allowServiceApply: e.target.checked})} className="w-4 h-4 text-brand-600 rounded" />
              <span className="text-sm font-medium text-slate-700">আমাদের মাধ্যমে আবেদন করতে পারবে</span>
            </label>
          </div>
        </div>

        {/* === ৩. পিডিএফ আপলোড === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4">Circular PDF / Image</h2>
          
          <div className="flex flex-col gap-3">
            {/* আগের পিডিএফ থাকলে সেটি দেখানোর অপশন */}
            {existingPdfUrl && !pdfFile && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <FileText className="h-5 w-5" /> বর্তমান পিডিএফ আপলোড করা আছে
                </div>
                <a href={existingPdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 underline">দেখুন</a>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition relative">
              <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              {pdfFile ? (
                <div className="text-emerald-600 font-semibold flex flex-col items-center justify-center gap-1">
                  <CheckCircle2 className="h-5 w-5" /> {pdfFile.name}
                  <span className="text-xs text-slate-500">(নতুন ফাইল আপলোড হবে)</span>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-600">পরিবর্তন করতে নতুন পিডিএফ বা ছবি সিলেক্ট করুন</p>
              )}
            </div>
          </div>
        </div>

        {/* === ৪. পদসমূহ === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900">Posts & Vacancies</h2>
            <button type="button" onClick={addPostRow} className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition">
              <Plus className="h-4 w-4" /> Add Post
            </button>
          </div>
          
          {posts.map((post, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 relative mb-4">
              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-600">Post Name *</label>
                <input type="text" required value={post.title} onChange={(e) => handlePostChange(index, 'title', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Vacancies *</label>
                <input type="number" required value={post.vacancies} onChange={(e) => handlePostChange(index, 'vacancies', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-600">Grade & Salary</label>
                <input type="text" value={post.grade} onChange={(e) => handlePostChange(index, 'grade', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-600">Requirements</label>
                <input type="text" value={post.requirements} onChange={(e) => handlePostChange(index, 'requirements', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500" />
              </div>
              
              {posts.length > 1 && (
                <button type="button" onClick={() => removePostRow(index)} className="absolute -right-3 -top-3 bg-white rounded-full p-1.5 shadow-sm text-rose-500 hover:bg-rose-50 border border-slate-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* সাবমিট বাটন */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/dashboard/circulars" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-70 transition">
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</>
            ) : (
              <><Save className="h-4 w-4" /> Update Circular</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}