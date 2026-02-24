"""
خدمة التعرف على الأماكن السياحية في الرياض باستخدام OpenCV
Riyadh Places Recognition Service using OpenCV
"""

import cv2
import numpy as np
from pathlib import Path
import json
import os
from typing import Optional, Dict, List, Tuple
from dataclasses import dataclass
from sklearn.neighbors import KNeighborsClassifier
import pickle

@dataclass
class PlaceMatch:
    """نتيجة مطابقة المكان"""
    place_id: str
    place_name: str
    place_name_ar: str
    confidence: float
    matched_features: int
    description: str
    description_ar: str
    category: str
    location: Dict

# بيانات الأماكن السياحية
PLACES_DATA = {
    "1": {
        "name": "At-Turaif, Diriyah",
        "name_ar": "حي الطريف، الدرعية",
        "description": "The birthplace of the first Saudi state, a UNESCO World Heritage site featuring mud-brick palaces and winding alleyways.",
        "description_ar": "مهد الدولة السعودية الأولى، موقع تراث عالمي لليونسكو يتميز بالقصور الطينية والأزقة المتعرجة.",
        "category": "History",
        "location": {"lat": 24.7333, "lng": 46.5750}
    },
    "2": {
        "name": "Kingdom Centre Tower",
        "name_ar": "برج المملكة",
        "description": "An iconic 99-story skyscraper featuring the Sky Bridge observation deck.",
        "description_ar": "ناطحة سحاب أيقونية من 99 طابقًا تتميز بجسر السماء للمشاهدة.",
        "category": "Modern",
        "location": {"lat": 24.7114, "lng": 46.6744}
    },
    "3": {
        "name": "Boulevard World",
        "name_ar": "بوليفارد وورلد",
        "description": "A massive entertainment zone bringing cultures from around the world to Riyadh.",
        "description_ar": "منطقة ترفيهية ضخمة تجلب ثقافات من جميع أنحاء العالم إلى الرياض.",
        "category": "Entertainment",
        "location": {"lat": 24.7890, "lng": 46.6110}
    },
    "4": {
        "name": "Riyadh Park Mall",
        "name_ar": "رياض بارك مول",
        "description": "One of Riyadh's most popular shopping destinations.",
        "description_ar": "أحد أشهر وجهات التسوق في الرياض.",
        "category": "Shopping",
        "location": {"lat": 24.7550, "lng": 46.6300}
    },
    "5": {
        "name": "Najd Village Restaurant",
        "name_ar": "مطعم قرية نجد",
        "description": "Experience authentic traditional Saudi Najdi cuisine.",
        "description_ar": "تجربة المطبخ النجدي السعودي التقليدي الأصيل.",
        "category": "Dining",
        "location": {"lat": 24.6800, "lng": 46.7000}
    },
    "6": {
        "name": "Edge of the World",
        "name_ar": "حافة العالم",
        "description": "A breathtaking natural wonder on the edge of the Tuwaiq Escarpment.",
        "description_ar": "أعجوبة طبيعية خلابة على حافة جرف طويق.",
        "category": "Nature",
        "location": {"lat": 24.8361, "lng": 46.2158}
    },
    "7": {
        "name": "The National Museum",
        "name_ar": "المتحف الوطني",
        "description": "Saudi Arabia's premier museum showcasing the Kingdom's rich history.",
        "description_ar": "متحف المملكة العربية السعودية الأول الذي يعرض تاريخ المملكة الغني.",
        "category": "History",
        "location": {"lat": 24.6476, "lng": 46.7102}
    },
    "8": {
        "name": "Panorama Mall",
        "name_ar": "بانوراما مول",
        "description": "A premium shopping destination featuring luxury brands.",
        "description_ar": "وجهة تسوق فاخرة تضم علامات تجارية فخمة.",
        "category": "Shopping",
        "location": {"lat": 24.7685, "lng": 46.6890}
    },
    "9": {
        "name": "Via Riyadh",
        "name_ar": "فيا الرياض",
        "description": "An upscale outdoor entertainment destination.",
        "description_ar": "وجهة ترفيهية راقية في الهواء الطلق.",
        "category": "Entertainment",
        "location": {"lat": 24.7234, "lng": 46.6678}
    },
    "10": {
        "name": "Wadi Hanifa",
        "name_ar": "وادي حنيفة",
        "description": "A rehabilitated natural valley offering scenic walking and cycling paths.",
        "description_ar": "وادي طبيعي مُعاد تأهيله يوفر مسارات للمشي وركوب الدراجات.",
        "category": "Nature",
        "location": {"lat": 24.5500, "lng": 46.6200}
    }
}


class PlaceRecognizer:
    """محرك التعرف على الأماكن باستخدام OpenCV"""
    
    def __init__(self, reference_images_dir: str = "reference_images"):
        self.reference_images_dir = Path(reference_images_dir)
        self.reference_images_dir.mkdir(exist_ok=True)
        
        # SIFT feature detector
        self.sift = cv2.SIFT_create(nfeatures=500)
        
        # FLANN matcher
        FLANN_INDEX_KDTREE = 1
        index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
        search_params = dict(checks=50)
        self.flann = cv2.FlannBasedMatcher(index_params, search_params)
        
        # ORB feature detector (faster alternative)
        self.orb = cv2.ORB_create(nfeatures=1000)
        self.bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        
        # مخزن الميزات المرجعية
        self.reference_features: Dict[str, List] = {}
        self.reference_descriptors: Dict[str, np.ndarray] = {}
        
        # تحميل الميزات المرجعية
        self._load_reference_features()
    
    def _load_reference_features(self):
        """تحميل ميزات الصور المرجعية"""
        features_file = self.reference_images_dir / "features.pkl"
        
        if features_file.exists():
            with open(features_file, 'rb') as f:
                data = pickle.load(f)
                self.reference_features = data.get('features', {})
                self.reference_descriptors = data.get('descriptors', {})
            print(f"تم تحميل ميزات {len(self.reference_features)} مكان")
        else:
            print("لا توجد ميزات مرجعية محفوظة")
    
    def _save_reference_features(self):
        """حفظ ميزات الصور المرجعية"""
        features_file = self.reference_images_dir / "features.pkl"
        with open(features_file, 'wb') as f:
            pickle.dump({
                'features': self.reference_features,
                'descriptors': self.reference_descriptors
            }, f)
        print(f"تم حفظ ميزات {len(self.reference_features)} مكان")
    
    def add_reference_image(self, place_id: str, image_path: str) -> bool:
        """إضافة صورة مرجعية لمكان"""
        try:
            img = cv2.imread(image_path)
            if img is None:
                print(f"فشل في قراءة الصورة: {image_path}")
                return False
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # استخراج الميزات باستخدام SIFT
            keypoints, descriptors = self.sift.detectAndCompute(gray, None)
            
            if descriptors is None or len(descriptors) < 10:
                print(f"لم يتم العثور على ميزات كافية في: {image_path}")
                return False
            
            # حفظ الميزات
            if place_id not in self.reference_features:
                self.reference_features[place_id] = []
                self.reference_descriptors[place_id] = None
            
            self.reference_features[place_id].append({
                'keypoints': [(kp.pt, kp.size, kp.angle, kp.response, kp.octave) for kp in keypoints],
                'image_path': image_path
            })
            
            # دمج الوصفات
            if self.reference_descriptors[place_id] is None:
                self.reference_descriptors[place_id] = descriptors
            else:
                self.reference_descriptors[place_id] = np.vstack([
                    self.reference_descriptors[place_id], 
                    descriptors
                ])
            
            self._save_reference_features()
            print(f"تم إضافة صورة مرجعية للمكان {place_id}")
            return True
            
        except Exception as e:
            print(f"خطأ في إضافة الصورة المرجعية: {e}")
            return False
    
    def add_reference_image_from_bytes(self, place_id: str, image_bytes: bytes) -> bool:
        """إضافة صورة مرجعية من بايتات"""
        try:
            # تحويل البايتات إلى صورة
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return False
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            keypoints, descriptors = self.sift.detectAndCompute(gray, None)
            
            if descriptors is None or len(descriptors) < 10:
                return False
            
            if place_id not in self.reference_features:
                self.reference_features[place_id] = []
                self.reference_descriptors[place_id] = None
            
            self.reference_features[place_id].append({
                'keypoints': [(kp.pt, kp.size, kp.angle, kp.response, kp.octave) for kp in keypoints],
                'image_path': 'uploaded'
            })
            
            if self.reference_descriptors[place_id] is None:
                self.reference_descriptors[place_id] = descriptors
            else:
                self.reference_descriptors[place_id] = np.vstack([
                    self.reference_descriptors[place_id], 
                    descriptors
                ])
            
            self._save_reference_features()
            return True
            
        except Exception as e:
            print(f"خطأ: {e}")
            return False
    
    def recognize(self, image_bytes: bytes, min_confidence: float = 0.3) -> Optional[PlaceMatch]:
        """التعرف على المكان من صورة"""
        try:
            # تحويل البايتات إلى صورة
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return None
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # استخراج الميزات
            keypoints, descriptors = self.sift.detectAndCompute(gray, None)
            
            if descriptors is None or len(descriptors) < 5:
                return None
            
            best_match = None
            best_score = 0
            best_matches_count = 0
            
            # مقارنة مع جميع الأماكن المرجعية
            for place_id, ref_descriptors in self.reference_descriptors.items():
                if ref_descriptors is None or len(ref_descriptors) < 10:
                    continue
                
                try:
                    # مطابقة الميزات باستخدام FLANN
                    matches = self.flann.knnMatch(descriptors, ref_descriptors, k=2)
                    
                    # تطبيق اختبار النسبة (Lowe's ratio test)
                    good_matches = []
                    for m, n in matches:
                        if m.distance < 0.7 * n.distance:
                            good_matches.append(m)
                    
                    # حساب درجة الثقة
                    if len(good_matches) > 0:
                        confidence = len(good_matches) / min(len(descriptors), len(ref_descriptors))
                        confidence = min(confidence * 2, 1.0)  # تطبيع
                        
                        if confidence > best_score and confidence >= min_confidence:
                            best_score = confidence
                            best_match = place_id
                            best_matches_count = len(good_matches)
                            
                except Exception as e:
                    continue
            
            if best_match and best_match in PLACES_DATA:
                place_data = PLACES_DATA[best_match]
                return PlaceMatch(
                    place_id=best_match,
                    place_name=place_data["name"],
                    place_name_ar=place_data["name_ar"],
                    confidence=best_score,
                    matched_features=best_matches_count,
                    description=place_data["description"],
                    description_ar=place_data["description_ar"],
                    category=place_data["category"],
                    location=place_data["location"]
                )
            
            return None
            
        except Exception as e:
            print(f"خطأ في التعرف: {e}")
            return None
    
    def recognize_with_color_histogram(self, image_bytes: bytes) -> Optional[PlaceMatch]:
        """التعرف باستخدام مخطط الألوان (طريقة بديلة)"""
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return None
            
            # حساب مخطط الألوان
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            hist = cv2.calcHist([hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
            cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
            
            # هذه طريقة مبسطة - في الإنتاج ستحتاج لقاعدة بيانات مخططات ألوان
            # للأماكن المختلفة
            
            return None
            
        except Exception as e:
            print(f"خطأ: {e}")
            return None
    
    def detect_landmarks(self, image_bytes: bytes) -> List[Dict]:
        """اكتشاف المعالم في الصورة"""
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return []
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # اكتشاف الزوايا باستخدام Harris
            corners = cv2.cornerHarris(gray, 2, 3, 0.04)
            corners = cv2.dilate(corners, None)
            
            # اكتشاف الحواف باستخدام Canny
            edges = cv2.Canny(gray, 50, 150)
            
            # اكتشاف الخطوط باستخدام Hough
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, 50, minLineLength=50, maxLineGap=10)
            
            landmarks = []
            
            # إضافة معلومات عن الميزات المكتشفة
            if corners is not None:
                landmarks.append({
                    "type": "corners",
                    "count": np.sum(corners > 0.01 * corners.max())
                })
            
            if lines is not None:
                landmarks.append({
                    "type": "lines",
                    "count": len(lines)
                })
            
            return landmarks
            
        except Exception as e:
            print(f"خطأ: {e}")
            return []
    
    def get_all_places(self) -> List[Dict]:
        """الحصول على جميع الأماكن المسجلة"""
        places = []
        for place_id, data in PLACES_DATA.items():
            has_reference = place_id in self.reference_descriptors and self.reference_descriptors[place_id] is not None
            places.append({
                "id": place_id,
                "name": data["name"],
                "name_ar": data["name_ar"],
                "category": data["category"],
                "has_reference_images": has_reference,
                "reference_count": len(self.reference_features.get(place_id, []))
            })
        return places


# إنشاء instance عام
recognizer = PlaceRecognizer()
