import { Language } from './types';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'UK English', nativeLabel: 'English (UK)', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi (India)', nativeLabel: 'हिन्दी (भारत)', flag: '🇮🇳' },
  { code: 'ar', label: 'Arabic (Arab States)', nativeLabel: 'العربية', flag: '🇦🇪' },
  { code: 'es', label: 'Spanish (Spain)', nativeLabel: 'Español (España)', flag: '🇪🇸' },
  { code: 'fr', label: 'French (France)', nativeLabel: 'Français (France)', flag: '🇫🇷' },
  { code: 'zh', label: 'Chinese (China)', nativeLabel: '中文 (中国)', flag: '🇨🇳' },
  { code: 'ru', label: 'Russian (Russia)', nativeLabel: 'Русский (Россия)', flag: '🇷🇺' },
];

export interface TranslationStrings {
  brandTitle: string;
  products: string;
  solutions: string;
  pricing: string;
  support: string;
  login: string;
  logout: string;
  getStarted: string;
  homeTab: string;
  profileTab: string;
  adminTab: string;
  authTab: string;

  // Cleaner
  fileUploadHeader: string;
  dropFileOrUrl: string;
  chooseFile: string;
  cleanAndDownload: string;
  downloadProcessedFile: string;
  processing: string;
  filesDeletedNotice: string;
  freeFilesUsed: string;
  cleanedSuccessTitle: string;
  downloadFile: string;
  previewData: string;
  deleteFromServer: string;
  deleteConfirmed: string;
  trySampleData: string;
  orPasteUrl: string;
  urlPlaceholder: string;
  fetchAndClean: string;

  // Stats
  duplicatesRemoved: string;
  cellsTrimmed: string;
  rowsCleaned: string;

  // Customer Profile
  customerProfileTitle: string;
  accountHeader: string;
  proPlanBadge: string;
  planExpiryDate: string;
  cancelAutoRenewal: string;
  resumeAutoRenewal: string;
  paymentMethod: string;
  totalCleanedFiles: string;
  upgradePlans: string;
  selectPlan: string;
  currentPlan: string;
  saveWithYearly: string;
  basicPlanTitle: string;
  proPlanTitle: string;
  yearlyProPlanTitle: string;

  // Pricing & Plans specifics (Pure single language)
  per5Days: string;
  perMonth: string;
  perYear: string;
  basicCleaningFeature: string;
  proCleaningFeature: string;
  yearlyProCleaningFeature: string;
  unlimitedAccessFeature: string;
  prioritySupportFeature: string;
  priority247SupportFeature: string;
  currentChoiceBadge: string;
  activeBadge: string;
  plansSubtitle: string;
  zeroRetentionBadge: string;

  // Account & Founder
  founderAndCreator: string;
  originalIdeaAndCreator: string;
  soleOwnerNoTeam: string;
  autoRenewalActiveNote: string;
  autoRenewalDisabledNote: string;
  historicalTelemetryNote: string;

  // Features & Cleaner notes
  deleteServerCustomerNote: string;
  zeroLogTitle: string;
  zeroLogDesc: string;
  autoRepairTitle: string;
  autoRepairDesc: string;
  delimitersTitle: string;
  delimitersDesc: string;

  // Footer & Company
  companyLabel: string;
  legalLabel: string;
  contactLabel: string;
  founderSherSingh: string;
  companyVenue: string;
  privacyStandards: string;
  privacyPolicy: string;
  pricingTerms: string;
  termsOfService: string;
  contactUs: string;
  sla247: string;
  allRightsReserved: string;
  heroSlogan: string;

  // Nav inside profile
  dashboardNav: string;
  salesNav: string;
  usersNav: string;
  reportsNav: string;

  // Modal
  confirmPlanModalTitle: string;
  confirmPlanModalDesc: string;
  newTierLabel: string;
  priceLabel: string;
  renewalDateLabel: string;
  confirmUpgradeButton: string;
  updatingButton: string;

  // Admin
  adminDashboardTitle: string;
  adminLoginTitle: string;
  username: string;
  password: string;
  totalEarnings: string;
  totalSales: string;
  totalCustomers: string;
  globalTrafficBreakdown: string;
  recentSales: string;
  allUsersList: string;
  searchUsers: string;
  userName: string;
  email: string;
  userType: string;
  signUpDate: string;
  accountStatus: string;
  activeStatus: string;

  // Auth split screen
  signUpHeadline: string;
  alreadyHaveAccount: string;
  welcomeBack: string;
  pleaseLogIn: string;
  fullName: string;
  confirmPassword: string;
  signUpButton: string;
  agreeTerms: string;
  forgotPassword: string;
  loginButton: string;
  orSignUpWith: string;
  orLogInWith: string;

  // Language modal
  otherLanguagesNotice: string;
  cancel: string;
  confirm: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    brandTitle: 'CleanCSV',
    products: 'Products',
    solutions: 'Solutions',
    pricing: 'Pricing',
    support: 'Support',
    login: 'Log In',
    logout: 'Log Out',
    getStarted: 'Get Started Free',
    homeTab: 'Cleaner',
    profileTab: 'Profile',
    adminTab: 'Admin',
    authTab: 'Sign In',

    fileUploadHeader: 'File upload file',
    dropFileOrUrl: 'Drop all file or url upload here',
    chooseFile: 'Choose File',
    cleanAndDownload: '🚀 Clean & Download',
    downloadProcessedFile: 'Download Processed File',
    processing: 'Processing...',
    filesDeletedNotice: '🔒 Your files are deleted immediately after download.',
    freeFilesUsed: '🎁 Free files used',
    cleanedSuccessTitle: 'File Cleaned Successfully!',
    downloadFile: '⬇️ Download File',
    previewData: '👁️ View Cleaned Data',
    deleteFromServer: '🗑️ Delete from Server',
    deleteConfirmed: 'File permanently erased from memory & storage.',
    trySampleData: '✨ Try Sample Messy CSV',
    orPasteUrl: 'Or enter CSV / TSV web URL',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: 'Fetch & Clean',

    duplicatesRemoved: 'Duplicates Removed',
    cellsTrimmed: 'Cells Trimmed',
    rowsCleaned: 'Clean Rows',

    customerProfileTitle: 'Customer Profile',
    accountHeader: "SHER SINGH'S ACCOUNT",
    proPlanBadge: 'PRO PLAN',
    planExpiryDate: 'Plan Expiry Date',
    cancelAutoRenewal: 'Cancel Auto-Renewal',
    resumeAutoRenewal: 'Resume Auto-Renewal',
    paymentMethod: 'Payment Method',
    totalCleanedFiles: 'Total Cleaned Files',
    upgradePlans: 'UPGRADE PLANS',
    selectPlan: 'SELECT PLAN',
    currentPlan: 'CURRENT PLAN',
    saveWithYearly: 'Save with Yearly!',
    basicPlanTitle: 'BASIC',
    proPlanTitle: 'PRO',
    yearlyProPlanTitle: 'YEARLY PRO',

    per5Days: '/ 5 days',
    perMonth: '/ month',
    perYear: '/ year',
    basicCleaningFeature: '10 file cleanings',
    proCleaningFeature: 'Unlimited cleanings',
    yearlyProCleaningFeature: 'Unlimited monthly cleanings',
    unlimitedAccessFeature: 'Unlimited access',
    prioritySupportFeature: 'Priority support',
    priority247SupportFeature: 'Priority 24/7 support',
    currentChoiceBadge: 'Current Choice',
    activeBadge: 'Active',
    plansSubtitle: 'Flexible plans built for high-throughput CSV data teams and enterprise analysts.',
    zeroRetentionBadge: '⚡ Zero-Retention Guarantee on All Tiers',

    founderAndCreator: 'Founder, Owner & Sole Creator',
    originalIdeaAndCreator: 'ORIGINAL IDEA & CREATOR',
    soleOwnerNoTeam: 'Independent SaaS Venture · No external team',
    autoRenewalActiveNote: 'Auto-renewal is active. You will be billed on 30-Nov-2026.',
    autoRenewalDisabledNote: 'Auto-renewal is currently disabled. Access will lapse at end of term.',
    historicalTelemetryNote: '📊 Historical cleaning telemetry across all connected workspaces',

    deleteServerCustomerNote: 'When you click Delete, the file is permanently erased from memory.',
    zeroLogTitle: 'Zero-Log Confidentiality',
    zeroLogDesc: 'Cleaned in-browser and ephemeral memory. No data is stored, indexed, or shared with third parties.',
    autoRepairTitle: 'Smart Auto-Repair',
    autoRepairDesc: 'Fixes broken commas inside quoted text, unifies contradictory date formats, and strips invalid empty columns.',
    delimitersTitle: 'International Delimiters',
    delimitersDesc: 'Supports standard comma (,), semicolon (;), tab (\\t), and pipe (|) delimited enterprise files automatically.',

    companyLabel: 'Company',
    legalLabel: 'Legal',
    contactLabel: 'Contact',
    founderSherSingh: 'Founder (Sher Singh)',
    companyVenue: 'Company Venue',
    privacyStandards: 'Privacy Standards',
    privacyPolicy: 'Privacy Policy',
    pricingTerms: 'Pricing Terms',
    termsOfService: 'Terms of Service',
    contactUs: 'Contact Us',
    sla247: '24/7 SLA for PRO',
    allRightsReserved: 'All rights reserved.',
    heroSlogan: "The world's fastest, zero-retention CSV cleaner for high-growth data teams and analysts.",

    dashboardNav: 'Dashboard',
    salesNav: 'Sales',
    usersNav: 'Users',
    reportsNav: 'Reports',

    confirmPlanModalTitle: 'Confirm Subscription Change',
    confirmPlanModalDesc: 'Switching your billing tier. Your payment method will be charged accordingly with prorated billing.',
    newTierLabel: 'New Tier:',
    priceLabel: 'Price:',
    renewalDateLabel: 'Renewal Date:',
    confirmUpgradeButton: 'Confirm Upgrade',
    updatingButton: 'Updating...',

    adminDashboardTitle: 'Admin Dashboard',
    adminLoginTitle: 'Admin Login',
    username: 'Username',
    password: 'Password',
    totalEarnings: 'Total Earnings',
    totalSales: 'Total Sales',
    totalCustomers: 'Total Customers',
    globalTrafficBreakdown: 'GLOBAL TRAFFIC BREAKDOWN',
    recentSales: 'RECENT SALES',
    allUsersList: 'ALL USERS LIST',
    searchUsers: 'Search users or email...',
    userName: 'User Name',
    email: 'Email',
    userType: 'User Type',
    signUpDate: 'Sign-up Date',
    accountStatus: 'Account Status',
    activeStatus: 'Active',

    signUpHeadline: 'Sign Up & Get Started Free.',
    alreadyHaveAccount: 'Already have an account? Log In',
    welcomeBack: 'Welcome back!',
    pleaseLogIn: 'Please Log In.',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    signUpButton: 'Sign Up / Create Account',
    agreeTerms: 'I agree to Terms & Conditions',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Login / Continue',
    orSignUpWith: 'Or Sign Up with:',
    orLogInWith: 'Or Log In with:',

    otherLanguagesNotice: 'Other languages and regional settings available',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },

  hi: {
    brandTitle: 'CleanCSV',
    products: 'उत्पाद',
    solutions: 'समाधान',
    pricing: 'मूल्य निर्धारण',
    support: 'सहायता',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    getStarted: 'निःशुल्क शुरू करें',
    homeTab: 'क्लीनर',
    profileTab: 'प्रोफ़ाइल',
    adminTab: 'एडमिन',
    authTab: 'लॉग इन',

    fileUploadHeader: 'फ़ाइल अपलोड करें',
    dropFileOrUrl: 'फ़ाइल यहाँ खींचें और छोड़ें या URL दर्ज करें',
    chooseFile: 'फ़ाइल चुनें',
    cleanAndDownload: '🚀 साफ़ करें और डाउनलोड करें',
    downloadProcessedFile: 'संसाधित फ़ाइल डाउनलोड करें',
    processing: 'प्रक्रिया जारी है...',
    filesDeletedNotice: '🔒 डाउनलोड के तुरंत बाद आपकी फ़ाइल सर्वर से हमेशा के लिए हटा दी जाती है।',
    freeFilesUsed: '🎁 उपयोग की गई मुफ्त फ़ाइलें',
    cleanedSuccessTitle: 'फ़ाइल सफलतापूर्वक साफ़ कर दी गई!',
    downloadFile: '⬇️ फ़ाइल डाउनलोड करें',
    previewData: '👁️ डेटा देखें',
    deleteFromServer: '🗑️ सर्वर से तुरंत मिटाएं',
    deleteConfirmed: 'फ़ाइल सर्वर और मेमोरी से हमेशा के लिए मिटा दी गई है।',
    trySampleData: '✨ नमूना अव्यवस्थित CSV आज़माएं',
    orPasteUrl: 'या सीधा CSV URL पेस्ट करें',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: 'लाएं और साफ़ करें',

    duplicatesRemoved: 'डुप्लिकेट पंक्तियाँ हटाई गईं',
    cellsTrimmed: 'सेल साफ़ किए गए',
    rowsCleaned: 'साफ़ पंक्तियाँ',

    customerProfileTitle: 'ग्राहक प्रोफ़ाइल',
    accountHeader: 'शेर सिंह का खाता',
    proPlanBadge: 'प्रो प्लान',
    planExpiryDate: 'प्लान समाप्ति तिथि',
    cancelAutoRenewal: 'स्वतः नवीनीकरण रद्द करें',
    resumeAutoRenewal: 'स्वतः नवीनीकरण चालू करें',
    paymentMethod: 'भुगतान विधि',
    totalCleanedFiles: 'कुल साफ़ की गई फ़ाइलें',
    upgradePlans: 'प्लान अपग्रेड करें',
    selectPlan: 'प्लान चुनें',
    currentPlan: 'सक्रिय प्लान',
    saveWithYearly: 'वार्षिक पर भारी बचत!',
    basicPlanTitle: 'बेसिक',
    proPlanTitle: 'प्रो',
    yearlyProPlanTitle: 'वार्षिक प्रो',

    per5Days: '/ 5 दिन',
    perMonth: '/ महीना',
    perYear: '/ वर्ष',
    basicCleaningFeature: '10 फ़ाइल क्लीनिंग',
    proCleaningFeature: 'अनलिमिटेड फ़ाइल क्लीनिंग',
    yearlyProCleaningFeature: 'पूरे साल अनलिमिटेड क्लीनिंग',
    unlimitedAccessFeature: 'अनलिमिटेड एक्सेस',
    prioritySupportFeature: 'प्राथमिकता सहायता',
    priority247SupportFeature: '24/7 प्राथमिकता सहायता',
    currentChoiceBadge: 'पसंदीदा विकल्प',
    activeBadge: 'सक्रिय',
    plansSubtitle: 'उच्च-प्रदर्शन डेटा टीमों और विश्लेषकों के लिए लचीले प्लान।',
    zeroRetentionBadge: '⚡ सभी प्लान्स पर शून्य-डेटा संग्रहण गारंटी',

    founderAndCreator: 'संस्थापक, मालिक और एकमात्र निर्माता',
    originalIdeaAndCreator: 'मूल विचार एवं निर्माता',
    soleOwnerNoTeam: 'स्वतंत्र SaaS उपक्रम · कोई बाहरी टीम नहीं',
    autoRenewalActiveNote: 'स्वतः नवीनीकरण सक्रिय है। आपका अगला बिल 30-Nov-2026 को होगा।',
    autoRenewalDisabledNote: 'स्वतः नवीनीकरण वर्तमान में बंद है। अवधि समाप्त होने पर पहुँच समाप्त हो जाएगी।',
    historicalTelemetryNote: '📊 सभी कनेक्टेड वर्कस्पेस में ऐतिहासिक क्लीनिंग डेटा',

    deleteServerCustomerNote: 'जब ग्राहक Delete पर क्लिक करता है, तो फ़ाइल हमेशा के लिए मिट जाती है।',
    zeroLogTitle: 'ज़ीरो-लॉग गोपनीयता',
    zeroLogDesc: 'ब्राउज़र और अल्पकालिक मेमोरी में प्रोसेस। कोई भी डेटा तीसरे पक्ष के साथ साझा या सहेजा नहीं जाता।',
    autoRepairTitle: 'स्मार्ट ऑटो-रिपेयर',
    autoRepairDesc: 'उद्धरणों के अंदर टूटे अल्पविराम ठीक करता है, दिनांक प्रारूपों को एक समान करता है, और खाली कॉलम हटाता है।',
    delimitersTitle: 'अंतर्राष्ट्रीय विभाजक',
    delimitersDesc: 'कॉमा (,), सेमीकोलन (;), टैब (\\t), और पाइप (|) समर्थित एंटरप्राइज़ फ़ाइलों को स्वतः पहचानता है।',

    companyLabel: 'कंपनी',
    legalLabel: 'कानूनी',
    contactLabel: 'संपर्क',
    founderSherSingh: 'संस्थापक (शेर सिंह)',
    companyVenue: 'कंपनी वेन्यू',
    privacyStandards: 'गोपनीयता मानक',
    privacyPolicy: 'गोपनीयता नीति',
    pricingTerms: 'मूल्य निर्धारण शर्तें',
    termsOfService: 'सेवा की शर्तें',
    contactUs: 'हमसे संपर्क करें',
    sla247: 'PRO के लिए 24/7 SLA',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    heroSlogan: 'उच्च विकास वाली डेटा टीमों और विश्लेषकों के लिए दुनिया का सबसे तेज़, ज़ीरो-रिटेंशन CSV क्लीनर।',

    dashboardNav: 'डैशबोर्ड',
    salesNav: 'बिक्री',
    usersNav: 'उपयोगकर्ता',
    reportsNav: 'रिपोर्ट्स',

    confirmPlanModalTitle: 'सदस्यता परिवर्तन की पुष्टि करें',
    confirmPlanModalDesc: 'आपका बिलिंग प्लान बदला जा रहा है। आपके भुगतान माध्यम पर उसी अनुसार शुल्क लिया जाएगा।',
    newTierLabel: 'नया प्लान:',
    priceLabel: 'कीमत:',
    renewalDateLabel: 'नवीनीकरण तिथि:',
    confirmUpgradeButton: 'अपग्रेड की पुष्टि करें',
    updatingButton: 'अपडेट हो रहा है...',

    adminDashboardTitle: 'व्यवस्थापक डैशबोर्ड',
    adminLoginTitle: 'व्यवस्थापक लॉगिन',
    username: 'यूज़रनेम',
    password: 'पासवर्ड',
    totalEarnings: 'कुल कमाई',
    totalSales: 'कुल बिक्री',
    totalCustomers: 'कुल ग्राहक',
    globalTrafficBreakdown: 'वैश्विक ट्रैफ़िक विवरण',
    recentSales: 'हाल की बिक्री',
    allUsersList: 'सभी उपयोगकर्ताओं की सूची',
    searchUsers: 'उपयोगकर्ता या ईमेल खोजें...',
    userName: 'उपयोगकर्ता का नाम',
    email: 'ईमेल',
    userType: 'उपयोगकर्ता प्रकार',
    signUpDate: 'पंजीकरण तिथि',
    accountStatus: 'खाता स्थिति',
    activeStatus: 'सक्रिय',

    signUpHeadline: 'साइन अप करें और मुफ़्त में शुरुआत करें।',
    alreadyHaveAccount: 'क्या आपके पास पहले से खाता है? लॉग इन करें',
    welcomeBack: 'वापसी पर स्वागत है!',
    pleaseLogIn: 'कृपया लॉग इन करें।',
    fullName: 'पूरा नाम',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    signUpButton: 'साइन अप करें / खाता बनाएं',
    agreeTerms: 'मैं नियम व शर्तों से सहमत हूँ',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginButton: 'लॉग इन / जारी रखें',
    orSignUpWith: 'या इनके साथ साइन अप करें:',
    orLogInWith: 'या इनके साथ लॉग इन करें:',

    otherLanguagesNotice: 'अन्य भाषाएं और क्षेत्रीय सेटिंग्स उपलब्ध हैं',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
  },

  ar: {
    brandTitle: 'CleanCSV',
    products: 'المنتجات',
    solutions: 'الحلول',
    pricing: 'الأسعار',
    support: 'الدعم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    getStarted: 'ابدأ مجاناً',
    homeTab: 'تنظيف الملفات',
    profileTab: 'ملف العميل',
    adminTab: 'لوحة التحكم الإدارية',
    authTab: 'تسجيل جديد / دخول',

    fileUploadHeader: 'رفع ملف CSV',
    dropFileOrUrl: 'اسحب الملف هنا أو أدخل رابط الملف',
    chooseFile: 'اختر ملف',
    cleanAndDownload: '🚀 تنظيف وتحميل',
    downloadProcessedFile: 'تحميل الملف المنظف',
    processing: 'جارٍ المعالجة...',
    filesDeletedNotice: '🔒 يتم حذف ملفاتك فوراً وبشكل دائم بعد التحميل.',
    freeFilesUsed: '🎁 الملفات المجانية المستخدمة',
    cleanedSuccessTitle: 'تم تنظيف الملف بنجاح!',
    downloadFile: '⬇️ تحميل الملف',
    previewData: '👁️ معاينة البيانات',
    deleteFromServer: '🗑️ حذف نهائي من الخادم',
    deleteConfirmed: 'تم مسح الملف بالكامل من الخادم والذاكرة.',
    trySampleData: '✨ تجربة ملف CSV تجريبي',
    orPasteUrl: 'أو أدخل رابط CSV مباشر',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: 'جلب وتنظيف',

    duplicatesRemoved: 'صفوف مكررة محذوفة',
    cellsTrimmed: 'خلايا تم تنظيفها',
    rowsCleaned: 'صفوف صالحة',

    customerProfileTitle: 'ملف العميل',
    accountHeader: 'حساب شير سينغ',
    proPlanBadge: 'خطة احترافية',
    planExpiryDate: 'تاريخ انتهاء الخطة',
    cancelAutoRenewal: 'إلغاء التجديد التلقائي',
    resumeAutoRenewal: 'استئناف التجديد التلقائي',
    paymentMethod: 'طريقة الدفع',
    totalCleanedFiles: 'إجمالي الملفات المنظفة',
    upgradePlans: 'ترقية الخطط',
    selectPlan: 'اختيار الخطة',
    currentPlan: 'الخطة الحالية',
    saveWithYearly: 'وفر مع الخطة السنوية!',
    basicPlanTitle: 'أساسي',
    proPlanTitle: 'احترافي',
    yearlyProPlanTitle: 'احترافي سنوي',

    per5Days: '/ 5 أيام',
    perMonth: '/ شهر',
    perYear: '/ سنة',
    basicCleaningFeature: '10 تنظيف للملفات',
    proCleaningFeature: 'تنظيف غير محدود للملفات',
    yearlyProCleaningFeature: 'تنظيف غير محدود طوال العام',
    unlimitedAccessFeature: 'وصول غير محدود',
    prioritySupportFeature: 'دعم ذو أولوية',
    priority247SupportFeature: 'دعم ذو أولوية على مدار الساعة',
    currentChoiceBadge: 'الخيار المفضل',
    activeBadge: 'نشط',
    plansSubtitle: 'خطط مرنة مصممة لفرق تحليل البيانات والشركات الكبرى.',
    zeroRetentionBadge: '⚡ ضمان عدم حفظ البيانات على جميع الخطط',

    founderAndCreator: 'المؤسس والمالك والمبتكر الوحيد',
    originalIdeaAndCreator: 'الفكرة الأصلية والمبتكر',
    soleOwnerNoTeam: 'مشروع مستقل · لا يوجد فريق خارجي',
    autoRenewalActiveNote: 'التجديد التلقائي نشط. سيتم تجديد الاشتراك في 30-Nov-2026.',
    autoRenewalDisabledNote: 'التجديد التلقائي معطل حالياً. سينتهي الوصول بنهاية المدة.',
    historicalTelemetryNote: '📊 بيانات التنظيف السابقة عبر جميع مساحات العمل',

    deleteServerCustomerNote: 'عند النقر فوق حذف، يتم مسح الملف نهائياً من الذاكرة والخادم.',
    zeroLogTitle: 'سرية تامة بدون سجلات',
    zeroLogDesc: 'تنظيف ومعالجة في الذاكرة المؤقتة. لا يتم تخزين أي بيانات أو مشاركتها.',
    autoRepairTitle: 'إصلاح تلقائي ذكي',
    autoRepairDesc: 'إصلاح الفواصل التالفة وتوحيد صيغ التواريخ وحذف الأعمدة الفارغة.',
    delimitersTitle: 'محددات دولية متعددة',
    delimitersDesc: 'يدعم الفاصلة (,) والفاصلة المنقوطة (;) وعلامة التبويب (\\t) والأنبوب (|) تلقائياً.',

    companyLabel: 'الشركة',
    legalLabel: 'الشروط القانونية',
    contactLabel: 'اتصل بنا',
    founderSherSingh: 'المؤسس (Sher Singh)',
    companyVenue: 'مواقع الخوادم',
    privacyStandards: 'معايير الخصوصية',
    privacyPolicy: 'سياسة الخصوصية',
    pricingTerms: 'شروط التسعير',
    termsOfService: 'شروط الخدمة',
    contactUs: 'تواصل معنا',
    sla247: 'اتفاقية مستوى الخدمة 24/7 للـ PRO',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    heroSlogan: 'أسرع منظف لملفات CSV في العالم بدون الاحتفاظ بالبيانات لفرق البيانات والمحللين.',

    dashboardNav: 'لوحة التحكم',
    salesNav: 'المبيعات',
    usersNav: 'المستخدمون',
    reportsNav: 'التقارير',

    confirmPlanModalTitle: 'تأكيد تغيير الاشتراك',
    confirmPlanModalDesc: 'تغيير خطة الاشتراك الخاصة بك. سيتم تطبيق الرسوم بحسب الخطة الجديدة.',
    newTierLabel: 'الخطة الجديدة:',
    priceLabel: 'السعر:',
    renewalDateLabel: 'تاريخ التجديد:',
    confirmUpgradeButton: 'تأكيد الترقية',
    updatingButton: 'جارٍ التحديث...',

    adminDashboardTitle: 'لوحة تحكم المسؤول',
    adminLoginTitle: 'تسجيل دخول المسؤول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    totalEarnings: 'إجمالي الأرباح',
    totalSales: 'إجمالي المبيعات',
    totalCustomers: 'إجمالي العملاء',
    globalTrafficBreakdown: 'توزيع حركة المرور العالمية',
    recentSales: 'المبيعات الأخيرة',
    allUsersList: 'قائمة جميع المستخدمين',
    searchUsers: 'بحث عن مستخدم أو بريد...',
    userName: 'اسم المستخدم',
    email: 'البريد الإلكتروني',
    userType: 'نوع العضوية',
    signUpDate: 'تاريخ التسجيل',
    accountStatus: 'حالة الحساب',
    activeStatus: 'نشط',

    signUpHeadline: 'سجل وابدأ مجاناً الآن.',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟ تسجيل الدخول',
    welcomeBack: 'مرحباً بعودتك!',
    pleaseLogIn: 'يرجى تسجيل الدخول.',
    fullName: 'الاسم الكامل',
    confirmPassword: 'تأكيد كلمة المرور',
    signUpButton: 'إنشاء حساب جديد',
    agreeTerms: 'أوافق على الشروط والأحكام',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    loginButton: 'تسجيل الدخول / متابعة',
    orSignUpWith: 'أو التسجيل عبر:',
    orLogInWith: 'أو الدخول عبر:',

    otherLanguagesNotice: 'لغات وإعدادات إقليمية أخرى متاحة',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
  },

  es: {
    brandTitle: 'CleanCSV',
    products: 'Productos',
    solutions: 'Soluciones',
    pricing: 'Precios',
    support: 'Soporte',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    getStarted: 'Comenzar Gratis',
    homeTab: 'Limpiador CSV',
    profileTab: 'Perfil de Cliente',
    adminTab: 'Panel de Administrador',
    authTab: 'Cuenta / Registro',

    fileUploadHeader: 'Subir archivo',
    dropFileOrUrl: 'Arrastra el archivo o pega la URL aquí',
    chooseFile: 'Elegir archivo',
    cleanAndDownload: '🚀 Limpiar y Descargar',
    downloadProcessedFile: 'Descargar archivo procesado',
    processing: 'Procesando...',
    filesDeletedNotice: '🔒 Tus archivos se eliminan inmediatamente después de la descarga.',
    freeFilesUsed: '🎁 Archivos gratuitos usados',
    cleanedSuccessTitle: '¡Archivo limpiado con éxito!',
    downloadFile: '⬇️ Descargar archivo',
    previewData: '👁️ Ver datos limpios',
    deleteFromServer: '🗑️ Eliminar del servidor',
    deleteConfirmed: 'Archivo borrado permanentemente del servidor y memoria.',
    trySampleData: '✨ Probar archivo CSV de muestra',
    orPasteUrl: 'O pega la URL de un CSV web',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: 'Obtener y Limpiar',

    duplicatesRemoved: 'Filas duplicadas eliminadas',
    cellsTrimmed: 'Celdas limpiadas',
    rowsCleaned: 'Filas listas',

    customerProfileTitle: 'Perfil del Cliente',
    accountHeader: 'CUENTA DE SHER SINGH',
    proPlanBadge: 'PLAN PRO',
    planExpiryDate: 'Fecha de vencimiento',
    cancelAutoRenewal: 'Cancelar renovación automática',
    resumeAutoRenewal: 'Reanudar renovación automática',
    paymentMethod: 'Método de pago',
    totalCleanedFiles: 'Archivos limpiados',
    upgradePlans: 'MEJORAR PLAN',
    selectPlan: 'SELECCIONAR PLAN',
    currentPlan: 'PLAN ACTUAL',
    saveWithYearly: '¡Ahorra con el plan anual!',
    basicPlanTitle: 'BÁSICO',
    proPlanTitle: 'PRO',
    yearlyProPlanTitle: 'PRO ANUAL',

    per5Days: '/ 5 días',
    perMonth: '/ mes',
    perYear: '/ año',
    basicCleaningFeature: '10 limpiezas de archivos',
    proCleaningFeature: 'Limpiezas ilimitadas',
    yearlyProCleaningFeature: 'Limpiezas mensuales ilimitadas',
    unlimitedAccessFeature: 'Acceso ilimitado',
    prioritySupportFeature: 'Soporte prioritario',
    priority247SupportFeature: 'Soporte prioritario 24/7',
    currentChoiceBadge: 'Opción Preferida',
    activeBadge: 'Activo',
    plansSubtitle: 'Planes flexibles para analistas y equipos de datos.',
    zeroRetentionBadge: '⚡ Garantía de retención cero en todos los planes',

    founderAndCreator: 'Fundador, Propietario y Creador Único',
    originalIdeaAndCreator: 'IDEA ORIGINAL Y CREADOR',
    soleOwnerNoTeam: 'Empresa SaaS independiente · Sin equipo externo',
    autoRenewalActiveNote: 'La renovación automática está activa. Se facturará el 30-Nov-2026.',
    autoRenewalDisabledNote: 'La renovación automática está desactivada.',
    historicalTelemetryNote: '📊 Telemetría histórica de limpieza en todos los espacios de trabajo',

    deleteServerCustomerNote: 'Al hacer clic en Eliminar, el archivo se borra permanentemente.',
    zeroLogTitle: 'Confidencialidad sin registros',
    zeroLogDesc: 'Procesado en memoria volátil efímera sin almacenamiento persistente.',
    autoRepairTitle: 'Autorreparación Inteligente',
    autoRepairDesc: 'Corrige comas dañadas, unifica formatos de fecha y elimina columnas vacías.',
    delimitersTitle: 'Delimitadores Internacionales',
    delimitersDesc: 'Compatible automáticamente con coma (,), punto y coma (;), tabulación y barra (|).',

    companyLabel: 'Compañía',
    legalLabel: 'Legal',
    contactLabel: 'Contacto',
    founderSherSingh: 'Fundador (Sher Singh)',
    companyVenue: 'Sede de Servidores',
    privacyStandards: 'Estándares de Privacidad',
    privacyPolicy: 'Política de Privacidad',
    pricingTerms: 'Términos de Precios',
    termsOfService: 'Términos de Servicio',
    contactUs: 'Contáctenos',
    sla247: 'SLA 24/7 para PRO',
    allRightsReserved: 'Todos los derechos reservados.',
    heroSlogan: 'El limpiador de CSV más rápido y confidencial del mundo para equipos de datos.',

    dashboardNav: 'Panel',
    salesNav: 'Ventas',
    usersNav: 'Usuarios',
    reportsNav: 'Informes',

    confirmPlanModalTitle: 'Confirmar cambio de suscripción',
    confirmPlanModalDesc: 'Cambiando tu nivel de facturación según los términos prorrateados.',
    newTierLabel: 'Nuevo Nivel:',
    priceLabel: 'Precio:',
    renewalDateLabel: 'Fecha de Renovación:',
    confirmUpgradeButton: 'Confirmar Mejora',
    updatingButton: 'Actualizando...',

    adminDashboardTitle: 'Panel de Administrador',
    adminLoginTitle: 'Acceso de Administrador',
    username: 'Usuario',
    password: 'Contraseña',
    totalEarnings: 'Ingresos Totales',
    totalSales: 'Ventas Totales',
    totalCustomers: 'Clientes Totales',
    globalTrafficBreakdown: 'DISTRIBUCIÓN GLOBAL DE TRÁFICO',
    recentSales: 'VENTAS RECIENTES',
    allUsersList: 'LISTA DE TODOS LOS USUARIOS',
    searchUsers: 'Buscar usuarios o correo...',
    userName: 'Nombre',
    email: 'Correo',
    userType: 'Tipo',
    signUpDate: 'Fecha de registro',
    accountStatus: 'Estado',
    activeStatus: 'Activo',

    signUpHeadline: 'Regístrate y comienza gratis.',
    alreadyHaveAccount: '¿Ya tienes una cuenta? Inicia sesión',
    welcomeBack: '¡Bienvenido de nuevo!',
    pleaseLogIn: 'Por favor inicia sesión.',
    fullName: 'Nombre completo',
    confirmPassword: 'Confirmar contraseña',
    signUpButton: 'Registrarse / Crear cuenta',
    agreeTerms: 'Acepto los Términos y Condiciones',
    forgotPassword: '¿Olvidaste tu contraseña?',
    loginButton: 'Iniciar sesión / Continuar',
    orSignUpWith: 'O regístrate con:',
    orLogInWith: 'O inicia sesión con:',

    otherLanguagesNotice: 'Otros idiomas y configuraciones regionales disponibles',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },

  fr: {
    brandTitle: 'CleanCSV',
    products: 'Produits',
    solutions: 'Solutions',
    pricing: 'Tarifs',
    support: 'Support',
    login: 'Connexion',
    logout: 'Déconnexion',
    getStarted: 'Commencer Gratuitement',
    homeTab: 'Nettoyeur CSV',
    profileTab: 'Profil Client',
    adminTab: "Tableau d'administration",
    authTab: 'Connexion / Inscription',

    fileUploadHeader: 'Téléversement de fichier',
    dropFileOrUrl: 'Glissez un fichier ou collez une URL ici',
    chooseFile: 'Choisir un fichier',
    cleanAndDownload: '🚀 Nettoyer & Télécharger',
    downloadProcessedFile: 'Télécharger le fichier traité',
    processing: 'Traitement en cours...',
    filesDeletedNotice: '🔒 Vos fichiers sont définitivement supprimés après le téléchargement.',
    freeFilesUsed: '🎁 Fichiers gratuits utilisés',
    cleanedSuccessTitle: 'Fichier nettoyé avec succès !',
    downloadFile: '⬇️ Télécharger le fichier',
    previewData: '👁️ Aperçu des données',
    deleteFromServer: '🗑️ Supprimer du serveur',
    deleteConfirmed: 'Fichier effacé définitivement du serveur et de la mémoire.',
    trySampleData: '✨ Essayer un échantillon CSV',
    orPasteUrl: 'Ou coller une URL CSV web',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: 'Récupérer & Nettoyer',

    duplicatesRemoved: 'Doublons supprimés',
    cellsTrimmed: 'Cellules nettoyées',
    rowsCleaned: 'Lignes propres',

    customerProfileTitle: 'Profil Client',
    accountHeader: 'COMPTE DE SHER SINGH',
    proPlanBadge: 'FORFAIT PRO',
    planExpiryDate: "Date d'expiration",
    cancelAutoRenewal: 'Annuler le renouvellement',
    resumeAutoRenewal: 'Activer le renouvellement',
    paymentMethod: 'Moyen de paiement',
    totalCleanedFiles: 'Fichiers nettoyés',
    upgradePlans: 'METTRE À NIVEAU',
    selectPlan: 'CHOISIR CE FORFAIT',
    currentPlan: 'FORFAIT ACTUEL',
    saveWithYearly: 'Économisez avec le forfait annuel !',
    basicPlanTitle: 'BASIQUE',
    proPlanTitle: 'PRO',
    yearlyProPlanTitle: 'PRO ANNUEL',

    per5Days: '/ 5 jours',
    perMonth: '/ mois',
    perYear: '/ an',
    basicCleaningFeature: '10 nettoyages de fichiers',
    proCleaningFeature: 'Nettoyages illimités',
    yearlyProCleaningFeature: 'Nettoyages mensuels illimités',
    unlimitedAccessFeature: 'Accès illimité',
    prioritySupportFeature: 'Assistance prioritaire',
    priority247SupportFeature: 'Assistance prioritaire 24h/24 7j/7',
    currentChoiceBadge: 'Choix Recommandé',
    activeBadge: 'Actif',
    plansSubtitle: 'Forfaits flexibles conçus pour les équipes de données et analystes.',
    zeroRetentionBadge: '⚡ Garantie de rétention zéro sur tous les forfaits',

    founderAndCreator: 'Fondateur, Propriétaire & Créateur Unique',
    originalIdeaAndCreator: 'IDÉE ORIGINALE & CRÉATEUR',
    soleOwnerNoTeam: 'Projet SaaS indépendant · Aucune équipe externe',
    autoRenewalActiveNote: 'Le renouvellement automatique est activé. Facturation le 30-Nov-2026.',
    autoRenewalDisabledNote: 'Le renouvellement automatique est actuellement désactivé.',
    historicalTelemetryNote: '📊 Télémétrie historique du nettoyage sur tous vos espaces',

    deleteServerCustomerNote: 'En cliquant sur Supprimer, votre fichier est définitivement effacé de la mémoire.',
    zeroLogTitle: 'Confidentialité Sans Trace',
    zeroLogDesc: 'Traitement en mémoire vive volatile sans stockage sur disque persistant.',
    autoRepairTitle: 'Réparation Automatique Intelligente',
    autoRepairDesc: 'Répare les virgules brisées, harmonise les dates et supprime les colonnes vides.',
    delimitersTitle: 'Délimiteurs Internationaux',
    delimitersDesc: 'Prise en charge native de la virgule (,), point-virgule (;), tabulation et barre (|).',

    companyLabel: 'Société',
    legalLabel: 'Mentions Légales',
    contactLabel: 'Contact',
    founderSherSingh: 'Fondateur (Sher Singh)',
    companyVenue: 'Centres de Données',
    privacyStandards: 'Normes de Confidentialité',
    privacyPolicy: 'Politique de Confidentialité',
    pricingTerms: 'Conditions Tarifaires',
    termsOfService: "Conditions d'Utilisation",
    contactUs: 'Nous Contacter',
    sla247: 'SLA 24/7 pour le forfait PRO',
    allRightsReserved: 'Tous droits réservés.',
    heroSlogan: 'Le nettoyeur de CSV sans rétention le plus rapide au monde pour les équipes de données.',

    dashboardNav: 'Tableau de bord',
    salesNav: 'Ventes',
    usersNav: 'Utilisateurs',
    reportsNav: 'Rapports',

    confirmPlanModalTitle: "Confirmer le changement d'abonnement",
    confirmPlanModalDesc: 'Passage au forfait sélectionné avec facturation au prorata.',
    newTierLabel: 'Nouveau Forfait :',
    priceLabel: 'Tarif :',
    renewalDateLabel: 'Date de Renouvellement :',
    confirmUpgradeButton: 'Confirmer la mise à niveau',
    updatingButton: 'Mise à jour...',

    adminDashboardTitle: "Tableau d'administration",
    adminLoginTitle: 'Connexion Administrateur',
    username: 'Identifiant',
    password: 'Mot de passe',
    totalEarnings: 'Revenus Totaux',
    totalSales: 'Ventes Totales',
    totalCustomers: 'Clients Totaux',
    globalTrafficBreakdown: 'RÉPARTITION MONDIALE DU TRAFIC',
    recentSales: 'VENTES RÉCENTES',
    allUsersList: 'TOUS LES UTILISATEURS',
    searchUsers: 'Rechercher des utilisateurs...',
    userName: 'Nom',
    email: 'E-mail',
    userType: 'Type',
    signUpDate: "Date d'inscription",
    accountStatus: 'Statut',
    activeStatus: 'Actif',

    signUpHeadline: 'Inscrivez-vous gratuitement.',
    alreadyHaveAccount: 'Vous avez déjà un compte ? Connexion',
    welcomeBack: 'Bon retour parmi nous !',
    pleaseLogIn: 'Veuillez vous connecter.',
    fullName: 'Nom complet',
    confirmPassword: 'Confirmer le mot de passe',
    signUpButton: 'Créer un compte',
    agreeTerms: "J'accepte les conditions générales",
    forgotPassword: 'Mot de passe oublié ?',
    loginButton: 'Connexion / Continuer',
    orSignUpWith: 'Ou inscrivez-vous avec :',
    orLogInWith: 'Ou connectez-vous avec :',

    otherLanguagesNotice: 'Autres langues et paramètres régionaux disponibles',
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },

  zh: {
    brandTitle: 'CleanCSV',
    products: '产品',
    solutions: '解决方案',
    pricing: '价格',
    support: '支持',
    login: '登录',
    logout: '退出登录',
    getStarted: '免费开始使用',
    homeTab: 'CSV 清理工具',
    profileTab: '客户档案',
    adminTab: '管理后台',
    authTab: '登录 / 注册',

    fileUploadHeader: '上传文件',
    dropFileOrUrl: '拖放文件到此处或输入链接',
    chooseFile: '选择文件',
    cleanAndDownload: '🚀 清理并下载',
    downloadProcessedFile: '下载处理后的文件',
    processing: '正在处理中...',
    filesDeletedNotice: '🔒 下载完成后立即永久删除您的文件。',
    freeFilesUsed: '🎁 已用免费额度',
    cleanedSuccessTitle: '文件清理成功！',
    downloadFile: '⬇️ 下载文件',
    previewData: '👁️ 查看清理后的数据',
    deleteFromServer: '🗑️ 从服务器永久删除',
    deleteConfirmed: '文件已从服务器及内存中完全清除。',
    trySampleData: '✨ 试用示例杂乱 CSV',
    orPasteUrl: '或粘贴 CSV 网页地址',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: '获取并清理',

    duplicatesRemoved: '已删除重复行',
    cellsTrimmed: '已修剪单元格',
    rowsCleaned: '有效干净行',

    customerProfileTitle: '客户中心',
    accountHeader: 'SHER SINGH 的账户',
    proPlanBadge: '专业版 PRO',
    planExpiryDate: '计划到期日',
    cancelAutoRenewal: '取消自动续订',
    resumeAutoRenewal: '恢复自动续订',
    paymentMethod: '支付方式',
    totalCleanedFiles: '累计清理文件数',
    upgradePlans: '升级方案',
    selectPlan: '选择此方案',
    currentPlan: '当前方案',
    saveWithYearly: '选择年度方案立享特惠！',
    basicPlanTitle: '基础版',
    proPlanTitle: '专业版',
    yearlyProPlanTitle: '年度专业版',

    per5Days: '/ 5天',
    perMonth: '/ 月',
    perYear: '/ 年',
    basicCleaningFeature: '10次文件清理',
    proCleaningFeature: '无限次清理',
    yearlyProCleaningFeature: '全年无限次每月清理',
    unlimitedAccessFeature: '无限制访问',
    prioritySupportFeature: '优先客户支持',
    priority247SupportFeature: '24/7 全天候专属技术支持',
    currentChoiceBadge: '当前热门推荐',
    activeBadge: '生效中',
    plansSubtitle: '专为高吞吐量数据团队与企业级分析师打造的弹性方案。',
    zeroRetentionBadge: '⚡ 所有方案均提供零数据留存保障',

    founderAndCreator: '创始人、所有者及独立开发者',
    originalIdeaAndCreator: '原创创意与开发者',
    soleOwnerNoTeam: '独立 SaaS 研发 · 无外部团队',
    autoRenewalActiveNote: '自动续订处于激活状态。下次计费日期为 2026年11月30日。',
    autoRenewalDisabledNote: '自动续订已停用。到期后将失去权益。',
    historicalTelemetryNote: '📊 跨工作区的历史清理遥测数据',

    deleteServerCustomerNote: '点击删除后，文件将永久从内存与服务器中清除。',
    zeroLogTitle: '零日志高安全保证',
    zeroLogDesc: '仅在临时内存中处理，绝不在硬盘留存或提供给第三方模型。',
    autoRepairTitle: '智能自动纠错',
    autoRepairDesc: '自动修正引用文本中的损坏逗号、统一日期格式并剔除无效空列。',
    delimitersTitle: '跨国分隔符自动识别',
    delimitersDesc: '自动支持逗号(,)、分号(;)、制表符(\\t)及管道符(|)等格式。',

    companyLabel: '公司信息',
    legalLabel: '法律条款',
    contactLabel: '联系我们',
    founderSherSingh: '创始人 (Sher Singh)',
    companyVenue: '全球机房分布',
    privacyStandards: '隐私安全规范',
    privacyPolicy: '隐私政策',
    pricingTerms: '价格与条款',
    termsOfService: '服务协议',
    contactUs: '联系技术客服',
    sla247: '专业版 24/7 SLA 协议保障',
    allRightsReserved: '保留所有权利。',
    heroSlogan: '全球极速、零留存的企业级 CSV 自动化清洗引擎。',

    dashboardNav: '控制台',
    salesNav: '销售明细',
    usersNav: '用户列表',
    reportsNav: '报表导出',

    confirmPlanModalTitle: '确认方案变更',
    confirmPlanModalDesc: '确认切换方案，费用将按比例即时计算。',
    newTierLabel: '所选方案：',
    priceLabel: '费用：',
    renewalDateLabel: '续约日期：',
    confirmUpgradeButton: '确认升级',
    updatingButton: '正在处理...',

    adminDashboardTitle: '管理控制台',
    adminLoginTitle: '管理员登录',
    username: '用户名',
    password: '密码',
    totalEarnings: '总收益',
    totalSales: '总销售量',
    totalCustomers: '客户总数',
    globalTrafficBreakdown: '全球流量分布',
    recentSales: '最近销售记录',
    allUsersList: '所有用户列表',
    searchUsers: '搜索用户或邮箱...',
    userName: '用户名',
    email: '电子邮箱',
    userType: '用户类型',
    signUpDate: '注册日期',
    accountStatus: '账号状态',
    activeStatus: '正常运行',

    signUpHeadline: '立即注册，免费开启体验。',
    alreadyHaveAccount: '已有账户？立即登录',
    welcomeBack: '欢迎回来！',
    pleaseLogIn: '请登录您的账户。',
    fullName: '姓名',
    confirmPassword: '确认密码',
    signUpButton: '立即注册 / 创建账户',
    agreeTerms: '我同意服务条款与隐私政策',
    forgotPassword: '忘记密码？',
    loginButton: '登录 / 继续',
    orSignUpWith: '或通过以下方式注册：',
    orLogInWith: '或通过以下方式登录：',

    otherLanguagesNotice: '提供其他语言和区域设置选项',
    cancel: '取消',
    confirm: '确认',
  },

  ru: {
    brandTitle: 'CleanCSV',
    products: 'Продукты',
    solutions: 'Решения',
    pricing: 'Тарифы',
    support: 'Поддержка',
    login: 'Войти',
    logout: 'Выйти',
    getStarted: 'Начать Бесплатно',
    homeTab: 'Очистка CSV',
    profileTab: 'Профиль клиента',
    adminTab: 'Панель администратора',
    authTab: 'Вход / Регистрация',

    fileUploadHeader: 'Загрузка файла',
    dropFileOrUrl: 'Перетащите файл сюда или вставьте ссылку',
    chooseFile: 'Выбрать файл',
    cleanAndDownload: '🚀 Очистить и скачать',
    downloadProcessedFile: 'Скачать обработанный файл',
    processing: 'Обработка...',
    filesDeletedNotice: '🔒 Ваши файлы удаляются с сервера сразу после скачивания.',
    freeFilesUsed: '🎁 Использовано бесплатных файлов',
    cleanedSuccessTitle: 'Файл успешно очищен!',
    downloadFile: '⬇️ Скачать файл',
    previewData: '👁️ Просмотр данных',
    deleteFromServer: '🗑️ Удалить с сервера',
    deleteConfirmed: 'Файл навсегда удален из памяти и сервера.',
    trySampleData: '✨ Попробовать тестовый CSV',
    orPasteUrl: 'Или укажите прямую ссылку на CSV',
    urlPlaceholder: 'https://example.com/data.csv',
    fetchAndClean: 'Загрузить и очистить',

    duplicatesRemoved: 'Удалено дубликатов',
    cellsTrimmed: 'Очищено ячеек',
    rowsCleaned: 'Чистых строк',

    customerProfileTitle: 'Профиль клиента',
    accountHeader: 'АККАУНТ ШЕР СИНГХА',
    proPlanBadge: 'ТАРИФ PRO',
    planExpiryDate: 'Срок действия тарифа',
    cancelAutoRenewal: 'Отменить автопродление',
    resumeAutoRenewal: 'Включить автопродление',
    paymentMethod: 'Способ оплаты',
    totalCleanedFiles: 'Всего очищено файлов',
    upgradePlans: 'УЛУЧШИТЬ ТАРИФ',
    selectPlan: 'ВЫБРАТЬ ТАРИФ',
    currentPlan: 'ТЕКУЩИЙ ТАРИФ',
    saveWithYearly: 'Сэкономьте с годовым планом!',
    basicPlanTitle: 'БАЗОВЫЙ',
    proPlanTitle: 'PRO',
    yearlyProPlanTitle: 'ГОДОВОЙ PRO',

    per5Days: '/ 5 дней',
    perMonth: '/ месяц',
    perYear: '/ год',
    basicCleaningFeature: '10 очисток файлов',
    proCleaningFeature: 'Неограниченная очистка',
    yearlyProCleaningFeature: 'Неограниченная очистка круглый год',
    unlimitedAccessFeature: 'Неограниченный доступ',
    prioritySupportFeature: 'Приоритетная поддержка',
    priority247SupportFeature: 'Приоритетная поддержка 24/7',
    currentChoiceBadge: 'Рекомендуемый выбор',
    activeBadge: 'Активен',
    plansSubtitle: 'Гибкие тарифы для аналитиков данных и корпоративных команд.',
    zeroRetentionBadge: '⚡ Гарантия нулевого сохранения данных на всех тарифах',

    founderAndCreator: 'Основатель, Владелец и Единственный Создатель',
    originalIdeaAndCreator: 'ОРИГИНАЛЬНАЯ ИДЕЯ И СОЗДАТЕЛЬ',
    soleOwnerNoTeam: 'Независимый SaaS проект · Без внешней команды',
    autoRenewalActiveNote: 'Автопродление активно. Следующее списание: 30-Nov-2026.',
    autoRenewalDisabledNote: 'Автопродление отключено.',
    historicalTelemetryNote: '📊 История очистки данных по всем рабочим пространствам',

    deleteServerCustomerNote: 'При нажатии «Удалить» файл немедленно и безвозвратно удаляется.',
    zeroLogTitle: 'Полная конфиденциальность',
    zeroLogDesc: 'Обработка в оперативной памяти без сохранения на жестких дисках.',
    autoRepairTitle: 'Интеллектуальное автоисправление',
    autoRepairDesc: 'Исправляет запятые в кавычках, стандартизирует даты и удаляет пустые столбцы.',
    delimitersTitle: 'Международные разделители',
    delimitersDesc: 'Поддержка запятых (,), точки с запятой (;), табуляции и вертикальной черты (|).',

    companyLabel: 'Компания',
    legalLabel: 'Юридическая информация',
    contactLabel: 'Контакты',
    founderSherSingh: 'Основатель (Sher Singh)',
    companyVenue: 'Расположение серверов',
    privacyStandards: 'Стандарты конфиденциальности',
    privacyPolicy: 'Политика конфиденциальности',
    pricingTerms: 'Условия оплаты',
    termsOfService: 'Условия использования',
    contactUs: 'Связаться с нами',
    sla247: 'SLA 24/7 для PRO',
    allRightsReserved: 'Все права защищены.',
    heroSlogan: 'Самый быстрый в мире сервис очистки CSV с гарантией конфиденциальности.',

    dashboardNav: 'Панель',
    salesNav: 'Продажи',
    usersNav: 'Пользователи',
    reportsNav: 'Отчеты',

    confirmPlanModalTitle: 'Подтверждение смены тарифа',
    confirmPlanModalDesc: 'Переход на новый тариф с перерасчетом стоимости.',
    newTierLabel: 'Новый тариф:',
    priceLabel: 'Стоимость:',
    renewalDateLabel: 'Дата продления:',
    confirmUpgradeButton: 'Подтвердить смену',
    updatingButton: 'Обновление...',

    adminDashboardTitle: 'Панель администратора',
    adminLoginTitle: 'Вход для администратора',
    username: 'Имя пользователя',
    password: 'Пароль',
    totalEarnings: 'Общий доход',
    totalSales: 'Всего продаж',
    totalCustomers: 'Всего клиентов',
    globalTrafficBreakdown: 'РАСПРЕДЕЛЕНИЕ ТРАФИКА',
    recentSales: 'ПОСЛЕДНИЕ ПРОДАЖИ',
    allUsersList: 'СПИСОК ВСЕХ ПОЛЬЗОВАТЕЛЕЙ',
    searchUsers: 'Поиск пользователя...',
    userName: 'Имя',
    email: 'Email',
    userType: 'Тип',
    signUpDate: 'Дата регистрации',
    accountStatus: 'Статус',
    activeStatus: 'Активен',

    signUpHeadline: 'Зарегистрируйтесь бесплатно.',
    alreadyHaveAccount: 'Уже есть аккаунт? Войти',
    welcomeBack: 'С возвращением!',
    pleaseLogIn: 'Пожалуйста, выполните вход.',
    fullName: 'Полное имя',
    confirmPassword: 'Подтвердите пароль',
    signUpButton: 'Создать аккаунт',
    agreeTerms: 'Я принимаю Условия обслуживания',
    forgotPassword: 'Забыли пароль?',
    loginButton: 'Войти / Продолжить',
    orSignUpWith: 'Или зарегистрироваться через:',
    orLogInWith: 'Или войти через:',

    otherLanguagesNotice: 'Доступны другие языки и региональные настройки',
    cancel: 'Отмена',
    confirm: 'Применить',
  },
};
