"use client";

import { useState, useEffect } from "react";
import styles from "./Onboarding.module.css";

const steps = [
    {
        emoji: "🌟",
        title: "مرحباً بك في دليل الرياض",
        description: "اكتشف أجمل المعالم والفعاليات في العاصمة السعودية بتجربة ذكية ومميزة",
        bg: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    },
    {
        emoji: "🎧",
        title: "جولات صوتية تفاعلية",
        description: "استمع إلى قصص المعالم التاريخية بصوت مرشد ذكي يرافقك في كل خطوة",
        bg: "linear-gradient(135deg, #1e3a5f 0%, #0f4c3a 100%)",
    },
    {
        emoji: "🤖",
        title: "ذكاء اصطناعي متقدم",
        description: "خطط رحلتك واحصل على توصيات مخصصة بمساعدة تقنيات الذكاء الاصطناعي",
        bg: "linear-gradient(135deg, #0f4c3a 0%, #3a1e5f 100%)",
    },
    {
        emoji: "🏆",
        title: "اجمع النقاط والمكافآت",
        description: "كل زيارة ومراجعة تكسبك نقاط خبرة وشارات. استبدل نقاطك بخصومات حقيقية!",
        bg: "linear-gradient(135deg, #3a1e5f 0%, #5f1e3a 100%)",
    },
];

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasOnboarded = localStorage.getItem("onboarded");
        if (!hasOnboarded) {
            setShow(true);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleDismiss();
        }
    };

    const handleDismiss = () => {
        setShow(false);
        localStorage.setItem("onboarded", "true");
    };

    if (!show) return null;

    const step = steps[currentStep];

    return (
        <div className={styles.overlay}>
            <div
                className={styles.card}
                style={{ background: step.bg }}
            >
                {/* Skip */}
                <button className={styles.skip} onClick={handleDismiss}>تخطّي</button>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.emoji}>{step.emoji}</div>
                    <h2 className={styles.title}>{step.title}</h2>
                    <p className={styles.description}>{step.description}</p>
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                    <div className={styles.dots}>
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.dot} ${i === currentStep ? styles.dotActive : ""}`}
                                onClick={() => setCurrentStep(i)}
                            />
                        ))}
                    </div>
                    <button className={styles.nextBtn} onClick={handleNext}>
                        {currentStep < steps.length - 1 ? "التالي →" : "ابدأ الآن 🚀"}
                    </button>
                </div>
            </div>
        </div>
    );
}
