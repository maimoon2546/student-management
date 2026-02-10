'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function StudentQR({ studentCode }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>QR Code สำหรับสแกนเข้า–ออก</h3>

      <QRCodeCanvas
        value={`http://localhost:3000/scan/${studentCode}?from=qr`}
        size={200}
      />
    </div>
  );
}
