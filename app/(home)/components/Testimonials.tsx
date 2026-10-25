'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const items = [
  {
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'সাদিয়া আক্তার',
    role: 'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক',
    text: 'গ্রাম কম্পিউটার নেই। মোবাইলে ছবি তুলে পাঠিয়েছি, ওরাই সব পূরণ করে আমাকে দেখিয়ে জমা দিয়েছে।',
  },
  {
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'রাকিব হাসান',
    role: 'কম্পিউটার অপারেটর',
    text: 'তিনটা পদে একসাথে আবেদন করে সার্ভিস চার্জে ৫০ টাকা বেঁচেছে। জমার আগে রিভিউ দেখতে পাওয়াটা দারুণ।',
  },
  {
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    name: 'মেহেদী রহমান',
    role: 'অফিস সহায়ক',
    text: "আবেদন আইডি দিয়ে যেকোনো সময় অবস্থা দেখা যায়। শেষে Applicant's Copy পেয়েছি।",
  },
  {
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    name: 'নুসরাত জাহান',
    role: 'সহকারী শিক্ষক',
    text: 'আমার কম্পিউটার সম্পর্কে তেমন ধারণা ছিল না। চাকরি সাথী টিম খুব সুন্দরভাবে সব হেল্প করেছে।',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 overflow-hidden" id="stories">
      
      {/* Header */}
      <div className="mx-auto mb-12 max-w-xl text-center">
        <div className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          সাফল্যের গল্প
        </div>
        <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          যারা আমাদের সাথে স্বপ্ন ছুঁয়েছে
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          (ডেমো রিভিউ — আসল রিভিউ পেলে বদলে দেওয়া হবে)
        </p>
      </div>

      {/* Swiper Slider */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          // autoplay={{
          //   delay: 3500,
          //   disableOnInteraction: false,
          // }}
          pagination={{
            clickable: true,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          // 👈 Ekhane pb-20 deya hoyeche jate pagination er jonno jayga thake
          className="!pb-20" 
        >
          {items.map((t, i) => {
            const isActive = activeIndex === i;
            return (
              // 👈 SwiperSlide theke py-4 bad deya hoyeche jate card height stretch na hoy
              <SwiperSlide key={i} className="h-auto">
                
                <div 
                  className={`flex h-full flex-col justify-between rounded-3xl p-8 transition-all duration-500 ease-out ${
                    isActive 
                      ? 'scale-100 bg-gradient-to-br from-white to-orange-50/40 border border-orange-100 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] ring-1 ring-orange-100/50' 
                      : 'scale-90 bg-white border border-slate-100 shadow-sm opacity-60'
                  }`}
                >
                  
                  <div>
                    {/* Quote Icon */}
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                      isActive ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-md' : 'bg-orange-50 text-orange-400'
                    }`}>
                      <Quote className="h-6 w-6 fill-current" />
                    </div>

                    {/* Stars */}
                    <div className="mb-4 text-amber-400 tracking-widest text-lg flex gap-1">
                      ★★★★★
                    </div>
                    
                    {/* Text */}
                    <p className="mb-8 text-[15px] leading-relaxed text-slate-700">
                      {t.text}
                    </p>
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative">
                      <Image 
                        src={t.img} 
                        alt={t.name} 
                        width={56} 
                        height={56} 
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm" 
                      />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{t.name}</div>
                      <div className="text-xs font-semibold text-emerald-600">{t.role}</div>
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Pagination Customization */}
      <style jsx global>{`
        /* 👈 Pagination ke niche name deyar jonno ekhane bottom set kora hoyeche */
        .swiper-pagination {
          bottom: 0px !important; 
        }
        .swiper-pagination-bullet {
          background: #cbd5e1 !important;
          opacity: 1 !important;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
          margin: 0 4px !important;
        }
        .swiper-pagination-bullet-active {
          background: #7c3aed !important;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>

    </section>
  );
}