let currentLang = localStorage.getItem("2dpro_lang") || "mm";

const translations = {
  mm: {
    appTitle: "2D Pro System",
    authSubtitle: "စနစ်ကို အသုံးပြုရန် အကောင့်ဝင်ပါ",
    authEmailPlaceholder: "အီးမေးလ် (Email)",
    authPasswordPlaceholder: "လျှို့ဝှက်နံပါတ် (Password)",
    authLogin: "🔑 ဝင်ရောက်မည်",
    authNotice:
      "⚠️ အကောင့်မရှိသေးပါက သို့မဟုတ် အသုံးပြုခွင့်သက်တမ်း တိုးလိုပါက Telegram - @nyinyilynn ထံ တိုက်ရိုက် ဆက်သွယ်၍ အကောင့်ရယူပါ။",
    userLabel: "👤 User:",
    logout: "ထွက်မည် 🚪",
    tabCalc: "📊 တွက်ချက်မည်",
    tabHistory: "📜 စာရင်းဟောင်းများ",
    calcTitle: "2D တွက်ချက်ရေးစနစ်",
    settingsTitle: "⚙️ ချိန်ညှိချက်များ",
    commission: "ကော်မရှင် (%)",
    myProfit: "မိမိအမြတ် (%)",
    dateSelectTitle: "📅 တွက်ချက်မည့် ရက်စွဲရွေးချယ်ရန်",
    morningSection: "☀️ မနက်ပိုင်း",
    eveningSection: "🌙 ညနေပိုင်း",
    salesLabel: "ရောင်းရငွေ (T)",
    payoutLabel: "လျော်ရငွေ (P)",
    autoSaveLabel: "ဒေတာကို Database ထဲသို့ တခါတည်း သိမ်းဆည်းမည်",
    btnCalculate: "တွက်ချက်မည် 📊",
    amResultTitle: "☀️ မနက်ပိုင်း ရလဒ်",
    pmResultTitle: "🌙 ညနေပိုင်း ရလဒ်",
    originSales: "📥 ရောင်းရငွေ (T):",
    originPayout: "💸 လျော်ရငွေ (P):",
    commAdjustedSales: "ကော်မရှင်နုတ်ပြီး အရောင်း:",
    actualPayout: "အမှန်လျော်ရငွေ (x80):",
    dealerProfit: "Total Profit (ဒိုင်အမြတ်):",
    myProfitAmount: "မိမိအမြတ်ငွေ:",
    totalDealerProfit: "📊 စုစုပေါင်း ဒိုင်အမြတ်ငွေ (Total Profit)",
    totalMyProfit: "💰 စုစုပေါင်း မိမိအမြတ်ငွေ",
    btnManualSave: "💾 ဤရလဒ်ကို Database တွင် သိမ်းဆည်းမည်",
    weeklyBlockDefault: "📅 လက်ရှိပတ် Weekly Block",
    historyTitle: "📅 ကာလအလိုက် စာရင်းချုပ်",
    filterWeek: "ဒီတစ်ပတ်စာ Block",
    filterMonth: "ဒီလစာ Blocks",
    filterAll: "အားလုံး (နှစ်ချုပ်ပြက္ခဒိန်)",
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
    toastLoginSuccess: "✅ အကောင့်ဝင်ခြင်း အောင်မြင်ပါသည်။",
    toastFillEmailPassword: "⚠️ Email နှင့် Password ဖြည့်ပါ။",
    toastLoginFailed:
      "❌ အကောင့်ဝင်ခွင့်မရှိပါ။ အီးမေးလ်/လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည် သို့မဟုတ် အကောင့်ကို Admin ဘက်မှ မတည်ဆောက်ပေးရသေးပါ။",
    toastLoginError: "❌ Login ဝင်ခြင်း မအောင်မြင်ပါ- {msg}",
    toastFillData: "⚠️ ဒေတာ ဖြည့်သွင်းပါ။",
    toastPreviewOnly:
      "📊 တွက်ချက်မှု ရလဒ်ကိုသာ ပြသထားပါသည်။ ဒေတာဘေ့စ်တွင် သိမ်းဆည်းလိုပါက အောက်ဆုံးရှိ ခလုတ်ကို နှိပ်နိုင်ပါတယ်ဗျာ။",
    toastSaveSuccess: "✅ စာရင်းအား ဒေတာဘေ့စ်ထဲသို့ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီဗျာ။",
    toastSaveFailed: "❌ ဒေတာသိမ်းဆည်းမှု မအောင်မြင်ပါ။",
    toastInvalidInput: "⚠️ မှန်ကန်သော နံပါတ်များသာ ထည့်သွင်းပါ (အနုတ်မထည့်ရ)။",
    toastInvalidCommission: "⚠️ ကော်မရှင် ၀% မှ ၁၀၀% အတွင်း မှန်ကန်သော နံပါတ် ထည့်ပါ။",
    toastInvalidMyProfit: "⚠️ မိမိအမြတ် ၀% မှ ၁၀၀% အတွင်း မှန်ကန်သော နံပါတ် ထည့်ပါ။",
    toastInvalidDate: "⚠️ တွက်ချက်မည့် ရက်စွဲ ရွေးချယ်ပါ။",
    toastInvalidField: "⚠️ {field} တွင် မှန်ကန်သော နံပါတ် ထည့်ပါ။",
    noData: "ဒေတာမရှိသေးပါ။",
    close: "❌ ပိတ်မည်",
    backToMonths: "⬅️ လချုပ်များသို့ ပြန်သွားရန်",
    backToWeeks: "⬅️ အပတ်စဉ်စာရင်းများသို့ ပြန်သွားရန်",
    dealerTotal: "ဒိုင်ချုပ်:",
    myTotal: "မိမိချုပ်:",
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
    logout: "Sign Out 🚪",
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
    autoSaveLabel: "Save to database automatically",
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
    btnManualSave: "💾 Save this result to database",
    weeklyBlockDefault: "📅 Current Week Block",
    historyTitle: "📅 Period Summary",
    filterWeek: "This Week Block",
    filterMonth: "This Month Blocks",
    filterAll: "All (Year Calendar)",
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
    toastLoginSuccess: "✅ Signed in successfully.",
    toastFillEmailPassword: "⚠️ Please enter email and password.",
    toastLoginFailed:
      "❌ Access denied. Invalid email/password or account not created by Admin.",
    toastLoginError: "❌ Login failed: {msg}",
    toastFillData: "⚠️ Please enter data.",
    toastPreviewOnly:
      "📊 Showing calculation results only. Click the button below to save to database.",
    toastSaveSuccess: "✅ Record saved to database successfully.",
    toastSaveFailed: "❌ Failed to save data.",
    toastInvalidInput: "⚠️ Enter valid numbers only (no negatives).",
    toastInvalidCommission: "⚠️ Enter a valid commission between 0% and 100%.",
    toastInvalidMyProfit: "⚠️ Enter a valid my-profit between 0% and 100%.",
    toastInvalidDate: "⚠️ Please select a calculation date.",
    toastInvalidField: "⚠️ Enter a valid number for {field}.",
    noData: "No data yet.",
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
