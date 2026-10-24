export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <linearGradient id="gV" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5B3DF5" />
          <stop offset="1" stopColor="#F2459B" />
        </linearGradient>
        <linearGradient id="gC" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC23D" />
          <stop offset="1" stopColor="#FF6B4A" />
        </linearGradient>
        <symbol id="i-all" viewBox="0 0 32 32">
          <rect x="4" y="4" width="10" height="10" rx="3" fill="#5B3DF5" />
          <rect x="18" y="4" width="10" height="10" rx="3" fill="#FF6B4A" />
          <rect x="4" y="18" width="10" height="10" rx="3" fill="#12B8A6" />
          <rect x="18" y="18" width="10" height="10" rx="3" fill="#FFC23D" />
        </symbol>
        <symbol id="i-gov" viewBox="0 0 32 32">
          <path d="M16 3 3 9.5h26L16 3z" fill="#5B3DF5" />
          <rect x="4" y="11" width="24" height="2.5" rx="1" fill="#8A73FF" />
          <rect x="6.5" y="15" width="3" height="9" rx="1" fill="#5B3DF5" />
          <rect x="12.5" y="15" width="3" height="9" rx="1" fill="#5B3DF5" />
          <rect x="18.5" y="15" width="3" height="9" rx="1" fill="#5B3DF5" />
          <rect x="22.5" y="15" width="3" height="9" rx="1" fill="#5B3DF5" />
          <rect x="3" y="25.5" width="26" height="3" rx="1.2" fill="#FF6B4A" />
          <circle cx="16" cy="7.2" r="1.4" fill="#FFC23D" />
        </symbol>
        <symbol id="i-tax" viewBox="0 0 32 32">
          <rect x="5" y="3" width="22" height="26" rx="4" fill="#12B8A6" />
          <rect x="9" y="7" width="14" height="5" rx="1.5" fill="#B8F1EA" />
          <circle cx="11" cy="17" r="1.8" fill="#fff" />
          <circle cx="16" cy="17" r="1.8" fill="#fff" />
          <circle cx="21" cy="17" r="1.8" fill="#FFC23D" />
          <circle cx="11" cy="23" r="1.8" fill="#fff" />
          <circle cx="16" cy="23" r="1.8" fill="#fff" />
          <circle cx="21" cy="23" r="1.8" fill="#FF6B4A" />
        </symbol>
        <symbol id="i-lab" viewBox="0 0 32 32">
          <path d="M8 28V12l8-7 8 7v16z" fill="#F2459B" />
          <rect x="13" y="19" width="6" height="9" rx="1" fill="#FFE1EE" />
          <rect x="10.5" y="13" width="3.5" height="3.5" rx=".8" fill="#fff" />
          <rect x="18" y="13" width="3.5" height="3.5" rx=".8" fill="#fff" />
          <circle cx="26" cy="7" r="3" fill="#FFC23D" />
        </symbol>
        <symbol id="i-bank" viewBox="0 0 32 32">
          <rect x="3" y="8" width="26" height="17" rx="4" fill="#0E9F6E" />
          <rect x="3" y="12" width="26" height="3.5" fill="#08734F" />
          <rect x="7" y="19" width="8" height="2.5" rx="1.2" fill="#fff" />
          <circle cx="23" cy="20.2" r="3" fill="#FFC23D" />
          <circle cx="20.5" cy="20.2" r="3" fill="#FF6B4A" opacity=".85" />
        </symbol>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" fill="none" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </symbol>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="#6B6885" strokeWidth="2" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-heartf" viewBox="0 0 24 24">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#F2459B" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#0E9F6E" />
          <path d="m7.5 12.3 3 3 6-6.3" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-bell" viewBox="0 0 24 24">
          <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2z" fill="#FFC23D" />
          <circle cx="12" cy="20.5" r="2" fill="#FF6B4A" />
        </symbol>
        <symbol id="i-spark" viewBox="0 0 24 24">
          <path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" fill="#F2459B" />
          <circle cx="19" cy="19" r="2" fill="#FFC23D" />
        </symbol>
        <symbol id="i-target" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="#FFE1D9" />
          <circle cx="16" cy="16" r="8" fill="#FF6B4A" />
          <circle cx="16" cy="16" r="4" fill="#fff" />
          <path d="M16 16 27 5" stroke="#5B3DF5" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m24 4 3.5 1.5L29 9" stroke="#5B3DF5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </symbol>
        <symbol id="i-profile" viewBox="0 0 32 32">
          <circle cx="16" cy="11" r="6" fill="url(#gV)" />
          <path d="M5 28c0-6 5-10 11-10s11 4 11 10" fill="url(#gV)" opacity=".8" />
        </symbol>
        <symbol id="i-doc" viewBox="0 0 32 32">
          <path d="M8 3h11l7 7v17a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="url(#gC)" />
          <path d="M19 3v7h7" fill="#FFE0A3" />
          <path d="M10.5 17h11M10.5 22h7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-send" viewBox="0 0 32 32">
          <path d="M29 3 3 14l10 4 4 10L29 3z" fill="#12B8A6" />
          <path d="m13 18 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </symbol>
        <symbol id="i-trophy" viewBox="0 0 32 32">
          <path d="M10 4h12v8a6 6 0 0 1-12 0V4z" fill="#FFC23D" />
          <path d="M10 7H5c0 4 2 6 5 6M22 7h5c0 4-2 6-5 6" stroke="#FF6B4A" strokeWidth="2.2" fill="none" />
          <rect x="14" y="17" width="4" height="6" fill="#FF6B4A" />
          <rect x="9" y="23" width="14" height="5" rx="2" fill="#5B3DF5" />
        </symbol>
        <symbol id="i-quote" viewBox="0 0 40 40">
          <rect width="40" height="40" rx="12" fill="url(#gC)" />
          <path d="M12 25c0-5 2-8 6-10l1 2c-2 1-3 3-3 4h3v6h-7v-2zm11 0c0-5 2-8 6-10l1 2c-2 1-3 3-3 4h3v6h-7v-2z" fill="#fff" />
        </symbol>
        <symbol id="i-ext" viewBox="0 0 24 24">
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-fb" viewBox="0 0 24 24">
          <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v6h4v-6h3l.5-4h-3.5V9c0-.6.4-1 1-1z" fill="currentColor" />
        </symbol>
        <symbol id="i-yt" viewBox="0 0 24 24">
          <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
          <path d="m10 9 5 3-5 3z" fill="#15132A" />
        </symbol>
        <symbol id="i-tg" viewBox="0 0 24 24">
          <path d="M21 4 3 11l5 2 2 6 3-4 5 4 3-15z" fill="currentColor" />
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h10" stroke="#1D1B33" strokeWidth="2.4" strokeLinecap="round" />
        </symbol>
      </defs>
    </svg>
  );
}