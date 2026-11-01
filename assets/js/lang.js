/* ===== Language switcher (EN / AR) ===== */
(function(){
  const DICT = {
    "Watch on Instagram":"شاهد على إنستجرام",
    "Instagram → website":"إنستجرام ← الموقع",
    "Videos you post on Instagram appear in Watch & Learn automatically, every hour.":"الفيديوهات التي تنشرها على إنستجرام تظهر في «شاهد وتعلّم» تلقائياً كل ساعة.",
    "Instagram access token":"رمز الوصول لإنستجرام",
    "Save token":"حفظ الرمز",
    "Checking…":"جارٍ التحقق…",
    "12 short questions, about 5 minutes. You get your level straight away — and the plan that fits it.":"١٢ سؤالاً قصيراً في حوالي ٥ دقائق. تعرف مستواك فوراً — والخطة المناسبة له.",
    "About 5 minutes.":"حوالي ٥ دقائق.",
    "Your result: your level from 1 to 9, with your mistakes explained.":"نتيجتك: مستواك من 1 لـ 9 مع شرح أخطائك.",
    "Your estimated level":"مستواك التقديري",
    "Start learning at this level":"ابدأ التعلّم من هذا المستوى",
    "See plans":"شاهد الخطط",
    "Retake":"أعد الاختبار",
    "Bank transfer":"تحويل بنكي",
    "Transfer to the academy's Al Rajhi account, then upload the receipt":"حوّل على حساب الأكاديمية في الراجحي، وبعدين ارفع الإيصال",
    "The account students transfer to. They see these details at checkout, transfer, and upload the receipt — you see the receipt here and switch the plan on.":"الحساب اللي الطلاب بيحوّلوا عليه. بيشوفوا البيانات دي وقت الدفع، يحوّلوا ويرفعوا الإيصال — وانتي تشوفي الإيصال هنا وتفعّلي الباقة.",
    "Bank":"البنك",
    "Account holder":"اسم صاحب الحساب",
    "Save bank details":"احفظ بيانات الحساب",
    "Press a level to see its books.":"اضغط على أي مستوى عشان تشوف كتبه.",
    "Students of this club and level who have paid for a plan can read the whole book at once; other students see only the first pages.":"طلاب النادي والمستوى ده اللي دفعوا الاشتراك بيقروا الكتاب كامل على طول، وباقي الطلاب بيشوفوا أول صفحات بس.",
    "Code Cademy is an independent English-language academy. It is not affiliated with Codecademy.com or any other company.":"Code Cademy أكاديمية مستقلة لتعليم اللغة الإنجليزية، وليست تابعة لموقع Codecademy.com ولا لأي شركة أخرى.",
    "Students, parents and teachers of Code Cademy English academy sign in here with the phone number they registered. We never ask for card details here.":"طلاب وأولياء أمور ومعلمي أكاديمية Code Cademy للغة الإنجليزية بيسجّلوا دخولهم هنا برقم الهاتف اللي سجّلوا بيه. إحنا مش بنطلب بيانات الكارت هنا أبداً.",
    "Phone number":"رقم الهاتف",
    "Phone number (you sign in with it)":"رقم الهاتف (هتدخل بيه)",
    "Message the academy on WhatsApp from your phone number, and the admin will set a new password for you.":"ابعت رسالة للأكاديمية على واتساب من رقمك، والمدير هيعملك كلمة مرور جديدة.",
    "💬 Message the academy on WhatsApp":"💬 كلّم الأكاديمية على واتساب",
    "Accredited academy":"أكاديمية معتمدة",
    "An Approved CPD Provider.":"مزوّد معتمد من CPD.",
    "Code Cademy is an Approved CPD Provider and a member of CPD Accreditation International.":"أكاديمية Code Cademy مزوّد تدريب معتمد (Approved CPD Provider) وعضو في CPD Accreditation International.",
    "Provider No.":"رقم المزوّد",
    "Since":"من",
    "Valid until":"سارية حتى",
    "View the certificate":"شوف شهادة الاعتماد",
    "Last step: a little writing":"آخر خطوة: شوية كتابة",
    "Write 3–5 sentences in English about yourself: your family, your day or what you like doing.":"اكتب من ٣ لـ٥ جمل بالإنجليزي عن نفسك: عيلتك، يومك، أو بتحب تعمل إيه.",
    "See my level":"شوف مستواي",
    "Skip":"تخطّي",
    "Review your mistakes":"راجع أخطاءك",
    "Certificate design":"تصميم الشهادة",
    "Upload your own certificate artwork, then drag the name and date onto the right places. Students get the new design automatically when they pass a level.":"ارفع تصميم الشهادة الخاص بك، ثم اسحب الاسم والتاريخ لأماكنهما. يحصل الطلاب على التصميم الجديد تلقائياً عند النجاح في أي مستوى.",
    "Use this design for":"استخدم هذا التصميم لـ",
    "Certificate image":"صورة الشهادة",
    "Choose image":"اختر صورة",
    "JPG or PNG, landscape, at least 1600 px wide":"JPG أو PNG، بالعرض، ١٦٠٠ بكسل على الأقل",
    "Text colour":"لون الكتابة",
    "Drag the labels on the preview —":"اسحب العناوين على المعاينة —",
    "Name":"الاسم",
    "Date":"التاريخ",
    "Details":"التفاصيل",
    "Save design":"حفظ التصميم",
    "Back to the default design":"الرجوع للتصميم الافتراضي",
    "Seat booked — your Zoom Meeting link is under My bookings.":"تم حجز مقعدك — رابط اجتماع Zoom موجود في «حجوزاتي».",
    "Booking cancelled.":"تم إلغاء الحجز.",
    "Session deleted.":"تم حذف الحصة.",
    "Repeat":"التكرار",
    "Just once":"مرة واحدة",
    "Every week · 2 weeks":"كل أسبوع · أسبوعين",
    "Every week · 4 weeks":"كل أسبوع · 4 أسابيع",
    "Every week · 8 weeks":"كل أسبوع · 8 أسابيع",
    "Every week · 12 weeks":"كل أسبوع · 12 أسبوعاً",
    "Students in that club see the time right away. Your Zoom Meeting link stays hidden until a student books a seat. Students can cancel up to 2 hours before the start.":"يرى طلاب النادي الموعد فوراً. يبقى رابط Zoom مخفياً حتى يحجز الطالب مقعداً. يمكن للطالب الإلغاء حتى ساعتين قبل البداية.",
    "Time opened — students in that club can book it now.":"تم فتح الموعد — يمكن لطلاب النادي حجزه الآن.",
    "Please pick a time in the future.":"اختر موعداً في المستقبل.",
    "Video added — it is now on the website in Watch & Learn.":"تمت إضافة الفيديو — يظهر الآن في قسم «شاهد وتعلّم».",
    "Video deleted.":"تم حذف الفيديو.",
    "← Back":"→ السابق",
    "Next →":"التالي ←",
    "Start the exam":"ابدأ الامتحان",
    "This level is locked":"هذا المستوى مغلق",
    "Books":"الكتب",
    "Every club book, readable right here":"كل كتب النادي، تقرأها هنا مباشرة",
    "Level exams and printable certificates":"امتحانات مستويات وشهادات قابلة للطباعة",
    "Parents and teachers, one tap apart":"ولي الأمر والمعلم على بُعد ضغطة",
    "Level 4 passed":"اجتاز المستوى 4",
    "I want to learn":"أريد أن أتعلّم",
    "I follow my child":"أتابع ابني",
    "Parent":"ولي أمر",
    "Welcome back,":"مرحباً بعودتك،",
    "My children":"أبنائي",
    "Users & roles":"المستخدمون والصلاحيات",
    "Connect your parent":"اربط ولي أمرك",
    "Share this code so your parent can follow your progress and message your teachers.":"شارك هذا الكود مع ولي أمرك ليتابع تقدّمك ويراسل معلميك.",
    "Add a child with their 6-character code":"أضف ابنك باستخدام الكود المكوّن من ٦ رموز",
    "Link child":"اربط الابن",
    "Your child finds the code on their dashboard, under Overview or Profile.":"يجد ابنك الكود في لوحة التحكم الخاصة به، في «نظرة عامة» أو «الملف الشخصي».",
    "Follow reading, exams and teacher notes — and message the teachers directly.":"تابع القراءة والامتحانات وملاحظات المعلمين — وراسل المعلمين مباشرة.",
    "Talk with teachers, students and parents in one place.":"تواصل مع المعلمين والطلاب وأولياء الأمور في مكان واحد.",
    "Select a conversation":"اختر محادثة",
    "Pick a conversation to start chatting.":"اختر محادثة لتبدأ الدردشة.",
    "Private — only parents & teachers see it":"خاصة — يراها أولياء الأمور والمعلمون فقط",
    "Pass a level exam and your certificate appears here — ready to print or share.":"انجح في امتحان المستوى وستظهر شهادتك هنا — جاهزة للطباعة أو المشاركة.",
    "Only you can make someone a teacher. New sign-ups are students or parents.":"أنت فقط من يمنح صلاحية المعلم. التسجيلات الجديدة تكون طلاباً أو أولياء أمور.",
    "Parents":"أولياء الأمور",
    "Teachers":"المعلمون",
    "Parent link code":"كود ربط ولي الأمر",
    "Close":"إغلاق",
    "Parent / guardian":"ولي أمر",
    "Teachers: your account is created by the academy admin.":"المعلمون: يتم إنشاء حسابكم بواسطة إدارة الأكاديمية.",
    "One platform · three experiences":"منصة واحدة · ثلاث تجارب",
    "Students learn. Parents follow. Teachers lead.":"الطالب يتعلّم. ولي الأمر يتابع. المعلم يقود.",
    "Books, level exams, certificates and real conversations between home and class — in Arabic and English, on any device.":"كتب وامتحانات مستويات وشهادات وتواصل حقيقي بين البيت والفصل — بالعربية والإنجليزية، على أي جهاز.",
    "For students":"للطلاب",
    "For parents":"لأولياء الأمور",
    "For teachers":"للمعلمين",
    "Read every club book right inside the site":"اقرأ كل كتب النادي داخل الموقع مباشرة",
    "Daily reading streaks and a weekly top-readers board":"سلسلة قراءة يومية ولوحة لأكثر القرّاء أسبوعياً",
    "Level exams that unlock the next level":"امتحانات مستوى تفتح المستوى التالي",
    "A printable certificate for every level passed":"شهادة قابلة للطباعة لكل مستوى تنجح فيه",
    "Link your child with one short code":"اربط ابنك بكود قصير واحد",
    "See books read, exam results and teacher notes":"شاهد الكتب المقروءة ونتائج الامتحانات وملاحظات المعلمين",
    "Chat directly with your child’s teachers":"تحدّث مباشرة مع معلمي ابنك",
    "Private notes only parents and teachers can see":"ملاحظات خاصة لا يراها إلا ولي الأمر والمعلمون",
    "Drag & drop books into any club and level":"اسحب وأفلت الكتب في أي نادٍ ومستوى",
    "Build exams — graded automatically and securely":"أنشئ امتحانات — تُصحَّح تلقائياً وبأمان",
    "Log attendance and progress in seconds":"سجّل الحضور والتقدّم في ثوانٍ",
    "Announcements that reach every family instantly":"إعلانات تصل لكل أسرة فوراً",
    "She led the role-play today 👏":"قادت تمثيل الأدوار اليوم 👏",
    "That’s wonderful, thank you!":"رائع، شكراً جزيلاً!",
    "Uploaded to Reading Club · A1–A2":"تم الرفع إلى نادي القراءة · A1–A2",
    "New":"جديد",
    "Create a free account":"أنشئ حساباً مجانياً",
    "Questions":"أسئلة",
    "Good to know":"معلومات تهمّك",
    "How does my child start?":"كيف يبدأ ابني؟",
    "Create a student account, pick the club, and start at the Beginner level. Each level ends with a short exam — pass it with 70% and the next level unlocks, along with a certificate.":"أنشئ حساب طالب واختر النادي وابدأ من المستوى المبتدئ. ينتهي كل مستوى بامتحان قصير — بالنجاح بنسبة ٧٠٪ يُفتح المستوى التالي مع شهادة.",
    "How do parents follow their child?":"كيف يتابع ولي الأمر ابنه؟",
    "Create a parent account, then enter the 6-character code from your child’s dashboard. You’ll see books read, exam results and teacher notes, and you can message the teachers directly.":"أنشئ حساب ولي أمر، ثم أدخل الكود المكوّن من ٦ رموز من لوحة تحكم ابنك. سترى الكتب المقروءة ونتائج الامتحانات وملاحظات المعلمين، ويمكنك مراسلة المعلمين مباشرة.",
    "Can students see the private messages between parents and teachers?":"هل يرى الطالب الرسائل الخاصة بين ولي الأمر والمعلمين؟",
    "No. Parents and teachers can mark a message as private — those are visible only to the child’s parents and the teachers.":"لا. يمكن لولي الأمر والمعلم جعل الرسالة خاصة — ولا يراها إلا أولياء أمور الطالب والمعلمون.",
    "How do teachers get an account?":"كيف يحصل المعلم على حساب؟",
    "Teacher accounts are created by the academy. Teachers sign up normally and the admin gives them teacher access.":"حسابات المعلمين تُمنح من الأكاديمية. يسجّل المعلم بشكل عادي ثم تمنحه الإدارة صلاحية المعلم.",
    "Does it work on phones and in Arabic?":"هل يعمل على الموبايل وبالعربية؟",
    "Yes — the whole site, dashboard and chat work on any phone, tablet or computer, in both Arabic and English.":"نعم — الموقع ولوحة التحكم والدردشة تعمل على أي موبايل أو تابلت أو كمبيوتر، بالعربية والإنجليزية.",
    "Join as a student, a parent or a teacher — it takes a minute.":"انضم كطالب أو ولي أمر أو معلم — الأمر يستغرق دقيقة.",
    "Drag a book here, or click to choose a file":"اسحب كتاباً هنا أو اضغط لاختيار ملف",
    "PDF, Word, EPUB, PowerPoint or image · up to 50 MB · Arabic file names are fine":"PDF أو Word أو EPUB أو PowerPoint أو صورة · حتى 50 ميجابايت · الأسماء العربية مقبولة",
    "day reading streak":"يوم متتالٍ من القراءة",
    "Top readers this week":"الأكثر قراءةً هذا الأسبوع",
    "Download":"تحميل",
    "Forgot your password?":"نسيت كلمة المرور؟",
    "Type the email you signed up with and we'll send you a link to choose a new password.":"اكتب البريد الذي سجّلت به وسنرسل لك رابطاً لاختيار كلمة مرور جديدة.",
    "Send reset link":"أرسل رابط الاستعادة",
    "← Back to sign in":"← العودة لتسجيل الدخول",
    "Choose a new password for your account.":"اختر كلمة مرور جديدة لحسابك.",
    "New password (6+ characters)":"كلمة المرور الجديدة (٦ أحرف فأكثر)",
    "Repeat the new password":"أعد كتابة كلمة المرور الجديدة",
    "Save new password":"احفظ كلمة المرور",
    "I agree to the":"أوافق على",
    "Terms":"الشروط",
    "and":"و",
    "Privacy Policy":"سياسة الخصوصية",
    "Terms & refund policy":"الشروط وسياسة الاسترجاع",
    "Privacy":"الخصوصية",
    "Refunds":"الاسترجاع",
    "Add many questions at once":"أضف أسئلة كثيرة مرة واحدة",
    "Upload a CSV file with 5 columns: question, correct answer, wrong 1, wrong 2, wrong 3 (first row = headers). Works with Excel → “Save as CSV UTF-8”.":"ارفع ملف CSV فيه ٥ أعمدة: السؤال، الإجابة الصحيحة، خطأ ١، خطأ ٢، خطأ ٣ (الصف الأول عناوين). يعمل من Excel ← «حفظ باسم CSV UTF-8».",
    "📄 Choose CSV file":"📄 اختر ملف CSV",
    "Download a sample file":"حمّل ملف مثال",
    /* v4: video lessons */
    "Watch & Learn":"شاهد وتعلّم",
    "Short English lessons you'll actually finish.":"دروس إنجليزي قصيرة ستكملها فعلاً.",
    "Pick a lesson, watch it with sound, and tap any word to hear how it's said. Each one takes less than a minute.":"اختر درساً، وشاهده بالصوت، واضغط أي كلمة لتسمع نطقها. كل درس أقل من دقيقة.",
    "Tap a word to hear it":"اضغط على كلمة لتسمعها",
    "Previous":"السابق",
    "Next lesson":"الدرس التالي",
    "Now playing":"يُعرض الآن",
    "Vocabulary":"مفردات",
    "Culture":"ثقافة",
    "Farm Animals":"حيوانات المزرعة",
    "Zoo Animals":"حيوانات الحديقة",
    "Fruits":"الفواكه",
    "More Fruits":"المزيد من الفواكه",
    "Getting Around":"التنقّل",
    "Saudi National Day":"اليوم الوطني السعودي",
    "Watch all lessons":"شاهد كل الدروس",
    "Zoom Meeting":"مباشر على زوم",
    "Level up!":"ارتقِ!",
    "My Dashboard":"لوحتي",
    "Sound on or off":"تشغيل أو كتم الصوت",
    /* v3: English-only, live sessions */
    "Clubs":"النوادي",
    "Zoom Meetings":"الحصص المباشرة",
    "Live English classes via Zoom Meeting":"حصص إنجليزي مباشرة على زوم",
    "Where English becomes":"حيث تتحوّل الإنجليزية إلى",
    "English immersion clubs, Zoom Meetings with real teachers, and books that unlock level by level. Pick a club and start speaking from day one.":"نوادٍ للانغماس في الإنجليزية، وحصص زوم مباشرة مع معلمين حقيقيين، وكتب تُفتح مستوىً بعد مستوى. اختر ناديك وابدأ الكلام من اليوم الأول.",
    "Book a Zoom Meeting":"احجز حصة مباشرة",
    "Explore the clubs":"استكشف النوادي",
    "English clubs":"نوادٍ إنجليزية",
    "levels":"مستويات",
    "full CEFR range":"كامل نطاق CEFR",
    "How are you?":"كيف حالك؟",
    "Well done!":"أحسنت!",
    "How it works":"كيف يعمل",
    "From “hello” to fluent, in four clear steps.":"من «مرحباً» إلى الطلاقة في أربع خطوات واضحة.",
    "Pick a club, book time with a real teacher, read at your level, and pass the exam to move up. That's the whole loop.":"اختر نادياً، واحجز وقتاً مع معلم حقيقي، واقرأ بمستواك، واجتز الاختبار لترتقي. هذه هي الدورة كاملة.",
    "Pick your club":"اختر ناديك",
    "Phonics, Reading, Writing, Grammar, Speaking, Conversation or Cinema — seven clubs, one for every goal.":"الأصوات، القراءة، الكتابة، القواعد، التحدث، المحادثة أو السينما — سبعة نوادٍ، لكل هدف نادٍ.",
    "Choose a time your teacher has opened. Your Zoom Meeting link appears the moment you book.":"اختر موعداً فتحه معلمك. يظهر رابط زوم فور الحجز.",
    "Learn level by level":"تعلّم مستوىً بعد مستوى",
    "Read your club's books at your level — 9 levels, from Level 1 to Level 9.":"اقرأ كتب ناديك بمستواك — 9 مستويات من المستوى 1 للمستوى 9.",
    "Pass and level up":"انجح وارتقِ",
    "Score 70% or more on the level exam and the next level unlocks.":"احصل على 70% أو أكثر في اختبار المستوى ليُفتح المستوى التالي.",
    "Zoom Meeting":"مباشر على زوم",
    "Book a Zoom Meeting with your teacher.":"احجز مقعداً مع معلمك.",
    "Teachers open their available times first. You pick a slot that suits you, book your seat, and your Zoom Meeting link appears — with a one-click add to your calendar.":"يفتح المعلمون مواعيدهم المتاحة أولاً. تختار الموعد المناسب لك وتحجز مقعدك فيظهر رابط زوم — مع إضافته إلى تقويمك بنقرة.",
    "Teachers publish their real availability — you only ever see times that can actually be booked.":"ينشر المعلمون أوقاتهم الفعلية — فلا ترى إلا مواعيد قابلة للحجز فعلاً.",
    "Every seat is counted, so a session is never overbooked.":"كل مقعد محسوب، فلا يُحجز أكثر من الطاقة أبداً.",
    "Your Zoom Meeting link unlocks the moment you book, and stays private until then.":"يُفتح رابط زوم فور حجزك، ويبقى خاصاً قبل ذلك.",
    "Times show in your own time zone, wherever you are.":"تظهر المواعيد بتوقيتك المحلي أينما كنت.",
    "Sign in to book":"سجّل الدخول للحجز",
    "Preview":"معاينة",
    "This week · example times":"هذا الأسبوع · مواعيد توضيحية",
    "Sun":"الأحد",
    "Tue":"الثلاثاء",
    "Thu":"الخميس",
    "Ordering food — speaking practice":"طلب الطعام — تدريب على التحدث",
    "Describing your day":"وصف يومك",
    "Movie night: talking about films":"ليلة أفلام: الحديث عن الأفلام",
    "45 min · 3 seats left":"45 دقيقة · 3 مقاعد متبقية",
    "45 min · 1 seat left":"45 دقيقة · مقعد واحد متبقٍ",
    "60 min · 5 seats left":"60 دقيقة · 5 مقاعد متبقية",
    "Book":"احجز",
    "Booked ✓":"تم الحجز ✓",
    "Don't just study English. Use it.":"لا تدرس الإنجليزية فقط. استخدمها.",
    "Clear lessons, no filler":"دروس واضحة بلا حشو",
    "Reading, writing and grammar drills":"تدريبات القراءة والكتابة والقواعد",
    "Speak":"تحدّث",
    "A Zoom Meeting with a real teacher":"وقت مباشر على زوم مع معلم حقيقي",
    "Level up":"ارتقِ",
    "Pass the exam, unlock the next level":"اجتز الاختبار وافتح المستوى التالي",
    "Automated reminders, progress tracking, and WhatsApp notifications keep your streak going and nudge you back to your next Zoom Meeting — without anyone typing a message by hand.":"تذكيرات آلية وتتبّع للتقدم وإشعارات واتساب تُبقيك مستمراً وتُعيدك إلى حصتك المباشرة القادمة — دون أن يكتب أحد رسالة يدوياً.",
    "Choose your club":"اختر ناديك",
    "Phonics to Cinema — seven to pick from":"من الأصوات إلى السينما — سبعة نوادٍ للاختيار",
    "Start at your level":"ابدأ من مستواك",
    "Everyone begins at Beginner (A1-A2)":"يبدأ الجميع من المبتدئ (A1-A2)",
    "Read and learn":"اقرأ وتعلّم",
    "Your club's books, level by level":"كتب ناديك، مستوىً بعد مستوى",
    "Join a Zoom Meeting":"انضم إلى الحصص المباشرة",
    "Book Zoom time with your teacher":"احجز وقت زوم مع معلمك",
    "Pass the exam":"اجتز الاختبار",
    "70% or more unlocks the next level":"70% أو أكثر يفتح المستوى التالي",
    "Track your progress":"تابع تقدمك",
    "Attendance and teacher notes in your dashboard":"الحضور وملاحظات المعلم في لوحتك",
    "Keep growing":"واصل النمو",
    "Reach Advanced (C1-C2) and beyond":"صِل إلى المتقدم (C1-C2) وما بعده",
    "Nothing here is random — each step is built on the one before it, from choosing a club to staying sharp long after you finish.":"لا شيء هنا عشوائي — كل خطوة مبنية على التي قبلها، من اختيار النادي إلى البقاء متمكناً بعد أن تنتهي بفترة طويلة.",
    "English Clubs":"النوادي الإنجليزية",
    "Phonics":"الأصوات",
    "Reading":"القراءة",
    "Writing":"الكتابة",
    "Grammar":"القواعد",
    "Speaking":"التحدث",
    "Conversation":"المحادثة",
    "Cinema":"السينما",
    "Club Library":"مكتبة النادي",
    "Level Exams":"اختبارات المستويات",
    "Code Cademy · English Immersion Academy":"Code Cademy · أكاديمية الانغماس في الإنجليزية",
    "Zoom Meetings":"الحصص المباشرة",
    "Zoom Meetings you host":"الحصص المباشرة التي تستضيفها",
    "Book a Zoom Meeting with your teacher.":"احجز حصة زوم مع معلمك.",
    "Open times for your students to book. Your Zoom Meeting link stays private until a student books a seat.":"افتح مواعيد ليحجزها طلابك. يبقى رابط زوم خاصاً حتى يحجز طالب مقعداً.",
    "Times are shown in your local time zone:":"المواعيد معروضة بتوقيتك المحلي:",
    "Topic":"الموضوع",
    "Date and time":"التاريخ والوقت",
    "Length":"المدة",
    "Seats":"المقاعد",
    "Zoom Meeting link":"رابط زوم",
    "30 minutes":"30 دقيقة",
    "45 minutes":"45 دقيقة",
    "60 minutes":"60 دقيقة",
    "90 minutes":"90 دقيقة",
    "Open this time for booking":"افتح هذا الموعد للحجز",
    "Students in that club see the time right away. Your Zoom Meeting link stays hidden until a student books a seat.":"يرى طلاب النادي الموعد فوراً. يبقى رابط زوم مخفياً حتى يحجز طالب مقعداً.",
    "Open times in your club":"المواعيد المتاحة في ناديك",
    "Your upcoming sessions":"حصصك القادمة",
    "My bookings":"حجوزاتي",
    "min":"دقيقة",
    "booked":"محجوز",
    "seats left":"مقاعد متبقية",
    "Full":"مكتمل",
    "No bookings yet":"لا حجوزات بعد",
    "Start Zoom Meeting":"ابدأ زوم",
    "Delete":"احذف",
    "Book this seat":"احجز هذا المقعد",
    "Join Zoom Meeting":"انضم عبر زوم",
    "Add to calendar":"أضف إلى التقويم",
    "Cancel booking":"إلغاء الحجز",
    "You have no upcoming sessions — open a time above and your students can book it.":"لا توجد حصص قادمة — افتح موعداً بالأعلى ليحجزه طلابك.",
    "No open times yet — check back soon, or ask your teacher.":"لا مواعيد متاحة بعد — عُد قريباً أو اسأل معلمك.",
    "No bookings yet.":"لا حجوزات بعد.",
    "Next Zoom Meeting":"الحصة المباشرة القادمة",
    "No sessions yet":"لا حصص بعد",
    "Open a time so your students can book a seat.":"افتح موعداً ليحجز طلابك مقعداً.",
    "Book your first Zoom Meeting with your teacher.":"احجز أول اجتماع زوم مع معلمك.",
    "Open a time":"افتح موعداً",
    "See open times":"شاهد المواعيد المتاحة",
    /* nav */
    "Home":"الرئيسية",
    "IT Academy":"أكاديمية التقنية",
    "Languages Academy":"أكاديمية اللغات",
    "Club Library":"مكتبة النوادي",
    "Videos":"الفيديوهات",
    "Collaboration":"التعاون",
    "Contact":"تواصل معنا",
    "Start Learning":"ابدأ التعلم",

    /* hero */
    "Where skills become":"حيث تتحوّل المهارات إلى",
    "Two clear worlds, built with intent: technology and language. Pick a path, and start building something real from day one.":"عالمان واضحان بُنيا بعناية: التقنية واللغة. اختر مسارك، وابدأ في بناء شيء حقيقي من اليوم الأول.",
    "Live classes for curious kids":"حصص حية لأطفال فضوليين",
    "Kids · Ages 6–12":"الأطفال · من 6 إلى 12 سنة",
    "Lesson 01 · Meet the Alphabet":"الدرس 01 · تعرّف على الحروف",
    "Explore IT Academy":"استكشف أكاديمية التقنية",
    "Explore Languages Academy":"استكشف أكاديمية اللغات",
    "departments":"أقسام",
    "courses":"كورس",
    "practice cards":"بطاقة تدريب",

    /* split */
    "Build Your Digital Future":"ابنِ مستقبلك الرقمي",
    "Digital skills, coding and programming for Kids, Teens & Adults — from your first line of code to networking, office productivity, connected devices, and workflows that run on their own.":"مهارات رقمية وبرمجة للأطفال والمراهقين والكبار — من أول سطر كود إلى الشبكات وبرامج المكاتب والأجهزة المتصلة وسير العمل الذي يعمل تلقائياً.",
    "Programming":"البرمجة",
    "Networking":"الشبكات",
    "MS Office":"برامج الأوفيس",
    "IoT":"إنترنت الأشياء",
    "See all four departments ↗":"شاهد الأقسام الأربعة ↗",
    "Speak With Confidence":"تحدّث بثقة",
    "English & French for Kids, Teens & Adults — learn through real communication and steady practice, in paths built around your age, level, and goals.":"الإنجليزية والفرنسية للأطفال والمراهقين والكبار — تعلّم عبر التواصل الحقيقي والتدريب المستمر، في مسارات مبنية على عمرك ومستواك وأهدافك.",
    "English":"الإنجليزية",
    "French":"الفرنسية",
    "Translation":"الترجمة",
    "See paths by age and level ↗":"شاهد المسارات حسب العمر والمستوى ↗",

    /* strip */
    "Learn. Practice. Experience.":"تعلّم. تدرّب. عايش التجربة.",
    "Practical learning":"تعلّم عملي",
    "Interactive activities":"أنشطة تفاعلية",
    "Real-life situations":"مواقف من الحياة الواقعية",
    "Original educational content":"محتوى تعليمي أصلي",

    /* clubs */
    "English Immersion":"المعايشة الإنجليزية",
    "Learn by living it.":"تعلّم بالمعايشة.",
    "Practical learning and real-life language use, built around seven specialized clubs.":"تعلّم عملي واستخدام حقيقي للغة، من خلال سبعة نوادٍ متخصصة.",
    "Phonics Club":"نادي الصوتيات",
    "Master letter sounds and blends — the building blocks of confident reading.":"إتقان أصوات الحروف ومزجها — أساس القراءة بثقة.",
    "Reading Club":"نادي القراءة",
    "Build reading, phonics, vocabulary & comprehension skills.":"تنمية مهارات القراءة والصوتيات والمفردات والاستيعاب.",
    "Writing Club":"نادي الكتابة",
    "Develop writing skills through guided and creative activities.":"تطوير مهارات الكتابة عبر أنشطة موجّهة وإبداعية.",
    "Grammar Club":"نادي القواعد",
    "Learn and practice grammar through real-life examples.":"تعلّم القواعد وتدرّب عليها من خلال أمثلة واقعية.",
    "Speaking Club":"نادي المحادثة",
    "Build confidence and express yourself naturally in English.":"اكتسب الثقة وعبّر عن نفسك بطلاقة بالإنجليزية.",
    "Conversation Club":"نادي الحوار",
    "Practice everyday conversations and communicate confidently.":"تدرّب على محادثات الحياة اليومية وتواصل بثقة.",
    "Cinema Club":"نادي السينما",
    "Watch, discuss and retell English stories through film.":"مشاهدة القصص الإنجليزية عبر الأفلام ومناقشتها وإعادة سردها.",
    "“C‑A‑T… cat!”":"«C-A-T... cat!»",
    "“What do you think happens next?”":"«في رأيك، هيحصل إيه بعد كده؟»",
    "“She opened the letter, and everything changed.”":"«فتحت الرسالة، وتغيّر كل شيء.»",
    "“Dear Mr Hassan, I'm writing about my order…”":"«عزيزي السيد حسن، أكتب إليك بخصوص طلبي…»",
    "“Could I get a flat white, please?”":"«ممكن فلات وايت من فضلك؟»",
    "“I've been waiting since eight.”":"«أنا أنتظر منذ الساعة الثامنة.»",
    "“So what do you usually do on Fridays?”":"«إذاً، ماذا تفعل عادةً يوم الجمعة؟»",

    /* library teaser + dashboard */
    "Your own dashboard — books, attendance and progress, in one place.":"لوحتك الخاصة — الكتب والحضور والتقدّم في مكان واحد.",
    "Sign in to reach a real, dedicated page for your club: materials to download, progress tracked over time, and announcements from your teacher — built for students and teachers alike.":"سجّل دخولك للوصول إلى صفحة حقيقية خاصة بناديك: مواد للتحميل، ومتابعة تقدّم مستمرة، وإعلانات من معلمك — مبنية للطلاب والمعلمين معاً.",
    "Sign in":"تسجيل الدخول",
    "Sign in / My Dashboard":"تسجيل الدخول / لوحتي",
    "Create an account":"إنشاء حساب",
    "Welcome back":"أهلاً بعودتك",
    "Sign in to reach your dashboard.":"سجّل دخولك للوصول إلى لوحتك.",
    "Create your account":"أنشئ حسابك",
    "Join as a student or a teacher — it takes a minute.":"انضم كطالب أو معلم — الأمر يستغرق دقيقة.",
    "Sign up":"إنشاء حساب",
    "Full name":"الاسم الكامل",
    "Email":"البريد الإلكتروني",
    "Password":"كلمة المرور",
    "Password (6+ characters)":"كلمة المرور (٦ أحرف فأكثر)",
    "I am a…":"أنا…",
    "Student":"طالب",
    "Teacher":"معلم",
    "Create account":"إنشاء الحساب",
    "← Back to website":"← العودة للموقع",
    "View website":"عرض الموقع",
    "Sign out":"تسجيل الخروج",
    "Overview":"نظرة عامة",
    "Materials":"المواد",
    "My Progress":"تقدّمي",
    "Students":"الطلاب",
    "Notifications":"الإشعارات",
    "Profile":"الملف الشخصي",
    "Here's what's new in your club.":"إليك آخر مستجدات ناديك.",
    "Materials":"المواد",
    "Upload & manage books and materials":"ارفع وأدر الكتب والمواد",
    "Pick a club, attach a file, and every student in that club sees it right away.":"اختر نادياً، وأرفق ملفاً، وسيراه كل طالب في هذا النادي فوراً.",
    "Club":"النادي",
    "Title":"العنوان",
    "File (PDF, image, or document)":"الملف (PDF أو صورة أو مستند)",
    "Upload to club":"ارفع إلى النادي",
    "Every student in that club sees it immediately.":"سيراه كل طالب في هذا النادي فوراً.",
    "All":"الكل",
    "Phonics":"الصوتيات",
    "Reading":"القراءة",
    "Writing":"الكتابة",
    "Grammar":"القواعد",
    "Speaking":"المحادثة",
    "Conversation":"الحوار",
    "Cinema":"السينما",
    "My progress":"تقدّمي",
    "Attendance and notes your teacher has logged for you.":"الحضور والملاحظات التي سجّلها معلمك من أجلك.",
    "Students & progress":"الطلاب والتقدّم",
    "Add an attendance or progress note for any student.":"أضف ملاحظة حضور أو تقدّم لأي طالب.",
    "Status":"الحالة",
    "Present":"حاضر",
    "Absent":"غائب",
    "Improved":"تحسّن",
    "Needs practice":"يحتاج تدريباً",
    "Note":"ملاحظة",
    "Add progress entry":"أضف ملاحظة تقدّم",
    "Announcements from your teachers.":"إعلانات من معلميك.",
    "Send an announcement to one club or to everyone.":"أرسل إعلاناً لنادٍ واحد أو للجميع.",
    "Send to":"إرسال إلى",
    "All clubs":"كل النوادي",
    "Message":"الرسالة",
    "Send notification":"إرسال الإشعار",
    "Your account details.":"بيانات حسابك.",
    "Role":"الدور",
    "Save changes":"حفظ التغييرات",

    /* levels & exams */
    "Level":"المستوى",
    "Beginner (A1-A2)":"مبتدئ (A1-A2)",
    "Intermediate (B1-B2)":"متوسط (B1-B2)",
    "Advanced (C1-C2)":"متقدم (C1-C2)",
    "🔒 Finish the previous level and pass its exam to unlock this one.":"🔒 أنهِ المستوى السابق وانجح في امتحانه لفتح هذا المستوى.",
    "No materials for this level yet.":"لا توجد مواد لهذا المستوى بعد.",
    "Ready to move up? Pass this level's exam to unlock the next one.":"عايز تتقدّم؟ انجح في امتحان هذا المستوى لفتح المستوى التالي.",
    "Take the level exam":"ابدأ امتحان المستوى",
    "Level exam":"امتحان المستوى",
    "Submit exam":"تسليم الامتحان",
    "Add a question to this level's exam":"أضف سؤالاً لامتحان هذا المستوى",
    "Question":"السؤال",
    "Option A (correct)":"الخيار أ (الصحيح)",
    "Option B":"الخيار ب",
    "Option C":"الخيار ج",
    "Option D":"الخيار د",
    "Add question":"أضف السؤال",
    "Option A is saved as the correct answer — put the right one there, options shuffle for students.":"الخيار أ هو المحفوظ كإجابة صحيحة — ضعي الإجابة الصحيحة فيه، والخيارات تتبدّل ترتيبها عشوائياً للطلاب.",
    "No questions yet for this level.":"لا توجد أسئلة لهذا المستوى بعد.",
    "Every student in that club sees it immediately — once they've unlocked this level.":"سيراه كل طالب في هذا النادي فور ما يفتح هذا المستوى.",

    /* french band */
    "French, for every age.":"الفرنسية، لكل الأعمار.",
    "Practical language learning and communication skills for Kids, Teens & Adults — the same living-language approach, in French.":"تعلّم لغوي عملي ومهارات تواصل للأطفال والمراهقين والكبار — نفس منهج المعايشة، لكن بالفرنسية.",
    "Kids":"الأطفال",
    "Teens":"المراهقون",
    "Adults":"الكبار",
    "Explore French courses ↗":"استكشف كورسات الفرنسية ↗",

    /* method */
    "The Code Cademy Method":"منهج Code Cademy",
    "Don't just learn. Build.":"لا تكتفِ بالتعلّم. ابنِ.",
    "Learn":"تعلّم",
    "Clear fundamentals, no filler":"أساسيات واضحة بلا حشو",
    "Practice":"تدرّب",
    "Hands-on drills and exercises":"تدريبات وتمارين عملية",
    "Build":"ابنِ",
    "A real project for your portfolio":"مشروع حقيقي يُضاف إلى ملف أعمالك",
    "Master":"أتقن",
    "A certificate and a usable skill":"شهادة ومهارة قابلة للاستخدام",

    /* videos */
    "Learn by Watching":"تعلّم بالمشاهدة",
    "Video lessons built for depth, not just runtime.":"دروس فيديو مبنية على العمق، لا على طول المدة.",
    "Chapters, adjustable speed, and captions in both Arabic and English — so a video teaches as well as it plays.":"فصول وسرعة قابلة للتعديل وترجمة بالعربية والإنجليزية — ليكون الفيديو تعليمياً لا مجرد مشاهدة.",
    "Programming · Full Stack":"البرمجة · فل ستاك",
    "Deploying your first full-stack project":"رفع أول مشروع فل ستاك خاص بك",
    "18 min · 6 chapters · EN/AR captions":"18 دقيقة · 6 فصول · ترجمة عربية/إنجليزية",
    "Subnetting without the confusion":"تقسيم الشبكات ببساطة ودون تعقيد",
    "Networking · CCNA path":"الشبكات · مسار CCNA",
    "MQTT in five minutes":"بروتوكول MQTT في خمس دقائق",
    "IoT · Smart Home track":"إنترنت الأشياء · مسار المنزل الذكي",
    "Business English: the follow-up email":"إنجليزية الأعمال: إيميل المتابعة",
    "English · Adults, B1":"الإنجليزية · الكبار، مستوى B1",
    "Building your first pivot table":"إنشاء أول جدول محوري",
    "MS Office · Excel path":"برامج الأوفيس · مسار إكسل",

    /* automation */
    "Automation, built in":"أتمتة مدمجة",
    "The site keeps working, even when you're not.":"الموقع يواصل العمل حتى وأنت لست متصلاً.",
    "Automated reminders, progress tracking, and WhatsApp notifications keep your streak going, follow up after a placement test, and nudge you back to your next session — without anyone typing a message by hand.":"تذكيرات آلية وتتبّع للتقدّم وإشعارات واتساب تحافظ على استمراريتك، وتتابعك بعد اختبار تحديد المستوى، وتعيدك إلى جلستك التالية — دون أن يكتب أحد رسالة يدوياً.",
    "Trigger":"المُحفّز",
    "Condition":"الشرط",
    "Action":"الإجراء",
    "Report":"التقرير",

    /* journey */
    "Your Journey":"رحلتك",
    "Seven steps from a first decision to steady growth.":"سبع خطوات من القرار الأول إلى النمو المستمر.",
    "Nothing here is random — each step is built on the one before it, from choosing a path to staying sharp long after you finish.":"لا شيء هنا عشوائي — كل خطوة مبنية على ما قبلها، من اختيار المسار إلى الحفاظ على مستواك بعد انتهائك بوقت طويل.",
    "Choose your path":"اختر مسارك",
    "IT, Languages, or both":"التقنية أو اللغات أو كليهما",
    "Assess your level":"حدّد مستواك",
    "A placement test tailored to your track":"اختبار تحديد مستوى مخصص لمسارك",
    "Focused content by department and level":"محتوى مركّز حسب القسم والمستوى",
    "Drills and interactive exercises":"تدريبات وتمارين تفاعلية",
    "Build a project":"ابنِ مشروعاً",
    "A real project added to your learning portfolio":"مشروع حقيقي يُضاف إلى ملف إنجازك التعليمي",
    "Get certified":"احصل على الشهادة",
    "Formal recognition once you complete a path":"اعتماد رسمي بعد إتمامك المسار",
    "Keep growing":"استمر في النمو",
    "Advanced tracks and new content, always":"مسارات متقدمة ومحتوى جديد باستمرار",

    "Turn learning into a daily habit.":"حوّل التعلّم إلى عادة يومية.",
    "Networking · Fundamentals":"الشبكات · الأساسيات",
    "What does the OSPF protocol do?":"ما وظيفة بروتوكول OSPF؟",
    "Answer":"الإجابة",
    "A dynamic routing protocol that finds the shortest path between networks.":"بروتوكول توجيه ديناميكي يجد أقصر مسار بين الشبكات.",
    "Click the card to reveal the answer":"اضغط على البطاقة لعرض الإجابة",

    /* collaboration */
    "Collaboration & Licensing":"التعاون والترخيص",
    "Bring Code Cademy learning to your organization.":"انقل تجربة Code Cademy التعليمية إلى مؤسستك.",
    "We license educational content and build customized learning solutions for schools, institutes, educational platforms and organizations.":"نمنح تراخيص للمحتوى التعليمي ونبني حلول تعلّم مخصصة للمدارس والمعاهد والمنصات التعليمية والمؤسسات.",
    "Schools":"المدارس",
    "Institutes":"المعاهد",
    "Educational Platforms":"المنصات التعليمية",
    "Organizations":"المؤسسات",
    "Select Content":"اختيار المحتوى",
    "Customize":"التخصيص",
    "Train":"التدريب",
    "Deliver":"التسليم",
    "Grow":"النمو",
    "DM us on WhatsApp":"راسلنا على واتساب",
    "DM us on Instagram":"راسلنا على إنستجرام",

    /* footer */
    "Learn. Build. Grow.":"تعلّم. ابنِ. انمُ.",
    "Learning":"التعلّم",
    "Certificates":"الشهادات",
    "Business":"الأعمال",
    "Content Licensing":"ترخيص المحتوى",
    "DM us":"راسلنا",
    "© 2026 Code Cademy":"© 2026 Code Cademy",
    "Facebook · Instagram · WhatsApp":"فيسبوك · إنستجرام · واتساب",
    /* v5 */
    "Zoom Meeting":"اجتماع زوم",
    "Zoom Meetings":"اجتماعات زوم",
    "ZOOM MEETING":"اجتماع زوم",
    "Book a Zoom Meeting":"احجز اجتماع زوم",
    "Zoom Meetings you host":"اجتماعات زوم التي تستضيفها",
    "Next Zoom Meeting":"اجتماع زوم القادم",
    "Join a Zoom Meeting":"انضم إلى اجتماع زوم",
    "Join Zoom Meeting":"انضم لاجتماع زوم",
    "Start Zoom Meeting":"ابدأ اجتماع زوم",
    "Zoom Meeting link":"رابط اجتماع زوم",
    "Book a Zoom Meeting with your teacher.":"احجز اجتماع زوم مع معلمك.",
    "A Zoom Meeting with a real teacher":"اجتماع زوم مع معلم حقيقي",
    "Live English classes via Zoom Meeting":"حصص إنجليزي مباشرة عبر اجتماع زوم",
    "No Zoom Meetings yet":"لا اجتماعات زوم بعد",
    "Video lessons":"دروس الفيديو",
    "Videos":"الفيديوهات",
    "Category":"التصنيف",
    "Upload video":"ارفع الفيديو",
    "Video file (MP4)":"ملف الفيديو (MP4)",
    "Upload a short video and it appears in the website's Watch & Learn section right away.":"ارفع فيديو قصيراً ليظهر فوراً في قسم شاهد وتعلّم في الموقع.",
    "Words or phrases (separate with commas)":"كلمات أو عبارات (افصل بينها بفواصل)",
    "Short vertical videos work best (under 30 seconds and under 20 MB). An MP4 recorded on your phone is fine.":"الفيديوهات الرأسية القصيرة أفضل (أقل من 30 ثانية وأقل من 20 ميجابايت). ملف MP4 مصوّر من هاتفك مناسب.",
    "Videos you've added":"الفيديوهات التي أضفتها",
    "You have not added any videos yet.":"لم تضف أي فيديوهات بعد.",
    "Stories":"قصص",
    "Speaking":"التحدث",
    "Phonics":"الأصوات",
    "Grammar":"القواعد",
    "clubs":"نوادٍ",
    "70% — level unlocked":"70% — فُتح المستوى",
    /* v6 */
    "Free Level Test":"اختبار المستوى المجاني",
    "Plans":"الباقات",
    "Free level test":"اختبار مستوى مجاني",
    "Not sure where to start? Find your level in 3 minutes.":"لست متأكداً من أين تبدأ؟ اكتشف مستواك في 3 دقائق.",
    "Twelve quick questions, from easy to challenging. You get your level straight away — and the plan that fits it.":"اثنا عشر سؤالاً سريعاً من السهل إلى الصعب. تعرف مستواك فوراً، والباقة المناسبة له.",
    "No account needed — it is free.":"لا تحتاج إلى حساب — الاختبار مجاني.",
    "Questions grow harder as you go.":"تزداد الأسئلة صعوبة تدريجياً.",
    "Your result: Beginner, Intermediate or Advanced.":"نتيجتك: مبتدئ أو متوسط أو متقدم.",
    "Ready when you are":"جاهز متى شئت",
    "Choose the best answer for each sentence. Don't use a dictionary — we want to see what you know today.":"اختر أفضل إجابة لكل جملة. لا تستخدم القاموس — نريد أن نرى ما تعرفه اليوم.",
    "Start the test":"ابدأ الاختبار",
    "Question 1 of 12":"السؤال 1 من 12",
    "See plans for your level":"شاهد الباقات المناسبة لمستواك",
    "Retake the test":"أعد الاختبار",
    "Excellent English. Advanced lessons will stretch you with debate, nuance and fluent speaking.":"إنجليزيتك ممتازة. ستتحداك الدروس المتقدمة بالنقاش والفروق الدقيقة والتحدث بطلاقة.",
    "A solid base. Intermediate lessons will build your confidence and fluency in real conversations.":"أساس قوي. ستبني الدروس المتوسطة ثقتك وطلاقتك في المحادثات الحقيقية.",
    "A perfect place to start. Beginner lessons build your vocabulary, sounds and first sentences step by step.":"بداية مثالية. ستبني دروس المبتدئين مفرداتك وأصواتك وجملك الأولى خطوة بخطوة.",
    "Services & Plans":"الخدمات والباقات",
    "Everything you need to speak English with confidence.":"كل ما تحتاجه لتتحدث الإنجليزية بثقة.",
    "One-to-one lessons, speaking clubs and a living-English curriculum — with your progress followed at every step.":"حصص فردية ونوادٍ للتحدث ومنهج معايشة حيّ — مع متابعة تقدمك في كل خطوة.",
    "Individual lessons":"حصص فردية",
    "Learning shaped around the student's level and needs, with progress follow-up.":"تعلّم يناسب مستوى الطالب واحتياجاته، مع متابعة تقدمه.",
    "Conversation & speaking clubs":"نوادي المحادثة والتحدث",
    "Practise English with others through dialogues and real-life situations.":"ممارسة اللغة مع الآخرين من خلال الحوارات والمواقف الحياتية.",
    "Immersion curriculum":"منهج المعايشة",
    "Build listening, speaking, reading and writing through hands-on practice.":"تطوير مهارات الاستماع والتحدث والقراءة والكتابة بطريقة تطبيقية.",
    "Progress tracking":"متابعة التقدم",
    "Level assessments and a clear view of the student's growth throughout the program.":"تقييم مستوى الطالب ومتابعة تطوره خلال البرنامج.",
    "Level System":"نظام المستويات",
    "Pay per lesson, or save when you book whole levels.":"ادفع لكل حصة، أو وفّر عند حجز مستويات كاملة.",
    "Single lesson":"حصة واحدة",
    "One live lesson with a teacher":"حصة مباشرة واحدة مع معلم",
    "1 Level":"مستوى واحد",
    "One full level of the program":"مستوى كامل من البرنامج",
    "2 Levels":"مستويان",
    "Two levels":"مستويان",
    "3 Levels":"ثلاثة مستويات",
    "Save 100 SAR":"وفّر 100 ريال",
    "Best value":"الأفضل قيمة",
    "SAR":"ريال",
    "Choose":"اختر",
    "Language Immersion Program":"باقة المعايشة اللغوية",
    "Learn English by living it.":"تعلّم الإنجليزية بالمعايشة.",
    "Learn English through everyday life situations.":"تعلّم اللغة من خلال مواقف الحياة اليومية.",
    "Practise conversation and speaking.":"ممارسة المحادثة والتحدث.",
    "Build reading, writing and listening skills.":"تطوير مهارات القراءة والكتابة والاستماع.",
    "Hands-on activities, stories and practice.":"أنشطة وقصص وتدريبات تطبيقية.",
    "Track the student's progress throughout the program.":"متابعة تقدم الطالب خلال البرنامج.",
    "Program length":"مدة البرنامج",
    "18 months":"سنة ونصف (18 شهرًا)",
    "about 84 SAR a month":"نحو 84 ريالاً في الشهر",
    "Join the program":"انضم إلى البرنامج",
    "18 months of learning English by living it":"سنة ونصف من تعلّم الإنجليزية بالمعايشة",
    "Secure checkout":"دفع آمن",
    "Pay in installments":"الدفع بالتقسيط",
    "Pay by card":"الدفع بالبطاقة",
    "Tamara":"تمارا",
    "Visa":"فيزا",
    "You pay on the payment provider's own secure page — card details are never typed into this website.":"تدفع على صفحة الدفع الآمنة الخاصة بمزوّد الدفع — لا تُدخل بيانات البطاقة في هذا الموقع أبداً.",
    "Checkout":"إتمام الدفع",
    "How would you like to pay?":"كيف تفضّل الدفع؟",
    "Split the payment into installments (subject to Tamara's approval)":"قسّم المبلغ على دفعات (بموافقة تمارا)",
    "Pay by card on a secure payment page":"ادفع بالبطاقة عبر صفحة دفع آمنة",
    "Continue to payment":"المتابعة إلى الدفع",
    "You pay on the payment provider's secure page — card details are never typed into this website.":"تدفع على صفحة الدفع الآمنة الخاصة بمزوّد الدفع — لا تُدخل بيانات البطاقة في هذا الموقع أبداً.",
    "Request received":"تم استلام طلبك",
    "Open the payment page":"افتح صفحة الدفع",
    "Message us on WhatsApp":"راسلنا على واتساب",
    "Done":"تم",
    "Your request is saved. Finish the payment on the secure page — your plan is switched on as soon as your teacher confirms it.":"تم حفظ طلبك. أكمل الدفع على الصفحة الآمنة — سيتم تفعيل باقتك فور تأكيد المعلم.",
    "Your request is saved. We'll send your secure payment link on WhatsApp shortly — your plan is switched on as soon as payment is confirmed.":"تم حفظ طلبك. سنرسل لك رابط الدفع الآمن على واتساب قريباً — وتُفعَّل باقتك فور تأكيد الدفع.",
    "Create your account first — then we'll take you straight to checkout.":"أنشئ حسابك أولاً — ثم ننقلك مباشرة إلى إتمام الدفع.",
    "You need an active plan to book a Zoom Meeting.":"تحتاج إلى باقة مفعّلة لحجز اجتماع زوم.",
    "Choose a plan":"اختر خطة",
    "Protect books":"احمِ الكتب",
    "Plans: price, classes and validity":"الخطط: السعر وعدد الحصص والمدة",
    "What each plan includes. Students see these on the website, and every plan you switch on gets these classes and end date. Leave “classes” empty for unlimited.":"ما تشمله كل خطة. يراها الطلاب على الموقع، وكل خطة تفعّلها تأخذ هذا العدد من الحصص وتاريخ الانتهاء. اترك «عدد الحصص» فارغاً لعدد غير محدود.",
    "Save plans":"حفظ الخطط",
    "Students, parents and teachers all sign in here.":"الطلاب وأولياء الأمور والمعلمون يسجّلون الدخول من هنا.",
    "I teach at the academy":"أدرّس في الأكاديمية",
    "The academy admin approves teacher accounts. Create your account now — your teacher tools open as soon as you are approved.":"مدير الأكاديمية يوافق على حسابات المعلمين. أنشئ حسابك الآن — وتُفتح أدوات المعلم بمجرد الموافقة.",
    "Only you can make someone a teacher. Teachers who sign up wait here until you approve them.":"أنت فقط من يجعل شخصاً معلماً. المعلمون الذين يسجّلون ينتظرون هنا حتى توافق عليهم.",
    "Our levels":"مستوياتنا",
    "9 levels, one clear path.":"9 مستويات، ومسار واحد واضح.",
    "Every student moves from Level 1 to Level 9. Each level's exam opens the next one.":"يتقدّم كل طالب من المستوى 1 للمستوى 9، وامتحان كل مستوى بيفتح اللي بعده.",
    "Three levels of the program":"ثلاثة مستويات من البرنامج",
    "6 stages":"6 مراحل",
    "Hi! I’m Coco — want a lesson?":"أهلاً! أنا كوكو — تحب ناخد درس؟",
    "Your English teacher ·":"مدرّس الإنجليزي بتاعك ·",
    "Talk":"كلام",
    "Role-play":"تمثيل مواقف",
    "Say it":"قلها",
    "Write or speak in English…":"اكتب أو اتكلم بالإنجليزي…",
    "Email or phone number":"البريد أو رقم الهاتف",
    "Phone number (to sign in with your phone)":"رقم الهاتف (للدخول برقمك)",
    "Phone number (for signing in)":"رقم الهاتف (لتسجيل الدخول)",
    "(25 SAR)":"(25 ريال)","(300 SAR)":"(300 ريال)","(500 SAR)":"(500 ريال)","(800 SAR)":"(800 ريال)","(1,500 SAR)":"(1,500 ريال)",
    "Save $27":"وفّر 27$",
    "about $22 a month":"حوالي 22$ في الشهر",
    "Lesson":"درس",
    "View & upload materials →":"شوف مواد النادي ←",
    "Assistant":"مساعد",
    "Homework":"الواجبات",
    "Files for the students (optional)":"ملفات للطلاب (اختياري)",
    "Messages":"الرسائل",
    "My Plan":"باقتي",
    "Enrollments":"الاشتراكات",
    "My plan":"باقتي",
    "Your enrollment and payments.":"اشتراكك ومدفوعاتك.",
    "Browse plans":"تصفّح الباقات",
    "Plans & enrollments":"الباقات والاشتراكات",
    "Switch a student's plan on once the payment arrives, or stop it at any time. Students need an active plan to book a Zoom Meeting.":"فعّل باقة الطالب عند وصول الدفع، أو أوقفها في أي وقت. يحتاج الطالب إلى باقة مفعّلة لحجز اجتماع زوم.",
    "Payment links":"روابط الدفع",
    "Paste the Tamara and Visa payment link for each plan. Students are sent there after choosing how to pay. Leave a link blank and students are asked to pay over WhatsApp instead.":"الصق رابط الدفع عبر تمارا وفيزا لكل باقة. يُحوَّل الطالب إليه بعد اختيار طريقة الدفع. اترك الرابط فارغاً ليُطلب من الطالب الدفع عبر واتساب.",
    "Save payment links":"احفظ روابط الدفع",
    "Your teacher's assignments for your club.":"واجبات معلمك لناديك.",
    "Give homework to a club, then read and grade what students send back.":"أعطِ واجباً لنادٍ، ثم اقرأ إجابات الطلاب وقيّمها.",
    "Due date (optional)":"تاريخ التسليم (اختياري)",
    "Instructions":"التعليمات",
    "Give homework":"أعطِ الواجب",
    "Submit homework":"سلّم الواجب",
    "Update answer":"حدّث الإجابة",
    "Submitted":"تم التسليم",
    "Not graded":"لم يُقيَّم",
    "Save grade":"احفظ الدرجة",
    "submissions":"تسليمات",
    "Your answer":"إجابتك",
    "Homework sent to the club.":"تم إرسال الواجب إلى النادي.",
    "Homework sent — your teacher will grade it soon.":"تم إرسال الواجب — سيقيّمه معلمك قريباً.",
    "Grade saved.":"تم حفظ الدرجة.",
    "Homework deleted.":"تم حذف الواجب.",
    "Please write your answer first.":"اكتب إجابتك أولاً.",
    "No homework yet — give your first assignment above.":"لا واجبات بعد — أعطِ أول واجب من الأعلى.",
    "No homework right now.":"لا واجبات حالياً.",
    "Write to your teacher — they will reply here.":"اكتب إلى معلمك — سيرد عليك هنا.",
    "Pick a student to read and answer their messages.":"اختر طالباً لقراءة رسائله والرد عليها.",
    "No messages yet — say hello.":"لا رسائل بعد — ابدأ بالتحية.",
    "Your plan":"باقتك",
    "No active plan yet":"لا توجد باقة مفعّلة بعد",
    "Choose a plan to start booking Zoom Meetings with your teacher.":"اختر باقة لتبدأ بحجز اجتماعات زوم مع معلمك.",
    "Waiting for payment confirmation.":"بانتظار تأكيد الدفع.",
    "See details":"التفاصيل",
    "Active":"مفعّلة",
    "Stopped":"متوقفة",
    "Rejected":"مرفوضة",
    "Waiting for payment":"بانتظار الدفع",
    "You have not chosen a plan yet.":"لم تختر باقة بعد.",
    "Valid until":"صالحة حتى",
    "Activate":"تفعيل",
    "Reject":"رفض",
    "Stop":"إيقاف",
    "Activate again":"تفعيل مرة أخرى",
    "No one has chosen a plan yet.":"لم يختر أحد باقة بعد.",
    "Plan switched on.":"تم تفعيل الباقة.",
    "Plan stopped.":"تم إيقاف الباقة.",
    "Request rejected.":"تم رفض الطلب.",
    "Payment links saved.":"تم حفظ روابط الدفع.",
    "Each payment link must start with https://":"يجب أن يبدأ كل رابط دفع بـ https://",
    "Download certificate":"حمّل الشهادة",
    "Pass a level exam (70% or more) and your certificate appears here.":"اجتز امتحان مستوى (70% أو أكثر) وستظهر شهادتك هنا.",
    "Progress report":"تقرير التقدم",
    "Levels passed":"المستويات المجتازة",
    "Attendance":"الحضور",
    "Exam scores":"درجات الامتحانات",
    "Teacher notes":"ملاحظات المعلم",
    "Prepared by your Code Cademy teacher.":"أعدّه معلمك في كود كاديمي.",
    "Print / Save as PDF":"طباعة / حفظ PDF",
    "Send to parent on WhatsApp":"أرسل لولي الأمر عبر واتساب",
    "Past due":"متأخر",
    "Due":"موعد التسليم"
  };

  /* attribute translations: [selector, attribute] */
  const ATTRS = [
    ['#libSearch', 'placeholder', 'Search books and materials…', 'ابحث في الكتب والمواد…'],
    ['#readerClose', 'aria-label', 'Close', 'إغلاق'],
    ['#chatSearch', 'placeholder', 'Search conversations…', 'ابحث في المحادثات…'],
    ['#chatInput', 'placeholder', 'Write a message…', 'اكتب رسالة…'],
    ['#usersSearch', 'placeholder', 'Search by name or email…', 'ابحث بالاسم أو البريد…'],
    ['#libTitle', 'placeholder', 'e.g. Oxford Reading Tree — Level 3', 'مثال: Oxford Reading Tree — المستوى 3'],
    ['.wa-float', 'aria-label', 'WhatsApp', 'واتساب'],
    ['.nav-mobile-toggle', 'aria-label', 'menu', 'القائمة'],
    ['#vidTitle', 'placeholder', 'e.g. Colors and shapes', 'مثال: الألوان والأشكال'],
    ['#hwTitle', 'placeholder', 'e.g. Describe your weekend in 5 sentences', 'مثال: صف عطلة نهاية أسبوعك في 5 جمل'],
    ['#hwText', 'placeholder', 'What should the student do?', 'ما المطلوب من الطالب؟'],
    ['#msgBody', 'placeholder', 'Write a message…', 'اكتب رسالة…'],
    ['#vidWords', 'placeholder', 'e.g. red, blue, green', 'مثال: red, blue, green'],
    ['#sessTitle', 'placeholder', 'e.g. Ordering food — speaking practice', 'مثال: طلب الطعام — تدريب على التحدث']
  ];

  const langBtn  = document.getElementById('langBtn');
  const langCode = document.getElementById('langCode');
  const html     = document.documentElement;
  const original = new WeakMap();   // text node -> original English text
  let observer   = null;

  function translateTree(root, toAr){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node){
        const parent = node.parentNode;
        if(!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.nodeName;
        if(tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'TEXT') return NodeFilter.FILTER_REJECT;
        if(parent.closest && parent.closest('svg')) return NodeFilter.FILTER_REJECT;
        if(parent.closest && parent.closest('[translate="no"]')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function(node){
      if(toAr){
        if(!original.has(node)) original.set(node, node.nodeValue);
        const key = original.get(node).trim();
        if(DICT[key]) node.nodeValue = original.get(node).replace(key, DICT[key]);
      } else if(original.has(node)){
        node.nodeValue = original.get(node);
      }
    });
  }

  function translateAttrs(toAr){
    ATTRS.forEach(function(row){
      const el = document.querySelector(row[0]);
      if(el) el.setAttribute(row[1], toAr ? row[3] : row[2]);
    });
  }

  function setLang(lang){
    const toAr = (lang === 'ar');

    if(observer) observer.disconnect();

    if(toAr && window.__arFonts) window.__arFonts();
    html.setAttribute('lang', toAr ? 'ar' : 'en');
    html.setAttribute('dir',  toAr ? 'rtl' : 'ltr');

    translateTree(document.body, toAr);
    translateAttrs(toAr);

    /* the button always offers the OTHER language */
    if(langCode) langCode.textContent = toAr ? 'English' : 'العربية';
    if(langBtn)  langBtn.setAttribute('title', toAr ? 'Switch to English' : 'التبديل إلى العربية');

    if(window.__refreshHeroWords) window.__refreshHeroWords(lang);
    if(window.__refreshDynamicText) window.__refreshDynamicText();

    try{ localStorage.setItem('cc_lang', lang); }catch(e){}

    /* keep content added later (library cards, etc.) translated too */
    if(toAr && window.MutationObserver){
      observer = new MutationObserver(function(mutations){
        observer.disconnect();
        mutations.forEach(function(m){
          m.addedNodes.forEach(function(n){
            if(n.nodeType === 1) translateTree(n, true);
            else if(n.nodeType === 3 && n.nodeValue.trim()){
              const key = n.nodeValue.trim();
              if(DICT[key]){ original.set(n, n.nodeValue); n.nodeValue = DICT[key]; }
            }
          });
        });
        observer.observe(document.body, {childList:true, subtree:true});
      });
      observer.observe(document.body, {childList:true, subtree:true});
    }
  }

  if(langBtn){
    langBtn.addEventListener('click', function(){
      setLang(html.getAttribute('lang') === 'ar' ? 'en' : 'ar');
    });
  }

  /* remember the visitor's choice */
  let saved = null;
  try{ saved = localStorage.getItem('cc_lang'); }catch(e){}
  if(!saved && (navigator.language || '').toLowerCase().indexOf('ar') === 0) saved = 'ar';
  setLang(saved === 'ar' ? 'ar' : 'en');
})();



/* ===== Magnetic hover on primary buttons (creative touch) ===== */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia('(hover: none)').matches) return; /* skip on touch */
  const targets = document.querySelectorAll('.path-btn, .nav-cta, .dm-btn');
  targets.forEach(function(el){
    el.style.willChange = 'transform';
    el.addEventListener('mousemove', function(e){
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      el.style.transform = 'translate(' + (x*0.18) + 'px,' + (y*0.28) + 'px)';
    });
    el.addEventListener('mouseleave', function(){
      el.style.transform = 'translate(0,0)';
    });
  });
})();

/* ===== NAV: scroll shadow + mobile menu ===== */
(function(){
  const header = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  const panel  = document.getElementById('navMobilePanel');

  function onScroll(){
    if(!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if(toggle && panel){
    toggle.addEventListener('click', function(){
      const open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

