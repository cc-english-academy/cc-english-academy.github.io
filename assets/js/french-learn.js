// Le Club Français: grammar in six levels and twelve worlds of French (30 film scenes + 140 topics), with
// voices, subtitles and pronunciation practice. Everything runs in the browser, free (speech is the browser's own).
(function(){
  'use strict';
  // ----- 30 cinema scenes: [emoji, title fr, title en, title ar, colour, lines [who, fr, en, ar]] (original scenes) -----
  const CINE = [
    ['🎟️', 'Au guichet du cinéma', 'At the box office', 'عند شباك التذاكر', '#f3d6c7', [['🙋', 'Bonsoir, deux places pour le film de vingt heures, s’il vous plaît.', 'Good evening, two tickets for the 8 pm film, please.', 'مساء الخير، تذكرتان لفيلم الساعة ٨ من فضلك.'], ['🧑‍💼', 'Bien sûr. Ça fait dix-huit euros.', 'Of course. That’s eighteen euros.', 'بالتأكيد. الحساب ١٨ يورو.'], ['🙋', 'Je peux payer par carte ?', 'Can I pay by card?', 'هل يمكنني الدفع بالبطاقة؟'], ['🧑‍💼', 'Oui, pas de problème. Bonne séance !', 'Yes, no problem. Enjoy the film!', 'نعم، لا مشكلة. مشاهدة ممتعة!']]],
    ['🍿', 'Le pop-corn', 'Popcorn', 'الفشار', '#f6e6c3', [['🙋', 'Un grand pop-corn et deux boissons, s’il vous plaît.', 'A large popcorn and two drinks, please.', 'فشار كبير ومشروبان من فضلك.'], ['🧑‍🍳', 'Salé ou sucré ?', 'Salty or sweet?', 'مالح أم مُحلّى؟'], ['🙋', 'Sucré, merci !', 'Sweet, thanks!', 'مُحلّى، شكرًا!']]],
    ['🕵️', 'Le détective', 'The detective', 'المحقق', '#d7e2f5', [['🕵️', 'Où étiez-vous hier soir à dix heures ?', 'Where were you last night at ten?', 'أين كنت أمس الساعة العاشرة ليلًا؟'], ['🧔', 'J’étais chez moi. Je regardais la télé.', 'I was at home. I was watching TV.', 'كنت في المنزل. كنت أشاهد التلفاز.'], ['🕵️', 'Seul ?', 'Alone?', 'وحدك؟'], ['🧔', 'Non… avec mon chat.', 'No… with my cat.', 'لا… مع قطتي.']]],
    ['💕', 'Rendez-vous à Paris', 'A date in Paris', 'موعد في باريس', '#e9d5df', [['👩', 'Tu es en retard !', 'You’re late!', 'لقد تأخرت!'], ['👨', 'Pardon, le métro était plein. Ces fleurs sont pour toi.', 'Sorry, the metro was full. These flowers are for you.', 'آسف، كان المترو مزدحمًا. هذه الورود لك.'], ['👩', 'Oh, elles sont magnifiques ! Merci.', 'Oh, they’re beautiful! Thank you.', 'يا الله، جميلة جدًا! شكرًا.']]],
    ['🚀', 'Dans l’espace', 'In space', 'في الفضاء', '#d9d3f5', [['👩‍🚀', 'Contrôle, ici la fusée Étoile. Tout va bien.', 'Control, this is the rocket Étoile. All is well.', 'غرفة التحكم، هنا الصاروخ «نجمة». كل شيء على ما يرام.'], ['🎧', 'Bien reçu. Vous voyez la Terre ?', 'Received. Can you see the Earth?', 'وصلت. هل ترون الأرض؟'], ['👩‍🚀', 'Oui… elle est bleue et toute petite.', 'Yes… it’s blue and very small.', 'نعم… زرقاء وصغيرة جدًا.']]],
    ['🦸', 'Le super-héros', 'The superhero', 'البطل الخارق', '#ffe0cc', [['🧒', 'Au secours ! Mon chat est dans l’arbre !', 'Help! My cat is in the tree!', 'النجدة! قطتي فوق الشجرة!'], ['🦸', 'N’aie pas peur. Je m’en occupe !', 'Don’t be afraid. I’ll take care of it!', 'لا تخف. سأتصرف!'], ['🧒', 'Merci, tu es mon héros !', 'Thank you, you’re my hero!', 'شكرًا، أنت بطلي!']]],
    ['😂', 'La comédie du restaurant', 'The restaurant comedy', 'كوميديا المطعم', '#fff1c7', [['🙋', 'Garçon, il y a une mouche dans ma soupe !', 'Waiter, there’s a fly in my soup!', 'أيها النادل، هناك ذبابة في الحساء!'], ['🤵', 'Ne parlez pas trop fort, monsieur… tout le monde va en vouloir !', 'Don’t speak too loudly, sir… everyone will want one!', 'اخفض صوتك يا سيدي… سيطلب الجميع مثلها!']]],
    ['🏰', 'Le château hanté', 'The haunted castle', 'القصر المسكون', '#d8d4e6', [['👧', 'Tu as entendu ce bruit ?', 'Did you hear that noise?', 'هل سمعت هذا الصوت؟'], ['👦', 'Oui… ça vient du grenier.', 'Yes… it’s coming from the attic.', 'نعم… إنه آتٍ من العلّية.'], ['👧', 'On y va ensemble ?', 'Shall we go together?', 'هل نذهب معًا؟'], ['👦', 'D’accord, mais tu passes devant !', 'OK, but you go first!', 'حسنًا، لكن تقدّمي أمامي!']]],
    ['🎬', 'Le casting', 'The audition', 'تجربة الأداء', '#f3d6c7', [['🎬', 'Bonjour ! Présentez-vous, s’il vous plaît.', 'Hello! Please introduce yourself.', 'مرحبًا! عرّفي بنفسك من فضلك.'], ['🙋', 'Je m’appelle Léa, j’ai vingt ans et j’adore jouer la comédie.', 'My name is Léa, I’m twenty and I love acting.', 'اسمي ليا، عمري ٢٠ عامًا وأحب التمثيل كثيرًا.'], ['🎬', 'Très bien. Montrez-moi la colère !', 'Very good. Show me anger!', 'جيد جدًا. أريني الغضب!']]],
    ['🚂', 'Le train de nuit', 'The night train', 'قطر الليل', '#d7e2f5', [['🧑‍✈️', 'Billets, s’il vous plaît.', 'Tickets, please.', 'التذاكر من فضلك.'], ['🙋', 'Voilà. On arrive à Nice à quelle heure ?', 'Here you are. What time do we arrive in Nice?', 'تفضل. متى نصل إلى نيس؟'], ['🧑‍✈️', 'Demain matin, à sept heures. Bonne nuit !', 'Tomorrow morning, at seven. Good night!', 'غدًا صباحًا الساعة السابعة. تصبح على خير!']]],
    ['🏆', 'La finale', 'The final', 'النهائي', '#cfe8dc', [['🎙️', 'Et c’est le but ! La France gagne !', 'And it’s a goal! France wins!', 'هدف! فرنسا تفوز!'], ['🙌', 'Incroyable ! On est les champions !', 'Incredible! We are the champions!', 'لا يُصدَّق! نحن الأبطال!']]],
    ['🐉', 'Le dragon gentil', 'The kind dragon', 'التنين الطيب', '#cfe8dc', [['🧒', 'Tu vas me manger ?', 'Are you going to eat me?', 'هل ستأكلني؟'], ['🐉', 'Non ! Je mange seulement des légumes.', 'No! I only eat vegetables.', 'لا! أنا آكل الخضار فقط.'], ['🧒', 'Alors… tu veux être mon ami ?', 'Then… do you want to be my friend?', 'إذن… هل تحب أن تكون صديقي؟']]],
    ['👵', 'Chez la grand-mère', 'At grandma’s', 'عند الجدة', '#fde2c5', [['👵', 'Tu as faim, mon chéri ?', 'Are you hungry, sweetie?', 'هل أنت جائع يا حبيبي؟'], ['🧒', 'Oui, mamie ! Qu’est-ce qu’il y a à manger ?', 'Yes, grandma! What is there to eat?', 'نعم يا جدتي! ماذا لدينا لنأكل؟'], ['👵', 'Une bonne tarte aux pommes !', 'A nice apple pie!', 'فطيرة تفاح لذيذة!']]],
    ['🏥', 'Chez le médecin', 'At the doctor’s', 'عند الطبيب', '#dff0f5', [['👩‍⚕️', 'Qu’est-ce qui ne va pas ?', 'What’s wrong?', 'ما بك؟'], ['🙋', 'J’ai mal à la tête et j’ai de la fièvre.', 'I have a headache and a fever.', 'رأسي يؤلمني وعندي حرارة.'], ['👩‍⚕️', 'Reposez-vous et buvez beaucoup d’eau.', 'Rest and drink lots of water.', 'استرح واشرب ماءً كثيرًا.']]],
    ['📞', 'Le coup de téléphone', 'The phone call', 'المكالمة', '#e6e0f7', [['📱', 'Allô ? C’est qui ?', 'Hello? Who is it?', 'ألو؟ من المتحدث؟'], ['🙋', 'C’est moi, Karim ! Tu es libre ce soir ?', 'It’s me, Karim! Are you free tonight?', 'أنا كريم! هل أنت متفرغ الليلة؟'], ['📱', 'Oui ! On va au cinéma ?', 'Yes! Shall we go to the cinema?', 'نعم! هل نذهب إلى السينما؟']]],
    ['🧙', 'Le magicien', 'The magician', 'الساحر', '#d9d3f5', [['🧙', 'Choisissez une carte… n’importe laquelle.', 'Pick a card… any card.', 'اختر بطاقة… أي بطاقة.'], ['🙋', 'Voilà. C’est le roi de cœur.', 'There. It’s the king of hearts.', 'تفضل. إنها الشايب الكبة.'], ['🧙', 'Et… abracadabra ! Il est dans votre poche !', 'And… abracadabra! It’s in your pocket!', 'و… أبرا كادابرا! إنها في جيبك!']]],
    ['🏫', 'Le premier jour d’école', 'The first day of school', 'اليوم الأول في المدرسة', '#fff1c7', [['👩‍🏫', 'Bienvenue ! Comment tu t’appelles ?', 'Welcome! What’s your name?', 'أهلًا بك! ما اسمك؟'], ['🧒', 'Je m’appelle Adam. Je suis un peu timide.', 'My name is Adam. I’m a bit shy.', 'اسمي آدم. أنا خجول قليلًا.'], ['👩‍🏫', 'Ne t’inquiète pas, tu vas te faire beaucoup d’amis.', 'Don’t worry, you’ll make lots of friends.', 'لا تقلق، ستكوّن أصدقاء كثيرين.']]],
    ['🌧️', 'Sous la pluie', 'In the rain', 'تحت المطر', '#d7e2f5', [['👨', 'Oh non, il pleut et je n’ai pas de parapluie !', 'Oh no, it’s raining and I have no umbrella!', 'يا للمفاجأة، إنها تمطر وليس معي مظلة!'], ['👩', 'Viens sous le mien, il est assez grand.', 'Come under mine, it’s big enough.', 'تعال تحت مظلتي، إنها كبيرة بما يكفي.'], ['👨', 'Merci, c’est très gentil.', 'Thank you, that’s very kind.', 'شكرًا، هذا لطف كبير منك.']]],
    ['🛍️', 'Au marché', 'At the market', 'في السوق', '#cfe8dc', [['🧑‍🌾', 'Des fraises toutes fraîches ! Trois euros le kilo !', 'Fresh strawberries! Three euros a kilo!', 'فراولة طازجة! الكيلو بـ٣ يوروهات!'], ['🙋', 'J’en prends deux kilos, s’il vous plaît.', 'I’ll take two kilos, please.', 'سآخذ ٢ كيلو من فضلك.'], ['🧑‍🌾', 'Avec plaisir. Et avec ça ?', 'With pleasure. Anything else?', 'بكل سرور. ماذا أيضًا؟']]],
    ['🚕', 'Le taxi', 'The taxi', 'سيارة الأجرة', '#fff1c7', [['🚕', 'Bonjour, vous allez où ?', 'Hello, where are you going?', 'مرحبًا، إلى أين؟'], ['🙋', 'À la gare de Lyon, s’il vous plaît. Je suis pressé !', 'To Gare de Lyon, please. I’m in a hurry!', 'محطة ليون من فضلك. أنا مستعجل!'], ['🚕', 'Accrochez-vous !', 'Hold on tight!', 'تمسّك جيدًا!']]],
    ['🎂', 'La surprise', 'The surprise', 'المفاجأة', '#e9d5df', [['👥', 'Surprise ! Joyeux anniversaire !', 'Surprise! Happy birthday!', 'مفاجأة! عيد ميلاد سعيد!'], ['🥳', 'Oh là là ! Je ne m’attendais pas à ça !', 'Oh my! I didn’t expect this!', 'يا سلام! لم أكن أتوقع هذا!'], ['👥', 'Fais un vœu et souffle les bougies !', 'Make a wish and blow out the candles!', 'تمنَّ أمنية وأطفئ الشموع!']]],
    ['🗺️', 'Perdus en ville', 'Lost in town', 'تائهون في المدينة', '#f3d6c7', [['🙋', 'Excusez-moi, je suis perdu. Où est le musée du Louvre ?', 'Excuse me, I’m lost. Where is the Louvre?', 'من فضلك، أنا تائه. أين متحف اللوفر؟'], ['👮', 'Allez tout droit, puis tournez à gauche après le pont.', 'Go straight on, then turn left after the bridge.', 'امشِ مباشرة، ثم انعطف يسارًا بعد الجسر.'], ['🙋', 'Merci beaucoup, monsieur !', 'Thank you very much, sir!', 'شكرًا جزيلًا يا سيدي!']]],
    ['🤖', 'Le robot', 'The robot', 'الروبوت', '#d9d3f5', [['🤖', 'Bonjour. Je suis Coco. Comment puis-je vous aider ?', 'Hello. I am Coco. How can I help you?', 'مرحبًا. أنا كوكو. كيف يمكنني مساعدتك؟'], ['🧒', 'Tu peux faire mes devoirs ?', 'Can you do my homework?', 'هل يمكنك أن تحلّ واجبي؟'], ['🤖', 'Non. Mais je peux t’aider à les comprendre !', 'No. But I can help you understand it!', 'لا. لكن يمكنني مساعدتك على فهمه!']]],
    ['⚽', 'L’entraînement', 'Training', 'التمرين', '#cfe8dc', [['🧑‍🏫', 'Plus vite ! Passe le ballon !', 'Faster! Pass the ball!', 'أسرع! مرّر الكرة!'], ['🧒', 'Je suis fatigué, coach !', 'I’m tired, coach!', 'أنا متعب أيها المدرب!'], ['🧑‍🏫', 'Encore cinq minutes, et après on boit de l’eau.', 'Five more minutes, then we drink some water.', 'خمس دقائق أخرى، ثم نشرب الماء.']]],
    ['🏖️', 'La plage', 'The beach', 'البحر', '#dff0f5', [['👧', 'L’eau est froide ?', 'Is the water cold?', 'هل الماء بارد؟'], ['👦', 'Non, elle est parfaite ! Viens !', 'No, it’s perfect! Come on!', 'لا، إنه رائع! تعالي!'], ['👧', 'J’arrive ! Attends-moi !', 'I’m coming! Wait for me!', 'قادمة! انتظرني!']]],
    ['🎤', 'Le concert', 'The concert', 'الحفلة', '#e6e0f7', [['🎤', 'Bonsoir Paris ! Vous êtes prêts ?', 'Good evening, Paris! Are you ready?', 'مساء الخير يا باريس! هل أنتم مستعدون؟'], ['👥', 'Ouiii !', 'Yesss!', 'نعـــم!'], ['🎤', 'Alors chantez avec moi !', 'Then sing with me!', 'إذن غنّوا معي!']]],
    ['🧳', 'À l’aéroport', 'At the airport', 'في المطار', '#d7e2f5', [['🛂', 'Votre passeport, s’il vous plaît. Quel est le but de votre voyage ?', 'Your passport, please. What is the purpose of your trip?', 'جواز السفر من فضلك. ما سبب رحلتك؟'], ['🙋', 'Je viens pour les vacances.', 'I’m here on holiday.', 'جئت في عطلة.'], ['🛂', 'Bon séjour en France !', 'Enjoy your stay in France!', 'إقامة سعيدة في فرنسا!']]],
    ['🐶', 'Le chien perdu', 'The lost dog', 'الكلب التائه', '#fde2c5', [['👧', 'Vous avez vu un petit chien blanc ?', 'Have you seen a little white dog?', 'هل رأيت كلبًا صغيرًا أبيض؟'], ['👴', 'Oui, il courait vers le parc il y a cinq minutes.', 'Yes, he was running towards the park five minutes ago.', 'نعم، كان يركض نحو الحديقة قبل خمس دقائق.'], ['👧', 'Merci ! Biscuit, reviens !', 'Thank you! Biscuit, come back!', 'شكرًا! بسكوت، ارجع!']]],
    ['🌟', 'Le rêve', 'The dream', 'الحلم', '#fff1c7', [['👦', 'Quand je serai grand, je serai pilote.', 'When I grow up, I will be a pilot.', 'عندما أكبر سأصبح طيارًا.'], ['👧', 'Moi, je voudrais être médecin et aider les gens.', 'I would like to be a doctor and help people.', 'وأنا أتمنى أن أصبح طبيبة وأساعد الناس.'], ['👦', 'On peut tout faire si on travaille bien !', 'We can do anything if we work hard!', 'نستطيع أن نفعل أي شيء إذا عملنا بجدّ!']]],
    ['🎞️', 'La fin du film', 'The end of the film', 'نهاية الفيلم', '#e9d5df', [['👩', 'Alors, tu as aimé le film ?', 'So, did you like the film?', 'هل أعجبك الفيلم؟'], ['👨', 'J’ai adoré ! La fin était très émouvante.', 'I loved it! The ending was very moving.', 'أحببته كثيرًا! كانت النهاية مؤثرة جدًا.'], ['👩', 'Moi aussi, j’ai pleuré un peu.', 'Me too, I cried a little.', 'وأنا أيضًا، بكيت قليلًا.']]]
  ];
  // ----- 20 music, 20 food, 20 travel topics: [emoji, word fr, en, ar, example fr, en, ar] -----
  const MUSIC = [
    ['🎸', 'la guitare', 'the guitar', 'الغيتار', 'Je joue de la guitare tous les soirs.', 'I play the guitar every evening.', 'أعزف على الغيتار كل ليلة.'],
    ['🎹', 'le piano', 'the piano', 'البيانو', 'Ma sœur apprend le piano depuis deux ans.', 'My sister has been learning the piano for two years.', 'أختي تتعلم البيانو منذ سنتين.'],
    ['🥁', 'la batterie', 'the drums', 'الطبول', 'Le batteur joue très fort !', 'The drummer plays very loudly!', 'عازف الطبول يعزف بصوت عالٍ جدًا!'],
    ['🎻', 'le violon', 'the violin', 'الكمان', 'Le violon a un son très doux.', 'The violin has a very soft sound.', 'صوت الكمان ناعم جدًا.'],
    ['🎤', 'chanter', 'to sing', 'يغنّي', 'J’aime chanter sous la douche.', 'I like singing in the shower.', 'أحب الغناء تحت الدش.'],
    ['💃', 'danser', 'to dance', 'يرقص', 'On danse toute la nuit !', 'We dance all night!', 'نرقص طوال الليل!'],
    ['🎧', 'écouter de la musique', 'to listen to music', 'يستمع إلى الموسيقى', 'J’écoute de la musique dans le bus.', 'I listen to music on the bus.', 'أستمع إلى الموسيقى في الحافلة.'],
    ['🎶', 'une chanson', 'a song', 'أغنية', 'C’est ma chanson préférée !', 'It’s my favourite song!', 'هذه أغنيتي المفضلة!'],
    ['🎼', 'la musique classique', 'classical music', 'الموسيقى الكلاسيكية', 'Mon grand-père adore la musique classique.', 'My grandfather loves classical music.', 'جدي يحب الموسيقى الكلاسيكية كثيرًا.'],
    ['🎷', 'le jazz', 'jazz', 'الجاز', 'Il y a un concert de jazz ce soir.', 'There is a jazz concert tonight.', 'هناك حفلة جاز الليلة.'],
    ['🎙️', 'le rap', 'rap', 'الراب', 'Le rap français est très populaire.', 'French rap is very popular.', 'الراب الفرنسي مشهور جدًا.'],
    ['🪗', 'l’accordéon', 'the accordion', 'الأكورديون', 'L’accordéon, c’est la musique des cafés parisiens.', 'The accordion is the music of Parisian cafés.', 'الأكورديون هو موسيقى مقاهي باريس.'],
    ['👏', 'le rythme', 'the rhythm', 'الإيقاع', 'Frappe dans tes mains en rythme !', 'Clap your hands to the rhythm!', 'صفّق على الإيقاع!'],
    ['🔊', 'plus fort', 'louder', 'أعلى', 'Monte le son, s’il te plaît !', 'Turn the sound up, please!', 'ارفع الصوت من فضلك!'],
    ['🔉', 'moins fort', 'quieter', 'أخفض', 'Baisse le son, le bébé dort.', 'Turn it down, the baby is sleeping.', 'اخفض الصوت، الطفل نائم.'],
    ['🎟️', 'un concert', 'a concert', 'حفلة', 'On a des billets pour le concert samedi !', 'We have tickets for the concert on Saturday!', 'معنا تذاكر للحفلة يوم السبت!'],
    ['👩‍🎤', 'une chanteuse', 'a singer', 'مطربة', 'Cette chanteuse a une voix magnifique.', 'This singer has a beautiful voice.', 'صوت هذه المطربة رائع.'],
    ['🎺', 'la trompette', 'the trumpet', 'الترومبيت', 'Mon frère joue de la trompette dans un orchestre.', 'My brother plays the trumpet in an orchestra.', 'أخي يعزف على الترومبيت في أوركسترا.'],
    ['📻', 'la radio', 'the radio', 'المذياع', 'J’écoute la radio le matin.', 'I listen to the radio in the morning.', 'أستمع إلى المذياع صباحًا.'],
    ['🎉', 'la Fête de la musique', 'the music festival', 'عيد الموسيقى', 'Le 21 juin, c’est la Fête de la musique en France !', 'On 21 June, it’s the music festival in France!', 'يوم ٢١ يونيو هو عيد الموسيقى في فرنسا!']
  ];
  const FOOD = [
    ['🥐', 'un croissant', 'a croissant', 'كرواسون', 'Un croissant et un café, s’il vous plaît.', 'A croissant and a coffee, please.', 'كرواسون وقهوة من فضلك.'],
    ['🥖', 'une baguette', 'a baguette', 'باغيت', 'Je voudrais une baguette bien cuite.', 'I’d like a well-baked baguette.', 'أريد باغيت مخبوزة جيدًا.'],
    ['🥞', 'une crêpe', 'a crêpe', 'كريب', 'Une crêpe au chocolat, c’est délicieux !', 'A chocolate crêpe is delicious!', 'الكريب بالشوكولاتة لذيذ جدًا!'],
    ['🧀', 'le fromage', 'cheese', 'الجبن', 'En France, il y a plus de mille fromages !', 'In France, there are more than a thousand cheeses!', 'في فرنسا أكثر من ألف نوع من الجبن!'],
    ['🥗', 'une salade niçoise', 'a Niçoise salad', 'سلطة نيسواز', 'Je prends une salade niçoise.', 'I’ll have a Niçoise salad.', 'سآخذ سلطة نيسواز.'],
    ['🍲', 'la soupe à l’oignon', 'onion soup', 'حساء البصل', 'La soupe à l’oignon est très chaude.', 'The onion soup is very hot.', 'حساء البصل ساخن جدًا.'],
    ['🥧', 'une quiche', 'a quiche', 'كيش', 'La quiche lorraine est une spécialité de l’est.', 'Quiche lorraine is a speciality of the east.', 'كيش لورين طبق مشهور من شرق فرنسا.'],
    ['🍆', 'la ratatouille', 'ratatouille', 'راتاتوي', 'La ratatouille, ce sont des légumes du sud.', 'Ratatouille is vegetables from the south.', 'الراتاتوي طبق خضار من جنوب فرنسا.'],
    ['🍰', 'un gâteau', 'a cake', 'كعكة', 'Ce gâteau est fait maison.', 'This cake is homemade.', 'هذه الكعكة مصنوعة في المنزل.'],
    ['☕', 'un chocolat chaud', 'a hot chocolate', 'شوكولاتة ساخنة', 'Un chocolat chaud, s’il vous plaît.', 'A hot chocolate, please.', 'شوكولاتة ساخنة من فضلك.'],
    ['🍮', 'la crème brûlée', 'crème brûlée', 'كريم بروليه', 'La crème brûlée est mon dessert préféré.', 'Crème brûlée is my favourite dessert.', 'الكريم بروليه حلواي المفضلة.'],
    ['🍪', 'un macaron', 'a macaron', 'ماكارون', 'Les macarons sont colorés et sucrés.', 'Macarons are colourful and sweet.', 'الماكارون ملوّن وحلو.'],
    ['🍎', 'une tarte aux pommes', 'an apple tart', 'تارت التفاح', 'Ma mère fait une tarte aux pommes le dimanche.', 'My mother makes an apple tart on Sundays.', 'أمي تصنع تارت التفاح يوم الأحد.'],
    ['🍳', 'une omelette', 'an omelette', 'أومليت', 'Une omelette au fromage, c’est rapide.', 'A cheese omelette is quick.', 'الأومليت بالجبن سريع التحضير.'],
    ['🐟', 'le poisson', 'fish', 'السمك', 'Le poisson est frais aujourd’hui ?', 'Is the fish fresh today?', 'هل السمك طازج اليوم؟'],
    ['🍗', 'le poulet', 'chicken', 'الدجاج', 'Je voudrais le poulet avec des frites.', 'I’d like the chicken with chips.', 'أريد الدجاج مع البطاطس.'],
    ['🧃', 'un jus d’orange', 'an orange juice', 'عصير برتقال', 'Un grand jus d’orange, s’il vous plaît.', 'A large orange juice, please.', 'عصير برتقال كبير من فضلك.'],
    ['💧', 'une carafe d’eau', 'a jug of water', 'إبريق ماء', 'Pouvez-vous nous apporter une carafe d’eau ?', 'Could you bring us a jug of water?', 'هل يمكن أن تحضر لنا إبريق ماء؟'],
    ['🧾', 'l’addition', 'the bill', 'الحساب', 'L’addition, s’il vous plaît !', 'The bill, please!', 'الحساب من فضلك!'],
    ['😋', 'Bon appétit !', 'Enjoy your meal!', 'بالهناء والشفاء!', 'Bon appétit à tous !', 'Enjoy your meal, everyone!', 'بالهناء والشفاء للجميع!']
  ];
  const TRAVEL = [
    ['✈️', 'l’avion', 'the plane', 'الطائرة', 'Mon avion part à neuf heures.', 'My plane leaves at nine.', 'تقلع طائرتي الساعة التاسعة.'],
    ['🧳', 'la valise', 'the suitcase', 'الحقيبة', 'Ma valise est trop lourde !', 'My suitcase is too heavy!', 'حقيبتي ثقيلة جدًا!'],
    ['🛂', 'le passeport', 'the passport', 'جواز السفر', 'N’oublie pas ton passeport !', 'Don’t forget your passport!', 'لا تنسَ جواز السفر!'],
    ['🏨', 'l’hôtel', 'the hotel', 'الفندق', 'J’ai réservé une chambre pour deux nuits.', 'I booked a room for two nights.', 'حجزت غرفة لليلتين.'],
    ['🔑', 'la clé', 'the key', 'المفتاح', 'Voici la clé de votre chambre.', 'Here is your room key.', 'هذا مفتاح غرفتك.'],
    ['🚆', 'le train', 'the train', 'القطار', 'Le train pour Lyon part de quel quai ?', 'Which platform does the train to Lyon leave from?', 'من أي رصيف يغادر قطار ليون؟'],
    ['🎫', 'un billet aller-retour', 'a return ticket', 'تذكرة ذهاب وعودة', 'Un billet aller-retour pour Nice, s’il vous plaît.', 'A return ticket to Nice, please.', 'تذكرة ذهاب وعودة إلى نيس من فضلك.'],
    ['🚇', 'le métro', 'the metro', 'المترو', 'On prend le métro, c’est plus rapide.', 'Let’s take the metro, it’s faster.', 'لنأخذ المترو، فهو أسرع.'],
    ['🗺️', 'un plan', 'a map', 'خريطة', 'Vous avez un plan de la ville ?', 'Do you have a map of the city?', 'هل معك خريطة للمدينة؟'],
    ['⬅️', 'à gauche', 'on the left', 'يسار', 'Tournez à gauche au feu.', 'Turn left at the traffic lights.', 'انعطف يسارًا عند الإشارة.'],
    ['➡️', 'à droite', 'on the right', 'يمين', 'La pharmacie est à droite.', 'The pharmacy is on the right.', 'الصيدلية على اليمين.'],
    ['⬆️', 'tout droit', 'straight on', 'إلى الأمام مباشرة', 'Continuez tout droit jusqu’à la place.', 'Keep going straight to the square.', 'تابع إلى الأمام مباشرة حتى الميدان.'],
    ['🗼', 'la tour Eiffel', 'the Eiffel Tower', 'برج إيفل', 'La tour Eiffel brille la nuit.', 'The Eiffel Tower sparkles at night.', 'برج إيفل يتلألأ ليلًا.'],
    ['🖼️', 'le musée', 'the museum', 'المتحف', 'Le musée est ouvert jusqu’à dix-huit heures.', 'The museum is open until 6 pm.', 'المتحف مفتوح حتى الساعة السادسة.'],
    ['📸', 'une photo', 'a photo', 'صورة', 'Vous pouvez nous prendre en photo ?', 'Could you take a photo of us?', 'هل يمكنك أن تلتقط لنا صورة؟'],
    ['🏖️', 'la plage', 'the beach', 'البحر', 'À Nice, la plage est magnifique.', 'In Nice, the beach is magnificent.', 'البحر في نيس رائع.'],
    ['⛰️', 'la montagne', 'the mountains', 'الجبل', 'En hiver, on va skier à la montagne.', 'In winter, we go skiing in the mountains.', 'في الشتاء نذهب للتزلج في الجبل.'],
    ['💶', 'l’euro', 'the euro', 'اليورو', 'Ça coûte combien en euros ?', 'How much is it in euros?', 'كم السعر باليورو؟'],
    ['🆘', 'Pouvez-vous m’aider ?', 'Can you help me?', 'هل يمكنك مساعدتي؟', 'J’ai perdu mon sac, pouvez-vous m’aider ?', 'I’ve lost my bag, can you help me?', 'أضعت حقيبتي، هل يمكنك مساعدتي؟'],
    ['👋', 'Bon voyage !', 'Have a good trip!', 'رحلة سعيدة!', 'Bon voyage et à bientôt !', 'Have a good trip and see you soon!', 'رحلة سعيدة وأراك قريبًا!']
  ];
  // ----- 8 more worlds × 10 topics: [emoji, word fr, en, ar, example fr, en, ar] -----
  const MORE = {
    school: [
      ['🎒', 'le cartable', 'the school bag', 'الحقيبة المدرسية', 'Mon cartable est trop lourd aujourd’hui.', 'My school bag is too heavy today.', 'حقيبتي ثقيلة جدًا اليوم.'],
      ['✏️', 'un crayon', 'a pencil', 'قلم رصاص', 'Tu peux me prêter un crayon ?', 'Can you lend me a pencil?', 'هل يمكنك أن تعيرني قلم رصاص؟'],
      ['📒', 'un cahier', 'a notebook', 'دفتر', 'Ouvrez vos cahiers, s’il vous plaît.', 'Open your notebooks, please.', 'افتحوا دفاتركم من فضلكم.'],
      ['👩‍🏫', 'la maîtresse', 'the teacher', 'المعلّمة', 'La maîtresse explique la leçon.', 'The teacher explains the lesson.', 'المعلّمة تشرح الدرس.'],
      ['🙋', 'lever la main', 'to raise your hand', 'يرفع يده', 'Levez la main pour répondre.', 'Raise your hand to answer.', 'ارفعوا أيديكم لتجيبوا.'],
      ['📝', 'un contrôle', 'a test', 'امتحان', 'J’ai un contrôle de maths demain.', 'I have a maths test tomorrow.', 'عندي امتحان رياضيات غدًا.'],
      ['🔔', 'la récréation', 'break time', 'الاستراحة', 'On joue au ballon à la récréation.', 'We play ball at break time.', 'نلعب كرة القدم في الاستراحة.'],
      ['📚', 'les devoirs', 'homework', 'الواجب', 'Je fais mes devoirs après l’école.', 'I do my homework after school.', 'أحلّ الواجب بعد المدرسة.'],
      ['🧮', 'les mathématiques', 'maths', 'الرياضيات', 'J’adore les mathématiques !', 'I love maths!', 'أحب الرياضيات كثيرًا!'],
      ['❓', 'Je ne comprends pas.', 'I don’t understand.', 'لا أفهم.', 'Pardon, je ne comprends pas. Vous pouvez répéter ?', 'Sorry, I don’t understand. Can you repeat?', 'آسف، لا أفهم. هل يمكنك أن تعيد؟']
    ],
    family: [
      ['👨', 'le père', 'the father', 'الأب', 'Mon père travaille à l’hôpital.', 'My father works at the hospital.', 'أبي يعمل في المستشفى.'],
      ['👩', 'la mère', 'the mother', 'الأم', 'Ma mère cuisine très bien.', 'My mother cooks very well.', 'أمي تطبخ طعامًا لذيذًا جدًا.'],
      ['👦', 'le frère', 'the brother', 'الأخ', 'J’ai un grand frère et une petite sœur.', 'I have a big brother and a little sister.', 'عندي أخ أكبر وأخت أصغر.'],
      ['👴', 'le grand-père', 'the grandfather', 'الجد', 'Mon grand-père raconte des histoires.', 'My grandfather tells stories.', 'جدي يحكي الحكايات.'],
      ['👶', 'le bébé', 'the baby', 'الرضيع', 'Le bébé dort dans sa chambre.', 'The baby is sleeping in his room.', 'الرضيع نائم في غرفته.'],
      ['🧑‍🤝‍🧑', 'les cousins', 'the cousins', 'أبناء العم والخال', 'Je joue avec mes cousins le week-end.', 'I play with my cousins at the weekend.', 'ألعب مع أبناء عمي في عطلة نهاية الأسبوع.'],
      ['🏠', 'la maison', 'the house', 'المنزل', 'Notre maison a un petit jardin.', 'Our house has a small garden.', 'في منزلنا حديقة صغيرة.'],
      ['🍽️', 'le dîner en famille', 'family dinner', 'العشاء مع العائلة', 'Le soir, on dîne tous ensemble.', 'In the evening, we all have dinner together.', 'في المساء نتناول العشاء كلنا معًا.'],
      ['❤️', 'aimer', 'to love', 'يحب', 'J’aime beaucoup ma famille.', 'I love my family very much.', 'أحب عائلتي كثيرًا.'],
      ['📷', 'une photo de famille', 'a family photo', 'صورة العائلة', 'Regarde, c’est une photo de ma famille !', 'Look, it’s a photo of my family!', 'انظر، هذه صورة عائلتي!']
    ],
    sport: [
      ['⚽', 'le football', 'football', 'كرة القدم', 'Je joue au football avec mes amis.', 'I play football with my friends.', 'ألعب كرة القدم مع أصدقائي.'],
      ['🏀', 'le basket', 'basketball', 'كرة السلة', 'Il est très grand, il joue au basket.', 'He is very tall, he plays basketball.', 'إنه طويل جدًا، يلعب كرة السلة.'],
      ['🏊', 'nager', 'to swim', 'يسبح', 'En été, je nage à la piscine.', 'In summer, I swim at the pool.', 'في الصيف أسبح في المسبح.'],
      ['🚴', 'le vélo', 'cycling', 'الدراجة', 'Le Tour de France est une course de vélo.', 'The Tour de France is a cycling race.', 'طواف فرنسا سباق للدراجات.'],
      ['🎾', 'le tennis', 'tennis', 'التنس', 'Roland-Garros est un tournoi de tennis à Paris.', 'Roland-Garros is a tennis tournament in Paris.', 'رولان غاروس بطولة تنس في باريس.'],
      ['🏃', 'courir', 'to run', 'يركض', 'Je cours tous les matins dans le parc.', 'I run every morning in the park.', 'أركض كل صباح في الحديقة.'],
      ['🥇', 'gagner', 'to win', 'يفوز', 'Notre équipe a gagné le match !', 'Our team won the match!', 'فاز فريقنا بالمباراة!'],
      ['🤸', 'la gymnastique', 'gymnastics', 'الجمباز', 'La gymnastique, c’est bon pour le corps.', 'Gymnastics is good for the body.', 'الجمباز مفيد للجسم.'],
      ['🏋️', 's’entraîner', 'to train', 'يتمرّن', 'Elle s’entraîne trois fois par semaine.', 'She trains three times a week.', 'تتمرّن ٣ مرات في الأسبوع.'],
      ['📣', 'Allez !', 'Come on!', 'هيا!', 'Allez les Bleus !', 'Come on, France!', 'هيا يا فرنسا!']
    ],
    shop: [
      ['🛒', 'le supermarché', 'the supermarket', 'السوبرماركت', 'Je vais au supermarché.', 'I’m going to the supermarket.', 'أنا ذاهب إلى السوبرماركت.'],
      ['💰', 'Combien ça coûte ?', 'How much is it?', 'بكم؟', 'Combien ça coûte, ce pull ?', 'How much is this jumper?', 'بكم هذه الكنزة؟'],
      ['👕', 'un tee-shirt', 'a T-shirt', 'قميص قصير الأكمام', 'Je cherche un tee-shirt bleu.', 'I’m looking for a blue T-shirt.', 'أبحث عن قميص أزرق.'],
      ['👟', 'des chaussures', 'shoes', 'حذاء', 'Ces chaussures sont trop petites.', 'These shoes are too small.', 'هذا الحذاء صغير جدًا.'],
      ['📏', 'la taille', 'the size', 'المقاس', 'Vous avez une taille plus grande ?', 'Do you have a bigger size?', 'هل لديك مقاس أكبر؟'],
      ['🪞', 'essayer', 'to try on', 'يجرّب الملابس', 'Je peux essayer ce pantalon ?', 'Can I try on these trousers?', 'هل يمكنني تجربة هذا البنطال؟'],
      ['🏷️', 'les soldes', 'the sales', 'التخفيضات', 'En janvier, il y a les soldes !', 'In January, there are the sales!', 'في يناير توجد تخفيضات!'],
      ['💳', 'payer par carte', 'to pay by card', 'يدفع بالبطاقة', 'Je peux payer par carte ?', 'Can I pay by card?', 'هل يمكنني الدفع بالبطاقة؟'],
      ['🛍️', 'un sac', 'a bag', 'كيس', 'Vous voulez un sac ?', 'Would you like a bag?', 'هل تريد كيسًا؟'],
      ['🙂', 'Ce sera tout.', 'That’s all.', 'هذا كل شيء.', 'Ce sera tout, merci. Bonne journée !', 'That will be all, thank you. Have a nice day!', 'هذا كل شيء، شكرًا. يومًا سعيدًا!']
    ],
    health: [
      ['🩺', 'le médecin', 'the doctor', 'الطبيب', 'Je dois aller chez le médecin.', 'I have to go to the doctor.', 'يجب أن أذهب إلى الطبيب.'],
      ['🤒', 'la fièvre', 'a fever', 'الحمّى', 'Mon fils a de la fièvre.', 'My son has a fever.', 'ابني مصاب بالحمّى.'],
      ['🤕', 'J’ai mal…', 'It hurts…', 'أشعر بألم في…', 'J’ai mal au ventre.', 'I have a stomach ache.', 'بطني يؤلمني.'],
      ['💊', 'un médicament', 'a medicine', 'دواء', 'Prenez ce médicament deux fois par jour.', 'Take this medicine twice a day.', 'تناول هذا الدواء مرتين في اليوم.'],
      ['🏥', 'l’hôpital', 'the hospital', 'المستشفى', 'L’hôpital est à côté de la gare.', 'The hospital is next to the station.', 'المستشفى بجوار المحطة.'],
      ['🦷', 'le dentiste', 'the dentist', 'طبيب الأسنان', 'J’ai rendez-vous chez le dentiste.', 'I have an appointment at the dentist.', 'عندي موعد عند طبيب الأسنان.'],
      ['🤧', 'un rhume', 'a cold', 'زكام', 'J’ai un rhume, j’éternue tout le temps.', 'I have a cold, I sneeze all the time.', 'أنا مصاب بالزكام، وأعطس باستمرار.'],
      ['🧴', 'la pharmacie', 'the pharmacy', 'الصيدلية', 'La pharmacie est ouverte le dimanche ?', 'Is the pharmacy open on Sunday?', 'هل الصيدلية مفتوحة يوم الأحد؟'],
      ['😴', 'se reposer', 'to rest', 'يرتاح', 'Tu dois te reposer et bien dormir.', 'You must rest and sleep well.', 'يجب أن ترتاح وتنام جيدًا.'],
      ['🚑', 'Appelez le 15 !', 'Call 15! (emergency)', 'اتصل بـ١٥! (الإسعاف)', 'Vite, appelez le 15 ! Il est blessé.', 'Quick, call 15! He is hurt.', 'بسرعة، اتصل بـ١٥! إنه مصاب.']
    ],
    weather: [
      ['☀️', 'Il fait beau.', 'The weather is nice.', 'الجو جميل.', 'Aujourd’hui, il fait beau et chaud.', 'Today it’s nice and warm.', 'الجو اليوم جميل ودافئ.'],
      ['🌧️', 'Il pleut.', 'It’s raining.', 'إنها تمطر.', 'Il pleut, prends ton parapluie !', 'It’s raining, take your umbrella!', 'إنها تمطر، خذ مظلتك!'],
      ['❄️', 'Il neige.', 'It’s snowing.', 'إنها تثلج.', 'Il neige ! On fait un bonhomme de neige ?', 'It’s snowing! Shall we build a snowman?', 'إنها تثلج! هل نصنع رجل ثلج؟'],
      ['🌬️', 'Il y a du vent.', 'It’s windy.', 'الجو عاصف.', 'Il y a du vent, ferme la fenêtre.', 'It’s windy, close the window.', 'الجو عاصف، أغلق النافذة.'],
      ['🥵', 'Il fait chaud.', 'It’s hot.', 'الجو حار.', 'Il fait trop chaud, je veux une glace !', 'It’s too hot, I want an ice cream!', 'الجو حار جدًا، أريد مثلجات!'],
      ['🥶', 'Il fait froid.', 'It’s cold.', 'الجو بارد.', 'Il fait froid, mets ton manteau.', 'It’s cold, put your coat on.', 'الجو بارد، البس المعطف.'],
      ['☁️', 'des nuages', 'clouds', 'غيوم', 'Le ciel est plein de nuages.', 'The sky is full of clouds.', 'السماء مليئة بالغيوم.'],
      ['⛈️', 'un orage', 'a storm', 'عاصفة', 'Il y a un orage ce soir.', 'There is a storm tonight.', 'هناك عاصفة الليلة.'],
      ['🌈', 'un arc-en-ciel', 'a rainbow', 'قوس قزح', 'Regarde, un arc-en-ciel !', 'Look, a rainbow!', 'انظر، قوس قزح!'],
      ['🌡️', 'la température', 'the temperature', 'درجة الحرارة', 'Il fait vingt degrés.', 'It’s twenty degrees.', 'الحرارة ٢٠ درجة.']
    ],
    animals: [
      ['🐱', 'le chat', 'the cat', 'القطة', 'Mon chat dort sur le canapé.', 'My cat sleeps on the sofa.', 'قطتي تنام على الأريكة.'],
      ['🐶', 'le chien', 'the dog', 'الكلب', 'Le chien aboie quand on sonne.', 'The dog barks when someone rings.', 'الكلب ينبح عندما يرنّ أحد الجرس.'],
      ['🐴', 'le cheval', 'the horse', 'الحصان', 'Le cheval court très vite.', 'The horse runs very fast.', 'الحصان يركض بسرعة كبيرة.'],
      ['🐮', 'la vache', 'the cow', 'البقرة', 'La vache nous donne du lait.', 'The cow gives us milk.', 'البقرة تعطينا الحليب.'],
      ['🐦', 'un oiseau', 'a bird', 'عصفور', 'Un oiseau chante sur l’arbre.', 'A bird is singing in the tree.', 'عصفور يغرّد على الشجرة.'],
      ['🐠', 'un poisson rouge', 'a goldfish', 'سمكة ملونة', 'J’ai un poisson rouge.', 'I have a goldfish.', 'عندي سمكة ملوّنة.'],
      ['🦁', 'le lion', 'the lion', 'الأسد', 'Le lion est le roi des animaux.', 'The lion is the king of the animals.', 'الأسد ملك الحيوانات.'],
      ['🐘', 'l’éléphant', 'the elephant', 'الفيل', 'L’éléphant a une très longue trompe.', 'The elephant has a very long trunk.', 'خرطوم الفيل طويل جدًا.'],
      ['🐰', 'le lapin', 'the rabbit', 'الأرنب', 'Le lapin mange une carotte.', 'The rabbit is eating a carrot.', 'الأرنب يأكل جزرة.'],
      ['🐒', 'le singe', 'the monkey', 'القرد', 'Le singe grimpe aux arbres.', 'The monkey climbs trees.', 'القرد يتسلّق الأشجار.']
    ],
    fetes: [
      ['🎂', 'Joyeux anniversaire !', 'Happy birthday!', 'عيد ميلاد سعيد!', 'Joyeux anniversaire, Sara !', 'Happy birthday, Sara!', 'عيد ميلاد سعيد يا سارة!'],
      ['🕌', 'l’Aïd', 'Eid', 'العيد', 'Aïd Moubarak ! Bonne fête à toute la famille.', 'Eid Mubarak! Happy Eid to the whole family.', 'عيد مبارك! كل عام وأنتم والعائلة بخير.'],
      ['🌙', 'le ramadan', 'Ramadan', 'رمضان', 'Pendant le ramadan, on mange après le coucher du soleil.', 'During Ramadan, we eat after sunset.', 'في رمضان نأكل بعد المغرب.'],
      ['🎆', 'le 14 juillet', '14 July', '١٤ يوليو', 'Le 14 juillet, c’est la fête nationale française.', '14 July is the French national day.', '١٤ يوليو هو العيد الوطني الفرنسي.'],
      ['🥂', 'Bonne année !', 'Happy New Year!', 'سنة سعيدة!', 'Bonne année et bonne santé !', 'Happy New Year and good health!', 'سنة سعيدة وصحة جيدة!'],
      ['🎁', 'un cadeau', 'a present', 'هدية', 'Merci pour ce joli cadeau !', 'Thank you for this lovely present!', 'شكرًا على هذه الهدية الجميلة!'],
      ['🎈', 'une fête', 'a party', 'حفلة', 'On fait une fête samedi, tu viens ?', 'We’re having a party on Saturday, are you coming?', 'سنقيم حفلة يوم السبت، هل ستأتي؟'],
      ['💐', 'la fête des Mères', 'Mother’s Day', 'عيد الأم', 'Pour la fête des Mères, j’offre des fleurs.', 'For Mother’s Day, I give flowers.', 'في عيد الأم أحضر الورود.'],
      ['🎊', 'Félicitations !', 'Congratulations!', 'مبروك!', 'Félicitations pour ton diplôme !', 'Congratulations on your diploma!', 'مبروك على شهادتك!'],
      ['🥳', 'faire la fête', 'to celebrate', 'يحتفل', 'Ce soir, on fait la fête !', 'Tonight, we celebrate!', 'سنحتفل الليلة!']
    ]
  };
  // ----- 6 grammar levels × 4 topics: [title fr, title en, title ar, rule en, rule ar, examples [fr, en, ar], quiz [sentence with ___, options (first right), why en, why ar]] -----
  const GRAM = [
    ['Débutant', 'Beginner', 'المبتدئ', 'A1', [
      ['Être', 'The verb “to be”', 'فعل «يكون»', 'je suis · tu es · il/elle est · nous sommes · vous êtes · ils/elles sont', 'je suis · tu es · il/elle est · nous sommes · vous êtes · ils/elles sont — نستخدمه للصفات والمهن والجنسية.', [['Je suis étudiant.', 'I am a student.', 'أنا طالب.'], ['Elle est contente.', 'She is happy.', 'هي سعيدة.']], ['Nous ___ amis.', ['sommes', 'êtes', 'sont'], 'nous → sommes.', 'مع nous نقول sommes.']],
      ['Avoir', 'The verb “to have”', 'فعل «يملك»', 'j’ai · tu as · il/elle a · nous avons · vous avez · ils/elles ont. French uses avoir for age: j’ai dix ans.', 'j’ai · tu as · il/elle a · nous avons · vous avez · ils/elles ont — ونستخدمه للعمر: j’ai dix ans.', [['J’ai un chat.', 'I have a cat.', 'عندي قطة.'], ['Ils ont dix ans.', 'They are ten.', 'عمرهم ١٠ سنوات.']], ['Tu ___ un frère ?', ['as', 'a', 'ai'], 'tu → as.', 'مع tu نقول as.']],
      ['Les articles', 'Articles', 'أدوات التعريف والتنكير', 'the: le (masculine), la (feminine), les (plural), l’ before a vowel. a: un (masculine), une (feminine).', 'أداة التعريف: le للمذكر، la للمؤنث، les للجمع، و l’ قبل حرف متحرك. أداة التنكير: un للمذكر و une للمؤنث.', [['le livre, la maison, les enfants', 'the book, the house, the children', 'الكتاب، البيت، الأطفال'], ['un chien, une pomme', 'a dog, an apple', 'كلب، تفاحة']], ['___ maison est grande.', ['La', 'Le', 'Les'], 'maison is feminine → la.', 'maison مؤنث ← la.']],
      ['La négation', 'Saying “not”', 'النفي', 'Put ne … pas around the verb. Before a vowel, ne becomes n’.', 'نضع ne … pas حول الفعل، وقبل الحرف المتحرك تصبح ne ‏n’.', [['Je ne parle pas anglais.', 'I don’t speak English.', 'أنا لا أتكلم الإنجليزية.'], ['Il n’aime pas le fromage.', 'He doesn’t like cheese.', 'هو لا يحب الجبن.']], ['Je ___ comprends pas.', ['ne', 'pas', 'non'], 'ne goes before the verb, pas after it.', 'ne قبل الفعل و pas بعده.']]
    ]],
    ['Élémentaire', 'Elementary', 'الأساسي', 'A2', [
      ['Les verbes en -er', 'Present tense of -er verbs', 'المضارع لأفعال -er', 'parler: je parle · tu parles · il parle · nous parlons · vous parlez · ils parlent. (-e, -es, -e, -ons, -ez, -ent)', 'parler: je parle · tu parles · il parle · nous parlons · vous parlez · ils parlent — النهايات: ‎-e, -es, -e, -ons, -ez, -ent', [['Nous parlons français.', 'We speak French.', 'نحن نتكلم الفرنسية.'], ['Ils habitent à Paris.', 'They live in Paris.', 'هم يسكنون في باريس.']], ['Vous ___ arabe ?', ['parlez', 'parlons', 'parle'], 'vous → -ez.', 'مع vous النهاية ‎-ez.']],
      ['Les adjectifs', 'Adjective agreement', 'توافق الصفة', 'Adjectives match the noun: add -e for feminine, -s for plural. Most come after the noun; petit, grand, beau… come before.', 'الصفة تتبع الاسم: نضيف e للمؤنث و s للجمع. أغلبها بعد الاسم، وpetit وgrand وbeau قبله.', [['un petit garçon · une petite fille', 'a little boy · a little girl', 'ولد صغير · بنت صغيرة'], ['des chats noirs', 'black cats', 'قطط سوداء']], ['Une ___ voiture.', ['petite', 'petit', 'petits'], 'voiture is feminine singular → petite.', 'voiture مؤنث مفرد ← petite.']],
      ['Poser une question', 'Asking questions', 'السؤال', 'Est-ce que + sentence, or a question word: où (where), quand (when), comment (how), pourquoi (why), qui (who).', 'Est-ce que + الجملة، أو كلمة استفهام: où (أين)، quand (متى)، comment (كيف)، pourquoi (لماذا)، qui (مَن).', [['Est-ce que tu viens ?', 'Are you coming?', 'هل أنت قادم؟'], ['Où habites-tu ?', 'Where do you live?', 'أين تسكن؟']], ['___ tu t’appelles ?', ['Comment', 'Où', 'Quand'], '“What is your name?” = Comment tu t’appelles ?', 'ما اسمك؟ = Comment tu t’appelles ?']],
      ['Le futur proche', 'The near future', 'المستقبل القريب', 'aller (je vais, tu vas, il va, nous allons, vous allez, ils vont) + infinitive.', 'aller (je vais, tu vas, il va, nous allons, vous allez, ils vont) + المصدر.', [['Je vais voyager.', 'I’m going to travel.', 'أنا سأسافر.'], ['On va manger.', 'We’re going to eat.', 'نحن سنأكل.']], ['Demain, nous ___ visiter Paris.', ['allons', 'allez', 'vont'], 'nous → allons.', 'مع nous نقول allons.']]
    ]],
    ['Pré-intermédiaire', 'Pre-intermediate', 'قبل المتوسط', 'A2+', [
      ['Le passé composé (avoir)', 'Past tense with avoir', 'الماضي مع avoir', 'avoir + past participle: parler → parlé, finir → fini, lire → lu, faire → fait.', 'avoir + التصريف الثالث: parlé · fini · lu · fait.', [['Hier, j’ai regardé un film.', 'Yesterday, I watched a film.', 'أمس شاهدت فيلمًا.'], ['Il a fini ses devoirs.', 'He finished his homework.', 'أنهى واجبه.']], ['Hier, elle ___ un livre.', ['a lu', 'est lu', 'a lire'], 'lire → lu, with avoir.', 'lire تصريفها lu وتأتي مع avoir.']],
      ['Le passé composé (être)', 'Past tense with être', 'الماضي مع être', 'Movement verbs (aller, venir, partir, arriver, entrer, sortir…) use être, and the participle agrees: elle est allée.', 'أفعال الحركة (aller وvenir وpartir وarriver…) تأخذ être، والتصريف يتبع الفاعل: elle est allée.', [['Elle est partie à huit heures.', 'She left at eight.', 'غادرتُ الساعة الثامنة.'], ['Nous sommes allés au cinéma.', 'We went to the cinema.', 'ذهبنا إلى السينما.']], ['Nous ___ arrivés en retard.', ['sommes', 'avons', 'êtes'], 'arriver uses être; nous → sommes.', 'arriver تأخذ être، ومع nous ← sommes.']],
      ['Le partitif', 'Some: du, de la, des', 'أداة الجزئية', 'du (masc.), de la (fem.), de l’ (vowel), des (plural). After a negative: de / d’.', 'du للمذكر، de la للمؤنث، de l’ قبل حرف متحرك، des للجمع. وبعد النفي: de أو d’.', [['Je mange du pain et de la confiture.', 'I eat (some) bread and jam.', 'آكل الخبز والمربى.'], ['Je ne bois pas de café.', 'I don’t drink coffee.', 'لا أشرب القهوة.']], ['Je bois ___ eau.', ['de l’', 'du', 'de la'], 'eau starts with a vowel → de l’.', 'eau تبدأ بحرف متحرك ← de l’.']],
      ['Les possessifs', 'My, your, his…', 'الملكية', 'mon / ma / mes (my), ton / ta / tes (your), son / sa / ses (his, her). They match the thing owned.', 'mon / ma / mes (لي)، ton / ta / tes (لك)، son / sa / ses (له/لها) — وتتبع الشيء المملوك.', [['mon père, ma mère, mes amis', 'my father, my mother, my friends', 'أبي، أمي، أصدقائي'], ['Elle aime son chat.', 'She loves her cat.', 'هي تحب قطتها.']], ['C’est ___ sœur.', ['ma', 'mon', 'mes'], 'sœur is feminine singular → ma.', 'sœur مؤنث مفرد ← ma.']]
    ]],
    ['Intermédiaire', 'Intermediate', 'المتوسط', 'B1', [
      ['Imparfait ou passé composé ?', 'Imperfect or perfect?', 'الماضي المستمر أم التام؟', 'Imparfait for description, habits and background (-ais, -ait, -ions…). Passé composé for one finished event.', 'الإمبارفيه للوصف والعادات والخلفية (‎-ais, -ait…)، والباسيه كومبوزيه لحدث واحد انتهى.', [['Il pleuvait quand je suis sorti.', 'It was raining when I went out.', 'كانت تمطر عندما خرجت.'], ['Quand j’étais petit, j’habitais à Lyon.', 'When I was little, I lived in Lyon.', 'عندما كنت صغيرًا كنت أسكن في ليون.']], ['Quand j’étais petit, je ___ au foot tous les jours.', ['jouais', 'ai joué', 'joue'], 'A habit in the past → imparfait.', 'عادة في الماضي ← الإمبارفيه.']],
      ['Le futur simple', 'The future tense', 'المستقبل', 'infinitive + -ai, -as, -a, -ons, -ez, -ont. Irregular: être → serai, avoir → aurai, faire → ferai, aller → irai.', 'المصدر + ‎-ai, -as, -a, -ons, -ez, -ont. الشاذ: être ← serai، avoir ← aurai، faire ← ferai، aller ← irai.', [['Demain, il fera beau.', 'Tomorrow the weather will be nice.', 'غدًا سيكون الجو جميلًا.'], ['Nous voyagerons en été.', 'We will travel in summer.', 'سنسافر في الصيف.']], ['L’année prochaine, je ___ en France.', ['serai', 'suis', 'étais'], 'Future of être → serai.', 'مستقبل être ← serai.']],
      ['Les pronoms COD / COI', 'Object pronouns', 'ضمائر المفعول', 'Direct: le, la, les (it/him/her/them). Indirect: lui, leur (to him/her/them). They go before the verb.', 'مباشر: le, la, les. غير مباشر: lui, leur. وتوضع قبل الفعل.', [['Je le vois tous les jours.', 'I see him every day.', 'أراه كل يوم.'], ['Je lui parle au téléphone.', 'I talk to her on the phone.', 'أكلّمها في الهاتف.']], ['Tu connais Marie ? Oui, je ___ connais.', ['la', 'lui', 'le'], 'connaître takes a direct object; Marie is feminine → la.', 'connaître مفعولها مباشر، وماري مؤنث ← la.']],
      ['Le comparatif', 'Comparing', 'المقارنة', 'plus … que (more), moins … que (less), aussi … que (as). Irregular: bon → meilleur, bien → mieux.', 'plus … que (أكثر)، moins … que (أقل)، aussi … que (مثل). الشاذ: bon ← meilleur، bien ← mieux.', [['Paris est plus grand que Lyon.', 'Paris is bigger than Lyon.', 'باريس أكبر من ليون.'], ['Elle chante mieux que moi.', 'She sings better than me.', 'هي تغني أفضل مني.']], ['Ce gâteau est ___ que l’autre.', ['meilleur', 'plus bon', 'bien'], 'bon → meilleur (never “plus bon”).', 'bon ← meilleur (ولا يصح plus bon).']]
    ]],
    ['Avancé', 'Upper-intermediate', 'فوق المتوسط', 'B2', [
      ['Le conditionnel', 'The conditional', 'الشرط', 'future stem + -ais, -ait… (je voudrais, on pourrait). Si + imparfait → conditionnel.', 'جذر المستقبل + ‎-ais, -ait… (je voudrais). و Si + إمبارفيه ← كونديسيونيل.', [['Si j’avais le temps, je voyagerais.', 'If I had time, I would travel.', 'لو كان عندي وقت لسافرت.'], ['Je voudrais un renseignement.', 'I would like some information.', 'أريد أن أستفسر عن شيء.']], ['Si j’étais riche, j’___ une maison.', ['achèterais', 'achète', 'achèterai'], 'si + imparfait → conditionnel.', 'si + إمبارفيه ← كونديسيونيل.']],
      ['Le subjonctif', 'The subjunctive', 'صيغة الـsubjonctif', 'After il faut que, je veux que, pour que, bien que… être → que je sois, avoir → que j’aie, faire → que je fasse.', 'بعد il faut que وje veux que وpour que وbien que… être ← que je sois، avoir ← que j’aie، faire ← que je fasse.', [['Il faut que tu viennes.', 'You have to come.', 'يجب أن تأتي.'], ['Je veux qu’il soit heureux.', 'I want him to be happy.', 'أريده أن يكون سعيدًا.']], ['Il faut que nous ___ à l’heure.', ['soyons', 'sommes', 'serons'], 'il faut que + subjonctif: être → soyons.', 'il faut que + subjonctif ← soyons.']],
      ['Les pronoms relatifs', 'Relative pronouns', 'الأسماء الموصولة', 'qui (subject), que (object), où (place/time), dont (with de: parler de, avoir besoin de).', 'qui للفاعل، que للمفعول، où للمكان والزمان، dont مع الأفعال التي تأخذ de.', [['Le livre que je lis est génial.', 'The book I’m reading is great.', 'الكتاب الذي أقرؤه رائع.'], ['La ville où j’habite est calme.', 'The town where I live is quiet.', 'المدينة التي أسكن فيها هادئة.']], ['C’est le film ___ je t’ai parlé.', ['dont', 'que', 'qui'], 'parler de → dont.', 'parler de ← dont.']],
      ['Le plus-que-parfait', 'The pluperfect', 'الماضي البعيد', 'avoir/être in the imparfait + participle: an action before another past action.', 'avoir أو être في الإمبارفيه + التصريف الثالث: حدث وقع قبل حدث آخر في الماضي.', [['Quand il est arrivé, le film avait déjà commencé.', 'When he arrived, the film had already started.', 'عندما وصل كان الفيلم قد بدأ.'], ['Elle était partie avant nous.', 'She had left before us.', 'كانت قد غادرت قبلنا.']], ['Elle était fatiguée parce qu’elle ___ toute la nuit.', ['avait travaillé', 'a travaillé', 'travaillait'], 'It happened before “était fatiguée” → plus-que-parfait.', 'وقع قبل التعب ← الماضي البعيد.']]
    ]],
    ['Expert', 'Advanced', 'المتقدم', 'C1', [
      ['Le discours indirect', 'Reported speech', 'الكلام المنقول', 'After a past verb (il a dit que…), the future becomes conditional and the present becomes imparfait.', 'بعد فعل ماضٍ (il a dit que…) يصبح المستقبل كونديسيونيل والمضارع إمبارفيه.', [['Il dit qu’il est fatigué.', 'He says he is tired.', 'يقول إنه متعب.'], ['Il a dit qu’il viendrait demain.', 'He said he would come tomorrow.', 'قال إنه سيأتي غدًا.']], ['Il a dit qu’il ___ le lendemain.', ['viendrait', 'viendra', 'vient'], 'Past reporting verb + future → conditional.', 'فعل نقل ماضٍ + مستقبل ← كونديسيونيل.']],
      ['Le gérondif', 'The gerund', 'صيغة «وهو يفعل»', 'en + present participle (-ant): two actions at the same time, or how something is done.', 'en + التصريف بـ‎-ant: شيئان في الوقت نفسه، أو الطريقة.', [['Il chante en cuisinant.', 'He sings while cooking.', 'يغني وهو يطبخ.'], ['On apprend en pratiquant.', 'You learn by practising.', 'نتعلم بالممارسة.']], ['Elle écoute de la musique ___ ses devoirs.', ['en faisant', 'en faire', 'faisant en'], 'en + -ant: en faisant.', 'en + ‎-ant ← en faisant.']],
      ['Bien que + subjonctif', 'Although + subjunctive', 'على الرغم من أن + subjonctif', 'bien que, quoique, avant que, pour que are always followed by the subjunctive.', 'bien que وquoique وavant que وpour que يأتي بعدها subjonctif دائمًا.', [['Bien qu’il soit fatigué, il travaille.', 'Although he is tired, he works.', 'على الرغم من أنه متعب، فهو يعمل.'], ['Je pars avant qu’il pleuve.', 'I’m leaving before it rains.', 'سأغادر قبل أن تمطر.']], ['Bien qu’elle ___ malade, elle est venue.', ['soit', 'est', 'était'], 'bien que + subjunctive → soit.', 'bien que + subjonctif ← soit.']],
      ['La voix passive', 'The passive voice', 'المبني للمجهول', 'être (in any tense) + past participle (+ par …). The participle agrees with the subject.', 'être (في أي زمن) + التصريف الثالث (+ par …)، والتصريف يتبع الفاعل.', [['Ce livre a été écrit par Victor Hugo.', 'This book was written by Victor Hugo.', 'كُتب هذا الكتاب بيد فيكتور هوغو.'], ['La tour Eiffel est visitée par des millions de touristes.', 'The Eiffel Tower is visited by millions of tourists.', 'يزور برج إيفل ملايين السياح.']], ['Ce château ___ construit au XVIe siècle.', ['a été', 'a', 'était en'], 'Passive past: a été + participle.', 'المجهول في الماضي: a été + التصريف.']]
    ]]
  ];

  // ===================== helpers =====================
  const html = document.documentElement;
  const ar = function(){ return html.lang === 'ar'; };
  const T = function(en, a){ return ar() ? a : en; };
  const esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const KIDS = /🧒|👧|👦|🧑‍🎓/;
  let frVoice = null;
  function pickVoice(){ try{ const v = speechSynthesis.getVoices(); frVoice = v.find(function(x){ return /^fr(-|_)FR/i.test(x.lang); }) || v.find(function(x){ return /^fr/i.test(x.lang); }) || null; }catch(e){} }
  if(window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function say(text, opts){
    opts = opts || {};
    return new Promise(function(res){
      try{
        if(!window.speechSynthesis){ res(); return; }
        if(!opts.queue) speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = 'fr-FR'; if(frVoice) u.voice = frVoice;
        u.rate = opts.rate || .9; u.pitch = opts.pitch || 1;
        u.onend = res; u.onerror = res; speechSynthesis.speak(u);
        setTimeout(res, 2500 + text.length * 110); // never wait forever
      }catch(e){ res(); }
    });
  }
  const norm = function(s){ return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean); };
  function store(k, d){ try{ return JSON.parse(localStorage.getItem(k) || 'null') || d; }catch(e){ return d; } }
  function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  const party = function(el){ if(window.ccFx){ if(el) ccFx.burstFrom(el, { emoji: ['⭐', '🗼'], colors: ['#8a1c33', '#c9a227', '#1f3a6e', '#ffffff'] }); } };

  // ===================== grammar: six levels =====================
  const gramEl = document.getElementById('gramApp');
  let gLv = 0, gDone = store('cc_fr_gram', {}), gAns = {};
  function renderGram(){
    if(!gramEl) return;
    const L = GRAM[gLv];
    gramEl.innerHTML = '<div class="g-tabs" role="tablist">' + GRAM.map(function(l, i){
      const n = l[4].filter(function(_, j){ return gDone[i + '-' + j]; }).length;
      return '<button type="button" role="tab" aria-selected="' + (i === gLv) + '" class="' + (i === gLv ? 'on' : '') + '" data-glv="' + i + '"><b>' + (i + 1) + '</b><span>' + esc(T('Level ' + (i + 1), 'المستوى ' + (i + 1))) + '</span><small>' + (n ? n + '/4 ✓' : esc(T('4 topics', '٤ مواضيع'))) + '</small></button>';
    }).join('') + '</div>' +
      '<div class="g-lv"><h3>' + esc(T('Level ' + (gLv + 1), 'المستوى ' + (gLv + 1))) + '</h3><span class="g-badge">' + esc(T('4 topics', '٤ مواضيع')) + '</span></div>' + bookCard(gLv + 1) +
      '<div class="g-grid">' + L[4].map(function(t, j){
        const key = gLv + '-' + j, a = gAns[key], q = t[6];
        const order = (gAns['o' + key] = gAns['o' + key] || [0, 1, 2].sort(function(){ return Math.random() - .5; }));
        return '<article class="g-card' + (gDone[key] ? ' done' : '') + '"><div class="g-h"><span class="g-n">' + (j + 1) + '</span><div><b class="fr">' + esc(t[0]) + '</b><small>' + esc(T(t[1], t[2])) + '</small></div>' + (gDone[key] ? '<span class="g-ok">✓</span>' : '') + '</div>' +
          '<p class="g-rule">' + esc(T(t[3], t[4])) + '</p>' +
          '<div class="g-ex">' + t[5].map(function(e){ return '<button type="button" class="g-say" data-say="' + esc(e[0]) + '"><span>🔊</span><b class="fr">' + esc(e[0]) + '</b><small>' + esc(T(e[1], e[2])) + '</small></button>'; }).join('') + '</div>' +
          '<div class="g-quiz"><p class="fr">' + esc(q[0]).replace('___', '<u>' + (a != null ? esc(q[1][0]) : '&nbsp;?&nbsp;') + '</u>') + '</p><div class="g-opts">' +
            order.map(function(i){ return '<button type="button" class="fr' + (a != null ? (i === 0 ? ' ok' : (i === a ? ' no' : '')) : '') + '" data-gq="' + key + '" data-k="' + i + '"' + (a != null ? ' disabled' : '') + '>' + esc(q[1][i]) + '</button>'; }).join('') +
          '</div>' + (a != null ? '<p class="g-why">' + (a === 0 ? '⭐ ' + esc(T('Correct! ', 'صحيح! ')) : '💡 ') + esc(T(q[2], q[3])) + '</p>' + (a !== 0 ? '<button type="button" class="g-retry" data-retry="' + key + '">↻ ' + esc(T('Try again', 'جرّب مرة أخرى')) + '</button>' : '') : '') + '</div></article>';
      }).join('') + '</div>';
  }
  // the book of each level: teachers upload it in the French dashboard (📘 Books)
  const SB = 'https://orpknmkgfwmtroiqljzp.supabase.co', SBK = 'sb_publishable_x7AQ0xQl8qqOH3iDKqxddg_-7fbStUh';
  let BOOKS = null;
  try{ fetch(SB + '/rest/v1/track_books?track=eq.french&select=level,title,file_path,file_size&order=created_at.desc', { headers: { apikey: SBK } })
    .then(function(r){ return r.ok ? r.json() : []; }).then(function(rows){ BOOKS = rows || []; renderGram(); }).catch(function(){ BOOKS = []; renderGram(); }); }catch(e){ BOOKS = []; }
  const size = function(b){ return b ? (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB') : ''; };
  function bookCard(lv){
    const list = (BOOKS || []).filter(function(b){ return b.level === lv; });
    if(BOOKS === null) return '<div class="g-book loading">📘 …</div>';
    if(!list.length) return '<div class="g-book empty"><span class="gb-ic">📘</span><div><b>' + esc(T('The Level ' + lv + ' book', 'كتاب المستوى ' + lv)) + '</b><small>' + esc(T('No books yet', 'لا توجد كتب')) + '</small></div></div>';
    return list.map(function(b){
      const url = SB + '/storage/v1/object/public/track-books/' + b.file_path.split('/').map(encodeURIComponent).join('/');
      return '<div class="g-book"><span class="gb-ic">📘</span><div class="gb-t"><b>' + esc(b.title) + '</b><small>' + esc(T('Level ' + lv + ' book', 'كتاب المستوى ' + lv)) + (b.file_size ? ' · ' + size(b.file_size) : '') + '</small></div>' +
        '<a class="gb-dl" href="' + esc(url) + '" target="_blank" rel="noopener" download>⬇️ ' + esc(T('Download the book', 'حمّل الكتاب')) + '</a></div>';
    }).join('');
  }
  if(gramEl) gramEl.addEventListener('click', function(e){
    const tab = e.target.closest('[data-glv]'); if(tab){ gLv = +tab.dataset.glv; renderGram(); return; }
    const s = e.target.closest('[data-say]'); if(s){ say(s.dataset.say); return; }
    const r = e.target.closest('[data-retry]'); if(r){ delete gAns[r.dataset.retry]; delete gAns['o' + r.dataset.retry]; renderGram(); return; }
    const b = e.target.closest('[data-gq]'); if(!b) return;
    const key = b.dataset.gq, k = +b.dataset.k; gAns[key] = k;
    const parts = key.split('-'), q = GRAM[+parts[0]][4][+parts[1]][6];
    if(k === 0){ gDone[key] = 1; save('cc_fr_gram', gDone); party(b); say(q[0].replace('___', q[1][0])); }
    renderGram();
  });

  // ===================== explore: cinema, music, food, travel =====================
  // [id, icon, name fr, en, ar, colour, tint]
  const THEMES = [
    ['cine', '🎬', 'Cinéma', 'Film scenes', 'مشاهد سينمائية', '#8a1c33', '#f8e3e6'], ['music', '🎵', 'Musique', 'Music', 'الموسيقى', '#1f3a6e', '#e3e9f6'],
    ['food', '🥐', 'Cuisine', 'Food', 'الطعام', '#b8872a', '#f8efdc'], ['travel', '🗼', 'Voyage', 'Travel', 'السفر', '#2d6a4f', '#e1f1e8'],
    ['school', '🏫', 'École', 'School', 'المدرسة', '#c2410c', '#fdebe0'], ['family', '👨‍👩‍👧', 'Famille', 'Family', 'العائلة', '#be185d', '#fbe6f0'],
    ['sport', '⚽', 'Sport', 'Sport', 'الرياضة', '#15803d', '#e3f5e8'], ['shop', '🛍️', 'Shopping', 'Shopping', 'التسوق', '#7c3aed', '#efe8fd'],
    ['health', '🩺', 'Santé', 'Health', 'الصحة', '#0e7490', '#e0f3f7'], ['weather', '🌦️', 'Météo', 'Weather', 'الطقس', '#2563eb', '#e5edfd'],
    ['animals', '🐾', 'Animaux', 'Animals', 'الحيوانات', '#a16207', '#f9f0da'], ['fetes', '🎉', 'Fêtes', 'Celebrations', 'المناسبات', '#db2777', '#fde7f1']
  ].map(function(t){ return { id: t[0], icon: t[1], fr: t[2], en: t[3], ar: t[4], c: t[5], tint: t[6] }; });
  const thOf = function(id){ return THEMES.find(function(t){ return t.id === id; }); };
  // every item becomes a little scene: [emoji, title fr, title en, title ar, colour, lines]
  function itemsOf(th){
    if(th === 'cine') return CINE;
    const src = th === 'music' ? MUSIC : th === 'food' ? FOOD : th === 'travel' ? TRAVEL : MORE[th];
    const t = thOf(th);
    return src.map(function(x){ return [x[0], x[1], x[2], x[3], t.tint, [[x[0], x[1], x[2], x[3]], ['🙋', x[4], x[5], x[6]]]]; });
  }
  const exEl = document.getElementById('exploreApp');
  let exTh = 'cine', exDone = store('cc_fr_explore', {}), exAll = false;
  const doneIn = function(id){ return itemsOf(id).filter(function(_, i){ return exDone[id + '-' + i]; }).length; };
  function ring(p, c){ const C = 2 * Math.PI * 15; return '<svg class="x-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - p)).toFixed(1) + '" transform="rotate(-90 18 18)"/></svg>'; }
  function renderExplore(){
    if(!exEl) return;
    const items = itemsOf(exTh), th = thOf(exTh), done = doneIn(exTh), cine = exTh === 'cine';
    const show = exAll ? items.length : Math.min(cine ? 12 : 10, items.length);
    const total = THEMES.reduce(function(x, t){ return x + itemsOf(t.id).length; }, 0), totalDone = THEMES.reduce(function(x, t){ return x + doneIn(t.id); }, 0);
    const next = items.findIndex(function(_, i){ return !exDone[exTh + '-' + i]; });
    exEl.innerHTML = '<div class="x-rail" role="tablist">' + THEMES.map(function(t){
      const n = itemsOf(t.id).length, d = doneIn(t.id);
      return '<button type="button" role="tab" aria-selected="' + (t.id === exTh) + '" class="x-chip' + (t.id === exTh ? ' on' : '') + '" style="--c:' + t.c + ';--t:' + t.tint + '" data-th="' + t.id + '"><span class="x-ic">' + t.icon + ring(d / n, t.c) + '</span><span class="x-nm"><b class="fr">' + t.fr + '</b><small>' + esc(T(t.en, t.ar)) + ' · ' + n + '</small></span></button>';
    }).join('') + '</div>' +
      '<div class="x-banner" style="--c:' + th.c + ';--t:' + th.tint + '"><span class="x-big" aria-hidden="true">' + th.icon + '</span><div class="x-bt"><small>' + esc(T('World ', 'عالم ') + (THEMES.indexOf(th) + 1) + '/' + THEMES.length) + '</small><h3 class="fr">' + th.fr + '</h3><p>' + esc(T(th.en, th.ar)) + ' · ' + esc(cine ? T(items.length + ' scenes acted out with voices', items.length + ' مشهد بالصوت والترجمة') : T(items.length + ' words with real-life sentences', items.length + ' كلمة بجمل من الحياة')) + '</p>' +
        '<div class="x-pb"><i style="width:' + Math.round(100 * done / items.length) + '%"></i></div><small class="x-pt">' + esc(T(done + ' / ' + items.length + ' done', 'أُنجز ' + done + ' من ' + items.length)) + (done === items.length ? ' 🏆' : '') + ' · ' + esc(T('all worlds: ' + totalDone + ' / ' + total, 'كل العوالم: ' + totalDone + ' / ' + total)) + '</small></div>' +
        (next >= 0 ? '<button type="button" class="x-start" data-play="' + next + '">▶ ' + esc(done ? T('Continue', 'تابِع') : T('Start', 'ابدأ')) + '</button>' : '<span class="x-trophy">🏆</span>') + '</div>' +
      '<div class="x-grid' + (cine ? ' cine' : '') + '" style="--c:' + th.c + ';--t:' + th.tint + '">' + items.slice(0, show).map(function(it, i){
        const d = exDone[exTh + '-' + i];
        return cine
          ? '<button type="button" class="x-ticket' + (d ? ' done' : '') + '" data-play="' + i + '"><span class="tk-n">' + esc(T('Scene', 'مشهد')) + '<b>' + String(i + 1).padStart(2, '0') + '</b></span><span class="tk-body"><span class="x-em">' + it[0] + '</span><b class="fr">' + esc(it[1]) + '</b><small>' + esc(T(it[2], it[3])) + '</small></span><span class="tk-go">' + (d ? '✓' : '▶') + '</span></button>'
          : '<div class="x-card' + (d ? ' done' : '') + '"><button type="button" class="x-open" data-play="' + i + '"><span class="x-em">' + it[0] + '</span><b class="fr">' + esc(it[1]) + '</b><small>' + esc(T(it[2], it[3])) + '</small></button><div class="x-foot"><button type="button" class="x-quick" data-quick="' + esc(it[1]) + '" aria-label="' + esc(T('Listen', 'استمع')) + '">🔊</button><button type="button" class="x-go" data-play="' + i + '">' + (d ? '✓ ' + esc(T('Done', 'أُنجز')) : '▶ ' + esc(T('Practise', 'تدرّب'))) + '</button></div></div>';
      }).join('') + '</div>' +
      (items.length > show || exAll ? '<div class="x-more"><button type="button" class="btn ghost" data-xall>' + esc(exAll ? T('Show less', 'عرض أقل') : T('Show all ' + items.length, 'عرض الكل (' + items.length + ')')) + '</button></div>' : '');
  }
  if(exEl) exEl.addEventListener('click', function(e){
    const t = e.target.closest('[data-th]'); if(t){ exTh = t.dataset.th; exAll = false; renderExplore(); return; }
    if(e.target.closest('[data-xall]')){ exAll = !exAll; renderExplore(); return; }
    const q = e.target.closest('[data-quick]'); if(q){ say(q.dataset.quick); q.classList.remove('pop'); void q.offsetWidth; q.classList.add('pop'); return; }
    const p = e.target.closest('[data-play]'); if(p) openPlayer(exTh, +p.dataset.play);
  });

  // ----- the scene player: a little film with voices, subtitles and pronunciation practice -----
  const dlg = document.createElement('dialog'); dlg.className = 'player'; document.body.appendChild(dlg);
  let pTh = null, pI = 0, playing = false, showTr = true, slow = false;
  function openPlayer(th, i){ pTh = th; pI = i; playing = false; renderPlayer(); if(!dlg.open) dlg.showModal(); }
  function speakersOf(lines){ const s = []; lines.forEach(function(l){ if(s.indexOf(l[0]) === -1) s.push(l[0]); }); return s; }
  function renderPlayer(){
    const items = itemsOf(pTh), it = items[pI], sp = speakersOf(it[5]), th = thOf(pTh);
    dlg.innerHTML = '<div class="p-stage" style="--bg:' + it[4] + '"><button type="button" class="p-x" data-px aria-label="' + esc(T('Close', 'إغلاق')) + '">✕</button>' +
      '<span class="p-kick">' + th.icon + ' <span class="fr">' + th.fr + '</span> · ' + (pI + 1) + '/' + items.length + '</span><h3 class="fr">' + it[0] + ' ' + esc(it[1]) + '</h3><p class="p-sub">' + esc(T(it[2], it[3])) + '</p>' +
      '<div class="p-cast">' + sp.map(function(s, k){ return '<span class="p-actor" data-actor="' + k + '">' + s + '</span>'; }).join('') + '</div>' +
      '<div class="p-sub-live" id="pLive" aria-live="polite"></div></div>' +
      '<div class="p-lines">' + it[5].map(function(l, k){
        return '<div class="p-line" data-line="' + k + '"><span class="p-who">' + l[0] + '</span><div class="p-txt"><b class="fr">' + esc(l[1]) + '</b>' + (showTr ? '<small>' + esc(T(l[2], l[3])) + '</small>' : '') + '<span class="p-score" id="ps' + k + '"></span></div>' +
          '<button type="button" class="p-btn" data-sayline="' + k + '" aria-label="' + esc(T('Listen', 'استمع')) + '">🔊</button>' + (SR ? '<button type="button" class="p-btn mic" data-mic="' + k + '" aria-label="' + esc(T('Say it', 'انطقها')) + '">🎤</button>' : '') + '</div>';
      }).join('') + '</div>' +
      '<div class="p-ctrl"><button type="button" class="btn main" data-pplay>' + (playing ? '⏸ ' + esc(T('Stop', 'إيقاف')) : '▶ ' + esc(T('Play the scene', 'شغّل المشهد'))) + '</button>' +
        '<button type="button" class="btn ghost' + (slow ? ' on' : '') + '" data-pslow>🐢 ' + esc(T('Slow', 'بطيء')) + '</button>' +
        '<button type="button" class="btn ghost' + (showTr ? ' on' : '') + '" data-ptr>🌐 ' + esc(T('Translation', 'الترجمة')) + '</button></div>' +
      (SR ? '' : '<p class="p-note">' + esc(T('Pronunciation scoring works in Chrome (computer or Android).', 'تقييم النطق يعمل على Chrome (حاسوب أو أندرويد).')) + '</p>') +
      '<div class="p-nav"><button type="button" class="btn ghost" data-pnav="-1"' + (pI === 0 ? ' disabled' : '') + '>' + esc(T('← Previous', 'السابق →')) + '</button><span>' + (exDone[pTh + '-' + pI] ? '✅ ' + esc(T('Done', 'أُنجز')) : '') + '</span><button type="button" class="btn ghost" data-pnav="1"' + (pI === items.length - 1 ? ' disabled' : '') + '>' + esc(T('Next →', 'التالي ←')) + '</button></div>';
  }
  function markDone(){ const k = pTh + '-' + pI; if(!exDone[k]){ exDone[k] = 1; save('cc_fr_explore', exDone); renderExplore(); party(dlg.querySelector('.p-stage')); } }
  async function playScene(){
    const it = itemsOf(pTh)[pI], sp = speakersOf(it[5]); playing = true; renderPlayer();
    const live = document.getElementById('pLive');
    for(let k = 0; k < it[5].length && playing; k++){
      const l = it[5][k], who = sp.indexOf(l[0]);
      dlg.querySelectorAll('.p-line').forEach(function(x){ x.classList.toggle('now', +x.dataset.line === k); });
      dlg.querySelectorAll('.p-actor').forEach(function(x){ x.classList.toggle('talk', +x.dataset.actor === who); });
      if(live){ live.innerHTML = '<b class="fr">' + esc(l[1]) + '</b>' + (showTr ? '<small>' + esc(T(l[2], l[3])) + '</small>' : ''); live.classList.remove('pop'); void live.offsetWidth; live.classList.add('pop'); }
      await say(l[1], { rate: slow ? .65 : .92, pitch: KIDS.test(l[0]) ? 1.35 : (who % 2 ? .85 : 1.08), queue: false });
      await new Promise(function(r){ setTimeout(r, 350); });
    }
    if(playing){ playing = false; markDone(); renderPlayer(); }
  }
  function listenLine(k){
    const it = itemsOf(pTh)[pI], target = it[5][k][1], out = document.getElementById('ps' + k), btn = dlg.querySelector('[data-mic="' + k + '"]');
    const r = new SR(); r.lang = 'fr-FR'; r.maxAlternatives = 3; let got = false;
    btn.classList.add('on'); out.textContent = T('Listening…', 'أستمع إليك…');
    r.onresult = function(e){
      got = true;
      const heard = Array.prototype.map.call(e.results[0], function(a){ return norm(a.transcript); });
      const words = norm(target);
      const best = Math.max.apply(null, heard.map(function(h){ return words.filter(function(w){ return h.indexOf(w) !== -1; }).length; }));
      const pct = Math.round(100 * best / Math.max(1, words.length));
      out.innerHTML = '<b class="' + (pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'bad') + '">' + pct + '%</b> ' + esc(pct >= 80 ? T('Magnifique !', 'Magnifique! رائع!') : pct >= 50 ? T('Très bien, once more!', 'Très bien! مرة أخرى!') : T('Listen and try again.', 'استمع وجرّب مرة أخرى.'));
      if(pct >= 80){ markDone(); party(btn); }
    };
    r.onerror = function(e){ out.textContent = e.error === 'not-allowed' ? T('Allow the microphone first.', 'اسمح باستخدام الميكروفون أولًا.') : T('I didn’t catch that.', 'لم أسمعك جيدًا.'); };
    r.onend = function(){ btn.classList.remove('on'); if(!got && /Listening|أستمع إليك/.test(out.textContent)) out.textContent = T('I didn’t hear anything.', 'لم أسمع شيئًا.'); };
    try{ r.start(); }catch(e){ btn.classList.remove('on'); }
  }
  dlg.addEventListener('click', function(e){
    if(e.target === dlg || e.target.closest('[data-px]')){ playing = false; try{ speechSynthesis.cancel(); }catch(x){} dlg.close(); return; }
    if(e.target.closest('[data-pplay]')){ if(playing){ playing = false; try{ speechSynthesis.cancel(); }catch(x){} renderPlayer(); } else playScene(); return; }
    if(e.target.closest('[data-pslow]')){ slow = !slow; renderPlayer(); return; }
    if(e.target.closest('[data-ptr]')){ showTr = !showTr; renderPlayer(); return; }
    const n = e.target.closest('[data-pnav]'); if(n){ playing = false; try{ speechSynthesis.cancel(); }catch(x){} pI += +n.dataset.pnav; renderPlayer(); return; }
    const s = e.target.closest('[data-sayline]'); if(s){ const l = itemsOf(pTh)[pI][5][+s.dataset.sayline]; say(l[1], { rate: slow ? .65 : .9 }); return; }
    const m = e.target.closest('[data-mic]'); if(m) listenLine(+m.dataset.mic);
  });
  dlg.addEventListener('close', function(){ playing = false; try{ speechSynthesis.cancel(); }catch(x){} });

  // ===================== the hero video =====================
  (function(){
    const v = document.getElementById('frVid'); if(!v) return;
    const snd = document.getElementById('frSnd');
    snd.addEventListener('click', function(){ v.muted = !v.muted; snd.textContent = v.muted ? '🔇' : '🔊'; if(!v.muted){ v.currentTime = 0; v.play().catch(function(){}); } });
    if(!('IntersectionObserver' in window)){ if(!calm) v.play().catch(function(){}); }
    else if(!calm) new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting) v.play().catch(function(){}); else v.pause(); }); }, { threshold: .25 }).observe(v);
    document.querySelectorAll('[data-vsay]').forEach(function(b){ b.addEventListener('click', function(){ say(b.dataset.vsay); }); });
  })();

  function renderAll(){ renderGram(); renderExplore(); if(dlg.open) renderPlayer(); }
  renderAll();
  new MutationObserver(renderAll).observe(html, { attributes: true, attributeFilter: ['lang'] });
})();
