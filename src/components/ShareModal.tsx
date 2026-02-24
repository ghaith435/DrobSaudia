"use client";

import { useState } from "react";
import styles from "./ShareModal.module.css";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    url: string;
    image?: string;
}

export default function ShareModal({ isOpen, onClose, title, description, url, image }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
    const shareText = `${title}${description ? ` - ${description}` : ""}`;

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: "💬",
            color: "#25D366",
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${fullUrl}`)}`, "_blank"),
        },
        {
            name: "Twitter / X",
            icon: "🐦",
            color: "#1DA1F2",
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`, "_blank"),
        },
        {
            name: "Telegram",
            icon: "✈️",
            color: "#0088cc",
            action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`, "_blank"),
        },
        {
            name: "Facebook",
            icon: "👤",
            color: "#1877F2",
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, "_blank"),
        },
        {
            name: "البريد الإلكتروني",
            icon: "📧",
            color: "#EA4335",
            action: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`, "_blank"),
        },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = fullUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text: description, url: fullUrl });
            } catch {
                // User cancelled
            }
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>مشاركة</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Preview Card */}
                <div className={styles.preview}>
                    {image && <img src={image} alt="" className={styles.previewImage} />}
                    <div className={styles.previewContent}>
                        <div className={styles.previewTitle}>{title}</div>
                        {description && <div className={styles.previewDesc}>{description.slice(0, 80)}...</div>}
                    </div>
                </div>

                {/* Share Options */}
                <div className={styles.options}>
                    {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                        <button className={styles.option} onClick={nativeShare}>
                            <div className={styles.optionIcon} style={{ background: "var(--accent-gold)" }}>📱</div>
                            <span>مشاركة</span>
                        </button>
                    )}
                    {shareOptions.map((opt) => (
                        <button key={opt.name} className={styles.option} onClick={opt.action}>
                            <div className={styles.optionIcon} style={{ background: opt.color }}>
                                {opt.icon}
                            </div>
                            <span>{opt.name}</span>
                        </button>
                    ))}
                </div>

                {/* Copy Link */}
                <div className={styles.copySection}>
                    <input type="text" value={fullUrl} readOnly className={styles.linkInput} />
                    <button
                        className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
                        onClick={copyLink}
                    >
                        {copied ? "✓ تم النسخ" : "نسخ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
