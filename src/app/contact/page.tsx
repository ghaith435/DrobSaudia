"use client";

import { useState } from "react";
import styles from "./contact.module.css";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", type: "general" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus("sent");
                setForm({ name: "", email: "", subject: "", message: "", type: "general" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>تواصل معنا</h1>
                    <p className={styles.subtitle}>نسعد بتواصلك معنا. أرسل لنا رسالتك وسنرد عليك في أقرب وقت.</p>
                </div>

                <div className={styles.grid}>
                    {/* Contact Info */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>📧</span>
                            <div>
                                <h3>البريد الإلكتروني</h3>
                                <p>info@riyadhguide.com</p>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>📱</span>
                            <div>
                                <h3>الهاتف</h3>
                                <p dir="ltr">+966 11 000 0000</p>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>📍</span>
                            <div>
                                <h3>العنوان</h3>
                                <p>الرياض، المملكة العربية السعودية</p>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>🕐</span>
                            <div>
                                <h3>ساعات العمل</h3>
                                <p>الأحد - الخميس: 9 صباحاً - 6 مساءً</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className={styles.socialLinks}>
                            <a href="https://twitter.com/RiyadhGuide" className={styles.socialLink} target="_blank" rel="noopener">𝕏</a>
                            <a href="https://instagram.com/RiyadhGuide" className={styles.socialLink} target="_blank" rel="noopener">📷</a>
                            <a href="https://youtube.com/@RiyadhGuide" className={styles.socialLink} target="_blank" rel="noopener">▶️</a>
                            <a href="https://tiktok.com/@RiyadhGuide" className={styles.socialLink} target="_blank" rel="noopener">🎵</a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">الاسم</label>
                                <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اكتب اسمك" />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">البريد الإلكتروني</label>
                                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="type">نوع الرسالة</label>
                            <select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                <option value="general">استفسار عام</option>
                                <option value="support">دعم فني</option>
                                <option value="feedback">ملاحظات واقتراحات</option>
                                <option value="partnership">شراكات وتعاون</option>
                                <option value="bug">إبلاغ عن مشكلة</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject">الموضوع</label>
                            <input id="subject" type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="موضوع الرسالة" />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">الرسالة</label>
                            <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="اكتب رسالتك هنا..." />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
                            {status === "sending" ? "جار الإرسال..." : status === "sent" ? "✓ تم الإرسال" : "إرسال الرسالة"}
                        </button>

                        {status === "sent" && (
                            <div className={styles.successMsg}>✅ تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت.</div>
                        )}
                        {status === "error" && (
                            <div className={styles.errorMsg}>❌ حدث خطأ، يرجى المحاولة مرة أخرى.</div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
