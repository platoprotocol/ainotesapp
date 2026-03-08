import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#4A4A4A',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Notepad */}
          <rect x="2" y="3" width="11" height="14" rx="1.5" fill="#FFFFE3" />
          <line x1="4.5" y1="7" x2="10.5" y2="7" stroke="#CBCBCB" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4.5" y1="10" x2="10.5" y2="10" stroke="#CBCBCB" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4.5" y1="13" x2="8" y2="13" stroke="#CBCBCB" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pen */}
          <path
            d="M12 13.5l4.5-4.5 1.5 1.5-4.5 4.5H12v-1.5z"
            fill="#6D8196"
          />
          <path
            d="M15.5 8l1.5-1.5a1 1 0 011.5 1.5L17 9.5 15.5 8z"
            fill="#8FA3B5"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
