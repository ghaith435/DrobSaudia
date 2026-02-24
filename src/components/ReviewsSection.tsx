"use client";

import { useState, useEffect } from "react";
import styles from "./reviews.module.css";

interface Review {
    id: string;
    rating: number;
    title?: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image?: string;
    };
}

interface ReviewAnalysis {
    summary: string;
    positives: string[];
    negatives: string[];
    tips: string[];
    totalReviews: number;
    ratingDistribution: { rating: number; count: number }[];
}

interface ReviewsSectionProps {
    placeId: string;
    initialReviews?: Review[];
}

export default function ReviewsSection({
    placeId,
    initialReviews = [],
}: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: "",
        content: "",
    });

    const fetchAnalysis = async () => {
        setIsLoadingAnalysis(true);
        try {
            const response = await fetch(
                `/api/reviews/analysis?placeId=${placeId}&language=${selectedLanguage}`
            );
            const data = await response.json();
            if (data.success) {
                setAnalysis(data.data);
            }
        } catch (error) {
            console.error("Error fetching analysis:", error);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const handleShowAnalysis = () => {
        setShowAnalysis(!showAnalysis);
        if (!analysis && !isLoadingAnalysis) {
            fetchAnalysis();
        }
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        // This would submit to the API
        console.log("Submitting review:", newReview);
        setShowWriteReview(false);
        setNewReview({ rating: 5, title: "", content: "" });
    };

    const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`${styles.star} ${star <= rating ? styles.filled : ""}`}
                        onClick={() => interactive && onChange && onChange(star)}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <span>⭐</span> Reviews & Ratings
                </h2>
                <div className={styles.headerActions}>
                    <button
                        className={styles.aiButton}
                        onClick={handleShowAnalysis}
                    >
                        {isLoadingAnalysis ? "🔄 Analyzing..." : "🤖 AI Insights"}
                    </button>
                    <button
                        className={styles.writeButton}
                        onClick={() => setShowWriteReview(!showWriteReview)}
                    >
                        ✍️ Write Review
                    </button>
                </div>
            </div>

            {/* AI Analysis Section */}
            {showAnalysis && analysis && (
                <div className={styles.analysisCard}>
                    <h3>🧠 AI-Powered Review Analysis</h3>

                    {/* Language Selector */}
                    <div className={styles.analysisLanguage}>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => {
                                setSelectedLanguage(e.target.value);
                                setAnalysis(null);
                                fetchAnalysis();
                            }}
                        >
                            <option value="en">English</option>
                            <option value="ar">العربية</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                        </select>
                    </div>

                    <p className={styles.summary}>{analysis.summary}</p>

                    <div className={styles.analysisGrid}>
                        {/* Positives */}
                        <div className={styles.analysisSection}>
                            <h4>👍 What Visitors Love</h4>
                            <ul>
                                {analysis.positives.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Tips */}
                        <div className={styles.analysisSection}>
                            <h4>💡 Visitor Tips</h4>
                            <ul>
                                {analysis.tips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Negatives (if any) */}
                        {analysis.negatives.length > 0 && (
                            <div className={styles.analysisSection}>
                                <h4>⚠️ Things to Note</h4>
                                <ul>
                                    {analysis.negatives.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Rating Distribution */}
                    {analysis.ratingDistribution.length > 0 && (
                        <div className={styles.ratingDistribution}>
                            <h4>📊 Rating Distribution</h4>
                            <div className={styles.distributionBars}>
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const item = analysis.ratingDistribution.find(
                                        (r) => r.rating === rating
                                    );
                                    const count = item?.count || 0;
                                    const percentage =
                                        analysis.totalReviews > 0
                                            ? (count / analysis.totalReviews) * 100
                                            : 0;

                                    return (
                                        <div key={rating} className={styles.distributionRow}>
                                            <span className={styles.ratingLabel}>
                                                {rating} ★
                                            </span>
                                            <div className={styles.distributionBar}>
                                                <div
                                                    className={styles.distributionFill}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className={styles.countLabel}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Write Review Form */}
            {showWriteReview && (
                <form className={styles.reviewForm} onSubmit={submitReview}>
                    <h3>Share Your Experience</h3>

                    <div className={styles.formGroup}>
                        <label>Your Rating</label>
                        {renderStars(newReview.rating, true, (r) =>
                            setNewReview({ ...newReview, rating: r })
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="reviewTitle">Title (Optional)</label>
                        <input
                            type="text"
                            id="reviewTitle"
                            value={newReview.title}
                            onChange={(e) =>
                                setNewReview({ ...newReview, title: e.target.value })
                            }
                            placeholder="Sum up your experience..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="reviewContent">Your Review</label>
                        <textarea
                            id="reviewContent"
                            value={newReview.content}
                            onChange={(e) =>
                                setNewReview({ ...newReview, content: e.target.value })
                            }
                            placeholder="Tell others about your visit..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setShowWriteReview(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Submit Review
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className={styles.reviewsList}>
                {reviews.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>📝</span>
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        {review.user.image ? (
                                            <img
                                                src={review.user.image}
                                                alt={review.user.name}
                                            />
                                        ) : (
                                            <span>
                                                {review.user.name?.charAt(0) || "?"}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span className={styles.userName}>
                                            {review.user.name || "Anonymous"}
                                        </span>
                                        <span className={styles.reviewDate}>
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            {review.title && (
                                <h4 className={styles.reviewTitle}>{review.title}</h4>
                            )}
                            <p className={styles.reviewContent}>{review.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
