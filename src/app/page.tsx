"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCity } from "@/context/CityContext";
import { places } from "@/data/places";
import { tours } from "@/data/tours";
import { events } from "@/data/events";
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession();
  const { selectedCity } = useCity();
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [backgroundKey, setBackgroundKey] = useState(0);
  const [particles, setParticles] = useState<Array<{ delay: string, x: string, duration: string }>>([]);

  useEffect(() => {
    // Generate particles on client side only to avoid hydration mismatch
    const newParticles = [...Array(20)].map((_, i) => ({
      delay: `${i * 0.5}s`,
      x: `${Math.random() * 100}%`,
      duration: `${15 + Math.random() * 10}s`
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as 'ar' | 'en';
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    setBackgroundKey(prev => prev + 1);
  }, [selectedCity]);

  const t = {
    ar: {
      hero: {
        welcome: "مرحباً بك في",
        title: "دليل السعودية الذكي",
        subtitle: "منصتك المتكاملة لاكتشاف المملكة العربية السعودية بتقنيات الذكاء الاصطناعي",
        cta: "ابدأ رحلتك",
        secondary: "اكتشف الخدمات",
      },
      services: {
        badge: "خدماتنا",
        title: "كل ما تحتاجه في مكان واحد",
        subtitle: "نقدم لك مجموعة متكاملة من الخدمات السياحية المدعومة بالذكاء الاصطناعي",
        items: [
          {
            id: "maps",
            icon: "🗺️",
            title: "الخرائط والمسارات",
            description: "استكشف الأماكن السياحية على الخريطة واحصل على اتجاهات مباشرة لوجهتك",
            features: ["خرائط تفاعلية", "مسارات ذكية", "تحديد الموقع"],
            link: "/maps",
            color: "gradient-maps",
          },
          {
            id: "planner",
            icon: "🤖",
            title: "مخطط الرحلات الذكي",
            description: "دع الذكاء الاصطناعي يخطط رحلتك المثالية بناءً على اهتماماتك وميزانيتك ووقتك المتاح",
            features: ["تخطيط مخصص", "توصيات ذكية", "جداول مرنة"],
            link: "/planner",
            color: "gradient-ai",
          },
          {
            id: "audio-tours",
            icon: "🎧",
            title: "الجولات الصوتية",
            description: "استمع لقصص الأماكن التاريخية بصوت بشري طبيعي يرافقك في كل خطوة",
            features: ["صوت بشري", "متعدد اللغات", "يتفاعل مع موقعك"],
            link: "/audio-tours",
            color: "gradient-audio",
          },
          {
            id: "ai-guide",
            icon: "👤",
            title: "المرشد الافتراضي",
            description: "مرشدك السياحي الشخصي المتاح 24/7 للإجابة على جميع استفساراتك",
            features: ["محادثة ذكية", "معلومات دقيقة", "دعم فوري"],
            link: "/ai-guide",
            color: "gradient-guide",
          },
          {
            id: "tours",
            icon: "🚶",
            title: "الجولات السياحية",
            description: "اختر من بين عشرات الجولات المصممة بعناية لتناسب جميع الأذواق",
            features: ["جولات متنوعة", "مسارات محسنة", "تجارب فريدة"],
            link: "/tours",
            color: "gradient-tours",
          },
          {
            id: "events",
            icon: "🎪",
            title: "الفعاليات والمناسبات",
            description: "تعرف على أحدث الفعاليات والمهرجانات في جميع أنحاء المملكة",
            features: ["تحديث مستمر", "حجز مباشر", "تذكيرات"],
            link: "/events",
            color: "gradient-events",
          },
        ],
      },
      features: {
        badge: "لماذا نحن؟",
        title: "تجربة سياحية استثنائية",
        subtitle: "نجمع بين أحدث التقنيات والمحتوى الغني لنقدم لك تجربة لا مثيل لها",
        items: [
          { icon: "🎯", title: "دقة عالية", desc: "معلومات محدثة ودقيقة عن كل موقع" },
          { icon: "🌐", title: "متعدد اللغات", desc: "دعم كامل للعربية والإنجليزية" },
          { icon: "♿", title: "سهولة الوصول", desc: "مسارات خاصة لذوي الاحتياجات" },
          { icon: "📱", title: "تجربة سلسة", desc: "تصميم متجاوب لجميع الأجهزة" },
        ],
      },
      discover: {
        badge: "اكتشف",
        title: "أبرز الوجهات في",
        subtitle: "اكتشف أجمل المعالم السياحية والتاريخية",
        viewAll: "عرض الكل",
        viewDetails: "عرض التفاصيل",
      },
      stats: {
        places: "وجهة سياحية",
        tours: "جولة متاحة",
        users: "مستخدم نشط",
        rating: "تقييم المستخدمين",
      },
      cta: {
        title: "جاهز لبدء مغامرتك؟",
        subtitle: "سجل الآن واحصل على تجربة سياحية متكاملة مدعومة بالذكاء الاصطناعي",
        register: "إنشاء حساب مجاني",
        login: "تسجيل الدخول",
        planTrip: "خطط رحلتك الآن",
      },
    },
    en: {
      hero: {
        welcome: "Welcome to",
        title: "Saudi Smart Guide",
        subtitle: "Your comprehensive platform to discover Saudi Arabia with AI technologies",
        cta: "Start Your Journey",
        secondary: "Explore Services",
      },
      services: {
        badge: "Our Services",
        title: "Everything You Need in One Place",
        subtitle: "We offer a comprehensive range of AI-powered tourism services",
        items: [
          {
            id: "maps",
            icon: "🗺️",
            title: "Maps & Routes",
            description: "Explore tourist places on the map and get live directions to your destination",
            features: ["Interactive Maps", "Smart Routes", "Location Tracking"],
            link: "/maps",
            color: "gradient-maps",
          },
          {
            id: "planner",
            icon: "🤖",
            title: "Smart Trip Planner",
            description: "Let AI plan your perfect trip based on your interests, budget, and available time",
            features: ["Personalized Planning", "Smart Recommendations", "Flexible Schedules"],
            link: "/planner",
            color: "gradient-ai",
          },
          {
            id: "audio-tours",
            icon: "🎧",
            title: "Audio Tours",
            description: "Listen to stories of historical places with natural human voice accompanying you",
            features: ["Human Voice", "Multi-language", "Location-aware"],
            link: "/audio-tours",
            color: "gradient-audio",
          },
          {
            id: "ai-guide",
            icon: "👤",
            title: "Virtual Guide",
            description: "Your personal tour guide available 24/7 to answer all your questions",
            features: ["Smart Chat", "Accurate Info", "Instant Support"],
            link: "/ai-guide",
            color: "gradient-guide",
          },
          {
            id: "tours",
            icon: "🚶",
            title: "Guided Tours",
            description: "Choose from dozens of carefully designed tours to suit all tastes",
            features: ["Various Tours", "Optimized Routes", "Unique Experiences"],
            link: "/tours",
            color: "gradient-tours",
          },
          {
            id: "events",
            icon: "🎪",
            title: "Events & Festivals",
            description: "Discover the latest events and festivals across the Kingdom",
            features: ["Live Updates", "Direct Booking", "Reminders"],
            link: "/events",
            color: "gradient-events",
          },
        ],
      },
      features: {
        badge: "Why Us?",
        title: "Exceptional Tourism Experience",
        subtitle: "We combine the latest technologies with rich content to provide an unparalleled experience",
        items: [
          { icon: "🎯", title: "High Accuracy", desc: "Updated and accurate information for every location" },
          { icon: "🌐", title: "Multi-language", desc: "Full support for Arabic and English" },
          { icon: "♿", title: "Accessibility", desc: "Special routes for people with special needs" },
          { icon: "📱", title: "Smooth Experience", desc: "Responsive design for all devices" },
        ],
      },
      discover: {
        badge: "Discover",
        title: "Top Destinations in",
        subtitle: "Discover the most beautiful tourist and historical landmarks",
        viewAll: "View All",
        viewDetails: "View Details",
      },
      stats: {
        places: "Tourist Destinations",
        tours: "Available Tours",
        users: "Active Users",
        rating: "User Rating",
      },
      cta: {
        title: "Ready to Start Your Adventure?",
        subtitle: "Register now and get a complete AI-powered tourism experience",
        register: "Create Free Account",
        login: "Login",
        planTrip: "Plan Your Trip Now",
      },
    },
  };

  const labels = t[locale];
  const isRTL = locale === 'ar';

  return (
    <main className={styles.main} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} key={backgroundKey}>
          <Image
            src={selectedCity.backgroundImage}
            alt={isRTL ? selectedCity.nameAr : selectedCity.name}
            fill
            className={styles.heroImage}
            priority
            unoptimized
          />
          <div className={styles.heroOverlay} />
        </div>



        {/* Animated Particles - Client Side Only */}
        <div className={styles.particles}>
          {particles.map((p, i) => (
            <span key={i} className={styles.particle} style={{
              '--delay': p.delay,
              '--x': p.x,
              '--duration': p.duration
            } as React.CSSProperties} />
          ))}
        </div>

        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgePulse} />
            🌟 {labels.hero.welcome}
          </span>

          <h1 className={styles.heroTitle}>
            {labels.hero.title}
            <span className={styles.heroTitleGlow} />
          </h1>

          <p className={styles.heroSubtitle}>{labels.hero.subtitle}</p>

          <div className={styles.heroActions}>
            <Link href="/planner" className={styles.heroPrimaryBtn}>
              <span className={styles.btnIcon}>🚀</span>
              {labels.hero.cta}
              <span className={styles.btnShine} />
            </Link>
            <a href="#services" className={styles.heroSecondaryBtn}>
              <span className={styles.btnIcon}>✨</span>
              {labels.hero.secondary}
            </a>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{places.length}+</span>
              <span className={styles.statLabel}>{labels.stats.places}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{tours.length}+</span>
              <span className={styles.statLabel}>{labels.stats.tours}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{events.length}+</span>
              <span className={styles.statLabel}>{labels.stats.users}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4.8</span>
              <span className={styles.statLabel}>{labels.stats.rating}</span>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>↓</span>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{labels.services.badge}</span>
            <h2 className={styles.sectionTitle}>{labels.services.title}</h2>
            <p className={styles.sectionSubtitle}>{labels.services.subtitle}</p>
          </div>

          <div className={styles.servicesGrid}>
            {labels.services.items.map((service, index) => (
              <Link
                href={session ? service.link : `/auth/login?redirect=${service.link}`}
                key={service.id}
                className={`${styles.serviceCard} ${styles[service.color]}`}
                style={{ '--index': index } as React.CSSProperties}
              >
                <div className={styles.serviceIconWrapper}>
                  <span className={styles.serviceIcon}>{service.icon}</span>
                  <div className={styles.serviceIconRing} />
                </div>

                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>

                <div className={styles.serviceFeatures}>
                  {service.features.map((feature, i) => (
                    <span key={i} className={styles.serviceFeature}>
                      <span className={styles.featureCheck}>✓</span>
                      {feature}
                    </span>
                  ))}
                </div>

                <div className={styles.serviceAction}>
                  <span>{isRTL ? 'اكتشف المزيد' : 'Explore More'}</span>
                  <span className={styles.serviceArrow}>{isRTL ? '←' : '→'}</span>
                </div>

                {!session && (
                  <div className={styles.loginRequired}>
                    <span>🔐</span>
                    <span>{isRTL ? 'تسجيل الدخول مطلوب' : 'Login Required'}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{labels.features.badge}</span>
            <h2 className={styles.sectionTitle}>{labels.features.title}</h2>
            <p className={styles.sectionSubtitle}>{labels.features.subtitle}</p>
          </div>

          <div className={styles.featuresGrid}>
            {labels.features.items.map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIconBox}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className={styles.discoverSection}>
        <div className={styles.container}>
          <div className={styles.discoverHeader}>
            <div>
              <span className={styles.sectionBadge}>{labels.discover.badge}</span>
              <h2 className={styles.sectionTitle}>
                {labels.discover.title} <span className={styles.goldText}>{isRTL ? selectedCity.nameAr : selectedCity.name}</span>
              </h2>
              <p className={styles.sectionSubtitle}>{labels.discover.subtitle}</p>
            </div>
            <Link href={`/places?city=${selectedCity.id}`} className={styles.viewAllBtn}>
              {labels.discover.viewAll} <span>→</span>
            </Link>
          </div>

          <div className={styles.placesGrid}>
            {selectedCity.places.slice(0, 4).map((place, index) => (
              <Link
                href={`/place/${place.id}`}
                key={place.id}
                className={styles.placeCard}
                style={{ '--index': index } as React.CSSProperties}
              >
                <div className={styles.placeImageWrapper}>
                  <Image
                    src={place.image}
                    alt={isRTL ? place.nameAr : place.name}
                    fill
                    className={styles.placeImage}
                    unoptimized
                  />
                  <div className={styles.placeOverlay} />
                  <span className={styles.placeCategory}>
                    {isRTL ? ({ 'History': 'تاريخي', 'Modern': 'حديث', 'Shopping': 'تسوق', 'Dining': 'مطاعم', 'Entertainment': 'ترفيه', 'Nature': 'طبيعة' }[place.category] || place.category) : place.category}
                  </span>
                </div>
                <div className={styles.placeContent}>
                  <h3 className={styles.placeName}>{isRTL ? place.nameAr : place.name}</h3>
                  <p className={styles.placeDescription}>
                    {(isRTL ? place.descriptionAr : place.description).slice(0, 80)}...
                  </p>
                  <div className={styles.placeFooter}>
                    <span className={styles.placeRating}>
                      ⭐ {place.rating}
                    </span>
                    <span className={styles.placeLink}>
                      {labels.discover.viewDetails} {isRTL ? '←' : '→'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaGradient} />
        </div>

        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{labels.cta.title}</h2>
          <p className={styles.ctaSubtitle}>{labels.cta.subtitle}</p>

          <div className={styles.ctaButtons}>
            {session ? (
              <Link href="/planner" className={styles.ctaPrimary}>
                🤖 {labels.cta.planTrip}
              </Link>
            ) : (
              <>
                <Link href="/auth/register" className={styles.ctaPrimary}>
                  {labels.cta.register}
                </Link>
                <Link href="/auth/login" className={styles.ctaSecondary}>
                  {labels.cta.login}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main >
  );
}
