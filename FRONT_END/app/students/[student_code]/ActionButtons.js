'use client';
import { toPng } from "html-to-image";

export default function ActionButtons() {

    const downloadCard = async () => {
        try {
            const card = document.getElementById("studentCard");

            if (!card) {
                alert("ไม่พบบัตรนักเรียน");
                return;
            }

            const dataUrl = await toPng(card, {
                quality: 1,
                pixelRatio: 3,
                cacheBust: true
            });

            const link = document.createElement("a");
            link.download = "student-card.png";
            link.href = dataUrl;
            link.click();

        } catch (error) {
            console.error("Download error:", error);
        }
    };

    return (
        <div className="action-buttons">
            <button
                className="action-btn print-btn"
                onClick={() => window.print()}
            >
                <span className="btn-icon">🖨️</span>
                <span>พิมพ์บัตร</span>
            </button>

            <button
                className="action-btn download-btn"
                onClick={downloadCard}
            >
                <span className="btn-icon">💾</span>
                <span>ดาวน์โหลด PNG</span>
            </button>

            <a href="/" className="action-btn back-btn">
                <span className="btn-icon">🏠</span>
                <span>กลับหน้าหลัก</span>
            </a>
        </div>
    );
}