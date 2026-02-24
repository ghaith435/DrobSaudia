"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
    const [locale, setLocale] = useState<'ar' | 'en'>('ar');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
        if (savedLocale) {
            setLocale(savedLocale);
        }
    }, []);

    const t = {
        ar: {
            title: "من نحن",
            subtitle: "رحلتنا في إحياء السياحة السعودية",
            mission: {
                title: "رسالتنا",
                description: "نسعى لتقديم تجربة سياحية ذكية ومتكاملة تجمع بين أصالة التراث السعودي وأحدث تقنيات الذكاء الاصطناعي، لنجعل كل زائر يعيش تجربة لا تُنسى."
            },
            vision: {
                title: "رؤيتنا",
                description: "أن نكون المنصة الرائدة في مجال السياحة الذكية في المملكة العربية السعودية والشرق الأوسط، ونساهم في تحقيق رؤية 2030."
            },
            values: {
                title: "قيمنا",
                items: [
                    { icon: "🎯", title: "الابتكار", desc: "نبتكر حلولاً تقنية متقدمة" },
                    { icon: "🤝", title: "الأصالة", desc: "نحافظ على التراث والهوية" },
                    { icon: "⭐", title: "التميز", desc: "نقدم أعلى معايير الجودة" },
                    { icon: "🌍", title: "الانفتاح", desc: "نرحب بالعالم أجمع" }
                ]
            },
            team: {
                title: "فريقنا",
                subtitle: "خبراء متخصصون في السياحة والتقنية",
                members: [
                    { name: "أحمد السعود", role: "المؤسس والمدير التنفيذي", emoji: "👨‍💼" },
                    { name: "سارة العمري", role: "مديرة تطوير المنتجات", emoji: "👩‍💻" },
                    { name: "خالد الحربي", role: "رئيس قسم الذكاء الاصطناعي", emoji: "🧑‍🔬" },
                    { name: "نورة القحطاني", role: "مديرة تجربة المستخدم", emoji: "👩‍🎨" }
                ]
            },
            stats: {
                cities: "مدينة",
                places: "وجهة سياحية",
                users: "مستخدم",
                tours: "جولة"
            },
            cta: {
                title: "انضم إلى رحلتنا",
                subtitle: "كن جزءاً من مستقبل السياحة الذكية",
                button: "ابدأ الآن"
            }
        },
        en: {
            title: "About Us",
            subtitle: "Our Journey in Reviving Saudi Tourism",
            mission: {
                title: "Our Mission",
                description: "We strive to provide a smart and comprehensive tourism experience that combines the authenticity of Saudi heritage with the latest AI technologies, making every visitor live an unforgettable experience."
            },
            vision: {
                title: "Our Vision",
                description: "To be the leading platform in smart tourism in Saudi Arabia and the Middle East, contributing to the achievement of Vision 2030."
            },
            values: {
                title: "Our Values",
                items: [
                    { icon: "🎯", title: "Innovation", desc: "We create advanced tech solutions" },
                    { icon: "🤝", title: "Authenticity", desc: "We preserve heritage & identity" },
                    { icon: "⭐", title: "Excellence", desc: "We deliver highest quality" },
                    { icon: "🌍", title: "Openness", desc: "We welcome the whole world" }
                ]
            },
            team: {
                title: "Our Team",
                subtitle: "Experts specialized in tourism and technology",
                members: [
                    { name: "Ahmed Al-Saud", role: "Founder & CEO", emoji: "👨‍💼" },
                    { name: "Sara Al-Omari", role: "Product Development Manager", emoji: "👩‍💻" },
                    { name: "Khaled Al-Harbi", role: "Head of AI", emoji: "🧑‍🔬" },
                    { name: "Noura Al-Qahtani", role: "UX Director", emoji: "👩‍🎨" }
                ]
            },
            stats: {
                cities: "Cities",
                places: "Destinations",
                users: "Users",
                tours: "Tours"
            },
            cta: {
                title: "Join Our Journey",
                subtitle: "Be part of the future of smart tourism",
                button: "Get Started"
            }
        }
    };

    const labels = t[locale];
    const isRTL = locale === 'ar';

    return (
        <main className={styles.main} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroGradient} />
                    <div className={styles.heroPattern} />
                </div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{labels.title}</h1>
                    <p className={styles.heroSubtitle}>{labels.subtitle}</p>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>15+</span>
                        <span className={styles.statLabel}>{labels.stats.cities}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>500+</span>
                        <span className={styles.statLabel}>{labels.stats.places}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>10K+</span>
                        <span className={styles.statLabel}>{labels.stats.users}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>50+</span>
                        <span className={styles.statLabel}>{labels.stats.tours}</span>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className={styles.missionSection}>
                <div className={styles.container}>
                    <div className={styles.missionGrid}>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>🎯</div>
                            <h2 className={styles.missionTitle}>{labels.mission.title}</h2>
                            <p className={styles.missionText}>{labels.mission.description}</p>
                        </div>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>🔭</div>
                            <h2 className={styles.missionTitle}>{labels.vision.title}</h2>
                            <p className={styles.missionText}>{labels.vision.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{labels.values.title}</h2>
                    <div className={styles.valuesGrid}>
                        {labels.values.items.map((value, index) => (
                            <div key={index} className={styles.valueCard}>
                                <span className={styles.valueIcon}>{value.icon}</span>
                                <h3 className={styles.valueTitle}>{value.title}</h3>
                                <p className={styles.valueDesc}>{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className={styles.teamSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{labels.team.title}</h2>
                    <p className={styles.sectionSubtitle}>{labels.team.subtitle}</p>
                    <div className={styles.teamGrid}>
                        {labels.team.members.map((member, index) => (
                            <div key={index} className={styles.teamCard}>
                                <div className={styles.teamEmoji}>{member.emoji}</div>
                                <h3 className={styles.teamName}>{member.name}</h3>
                                <p className={styles.teamRole}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>{labels.cta.title}</h2>
                    <p className={styles.ctaSubtitle}>{labels.cta.subtitle}</p>
                    <Link href="/auth/register" className={styles.ctaButton}>
                        {labels.cta.button}
                    </Link>
                </div>
            </section>
        </main>
    );
}
