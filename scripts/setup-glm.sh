#!/bin/bash
# ============================================
# GLM-4.7-Flash Setup Script for Riyadh Guide
# Model: unsloth/GLM-4.7-Flash-GGUF
# ============================================

echo "🚀 GLM-4.7-Flash Setup for Riyadh Tourism Platform"
echo "=================================================="

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo "📥 Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "✅ Ollama installed successfully!"
fi

# Check if Ollama is running
if ! pgrep -x "ollama" > /dev/null; then
    echo "🔄 Starting Ollama service..."
    ollama serve &
    sleep 3
fi

echo ""
echo "📦 Downloading GLM-4.7-Flash model..."
echo "   This is a 30B-A3B MoE (Mixture of Experts) model"
echo "   It may take some time depending on your internet speed..."
echo ""

# Download the model from Hugging Face via Ollama
# Using Q4_K_M quantization for good balance of quality and size
ollama pull hf.co/unsloth/GLM-4.7-Flash-GGUF:Q4_K_M

# Create an alias for easier usage
echo ""
echo "🔧 Creating model alias 'glm-4.7-flash'..."

# Create a Modelfile for the alias
cat > /tmp/Modelfile-glm << EOF
FROM hf.co/unsloth/GLM-4.7-Flash-GGUF:Q4_K_M

# Riyadh Tourism Guide System Prompt
SYSTEM """أنت مرشد سياحي ذكي ومتعدد اللغات لمدينة الرياض، المملكة العربية السعودية. 
لديك معرفة عميقة بجميع المعالم السياحية والتاريخية والثقافية في الرياض.
يمكنك:
- إنشاء خطط سياحية مخصصة
- وصف الأماكن التاريخية بالتفصيل
- تقديم معلومات عن الأحداث والمواسم
- الإجابة على أسئلة الزوار بلغات متعددة

You are a smart, multilingual tour guide for Riyadh, Saudi Arabia.
You have deep knowledge of all tourist, historical, and cultural landmarks in Riyadh."""

# Optimized parameters for tourism guide tasks
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 8192
EOF

ollama create glm-4.7-flash -f /tmp/Modelfile-glm
rm /tmp/Modelfile-glm

echo ""
echo "✅ GLM-4.7-Flash setup complete!"
echo ""
echo "📊 Testing the model..."
ollama run glm-4.7-flash "مرحباً! قدم نفسك كمرشد سياحي للرياض." --verbose

echo ""
echo "=================================================="
echo "🎉 Setup Complete!"
echo ""
echo "Available quantizations (run if you need different size):"
echo "  - Q2_K:    ~2.5GB  (Fastest, lower quality)"
echo "  - Q4_K_M:  ~4.5GB  (Recommended, good balance)"
echo "  - Q5_K_M:  ~5.5GB  (Higher quality)"
echo "  - Q8_0:    ~8GB    (Highest quality)"
echo ""
echo "To use a different quantization:"
echo "  ollama pull hf.co/unsloth/GLM-4.7-Flash-GGUF:Q8_0"
echo ""
echo "Start the web app with: npm run dev"
echo "=================================================="
