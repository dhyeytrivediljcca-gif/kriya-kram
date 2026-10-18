import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      tagline: 'Every task, in the right order.',
      nav: { inbox: 'Inbox', today: 'Today', upcoming: 'Upcoming', calendar: 'Calendar', tasks: 'All tasks', completed: 'Completed', projects: 'Projects', productivity: 'Productivity', settings: 'Settings', admin: 'User management' },
      labels: { addTask: 'Add task', search: 'Search tasks', today: 'Today', overdue: 'Overdue', due: 'Due', noTasks: 'Nothing here yet', noTasksHint: 'A clear space to begin your next step.', tasks: 'tasks', task: 'task', all: 'All', high: 'High', medium: 'Medium', low: 'Low', urgent: 'Urgent', title: 'Task name', description: 'Description', dueDate: 'Due date', priority: 'Priority', project: 'Project', save: 'Save task', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', close: 'Close', complete: 'Mark complete', reopen: 'Reopen task', searchEmpty: 'No matching tasks', month: 'Month', week: 'Week', day: 'Day', back: 'Back', next: 'Next', todayButton: 'Today', noProject: 'Inbox', createProject: 'Create project', projectName: 'Project name', theme: 'Appearance', language: 'Language', light: 'Light', dark: 'Dark', system: 'System', localOnly: 'Your tasks are saved on this device.', offline: 'Offline', online: 'Online', saved: 'Saved locally', install: 'Install app', installHelp: 'Use your browser menu and choose “Install app” or “Add to Home Screen”.', completedToday: 'Completed today', completedWeek: 'Completed this week', pending: 'Pending', completionRate: 'Completion rate', weekly: 'This week', viewAll: 'View all', clearSearch: 'Clear search', menu: 'Open navigation', closeMenu: 'Close navigation', projectEmpty: 'No projects yet', projectHint: 'Group related tasks into a project.', deleteConfirm: 'Delete this task? This cannot be undone.', projectDeleteConfirm: 'Delete this project? Tasks will stay in your inbox.', settingsInfo: 'Your preferences are stored on this device.', cloudNotice: 'Cloud accounts are not configured yet. Local task management works without an account.', saveError: 'Could not save this task.' },
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      auth: { heading: 'Welcome back', description: 'Enter your account password to continue.', password: 'Password', passwordPlaceholder: 'Enter password', login: 'Log in', signingIn: 'Signing in…', signingOut: 'Signing out…', logout: 'Log out', showPassword: 'Show password', hidePassword: 'Hide password', checkingSession: 'Checking your session…', loadingAccount: 'Opening your private task space…', accountNotice: 'Your account and tasks are private to you.', account: 'Signed-in account', errors: { required: 'Enter the password to continue.', invalidCredentials: 'The password is incorrect. Please try again.', network: 'Could not reach the sign-in service. Check your connection and try again.', configuration: 'Sign-in is not configured. Ask the administrator to complete the app configuration.', expired: 'Your session has ended. Please sign in again.', sessionExpired: 'Your session is no longer valid. Please sign in again.', logout: 'Could not log out. Check your connection and try again.' } },
      admin: { description: 'Invite and manage accounts for this workspace.', email: 'Email address', emailPlaceholder: 'name@example.com', invite: 'Send invite', inviteHelp: 'Users receive an email invitation and set their own password. Admin accounts cannot be changed here.', inviteSent: 'Invitation sent.', resetSent: 'Password reset email sent.', userEnabled: 'Account access enabled.', userDisabled: 'Account disabled.', userDeleted: 'Account deleted.', administrator: 'Administrator', active: 'Active', disabled: 'Disabled', joined: 'Joined {{date}}', resetPassword: 'Send password reset email', disableUser: 'Disable account', enableUser: 'Enable account', deleteUser: 'Delete account', confirmDelete: 'Delete the account for {{email}}? This cannot be undone.', refresh: 'Refresh users', loading: 'Loading users…', empty: 'No accounts found.', setPasswordHeading: 'Set your password', resetPasswordHeading: 'Choose a new password', newPassword: 'New password', confirmPassword: 'Confirm password', savePassword: 'Save password', savingPassword: 'Saving…', passwordSet: 'Password saved. Opening your account…', passwordUpdated: 'Password updated. You can continue using the app.', retry: 'Reload app', errors: { generic: 'That action could not be completed. Check your connection and try again.', localDatabase: 'Your local task database could not be opened. Your saved task data has not been deleted.', passwordLength: 'Use a password with at least 8 characters.', passwordMismatch: 'The passwords do not match.' } },
      brand: 'क्रिया-क्रम'
    }
  },
  hi: {
    translation: {
      tagline: 'हर काम, सही क्रम में।',
      nav: { inbox: 'इनबॉक्स', today: 'आज', upcoming: 'आगामी', calendar: 'कैलेंडर', tasks: 'सभी कार्य', completed: 'पूरे किए', projects: 'परियोजनाएँ', productivity: 'उत्पादकता', settings: 'सेटिंग्स', admin: 'उपयोगकर्ता प्रबंधन' },
      labels: { addTask: 'कार्य जोड़ें', search: 'कार्य खोजें', today: 'आज', overdue: 'समय सीमा पार', due: 'अंतिम तिथि', noTasks: 'अभी यहाँ कुछ नहीं', noTasksHint: 'अपने अगले कदम की शुरुआत यहीं से करें।', tasks: 'कार्य', task: 'कार्य', all: 'सभी', high: 'उच्च', medium: 'मध्यम', low: 'कम', urgent: 'तत्काल', title: 'कार्य का नाम', description: 'विवरण', dueDate: 'अंतिम तिथि', priority: 'प्राथमिकता', project: 'परियोजना', save: 'कार्य सहेजें', cancel: 'रद्द करें', edit: 'संपादित करें', delete: 'हटाएँ', close: 'बंद करें', complete: 'पूरा करें', reopen: 'फिर खोलें', searchEmpty: 'कोई मिलता-जुलता कार्य नहीं', month: 'महीना', week: 'सप्ताह', day: 'दिन', back: 'पिछला', next: 'अगला', todayButton: 'आज', noProject: 'इनबॉक्स', createProject: 'परियोजना बनाएँ', projectName: 'परियोजना का नाम', theme: 'रूप', language: 'भाषा', light: 'हल्का', dark: 'गहरा', system: 'सिस्टम', localOnly: 'आपके कार्य इस डिवाइस पर सहेजे जाते हैं।', offline: 'ऑफ़लाइन', online: 'ऑनलाइन', saved: 'डिवाइस पर सहेजा गया', install: 'ऐप इंस्टॉल करें', installHelp: 'ब्राउज़र मेनू खोलें और “ऐप इंस्टॉल करें” या “होम स्क्रीन पर जोड़ें” चुनें।', completedToday: 'आज पूरे किए', completedWeek: 'इस सप्ताह पूरे किए', pending: 'बाकी कार्य', completionRate: 'पूर्णता दर', weekly: 'इस सप्ताह', viewAll: 'सभी देखें', clearSearch: 'खोज मिटाएँ', menu: 'नेविगेशन खोलें', closeMenu: 'नेविगेशन बंद करें', projectEmpty: 'अभी कोई परियोजना नहीं', projectHint: 'संबंधित कार्यों को परियोजना में रखें।', deleteConfirm: 'यह कार्य हटाएँ? इसे वापस नहीं किया जा सकता।', projectDeleteConfirm: 'यह परियोजना हटाएँ? कार्य इनबॉक्स में रहेंगे।', settingsInfo: 'आपकी पसंद इस डिवाइस पर सहेजी जाती है।', cloudNotice: 'क्लाउड खाते अभी सेट नहीं हैं। बिना खाते के स्थानीय कार्य प्रबंधन उपलब्ध है।', saveError: 'यह कार्य सहेजा नहीं जा सका।' },
      days: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
      auth: { heading: 'वापसी पर स्वागत है', description: 'आगे बढ़ने के लिए अपना खाता पासवर्ड दर्ज करें।', password: 'पासवर्ड', passwordPlaceholder: 'पासवर्ड दर्ज करें', login: 'लॉग इन करें', signingIn: 'लॉग इन हो रहा है…', signingOut: 'लॉग आउट हो रहा है…', logout: 'लॉग आउट करें', showPassword: 'पासवर्ड दिखाएँ', hidePassword: 'पासवर्ड छिपाएँ', checkingSession: 'आपका सत्र जाँचा जा रहा है…', loadingAccount: 'आपका निजी कार्य स्थान खोला जा रहा है…', accountNotice: 'आपका खाता और कार्य केवल आपके लिए हैं।', account: 'लॉग इन खाता', errors: { required: 'आगे बढ़ने के लिए पासवर्ड दर्ज करें।', invalidCredentials: 'पासवर्ड सही नहीं है। कृपया फिर से प्रयास करें।', network: 'लॉग इन सेवा से संपर्क नहीं हो सका। कनेक्शन जाँचकर फिर प्रयास करें।', configuration: 'लॉग इन सेट नहीं है। ऐप कॉन्फ़िगरेशन पूरा करने के लिए व्यवस्थापक से संपर्क करें।', expired: 'आपका सत्र समाप्त हो गया है। कृपया फिर से लॉग इन करें।', sessionExpired: 'आपका सत्र अब मान्य नहीं है। कृपया फिर से लॉग इन करें।', logout: 'लॉग आउट नहीं हो सका। कनेक्शन जाँचकर फिर प्रयास करें।' } },
      admin: { description: 'इस कार्यक्षेत्र के खाते आमंत्रित और प्रबंधित करें।', email: 'ईमेल पता', emailPlaceholder: 'name@example.com', invite: 'आमंत्रण भेजें', inviteHelp: 'उपयोगकर्ताओं को ईमेल आमंत्रण मिलेगा और वे अपना पासवर्ड स्वयं बनाएँगे। व्यवस्थापक खाते यहाँ नहीं बदले जा सकते।', inviteSent: 'आमंत्रण भेज दिया गया।', resetSent: 'पासवर्ड रीसेट ईमेल भेज दिया गया।', userEnabled: 'खाते का प्रवेश चालू किया गया।', userDisabled: 'खाता बंद किया गया।', userDeleted: 'खाता हटा दिया गया।', administrator: 'व्यवस्थापक', active: 'सक्रिय', disabled: 'बंद', joined: 'शामिल हुए {{date}}', resetPassword: 'पासवर्ड रीसेट ईमेल भेजें', disableUser: 'खाता बंद करें', enableUser: 'खाता चालू करें', deleteUser: 'खाता हटाएँ', confirmDelete: '{{email}} का खाता हटाएँ? इसे वापस नहीं किया जा सकता।', refresh: 'उपयोगकर्ता रीफ़्रेश करें', loading: 'उपयोगकर्ता लोड हो रहे हैं…', empty: 'कोई खाता नहीं मिला।', setPasswordHeading: 'अपना पासवर्ड बनाएँ', resetPasswordHeading: 'नया पासवर्ड चुनें', newPassword: 'नया पासवर्ड', confirmPassword: 'पासवर्ड की पुष्टि करें', savePassword: 'पासवर्ड सहेजें', savingPassword: 'सहेजा जा रहा है…', passwordSet: 'पासवर्ड सहेजा गया। आपका खाता खोला जा रहा है…', passwordUpdated: 'पासवर्ड बदल दिया गया। आप ऐप जारी रख सकते हैं।', retry: 'ऐप फिर से लोड करें', errors: { generic: 'यह काम पूरा नहीं हो सका। कनेक्शन जाँचकर फिर प्रयास करें।', localDatabase: 'आपका स्थानीय कार्य डेटाबेस नहीं खुल सका। सहेजे गए कार्य हटाए नहीं गए हैं।', passwordLength: 'कम से कम 8 अक्षरों का पासवर्ड चुनें।', passwordMismatch: 'दोनों पासवर्ड मेल नहीं खाते।' } },
      brand: 'क्रिया-क्रम'
    }
  },
  gu: {
    translation: {
      tagline: 'દરેક કાર્ય, યોગ્ય ક્રમમાં.',
      nav: { inbox: 'ઇનબૉક્સ', today: 'આજે', upcoming: 'આગામી', calendar: 'કૅલેન્ડર', tasks: 'બધાં કાર્યો', completed: 'પૂર્ણ થયેલાં', projects: 'પ્રોજેક્ટ્સ', productivity: 'ઉત્પાદકતા', settings: 'સેટિંગ્સ', admin: 'વપરાશકર્તા વ્યવસ્થાપન' },
      labels: { addTask: 'કાર્ય ઉમેરો', search: 'કાર્યો શોધો', today: 'આજે', overdue: 'સમયમર્યાદા વીતી', due: 'અંતિમ તારીખ', noTasks: 'અહીં હજી કંઈ નથી', noTasksHint: 'તમારા આગલા પગલાની શરૂઆત અહીંથી કરો.', tasks: 'કાર્યો', task: 'કાર્ય', all: 'બધાં', high: 'ઉચ્ચ', medium: 'મધ્યમ', low: 'ઓછું', urgent: 'તાત્કાલિક', title: 'કાર્યનું નામ', description: 'વર્ણન', dueDate: 'અંતિમ તારીખ', priority: 'પ્રાથમિકતા', project: 'પ્રોજેક્ટ', save: 'કાર્ય સાચવો', cancel: 'રદ કરો', edit: 'ફેરફાર કરો', delete: 'કાઢી નાખો', close: 'બંધ કરો', complete: 'પૂર્ણ કરો', reopen: 'ફરી ખોલો', searchEmpty: 'મેળ ખાતાં કાર્યો નથી', month: 'મહિનો', week: 'અઠવાડિયું', day: 'દિવસ', back: 'પાછળ', next: 'આગળ', todayButton: 'આજે', noProject: 'ઇનબૉક્સ', createProject: 'પ્રોજેક્ટ બનાવો', projectName: 'પ્રોજેક્ટનું નામ', theme: 'દેખાવ', language: 'ભાષા', light: 'હળવો', dark: 'ઘેરો', system: 'સિસ્ટમ', localOnly: 'તમારા કાર્યો આ ઉપકરણ પર સાચવાય છે.', offline: 'ઑફલાઇન', online: 'ઑનલાઇન', saved: 'ઉપકરણ પર સાચવ્યું', install: 'ઍપ ઇન્સ્ટૉલ કરો', installHelp: 'બ્રાઉઝર મેનૂ ખોલીને “ઍપ ઇન્સ્ટૉલ કરો” અથવા “હોમ સ્ક્રીન પર ઉમેરો” પસંદ કરો.', completedToday: 'આજે પૂર્ણ કરેલાં', completedWeek: 'આ અઠવાડિયે પૂર્ણ કરેલાં', pending: 'બાકી', completionRate: 'પૂર્ણતા દર', weekly: 'આ અઠવાડિયે', viewAll: 'બધું જુઓ', clearSearch: 'શોધ સાફ કરો', menu: 'નેવિગેશન ખોલો', closeMenu: 'નેવિગેશન બંધ કરો', projectEmpty: 'હજી કોઈ પ્રોજેક્ટ નથી', projectHint: 'સંબંધિત કાર્યોને પ્રોજેક્ટમાં ગોઠવો.', deleteConfirm: 'આ કાર્ય કાઢી નાખવું છે? પાછું મેળવી શકાશે નહીં.', projectDeleteConfirm: 'આ પ્રોજેક્ટ કાઢી નાખવો છે? કાર્યો ઇનબૉક્સમાં રહેશે.', settingsInfo: 'તમારી પસંદગીઓ આ ઉપકરણ પર સાચવાય છે.', cloudNotice: 'ક્લાઉડ એકાઉન્ટ હજી ગોઠવેલ નથી. એકાઉન્ટ વિના સ્થાનિક કાર્ય વ્યવસ્થાપન ઉપલબ્ધ છે.', saveError: 'આ કાર્ય સાચવી શકાયું નથી.' },
      days: ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'],
      auth: { heading: 'ફરી સ્વાગત છે', description: 'આગળ વધવા માટે તમારો એકાઉન્ટ પાસવર્ડ દાખલ કરો.', password: 'પાસવર્ડ', passwordPlaceholder: 'પાસવર્ડ દાખલ કરો', login: 'લૉગ ઇન કરો', signingIn: 'લૉગ ઇન થઈ રહ્યું છે…', signingOut: 'લૉગ આઉટ થઈ રહ્યું છે…', logout: 'લૉગ આઉટ કરો', showPassword: 'પાસવર્ડ બતાવો', hidePassword: 'પાસવર્ડ છુપાવો', checkingSession: 'તમારું સત્ર તપાસી રહ્યું છે…', loadingAccount: 'તમારી ખાનગી કાર્ય જગ્યા ખોલી રહ્યા છીએ…', accountNotice: 'તમારો એકાઉન્ટ અને કાર્યો ફક્ત તમારા માટે છે.', account: 'લૉગ ઇન એકાઉન્ટ', errors: { required: 'આગળ વધવા માટે પાસવર્ડ દાખલ કરો.', invalidCredentials: 'પાસવર્ડ ખોટો છે. કૃપા કરીને ફરી પ્રયાસ કરો.', network: 'લૉગ ઇન સેવા સાથે જોડાઈ શકાયું નથી. કનેક્શન તપાસીને ફરી પ્રયાસ કરો.', configuration: 'લૉગ ઇન ગોઠવાયેલું નથી. ઍપ ગોઠવવા માટે વ્યવસ્થાપકનો સંપર્ક કરો.', expired: 'તમારું સત્ર સમાપ્ત થયું છે. કૃપા કરીને ફરી લૉગ ઇન કરો.', sessionExpired: 'તમારું સત્ર હવે માન્ય નથી. કૃપા કરીને ફરી લૉગ ઇન કરો.', logout: 'લૉગ આઉટ થઈ શક્યું નથી. કનેક્શન તપાસીને ફરી પ્રયાસ કરો.' } },
      admin: { description: 'આ કાર્યસ્થળના એકાઉન્ટ આમંત્રિત અને સંચાલિત કરો.', email: 'ઇમેઇલ સરનામું', emailPlaceholder: 'name@example.com', invite: 'આમંત્રણ મોકલો', inviteHelp: 'વપરાશકર્તાને ઇમેઇલ આમંત્રણ મળશે અને તેઓ પોતાનો પાસવર્ડ બનાવશે. વ્યવસ્થાપક એકાઉન્ટ અહીં બદલી શકાતા નથી.', inviteSent: 'આમંત્રણ મોકલાયું.', resetSent: 'પાસવર્ડ રીસેટ ઇમેઇલ મોકલાયો.', userEnabled: 'એકાઉન્ટ પ્રવેશ ચાલુ કર્યો.', userDisabled: 'એકાઉન્ટ બંધ કર્યું.', userDeleted: 'એકાઉન્ટ કાઢી નાખ્યો.', administrator: 'વ્યવસ્થાપક', active: 'સક્રિય', disabled: 'બંધ', joined: '{{date}} જોડાયા', resetPassword: 'પાસવર્ડ રીસેટ ઇમેઇલ મોકલો', disableUser: 'એકાઉન્ટ બંધ કરો', enableUser: 'એકાઉન્ટ ચાલુ કરો', deleteUser: 'એકાઉન્ટ કાઢી નાખો', confirmDelete: '{{email}}નું એકાઉન્ટ કાઢી નાખવું છે? આ પાછું નહીં થઈ શકે.', refresh: 'વપરાશકર્તાઓ રિફ્રેશ કરો', loading: 'વપરાશકર્તાઓ લોડ થઈ રહ્યા છે…', empty: 'કોઈ એકાઉન્ટ મળ્યું નથી.', setPasswordHeading: 'તમારો પાસવર્ડ બનાવો', resetPasswordHeading: 'નવો પાસવર્ડ પસંદ કરો', newPassword: 'નવો પાસવર્ડ', confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો', savePassword: 'પાસવર્ડ સાચવો', savingPassword: 'સાચવી રહ્યા છીએ…', passwordSet: 'પાસવર્ડ સાચવાયો. તમારું એકાઉન્ટ ખોલી રહ્યા છીએ…', passwordUpdated: 'પાસવર્ડ અપડેટ થયો. તમે ઍપ વાપરી શકો છો.', retry: 'ઍપ ફરી લોડ કરો', errors: { generic: 'આ કાર્ય પૂર્ણ થઈ શક્યું નથી. કનેક્શન તપાસીને ફરી પ્રયાસ કરો.', localDatabase: 'સ્થાનિક કાર્ય ડેટાબેઝ ખોલી શકાયો નથી. સંગ્રહિત કાર્યો કાઢી નાખ્યા નથી.', passwordLength: 'ઓછામાં ઓછા 8 અક્ષરનો પાસવર્ડ રાખો.', passwordMismatch: 'બંને પાસવર્ડ મેળ ખાતા નથી.' } },
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

Object.assign(resources.en.translation.labels, {
  cloudNotice: 'Your account is managed by Supabase; tasks stay on this device and do not sync.'
})
Object.assign(resources.hi.translation.labels, {
  cloudNotice: 'आपका खाता Supabase संभालता है; कार्य इसी डिवाइस पर रहते हैं और सिंक नहीं होते।'
})
Object.assign(resources.gu.translation.labels, {
  cloudNotice: 'તમારો એકાઉન્ટ Supabase સંભાળે છે; કાર્યો આ ઉપકરણમાં રહે છે અને સિંક થતા નથી.'
})
Object.assign(resources.en.translation.auth, {
  description: 'Enter your username and password to continue.',
  username: 'Username',
  usernamePlaceholder: 'Enter username',
  errors: {
    ...resources.en.translation.auth.errors,
    usernameRequired: 'Enter your username to continue.',
    serviceUnavailable: 'The sign-in service is not deployed or configured. Ask the administrator to check the Supabase functions.'
  }
})
Object.assign(resources.hi.translation.auth, {
  description: 'आगे बढ़ने के लिए अपना उपयोगकर्ता नाम और पासवर्ड दर्ज करें।',
  username: 'उपयोगकर्ता नाम',
  usernamePlaceholder: 'उपयोगकर्ता नाम दर्ज करें',
  errors: {
    ...resources.hi.translation.auth.errors,
    usernameRequired: 'आगे बढ़ने के लिए उपयोगकर्ता नाम दर्ज करें।',
    serviceUnavailable: 'लॉग इन सेवा तैनात या कॉन्फ़िगर नहीं है। व्यवस्थापक से Supabase Functions की जाँच करने को कहें।'
  }
})
Object.assign(resources.gu.translation.auth, {
  description: 'આગળ વધવા માટે તમારું વપરાશકર્તા નામ અને પાસવર્ડ દાખલ કરો.',
  username: 'વપરાશકર્તા નામ',
  usernamePlaceholder: 'વપરાશકર્તા નામ દાખલ કરો',
  errors: {
    ...resources.gu.translation.auth.errors,
    usernameRequired: 'આગળ વધવા માટે વપરાશકર્તા નામ દાખલ કરો.',
    serviceUnavailable: 'લૉગ ઇન સેવા ડિપ્લોય અથવા ગોઠવાયેલ નથી. વ્યવસ્થાપકને Supabase Functions તપાસવા કહો.'
  }
})
Object.assign(resources.en.translation.admin, {
  username: 'Username',
  usernamePlaceholder: '3–32 letters, numbers, or underscores',
  inviteHelp: 'Users sign in with this username and the password they set from the email invitation. Usernames are unique and cannot be changed here.'
})
Object.assign(resources.hi.translation.admin, {
  username: 'उपयोगकर्ता नाम',
  usernamePlaceholder: '3–32 अक्षर, अंक या अंडरस्कोर',
  inviteHelp: 'उपयोगकर्ता इस नाम और ईमेल आमंत्रण से बनाए गए पासवर्ड से लॉग इन करेंगे। नाम अलग और स्थायी होगा।'
})
Object.assign(resources.gu.translation.admin, {
  username: 'વપરાશકર્તા નામ',
  usernamePlaceholder: '3–32 અક્ષર, આંકડા અથવા અન્ડરસ્કોર',
  inviteHelp: 'વપરાશકર્તા આ નામ અને ઇમેઇલ આમંત્રણમાંથી બનાવેલા પાસવર્ડથી લૉગ ઇન કરશે. નામ અનન્ય અને કાયમી છે.'
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
