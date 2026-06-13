let currentLang = localStorage.getItem("2dpro_lang") || "mm";

const translations = {
  mm: {
    appTitle: "2D Pro System",
    authSubtitle: "စနစ်ကို အသုံးပြုရန် အကောင့်ဝင်ပါ",
    authEmailPlaceholder: "အီးမေးလ်",
    authPasswordPlaceholder: "လျှို့ဝှက်နံပါတ်",
    authLogin: "🔑 ဝင်ရောက်မည်",
    authNotice:
      "⚠️ အကောင့်မရှိသေးပါက သို့မဟုတ် အသုံးပြုခွင့်သက်တမ်း တိုးလိုပါက Telegram - @nyinyilynn ထံ တိုက်ရိုက် ဆက်သွယ်၍ အကောင့်ရယူပါ။",
    userLabel: "👤 User:",
    logout: "ထွက်မည်",
    menuProfile: "ကျွန်ုပ်၏ ပရိုဖိုင်",
    menuCalculator: "အမြတ်ရာခိုင်နှုန်း တွက်ချက်ရန်",
    menuHistory: "အပတ်စဉ် မှတ်တမ်း",
    menuSettings: "ချိန်ညှိချက်များ",
    settingsPageTitle: "⚙️ ချိန်ညှိချက်များ",
    displayNameLabel: "အသုံးပြုသူအမည်",
    languageSetting: "ဘာသာစကား",
    languageSettingHint: "မြန်မာ / English ပြောင်းရန်",
    tabCalc: "📊 တွက်ချက်မည်",
    tabHistory: "📜 စာရင်းဟောင်းများ",
    calcTitle: "အမြတ်ရာခိုင်နှုန်း တွက်ချက်ရေးစနစ်",
    settingsTitle: "⚙️ ချိန်ညှိချက်များ",
    commission: "ကော်မရှင် (%)",
    myProfit: "မိမိအမြတ် (%)",
    dateSelectTitle: "📅 တွက်ချက်မည့် ရက်စွဲရွေးချယ်ရန်",
    morningSection: "☀️ မနက်ပိုင်း",
    eveningSection: "🌙 ညနေပိုင်း",
    salesLabel: "ရောင်းရငွေ (T)",
    payoutLabel: "လျော်ရငွေ (P)",
    autoSaveLabel: "တွက်ချက်ပြီးပါက စနစ်တွင်းသို့ အလိုအလျောက် သိမ်းဆည်းမည်",
    btnCalculate: "တွက်ချက်မည် 📊",
    amResultTitle: "☀️ မနက်ပိုင်း ရလဒ်",
    pmResultTitle: "🌙 ညနေပိုင်း ရလဒ်",
    originSales: "📥 ရောင်းရငွေ (T):",
    originPayout: "💸 လျော်ရငွေ (P):",
    commAdjustedSales: "ကော်မရှင်နုတ်ပြီး အရောင်း:",
    actualPayout: "အမှန်လျော်ရငွေ (x80):",
    dealerProfit: "ဒိုင်အမြတ်ငွေ:",
    myProfitAmount: "မိမိအမြတ်ငွေ:",
    totalDealerProfit: "📊 စုစုပေါင်း ဒိုင်အမြတ်ငွေ",
    totalMyProfit: "💰 စုစုပေါင်း မိမိအမြတ်ငွေ",
    btnManualSave: "💾 စနစ်တွင်းသို့ သိမ်းဆည်းမည်",
    weeklyBlockDefault: "📅 ယခုအပတ် စာရင်းချုပ်",
    historyTitle: "📜 အပတ်စဉ် မှတ်တမ်း",
    filterWeek: "ယခုအပတ် စာရင်းချုပ်",
    filterMonth: "ယခုလ စာရင်းချုပ်",
    filterAll: "အားလုံး (နှစ်စဉ် အကျဉ်းချုပ်)",
    thDate: "ရက်စွဲ (နေ့)",
    thAmDealer: "မနက်(ဒိုင်)",
    thAmMy: "မနက်(မိမိ)",
    thPmDealer: "ညနေ(ဒိုင်)",
    thPmMy: "ညနေ(မိမိ)",
    thTotalDealer: "စုစုပေါင်း(ဒိုင်)",
    thTotalMy: "စုစုပေါင်း(မိမိ)",
    currency: "ကျပ်",
    total: "Total",
    loading: "ခေတ္တစောင့်ဆိုင်းပါ...",
    langToggle: "EN",
    toastLoginSuccess: "✅ ကြိုဆိုပါတယ်။ အကောင့်ဝင်ခြင်း အောင်မြင်ပါသည်။",
    toastFillEmailPassword: "⚠️ ကျေးဇူးပြု၍ အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ်ကို ဖြည့်သွင်းပေးပါ။",
    toastLoginFailed:
      "❌ အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။ အီးမေးလ် သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်။ အကောင့်မရှိသေးပါက ဆက်သွယ်ပြီး အကောင့်ရယူပါ။",
    toastLoginError: "❌ အကောင့်ဝင်ရာတွင် အခက်အခဲရှိနေပါသည်။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ။",
    toastFillData: "⚠️ ကျေးဇူးပြု၍ အရောင်းနှင့် အလျော်ပမာဏများကို မှန်ကန်စွာ ဖြည့်သွင်းပေးပါ။",
    toastPreviewOnly:
      "📊 တွက်ချက်မှု ရလဒ်ကို ပြသထားပါသည်။ စနစ်တွင်းသို့ သိမ်းဆည်းလိုပါက အောက်ပါ ခလုတ်ကို နှိပ်ပါ။",
    toastSaveSuccess: "✅ သင်၏ စာရင်းကို စနစ်တွင်းသို့ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။",
    toastSaveFailed: "❌ စာရင်းသိမ်းဆည်းရာတွင် အခက်အခဲရှိနေပါသည်။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ။",
    toastWeekendNoSave:
      "⚠️ စနေနှင့် တနင်္ဂနွေနေ့များအတွက် စမ်းသပ်တွက်ချက်မှုသာ ပြုလုပ်နိုင်ပြီး စနစ်တွင်းသို့ စာရင်းသိမ်းဆည်းခွင့် မရှိပါ။",
    toastInvalidInput: "⚠️ ကျေးဇူးပြု၍ မှန်ကန်သော နံပါတ်များသာ ထည့်သွင်းပေးပါ (အနုတ်ဂဏန်းများ မထည့်ရပါ)။",
    toastInvalidCommission: "⚠️ ကျေးဇူးပြု၍ ကော်မရှင် ရာခိုင်နှုန်းကို ၀% မှ ၁၀၀% အတွင်း မှန်ကန်စွာ ထည့်သွင်းပေးပါ။",
    toastInvalidMyProfit: "⚠️ ကျေးဇူးပြု၍ မိမိအမြတ် ရာခိုင်နှုန်းကို ၀% မှ ၁၀၀% အတွင်း မှန်ကန်စွာ ထည့်သွင်းပေးပါ။",
    toastInvalidDate: "⚠️ ကျေးဇူးပြု၍ တွက်ချက်မည့် ရက်စွဲကို ရွေးချယ်ပေးပါ။",
    toastInvalidField: "⚠️ ကျေးဇူးပြု၍ {field} တွင် မှန်ကန်သော နံပါတ် ထည့်သွင်းပေးပါ။",
    noData: "မှတ်တမ်းများ မရှိသေးပါ။",
    close: "❌ ပိတ်မည်",
    backToMonths: "⬅️ လချုပ်များသို့ ပြန်သွားရန်",
    backToWeeks: "⬅️ အပတ်စဉ်စာရင်းများသို့ ပြန်သွားရန်",
    dealerTotal: "ဒိုင်စုစုပေါင်း:",
    myTotal: "မိမိစုစုပေါင်း:",
    myResult: "မိမိရလဒ်:",
    weeklySummaries: "(အပတ်စဉ် အနှစ်ချုပ်များ)",
    yearRecords: "ခုနှစ် စာရင်းချုပ်များ",
    weekSummary: "စာရင်းချုပ် (တနင်္လာ - သောကြာ)",
    detailTitle: "တစ်ရက်စာ အသေးစိတ်",
    detailDate: "📋 ရက်စွဲ - {date} ({day})",
    dealerProfitShort: "ဒိုင်အမြတ်:",
    myProfitShort: "မိမိအမြတ်:",
    totalDealerShort: "📊 စုစုပေါင်း ဒိုင်အမြတ်",
    totalMyShort: "💰 စုစုပေါင်း မိမိအမြတ်",
    fromTo: "မှ",
    week1: "ပထမအပတ်",
    week2: "ဒုတိယအပတ်",
    week3: "တတိယအပတ်",
    week4: "စတုတ္ထအပတ်",
    week5: "ပဉ္စမအပတ်",
    daySun: "တနင်္ဂနွေ",
    dayMon: "တနင်္လာ",
    dayTue: "အင်္ဂါ",
    dayWed: "ဗုဒ္ဓဟူး",
    dayThu: "ကြာသပတေး",
    dayFri: "သောကြာ",
    daySat: "စနေ",
    month1: "ဇန်နဝါရီလ",
    month2: "ဖေဖော်ဝါရီလ",
    month3: "မတ်လ",
    month4: "ဧပြီလ",
    month5: "မေလ",
    month6: "ဇွန်လ",
    month7: "ဇူလိုင်လ",
    month8: "သြဂုတ်လ",
    month9: "စက်တင်ဘာလ",
    month10: "အောက်တိုဘာလ",
    month11: "နိုဝင်ဘာလ",
    month12: "ဒီဇင်ဘာလ",
    yearSuffix: "ခုနှစ်",
  },
  en: {
    appTitle: "2D Pro System",
    authSubtitle: "Sign in to use the system",
    authEmailPlaceholder: "Email",
    authPasswordPlaceholder: "Password",
    authLogin: "🔑 Sign In",
    authNotice:
      "⚠️ If you don't have an account or need to renew access, contact Telegram @nyinyilynn directly.",
    userLabel: "👤 User:",
    logout: "Sign Out",
    menuProfile: "My Profile",
    menuCalculator: "2D Calculator",
    menuHistory: "History & Reports",
    menuSettings: "Settings",
    settingsPageTitle: "⚙️ Settings",
    displayNameLabel: "Display Name",
    languageSetting: "Language",
    languageSettingHint: "Switch between Myanmar and English",
    tabCalc: "📊 Calculate",
    tabHistory: "📜 History",
    calcTitle: "2D Profit Calculator",
    settingsTitle: "⚙️ Settings",
    commission: "Commission (%)",
    myProfit: "My Profit (%)",
    dateSelectTitle: "📅 Select calculation date",
    morningSection: "☀️ Morning Session",
    eveningSection: "🌙 Evening Session",
    salesLabel: "Sales (T)",
    payoutLabel: "Payout (P)",
    autoSaveLabel: "Save to system automatically after calculation",
    btnCalculate: "Calculate 📊",
    amResultTitle: "☀️ Morning Results",
    pmResultTitle: "🌙 Evening Results",
    originSales: "📥 Sales (T):",
    originPayout: "💸 Payout (P):",
    commAdjustedSales: "Sales after commission:",
    actualPayout: "Actual payout (x80):",
    dealerProfit: "Total Profit (Dealer):",
    myProfitAmount: "My profit:",
    totalDealerProfit: "📊 Total Dealer Profit",
    totalMyProfit: "💰 Total My Profit",
    btnManualSave: "💾 Save to system",
    weeklyBlockDefault: "📅 Current week summary",
    historyTitle: "📜 Weekly records",
    filterWeek: "This week summary",
    filterMonth: "This month summary",
    filterAll: "All (year overview)",
    thDate: "Date (Day)",
    thAmDealer: "AM (Dealer)",
    thAmMy: "AM (My)",
    thPmDealer: "PM (Dealer)",
    thPmMy: "PM (My)",
    thTotalDealer: "Total (Dealer)",
    thTotalMy: "Total (My)",
    currency: "Ks",
    total: "Total",
    loading: "Please wait...",
    langToggle: "MM",
    toastLoginSuccess: "✅ Welcome back. You have signed in successfully.",
    toastFillEmailPassword: "⚠️ Please enter your email and password.",
    toastLoginFailed:
      "❌ Sign-in failed. Please check your email and password, or contact support for an account.",
    toastLoginError: "❌ Unable to sign in. Please try again.",
    toastFillData: "⚠️ Please enter valid sales and payout amounts.",
    toastPreviewOnly:
      "📊 Showing calculation results. Tap the button below to save to the system.",
    toastSaveSuccess: "✅ Your record has been saved to the system successfully.",
    toastSaveFailed: "❌ Unable to save the record. Please try again.",
    toastWeekendNoSave:
      "⚠️ Saturday and Sunday are preview-only. Saving records to the system is not allowed on weekends.",
    toastInvalidInput: "⚠️ Please enter valid numbers only (negative values are not allowed).",
    toastInvalidCommission: "⚠️ Please enter a commission rate between 0% and 100%.",
    toastInvalidMyProfit: "⚠️ Please enter a my-profit rate between 0% and 100%.",
    toastInvalidDate: "⚠️ Please select a calculation date.",
    toastInvalidField: "⚠️ Please enter a valid number for {field}.",
    noData: "No records yet.",
    close: "❌ Close",
    backToMonths: "⬅️ Back to monthly summaries",
    backToWeeks: "⬅️ Back to weekly summaries",
    dealerTotal: "Dealer total:",
    myTotal: "My total:",
    myResult: "My result:",
    weeklySummaries: "(Weekly summaries)",
    yearRecords: "Year records",
    weekSummary: "Summary (Mon - Fri)",
    detailTitle: "Daily detail",
    detailDate: "📋 Date - {date} ({day})",
    dealerProfitShort: "Dealer profit:",
    myProfitShort: "My profit:",
    totalDealerShort: "📊 Total dealer profit",
    totalMyShort: "💰 Total my profit",
    fromTo: "to",
    week1: "Week 1",
    week2: "Week 2",
    week3: "Week 3",
    week4: "Week 4",
    week5: "Week 5",
    daySun: "Sunday",
    dayMon: "Monday",
    dayTue: "Tuesday",
    dayWed: "Wednesday",
    dayThu: "Thursday",
    dayFri: "Friday",
    daySat: "Saturday",
    month1: "January",
    month2: "February",
    month3: "March",
    month4: "April",
    month5: "May",
    month6: "June",
    month7: "July",
    month8: "August",
    month9: "September",
    month10: "October",
    month11: "November",
    month12: "December",
    yearSuffix: "",
  },
};

function t(key, params = {}) {
  const dict = translations[currentLang] || translations.mm;
  let str = dict[key] ?? translations.mm[key] ?? key;
  Object.keys(params).forEach((k) => {
    str = str.replace(`{${k}}`, params[k]);
  });
  return str;
}

function applyLanguage() {
  document.documentElement.lang = currentLang === "mm" ? "my" : "en";
  document.title = `2D Pro - Version 2.6 (${currentLang === "mm" ? "MM" : "EN"})`;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });

  document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
    btn.textContent = t("langToggle");
    btn.title = currentLang === "mm" ? "Switch to English" : "မြန်မာသို့ပြောင်းရန်";
  });

  if (typeof updateHeaderTitle === "function") updateHeaderTitle();
  if (typeof updateSidebarActiveItem === "function") updateSidebarActiveItem();
}

function toggleLanguage() {
  currentLang = currentLang === "mm" ? "en" : "mm";
  localStorage.setItem("2dpro_lang", currentLang);
  applyLanguage();
  if (typeof onLanguageChanged === "function") onLanguageChanged();
}

function getLocalizedDayName(dateString) {
  const keys = ["daySun", "dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat"];
  return t(keys[new Date(dateString).getDay()]);
}

function getLocalizedMonthName(m) {
  return t(`month${m}`);
}

function getLocalizedWeekName(dateString) {
  const date = new Date(dateString).getDate();
  if (date <= 7) return t("week1");
  if (date <= 14) return t("week2");
  if (date <= 21) return t("week3");
  if (date <= 28) return t("week4");
  return t("week5");
}

function formatCurrency(amount) {
  return `${Math.round(amount).toLocaleString()} ${t("currency")}`;
}

function getTableHeadersHtml() {
  return `<tr>
    <th>${t("thDate")}</th>
    <th>${t("thAmDealer")}</th>
    <th>${t("thAmMy")}</th>
    <th>${t("thPmDealer")}</th>
    <th>${t("thPmMy")}</th>
    <th>${t("thTotalDealer")}</th>
    <th>${t("thTotalMy")}</th>
  </tr>`;
}
