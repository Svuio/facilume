import React, { useState, useMemo, useEffect } from 'react';
import { 
  Languages, Settings, Info, Lightbulb, Target, Activity, 
  MessageSquare, LayoutDashboard, CheckCircle2, 
  XCircle, TrendingUp, AlertTriangle, Users, Key, LogIn, Plus
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
// Използваме конфигурацията, която предоставихте.
const firebaseConfig = {
  apiKey: "AIzaSyC7AFoL5wZhxceS8XxZ_06rmBMJCGRjKT0",
  authDomain: "facilume.firebaseapp.com",
  projectId: "facilume",
  storageBucket: "facilume.firebasestorage.app",
  messagingSenderId: "969775767462",
  appId: "1:969775767462:web:2d4b53fd26c1f187f93967",
  measurementId: "G-DLHVG45W0J"
};

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = 'facilume-wsjf'; // Идентификатор за Firestore пътищата

// --- TRANSLATIONS ---
const tMap = {
  appTitle: { EN: "WSJF Lab", BG: "WSJF Lab" },
  appSubtitle: { 
    EN: "A training simulator for prioritization under uncertainty", 
    BG: "Тренажор за приоритизация в условия на несигурност" 
  },
  scenarioTitle: { EN: "Scenario Context", BG: "Контекст на сценария" },
  scenarioText: {
    EN: "Geekbooks is an online bookstore preparing its next release. The group must prioritize features using WSJF while balancing customer value, urgency, enablement, risk reduction, and implementation effort.",
    BG: "Geekbooks е онлайн книжарница, която подготвя следващия си релийз. Групата трябва да приоритизира функционалности чрез WSJF, като балансира клиентска стойност, спешност, enablement, намаляване на риска и усилие за реализация."
  },
  trainerHintTitle: { EN: "Trainer Hint", BG: "Подсказка за тренера" },
  trainerHintText: {
    EN: "Ask participants which features are truly needed for a usable first release and which ones are attractive but not essential. Watch how quickly everything becomes ‘critical’. Agile theater loves a full shopping cart.",
    BG: "Попитайте участниците кои функционалности са наистина нужни за използваем първи релийз и кои са привлекателни, но не задължителни. Наблюдавайте колко бързо всичко става ‘критично’. Agile театърът обича пълна количка."
  },
  setupTitle: { EN: "Trainer Setup", BG: "Настройки за тренера" },
  sessionNameLabel: { EN: "Training session name", BG: "Име на обучителната сесия" },
  defaultSessionName: { EN: "Geekbooks WSJF Workshop", BG: "Geekbooks WSJF уъркшоп" },
  scenarioLabel: { EN: "Scenario type", BG: "Тип сценарий" },
  scaleLabel: { EN: "Scoring scale", BG: "Скала за оценяване" },
  modeLabel: { EN: "Mode", BG: "Режим" },
  scenarioOptions: {
    geekbooks: { EN: "Geekbooks Online Bookstore", BG: "Онлайн книжарница Geekbooks" },
    banking: { EN: "Digital Banking", BG: "Дигитално банкиране" },
    ecommerce: { EN: "E-commerce Platform", BG: "E-commerce платформа" },
    healthcare: { EN: "Healthcare System", BG: "Здравна система" },
    hr: { EN: "HR Transformation", BG: "HR трансформация" },
    ai: { EN: "AI Transformation Roadmap", BG: "Пътна карта за AI трансформация" },
  },
  scaleOptions: {
    fibonacci: { EN: "Fibonacci: 1, 2, 3, 5, 8, 13, 20", BG: "Fibonacci: 1, 2, 3, 5, 8, 13, 20" },
    linear: { EN: "Linear: 1 to 10", BG: "Линейна: от 1 до 10" }
  },
  modeOptions: {
    individual: { EN: "Individual scoring", BG: "Индивидуално оценяване" },
    team: { EN: "Team scoring", BG: "Екипно оценяване" },
    poker: { EN: "WSJF Poker", BG: "WSJF Poker" }
  },
  rank: { EN: "Rank", BG: "Ранг" },
  id: { EN: "ID", BG: "ID" },
  title: { EN: "Feature", BG: "Функционалност" },
  bv: { EN: "Business Value", BG: "Клиентска стойност" },
  tc: { EN: "Time Criticality", BG: "Спешност (TC)" },
  rr: { EN: "Risk / Enablement", BG: "Риск / Enablement" },
  js: { EN: "Job Size", BG: "Размер на работата" },
  cod: { EN: "Cost of Delay", BG: "Cost of Delay" },
  wsjf: { EN: "WSJF", BG: "WSJF" },
  status: { EN: "Release Status", BG: "Статус" },
  simulationTitle: { EN: "Release Cut-line Simulation", BG: "Симулация на релийз" },
  availableCap: { EN: "Available capacity", BG: "Наличен капацитет" },
  usedCap: { EN: "Used capacity", BG: "Използван капацитет" },
  remainingCap: { EN: "Remaining capacity", BG: "Оставащ капацитет" },
  includedCount: { EN: "Included in release", BG: "Включено в релийза" },
  belowCount: { EN: "Below cut-line", BG: "Под линията на релийза" },
  includedBadge: { EN: "Included", BG: "Включено" },
  belowBadge: { EN: "Below cut-line", BG: "Под линията" },
  visualTitle: { EN: "Insights & Visualization", BG: "Анализи и визуализации" },
  highWsjf: { EN: "Highest WSJF item", BG: "Елемент с най-висок WSJF" },
  lowWsjf: { EN: "Lowest WSJF item", BG: "Елемент с най-нисък WSJF" },
  avgWsjf: { EN: "Average WSJF", BG: "Среден WSJF" },
  largeJs: { EN: "Item with largest Job Size", BG: "Елемент с най-голям размер" },
  highCod: { EN: "Item with highest Cost of Delay", BG: "Елемент с най-висок Cost of Delay" },
  na: { EN: "N/A", BG: "Няма данни" },
  insightsTitle: { EN: "Trainer Insights", BG: "Изводи за тренера" },
  insightUrgent: { 
    EN: "Many items are marked as urgent. When everything is urgent, nothing is.", 
    BG: "Много елементи са отбелязани като спешни. Когато всичко е спешно, нищо не е." 
  },
  insightOptimistic: { 
    EN: "Job Size looks suspiciously optimistic. Agile optimism is cute until capacity collapses.", 
    BG: "Размерът на работата изглежда подозрително оптимистичен. Agile оптимизмът е сладък, докато капацитетът не се срути." 
  },
  insightRisk: { 
    EN: "Risk Reduction is being underestimated. Production incidents usually enjoy this kind of thinking.", 
    BG: "Намаляването на риска е подценено. Production инцидентите обикновено харесват такъв тип мислене." 
  },
  insightBacklogSize: { 
    EN: "The backlog is larger than the available capacity. Shocking, I know. Now the prioritization conversation becomes real.", 
    BG: "Backlog-ът е по-голям от наличния капацитет. Шокиращо, знам. Сега разговорът за приоритизация става истински." 
  },
  insightBalanced: { 
    EN: "The prioritization looks balanced. Either the team is aligned, or everyone is being politely quiet.", 
    BG: "Приоритизацията изглежда балансирана. Или екипът е синхронизиран, или всички са учтиво мълчаливи." 
  },
  debriefTitle: { EN: "Debrief Questions", BG: "Въ Въпроси за debrief" },
  q1: { EN: "What changed after discussion?", BG: "Какво се промени след дискусията?" },
  q2: { EN: "Which assumptions were challenged?", BG: "Кои предположения бяха оспорени?" },
  q3: { EN: "Which item surprised the group?", BG: "Кой елемент изненада групата?" },
  q4: { EN: "Which feature looked important but fell below the cut-line?", BG: "Коя функционалност изглеждаше важна, но остана под линията на релийза?" },
  q5: { EN: "What would happen if capacity dropped by 20%?", BG: "Какво би се случило, ако капацитетът падне с 20%?" },
  q6: { EN: "Which item would you defend in front of a Business Owner, and why?", BG: "Кой елемент бихте защитили пред Business Owner и защо?" },
  lobbyTitle: { EN: "Welcome to WSJF Lab", BG: "Добре дошли в WSJF Lab" },
  createSessionBtn: { EN: "Create Training Session", BG: "Създай обучителна сесия" },
  joinSessionBtn: { EN: "Join Session", BG: "Присъедини се към сесия" },
  sessionIdPlaceholder: { EN: "Session ID (e.g. A1B2C)", BG: "ID на сесия (напр. A1B2C)" },
  pinPlaceholder: { EN: "Trainer PIN", BG: "Trainer PIN" },
  joinError: { EN: "Invalid Session ID or PIN", BG: "Невалидно ID или PIN" },
  readOnlyNotice: { EN: "Participant Mode: Scoring is active, setup is locked by trainer.", BG: "Режим участник: Оценяването е активно, настройките са заключени от тренера." }
};

// --- INITIAL DATA ---
const initialBacklog = [
  { id: "GB-01", titleEN: "Flexible Search", titleBG: "Гъвкаво търсене", descEN: "Allow customers to search books by title, author, category, keyword, and availability.", descBG: "Позволява на клиентите да търсят книги по заглавие, автор, категория, ключова дума и наличност.", bv: 13, tc: 8, rr: 8, js: 8 },
  { id: "GB-02", titleEN: "Shopping Cart", titleBG: "Количка за пазаруване", descEN: "Allow customers to add, remove, and review books before checkout.", descBG: "Позволява на клиентите да добавят, премахват и преглеждат книги преди завършване на поръчката.", bv: 20, tc: 13, rr: 8, js: 5 },
  { id: "GB-03", titleEN: "Purchase by Credit Card", titleBG: "Плащане с кредитна карта", descEN: "Enable secure payment by credit card during checkout.", descBG: "Позволява сигурно плащане с кредитна карта при завършване на поръчката.", bv: 20, tc: 13, rr: 13, js: 8 },
  { id: "GB-04", titleEN: "Shipping Method Selection", titleBG: "Избор на метод за доставка", descEN: "Allow customers to select delivery options based on speed, price, and availability.", descBG: "Позволява на клиентите да изберат начин на доставка според срок, цена и наличност.", bv: 13, tc: 8, rr: 5, js: 5 },
  { id: "GB-05", titleEN: "Profile Management", titleBG: "Управление на профил", descEN: "Allow customers to manage personal information, addresses, preferences, and account settings.", descBG: "Позволява на клиентите да управляват лични данни, адреси, предпочитания и настройки на профила.", bv: 8, tc: 5, rr: 8, js: 8 },
  { id: "GB-06", titleEN: "Book Browsing", titleBG: "Разглеждане на книги", descEN: "Allow customers to browse book categories, collections, and recommended selections.", descBG: "Позволява на клиентите да разглеждат категории, колекции и препоръчани книги.", bv: 20, tc: 13, rr: 5, js: 3 },
  { id: "GB-07", titleEN: "Book Detail", titleBG: "Детайли за книга", descEN: "Show detailed book information, including description, author, price, availability, and related books.", descBG: "Показва подробна информация за книга, включително описание, автор, цена, наличност и свързани книги.", bv: 20, tc: 13, rr: 8, js: 3 },
  { id: "GB-08", titleEN: "Book List Sorting", titleBG: "Сортиране на списък с книги", descEN: "Allow customers to sort book lists by price, popularity, rating, title, and publication date.", descBG: "Позволява на клиентите да сортират списъци с книги по цена, популярност, рейтинг, заглавие и дата на публикуване.", bv: 8, tc: 5, rr: 3, js: 3 },
  { id: "GB-09", titleEN: "Book Rating", titleBG: "Оценяване на книги", descEN: "Allow registered customers to rate books and influence recommendations.", descBG: "Позволява на регистрирани клиенти да оценяват книги и да влияят на препоръките.", bv: 5, tc: 3, rr: 5, js: 5 },
  { id: "GB-10", titleEN: "Commenting", titleBG: "Коментари", descEN: "Allow customers to write and read comments or reviews for books.", descBG: "Позволява на клиентите да пишат и четат коментари или ревюта за книги.", bv: 5, tc: 3, rr: 3, js: 5 },
];

export default function App() {
  const [lang, setLang] = useState('EN');
  const t = (key) => tMap[key]?.[lang] || key;

  // --- Auth & Lobby State ---
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [isTrainer, setIsTrainer] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [joinPin, setJoinPin] = useState('');
  const [lobbyError, setLobbyError] = useState('');
  
  // --- Core App State ---
  const [backlog, setBacklog] = useState(initialBacklog);
  const [capacity, setCapacity] = useState(30);
  const [setup, setSetup] = useState({
    sessionName: '',
    scenario: 'geekbooks',
    scale: 'fibonacci',
    mode: 'team'
  });
  const [myScores, setMyScores] = useState({});

  // 1. Firebase Anonymous Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth init error:", err);
        setLobbyError("Authentication failed. Please check Firebase settings (enable Anonymous auth).");
        setAuthLoading(false);
      }
    };
    
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync Session Data (Public)
  useEffect(() => {
    if (!user || !sessionId) return;
    
    const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_sessions', sessionId);
    const unsub = onSnapshot(sessionRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.backlog) setBacklog(data.backlog);
        if (data.capacity !== undefined) setCapacity(data.capacity);
        if (data.setup) setSetup(data.setup);
      }
    }, (err) => console.error("Session sync error:", err));

    return () => unsub();
  }, [user, sessionId]);

  // 3. Sync Participant Scores
  useEffect(() => {
    if (!user || !sessionId || isTrainer) return;
    
    const partRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_participants', `${sessionId}_${user.uid}`);
    const unsub = onSnapshot(partRef, (snap) => {
      if (snap.exists()) {
        setMyScores(snap.data().scores || {});
      }
    }, (err) => console.error("Participant sync error:", err));

    return () => unsub();
  }, [user, sessionId, isTrainer]);

  // --- Lobby Actions ---
  const handleCreateSession = async () => {
    if (!user) return;
    setLobbyError('');
    const newId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    
    try {
      const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_sessions', newId);
      await setDoc(sessionRef, {
        trainerUid: user.uid,
        pin: newPin,
        capacity: 30,
        setup: { sessionName: '', scenario: 'geekbooks', scale: 'fibonacci', mode: 'team' },
        backlog: initialBacklog,
        createdAt: new Date().toISOString()
      });
      
      setJoinPin(newPin);
      setIsTrainer(true);
      setSessionId(newId);
    } catch (err) {
      setLobbyError("Error creating session. Check Firestore rules.");
      console.error(err);
    }
  };

  const handleJoinSession = async () => {
    if (!user || !joinId) return;
    setLobbyError('');
    const upperId = joinId.toUpperCase();
    
    try {
      const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_sessions', upperId);
      const snap = await getDoc(sessionRef);
      
      if (!snap.exists()) {
        setLobbyError(t('joinError'));
        return;
      }
      
      const data = snap.data();
      if (data.pin !== joinPin) {
        setLobbyError(t('joinError'));
        return;
      }

      const isUserTrainer = data.trainerUid === user.uid;
      setIsTrainer(isUserTrainer);

      if (!isUserTrainer) {
        const partRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_participants', `${upperId}_${user.uid}`);
        await setDoc(partRef, {
          sessionId: upperId,
          participantUid: user.uid,
          joinedAt: new Date().toISOString()
        }, { merge: true });
      }

      setSessionId(upperId);
    } catch (err) {
      setLobbyError("Error joining session.");
      console.error(err);
    }
  };

  // --- Calculations ---
  const processedData = useMemo(() => {
    let items = backlog.map(item => {
      const effectiveBv = !isTrainer && myScores[item.id]?.bv !== undefined ? myScores[item.id].bv : item.bv;
      const effectiveTc = !isTrainer && myScores[item.id]?.tc !== undefined ? myScores[item.id].tc : item.tc;
      const effectiveRr = !isTrainer && myScores[item.id]?.rr !== undefined ? myScores[item.id].rr : item.rr;
      const effectiveJs = !isTrainer && myScores[item.id]?.js !== undefined ? myScores[item.id].js : item.js;

      const bv = Number(effectiveBv) || 0;
      const tc = Number(effectiveTc) || 0;
      const rr = Number(effectiveRr) || 0;
      const js = Number(effectiveJs) || 0;
      
      const cod = bv + tc + rr;
      const wsjf = js === 0 ? 0 : (cod / js);
      
      return { ...item, bv: effectiveBv, tc: effectiveTc, rr: effectiveRr, js: effectiveJs, cod, wsjf, jsNum: js };
    });

    items.sort((a, b) => b.wsjf - a.wsjf);

    let remaining = Number(capacity) || 0;
    let used = 0;
    let includedCount = 0;
    let belowCount = 0;

    items = items.map((item, index) => {
      if (item.jsNum <= remaining && item.jsNum > 0) {
        remaining -= item.jsNum;
        used += item.jsNum;
        includedCount++;
        return { ...item, rank: index + 1, status: 'included' };
      } else {
        belowCount++;
        return { ...item, rank: index + 1, status: 'below' };
      }
    });

    return { items, used, remaining, includedCount, belowCount };
  }, [backlog, capacity, isTrainer, myScores]);

  // --- Derived Insights ---
  const insights = useMemo(() => {
    const { items, belowCount } = processedData;
    const rules = [];
    
    const highTcCount = items.filter(i => (Number(i.tc) || 0) >= 8).length;
    const lowJsCount = items.filter(i => (Number(i.js) || 0) > 0 && (Number(i.js) || 0) <= 3).length;
    const lowRrCount = items.filter(i => (Number(i.rr) || 0) <= 3).length;
    
    if (highTcCount >= items.length * 0.4) rules.push('insightUrgent');
    if (lowJsCount >= items.length * 0.5) rules.push('insightOptimistic');
    if (lowRrCount >= items.length * 0.5) rules.push('insightRisk');
    if (belowCount >= items.length * 0.4) rules.push('insightBacklogSize');
    
    if (rules.length === 0) rules.push('insightBalanced');
    
    return rules;
  }, [processedData]);

  const stats = useMemo(() => {
    const { items } = processedData;
    if (!items.length) return null;
    
    const validWsjf = items.filter(i => i.wsjf > 0);
    const avgWsjf = validWsjf.length ? (validWsjf.reduce((acc, i) => acc + i.wsjf, 0) / validWsjf.length) : 0;
    
    const maxJsItem = [...items].sort((a, b) => b.jsNum - a.jsNum)[0];
    const maxCodItem = [...items].sort((a, b) => b.cod - a.cod)[0];

    return {
      highWsjfItem: items[0],
      lowWsjfItem: items[items.length - 1],
      avgWsjf,
      maxJsItem,
      maxCodItem
    };
  }, [processedData]);

  // --- Handlers ---
  const handleScoreChange = async (id, field, value) => {
    if (!user || !sessionId) return;
    
    const numValue = value === '' ? '' : Number(value);

    if (isTrainer) {
      const newBacklog = backlog.map(item => 
        item.id === id ? { ...item, [field]: numValue } : item
      );
      setBacklog(newBacklog);
      const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_sessions', sessionId);
      await updateDoc(sessionRef, { backlog: newBacklog }).catch(console.error);
    } else {
      const newMyScores = { ...myScores, [id]: { ...(myScores[id] || {}), [field]: numValue } };
      setMyScores(newMyScores);
      const partRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_participants', `${sessionId}_${user.uid}`);
      await setDoc(partRef, {
        participantUid: user.uid,
        scores: newMyScores
      }, { merge: true }).catch(console.error);
    }
  };

  const handleCapacityChange = async (val) => {
    if (!isTrainer) return;
    setCapacity(val);
    const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_sessions', sessionId);
    await updateDoc(sessionRef, { capacity: Number(val) }).catch(console.error);
  };

  const handleSetupChange = async (field, val) => {
    if (!isTrainer) return;
    const newSetup = { ...setup, [field]: val };
    setSetup(newSetup);
    const sessionRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wsjf_sessions', sessionId);
    await updateDoc(sessionRef, { setup: newSetup }).catch(console.error);
  };

  const currentSessionName = setup.sessionName || t('defaultSessionName');

  // --- Rendering ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Activity size={48} className="text-indigo-600 animate-bounce mb-4" />
        <p className="text-xl font-bold text-slate-700 animate-pulse">Initializing Secure Environment...</p>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-indigo-700 p-6 text-white text-center">
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <Activity size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">{t('lobbyTitle')}</h1>
            <p className="text-indigo-200 text-sm mt-1">{t('appSubtitle')}</p>
          </div>

          <div className="p-6 space-y-6">
            {lobbyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>{lobbyError}</span>
              </div>
            )}

            <div>
              <button 
                onClick={handleCreateSession}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {t('createSessionBtn')}
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="space-y-3">
              <input 
                type="text" 
                placeholder={t('sessionIdPlaceholder')}
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase tracking-wider text-center font-mono font-bold"
              />
              <input 
                type="password" 
                placeholder={t('pinPlaceholder')}
                value={joinPin}
                onChange={(e) => setJoinPin(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center font-mono font-bold"
              />
              <button 
                onClick={handleJoinSession}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                {t('joinSessionBtn')}
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
                <button 
                  onClick={() => setLang('EN')}
                  className={`px-3 py-1 rounded-md font-bold transition-colors ${lang === 'EN' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('BG')}
                  className={`px-3 py-1 rounded-md font-bold transition-colors ${lang === 'BG' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
                >
                  BG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-indigo-700 p-2 rounded-lg">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight flex items-center gap-3">
                {t('appTitle')}
                {!isTrainer && (
                  <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Participant Mode
                  </span>
                )}
              </h1>
              <p className="text-indigo-200 text-sm">{t('appSubtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-indigo-800 px-4 py-1.5 rounded-lg border border-indigo-600 shadow-inner text-sm">
              <div className="flex items-center gap-1.5 text-indigo-100">
                <Users size={16} />
                <span className="font-semibold text-white tracking-wider uppercase">{sessionId}</span>
              </div>
              {isTrainer && (
                <>
                  <div className="w-px h-4 bg-indigo-600"></div>
                  <div className="flex items-center gap-1.5 text-indigo-100">
                    <Key size={16} />
                    <span className="font-semibold text-white tracking-widest">{joinPin}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex bg-indigo-800 rounded-lg p-1 shadow-inner border border-indigo-600">
              <button 
                onClick={() => setLang('EN')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${lang === 'EN' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('BG')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${lang === 'BG' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
              >
                BG
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Top Section: Context & Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario Context */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <LayoutDashboard className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">{t('scenarioTitle')}</h2>
            </div>
            <div className="p-6 flex-grow flex flex-col gap-4">
              <p className="text-slate-700 leading-relaxed text-lg">
                {t('scenarioText')}
              </p>
              <div className="mt-auto bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="text-amber-800 block mb-1 text-sm">{t('trainerHintTitle')}</strong>
                  <p className="text-amber-700 text-sm leading-relaxed">{t('trainerHintText')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Setup Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            {!isTrainer && (
              <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600 text-sm font-semibold flex items-center gap-2">
                  <Users size={16} className="text-indigo-500"/>
                  {t('readOnlyNotice')}
                </div>
              </div>
            )}
            <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <Settings className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">{t('setupTitle')}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('sessionNameLabel')}</label>
                <input 
                  type="text" 
                  value={setup.sessionName}
                  onChange={(e) => handleSetupChange('sessionName', e.target.value)}
                  disabled={!isTrainer}
                  placeholder={t('defaultSessionName')}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:opacity-60 disabled:bg-slate-100"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('scenarioLabel')}</label>
                  <select 
                    value={setup.scenario}
                    onChange={(e) => handleSetupChange('scenario', e.target.value)}
                    disabled={!isTrainer}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none disabled:opacity-60 disabled:bg-slate-100"
                  >
                    {Object.keys(tMap.scenarioOptions).map(key => (
                      <option key={key} value={key}>{tMap.scenarioOptions[key][lang]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('modeLabel')}</label>
                  <select 
                    value={setup.mode}
                    onChange={(e) => handleSetupChange('mode', e.target.value)}
                    disabled={!isTrainer}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none disabled:opacity-60 disabled:bg-slate-100"
                  >
                    {Object.keys(tMap.modeOptions).map(key => (
                      <option key={key} value={key}>{tMap.modeOptions[key][lang]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('scaleLabel')}</label>
                <select 
                  value={setup.scale}
                  onChange={(e) => handleSetupChange('scale', e.target.value)}
                  disabled={!isTrainer}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none disabled:opacity-60 disabled:bg-slate-100"
                >
                  <option value="fibonacci">{tMap.scaleOptions.fibonacci[lang]}</option>
                  <option value="linear">{tMap.scaleOptions.linear[lang]}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Simulation & Visuals & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Release Cut-line Simulation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-1 flex flex-col relative">
            {!isTrainer && (
              <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px] z-10"></div>
            )}
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-2">
              <Target className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-indigo-900">{t('simulationTitle')}</h2>
            </div>
            <div className="p-6 flex-grow flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('availableCap')}</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="0"
                    value={capacity}
                    onChange={(e) => handleCapacityChange(e.target.value)}
                    disabled={!isTrainer}
                    className="w-32 px-4 py-2 text-xl font-bold text-indigo-700 bg-white border-2 border-indigo-200 rounded-lg focus:ring-0 focus:border-indigo-500 transition-all outline-none text-center disabled:opacity-60 disabled:bg-slate-100"
                  />
                  <span className="text-slate-500 text-sm">pts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">{t('usedCap')}</span>
                  <span className="text-2xl font-bold text-slate-800">{processedData.used}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">{t('remainingCap')}</span>
                  <span className={`text-2xl font-bold ${processedData.remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {processedData.remaining}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={16} />
                  <span>{processedData.includedCount} {t('includedCount')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                  <XCircle size={16} />
                  <span>{processedData.belowCount} {t('belowCount')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights & Visualization */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-1">
             <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">{t('visualTitle')}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">{t('highWsjf')}</span>
                <span className="font-semibold text-slate-800 text-right w-1/2 truncate" title={stats?.highWsjfItem ? stats.highWsjfItem[`title${lang}`] : t('na')}>
                  {stats?.highWsjfItem ? stats.highWsjfItem[`title${lang}`] : t('na')}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">{t('lowWsjf')}</span>
                <span className="font-semibold text-slate-800 text-right w-1/2 truncate" title={stats?.lowWsjfItem ? stats.lowWsjfItem[`title${lang}`] : t('na')}>
                  {stats?.lowWsjfItem ? stats.lowWsjfItem[`title${lang}`] : t('na')}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">{t('avgWsjf')}</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {stats?.avgWsjf ? stats.avgWsjf.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">{t('largeJs')}</span>
                <span className="font-semibold text-slate-800 text-right w-1/2 truncate" title={stats?.maxJsItem ? stats.maxJsItem[`title${lang}`] : t('na')}>
                  {stats?.maxJsItem ? stats.maxJsItem[`title${lang}`] : t('na')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{t('highCod')}</span>
                <span className="font-semibold text-slate-800 text-right w-1/2 truncate" title={stats?.maxCodItem ? stats.maxCodItem[`title${lang}`] : t('na')}>
                  {stats?.maxCodItem ? stats.maxCodItem[`title${lang}`] : t('na')}
                </span>
              </div>
            </div>
          </div>

          {/* Trainer Insights Panel */}
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden lg:col-span-1 text-white">
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={20} />
              <h2 className="text-lg font-bold text-slate-50">{t('insightsTitle')}</h2>
            </div>
            <div className="p-6 space-y-4">
              {insights.map((insightKey, idx) => (
                <div key={idx} className="flex gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <AlertTriangle className={`shrink-0 mt-0.5 ${insightKey === 'insightBalanced' ? 'text-emerald-400' : 'text-yellow-400'}`} size={18} />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t(insightKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backlog Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-slate-800">
                {currentSessionName} - Backlog
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3 border-b border-slate-200 w-16 text-center">{t('rank')}</th>
                  <th className="px-4 py-3 border-b border-slate-200">{t('title')}</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center w-24">{t('bv')}</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center w-24">+ {t('tc')}</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center w-24">+ {t('rr')}</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center bg-indigo-50/50 w-28">= {t('cod')}</th>
                  <th className="px-2 py-3 border-b border-slate-200 text-center w-24">÷ {t('js')}</th>
                  <th className="px-4 py-3 border-b border-slate-200 text-center bg-indigo-50 w-28 text-indigo-800">= {t('wsjf')}</th>
                  <th className="px-4 py-3 border-b border-slate-200 text-center w-32">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedData.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">{item[`title${lang}`]}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2" title={item[`desc${lang}`]}>{item[`desc${lang}`]}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">{item.id}</div>
                    </td>
                    <td className="px-2 py-4">
                      <input 
                        type="number" 
                        value={item.bv} 
                        onChange={(e) => handleScoreChange(item.id, 'bv', e.target.value)}
                        className="w-16 mx-auto block text-center py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-semibold text-slate-700 shadow-sm"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <input 
                        type="number" 
                        value={item.tc} 
                        onChange={(e) => handleScoreChange(item.id, 'tc', e.target.value)}
                        className="w-16 mx-auto block text-center py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-semibold text-slate-700 shadow-sm"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <input 
                        type="number" 
                        value={item.rr} 
                        onChange={(e) => handleScoreChange(item.id, 'rr', e.target.value)}
                        className="w-16 mx-auto block text-center py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-semibold text-slate-700 shadow-sm"
                      />
                    </td>
                    <td className="px-2 py-4 text-center bg-indigo-50/30">
                      <span className="font-bold text-slate-700 text-lg">{item.cod}</span>
                    </td>
                    <td className="px-2 py-4">
                      <input 
                        type="number" 
                        value={item.js} 
                        onChange={(e) => handleScoreChange(item.id, 'js', e.target.value)}
                        className="w-16 mx-auto block text-center py-1.5 px-2 bg-amber-50 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-bold text-amber-900 shadow-sm"
                      />
                    </td>
                    <td className="px-4 py-4 text-center bg-indigo-50">
                      <span className="font-black text-indigo-700 text-xl block">{item.wsjf.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.status === 'included' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 size={14} />
                          {t('includedBadge')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <XCircle size={14} />
                          {t('belowBadge')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Debrief Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">{t('debriefTitle')}</h2>
          </div>
          <div className="p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <li key={num} className="flex gap-3 items-start bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">
                    {num}
                  </div>
                  <span className="text-slate-700 font-medium">{t(`q${num}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}