"""
خادم Flask للتعرف على الأماكن
Flask Server for Place Recognition
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os

from place_recognition import recognizer, PLACES_DATA

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])


@app.route('/health', methods=['GET'])
def health():
    """فحص صحة الخدمة"""
    return jsonify({
        "status": "healthy",
        "service": "Riyadh AR Recognition Service",
        "version": "1.0.0"
    })


@app.route('/recognize', methods=['POST'])
def recognize_place():
    """التعرف على المكان من صورة"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                "success": False,
                "error": "لم يتم تقديم صورة"
            }), 400
        
        # فك تشفير الصورة من Base64
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        # إجراء التعرف
        min_confidence = data.get('min_confidence', 0.3)
        result = recognizer.recognize(image_bytes, min_confidence)
        
        if result:
            return jsonify({
                "success": True,
                "recognized": True,
                "place": {
                    "id": result.place_id,
                    "name": result.place_name,
                    "nameAr": result.place_name_ar,
                    "confidence": round(result.confidence * 100, 1),
                    "matchedFeatures": result.matched_features,
                    "description": result.description,
                    "descriptionAr": result.description_ar,
                    "category": result.category,
                    "location": result.location
                }
            })
        else:
            return jsonify({
                "success": True,
                "recognized": False,
                "message": "لم يتم التعرف على المكان"
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/detect-landmarks', methods=['POST'])
def detect_landmarks():
    """اكتشاف المعالم في الصورة"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                "success": False,
                "error": "لم يتم تقديم صورة"
            }), 400
        
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        landmarks = recognizer.detect_landmarks(image_bytes)
        
        return jsonify({
            "success": True,
            "landmarks": landmarks
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/add-reference', methods=['POST'])
def add_reference():
    """إضافة صورة مرجعية لمكان"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data or 'place_id' not in data:
            return jsonify({
                "success": False,
                "error": "بيانات ناقصة"
            }), 400
        
        place_id = data['place_id']
        
        if place_id not in PLACES_DATA:
            return jsonify({
                "success": False,
                "error": "معرف المكان غير صالح"
            }), 400
        
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        success = recognizer.add_reference_image_from_bytes(place_id, image_bytes)
        
        if success:
            return jsonify({
                "success": True,
                "message": f"تم إضافة صورة مرجعية للمكان {PLACES_DATA[place_id]['name_ar']}"
            })
        else:
            return jsonify({
                "success": False,
                "error": "فشل في إضافة الصورة المرجعية"
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/places', methods=['GET'])
def get_places():
    """الحصول على قائمة الأماكن"""
    return jsonify({
        "success": True,
        "places": recognizer.get_all_places()
    })


@app.route('/places/<place_id>', methods=['GET'])
def get_place(place_id):
    """الحصول على تفاصيل مكان"""
    if place_id not in PLACES_DATA:
        return jsonify({
            "success": False,
            "error": "المكان غير موجود"
        }), 404
    
    place = PLACES_DATA[place_id]
    has_reference = place_id in recognizer.reference_descriptors
    
    return jsonify({
        "success": True,
        "place": {
            "id": place_id,
            "name": place["name"],
            "nameAr": place["name_ar"],
            "description": place["description"],
            "descriptionAr": place["description_ar"],
            "category": place["category"],
            "location": place["location"],
            "hasReferenceImages": has_reference,
            "referenceCount": len(recognizer.reference_features.get(place_id, []))
        }
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 خدمة التعرف على الأماكن تعمل على المنفذ {port}")
    print(f"📍 عدد الأماكن المسجلة: {len(PLACES_DATA)}")
    app.run(host='0.0.0.0', port=port, debug=True)
