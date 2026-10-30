/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
// 💡 RTK Query Hook ইমপোর্ট করুন
import { useAddCircularMutation } from "@/app/redux/features/apis/circular-api";

export default function AddCircularPage() {
  const router = useRouter();

  // 💡 RTK Query Mutation Hook
  const [addCircular, { isLoading: isSubmitting }] = useAddCircularMutation();

  // মেইন ফর্ম স্টেট
  const [formData, setFormData] = useState({
    orgName: "",
    orgEn: "",
    circularTitle: "",
    startDate: "",
    endDate: "",
    externalLink: "",
    allowSelfApply: true,
    allowServiceApply: true,
  });

  // ডাইনামিক পোস্ট লিস্ট স্টেট
  const [posts, setPosts] = useState([
    { title: "", vacancies: "", grade: "", salary: "", requirements: "" },
  ]);

  // ফাইল আপলোড স্টেট
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const addPostRow = () => {
    setPosts([
      ...posts,
      { title: "", vacancies: "", grade: "", salary: "", requirements: "" },
    ]);
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

  // 💡 RTK Query দিয়ে সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      if (pdfFile) {
        data.append("pdf", pdfFile);
      }
      const payload = {
        title: formData.circularTitle,
        org: formData.orgName,
        orgEn: formData.orgEn || formData.orgName.replace(/\s+/g, ""),
        ab: formData.orgEn
          ? formData.orgEn.substring(0, 4).toUpperCase()
          : "ORG",
        loc: "সকল জেলা",
        cat: "govt",
        start: formData.startDate,
        end: formData.endDate,
        link: formData.externalLink,
        allowSelfApply: formData.allowSelfApply,
        allowServiceApply: formData.allowServiceApply,
        posts: posts.map((p) => ({
          n: p.title,
          v: Number(p.vacancies) || 1,
          g: p.grade,
          sal: p.salary,
          q: p.requirements,
        })),
      };
      data.append("data", JSON.stringify(payload));

      await addCircular(data).unwrap();

      toast.success("সার্কুলার সফলভাবে পাবলিশ হয়েছে!");
      router.push("/dashboard/circulars");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.data?.error || "সার্ভার এরর! আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-10">
      {/* হেডার */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/circulars"
          className="grid h-10 w-10 place-items-center rounded-full bg-white border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Add New Circular
          </h1>
          <p className="text-sm text-slate-500">
            নতুন চাকরির সার্কুলার ও পিডিএফ যুক্ত করুন।
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* === ১. বেসিক ইনফরমেশন === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Organization Name (Bangla) *
              </label>
              <input
                type="text"
                required
                value={formData.orgName}
                onChange={(e) =>
                  setFormData({ ...formData, orgName: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500"
                placeholder="যেমন: উৎসে কর ব্যবস্থাপনা ইউনিট"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Organization Name (English)
              </label>
              <input
                type="text"
                value={formData.orgEn}
                onChange={(e) =>
                  setFormData({ ...formData, orgEn: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500"
                placeholder="যেমন: WTMU (ঐচ্ছিক)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Circular Title *
              </label>
              <input
                type="text"
                required
                value={formData.circularTitle}
                onChange={(e) =>
                  setFormData({ ...formData, circularTitle: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500"
                placeholder="যেমন: স্টেনোটাইপিস্ট-কাম-কম্পিউটার অপারেটর"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Application Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Application End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* === ২. অ্যাপ্লিকেশন মোড === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4">
            Application Mode
          </h2>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Original Apply Link (Teletalk/Website)
            </label>
            <input
              type="url"
              value={formData.externalLink}
              onChange={(e) =>
                setFormData({ ...formData, externalLink: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500"
              placeholder="https://alljobs.teletalk.com.bd/..."
            />
          </div>

          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowSelfApply}
                onChange={(e) =>
                  setFormData({ ...formData, allowSelfApply: e.target.checked })
                }
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                ইউজার নিজে আবেদন করতে পারবে
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowServiceApply}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowServiceApply: e.target.checked,
                  })
                }
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                আমাদের মাধ্যমে আবেদন করতে পারবে
              </span>
            </label>
          </div>
        </div>

        {/* === ৩. পিডিএফ আপলোড === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 mb-4">
            Upload Circular PDF / Image
          </h2>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition relative">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            {pdfFile ? (
              <div className="text-emerald-600 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> {pdfFile.name}
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-700">
                  ক্লিক করে পিডিএফ বা ছবি আপলোড করুন
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PDF, JPG, PNG (সর্বোচ্চ 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* === ৪. পদসমূহ === */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Posts & Vacancies
            </h2>
            <button
              type="button"
              onClick={addPostRow}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="h-4 w-4" /> Add Post
            </button>
          </div>

          {posts.map((post, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 relative"
            >
              <div className="md:col-span-4">
                <label className="text-xs font-semibold text-slate-600">
                  Post Name *
                </label>
                <input
                  type="text"
                  required
                  value={post.title}
                  onChange={(e) =>
                    handlePostChange(index, "title", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500"
                  placeholder="কম্পিউটার অপারেটর"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">
                  Vacancies *
                </label>
                <input
                  type="number"
                  required
                  value={post.vacancies}
                  onChange={(e) =>
                    handlePostChange(index, "vacancies", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500"
                  placeholder="05"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-600">
                  Grade & Salary
                </label>
                <input
                  type="text"
                  value={post.grade}
                  onChange={(e) =>
                    handlePostChange(index, "grade", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500"
                  placeholder="১৩তম গ্রেড"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-600">
                  Requirements (Short)
                </label>
                <input
                  type="text"
                  value={post.requirements}
                  onChange={(e) =>
                    handlePostChange(index, "requirements", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand-500"
                  placeholder="স্নাতক পাস"
                />
              </div>

              {posts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePostRow(index)}
                  className="absolute -right-3 -top-3 bg-white rounded-full p-1.5 shadow-sm text-rose-500 hover:bg-rose-50 border border-slate-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* সাবমিট বাটন */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/circulars"
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-70 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Publish Circular
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
