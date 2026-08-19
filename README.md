# 🎙️ Voice Chat App - تطبيق الشات الصوتي

تطبيق شات صوتي متكامل يشبه Yalla Chat مع دعم كامل للمكالمات الصوتية والنصية والمجموعات.

## ✨ المميزات الرئيسية

- 🎤 **مكالمات صوتية عالية الجودة** - بث صوتي فوري باستخدام WebRTC
- 💬 **الرسائل النصية** - دعم الدردشة الحية
- 👥 **المجموعات** - إنشاء وإدارة مجموعات دردشة
- 🔐 **المصادقة الآمنة** - تسجيل الدخول عبر البريد الإلكتروني
- 📱 **واجهة عصرية** - تصميم متجاوب React.js
- 💾 **قاعدة بيانات قوية** - MongoDB للتخزين الموثوق
- 🔄 **التحديثات الفورية** - Socket.io للاتصال المباشر

## 🛠️ التقنيات المستخدمة

### Frontend
- React.js + TypeScript
- Tailwind CSS للتصميم
- Socket.io Client للاتصال الحي
- WebRTC للمكالمات الصوتية

### Backend
- Node.js + Express.js
- Socket.io للبث الحي
- MongoDB + Mongoose
- JWT للمصادقة
- Multer لرفع الملفات

### البنية
```
voice-chat-app/
├── frontend/           # تطبيق React
├── backend/            # خادم Node.js
├── docker-compose.yml  # تشغيل محلي
├── .env.example        # متغيرات البيئة
└── README.md          # التوثيق
```

## 🚀 البدء السريع

### المتطلبات
- Node.js v16+
- MongoDB
- npm أو yarn

### التثبيت المحلي

```bash
# استنساخ المستودع
git clone https://github.com/omanysat-cmyk/voice-chat-app.git
cd voice-chat-app

# تثبيت المتعلقات
npm run install-all

# نسخ متغيرات البيئة
cp .env.example .env

# تشغيل التطبيق
npm run dev
```

الواجهة ستكون متاحة على: `http://localhost:3000`
الخادم على: `http://localhost:5000`

## 📦 التثبيت باستخدام Docker

```bash
docker-compose up -d
```

## 🌐 النشر على الإنتاج

### على Heroku
```bash
heroku create voice-chat-app
git push heroku main
```

### على Vercel (Frontend فقط)
```bash
npm run build
vercel deploy dist/
```

### على AWS
انظر `docs/deployment/AWS.md`

## 📖 التوثيق الكاملة

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture](./docs/ARCHITECTURE.md)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 الترخيص

MIT License - انظر [LICENSE](./LICENSE)

## 📧 التواصل

البريد: support@voicechat.local

---

**تم الإنشاء بواسطة:** Copilot
**آخر تحديث:** 2026-08-19
