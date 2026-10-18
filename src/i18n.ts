import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      tagline: 'Every task, in the right order.',
      nav: { inbox: 'Inbox', today: 'Today', upcoming: 'Upcoming', calendar: 'Calendar', tasks: 'All tasks', completed: 'Completed', projects: 'Projects', productivity: 'Productivity', settings: 'Settings' },
      labels: { addTask: 'Add task', search: 'Search tasks', today: 'Today', overdue: 'Overdue', due: 'Due', noTasks: 'Nothing here yet', noTasksHint: 'A clear space to begin your next step.', tasks: 'tasks', task: 'task', all: 'All', high: 'High', medium: 'Medium', low: 'Low', urgent: 'Urgent', title: 'Task name', description: 'Description', dueDate: 'Due date', priority: 'Priority', project: 'Project', save: 'Save task', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', close: 'Close', complete: 'Mark complete', reopen: 'Reopen task', searchEmpty: 'No matching tasks', month: 'Month', week: 'Week', day: 'Day', back: 'Back', next: 'Next', todayButton: 'Today', noProject: 'Inbox', createProject: 'Create project', projectName: 'Project name', theme: 'Appearance', language: 'Language', light: 'Light', dark: 'Dark', system: 'System', localOnly: 'Your tasks are saved on this device.', offline: 'Offline', online: 'Online', saved: 'Saved locally', install: 'Install app', installHelp: 'Use your browser menu and choose “Install app” or “Add to Home Screen”.', completedToday: 'Completed today', completedWeek: 'Completed this week', pending: 'Pending', completionRate: 'Completion rate', weekly: 'This week', viewAll: 'View all', clearSearch: 'Clear search', menu: 'Open navigation', closeMenu: 'Close navigation', projectEmpty: 'No projects yet', projectHint: 'Group related tasks into a project.', deleteConfirm: 'Delete this task? This cannot be undone.', projectDeleteConfirm: 'Delete this project? Tasks will stay in your inbox.', settingsInfo: 'Your preferences are stored on this device.', cloudNotice: 'Cloud accounts are not configured yet. Local task management works without an account.', saveError: 'Could not save this task.' },
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      auth: { heading: 'Welcome back', description: 'Enter the shared workspace password to continue.', password: 'Password', passwordPlaceholder: 'Enter password', login: 'Log in', signingIn: 'Signing in…', signingOut: 'Signing out…', logout: 'Log out', showPassword: 'Show password', hidePassword: 'Hide password', checkingSession: 'Checking your session…', sharedAccountNotice: 'This workspace uses one shared account.', errors: { required: 'Enter the password to continue.', invalidCredentials: 'The password is incorrect. Please try again.', network: 'Could not reach the sign-in service. Check your connection and try again.', configuration: 'Sign-in is not configured. Ask the administrator to complete the app configuration.', expired: 'Your session has ended. Please sign in again.', sessionExpired: 'Your session is no longer valid. Please sign in again.', logout: 'Could not log out. Check your connection and try again.' } },
      brand: 'क्रिया-क्रम'
    }
  },
  hi: {
    translation: {
      tagline: 'हर काम, सही क्रम में।',
      nav: { inbox: 'इनबॉक्स', today: 'आज', upcoming: 'आगामी', calendar: 'कैलेंडर', tasks: 'सभी कार्य', completed: 'पूरे किए', projects: 'परियोजनाएँ', productivity: 'उत्पादकता', settings: 'सेटिंग्स' },
      labels: { addTask: 'कार्य जोड़ें', search: 'कार्य खोजें', today: 'आज', overdue: 'समय सीमा पार', due: 'अंतिम तिथि', noTasks: 'अभी यहाँ कुछ नहीं', noTasksHint: 'अपने अगले कदम की शुरुआत यहीं से करें।', tasks: 'कार्य', task: 'कार्य', all: 'सभी', high: 'उच्च', medium: 'मध्यम', low: 'कम', urgent: 'तत्काल', title: 'कार्य का नाम', description: 'विवरण', dueDate: 'अंतिम तिथि', priority: 'प्राथमिकता', project: 'परियोजना', save: 'कार्य सहेजें', cancel: 'रद्द करें', edit: 'संपादित करें', delete: 'हटाएँ', close: 'बंद करें', complete: 'पूरा करें', reopen: 'फिर खोलें', searchEmpty: 'कोई मिलता-जुलता कार्य नहीं', month: 'महीना', week: 'सप्ताह', day: 'दिन', back: 'पिछला', next: 'अगला', todayButton: 'आज', noProject: 'इनबॉक्स', createProject: 'परियोजना बनाएँ', projectName: 'परियोजना का नाम', theme: 'रूप', language: 'भाषा', light: 'हल्का', dark: 'गहरा', system: 'सिस्टम', localOnly: 'आपके कार्य इस डिवाइस पर सहेजे जाते हैं।', offline: 'ऑफ़लाइन', online: 'ऑनलाइन', saved: 'डिवाइस पर सहेजा गया', install: 'ऐप इंस्टॉल करें', installHelp: 'ब्राउज़र मेनू खोलें और “ऐप इंस्टॉल करें” या “होम स्क्रीन पर जोड़ें” चुनें।', completedToday: 'आज पूरे किए', completedWeek: 'इस सप्ताह पूरे किए', pending: 'बाकी कार्य', completionRate: 'पूर्णता दर', weekly: 'इस सप्ताह', viewAll: 'सभी देखें', clearSearch: 'खोज मिटाएँ', menu: 'नेविगेशन खोलें', closeMenu: 'नेविगेशन बंद करें', projectEmpty: 'अभी कोई परियोजना नहीं', projectHint: 'संबंधित कार्यों को परियोजना में रखें।', deleteConfirm: 'यह कार्य हटाएँ? इसे वापस नहीं किया जा सकता।', projectDeleteConfirm: 'यह परियोजना हटाएँ? कार्य इनबॉक्स में रहेंगे।', settingsInfo: 'आपकी पसंद इस डिवाइस पर सहेजी जाती है।', cloudNotice: 'क्लाउड खाते अभी सेट नहीं हैं। बिना खाते के स्थानीय कार्य प्रबंधन उपलब्ध है।', saveError: 'यह कार्य सहेजा नहीं जा सका।' },
      days: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
      auth: { heading: 'वापसी पर स्वागत है', description: 'आगे बढ़ने के लिए साझा कार्यक्षेत्र का पासवर्ड दर्ज करें।', password: 'पासवर्ड', passwordPlaceholder: 'पासवर्ड दर्ज करें', login: 'लॉग इन करें', signingIn: 'लॉग इन हो रहा है…', signingOut: 'लॉग आउट हो रहा है…', logout: 'लॉग आउट करें', showPassword: 'पासवर्ड दिखाएँ', hidePassword: 'पासवर्ड छिपाएँ', checkingSession: 'आपका सत्र जाँचा जा रहा है…', sharedAccountNotice: 'इस कार्यक्षेत्र में एक साझा खाते का उपयोग होता है।', errors: { required: 'आगे बढ़ने के लिए पासवर्ड दर्ज करें।', invalidCredentials: 'पासवर्ड सही नहीं है। कृपया फिर से प्रयास करें।', network: 'लॉग इन सेवा से संपर्क नहीं हो सका। कनेक्शन जाँचकर फिर प्रयास करें।', configuration: 'लॉग इन सेट नहीं है। ऐप कॉन्फ़िगरेशन पूरा करने के लिए व्यवस्थापक से संपर्क करें।', expired: 'आपका सत्र समाप्त हो गया है। कृपया फिर से लॉग इन करें।', sessionExpired: 'आपका सत्र अब मान्य नहीं है। कृपया फिर से लॉग इन करें।', logout: 'लॉग आउट नहीं हो सका। कनेक्शन जाँचकर फिर प्रयास करें।' } },
      brand: 'क्रिया-क्रम'
    }
  },
  gu: {
    translation: {
      tagline: 'દરેક કાર્ય, યોગ્ય ક્રમમાં.',
      nav: { inbox: 'ઇનબૉક્સ', today: 'આજે', upcoming: 'આગામી', calendar: 'કૅલેન્ડર', tasks: 'બધાં કાર્યો', completed: 'પૂર્ણ થયેલાં', projects: 'પ્રોજેક્ટ્સ', productivity: 'ઉત્પાદકતા', settings: 'સેટિંગ્સ' },
      labels: { addTask: 'કાર્ય ઉમેરો', search: 'કાર્યો શોધો', today: 'આજે', overdue: 'સમયમર્યાદા વીતી', due: 'અંતિમ તારીખ', noTasks: 'અહીં હજી કંઈ નથી', noTasksHint: 'તમારા આગલા પગલાની શરૂઆત અહીંથી કરો.', tasks: 'કાર્યો', task: 'કાર્ય', all: 'બધાં', high: 'ઉચ્ચ', medium: 'મધ્યમ', low: 'ઓછું', urgent: 'તાત્કાલિક', title: 'કાર્યનું નામ', description: 'વર્ણન', dueDate: 'અંતિમ તારીખ', priority: 'પ્રાથમિકતા', project: 'પ્રોજેક્ટ', save: 'કાર્ય સાચવો', cancel: 'રદ કરો', edit: 'ફેરફાર કરો', delete: 'કાઢી નાખો', close: 'બંધ કરો', complete: 'પૂર્ણ કરો', reopen: 'ફરી ખોલો', searchEmpty: 'મેળ ખાતાં કાર્યો નથી', month: 'મહિનો', week: 'અઠવાડિયું', day: 'દિવસ', back: 'પાછળ', next: 'આગળ', todayButton: 'આજે', noProject: 'ઇનબૉક્સ', createProject: 'પ્રોજેક્ટ બનાવો', projectName: 'પ્રોજેક્ટનું નામ', theme: 'દેખાવ', language: 'ભાષા', light: 'હળવો', dark: 'ઘેરો', system: 'સિસ્ટમ', localOnly: 'તમારા કાર્યો આ ઉપકરણ પર સાચવાય છે.', offline: 'ઑફલાઇન', online: 'ઑનલાઇન', saved: 'ઉપકરણ પર સાચવ્યું', install: 'ઍપ ઇન્સ્ટૉલ કરો', installHelp: 'બ્રાઉઝર મેનૂ ખોલીને “ઍપ ઇન્સ્ટૉલ કરો” અથવા “હોમ સ્ક્રીન પર ઉમેરો” પસંદ કરો.', completedToday: 'આજે પૂર્ણ કરેલાં', completedWeek: 'આ અઠવાડિયે પૂર્ણ કરેલાં', pending: 'બાકી', completionRate: 'પૂર્ણતા દર', weekly: 'આ અઠવાડિયે', viewAll: 'બધું જુઓ', clearSearch: 'શોધ સાફ કરો', menu: 'નેવિગેશન ખોલો', closeMenu: 'નેવિગેશન બંધ કરો', projectEmpty: 'હજી કોઈ પ્રોજેક્ટ નથી', projectHint: 'સંબંધિત કાર્યોને પ્રોજેક્ટમાં ગોઠવો.', deleteConfirm: 'આ કાર્ય કાઢી નાખવું છે? પાછું મેળવી શકાશે નહીં.', projectDeleteConfirm: 'આ પ્રોજેક્ટ કાઢી નાખવો છે? કાર્યો ઇનબૉક્સમાં રહેશે.', settingsInfo: 'તમારી પસંદગીઓ આ ઉપકરણ પર સાચવાય છે.', cloudNotice: 'ક્લાઉડ એકાઉન્ટ હજી ગોઠવેલ નથી. એકાઉન્ટ વિના સ્થાનિક કાર્ય વ્યવસ્થાપન ઉપલબ્ધ છે.', saveError: 'આ કાર્ય સાચવી શકાયું નથી.' },
      days: ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'],
      auth: { heading: 'ફરી સ્વાગત છે', description: 'આગળ વધવા માટે શેર કરેલા કાર્યસ્થળનો પાસવર્ડ દાખલ કરો.', password: 'પાસવર્ડ', passwordPlaceholder: 'પાસવર્ડ દાખલ કરો', login: 'લૉગ ઇન કરો', signingIn: 'લૉગ ઇન થઈ રહ્યું છે…', signingOut: 'લૉગ આઉટ થઈ રહ્યું છે…', logout: 'લૉગ આઉટ કરો', showPassword: 'પાસવર્ડ બતાવો', hidePassword: 'પાસવર્ડ છુપાવો', checkingSession: 'તમારું સત્ર તપાસી રહ્યું છે…', sharedAccountNotice: 'આ કાર્યસ્થળમાં એક શેર કરેલા એકાઉન્ટનો ઉપયોગ થાય છે.', errors: { required: 'આગળ વધવા માટે પાસવર્ડ દાખલ કરો.', invalidCredentials: 'પાસવર્ડ ખોટો છે. કૃપા કરીને ફરી પ્રયાસ કરો.', network: 'લૉગ ઇન સેવા સાથે જોડાઈ શકાયું નથી. કનેક્શન તપાસીને ફરી પ્રયાસ કરો.', configuration: 'લૉગ ઇન ગોઠવાયેલું નથી. ઍપ ગોઠવવા માટે વ્યવસ્થાપકનો સંપર્ક કરો.', expired: 'તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગ ઇન કરો.', sessionExpired: 'તમારું સત્ર હવે માન્ય નથી. કૃપા કરીને ફરી લૉગ ઇન કરો.', logout: 'લૉગ આઉટ થઈ શક્યું નથી. કનેક્શન તપાસીને ફરી પ્રયાસ કરો.' } },
      brand: 'ક્રિયા-ક્રમ'
    }
  }
}

Object.assign(resources.en.translation.labels, {
  emptyInboxTitle: 'Your inbox is clear',
  emptyInboxHint: 'Capture an idea here before deciding where it belongs.',
  emptyTodayTitle: 'You’re all caught up',
  emptyTodayHint: 'No overdue or planned tasks for today. Enjoy the breathing room.',
  emptyUpcomingTitle: 'Nothing coming up',
  emptyUpcomingHint: 'Give a task a future due date and it will appear here.',
  emptyTasksTitle: 'No tasks yet',
  emptyTasksHint: 'Start with one small next step.',
  emptyCompletedTitle: 'Completed tasks will land here',
  emptyCompletedHint: 'Finish a task and you’ll find it in this list.',
  productivityEmpty: 'Your activity will appear here',
  productivityHint: 'Complete a task to start building a real activity history.',
  overdueGroup: 'Overdue',
  todayGroup: 'Today',
  tomorrowGroup: 'Tomorrow',
  laterWeekGroup: 'Later this week',
  futureGroup: 'Future',
  overdueHint: 'Overdue tasks stay visible until completed.',
  todayProgress: '{{completed}} of {{total}} planned tasks complete',
  collapseSidebar: 'Collapse sidebar',
  expandSidebar: 'Expand sidebar'
})
Object.assign(resources.hi.translation.labels, {
  emptyInboxTitle: 'इनबॉक्स खाली है',
  emptyInboxHint: 'किसी विचार को पहले यहाँ लिखें, फिर तय करें कि उसे कहाँ रखना है।',
  emptyTodayTitle: 'आज के काम पूरे हैं',
  emptyTodayHint: 'आज के लिए कोई बाकी या तय किया हुआ कार्य नहीं है।',
  emptyUpcomingTitle: 'आगे कोई कार्य नहीं',
  emptyUpcomingHint: 'किसी कार्य की भविष्य की अंतिम तिथि तय करें, वह यहाँ दिखेगा।',
  emptyTasksTitle: 'अभी कोई कार्य नहीं',
  emptyTasksHint: 'अगले छोटे कदम से शुरुआत करें।',
  emptyCompletedTitle: 'पूरे किए गए कार्य यहाँ दिखेंगे',
  emptyCompletedHint: 'कार्य पूरा करने पर वह इस सूची में दिखाई देगा।',
  productivityEmpty: 'आपकी गतिविधि यहाँ दिखेगी',
  productivityHint: 'अपनी गतिविधि का इतिहास बनाने के लिए कोई कार्य पूरा करें।',
  overdueGroup: 'समय सीमा पार',
  todayGroup: 'आज',
  tomorrowGroup: 'कल',
  laterWeekGroup: 'इस सप्ताह आगे',
  futureGroup: 'आने वाले दिन',
  overdueHint: 'समय सीमा पार कार्य पूरे होने तक यहाँ दिखते रहेंगे।',
  todayProgress: '{{total}} में से {{completed}} तय कार्य पूरे',
  collapseSidebar: 'साइडबार छोटा करें',
  expandSidebar: 'साइडबार बड़ा करें'
})
Object.assign(resources.gu.translation.labels, {
  emptyInboxTitle: 'ઇનબૉક્સ ખાલી છે',
  emptyInboxHint: 'વિચારને પહેલાં અહીં નોંધો, પછી ક્યાં રાખવો તે નક્કી કરો.',
  emptyTodayTitle: 'આજનાં બધાં કામ પૂરાં',
  emptyTodayHint: 'આજે કોઈ બાકી કે નિયોજિત કાર્ય નથી.',
  emptyUpcomingTitle: 'આગળ કોઈ કાર્ય નથી',
  emptyUpcomingHint: 'કાર્ય માટે ભવિષ્યની અંતિમ તારીખ આપો, તે અહીં દેખાશે.',
  emptyTasksTitle: 'હજી કોઈ કાર્ય નથી',
  emptyTasksHint: 'આગલા નાના પગલાથી શરૂઆત કરો.',
  emptyCompletedTitle: 'પૂર્ણ થયેલાં કાર્યો અહીં દેખાશે',
  emptyCompletedHint: 'કાર્ય પૂર્ણ કરો ત્યારે તે આ યાદીમાં આવશે.',
  productivityEmpty: 'તમારી પ્રવૃત્તિ અહીં દેખાશે',
  productivityHint: 'વાસ્તવિક પ્રવૃત્તિનો ઇતિહાસ શરૂ કરવા કોઈ કાર્ય પૂર્ણ કરો.',
  overdueGroup: 'સમયમર્યાદા વીતી',
  todayGroup: 'આજે',
  tomorrowGroup: 'આવતીકાલે',
  laterWeekGroup: 'આ અઠવાડિયે પછી',
  futureGroup: 'આગામી દિવસો',
  overdueHint: 'સમયમર્યાદા વીતી ગયેલાં કાર્યો પૂર્ણ થાય ત્યાં સુધી દેખાશે.',
  todayProgress: '{{total}} નિયોજિતમાંથી {{completed}} પૂર્ણ',
  collapseSidebar: 'સાઇડબાર સંકોચો',
  expandSidebar: 'સાઇડબાર વિસ્તારો'
})

const browserLanguage = navigator.language.toLowerCase().startsWith('hi')
  ? 'hi'
  : navigator.language.toLowerCase().startsWith('gu')
    ? 'gu'
    : 'en'

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('kk-language') || browserLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'hi', 'gu'],
  interpolation: { escapeValue: false },
  initImmediate: false
})

document.documentElement.lang = i18n.language

export default i18n
