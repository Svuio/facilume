import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calculator, Users, UserCog, Globe, AlertCircle, 
  CheckCircle2, XCircle, TrendingUp, AlertTriangle, 
  MessageSquare, Info, ShieldAlert, BarChart3, Settings,
  Lock, Unlock, Eye, EyeOff, PlayCircle, RotateCcw, 
  ChevronLeft, ChevronRight, ChevronDown, CheckSquare, Edit3, Activity,
  UserPlus, UserMinus, RefreshCw, Filter, Link, Copy, LogOut, Check, Bug, Shield, Clock,
  FileText, Plus, Save, Download, Upload, Trash2, Copy as CopyIcon, Search, Share2, CheckCheck
} from 'lucide-react';

// === FIREBASE ИНТЕГРАЦИЯ ===
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';

// 🔴 Твоите реални ключове за facilume 🔴
const userFirebaseConfig = {
  apiKey: "AIzaSyC7AFoL5wZhxceS8XxZ_06rmBMJCGRjKT0",
  authDomain: "facilume.firebaseapp.com",
  projectId: "facilume",
  storageBucket: "facilume.firebasestorage.app",
  messagingSenderId: "969775767462",
  appId: "1:969775767462:web:2d4b53fd26c1f187f93967",
  measurementId: "G-DLHVG45W0J"
};

// Защита: Ако сме в Canvas среда използваме глобалния config, иначе твоя (за Vercel).
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : userFirebaseConfig;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'facilume-wsjf';

let app, auth, db, firebaseInitError = null;
try {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "ВЪВЕДИ_ТУК") {
     throw new Error("Липсват Firebase конфигурационни ключове. Моля, попълнете userFirebaseConfig.");
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  firebaseInitError = e.message;
  console.error("Firebase init error:", e);
}
// ==========================

const translations = {
  en: {
    appTitle: "WSJF Lab",
    appSubtitle: "A training simulator for prioritization under uncertainty",
    partInstructions: "Score each feature using WSJF. Focus on relative value, urgency, risk reduction, opportunity enablement, and effort. Do not try to be perfect. Try to be economically honest.",
    colId: "ID",
    colFeature: "Feature",
    colBV: "Business Value",
    colTC: "Time Criticality",
    colRR: "Risk Reduction",
    colJS: "Job Size",
    colCoD: "CoD",
    colWSJF: "WSJF",
    colRank: "Rank",
    colStatus: "Status",
    statusIncluded: "Included",
    statusBelow: "Below cut-line",
    trainerSetupTitle: "Session Setup & Scenarios",
    sessionName: "Training Session Name",
    capacityLimit: "Available Capacity",
    releaseSimTitle: "Release Cut-line Simulation",
    usedCapacity: "Used Capacity",
    remCapacity: "Remaining Capacity",
    includedItems: "Included Items",
    belowItems: "Below Cut-line",
    roles: {
      pm: "Product Manager",
      arch: "Architect",
      bo: "Business Owner",
      dev: "Developer",
      support: "Customer Support Lead",
      compliance: "Compliance Officer",
      ux: "UX Designer",
      qa: "QA Engineer",
      ops: "Operations Lead",
      marketing: "Marketing Lead",
      finance: "Finance Representative",
      custom: "Custom Role"
    },
    featStatuses: {
      notStarted: "Not started",
      scoringOpen: "Scoring open",
      votingLocked: "Voting locked",
      resultsRevealed: "Results revealed",
      discussion: "Discussion",
      reScoreOpen: "Re-score open",
      completed: "Completed"
    },
    states: {
      draft: "Draft",
      lobbyOpen: "Lobby Open",
      inProgress: "In Progress",
      debrief: "Debrief",
      ended: "Ended",
      archived: "Archived"
    },
    roleSetupTitle: "Role Setup",
    btnAddRole: "Add role slot",
    btnResetRoles: "Reset roles",
    workshopControlTitle: "Workshop Control Room",
    sessionId: "Session ID",
    activeFeatureLabel: "Active feature",
    btnPrev: "Previous",
    btnNext: "Next",
    btnOpenLobby: "Open Lobby",
    btnStartSession: "Start Session",
    btnStartScoring: "Start Scoring",
    btnLock: "Lock Voting",
    btnUnlock: "Unlock Voting",
    btnReveal: "Reveal Results",
    btnHide: "Hide Results",
    btnDiscussion: "Start Discussion",
    btnRescore: "Open Re-score",
    btnDebrief: "Start Debrief",
    btnEndSession: "End Session",
    btnReset: "Reset",
    demoModeLabel: "Demo mode with mock participants",
    previewBannerText: "Trainer Preview Mode. You are viewing the participant experience.",
    backToTrainer: "Back to Trainer View",
    previewPart: "Preview Participant Experience",
    lockTrainer: "Lock Trainer View",
    trainerAccessLink: "Trainer Access",
    endSessionTitle: "End session?",
    endSessionBody: "This will stop scoring, lock all feature results, and generate a final session summary.",
    btnCancel: "Cancel",
    btnConfirmEnd: "End Session",
    sessionEndedMsg: "This session has ended. You can view the final summary only if you already joined before it ended.",
    timelineTitle: "Session Timeline",
    resetConfirmTitle: "Reset Scores?",
    resetConfirmBody: "Are you sure you want to reset all scores for the active feature?",
    helperBv: "How much economic or customer value does this feature create?",
    helperTc: "How much does value decay if this is delayed?",
    helperRr: "What risk does this reduce or opportunity enable?",
    helperJs: "How large is the effort compared to other features?",

    btnShare: "Share Session",
    shareTitle: "Invite Participants",
    shareLink: "Session Link",
    btnCopy: "Copy",
    btnCopied: "Copied!",
    scanQr: "Or scan QR code to join:",
    
    trainerAccessTitle: "Trainer Access",
    trainerAccessSub: "Enter PIN to access the facilitation cockpit.",
    trainerPinLabel: "Trainer PIN (Use 0000)",
    unlockTrainer: "Unlock Trainer View",
    incorrectPin: "Incorrect Trainer PIN.",
    backToParticipant: "Back to Participant Join",
    
    trainerSessionTitle: "Manage Sessions",
    trainerSessionInput: "Enter existing Session ID",
    btnLoadSession: "Load Session",
    btnCreateSession: "Create New Session",
    trainerSessionError: "Session not found in database.",

    tabScenario: "Scenario Builder",
    tabRoles: "Role Setup",
    tabSettings: "Session Settings",
    scenarioSelector: "Active Scenario",
    scenarioBuiltIn: "Built-in",
    scenarioCustom: "Custom",
    btnDuplicate: "Duplicate to Custom",
    btnDeleteScen: "Delete Scenario",
    btnAddFeature: "Add Feature",
    scenarioChangeWarningTitle: "Change Scenario?",
    scenarioChangeWarningBody: "Changing the scenario will reset feature scores and progress for this session. Continue?",
    btnConfirmChange: "Change & Reset",
    emptyScenario: "This scenario has no features. Add features to begin.",
    featureListTitle: "Scenario Features",
    scenarioName: "Scenario Name",
    featureTitle: "Feature Title",
    featureDesc: "Description",
    featureDetails: "Details",
    btnShowDetails: "Show Details",
    btnHideDetails: "Hide Details",
    partStatuses: {
      inLobby: "In lobby",
      notStarted: "Not started",
      inProgress: "In progress",
      submitted: "Submitted",
      rescored: "Re-scored"
    },
    
    findSessionTitle: "Find Training Session",
    sessionIdInput: "Enter Session ID",
    btnFindSession: "Find Session",
    sessionNotFound: "Session not found. Check the ID and try again.",
    
    joinTitle: "Join WSJF Session",
    joinNameInput: "Participant name",
    joinRoleSelect: "Available role",
    btnJoin: "Join Session",
    seatsLeft: "seats left",
    seatLeft: "seat left",
    joinedAs: "Joined as",
    btnLeave: "Leave Session",
    msgLobby: "You are in the lobby. Wait for the trainer to start the session.",
    msgNotStarted: "Waiting for the trainer to start scoring for this feature.",
    msgDiscussion: "What assumption would you challenge before re-scoring?",
    btnSubmitScores: "Submit Feature Scores",
    btnSubmitRescores: "Submit Revised Scores",
    voteLockedMsg: "Voting is locked by the trainer.",
    voteSubmitted: "Your feature scores have been submitted. Wait for the trainer to reveal the results.",
    yourResultPrefix: "Your",
    groupAvgPrefix: "Group Avg",
    spreadPrefix: "Spread",
    highestSpreadCrit: "Highest spread criterion",
    consensusStrong: "Strong alignment",
    consensusModerate: "Moderate disagreement",
    consensusHigh: "High disagreement",
    featureProgressTitle: "Feature Progress",
    heatmapTitle: "Disagreement Heatmap",
    colSubmittedCnt: "Submitted",
    colRevealed: "Revealed",
    colAvgWsjf: "Avg WSJF",
    lowDis: "Low disagreement",
    medDis: "Medium disagreement",
    highDis: "High disagreement",
    noData: "No data available",
    hidden: "Hidden",
    notesTitle: "Trainer Discussion Notes",
    notesPlaceholder: "Capture assumptions, disagreements, risks, and decisions from the discussion."
  },
  bg: {
    appTitle: "WSJF Lab",
    appSubtitle: "Тренажор за приоритизация в условия на несигурност",
    partInstructions: "Оценете всяка функционалност чрез WSJF. Не се опитвайте да сте перфектни. Опитайте се да сте икономически честни.",
    colId: "ID",
    colFeature: "Функционалност",
    colBV: "Бизнес стойност",
    colTC: "Спешност",
    colRR: "Намаляване на риска",
    colJS: "Размер на работата",
    colCoD: "CoD",
    colWSJF: "WSJF",
    colRank: "Ранг",
    colStatus: "Статус",
    statusIncluded: "Включено",
    statusBelow: "Под линията",
    trainerSetupTitle: "Настройки и Сценарии",
    sessionName: "Име на уъркшопа",
    capacityLimit: "Наличен капацитет",
    releaseSimTitle: "Симулация на релийз линия",
    usedCapacity: "Използван капацитет",
    remCapacity: "Оставащ капацитет",
    includedItems: "Включени елементи",
    belowItems: "Елементи под линията",
    roles: {
      pm: "Product Manager",
      arch: "Архитект",
      bo: "Business Owner",
      dev: "Developer",
      support: "Ръководител поддръжка",
      compliance: "Compliance Officer",
      ux: "UX дизайнер",
      qa: "QA инженер",
      ops: "Operations Lead",
      marketing: "Marketing Lead",
      finance: "Финансов представител",
      custom: "Персонализирана роля"
    },
    featStatuses: {
      notStarted: "Не е започнато",
      scoringOpen: "Оценяването е отворено",
      votingLocked: "Гласуването е заключено",
      resultsRevealed: "Резултатите са показани",
      discussion: "Дискусия",
      reScoreOpen: "Преоценяването е отворено",
      completed: "Завършено"
    },
    states: {
      draft: "Чернова",
      lobbyOpen: "Лобито е отворено",
      inProgress: "В процес",
      debrief: "Debrief",
      ended: "Приключена",
      archived: "Архивирана"
    },
    roleSetupTitle: "Настройка на ролите",
    btnAddRole: "Добави роля",
    btnResetRoles: "Върни ролите",
    workshopControlTitle: "Контролен панел",
    sessionId: "ID на сесията",
    activeFeatureLabel: "Активна функционалност",
    btnPrev: "Предишна",
    btnNext: "Следваща",
    btnOpenLobby: "Отвори лобито",
    btnStartSession: "Стартирай сесията",
    btnStartScoring: "Стартирай оценяване",
    btnLock: "Заключи гласуването",
    btnUnlock: "Отключи гласуването",
    btnReveal: "Покажи резултатите",
    btnHide: "Скрий резултатите",
    btnDiscussion: "Започни дискусия",
    btnRescore: "Отвори преоценяване",
    btnDebrief: "Стартирай Debrief",
    btnEndSession: "Приключи сесията",
    btnReset: "Рестартирай",
    demoModeLabel: "Демо режим с примерни участници",
    previewBannerText: "Режим преглед от тренера. Виждате преживяването на участник.",
    backToTrainer: "Обратно към тренера",
    previewPart: "Преглед като участник",
    lockTrainer: "Заключи",
    trainerAccessLink: "Достъп за тренера",
    endSessionTitle: "Да приключим ли сесията?",
    endSessionBody: "Това ще спре оценяването и ще генерира финално обобщение.",
    btnCancel: "Отказ",
    btnConfirmEnd: "Приключи",
    sessionEndedMsg: "Тази сесия е приключена.",
    timelineTitle: "Хронология",
    resetConfirmTitle: "Рестартиране?",
    resetConfirmBody: "Сигурни ли сте, че искате да изтриете всички оценки за тази функционалност?",
    helperBv: "Колко икономическа или клиентска стойност създава?",
    helperTc: "Колко намалява стойността, ако се забави?",
    helperRr: "Какъв риск намалява или възможност отключва?",
    helperJs: "Колко голямо е усилието спрямо останалите?",

    btnShare: "Сподели сесия",
    shareTitle: "Покани участници",
    shareLink: "Линк за достъп",
    btnCopy: "Копирай",
    btnCopied: "Копирано!",
    scanQr: "Или сканирай QR кода:",
    
    trainerAccessTitle: "Достъп за тренера",
    trainerAccessSub: "Въведете PIN за достъп.",
    trainerPinLabel: "PIN (Използвайте 0000)",
    unlockTrainer: "Отключи",
    incorrectPin: "Грешен PIN.",
    backToParticipant: "Обратно към лоби",
    
    trainerSessionTitle: "Управление на сесии",
    trainerSessionInput: "Въведи съществуващо ID на сесия",
    btnLoadSession: "Зареди сесия",
    btnCreateSession: "Създай нова сесия",
    trainerSessionError: "Сесията не е намерена в базата данни.",

    tabScenario: "Редактор на сценарии",
    tabRoles: "Настройка на роли",
    tabSettings: "Настройки на сесията",
    scenarioSelector: "Активен сценарий",
    scenarioBuiltIn: "Вграден",
    scenarioCustom: "Персонален",
    btnDuplicate: "Дублирай като персонален",
    btnDeleteScen: "Изтрий сценария",
    btnAddFeature: "Добави функционалност",
    scenarioChangeWarningTitle: "Смяна на сценария?",
    scenarioChangeWarningBody: "Смяната на сценария ще нулира всички оценки и напредъка за тази сесия. Да продължим ли?",
    btnConfirmChange: "Смени и нулирай",
    emptyScenario: "Този сценарий няма функционалности. Добавете, за да започнете.",
    featureListTitle: "Функционалности в сценария",
    scenarioName: "Име на сценария",
    featureTitle: "Заглавие",
    featureDesc: "Описание",
    featureDetails: "Детайли",
    btnShowDetails: "Покажи детайли",
    btnHideDetails: "Скрий детайли",
    partStatuses: {
      inLobby: "В лобито",
      notStarted: "Не е започнал",
      inProgress: "В процес",
      submitted: "Изпратено",
      rescored: "Преоценено"
    },
    
    findSessionTitle: "Намери сесия",
    sessionIdInput: "Въведи ID на сесия",
    btnFindSession: "Намери",
    sessionNotFound: "Сесията не е намерена. Провери ID-то.",
    
    joinTitle: "Присъединяване",
    joinNameInput: "Име на участник",
    joinRoleSelect: "Избор на роля",
    btnJoin: "Присъедини се",
    seatsLeft: "остават", 
    seatLeft: "остава",
    joinedAs: "Присъединени като",
    btnLeave: "Напусни сесията",
    msgLobby: "Вие сте в лобито. Изчакайте стартиране.",
    msgNotStarted: "Изчакайте тренера да стартира оценяването.",
    msgDiscussion: "Кое предположение бихте оспорили?",
    btnSubmitScores: "Изпрати оценки",
    btnSubmitRescores: "Изпрати преоценка",
    voteLockedMsg: "Гласуването е заключено.",
    voteSubmitted: "Оценките са изпратени. Изчакайте тренера.",
    yourResultPrefix: "Ваш(а)",
    groupAvgPrefix: "Средн(а)",
    spreadPrefix: "Разлика",
    highestSpreadCrit: "Най-голямо разминаване",
    consensusStrong: "Силен синхрон",
    consensusModerate: "Умерено разминаване",
    consensusHigh: "Високо разминаване",
    featureProgressTitle: "Напредък",
    heatmapTitle: "Heatmap на разминаванията",
    colSubmittedCnt: "Изпратени",
    colRevealed: "Показани",
    colAvgWsjf: "Среден WSJF",
    lowDis: "Ниско разминаване",
    medDis: "Средно разминаване",
    highDis: "Високо разминаване",
    noData: "Няма данни",
    hidden: "Скрито",
    notesTitle: "Бележки на тренера",
    notesPlaceholder: "Запишете предположения и решения..."
  }
};

const defaultTemplates = [
  {
    id: 'geekbooks',
    isBuiltIn: true,
    nameEn: "Geekbooks Online Retail",
    nameBg: "Geekbooks Онлайн книжарница",
    descEn: "Prioritize features for an online bookstore release.",
    descBg: "Приоритизирайте функционалности за релийз на онлайн книжарница.",
    features: [
      { id: 1, title_en: "Flexible Search", title_bg: "Гъвкаво търсене", desc_en: "Search books by title, author, category.", desc_bg: "Търсене по заглавие, автор, категория.", details_en: "Must include typo tolerance and autocomplete. Needs to connect to the new Elasticsearch cluster. Expected high risk due to legacy data migration.", details_bg: "Трябва да включва толерантност към печатни грешки и автоматично довършване. Трябва да се свърже с новия Elasticsearch клъстер. Очаква се висок риск поради миграция на стари данни.", bv: 13, tc: 8, rr: 8, js: 8 },
      { id: 2, title_en: "Shopping Cart", title_bg: "Количка", desc_en: "Add, remove, review books before checkout.", desc_bg: "Добавяне и премахване преди поръчка.", details_en: "", details_bg: "", bv: 20, tc: 13, rr: 8, js: 5 },
      { id: 3, title_en: "Credit Card Payment", title_bg: "Плащане с карта", desc_en: "Secure payment by credit card.", desc_bg: "Сигурно плащане с кредитна карта.", details_en: "", details_bg: "", bv: 20, tc: 13, rr: 13, js: 8 },
      { id: 4, title_en: "Shipping Selection", title_bg: "Избор на доставка", desc_en: "Select delivery options based on speed.", desc_bg: "Избор на начин на доставка според скорост.", details_en: "", details_bg: "", bv: 13, tc: 8, rr: 5, js: 5 },
      { id: 5, title_en: "Profile Management", title_bg: "Управление на профил", desc_en: "Manage personal info and addresses.", desc_bg: "Управление на лични данни и адреси.", details_en: "", details_bg: "", bv: 8, tc: 5, rr: 8, js: 8 },
      { id: 6, title_en: "Book Browsing", title_bg: "Разглеждане", desc_en: "Browse categories and recommendations.", desc_bg: "Разглеждане на категории и препоръки.", details_en: "", details_bg: "", bv: 20, tc: 13, rr: 5, js: 3 }
    ]
  }
];

const criteriaKeys = ['bv', 'tc', 'rr', 'js'];
const fibonacciScale = [1, 2, 3, 5, 8, 13, 20];
const defaultRoleSlots = [
  { id: 'rs1', role: 'pm', seats: 1 }, { id: 'rs2', role: 'arch', seats: 1 },
  { id: 'rs3', role: 'bo', seats: 1 }, { id: 'rs4', role: 'dev', seats: 1 },
  { id: 'rs5', role: 'support', seats: 1 }, { id: 'rs6', role: 'compliance', seats: 1 }
];
const mockNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Victor"];
const snapToScale = (val) => fibonacciScale.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);

export default function App() {
  const [lang, setLang] = useState('en');
  const [accessMode, setAccessMode] = useState('participant'); // participant, trainerLocked, trainerSessionSelect, trainerUnlocked
  const [trainerPinInput, setTrainerPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const trainerPin = "0000"; 
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showScenarioChangeConfirm, setShowScenarioChangeConfirm] = useState(null);

  const t = translations[lang] || translations.en;

  // FIREBASE AUTH
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { console.error("Auth error", e); }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, u => setAuthUser(u));
    return () => unsub();
  }, []);

  // SCENARIO STATE
  const [customScenarios, setCustomScenarios] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wsjf_scenarios') || '[]'); } catch { return []; }
  });
  const [activeScenarioId, setActiveScenarioId] = useState('geekbooks');
  
  useEffect(() => {
     localStorage.setItem('wsjf_scenarios', JSON.stringify(customScenarios));
  }, [customScenarios]);

  const activeScenario = useMemo(() => {
     return [...defaultTemplates, ...customScenarios].find(s => s.id === activeScenarioId) || defaultTemplates[0];
  }, [activeScenarioId, customScenarios]);

  const activeFeatures = useMemo(() => activeScenario.features || [], [activeScenario]);

  // SESSION STATE
  const [session, setSession] = useState(null);
  const [trainerLoadSessionId, setTrainerLoadSessionId] = useState("");
  const [trainerSessionError, setTrainerSessionError] = useState("");

  const [featureRoundState, setFeatureRoundState] = useState(() => {
    return activeFeatures.reduce((acc, curr) => {
      acc[curr.id] = { status: 'notStarted', resultsRevealed: false };
      return acc;
    }, {});
  });

  const [roleSlots, setRoleSlots] = useState([...defaultRoleSlots]);
  const [joinedParticipants, setJoinedParticipants] = useState([]);
  const [participantScores, setParticipantScores] = useState({});
  const [sessionTimeline, setSessionTimeline] = useState([]);

  // PARTICIPANT JOIN STATE
  const [joinSessionId, setJoinSessionId] = useState("");
  const [sessionFound, setSessionFound] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [currentParticipantId, setCurrentParticipantId] = useState(null);
  const [joinName, setJoinName] = useState("");
  const [joinRoleSlotId, setJoinRoleSlotId] = useState("");
  const [draftScores, setDraftScores] = useState({ bv: null, tc: null, rr: null, js: null });

  const [trainerNotes, setTrainerNotes] = useState({}); 
  const [aiPrompts, setAiPrompts] = useState([]);
  
  // UI LAYOUT STATE
  const [activeTrainerTab, setActiveTrainerTab] = useState('progress');
  const [setupExpanded, setSetupExpanded] = useState(false);
  const [setupTab, setSetupTab] = useState('scenario');
  const [expandedDetailsId, setExpandedDetailsId] = useState(null);
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getDbRef = useCallback((sId) => doc(db, 'artifacts', appId, 'public', 'data', 'sessions', sId || (session?.id || 'default')), [session?.id]);

  const logTimelineEvent = useCallback((type, desc, featureId = null) => {
    setSessionTimeline(prev => [
      { id: Date.now() + Math.random(), timestamp: new Date().toLocaleTimeString(), type, desc, featureId },
      ...prev
    ]);
  }, []);

  // AUTO-JOIN ОТ ЛИНК
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window === 'undefined') return;
      const match = window.location.href.match(/(WSJF-\d{4})/i);
      if (match && db && !sessionFound && accessMode === 'participant' && !currentParticipantId) {
        const sId = match[1].toUpperCase();
        setJoinSessionId(sId);
        try {
          const snap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sessions', sId));
          if (snap.exists()) {
             const data = snap.data();
             setSession(data.session);
             setRoleSlots(data.roleSlots || []);
             setJoinedParticipants(data.joinedParticipants || []);
             setSessionFound(true);
             setJoinError("");
          }
        } catch (e) {
           console.error("Auto-connect error:", e);
        }
      }
    };
    autoConnect();
  }, [db, sessionFound, accessMode, currentParticipantId]);

  // Sync Features round state when scenario changes (Local Trainer)
  useEffect(() => {
     if(accessMode !== 'trainerUnlocked') return;
     setFeatureRoundState(prev => {
        const next = { ...prev };
        activeFeatures.forEach(f => {
           if(!next[f.id]) next[f.id] = { status: 'notStarted', resultsRevealed: false };
        });
        return next;
     });
  }, [activeFeatures, accessMode]);

  // FIREBASE REAL-TIME LISTENER
  useEffect(() => {
    if (!authUser || !db || !session || session.lifecycleStatus === 'draft') return;
    if (accessMode === 'participant' && !sessionFound) return;

    const ref = getDbRef();
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        
        // Everyone receives latest participants and scores
        setJoinedParticipants(data.joinedParticipants || []);
        setParticipantScores(data.participantScores || {});

        // Participants overwrite their local master state with Trainer's state
        if (accessMode === 'participant' || accessMode === 'participantPreview') {
           if (data.session) setSession(data.session);
           if (data.featureRoundState) setFeatureRoundState(data.featureRoundState);
           if (data.activeScenarioId) setActiveScenarioId(data.activeScenarioId);
           if (data.roleSlots) setRoleSlots(data.roleSlots);
        }
      }
    }, (err) => console.error("Sync error", err));
    return () => unsub();
  }, [authUser, session?.id, session?.lifecycleStatus, accessMode, sessionFound, getDbRef]);

  // FIREBASE TRAINER STATE PUSH
  useEffect(() => {
    if (accessMode === 'trainerUnlocked' && session && session.lifecycleStatus !== 'draft' && db) {
      const pushState = async () => {
        try {
          await setDoc(getDbRef(), {
             session, featureRoundState, activeScenarioId, roleSlots
          }, { merge: true });
        } catch(e) { console.error("Push state error", e); }
      };
      pushState();
    }
  }, [session, featureRoundState, activeScenarioId, roleSlots, accessMode, getDbRef]);

  // Sync Draft Scores
  useEffect(() => {
    if (!currentParticipantId || accessMode === 'participantPreview' || !session) return;
    const scores = participantScores[currentParticipantId]?.[session.activeFeatureId];
    const featState = featureRoundState[session.activeFeatureId] || {};
    if (featState.status === 'scoringOpen') {
      if (scores?.initial?.submitted) setDraftScores({ ...scores.initial });
      else setDraftScores({ bv: null, tc: null, rr: null, js: null });
    } else if (featState.status === 'reScoreOpen') {
      if (scores?.revised?.submitted) setDraftScores({ ...scores.revised });
      else if (scores?.initial?.submitted) setDraftScores({ ...scores.initial });
      else setDraftScores({ bv: null, tc: null, rr: null, js: null });
    } else {
       setDraftScores({ bv: null, tc: null, rr: null, js: null });
    }
  }, [session?.activeFeatureId, featureRoundState, currentParticipantId, participantScores, accessMode, session]);

  // SCENARIO MANAGEMENT
  const requestScenarioChange = (newId) => {
     if (session?.lifecycleStatus === 'inProgress' || session?.lifecycleStatus === 'debrief') {
        setShowScenarioChangeConfirm(newId);
     } else {
        executeScenarioChange(newId);
     }
  };

  const executeScenarioChange = (newId, directScen = null) => {
     const nextScen = directScen || [...defaultTemplates, ...customScenarios].find(s => s.id === newId);
     if (!nextScen) return;
     setActiveScenarioId(newId);
     setSession(prev => ({ ...prev, activeFeatureId: nextScen?.features[0]?.id || 1 }));
     setParticipantScores({});
     setFeatureRoundState(nextScen.features.reduce((acc, curr) => {
        acc[curr.id] = { status: 'notStarted', resultsRevealed: false };
        return acc;
     }, {}));
     setDraftScores({ bv: null, tc: null, rr: null, js: null });
     setShowScenarioChangeConfirm(null);
     setShowFeatureDetails(false);
     logTimelineEvent('SCENARIO', `Changed scenario to ${lang === 'en' ? nextScen.nameEn : nextScen.nameBg}`);
  };

  const duplicateToCustom = () => {
     const newId = `custom-${Date.now()}`;
     const duplicated = {
        ...activeScenario,
        id: newId,
        isBuiltIn: false,
        nameEn: `${activeScenario.nameEn} (Copy)`,
        nameBg: `${activeScenario.nameBg} (Копие)`,
        features: activeFeatures.map(f => ({...f, id: `f-${Date.now()}-${Math.random()}`}))
     };
     setCustomScenarios(prev => [...prev, duplicated]);
     
     if (session?.lifecycleStatus === 'inProgress' || session?.lifecycleStatus === 'debrief') {
        setShowScenarioChangeConfirm(newId);
     } else {
        executeScenarioChange(newId, duplicated);
     }
  };

  const createBlankScenario = () => {
     const newId = `custom-${Date.now()}`;
     const newScen = {
        id: newId,
        isBuiltIn: false,
        nameEn: "New Custom Scenario",
        nameBg: "Нов персонален сценарий",
        descEn: "",
        descBg: "",
        features: [
           { id: `f-${Date.now()}`, title_en: "Feature 1", title_bg: "Функционалност 1", desc_en: "", desc_bg: "", details_en: "", details_bg: "", bv: 1, tc: 1, rr: 1, js: 1 }
        ]
     };
     setCustomScenarios(prev => [...prev, newScen]);
     
     if (session?.lifecycleStatus === 'inProgress' || session?.lifecycleStatus === 'debrief') {
        setShowScenarioChangeConfirm(newId);
     } else {
        executeScenarioChange(newId, newScen);
     }
  };

  const updateActiveCustomScenario = (field, value) => {
     if (activeScenario.isBuiltIn) return;
     setCustomScenarios(prev => prev.map(s => s.id === activeScenarioId ? { ...s, [field]: value } : s));
  };

  const updateActiveCustomFeature = (fId, field, value) => {
     if (activeScenario.isBuiltIn) return;
     setCustomScenarios(prev => prev.map(s => {
        if (s.id !== activeScenarioId) return s;
        return {
           ...s,
           features: s.features.map(f => f.id === fId ? { ...f, [field]: value } : f)
        };
     }));
  };

  const addCustomFeature = () => {
     if (activeScenario.isBuiltIn) return;
     const newF = { id: `f-${Date.now()}`, title_en: "New Feature", title_bg: "Нова функционалност", desc_en: "", desc_bg: "", details_en: "", details_bg: "", bv: 1, tc: 1, rr: 1, js: 1 };
     setCustomScenarios(prev => prev.map(s => s.id === activeScenarioId ? { ...s, features: [...s.features, newF] } : s));
  };

  const deleteCustomFeature = (fId) => {
     if (activeScenario.isBuiltIn) return;
     setCustomScenarios(prev => prev.map(s => s.id === activeScenarioId ? { ...s, features: s.features.filter(f => f.id !== fId) } : s));
  };

  const deleteCustomScenario = () => {
     if (activeScenario.isBuiltIn) return;
     const remaining = customScenarios.filter(s => s.id !== activeScenarioId);
     setCustomScenarios(remaining);
     executeScenarioChange('geekbooks');
  };

  // ACTIONS
  const handleTrainerLogin = () => {
    if (trainerPinInput === trainerPin) {
      setAccessMode('trainerSessionSelect');
      setPinError(false);
      setTrainerPinInput("");
    } else {
      setPinError(true);
    }
  };

  const createNewSession = () => {
     setSession({
        id: `WSJF-${Math.floor(Math.random() * 9000) + 1000}`,
        lifecycleStatus: 'draft', 
        activeFeatureId: activeFeatures[0]?.id || 1,
        capacity: 30,
        demoMode: false,
     });
     setAccessMode('trainerUnlocked');
     logTimelineEvent('ACCESS', 'Trainer created new session');
  };

  const loadExistingSession = async () => {
     if(!trainerLoadSessionId.trim() || !db) return;
     try {
        const snap = await getDoc(getDbRef(trainerLoadSessionId.toUpperCase()));
        if (snap.exists()) {
           const data = snap.data();
           setSession(data.session);
           if(data.activeScenarioId) setActiveScenarioId(data.activeScenarioId);
           if(data.featureRoundState) setFeatureRoundState(data.featureRoundState);
           if(data.roleSlots) setRoleSlots(data.roleSlots);
           if(data.joinedParticipants) setJoinedParticipants(data.joinedParticipants);
           if(data.participantScores) setParticipantScores(data.participantScores);
           
           setAccessMode('trainerUnlocked');
           setTrainerSessionError("");
           logTimelineEvent('ACCESS', 'Trainer loaded existing session');
        } else {
           setTrainerSessionError(t.trainerSessionError);
        }
     } catch (e) {
        setTrainerSessionError("Connection error.");
     }
  };

  const getActiveScore = useCallback((pId, fId) => {
    const s = participantScores[pId]?.[fId];
    if (!s) return null;
    if (s.revised?.submitted) return s.revised;
    if (s.initial?.submitted) return s.initial;
    return null;
  }, [participantScores]);

  const calcRowWSJF = (row) => {
    if (!row || !row.submitted) return { cod: '-', wsjf: '-' };
    const cod = row.bv + row.tc + row.rr;
    const wsjf = row.js > 0 ? (cod / row.js).toFixed(2) : 0;
    return { cod, wsjf };
  };

  const calcCriterionStats = useCallback((fId, criterion, forceInitial = false) => {
    const validVotes = joinedParticipants.map(p => {
      const s = participantScores[p.id]?.[fId];
      if (!s) return null;
      const target = (forceInitial || !s.revised?.submitted) ? s.initial : s.revised;
      if (target?.submitted && target[criterion] != null) return target[criterion];
      return null;
    }).filter(v => v !== null);

    if (!validVotes.length) return { avg: 0, min: 0, max: 0, spread: 0 };
    const avg = validVotes.reduce((a, b) => a + b, 0) / validVotes.length;
    const min = Math.min(...validVotes);
    const max = Math.max(...validVotes);
    return { avg, min, max, spread: max - min };
  }, [participantScores, joinedParticipants]);

  const getCalculatedBacklog = useCallback(() => {
    let processed = activeFeatures.map(item => {
      const bvAvg = calcCriterionStats(item.id, 'bv').avg || item.bv;
      const tcAvg = calcCriterionStats(item.id, 'tc').avg || item.tc;
      const rrAvg = calcCriterionStats(item.id, 'rr').avg || item.rr;
      const jsAvg = calcCriterionStats(item.id, 'js').avg || item.js;
      const cod = bvAvg + tcAvg + rrAvg;
      const wsjf = jsAvg > 0 ? Number((cod / jsAvg).toFixed(2)) : 0;
      return { ...item, bv: bvAvg, tc: tcAvg, rr: rrAvg, js: jsAvg, cod, wsjf };
    });
    processed.sort((a, b) => b.wsjf - a.wsjf);
    let usedCap = 0;
    processed = processed.map((item, index) => {
      const js = Number(item.js) || 0;
      let included = false;
      if (session && usedCap + js <= session.capacity) { included = true; usedCap += js; }
      return { ...item, rank: index + 1, included };
    });
    return processed;
  }, [calcCriterionStats, session?.capacity, activeFeatures, session]);

  const handleOpenLobby = async () => {
    const newState = 'lobbyOpen';
    setSession(prev => ({ ...prev, lifecycleStatus: newState }));
    logTimelineEvent('SESSION', `Status changed to ${newState}`);
    
    if (db && session) {
       try {
          await setDoc(getDbRef(), {
             session: { ...session, lifecycleStatus: newState },
             featureRoundState,
             activeScenarioId,
             roleSlots,
             joinedParticipants: [],
             participantScores: {}
          });
       } catch(e) { console.error("Failed to create session", e); }
    }
  };

  const updateSessionState = (newState) => {
     setSession(prev => ({ ...prev, lifecycleStatus: newState }));
     logTimelineEvent('SESSION', `Status changed to ${newState}`);
  };

  const updateFeatureStatus = (statusUpdate) => {
     if (!activeFeatures.length || !session) return;
     setFeatureRoundState(prev => {
        const next = { ...prev };
        next[session.activeFeatureId] = { 
           ...next[session.activeFeatureId], 
           status: statusUpdate,
           resultsRevealed: statusUpdate === 'resultsRevealed' || statusUpdate === 'discussion' || statusUpdate === 'reScoreOpen' ? true : next[session.activeFeatureId]?.resultsRevealed
        };
        return next;
     });
     logTimelineEvent('FEATURE', `Feature status changed to ${statusUpdate}`, session.activeFeatureId);
     if (session.lifecycleStatus === 'lobbyOpen') {
        updateSessionState('inProgress');
     }
  };

  const changeFeature = (dir) => {
    if (!activeFeatures.length || !session) return;
    const currentIndex = activeFeatures.findIndex(i => i.id === session.activeFeatureId);
    let nextIndex = currentIndex + dir;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= activeFeatures.length) nextIndex = activeFeatures.length - 1;
    const newId = activeFeatures[nextIndex].id;
    setSession(prev => ({ ...prev, activeFeatureId: newId }));
    setShowFeatureDetails(false);
    logTimelineEvent('FEATURE', `Mapsd to feature`, newId);
  };

  const executeResetFeatureRound = async () => {
    if(!session) return;
    const newScores = { ...participantScores };
    Object.keys(newScores).forEach(pId => {
      if (newScores[pId][session.activeFeatureId]) {
         newScores[pId][session.activeFeatureId] = { initial: {}, revised: {} };
      }
    });
    setParticipantScores(newScores);
    
    setFeatureRoundState(prev => ({
       ...prev,
       [session.activeFeatureId]: { status: 'notStarted', resultsRevealed: false }
    }));
    setDraftScores({ bv: null, tc: null, rr: null, js: null });
    setShowResetConfirm(false);
    logTimelineEvent('FEATURE', `Scores reset`, session.activeFeatureId);

    if (db) {
       await updateDoc(getDbRef(), { participantScores: newScores });
    }
  };

  const handleEndSession = () => {
     updateSessionState('ended');
     setShowEndSessionModal(false);
  };

  const handleCopyShareLink = () => {
     const shareUrl = `${window.location.origin}${window.location.pathname}?session=${session.id}`;
     navigator.clipboard.writeText(shareUrl);
     setIsCopied(true);
     setTimeout(() => setIsCopied(false), 2000);
  };

  const findSession = async () => {
    if (!joinSessionId.trim() || !db) return;
    try {
      const snap = await getDoc(getDbRef(joinSessionId.toUpperCase()));
      if (snap.exists()) {
         const data = snap.data();
         setSession(data.session);
         setRoleSlots(data.roleSlots || []);
         setJoinedParticipants(data.joinedParticipants || []);
         setSessionFound(true);
         setJoinError("");
      } else {
         setJoinError(t.sessionNotFound);
      }
    } catch (e) {
      setJoinError("Connection error.");
    }
  };

  const handleJoin = async () => {
    if (!joinName.trim() || !joinRoleSlotId || !db) return;
    const slot = roleSlots.find(r => r.id === joinRoleSlotId);
    if (!slot) return;
    
    const newParticipant = {
      id: `p-${Date.now()}`, name: joinName, roleSlotId: joinRoleSlotId,
      role: slot.role, isMock: false, joinedAt: new Date().toISOString()
    };
    
    // Optistic local update
    setJoinedParticipants(prev => [...prev, newParticipant]);
    setCurrentParticipantId(newParticipant.id);
    
    // Firebase update
    try {
       const snap = await getDoc(getDbRef());
       const currentList = snap.data()?.joinedParticipants || [];
       await updateDoc(getDbRef(), { joinedParticipants: [...currentList, newParticipant] });
    } catch(e) { console.error("Join error", e); }
  };

  const handleLeave = () => {
    setJoinedParticipants(prev => prev.filter(p => p.id !== currentParticipantId));
    setCurrentParticipantId(null);
    setSessionFound(false);
    setJoinName(""); setJoinRoleSlotId(""); setJoinSessionId("");
  };

  const handleDraftScore = (crit, val) => {
    if (accessMode === 'participantPreview' || !session) return;
    const featState = featureRoundState[session.activeFeatureId] || {};
    if (featState.status === 'votingLocked' || featState.status === 'discussion' || featState.status === 'completed' || session.lifecycleStatus === 'ended') return;
    setDraftScores(prev => ({ ...prev, [crit]: val }));
  };

  const submitFeatureScores = async () => {
    if (accessMode === 'participantPreview' || !db || !session) return;
    if (!draftScores.bv || !draftScores.tc || !draftScores.rr || !draftScores.js) return;
    
    const featState = featureRoundState[session.activeFeatureId] || {};
    const targetField = featState.status === 'reScoreOpen' ? 'revised' : 'initial';
    const scoreObj = { ...draftScores, submitted: true, submittedAt: new Date().toISOString() };
    
    // Optimistic local update
    setParticipantScores(prev => ({
      ...prev,
      [currentParticipantId]: {
        ...(prev[currentParticipantId] || {}),
        [session.activeFeatureId]: {
          ...(prev[currentParticipantId]?.[session.activeFeatureId] || {}),
          [targetField]: scoreObj
        }
      }
    }));

    // Firebase write
    try {
       await updateDoc(getDbRef(), {
          [`participantScores.${currentParticipantId}.${session.activeFeatureId}.${targetField}`]: scoreObj
       });
    } catch(e) { console.error("Submit error", e); }
  };

  const handleRoleSetupChange = (id, field, value) => setRoleSlots(prev => prev.map(rs => rs.id === id ? { ...rs, [field]: value } : rs));
  const addRoleSlot = () => setRoleSlots([...roleSlots, { id: `rs${Date.now()}`, role: 'custom', seats: 1 }]);
  const removeRoleSlot = (id) => setRoleSlots(prev => prev.filter(rs => rs.id !== id));

  // Prompts Generation
  const generatePromptsEngine = useCallback(() => {
    if (!activeFeatures.length || !session) return;
    const currentItem = activeFeatures.find(i => i.id === session.activeFeatureId);
    if (!currentItem) return;

    const stats = {
      bv: calcCriterionStats(session.activeFeatureId, 'bv'), tc: calcCriterionStats(session.activeFeatureId, 'tc'),
      rr: calcCriterionStats(session.activeFeatureId, 'rr'), js: calcCriterionStats(session.activeFeatureId, 'js')
    };

    const newPrompts = [];
    const featureName = lang === 'en' ? currentItem.title_en : currentItem.title_bg;
    const spreads = { bv: stats.bv.spread, tc: stats.tc.spread, rr: stats.rr.spread, js: stats.js.spread };
    const maxSpreadCrit = Object.keys(spreads).reduce((a, b) => spreads[a] > spreads[b] ? a : b);
    const maxSpreadVal = spreads[maxSpreadCrit];

    const getExtremes = (crit) => {
      const votes = joinedParticipants.map(p => ({ p, val: getActiveScore(p.id, session.activeFeatureId)?.[crit] })).filter(x => x.val != null);
      if (!votes.length) return { minNames: [], maxNames: [] };
      const minVal = Math.min(...votes.map(x => x.val));
      const maxVal = Math.max(...votes.map(x => x.val));
      return {
        minNames: votes.filter(x => x.val === minVal).map(x => `${x.p.name} (${t.roles?.[x.p.role] || x.p.role})`),
        maxNames: votes.filter(x => x.val === maxVal).map(x => `${x.p.name} (${t.roles?.[x.p.role] || x.p.role})`),
        minVal, maxVal
      };
    };

    if (maxSpreadCrit === 'js' && maxSpreadVal >= 8) {
      const ext = getExtremes('js');
      newPrompts.push({
        id: 'p3', level: 'Critical', category: 'Size uncertainty',
        title: lang === 'en' ? "Estimation Black Hole" : "Черна дупка в оценките",
        message: lang === 'en' ? `Massive disagreement on effort for "${featureName}". ${ext.maxNames[0]} sees a ${ext.maxVal}, while ${ext.minNames[0]} sees a ${ext.minVal}.` : `Огромно разминаване в необходимото усилие. ${ext.maxNames[0]} дава ${ext.maxVal}, докато ${ext.minNames[0]} дава ${ext.minVal}.`,
        question: lang === 'en' ? "What assumptions are hiding in these estimates? Who included testing, integration, and compliance?" : "Какви предположения се крият в тези оценки? Кой включи тестване, интеграция и compliance?",
        reason: `Job Size spread is ${maxSpreadVal}.`
      });
    }

    if (maxSpreadCrit === 'bv' && maxSpreadVal >= 8) {
      const ext = getExtremes('bv');
      newPrompts.push({
        id: 'p1', level: 'Critical', category: 'Value disagreement',
        title: lang === 'en' ? "High Disagreement on Business Value" : "Голямо разминаване в Бизнес Стойността",
        message: lang === 'en' ? `The group is split on the value of "${featureName}". ${ext.maxNames[0]} scored high (${ext.maxVal}), ${ext.minNames[0]} scored low (${ext.minVal}).` : `Групата е разделена за стойността. ${ext.maxNames[0]} дава ${ext.maxVal}, а ${ext.minNames[0]} дава ${ext.minVal}.`,
        question: lang === 'en' ? "What does 'value' mean in this context? Revenue, retention, or just a favorite feature?" : "Какво означава 'стойност' тук? Приходи, задържане или просто любима функционалност?",
        reason: `Business Value spread is ${maxSpreadVal}.`
      });
    }

    if (stats.tc.avg > 8 && stats.bv.avg <= 8) {
      newPrompts.push({
        id: 'p2', level: 'Warning', category: 'Urgency confusion',
        title: lang === 'en' ? "Urgency > Value" : "Спешност > Стойност",
        message: lang === 'en' ? `Participants marked "${featureName}" as highly urgent, but not highly valuable.` : `Участниците отбелязаха "${featureName}" като много спешна, но не много ценна.`,
        question: lang === 'en' ? "What exactly happens if we delay this by one release? Is there a real deadline?" : "Какво точно ще стане, ако забавим това с един релийз? Има ли реален срок?",
        reason: `TC average (${stats.tc.avg.toFixed(1)}) is high while BV average (${stats.bv.avg.toFixed(1)}) is low.`
      });
    }

    setAiPrompts(newPrompts);
  }, [session?.activeFeatureId, session?.lifecycleStatus, featureRoundState, joinedParticipants, calcCriterionStats, getActiveScore, lang, t, activeFeatures, session]);

  useEffect(() => {
    generatePromptsEngine();
  }, [session?.activeFeatureId, featureRoundState, generatePromptsEngine, session]);

  const activeFeatureData = activeFeatures.find(i => i.id === session?.activeFeatureId) || activeFeatures[0];
  const activeFeatureTitle = activeFeatureData ? (lang === 'en' ? activeFeatureData.title_en : activeFeatureData.title_bg) : "No feature selected";
  const activeFeatState = session ? (featureRoundState[session.activeFeatureId] || {}) : {};
  const areResultsRevealed = activeFeatState.resultsRevealed || session?.lifecycleStatus === 'ended';
  const isVotingLocked = ['votingLocked', 'resultsRevealed', 'discussion', 'completed'].includes(activeFeatState.status) || session?.lifecycleStatus === 'debrief' || session?.lifecycleStatus === 'lobbyOpen' || session?.lifecycleStatus === 'draft' || session?.lifecycleStatus === 'ended';

  const activeItemStats = activeFeatureData && session ? {
    bv: calcCriterionStats(session.activeFeatureId, 'bv'), tc: calcCriterionStats(session.activeFeatureId, 'tc'),
    rr: calcCriterionStats(session.activeFeatureId, 'rr'), js: calcCriterionStats(session.activeFeatureId, 'js')
  } : { bv:{avg:0,spread:0}, tc:{avg:0,spread:0}, rr:{avg:0,spread:0}, js:{avg:0,spread:0} };
  
  const activeCodAvg = activeItemStats.bv.avg + activeItemStats.tc.avg + activeItemStats.rr.avg;
  const activeWsjfAvg = activeItemStats.js.avg > 0 ? (activeCodAvg / activeItemStats.js.avg).toFixed(2) : 0;
  
  const spreadsArr = [
    { k: 'bv', val: activeItemStats.bv.spread }, { k: 'tc', val: activeItemStats.tc.spread },
    { k: 'rr', val: activeItemStats.rr.spread }, { k: 'js', val: activeItemStats.js.spread }
  ];
  const maxSpreadObj = spreadsArr.reduce((prev, curr) => curr.val > prev.val ? curr : prev, {val: -1});
  const maxSpreadCrit = maxSpreadObj.val > 0 ? maxSpreadObj.k : '-';

  const getConsensusLevel = (spread) => {
    if (spread === '-' || spread < 0) return '-';
    if (spread <= 2) return t.consensusStrong || 'Strong alignment';
    if (spread <= 5) return t.consensusModerate || 'Moderate disagreement';
    return t.consensusHigh || 'High disagreement';
  };
  
  const getConsensusColor = (spread) => {
    if (spread === '-' || spread < 0) return 'bg-[#F8FAFF] text-[#7A89A3] border-transparent';
    if (spread <= 2) return 'bg-[#ECFDF5] text-[#12B981] border-[#A7F3D0]';
    if (spread <= 5) return 'bg-[#FEF3C7] text-[#F59E0B] border-[#FDE68A]';
    return 'bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]';
  };

  const getNextRecommendedAction = () => {
    if (!session) return { label: "", act: () => {}, bg: '', icon: null };
    if (!activeFeatures.length) return { label: "Add Features", act: () => setSetupExpanded(true), bg: 'bg-[#7A89A3]', icon: <AlertCircle className="w-4 h-4 mr-2"/> };
    if (session.lifecycleStatus === 'draft') return { label: t.btnOpenLobby, act: () => handleOpenLobby(), bg: 'bg-[#5B5FEF]', icon: <Users className="w-4 h-4 mr-2"/> };
    if (session.lifecycleStatus === 'lobbyOpen') return { label: t.btnStartSession, act: () => updateSessionState('inProgress'), bg: 'bg-[#12B981]', icon: <PlayCircle className="w-4 h-4 mr-2"/> };
    if (session.lifecycleStatus === 'inProgress') {
        if (activeFeatState.status === 'notStarted') return { label: t.btnStartScoring, act: () => updateFeatureStatus('scoringOpen'), bg: 'bg-[#12B981]', icon: <PlayCircle className="w-4 h-4 mr-2"/> };
        if (activeFeatState.status === 'scoringOpen') return { label: t.btnLock, act: () => updateFeatureStatus('votingLocked'), bg: 'bg-[#F59E0B]', icon: <Lock className="w-4 h-4 mr-2"/> };
        if (activeFeatState.status === 'votingLocked') return { label: t.btnReveal, act: () => updateFeatureStatus('resultsRevealed'), bg: 'bg-[#7C3AED]', icon: <Eye className="w-4 h-4 mr-2"/> };
        if (activeFeatState.status === 'resultsRevealed') return { label: t.btnDiscussion, act: () => updateFeatureStatus('discussion'), bg: 'bg-[#5B5FEF]', icon: <MessageSquare className="w-4 h-4 mr-2"/> };
        if (activeFeatState.status === 'discussion') return { label: t.btnRescore, act: () => updateFeatureStatus('reScoreOpen'), bg: 'bg-[#F59E0B]', icon: <RotateCcw className="w-4 h-4 mr-2"/> };
        if (activeFeatState.status === 'reScoreOpen') return { label: t.btnLock, act: () => updateFeatureStatus('votingLocked'), bg: 'bg-[#F59E0B]', icon: <Lock className="w-4 h-4 mr-2"/> };
    }
    if (session.lifecycleStatus !== 'ended') return { label: t.btnEndSession, act: () => setShowEndSessionModal(true), bg: 'bg-[#EF4444]', icon: <XCircle className="w-4 h-4 mr-2"/> };
    return { label: "Session Ended", act: () => {}, bg: 'bg-[#7A89A3]', icon: <CheckCircle2 className="w-4 h-4 mr-2"/> };
  };
  const primaryAction = getNextRecommendedAction();

  const myCurrentParticipant = joinedParticipants.find(p => p.id === currentParticipantId);
  const myVoteState = session ? getActiveScore(currentParticipantId, session.activeFeatureId) : null;
  const hasSubmittedActive = myVoteState?.submitted;

  const renderPokerRow = (criterion, label) => {
    const currentVal = draftScores[criterion];
    let helperTxt = "";
    if(criterion === 'bv') helperTxt = t.helperBv;
    if(criterion === 'tc') helperTxt = t.helperTc;
    if(criterion === 'rr') helperTxt = t.helperRr;
    if(criterion === 'js') helperTxt = t.helperJs;

    return (
      <div className="bg-white p-5 rounded-2xl border border-[#D9E2F0] shadow-sm mb-4">
        <h4 className="text-[13px] font-bold text-[#172033] uppercase tracking-wide mb-1">{label}</h4>
        <p className="text-xs text-[#7A89A3] mb-4">{helperTxt}</p>
        <div className="flex flex-wrap gap-2">
          {fibonacciScale.map(val => {
            const isSelected = currentVal === val;
            return (
              <button 
                key={val} disabled={isVotingLocked} onClick={() => handleDraftScore(criterion, val)}
                className={`
                  relative w-12 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm transition-all duration-200
                  ${isVotingLocked ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-md'}
                  ${isSelected ? 'bg-[#3366FF] text-white border-2 border-[#172033] ring-2 ring-[#C6D4EA]' : 'bg-[#F8FAFF] text-[#53627A] border border-[#D9E2F0] hover:border-[#3366FF] hover:text-[#3366FF]'}
                `}
              >
                {val}
                {isSelected && <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-[#12B981] bg-white rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const [fbErrorState] = useState(firebaseInitError);

  return (
    <div className="min-h-screen bg-[#EEF3FB] font-sans text-[#172033] pb-20 selection:bg-[#3366FF] selection:text-white">
      
      {/* ERROR BANNER */}
      {fbErrorState && (
         <div className="max-w-[1440px] mx-auto pt-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-4 rounded-r-xl shadow-sm flex items-start">
               <AlertTriangle className="w-6 h-6 text-[#EF4444] mr-3 shrink-0" />
               <div>
                  <h3 className="text-[#991B1B] font-bold text-sm">Грешка при свързване с Firebase</h3>
                  <p className="text-[#B91C1C] text-xs mt-1">{fbErrorState}</p>
                  <p className="text-[#991B1B] text-xs mt-2 font-medium">Проверете обекта <code className="bg-[#FECACA] px-1 py-0.5 rounded">userFirebaseConfig</code> в кода.</p>
               </div>
            </div>
         </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && session && (
        <div className="fixed inset-0 bg-[#0C1222]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[24px] shadow-xl p-8 max-w-sm w-full border border-[#D9E2F0] text-center">
              <div className="flex justify-end mb-2">
                 <button onClick={() => setShowShareModal(false)} className="text-[#A0ABBF] hover:text-[#172033]"><XCircle className="w-6 h-6" /></button>
              </div>
              <h2 className="text-2xl font-black text-[#172033] mb-6">{t.shareTitle}</h2>
              
              <div className="bg-[#F8FAFF] p-4 rounded-xl border border-[#D9E2F0] mb-6 flex items-center justify-between">
                 <span className="font-mono text-sm text-[#53627A] truncate mr-3">{`${window.location.origin}${window.location.pathname}?session=${session.id}`}</span>
                 <button onClick={handleCopyShareLink} className="shrink-0 flex items-center px-3 py-1.5 bg-[#EEF4FF] hover:bg-[#D9E2F0] text-[#3366FF] rounded-lg text-xs font-bold uppercase transition-colors">
                    {isCopied ? <CheckCheck className="w-4 h-4 mr-1.5" /> : <CopyIcon className="w-4 h-4 mr-1.5" />}
                    {isCopied ? t.btnCopied : t.btnCopy}
                 </button>
              </div>

              <p className="text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-4">{t.scanQr}</p>
              <div className="flex justify-center p-4 bg-white border-2 border-[#F4F7FC] rounded-2xl inline-block mx-auto">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?session=${session.id}`)}&margin=0`} alt="QR Code" className="w-40 h-40" />
              </div>
           </div>
        </div>
      )}

      {/* MODALS */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-[#0C1222]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-[#D9E2F0]">
              <div className="flex items-center text-[#EF4444] mb-4">
                 <AlertTriangle className="w-8 h-8 mr-3" />
                 <h2 className="text-xl font-bold">{t.endSessionTitle}</h2>
              </div>
              <p className="text-[#53627A] mb-8 leading-relaxed">{t.endSessionBody}</p>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowEndSessionModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-[#53627A] bg-[#F8FAFF] border border-[#D9E2F0] hover:bg-[#EEF4FF] transition-colors">{t.btnCancel}</button>
                 <button onClick={handleEndSession} className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors shadow-sm">{t.btnConfirmEnd}</button>
              </div>
           </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-[#0C1222]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border border-[#D9E2F0] text-center">
              <RefreshCw className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-[#172033]">{t.resetConfirmTitle}</h2>
              <p className="text-sm text-[#53627A] mb-8">{t.resetConfirmBody}</p>
              <div className="flex justify-center gap-3">
                 <button onClick={() => setShowResetConfirm(false)} className="px-5 py-2.5 rounded-xl font-bold text-[#53627A] bg-[#F8FAFF] border border-[#D9E2F0] hover:bg-[#EEF4FF] transition-colors">{t.btnCancel}</button>
                 <button onClick={executeResetFeatureRound} className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors shadow-sm">OK</button>
              </div>
           </div>
        </div>
      )}

      {showScenarioChangeConfirm && (
        <div className="fixed inset-0 bg-[#0C1222]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border border-[#D9E2F0] text-center">
              <AlertTriangle className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-[#172033]">{t.scenarioChangeWarningTitle}</h2>
              <p className="text-sm text-[#53627A] mb-8">{t.scenarioChangeWarningBody}</p>
              <div className="flex justify-center gap-3">
                 <button onClick={() => setShowScenarioChangeConfirm(null)} className="px-5 py-2.5 rounded-xl font-bold text-[#53627A] bg-[#F8FAFF] border border-[#D9E2F0] hover:bg-[#EEF4FF] transition-colors">{t.btnCancel}</button>
                 <button onClick={() => executeScenarioChange(showScenarioChangeConfirm)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#D97706] hover:bg-[#B45309] transition-colors shadow-sm">{t.btnConfirmChange}</button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`bg-white shadow-sm border-b border-[#D9E2F0] sticky top-0 z-40 ${accessMode === 'participantPreview' ? 'border-t-4 border-t-[#F59E0B]' : ''}`}>
        {accessMode === 'participantPreview' && (
          <div className="bg-[#FEF3C7] text-[#D97706] text-xs font-bold text-center py-1.5 border-b border-[#FDE68A]">
            {t.previewBannerText} <button onClick={() => setAccessMode('trainerUnlocked')} className="ml-4 underline">{t.backToTrainer}</button>
          </div>
        )}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className={`w-7 h-7 ${(accessMode === 'trainerUnlocked' || accessMode === 'trainerSessionSelect') ? 'text-[#5B5FEF]' : 'text-[#3366FF]'}`} />
            <div>
              <h1 className="text-lg font-black leading-tight tracking-tight">{t.appTitle}</h1>
              <p className="text-[10px] text-[#7A89A3] font-bold uppercase tracking-wider hidden sm:block">Facilitation Cockpit</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 border-r border-[#D9E2F0] pr-6">
              <Globe className="w-4 h-4 text-[#7A89A3]" />
              <button onClick={() => setLang('en')} className={`text-xs font-bold transition-colors ${lang === 'en' ? 'text-[#172033]' : 'text-[#7A89A3] hover:text-[#3366FF]'}`}>EN</button>
              <span className="text-[#D9E2F0]">|</span>
              <button onClick={() => setLang('bg')} className={`text-xs font-bold transition-colors ${lang === 'bg' ? 'text-[#172033]' : 'text-[#7A89A3] hover:text-[#3366FF]'}`}>BG</button>
            </div>
            {((accessMode === 'trainerUnlocked' || sessionFound) && session) && (
              <div className="flex items-center space-x-3 text-xs">
                  <span className="bg-[#F8FAFF] text-[#53627A] px-3 py-1.5 rounded-lg border border-[#D9E2F0] font-mono font-bold shadow-sm">
                    {session.id}
                  </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ACCESS ROUTER */}
      {accessMode === 'trainerLocked' && (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
           <div className="bg-white rounded-[24px] shadow-xl border border-[#D9E2F0] p-10 max-w-sm w-full text-center">
              <Shield className="w-12 h-12 text-[#5B5FEF] mx-auto mb-4" />
              <h2 className="text-2xl font-black text-[#172033] mb-2">{t.trainerAccessTitle}</h2>
              <p className="text-[#53627A] text-sm mb-8">{t.trainerAccessSub}</p>
              <div className="mb-6">
                 <label className="block text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-2 text-left">{t.trainerPinLabel}</label>
                 <input type="password" value={trainerPinInput} onChange={e => setTrainerPinInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTrainerLogin()} className="w-full p-4 border border-[#D9E2F0] rounded-xl focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#EEF4FF] outline-none transition-all font-mono text-xl text-center tracking-widest" placeholder="••••" />
                 {pinError && <p className="text-[#EF4444] text-xs font-bold mt-2">{t.incorrectPin}</p>}
              </div>
              <button onClick={handleTrainerLogin} className="w-full bg-[#5B5FEF] hover:bg-[#4F46E5] text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-md mb-4">{t.unlockTrainer}</button>
              <button onClick={() => setAccessMode('participant')} className="text-xs font-bold text-[#7A89A3] hover:text-[#172033] transition-colors">{t.backToParticipant}</button>
           </div>
        </div>
      )}

      {/* NEW: TRAINER SESSION SELECTION */}
      {accessMode === 'trainerSessionSelect' && (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
           <div className="bg-white rounded-[24px] shadow-xl border border-[#D9E2F0] p-10 max-w-md w-full text-center">
              <Settings className="w-12 h-12 text-[#5B5FEF] mx-auto mb-4" />
              <h2 className="text-2xl font-black text-[#172033] mb-2">{t.trainerSessionTitle}</h2>
              <p className="text-[#53627A] text-sm mb-8">Create a new workshop session or load an existing one from the database.</p>
              
              <div className="bg-[#F8FAFF] p-6 rounded-xl border border-[#D9E2F0] mb-6">
                 <label className="block text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-2 text-left">{t.trainerSessionInput}</label>
                 <input type="text" value={trainerLoadSessionId} onChange={e => setTrainerLoadSessionId(e.target.value.toUpperCase())} className="w-full p-4 border border-[#D9E2F0] rounded-xl focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#EEF4FF] outline-none transition-all font-mono text-xl text-center tracking-widest uppercase mb-4" placeholder="WSJF-XXXX" />
                 <button onClick={loadExistingSession} disabled={!trainerLoadSessionId.trim()} className="w-full bg-[#172033] hover:bg-[#5B5FEF] disabled:bg-[#D9E2F0] disabled:text-[#A0ABBF] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm">{t.btnLoadSession}</button>
                 {trainerSessionError && <p className="text-[#EF4444] text-xs font-bold mt-3">{trainerSessionError}</p>}
              </div>

              <div className="relative flex items-center py-5">
                 <div className="flex-grow border-t border-[#D9E2F0]"></div>
                 <span className="flex-shrink-0 mx-4 text-[#A0ABBF] text-xs font-bold uppercase tracking-wider">OR</span>
                 <div className="flex-grow border-t border-[#D9E2F0]"></div>
              </div>

              <button onClick={createNewSession} className="w-full bg-white border-2 border-[#5B5FEF] text-[#5B5FEF] hover:bg-[#EEF4FF] font-bold py-4 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center">
                 <Plus className="w-5 h-5 mr-2" /> {t.btnCreateSession}
              </button>
           </div>
        </div>
      )}

      {(accessMode === 'participant' || accessMode === 'participantPreview') && (
        <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-6">
            
            {/* FIND SESSION SCREEN */}
            {!sessionFound && !currentParticipantId && accessMode !== 'participantPreview' && (
              <div className="max-w-md mx-auto bg-white rounded-[24px] shadow-lg border border-[#D9E2F0] overflow-hidden mt-12 animate-in fade-in zoom-in-95">
                <div className="bg-[#172033] p-8 text-center relative overflow-hidden">
                  <Search className="w-12 h-12 text-[#3366FF] mx-auto mb-4 relative z-10" />
                  <h2 className="text-2xl font-black text-white tracking-tight relative z-10">{t.findSessionTitle}</h2>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#3366FF]/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-2">{t.sessionIdInput}</label>
                    <input type="text" value={joinSessionId} onChange={e => setJoinSessionId(e.target.value.toUpperCase())} className="w-full p-4 border border-[#D9E2F0] rounded-xl focus:border-[#3366FF] focus:ring-2 focus:ring-[#EEF4FF] outline-none font-mono text-center text-xl text-[#172033] tracking-widest uppercase" placeholder="WSJF-XXXX" />
                    {joinError && <p className="text-[#EF4444] text-xs font-bold mt-2 text-center">{joinError}</p>}
                  </div>
                  <button onClick={findSession} disabled={!joinSessionId.trim() || !db} className="w-full bg-[#3366FF] hover:bg-[#254EDBE6] disabled:bg-[#D9E2F0] text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-md mt-2 flex justify-center items-center">
                    {t.btnFindSession} <ChevronRight className="w-5 h-5 ml-2"/>
                  </button>
                </div>
              </div>
            )}

            {/* JOIN SCREEN (After session is found) */}
            {sessionFound && !currentParticipantId && accessMode !== 'participantPreview' && session && (
              <div className="max-w-md mx-auto bg-white rounded-[24px] shadow-lg border border-[#D9E2F0] overflow-hidden mt-12 animate-in fade-in zoom-in-95">
                <div className="bg-[#3366FF] p-8 text-center relative overflow-hidden">
                  <Calculator className="w-12 h-12 text-white mx-auto mb-4 relative z-10" />
                  <h2 className="text-2xl font-black text-white tracking-tight relative z-10">{t.joinTitle}</h2>
                  <p className="text-white/80 text-sm mt-2 font-mono font-medium relative z-10">Session ID: {session.id}</p>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-2">{t.joinNameInput}</label>
                    <input type="text" value={joinName} onChange={e => setJoinName(e.target.value)} className="w-full p-3.5 border border-[#D9E2F0] rounded-xl focus:border-[#3366FF] focus:ring-2 focus:ring-[#EEF4FF] outline-none font-medium text-[#172033]" placeholder="E.g. Maria Petrova" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-2">{t.joinRoleSelect}</label>
                    <select value={joinRoleSlotId} onChange={e => setJoinRoleSlotId(e.target.value)} className="w-full p-3.5 border border-[#D9E2F0] rounded-xl bg-[#F8FAFF] focus:border-[#3366FF] outline-none font-medium text-[#172033]">
                      <option value="" disabled>--- Select ---</option>
                      {roleSlots.map(slot => {
                         const joinedCnt = joinedParticipants.filter(p => p.roleSlotId === slot.id && !p.isMock).length;
                         const remaining = slot.seats - joinedCnt;
                         if (remaining <= 0) return null;
                         return <option key={slot.id} value={slot.id}>{t.roles?.[slot.role] || slot.role} ({remaining} {remaining === 1 ? t.seatLeft : t.seatsLeft})</option>;
                      })}
                    </select>
                  </div>
                  <button onClick={handleJoin} disabled={!joinName.trim() || !joinRoleSlotId} className="w-full bg-[#172033] hover:bg-[#3366FF] disabled:bg-[#D9E2F0] text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-md mt-2">
                    {t.btnJoin}
                  </button>
                </div>
              </div>
            )}

            {/* JOINED WORKSPACE */}
            {(currentParticipantId || accessMode === 'participantPreview') && session && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-[#D9E2F0] mb-6">
                   <div className="flex items-center">
                      <div className="bg-[#EEF4FF] p-2.5 rounded-xl border border-[#C6D4EA] mr-4"><UserCog className="w-5 h-5 text-[#3366FF]" /></div>
                      <div>
                         <p className="text-[10px] text-[#7A89A3] uppercase font-bold tracking-wider mb-0.5">{t.joinedAs}</p>
                         <p className="font-bold text-[#172033] text-sm">{accessMode === 'participantPreview' ? 'Trainer Preview' : myCurrentParticipant?.name} <span className="font-normal text-[#53627A] ml-1">- {accessMode === 'participantPreview' ? 'Preview' : (t.roles?.[myCurrentParticipant?.role] || myCurrentParticipant?.role)}</span></p>
                      </div>
                   </div>
                   {accessMode !== 'participantPreview' && (
                     <button onClick={handleLeave} className="text-xs flex items-center text-[#EF4444] hover:bg-[#FEF2F2] px-3 py-2 rounded-lg font-bold transition-colors">
                        <LogOut className="w-4 h-4 mr-2" /> {t.btnLeave}
                     </button>
                   )}
                </div>

                {/* STATUS CARDS */}
                {(session.lifecycleStatus === 'draft' || session.lifecycleStatus === 'lobbyOpen') && (
                   <div className="bg-white rounded-[24px] shadow-sm border border-[#D9E2F0] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3366FF] mb-6"></div>
                      <h3 className="text-2xl font-black text-[#172033] mb-3">{t.states?.[session.lifecycleStatus] || session.lifecycleStatus}</h3>
                      <p className="text-[#53627A] font-medium">{t.msgLobby}</p>
                   </div>
                )}

                {session.lifecycleStatus === 'ended' && (
                   <div className="bg-white rounded-[24px] shadow-sm border border-[#D9E2F0] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                      <CheckCircle2 className="w-16 h-16 text-[#7A89A3] mb-6 mx-auto" />
                      <h3 className="text-2xl font-black text-[#172033] mb-3">{t.states?.ended || 'Ended'}</h3>
                      <p className="text-[#53627A] font-medium">{t.sessionEndedMsg}</p>
                   </div>
                )}

                {/* SCORING WORKSPACE */}
                {(session.lifecycleStatus === 'inProgress' || session.lifecycleStatus === 'debrief') && (
                  <div className="bg-white rounded-[24px] shadow-sm border border-[#D9E2F0] overflow-hidden">
                    
                    <div className={`p-8 border-b text-center ${activeFeatState?.status === 'discussion' ? 'bg-[#FEF3C7] border-[#FDE68A]' : 'bg-[#F8FAFF] border-[#D9E2F0]'}`}>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border ${activeFeatState?.status === 'discussion' ? 'bg-white text-[#D97706] border-[#FDE68A]' : 'bg-white text-[#3366FF] border-[#D9E2F0]'}`}>
                        {t.featStatuses?.[activeFeatState?.status] || t.featStatuses?.notStarted || 'Not started'}
                      </div>
                      <h2 className="text-3xl font-black text-[#172033] mb-3 tracking-tight">{activeFeatureTitle}</h2>
                      <p className="text-[#53627A] max-w-2xl mx-auto leading-relaxed">{activeFeatureData ? (lang === 'en' ? activeFeatureData.desc_en : activeFeatureData.desc_bg) : ''}</p>
                      
                      {activeFeatureData && (lang === 'en' ? activeFeatureData.details_en : activeFeatureData.details_bg) && (
                         <div className="mt-4 max-w-3xl mx-auto">
                            <button onClick={() => setShowFeatureDetails(!showFeatureDetails)} className="text-xs font-bold text-[#3366FF] hover:text-[#254EDBE6] uppercase tracking-wider flex items-center justify-center mx-auto transition-colors">
                               {showFeatureDetails ? t.btnHideDetails : t.btnShowDetails}
                               {showFeatureDetails ? <ChevronDown className="w-4 h-4 ml-1 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 ml-1 transition-transform" />}
                            </button>
                            {showFeatureDetails && (
                               <div className="mt-4 p-5 bg-white border border-[#D9E2F0] rounded-2xl text-sm text-[#53627A] text-left shadow-sm whitespace-pre-wrap leading-relaxed">
                                  {lang === 'en' ? activeFeatureData.details_en : activeFeatureData.details_bg}
                               </div>
                            )}
                         </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-10 bg-white">
                      
                      {activeFeatState?.status === 'notStarted' && (
                         <div className="text-center py-12">
                           <PlayCircle className="w-12 h-12 text-[#D9E2F0] mx-auto mb-4" />
                           <p className="text-[#53627A] font-medium">{t.msgNotStarted}</p>
                         </div>
                      )}

                      {activeFeatState?.status === 'discussion' && (
                        <div className="max-w-3xl mx-auto mb-10 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-6 text-center shadow-sm">
                          <MessageSquare className="w-8 h-8 text-[#D97706] mx-auto mb-3" />
                          <h3 className="text-lg font-bold text-[#92400E]">{t.msgDiscussion}</h3>
                        </div>
                      )}

                      {activeFeatState?.status !== 'notStarted' && (!areResultsRevealed || activeFeatState?.status === 'reScoreOpen') && activeFeatures.length > 0 && (
                        <div className="max-w-4xl mx-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderPokerRow('bv', t.colBV)}
                            {renderPokerRow('tc', t.colTC)}
                            {renderPokerRow('rr', t.colRR)}
                            {renderPokerRow('js', t.colJS)}
                          </div>
                          
                          <div className="mt-8 text-center border-t border-[#D9E2F0] pt-8">
                            <button 
                              onClick={submitFeatureScores}
                              disabled={isVotingLocked || !draftScores.bv || !draftScores.tc || !draftScores.rr || !draftScores.js || accessMode === 'participantPreview'}
                              className="bg-[#3366FF] hover:bg-[#254EDBE6] disabled:bg-[#D9E2F0] disabled:text-[#A0ABBF] text-white font-bold py-4 px-10 rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
                            >
                              {activeFeatState?.status === 'reScoreOpen' ? t.btnSubmitRescores : t.btnSubmitScores}
                            </button>
                            {isVotingLocked && <p className="mt-5 text-xs font-bold text-[#EF4444] uppercase tracking-wider flex items-center justify-center"><Lock className="w-4 h-4 mr-1.5" /> {t.voteLockedMsg}</p>}
                            {hasSubmittedActive && !isVotingLocked && <p className="mt-5 text-xs font-bold text-[#12B981] uppercase tracking-wider flex items-center justify-center"><CheckCircle2 className="w-4 h-4 mr-1.5" /> {t.voteSubmitted}</p>}
                          </div>
                        </div>
                      )}

                      {areResultsRevealed && activeFeatState?.status !== 'reScoreOpen' && (
                        <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
                          <div className="bg-white rounded-[18px] shadow-sm border border-[#D9E2F0] overflow-hidden">
                            <div className="grid grid-cols-4 bg-[#F8FAFF] text-[10px] font-bold text-[#7A89A3] uppercase text-center border-b border-[#D9E2F0] divide-x divide-[#D9E2F0]">
                              <div className="p-3">{t.colBV}</div><div className="p-3">{t.colTC}</div><div className="p-3">{t.colRR}</div><div className="p-3 bg-[#FEF3C7]/30 text-[#D97706]">{t.colJS}</div>
                            </div>
                            
                            <div className="grid grid-cols-4 text-center divide-x divide-[#F4F7FC] border-b border-[#F4F7FC]">
                              <div className="p-5"><p className="text-[10px] text-[#7A89A3] uppercase mb-1 font-bold">{t.yourResultPrefix}</p><p className="text-3xl font-black text-[#3366FF]">{myVoteState?.bv || '-'}</p></div>
                              <div className="p-5"><p className="text-[10px] text-[#7A89A3] uppercase mb-1 font-bold">{t.yourResultPrefix}</p><p className="text-3xl font-black text-[#3366FF]">{myVoteState?.tc || '-'}</p></div>
                              <div className="p-5"><p className="text-[10px] text-[#7A89A3] uppercase mb-1 font-bold">{t.yourResultPrefix}</p><p className="text-3xl font-black text-[#3366FF]">{myVoteState?.rr || '-'}</p></div>
                              <div className="p-5"><p className="text-[10px] text-[#D97706] uppercase mb-1 font-bold">{t.yourResultPrefix}</p><p className="text-3xl font-black text-[#D97706]">{myVoteState?.js || '-'}</p></div>
                            </div>
                            
                            <div className="grid grid-cols-4 text-center divide-x divide-[#D9E2F0] border-b border-[#D9E2F0] bg-[#F8FAFF]">
                              <div className="p-4"><p className="text-[10px] text-[#7A89A3] uppercase mb-1">{t.groupAvgPrefix}</p><p className="text-lg font-bold text-[#53627A]">{activeItemStats.bv.avg.toFixed(1)}</p></div>
                              <div className="p-4"><p className="text-[10px] text-[#7A89A3] uppercase mb-1">{t.groupAvgPrefix}</p><p className="text-lg font-bold text-[#53627A]">{activeItemStats.tc.avg.toFixed(1)}</p></div>
                              <div className="p-4"><p className="text-[10px] text-[#7A89A3] uppercase mb-1">{t.groupAvgPrefix}</p><p className="text-lg font-bold text-[#53627A]">{activeItemStats.rr.avg.toFixed(1)}</p></div>
                              <div className="p-4"><p className="text-[10px] text-[#7A89A3] uppercase mb-1">{t.groupAvgPrefix}</p><p className="text-lg font-bold text-[#53627A]">{activeItemStats.js.avg.toFixed(1)}</p></div>
                            </div>

                            <div className="grid grid-cols-4 text-center divide-x divide-[#F4F7FC]">
                              <div className="p-3"><p className="text-[9px] text-[#A0ABBF] uppercase mb-0.5">{t.spreadPrefix} BV</p><p className={`text-sm font-bold ${activeItemStats.bv.spread > 5 ? 'text-[#EF4444]' : 'text-[#7A89A3]'}`}>{activeItemStats.bv.spread}</p></div>
                              <div className="p-3"><p className="text-[9px] text-[#A0ABBF] uppercase mb-0.5">{t.spreadPrefix} TC</p><p className={`text-sm font-bold ${activeItemStats.tc.spread > 5 ? 'text-[#EF4444]' : 'text-[#7A89A3]'}`}>{activeItemStats.tc.spread}</p></div>
                              <div className="p-3"><p className="text-[9px] text-[#A0ABBF] uppercase mb-0.5">{t.spreadPrefix} RR</p><p className={`text-sm font-bold ${activeItemStats.rr.spread > 5 ? 'text-[#EF4444]' : 'text-[#7A89A3]'}`}>{activeItemStats.rr.spread}</p></div>
                              <div className="p-3"><p className="text-[9px] text-[#A0ABBF] uppercase mb-0.5">{t.spreadPrefix} JS</p><p className={`text-sm font-bold ${activeItemStats.js.spread > 5 ? 'text-[#EF4444]' : 'text-[#7A89A3]'}`}>{activeItemStats.js.spread}</p></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6">
                             <div className="bg-[#172033] text-white p-6 rounded-[18px] text-center shadow-lg">
                                <p className="text-[#8EA2D5] text-[10px] font-bold uppercase tracking-wider mb-3">{t.yourResultPrefix} {t.colCoD} & {t.colWSJF}</p>
                                <div className="flex justify-center items-end space-x-6">
                                   <div><p className="text-3xl font-mono text-[#F5F8FF]">{calcRowWSJF(myVoteState).cod}</p><p className="text-[10px] text-[#8EA2D5] uppercase mt-1">CoD</p></div>
                                   <div className="text-[#21C55D]"><p className="text-4xl font-mono font-black">{calcRowWSJF(myVoteState).wsjf}</p><p className="text-[10px] text-[#12B981] uppercase mt-1">WSJF</p></div>
                                </div>
                             </div>
                             <div className="bg-white border border-[#D9E2F0] p-6 rounded-[18px] text-center shadow-sm">
                                <p className="text-[#7A89A3] text-[10px] font-bold uppercase tracking-wider mb-3">{t.groupAvgPrefix} {t.colCoD} & {t.colWSJF}</p>
                                <div className="flex justify-center items-end space-x-6">
                                   <div><p className="text-3xl font-mono text-[#53627A]">{activeCodAvg.toFixed(1)}</p><p className="text-[10px] text-[#A0ABBF] uppercase mt-1">CoD</p></div>
                                   <div className="text-[#3366FF]"><p className="text-4xl font-mono font-black">{activeWsjfAvg}</p><p className="text-[10px] text-[#8EA2D5] uppercase mt-1">WSJF</p></div>
                                </div>
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TRAINER ACCESS LINK (AVAILABLE ANYTIME) */}
            {(!currentParticipantId && accessMode === 'participant') && (
               <div className="text-center pt-8 pb-4">
                  <button onClick={() => setAccessMode('trainerLocked')} className="text-xs font-bold text-[#A0ABBF] hover:text-[#5B5FEF] uppercase tracking-wider transition-colors flex items-center justify-center mx-auto">
                     <Shield className="w-3.5 h-3.5 mr-1.5"/> {t.trainerAccessLink}
                  </button>
               </div>
            )}

          </main>
        )}

        {/* =====================================================================
            TRAINER UNLOCKED VIEW
        ====================================================================== */}
        {(accessMode === 'trainerUnlocked' && session) && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-500">
            
            {/* SUMMARY BAR */}
            <div className="bg-white rounded-xl shadow-sm border border-[#D9E2F0] p-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 sticky top-[76px] z-40">
               <div className="flex items-center gap-4 text-xs font-bold text-[#53627A] flex-wrap">
                  <div className="flex items-center bg-[#F8FAFF] px-3 py-1.5 rounded-lg border border-[#D9E2F0]">
                    <span className="text-[#7A89A3] uppercase tracking-wider mr-2 text-[10px]">ID:</span>
                    <span className="font-mono text-[#172033]">{session.id}</span>
                  </div>
                  <div className="flex items-center bg-[#F8FAFF] px-3 py-1.5 rounded-lg border border-[#D9E2F0]">
                    <span className="text-[#7A89A3] uppercase tracking-wider mr-2 text-[10px]">State:</span>
                    <span className="text-[#3366FF] uppercase tracking-wider">{t.states?.[session.lifecycleStatus] || session.lifecycleStatus}</span>
                  </div>
                  <div className="flex items-center bg-[#F8FAFF] px-3 py-1.5 rounded-lg border border-[#D9E2F0]">
                    <Users className="w-3.5 h-3.5 text-[#7A89A3] mr-1.5"/> 
                    <span className="text-[#172033]">{joinedParticipants.length}</span>
                  </div>
                  {!db && (
                    <div className="flex items-center bg-[#FEF2F2] text-[#EF4444] px-2 py-1 rounded text-[10px] uppercase border border-[#FECACA] font-bold">
                      Firebase Offline
                    </div>
                  )}
               </div>

               <div className="flex items-center gap-3">
                 <button onClick={() => primaryAction.act()} className={`px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center ${primaryAction.bg}`}>
                    {primaryAction.icon} {primaryAction.label}
                 </button>
                 <div className="w-px h-4 bg-[#D9E2F0] mx-1"></div>
                 <button onClick={() => setShowShareModal(true)} className="text-[10px] font-bold text-[#3366FF] bg-[#EEF4FF] border border-[#C6D4EA] px-3 py-1.5 rounded-lg hover:bg-[#D9E2F0] uppercase tracking-wider flex items-center transition-colors">
                    <Share2 className="w-3.5 h-3.5 mr-1.5"/> {t.btnShare}
                 </button>
                 <button onClick={() => setAccessMode('participantPreview')} className="text-[10px] font-bold text-[#5B5FEF] uppercase tracking-wider hover:underline flex items-center ml-2">
                    <Eye className="w-3.5 h-3.5 mr-1.5"/> {t.previewPart}
                 </button>
                 <button onClick={() => setAccessMode('trainerSessionSelect')} className="text-[10px] font-bold text-[#7A89A3] hover:text-[#172033] uppercase tracking-wider flex items-center ml-2">
                    <Settings className="w-3.5 h-3.5 mr-1.5"/> Session Menu
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
               
               {/* 70% MAIN LEFT */}
               <div className="lg:col-span-8 flex flex-col gap-5">
                  
                  {/* Active Feature Card */}
                  <div className="bg-white rounded-[20px] shadow-sm border border-[#D9E2F0] overflow-hidden flex flex-col">
                    <div className="p-6 bg-gradient-to-r from-[#F8FAFF] to-white border-b border-[#D9E2F0] flex justify-between items-center gap-4">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1.5">
                           <h2 className="text-xl font-black text-[#172033] tracking-tight">{activeFeatureTitle}</h2>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${activeFeatState?.status === 'completed' ? 'bg-[#F4F7FC] text-[#7A89A3] border-[#D9E2F0]' : 'bg-[#EEF4FF] text-[#3366FF] border-[#C6D4EA]'}`}>
                             {t.featStatuses?.[activeFeatState?.status] || t.featStatuses?.notStarted || 'Not started'}
                           </span>
                         </div>
                         <p className="text-xs text-[#53627A] truncate max-w-xl">{activeFeatureData ? (lang === 'en' ? activeFeatureData.desc_en : activeFeatureData.desc_bg) : ''}</p>
                         
                         {activeFeatureData && (lang === 'en' ? activeFeatureData.details_en : activeFeatureData.details_bg) && (
                            <div className="mt-3">
                               <button onClick={() => setShowFeatureDetails(!showFeatureDetails)} className="text-[10px] font-bold text-[#3366FF] hover:underline uppercase tracking-wider flex items-center transition-colors">
                                  {showFeatureDetails ? t.btnHideDetails : t.btnShowDetails}
                                  {showFeatureDetails ? <ChevronDown className="w-3 h-3 ml-1 rotate-180 transition-transform" /> : <ChevronDown className="w-3 h-3 ml-1 transition-transform" />}
                               </button>
                               {showFeatureDetails && (
                                  <div className="mt-3 p-4 bg-white border border-[#D9E2F0] rounded-lg text-xs text-[#53627A] shadow-sm whitespace-pre-wrap leading-relaxed">
                                     {lang === 'en' ? activeFeatureData.details_en : activeFeatureData.details_bg}
                                  </div>
                               )}
                            </div>
                         )}
                       </div>
                    </div>

                    {areResultsRevealed && (
                       <div className="grid grid-cols-6 border-b border-[#D9E2F0] divide-x divide-[#F4F7FC] bg-[#F8FAFF] text-center">
                          <div className="py-2.5"><p className="text-[9px] uppercase text-[#7A89A3] font-bold tracking-wider mb-0.5">{t.colBV}</p><p className="text-sm font-bold text-[#172033]">{activeItemStats.bv.avg.toFixed(1)}</p></div>
                          <div className="py-2.5"><p className="text-[9px] uppercase text-[#7A89A3] font-bold tracking-wider mb-0.5">{t.colTC}</p><p className="text-sm font-bold text-[#172033]">{activeItemStats.tc.avg.toFixed(1)}</p></div>
                          <div className="py-2.5"><p className="text-[9px] uppercase text-[#7A89A3] font-bold tracking-wider mb-0.5">{t.colRR}</p><p className="text-sm font-bold text-[#172033]">{activeItemStats.rr.avg.toFixed(1)}</p></div>
                          <div className="py-2.5"><p className="text-[9px] uppercase text-[#7A89A3] font-bold tracking-wider mb-0.5">{t.colJS}</p><p className="text-sm font-bold text-[#D97706]">{activeItemStats.js.avg.toFixed(1)}</p></div>
                          <div className="py-2.5 col-span-2 flex items-center justify-center gap-3 bg-white">
                             <div className="text-right"><p className="text-[9px] uppercase text-[#A0ABBF] font-bold tracking-wider mb-0.5">{t.highestSpreadCrit}</p><p className="text-[11px] font-bold text-[#172033] uppercase">{maxSpreadCrit}</p></div>
                             <div className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded border ${getConsensusColor(maxSpreadObj.val)}`}>{getConsensusLevel(maxSpreadObj.val)}</div>
                          </div>
                       </div>
                    )}

                    {/* Live Table */}
                    <div className="overflow-x-auto max-h-[400px]">
                       <table className="w-full text-sm text-left relative">
                         <thead className="text-[10px] text-[#7A89A3] uppercase bg-white sticky top-0 border-b border-[#D9E2F0] z-10 shadow-sm">
                           <tr>
                             <th className="px-5 py-3 font-bold">{t.participantRole}</th>
                             <th className="px-4 py-3 font-bold">{t.voteStatus}</th>
                             <th className="px-3 py-3 font-bold text-center w-16">{t.colBV}</th>
                             <th className="px-3 py-3 font-bold text-center w-16">{t.colTC}</th>
                             <th className="px-3 py-3 font-bold text-center w-16">{t.colRR}</th>
                             <th className="px-3 py-3 font-bold text-center w-16 bg-[#FEF3C7]/30 text-[#B45309]">{t.colJS}</th>
                             <th className="px-3 py-3 font-bold text-center w-20 bg-[#F8FAFF]">{t.colCoD}</th>
                             <th className="px-3 py-3 font-bold text-center w-20 bg-[#EEF4FF] text-[#1D4ED8]">{t.colWSJF}</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-[#F4F7FC]">
                           {joinedParticipants.map(p => {
                             const scoreData = getActiveScore(p.id, session.activeFeatureId);
                             const hasVoted = scoreData?.submitted;
                             const stats = calcRowWSJF(scoreData);
                             return (
                               <tr key={p.id} className="hover:bg-[#F8FAFF] transition-colors">
                                 <td className="px-5 py-2.5">
                                    <p className="font-bold text-[#172033] text-[13px]">{p.name}</p>
                                    <p className="text-[9px] text-[#7A89A3] uppercase tracking-wider mt-0.5">{t.roles?.[p.role] || p.role}</p>
                                 </td>
                                 <td className="px-4 py-2.5">
                                   {hasVoted ? 
                                     <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] uppercase tracking-wider border border-[#A7F3D0]"><CheckSquare className="w-3 h-3 mr-1"/> {t.partStatuses?.submitted || 'Submitted'}</span> : 
                                     <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-[#F4F7FC] text-[#7A89A3] uppercase tracking-wider border border-[#D9E2F0]">{t.partStatuses?.notStarted || 'Not started'}</span>}
                                 </td>
                                 <td className="px-3 py-2.5 text-center font-mono font-bold text-[#53627A]">{areResultsRevealed ? (hasVoted ? scoreData.bv : '-') : (hasVoted ? <span className="text-[10px] text-[#A0ABBF] uppercase font-sans font-medium">{t.hidden}</span> : '-')}</td>
                                 <td className="px-3 py-2.5 text-center font-mono font-bold text-[#53627A]">{areResultsRevealed ? (hasVoted ? scoreData.tc : '-') : (hasVoted ? <span className="text-[10px] text-[#A0ABBF] uppercase font-sans font-medium">{t.hidden}</span> : '-')}</td>
                                 <td className="px-3 py-2.5 text-center font-mono font-bold text-[#53627A]">{areResultsRevealed ? (hasVoted ? scoreData.rr : '-') : (hasVoted ? <span className="text-[10px] text-[#A0ABBF] uppercase font-sans font-medium">{t.hidden}</span> : '-')}</td>
                                 <td className="px-3 py-2.5 text-center font-mono font-bold text-[#D97706] bg-[#FEF3C7]/20">{areResultsRevealed ? (hasVoted ? scoreData.js : '-') : (hasVoted ? <span className="text-[10px] text-[#D97706] uppercase font-sans font-medium opacity-50">{t.hidden}</span> : '-')}</td>
                                 <td className="px-3 py-2.5 text-center font-mono font-bold text-[#172033] bg-[#F8FAFF]">{areResultsRevealed ? (hasVoted ? stats.cod : '-') : '-'}</td>
                                 <td className="px-3 py-2.5 text-center font-mono font-bold text-[#3366FF] bg-[#EEF4FF]/50">{areResultsRevealed ? (hasVoted ? stats.wsjf : '-') : '-'}</td>
                               </tr>
                             );
                           })}
                           {joinedParticipants.length === 0 && (
                              <tr><td colSpan="8" className="px-5 py-12 text-center text-[#7A89A3] text-sm font-medium">{t.noData}</td></tr>
                           )}
                         </tbody>
                       </table>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-white rounded-[18px] shadow-sm border border-[#D9E2F0] overflow-hidden">
                     <div className="flex border-b border-[#D9E2F0] bg-[#F8FAFF]">
                        <button onClick={() => setActiveTrainerTab('progress')} className={`flex-1 py-3 px-4 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTrainerTab === 'progress' ? 'text-[#3366FF] bg-white border-[#3366FF]' : 'text-[#7A89A3] hover:text-[#172033] border-transparent'}`}>
                           {t.featureProgressTitle}
                        </button>
                        <button onClick={() => setActiveTrainerTab('heatmap')} className={`flex-1 py-3 px-4 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTrainerTab === 'heatmap' ? 'text-[#3366FF] bg-white border-[#3366FF]' : 'text-[#7A89A3] hover:text-[#172033] border-transparent'}`}>
                           {t.heatmapTitle}
                        </button>
                        <button onClick={() => setActiveTrainerTab('cutline')} className={`flex-1 py-3 px-4 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTrainerTab === 'cutline' ? 'text-[#3366FF] bg-white border-[#3366FF]' : 'text-[#7A89A3] hover:text-[#172033] border-transparent'}`}>
                           {t.releaseSimTitle}
                        </button>
                        <button onClick={() => setActiveTrainerTab('timeline')} className={`flex-1 py-3 px-4 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTrainerTab === 'timeline' ? 'text-[#3366FF] bg-white border-[#3366FF]' : 'text-[#7A89A3] hover:text-[#172033] border-transparent'}`}>
                           {t.timelineTitle}
                        </button>
                     </div>
                     
                     <div className="p-0 bg-white max-h-[350px] overflow-y-auto">
                        {activeTrainerTab === 'progress' && (
                          <table className="w-full text-sm text-left">
                            <thead className="text-[9px] text-[#7A89A3] uppercase bg-[#F8FAFF] sticky top-0 border-b border-[#D9E2F0]">
                              <tr>
                                 <th className="px-5 py-2.5 font-bold">{t.colFeature}</th>
                                 <th className="px-4 py-2.5 font-bold text-center">{t.colSubmittedCnt}</th>
                                 <th className="px-4 py-2.5 font-bold text-center">{t.colRevealed}</th>
                                 <th className="px-5 py-2.5 font-bold text-right">{t.colAvgWsjf}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F4F7FC]">
                              {activeFeatures.map(item => {
                                const fState = featureRoundState[item.id] || { status: 'notStarted', resultsRevealed: false };
                                const submittedCnt = joinedParticipants.filter(p => participantScores[p.id]?.[item.id]?.initial?.submitted).length;
                                const jsAvg = calcCriterionStats(item.id, 'js').avg;
                                const codAvg = calcCriterionStats(item.id, 'bv').avg + calcCriterionStats(item.id, 'tc').avg + calcCriterionStats(item.id, 'rr').avg;
                                const wsjf = jsAvg > 0 ? (codAvg / jsAvg).toFixed(2) : '-';
                                return (
                                  <tr key={item.id} className={`hover:bg-[#F8FAFF] ${item.id === session.activeFeatureId ? 'bg-[#EEF4FF]/40' : ''}`}>
                                    <td className="px-5 py-2.5 font-medium text-[#172033] text-[13px] flex items-center">
                                      {item.id === session.activeFeatureId && <div className="w-1.5 h-1.5 rounded-full bg-[#3366FF] mr-2"></div>}
                                      {lang === 'en' ? item.title_en : item.title_bg}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-[#53627A] font-mono text-xs">{submittedCnt} / {joinedParticipants.length}</td>
                                    <td className="px-4 py-2.5 text-center">
                                      {fState.resultsRevealed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#12B981] mx-auto" /> : <span className="text-[#D9E2F0]">-</span>}
                                    </td>
                                    <td className="px-5 py-2.5 text-right font-mono font-bold text-[#3366FF]">{submittedCnt > 0 ? wsjf : '-'}</td>
                                  </tr>
                                );
                              })}
                              {activeFeatures.length === 0 && <tr><td colSpan="4" className="text-center p-6 text-sm text-[#7A89A3]">{t.emptyScenario}</td></tr>}
                            </tbody>
                          </table>
                        )}

                        {activeTrainerTab === 'heatmap' && (
                          <div className="p-4">
                            <div className="flex flex-wrap gap-4 mb-4 text-[9px] uppercase tracking-wider font-bold px-2">
                              <span className="flex items-center text-[#059669]"><span className="w-2.5 h-2.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] mr-1.5"></span> {t.lowDis} (0-2)</span>
                              <span className="flex items-center text-[#D97706]"><span className="w-2.5 h-2.5 rounded bg-[#FEF3C7] border border-[#FDE68A] mr-1.5"></span> {t.medDis} (3-5)</span>
                              <span className="flex items-center text-[#EF4444]"><span className="w-2.5 h-2.5 rounded bg-[#FEF2F2] border border-[#FECACA] mr-1.5"></span> {t.highDis} (6+)</span>
                            </div>
                            <div className="overflow-x-auto border border-[#D9E2F0] rounded-lg">
                              <table className="w-full text-sm text-left">
                                <thead className="text-[9px] text-[#7A89A3] uppercase bg-[#F8FAFF] border-b border-[#D9E2F0]">
                                  <tr>
                                    <th className="px-4 py-2 font-bold">{t.colFeature}</th>
                                    {criteriaKeys.map(k => <th key={k} className="px-2 py-2 text-center w-16">{k.toUpperCase()}</th>)}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F4F7FC]">
                                  {activeFeatures.map(item => (
                                    <tr key={item.id} className={`hover:bg-[#F8FAFF] ${item.id === session.activeFeatureId ? 'bg-[#EEF4FF]/40' : ''}`}>
                                      <td className="px-4 py-1.5 font-medium text-[#172033] text-xs truncate max-w-[200px]">
                                        {item.id === session.activeFeatureId && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3366FF] mr-2"></span>}
                                        {lang==='en'?item.title_en:item.title_bg}
                                      </td>
                                      {criteriaKeys.map(k => {
                                        const validVotes = joinedParticipants.map(p => getActiveScore(p.id, item.id)?.[k]).filter(v => v != null);
                                        const spread = validVotes.length ? Math.max(...validVotes) - Math.min(...validVotes) : 0;
                                        let bgClass = "bg-[#F8FAFF] text-[#A0ABBF]";
                                        if (validVotes.length > 0) {
                                           if (spread <= 2) bgClass = "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-bold";
                                           else if (spread <= 5) bgClass = "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] font-bold";
                                           else bgClass = "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] font-bold";
                                        }
                                        return (
                                          <td key={k} className="px-2 py-1.5 text-center">
                                            <span className={`inline-flex items-center justify-center w-full h-5 rounded text-[10px] ${bgClass}`}>{validVotes.length ? spread : '-'}</span>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                  {activeFeatures.length === 0 && <tr><td colSpan="5" className="text-center p-4 text-sm text-[#7A89A3]">{t.emptyScenario}</td></tr>}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {activeTrainerTab === 'cutline' && (
                          <div className="p-6">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-[#F8FAFF] p-4 rounded-[14px] border border-[#D9E2F0] text-center">
                                   <p className="text-[10px] text-[#7A89A3] uppercase font-bold tracking-wider mb-1">{t.usedCapacity}</p>
                                   <p className="text-3xl font-bold text-[#172033] font-mono">{getCalculatedBacklog().filter(i=>i.included).reduce((s,i)=>s+(Number(i.js)||0),0).toFixed(1)}</p>
                                </div>
                                <div className="bg-[#EEF4FF] p-4 rounded-[14px] border border-[#C6D4EA] text-center">
                                   <p className="text-[10px] text-[#3366FF] uppercase font-bold tracking-wider mb-1">{t.remCapacity}</p>
                                   <p className="text-3xl font-bold text-[#3366FF] font-mono">{(session.capacity - getCalculatedBacklog().filter(i=>i.included).reduce((s,i)=>s+(Number(i.js)||0),0)).toFixed(1)}</p>
                                </div>
                                <div className="bg-[#ECFDF5] p-4 rounded-[14px] border border-[#A7F3D0] text-center">
                                   <p className="text-[10px] text-[#059669] uppercase font-bold tracking-wider mb-1">{t.includedItems}</p>
                                   <p className="text-3xl font-bold text-[#059669] font-mono">{getCalculatedBacklog().filter(i=>i.included).length}</p>
                                </div>
                                <div className="bg-[#FEF2F2] p-4 rounded-[14px] border border-[#FECACA] text-center">
                                   <p className="text-[10px] text-[#EF4444] uppercase font-bold tracking-wider mb-1">{t.belowItems}</p>
                                   <p className="text-3xl font-bold text-[#EF4444] font-mono">{getCalculatedBacklog().length - getCalculatedBacklog().filter(i=>i.included).length}</p>
                                </div>
                             </div>
                             <div className="space-y-1 max-h-[150px] overflow-y-auto pr-2">
                               {getCalculatedBacklog().map((item, idx) => (
                                  <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-[#F4F7FC] last:border-0">
                                     <span className="flex items-center text-[#53627A]">
                                        <span className="w-5 text-right mr-3 text-[#A0ABBF] font-mono">{idx + 1}.</span> 
                                        <span className={`font-medium ${item.included ? 'text-[#172033]' : 'text-[#A0ABBF]'}`}>{lang==='en'?item.title_en:item.title_bg}</span>
                                     </span>
                                     <span className="font-mono text-[#7A89A3]">JS: {item.js.toFixed(1)} <span className="mx-2 border-l border-[#D9E2F0]"></span> WSJF: {item.wsjf}</span>
                                  </div>
                               ))}
                             </div>
                          </div>
                        )}

                        {activeTrainerTab === 'timeline' && (
                          <div className="p-4">
                             {sessionTimeline.length === 0 ? (
                                <p className="text-center text-xs text-[#A0ABBF] py-6">{t.noData}</p>
                             ) : (
                                <div className="space-y-3">
                                   {sessionTimeline.map(ev => (
                                      <div key={ev.id} className="flex items-start text-xs border-b border-[#F4F7FC] pb-2 last:border-0">
                                         <span className="text-[#A0ABBF] font-mono w-16 shrink-0">{ev.timestamp}</span>
                                         <div className="flex-1">
                                            <span className="text-[#3366FF] font-bold mr-2 uppercase text-[9px] bg-[#EEF4FF] px-1.5 py-0.5 rounded">{ev.type}</span>
                                            <span className="text-[#53627A]">{ev.desc}</span>
                                            {ev.featureId && <span className="ml-2 text-[#A0ABBF]">({activeFeatures.find(i=>i.id===ev.featureId)?.title_en || 'Feature'})</span>}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>
                        )}
                     </div>
                  </div>

               </div>
               
               {/* 30% RIGHT SUPPORT RAIL */}
               <div className="lg:col-span-4 flex flex-col gap-5">
                  
                  {/* Workshop Controls */}
                  <div className="bg-white rounded-[18px] shadow-sm border border-[#D9E2F0] p-5">
                     <div className="flex justify-between items-center bg-[#F8FAFF] p-2 rounded-lg border border-[#D9E2F0] mb-4">
                        <button onClick={() => changeFeature(-1)} className="p-1.5 text-[#7A89A3] hover:text-[#172033] hover:bg-white rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-xs font-bold text-[#172033] text-center w-full block">Nav Feature</span>
                        <button onClick={() => changeFeature(1)} className="p-1.5 text-[#7A89A3] hover:text-[#172033] hover:bg-white rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
                     </div>

                     <div className="mb-4">
                       <button onClick={() => primaryAction.act()} className={`w-full py-3 text-xs font-bold text-white uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center ${primaryAction.bg}`}>
                         {primaryAction.icon} {primaryAction.label}
                       </button>
                     </div>

                     <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => updateFeatureStatus('scoringOpen')} className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${activeFeatState?.status === 'scoringOpen' ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-white text-[#53627A] border-[#D9E2F0] hover:border-[#3366FF]'}`}>Score</button>
                        <button onClick={() => updateFeatureStatus('votingLocked')} className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${activeFeatState?.status === 'votingLocked' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' : 'bg-white text-[#53627A] border-[#D9E2F0] hover:border-[#3366FF]'}`}>Lock</button>
                        <button onClick={() => updateFeatureStatus('resultsRevealed')} className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${activeFeatState?.status === 'resultsRevealed' ? 'bg-[#F3E8FF] text-[#6D28D9] border-[#E9D5FF]' : 'bg-white text-[#53627A] border-[#D9E2F0] hover:border-[#3366FF]'}`}>Reveal</button>
                        <button onClick={() => updateFeatureStatus('discussion')} className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${activeFeatState?.status === 'discussion' ? 'bg-[#EEF4FF] text-[#1D4ED8] border-[#BFDBFE]' : 'bg-white text-[#53627A] border-[#D9E2F0] hover:border-[#3366FF]'}`}>Discuss</button>
                     </div>

                     <div className="flex gap-2 border-t border-[#F4F7FC] pt-4">
                       <button onClick={() => updateFeatureStatus('reScoreOpen')} className="flex-1 py-2 text-[10px] font-bold text-[#D97706] uppercase tracking-wider bg-white border border-[#FDE68A] hover:bg-[#FEF3C7] rounded-lg transition-colors">Re-score</button>
                       <button onClick={() => setShowResetConfirm(true)} className="flex-1 py-2 text-[10px] font-bold text-[#EF4444] uppercase tracking-wider bg-white border border-[#FECACA] hover:bg-[#FEF2F2] rounded-lg transition-colors">Reset</button>
                     </div>
                  </div>

                  {/* Prompts */}
                  <div className="bg-white rounded-[18px] shadow-sm border border-[#D9E2F0] flex flex-col overflow-hidden max-h-[400px]">
                    <div className="p-4 bg-[#F8FAFF] border-b border-[#D9E2F0] flex justify-between items-center sticky top-0 z-10">
                      <h3 className="text-[11px] font-bold text-[#172033] uppercase tracking-wider flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-[#F59E0B]" /> Prompts</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                      {aiPrompts.length === 0 ? (
                          <div className="text-center text-[#A0ABBF] py-8 text-xs">No active prompts right now.</div>
                      ) : (
                        aiPrompts.map(prompt => {
                           let borderClass = 'border-[#C6D4EA] border-l-[#3366FF]';
                           let badgeClass = 'bg-[#EEF4FF] text-[#3366FF]';
                           if (prompt.level === 'Critical') { borderClass = 'border-[#FECACA] border-l-[#EF4444]'; badgeClass = 'bg-[#FEF2F2] text-[#EF4444]'; }
                           if (prompt.level === 'Warning') { borderClass = 'border-[#FDE68A] border-l-[#F59E0B]'; badgeClass = 'bg-[#FEF3C7] text-[#D97706]'; }
                           if (prompt.level === 'Info') { borderClass = 'border-[#A7F3D0] border-l-[#10B981]'; badgeClass = 'bg-[#ECFDF5] text-[#059669]'; }
                           
                           return (
                             <div key={prompt.id} className={`p-3.5 rounded-xl border border-l-4 shadow-sm bg-white ${borderClass}`}>
                               <div className="flex justify-between items-start mb-2">
                                   <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${badgeClass}`}>{prompt.category}</span>
                               </div>
                               <h4 className="font-bold text-[#172033] text-sm mb-1.5 leading-tight">{prompt.title}</h4>
                               <p className="text-xs text-[#53627A] mb-3 leading-relaxed">{prompt.message}</p>
                               <div className="bg-[#F8FAFF] p-2.5 rounded-lg border border-[#D9E2F0] text-xs font-medium text-[#172033] mb-2 leading-relaxed">
                                   <MessageSquare className="w-3.5 h-3.5 inline-block mr-1.5 text-[#3366FF] -mt-0.5"/> {prompt.question}
                               </div>
                             </div>
                           );
                        })
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-[18px] shadow-sm border border-[#D9E2F0] overflow-hidden flex flex-col">
                    <div className="p-3 bg-[#F8FAFF] border-b border-[#D9E2F0] font-bold text-[#53627A] flex items-center text-[10px] uppercase tracking-wider">
                      <Edit3 className="w-3 h-3 mr-1.5 text-[#7A89A3]" /> {t.notesTitle}
                    </div>
                    <textarea 
                      className="w-full h-[120px] p-4 outline-none resize-y text-xs text-[#172033] placeholder-[#A0ABBF] leading-relaxed"
                      placeholder={t.notesPlaceholder}
                      value={trainerNotes[session.activeFeatureId] || ''}
                      onChange={e => setTrainerNotes(prev => ({...prev, [session.activeFeatureId]: e.target.value}))}
                    />
                  </div>
               </div>
            </div>

            {/* =====================================================================
                FULL WIDTH SESSION SETUP & SCENARIOS AT THE BOTTOM
            ====================================================================== */}
            <div className="bg-white rounded-[18px] shadow-sm border border-[#D9E2F0] overflow-hidden mt-8">
               <button onClick={() => setSetupExpanded(!setupExpanded)} className="w-full p-5 bg-[#F8FAFF] flex justify-between items-center text-[#53627A] hover:bg-[#EEF4FF] transition-colors border-b border-[#D9E2F0]">
                 <span className="text-[12px] font-black uppercase tracking-wider flex items-center text-[#172033]"><Settings className="w-4 h-4 mr-2 text-[#3366FF]"/> {t.trainerSetupTitle}</span>
                 {setupExpanded ? <ChevronDown className="w-5 h-5 text-[#7A89A3]"/> : <ChevronRight className="w-5 h-5 text-[#7A89A3]"/>}
               </button>

               {setupExpanded && (
                 <div className="flex flex-col md:flex-row min-h-[500px]">
                   
                   {/* TABS SIDEBAR */}
                   <div className="w-full md:w-64 bg-[#F8FAFF] border-r border-[#D9E2F0] p-4 space-y-2 flex-shrink-0">
                     <button onClick={() => setSetupTab('scenario')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center ${setupTab === 'scenario' ? 'bg-[#3366FF] text-white shadow-sm' : 'text-[#53627A] hover:bg-[#EEF4FF]'}`}><FileText className="w-4 h-4 mr-2"/> {t.tabScenario}</button>
                     <button onClick={() => setSetupTab('roles')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center ${setupTab === 'roles' ? 'bg-[#3366FF] text-white shadow-sm' : 'text-[#53627A] hover:bg-[#EEF4FF]'}`}><Users className="w-4 h-4 mr-2"/> {t.tabRoles}</button>
                     <button onClick={() => setSetupTab('settings')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center ${setupTab === 'settings' ? 'bg-[#3366FF] text-white shadow-sm' : 'text-[#53627A] hover:bg-[#EEF4FF]'}`}><Settings className="w-4 h-4 mr-2"/> {t.tabSettings}</button>
                   </div>

                   {/* TAB CONTENT */}
                   <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto">
                     
                     {/* SCENARIO TAB */}
                     {setupTab === 'scenario' && (
                        <div className="max-w-4xl">
                           <h3 className="text-lg font-black text-[#172033] mb-6">{t.tabScenario}</h3>
                           
                           {/* Scenario Selector */}
                           <div className="mb-8 bg-[#F8FAFF] p-5 rounded-xl border border-[#D9E2F0]">
                              <label className="block text-[10px] font-bold text-[#7A89A3] uppercase tracking-wider mb-2">{t.scenarioSelector}</label>
                              <div className="flex items-center gap-3 mb-4">
                                <select 
                                   value={activeScenarioId} 
                                   onChange={e => requestScenarioChange(e.target.value)} 
                                   className="flex-1 p-3 bg-white border border-[#D9E2F0] rounded-xl text-sm font-bold text-[#172033] outline-none focus:border-[#3366FF]"
                                >
                                   <optgroup label="Built-in Scenarios">
                                      {defaultTemplates.map(s => <option key={s.id} value={s.id}>{lang==='en'?s.nameEn:s.nameBg}</option>)}
                                   </optgroup>
                                   {customScenarios.length > 0 && (
                                     <optgroup label="Custom Scenarios">
                                        {customScenarios.map(s => <option key={s.id} value={s.id}>{lang==='en'?s.nameEn:s.nameBg}</option>)}
                                     </optgroup>
                                   )}
                                </select>
                                <button onClick={createBlankScenario} className="px-4 py-3 bg-[#EEF4FF] text-[#3366FF] border border-[#C6D4EA] hover:bg-[#D9E2F0] rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center whitespace-nowrap"><Plus className="w-4 h-4 mr-1.5"/> Create Blank Scenario</button>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                 {activeScenario.isBuiltIn ? (
                                    <span className="px-3 py-1.5 bg-[#EEF4FF] text-[#3366FF] text-xs font-bold uppercase rounded border border-[#C6D4EA]">{t.scenarioBuiltIn}</span>
                                 ) : (
                                    <span className="px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] text-xs font-bold uppercase rounded border border-[#FDE68A]">{t.scenarioCustom}</span>
                                 )}
                                 <button onClick={duplicateToCustom} className="px-4 py-1.5 bg-white text-[#3366FF] border border-[#C6D4EA] hover:bg-[#EEF4FF] rounded text-xs font-bold uppercase transition-colors flex items-center"><CopyIcon className="w-3.5 h-3.5 mr-1.5"/> {t.btnDuplicate}</button>
                                 {!activeScenario.isBuiltIn && (
                                    <button onClick={deleteCustomScenario} className="px-4 py-1.5 bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] hover:bg-[#FEE2E2] rounded text-xs font-bold uppercase transition-colors flex items-center ml-auto"><Trash2 className="w-3.5 h-3.5 mr-1.5"/> {t.btnDeleteScen}</button>
                                 )}
                              </div>
                           </div>

                           {/* Custom Scenario Builder Forms */}
                           {!activeScenario.isBuiltIn && (
                              <div className="space-y-8 animate-in fade-in">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                       <label className="block text-[10px] font-bold text-[#7A89A3] uppercase tracking-wider mb-1.5">{t.scenarioName} (EN)</label>
                                       <input type="text" value={activeScenario.nameEn} onChange={e=>updateActiveCustomScenario('nameEn', e.target.value)} className="w-full p-2.5 border border-[#D9E2F0] rounded-lg text-sm text-[#172033] outline-none focus:border-[#3366FF]"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-[#7A89A3] uppercase tracking-wider mb-1.5">{t.scenarioName} (BG)</label>
                                       <input type="text" value={activeScenario.nameBg} onChange={e=>updateActiveCustomScenario('nameBg', e.target.value)} className="w-full p-2.5 border border-[#D9E2F0] rounded-lg text-sm text-[#172033] outline-none focus:border-[#3366FF]"/>
                                    </div>
                                 </div>

                                 <div>
                                    <div className="flex justify-between items-center mb-4">
                                       <h4 className="text-sm font-bold text-[#172033] uppercase tracking-wider">{t.featureListTitle}</h4>
                                       <button onClick={addCustomFeature} className="px-3 py-1.5 bg-[#3366FF] text-white hover:bg-[#254EDBE6] rounded text-xs font-bold uppercase transition-colors flex items-center"><Plus className="w-3.5 h-3.5 mr-1"/> {t.btnAddFeature}</button>
                                    </div>
                                    <div className="space-y-3">
                                       {activeFeatures.map((f, idx) => (
                                          <div key={f.id} className="p-4 border border-[#D9E2F0] rounded-xl bg-white hover:border-[#C6D4EA] transition-colors shadow-sm">
                                             <div className="flex justify-between items-start mb-3">
                                                <span className="text-[10px] font-bold text-[#7A89A3] bg-[#F8FAFF] px-2 py-0.5 rounded border border-[#D9E2F0]">Feature {idx + 1}</span>
                                                <button onClick={()=>deleteCustomFeature(f.id)} className="text-[#EF4444] hover:text-[#DC2626]"><XCircle className="w-4 h-4"/></button>
                                             </div>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <input type="text" value={f.title_en} onChange={e=>updateActiveCustomFeature(f.id, 'title_en', e.target.value)} placeholder="Title EN" className="p-2 border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF]"/>
                                                <input type="text" value={f.title_bg} onChange={e=>updateActiveCustomFeature(f.id, 'title_bg', e.target.value)} placeholder="Title BG" className="p-2 border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF]"/>
                                                <textarea value={f.desc_en || ''} onChange={e=>updateActiveCustomFeature(f.id, 'desc_en', e.target.value)} placeholder="Short Description EN" className="p-2 border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF] h-12 resize-y"></textarea>
                                                <textarea value={f.desc_bg || ''} onChange={e=>updateActiveCustomFeature(f.id, 'desc_bg', e.target.value)} placeholder="Кратко описание BG" className="p-2 border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF] h-12 resize-y"></textarea>
                                             </div>
                                             
                                             <div className="mb-3">
                                                <button onClick={() => setExpandedDetailsId(expandedDetailsId === f.id ? null : f.id)} className="text-[10px] font-bold text-[#3366FF] uppercase tracking-wider flex items-center hover:underline">
                                                   {expandedDetailsId === f.id ? t.btnHideDetails : `+ ${t.featureDetails}`}
                                                </button>
                                                {expandedDetailsId === f.id && (
                                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 p-3 bg-[#F8FAFF] rounded-lg border border-[#D9E2F0]">
                                                      <textarea value={f.details_en || ''} onChange={e=>updateActiveCustomFeature(f.id, 'details_en', e.target.value)} placeholder="Full Details EN (Optional)" className="p-2 border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF] h-20 resize-y"></textarea>
                                                      <textarea value={f.details_bg || ''} onChange={e=>updateActiveCustomFeature(f.id, 'details_bg', e.target.value)} placeholder="Пълни детайли BG (Опционално)" className="p-2 border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF] h-20 resize-y"></textarea>
                                                   </div>
                                                )}
                                             </div>

                                             <div className="grid grid-cols-4 gap-2">
                                                <div><label className="block text-[9px] text-[#A0ABBF] uppercase mb-1">BV</label><input type="number" value={f.bv} onChange={e=>updateActiveCustomFeature(f.id, 'bv', Number(e.target.value))} className="w-full p-1.5 text-center border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF]"/></div>
                                                <div><label className="block text-[9px] text-[#A0ABBF] uppercase mb-1">TC</label><input type="number" value={f.tc} onChange={e=>updateActiveCustomFeature(f.id, 'tc', Number(e.target.value))} className="w-full p-1.5 text-center border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF]"/></div>
                                                <div><label className="block text-[9px] text-[#A0ABBF] uppercase mb-1">RR</label><input type="number" value={f.rr} onChange={e=>updateActiveCustomFeature(f.id, 'rr', Number(e.target.value))} className="w-full p-1.5 text-center border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF]"/></div>
                                                <div><label className="block text-[9px] text-[#A0ABBF] uppercase mb-1">JS</label><input type="number" value={f.js} onChange={e=>updateActiveCustomFeature(f.id, 'js', Number(e.target.value))} className="w-full p-1.5 text-center border border-[#D9E2F0] rounded text-xs text-[#172033] outline-none focus:border-[#3366FF]"/></div>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}

                     {/* ROLE SETUP TAB */}
                     {setupTab === 'roles' && (
                        <div className="max-w-xl">
                           <h3 className="text-lg font-black text-[#172033] mb-6">{t.tabRoles}</h3>
                           <div className="space-y-3">
                             {roleSlots.map(rs => (
                                <div key={rs.id} className="flex gap-3 items-center">
                                   <select value={rs.role} onChange={e => handleRoleSetupChange(rs.id, 'role', e.target.value)} className="flex-1 p-3 bg-[#F8FAFF] border border-[#D9E2F0] rounded-xl text-sm font-medium text-[#172033] outline-none hover:border-[#3366FF] focus:border-[#3366FF]">
                                     {Object.entries(t.roles || {}).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                                   </select>
                                   <div className="flex flex-col items-center">
                                     <span className="text-[9px] text-[#7A89A3] uppercase font-bold mb-1">Seats</span>
                                     <input type="number" min="1" value={rs.seats} onChange={e => handleRoleSetupChange(rs.id, 'seats', Math.max(1, parseInt(e.target.value)||1))} className="w-16 p-3 text-center bg-[#F8FAFF] border border-[#D9E2F0] rounded-xl text-sm font-bold text-[#172033] outline-none hover:border-[#3366FF] focus:border-[#3366FF]" />
                                   </div>
                                   <div className="pt-4">
                                     <button onClick={() => removeRoleSlot(rs.id)} className="text-[#EF4444] hover:bg-[#FEF2F2] p-2 rounded-lg transition-colors mt-0.5"><XCircle className="w-5 h-5"/></button>
                                   </div>
                                </div>
                             ))}
                           </div>
                           <div className="flex gap-4 mt-6">
                              <button onClick={addRoleSlot} className="flex-1 py-3 bg-[#EEF4FF] text-[#3366FF] border border-[#C6D4EA] hover:bg-[#D9E2F0] rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center"><UserPlus className="w-4 h-4 mr-2"/> {t.btnAddRole}</button>
                              <button onClick={() => setRoleSlots(defaultRoleSlots)} className="flex-1 py-3 bg-[#F8FAFF] text-[#53627A] border border-[#D9E2F0] hover:bg-[#EEF4FF] hover:text-[#172033] rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center"><RefreshCw className="w-4 h-4 mr-2"/> {t.btnResetRoles}</button>
                           </div>
                        </div>
                     )}

                     {/* SESSION SETTINGS TAB */}
                     {setupTab === 'settings' && (
                        <div className="max-w-xl">
                           <h3 className="text-lg font-black text-[#172033] mb-6">{t.tabSettings}</h3>
                           <div className="space-y-6">
                              <div className="p-5 border border-[#D9E2F0] rounded-xl bg-[#F8FAFF] opacity-50">
                                <div className="flex items-center">
                                  <input type="checkbox" id="demoMode" disabled checked={session.demoMode} onChange={e => setSession(prev=>({...prev, demoMode: e.target.checked}))} className="w-5 h-5 rounded border-[#D9E2F0] text-[#3366FF] focus:ring-[#3366FF]" />
                                  <label htmlFor="demoMode" className="ml-3 text-sm font-bold text-[#172033]">Local Demo Mode (Disabled)</label>
                                </div>
                                <p className="mt-2 text-xs text-[#53627A] ml-8">Disabled while connected to Live Firebase Multiplayer.</p>
                              </div>

                              <div className="p-5 border border-[#D9E2F0] rounded-xl bg-white">
                                <label className="block text-xs font-bold text-[#7A89A3] uppercase tracking-wider mb-2">{t.capacityLimit}</label>
                                <input type="number" min="0" value={session.capacity} onChange={e => setSession(prev=>({...prev, capacity: Math.max(0, parseInt(e.target.value) || 0)}))} className="w-full p-3 bg-[#F8FAFF] border border-[#D9E2F0] rounded-xl focus:border-[#3366FF] outline-none text-base font-bold text-[#172033]" />
                                <p className="mt-2 text-xs text-[#53627A]">Adjust the total available capacity for the release cut-line simulation.</p>
                              </div>
                           </div>
                        </div>
                     )}

                   </div>
                 </div>
               )}
            </div>

          </div>
        )}
      
    </div>
  );
}