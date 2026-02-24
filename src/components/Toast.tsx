"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

let addToastFn: ((message: string, type: ToastType, duration?: number) => void) | null = null;

export function toast(message: string, type: ToastType = "info", duration = 4000) {
    if (addToastFn) {
        addToastFn(message, type, duration);
    }
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    useEffect(() => {
        addToastFn = addToast;
        return () => { addToastFn = null; };
    }, [addToast]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons: Record<ToastType, string> = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    };

    return (
        <div className={styles.container} id="toast-container">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`${styles.toast} ${styles[t.type]}`}
                    onClick={() => removeToast(t.id)}
                >
                    <span className={styles.icon}>{icons[t.type]}</span>
                    <span className={styles.message}>{t.message}</span>
                    <button className={styles.close} aria-label="إغلاق">✕</button>
                </div>
            ))}
        </div>
    );
}
