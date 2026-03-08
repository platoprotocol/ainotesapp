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
        <div
          style={{
            width: 17,
            height: 21,
            background: '#FFFFE3',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <div style={{ width: 11, height: 2, background: '#CBCBCB', borderRadius: 1 }} />
          <div style={{ width: 11, height: 2, background: '#CBCBCB', borderRadius: 1, marginTop: 3 }} />
          <div style={{ width: 7, height: 2, background: '#6D8196', borderRadius: 1, marginTop: 3 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
