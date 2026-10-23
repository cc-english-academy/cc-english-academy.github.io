# Code Cademy

Single-page website (`index.html`) with a Supabase backend for accounts, club libraries, level exams, live Zoom sessions, plans & payments, homework, video lessons, a parent portal and chat.

**📘 Launch checklist (Arabic): [LAUNCH.md](LAUNCH.md)** — database setup, admin, email/SMTP, domain, backups, content and a pilot-test script.

Files: `index.html` (site + dashboard) · `assets/` (images, lesson videos, icons) · `supabase/schema.sql` (database) · `privacy.html`, `terms.html` (legal templates) · `manifest.webmanifest`.

## تشغيل الـ Backend (مرة واحدة فقط)

1. افتح مشروعك في [Supabase](https://supabase.com/dashboard) ← **SQL Editor** ← **New query**.
2. انسخ محتوى الملف `supabase/schema.sql` كاملاً والصقه، ثم اضغط **Run**.
   الملف آمن للتشغيل أكثر من مرة.
3. **اجعل نفسك المدير (مرة واحدة):** في SQL Editor شغّل السطر ده بعد ما تحط إيميلك:
   ```sql
   update public.profiles set role = 'admin'
    where id = (select id from auth.users where email = 'you@example.com');
   ```
   بعدها ادخل على الموقع وافتح **Users & roles** لترقية المعلمين، وراجع أي حساب "معلم" قديم سجّل نفسه بنفسه.
4. من **Authentication → Providers → Email**: لو فعّلت "Confirm email" فالحساب يُنشأ تلقائياً بعد التأكيد (عن طريق الـ trigger).
5. ارفع `index.html` على GitHub Pages (فرع `main`) — وبعد النشر اعمل تحديث للصفحة بـ **Ctrl + F5**.

### ماذا يضيف `schema.sql`
| الجزء | الوظيفة |
|---|---|
| الجداول | `profiles`, `materials`, `exam_questions`, `exam_attempts`, `progress`, `notifications`, `material_reads` |
| Row Level Security | الطالب يرى مواد ناديه فقط، والمعلم فقط يرفع/يحذف، ولا أحد يرقّي نفسه لمعلم |
| Storage | bucket `materials` (عام: المعاينات والفيديوهات والشهادات) + bucket `books` خاص للكتب الكاملة: تفتح للطالب اللي خطته مفعّلة (أو ولي أمره) والمعلمين، والباقي يقرأ أول 5 صفحات مجاناً |
| `get_exam` / `submit_exam` | تصحيح الامتحان على السيرفر — الإجابة الصحيحة لا تصل للمتصفح أبداً |
| `club_leaderboard` / `popular_materials` | لوحة أكثر الطلاب قراءة + أكثر الكتب فتحاً |
| Trigger `on_auth_user_created` | ينشئ الملف الشخصي تلقائياً عند التسجيل |
| Realtime | الكتب والإشعارات والرسائل الجديدة تظهر فوراً بدون تحديث الصفحة |
| الأدوار | التسجيل للطلاب وأولياء الأمور فقط — المعلم والمدير بترقية من المدير (`set_user_role`) |
| أولياء الأمور | `parent_links` + `link_child(code)` + `student_report` — ولي الأمر يربط ابنه بكود من ٦ رموز |
| الرسائل | `messages` + `chat_inbox` — محادثة لكل طالب (الطالب + ولي الأمر + المعلمين) مع رسائل خاصة لا يراها الطالب |
| الشهادات | `my_certificates` + `certificate_templates` — شهادة لكل مستوى ناجح، والمعلم يرفع تصميمها ويحدد مكان الاسم والتاريخ (لكل النوادي أو لنادٍ معيّن) |
| حصص Zoom | `sessions` + `session_links` + `bookings` + `book_session` — رابط Zoom يظهر فقط بعد الحجز، الحجز يتطلب خطة مفعّلة، لا حجزين في نفس الوقت، والإلغاء حتى ساعتين قبل الحصة. المعلم يقدر يفتح موعد أسبوعي متكرر مرة واحدة |
| الخطط والدفع | `plan_settings` (السعر وعدد الحصص والمدة — المدير يعدّلها من Enrollments) + `enrollments` + `payment_links` + `request_enrollment` — السعر يُحدَّد على السيرفر، والمعلم يفعّل بعد الدفع، وكل حجز يخصم حصة من الرصيد (`plan_status`) |
| التذكيرات | `scripts/reminders.mjs` كل ساعة من GitHub Actions: قبل الحصة بـ 3 ساعات (الطالب وولي الأمر والمعلم)، الواجب قبل موعده بيوم، والخطة قبل انتهائها بـ 3 أيام — إشعار داخل الموقع، وإيميل لو `RESEND_API_KEY` موجود |
| لوحة المدير | `academy_stats` — الطلاب المشتركين، المدفوعات المنتظرة، اشتراكات الشهر، نسبة الحضور، الواجبات المنتظرة، وتجديدات تحتاج متابعة |
| الواجبات | `assignments` + `submissions` — المعلم والطالب يرفعوا صور/فيديو/تسجيل صوتي/PDF في bucket خاص اسمه `homework` (روابط مؤقتة، ولي الأمر يشوف ملفات ابنه فقط). الطالب لا يستطيع وضع درجة لنفسه أو تعديل إجابة بعد تصحيحها |
| الفيديوهات | `lesson_videos` — تظهر للجميع في قسم Watch & Learn |
| إنستجرام | `instagram_posts` + `app_secrets` + `set_instagram_token` — مزامنة كل ساعة عبر `.github/workflows/instagram-sync.yml` ([INSTAGRAM.md](INSTAGRAM.md)) |

## Upload "Invalid key" fix
Supabase Storage keys must be plain ASCII. File names such as
`Conversation Club · Beginner Level A1-A2 _ Code Academy.pdf` (the `·`) or Arabic names were rejected.
The site now stores files under a safe key (`Conversation_Club/Beginner_A1-A2/<time>_<rand>_<name>.pdf`)
and keeps the original name in `materials.file_name`, which is used as the download file name.

## Features
- Roles: student / parent sign up themselves; teachers sign up as applicants and the admin approves them (Users & roles); admin is granted only by an admin
- 14 levels in 6 stages: Beginner 1–4 (A1), Elementary 5–6 (A2), Pre-Intermediate 7–8 (B1), Intermediate 9–10 (B1+), Upper-Intermediate 11–12 (B2), Advanced 13–14 (C1); each level opens after passing the exam of the one before
- Parent portal: link a child with a 6-character code, see streak, books, exams and teacher notes
- Messages: one conversation per student between the student, their parents and teachers, live, with private parent–teacher messages
- Certificates: printable certificate for every level passed
- Redesigned dashboard (icon sidebar, mobile-first), new landing section for students/parents/teachers, FAQ, scroll progress
- Drag & drop upload with progress, 50 MB check, auto-filled title and clear error messages (EN/AR)
- In-site reader for PDF, images, Word/PowerPoint, audio and video
- Search, "NEW" and "READ" badges, teacher delete
- Reading streak 🔥 with a 7-day strip, and a weekly top-readers leaderboard per club
- Live toasts when a teacher uploads a book or sends an announcement
- Free placement test: adaptive, 86-question bank, different questions on every attempt
- Exams graded on the server (falls back to the old in-browser grading until `schema.sql` is installed)
