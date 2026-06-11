let currentFilter = "week";
let selectedYear = 2026;
let navigationState = { level: "root", month: null, weekNum: null };
let dbCachedRecords = [];

// ==========================================================================
// 🆕 AUTHENTICATION CORE LOGIC (VERSION 2.5 - LOGIN ONLY)
// ==========================================================================

// App စတင်ပွင့်လာချိန်တွင် အကောင့်ဝင်ထားခြင်း ရှိ/မရှိ စစ်ဆေးခြင်း
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        showMainApp(session.user);
    } else {
        showAuthScreen();
    }
    
    // Calendar auto today select logic
    const dateInput = document.getElementById('calcTargetDate');
    if(dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
});

function showMainApp(user) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainAppSection').style.display = 'block';
    document.getElementById('userDisplayEmail').innerText = user.email.split('@')[0];
    renderHistoryVisual();
}

function showAuthScreen() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainAppSection').style.display = 'none';
}

// အကောင့်ဝင်ခြင်း (Log In) - Admin ဆောက်ပေးထားသော အကောင့်သာ ဝင်ခွင့်ရမည်
async function handleLogin() {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    if(!email || !password) { alert("⚠️ Email နှင့် Password ဖြည့်ပါ။"); return; }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (error) {
        // Supabase က Public Sign-up ပိတ်ထားချိန်တွင် မရှိတဲ့အကောင့်နဲ့ လာဝင်ရင် ဖြစ်စေ၊ Password မှားရင်ဖြစ်စေ တက်မည့် Error များ
        if (error.message.includes("Invalid login credentials")) {
            alert("❌ အကောင့်ဝင်ခွင့်မရှိပါ။ အီးမေးလ်/လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည် သို့မဟုတ် အကောင့်ကို Admin ဘက်မှ မတည်ဆောက်ပေးရသေးပါ။");
        } else {
            alert("❌ Login ဝင်ခြင်း မအောင်မြင်ပါ- " + error.message);
        }
    } else {
        showMainApp(data.user);
    }
}

// အကောင့်ထွက်ခြင်း (Log Out)
async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    showAuthScreen();
    document.getElementById('authEmail').value = "";
    document.getElementById('authPassword').value = "";
    document.getElementById('resultBoard').style.display = 'none';
}

// ==========================================================================
// BUSINESS LOGIC & COMPONENT RENDERING (V2.2 MOVED INSIDE)
// ==========================================================================

function getMyanmarWeekName(dateString) {
  const date = new Date(dateString).getDate();
  if (date <= 7) return "ပထမအပတ်";
  if (date <= 14) return "ဒုတိယအပတ်";
  if (date <= 21) return "တတိယအပတ်";
  if (date <= 28) return "စတုတ္ထအပတ်";
  return "ပဉ္စမအပတ်";
}

function getMyanmarDayName(dateString) {
  const days = [
    "တနင်္ဂနွေ",
    "တနင်္လာ",
    "အင်္ဂါ",
    "ဗုဒ္ဓဟူး",
    "ကြာသပတေး",
    "သောကြာ",
    "စနေ",
  ];
  return days[new Date(dateString).getDay()];
}

function getMonthNameMM(m) {
  const months = [
    "",
    "ဇန်နဝါရီလ",
    "ဖေဖော်ဝါရီလ",
    "မတ်လ",
    "ဧပြီလ",
    "မေလ",
    "ဇွန်လ",
    "ဇူလိုင်လ",
    "သြဂုတ်လ",
    "စက်တင်ဘာလ",
    "အောက်တိုဘာလ",
    "နိုဝင်ဘာလ",
    "ဒီဇင်ဘာလ",
  ];
  return months[m];
}

function getWeekNumber(dateString) {
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
}

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (event) event.currentTarget.classList.add("active");
  document.getElementById("singleDayDetailBoard").style.display = "none";
}

function toggleFilterBtn(btn) {
  document
    .querySelectorAll(".filter-box button")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("singleDayDetailBoard").style.display = "none";
}

function setupYearSelector() {
  const selector = document.getElementById("yearSelector");
  selector.innerHTML = "";
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 3; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.innerText = `📅 ${y} ခုနှစ် စာရင်းချုပ်များ`;
    selector.appendChild(opt);
  }
  selectedYear = currentYear;
}

function handleYearChange() {
  selectedYear = parseInt(document.getElementById("yearSelector").value);
  navigationState = { level: "root", month: null, weekNum: null };
  renderHistoryVisual();
}

function changeFilter(type) {
  currentFilter = type;
  navigationState = { level: "root", month: null, weekNum: null };
  document.getElementById("calendarContainer").style.display =
    type === "all" ? "block" : "none";
  if (type === "all" && !document.getElementById("yearSelector").innerHTML)
    setupYearSelector();
  renderHistoryVisual();
}

function generateBlockRows(records) {
  let html = "";
  let tAmProf = 0,
    tAmMy = 0,
    tPmProf = 0,
    tPmMy = 0,
    tDay = 0,
    tMy = 0;
  const sorted = [...records].sort(
    (a, b) => new Date(a.record_date) - new Date(b.record_date),
  );

  sorted.forEach((row) => {
    const dayName = getMyanmarDayName(row.record_date);
    if (dayName === "စနေ" || dayName === "တနင်္ဂနွေ") return;

    const amSales = row.am_sales || 0;
    const amPayout = row.am_payout || 0;
    const amProf = Math.round(
      amSales * (1 - row.comm_percent / 100) - amPayout * 80,
    );
    const amMy = Math.round(amProf * (row.my_profit_percent / 100));
    const pmSales = row.pm_sales || 0;
    const pmPayout = row.pm_payout || 0;
    const pmProf = Math.round(
      pmSales * (1 - row.comm_percent / 100) - pmPayout * 80,
    );
    const pmMy = Math.round(pmProf * (row.my_profit_percent / 100));

    const dTot = amProf + pmProf;
    const mTot = amMy + pmMy;
    tAmProf += amProf;
    tAmMy += amMy;
    tPmProf += pmProf;
    tPmMy += pmMy;
    tDay += dTot;
    tMy += mTot;

    const mth = row.record_date.substring(5, 7);
    const day = row.record_date.substring(8, 10);

    html += `
            <tr onclick="showSingleDayDetail('${row.record_date}')">
                <td>${mth}/${day}<br>(${dayName})</td>
                <td class="${amProf < 0 ? "minus-text" : ""}">${amProf.toLocaleString()}</td>
                <td class="${amMy < 0 ? "minus-text" : ""}">${amMy.toLocaleString()}</td>
                <td class="${pmProf < 0 ? "minus-text" : ""}">${pmProf.toLocaleString()}</td>
                <td class="${pmMy < 0 ? "minus-text" : ""}">${pmMy.toLocaleString()}</td>
                <td class="${dTot < 0 ? "minus-text" : "blue-text"}" style="font-weight:600;">${dTot.toLocaleString()}</td>
                <td class="${mTot < 0 ? "minus-text" : "plus-text"}" style="font-weight:600;">${mTot.toLocaleString()}</td>
            </tr>
        `;
  });

  html += `
        <tr class="total-row">
            <td>Total</td>
            <td class="${tAmProf < 0 ? "minus-text" : ""}">${tAmProf.toLocaleString()}</td>
            <td class="${tAmMy < 0 ? "minus-text" : ""}">${tAmMy.toLocaleString()}</td>
            <td class="${tPmProf < 0 ? "minus-text" : ""}">${tPmProf.toLocaleString()}</td>
            <td class="${tPmMy < 0 ? "minus-text" : ""}">${tPmMy.toLocaleString()}</td>
            <td class="${tDay < 0 ? "minus-text" : "blue-text"}">${tDay.toLocaleString()}</td>
            <td class="${tMy < 0 ? "minus-text" : "plus-text"}">${tMy.toLocaleString()}</td>
        </tr>
    `;
  return html;
}

function showSingleDayDetail(dateStr) {
  const target = dbCachedRecords.find((r) => r.record_date === dateStr);
  if (!target) return;

  const board = document.getElementById("singleDayDetailBoard");
  board.innerHTML = "";

  const amSales = target.am_sales || 0;
  const amPayout = target.am_payout || 0;
  const amCommSales = amSales * (1 - target.comm_percent / 100);
  const amActualPayout = amPayout * 80;
  const amProf = amCommSales - amActualPayout;
  const amMy = amProf * (target.my_profit_percent / 100);

  const pmSales = target.pm_sales || 0;
  const pmPayout = target.pm_payout || 0;
  const pmCommSales = pmSales * (1 - target.comm_percent / 100);
  const pmActualPayout = pmPayout * 80;
  const pmProf = pmCommSales - pmActualPayout;
  const pmMy = pmProf * (target.my_profit_percent / 100);

  const dTot = amProf + pmProf;
  const mTot = amMy + pmMy;
  const dayName = getMyanmarDayName(dateStr);

  board.innerHTML = `
        <button class="back-nav-btn" onclick="document.getElementById('singleDayDetailBoard').style.display='none';">❌ ပိတ်မည်</button>
        <h3 style="font-size:14px; color:#1e40af; margin-bottom:12px; text-align:center;">📋 ရက်စွဲ - ${dateStr} (${dayName}) တစ်ရက်စာ အသေးစိတ်</h3>
        
        <div class="session-result">
            <h4 style="color:#2563eb; margin-bottom:6px;">☀️ မနက်ပိုင်း</h4>
            <div class="res-row input-origin">
                <span>📥 ရောင်းရငွေ (T): <strong>${amSales.toLocaleString()}</strong></span>
                <span>💸 လျော်ရငွေ (P): <strong>${amPayout.toLocaleString()}</strong></span>
            </div>
            <div class="res-row"><span>ကော်မရှင်နုတ်ပြီး အရောင်း:</span><span>${Math.round(amCommSales).toLocaleString()} ကျပ်</span></div>
            <div class="res-row"><span>အမှန်လျော်ရငွေ (x80):</span><span class="minus-text">-${amActualPayout.toLocaleString()} ကျပ်</span></div>
            <div class="res-row bold"><span>ဒိုင်အမြတ်:</span><span class="blue-text">${Math.round(amProf).toLocaleString()} ကျပ်</span></div>
            <div class="res-row"><span>မိမိအမြတ်:</span><span class="plus-text">${Math.round(amMy).toLocaleString()} ကျပ်</span></div>
        </div>

        <div class="session-result">
            <h4 style="color:#7c3aed; margin-bottom:6px;">🌙 ညနေပိုင်း</h4>
            <div class="res-row input-origin">
                <span>📥 ရောင်းရငွေ (T): <strong>${pmSales.toLocaleString()}</strong></span>
                <span>💸 လျော်ရငွေ (P): <strong>${pmPayout.toLocaleString()}</strong></span>
            </div>
            <div class="res-row"><span>ကော်မရှင်နုတ်ပြီး အရောင်း:</span><span>${Math.round(pmCommSales).toLocaleString()} ကျပ်</span></div>
            <div class="res-row"><span>အမှန်လျော်ရငွေ (x80):</span><span class="minus-text">-${pmActualPayout.toLocaleString()} ကျပ်</span></div>
            <div class="res-row bold"><span>ဒိုင်အမြတ်:</span><span class="blue-text">${Math.round(pmProf).toLocaleString()} ကျပ်</span></div>
            <div class="res-row"><span>မိမိအမြတ်:</span><span class="plus-text">${Math.round(pmMy).toLocaleString()} ကျပ်</span></div>
        </div>

        <div class="summary-box day-profit-box">
            <h3>📊 စုစုပေါင်း ဒိုင်အမြတ်</h3>
            <div class="final-amount" style="color:${dTot < 0 ? "#ef4444" : "#2563eb"}">${Math.round(dTot).toLocaleString()} ကျပ်</div>
        </div>
        <div class="summary-box day-myprofit-box" style="margin-bottom:20px;">
            <h3>💰 စုစုပေါင်း မိမိအမြတ်</h3>
            <div class="final-amount" style="color:${mTot < 0 ? "#ef4444" : "#10b981"}">${Math.round(mTot).toLocaleString()} ကျပ်</div>
        </div>
    `;
  board.style.display = "block";
  board.scrollIntoView({ behavior: "smooth" });
}

// 🆕 တွက်ချက်မှုဆိုင်ရာ ယာယီ Data Object ကို သိမ်းဆည်းရန် Global Variable တစ်ခု ထားရှိခြင်း
let temporaryCalculatedRecord = null;

// ==========================================================================
// 🆕 DOMContentLoaded တွင် Auto Today Calendar Select ပြုလုပ်ခြင်း
// ==========================================================================
window.addEventListener('DOMContentLoaded', async () => {
    // ယခင်ပါဝင်ပြီးသား Auth Check စနစ်
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
        showMainApp(session.user);
    } else {
        showAuthScreen();
    }

    // 🎯 ပြက္ခဒိန်တွင် ယနေ့ရက်စွဲအား Auto ရွေးချယ်ပေးထားခြင်း
    const dateInput = document.getElementById('calcTargetDate');
    if(dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`; // Formats: YYYY-MM-DD
    }
});

// ==========================================================================
// 🆕 တွက်ချက်မှုနှင့် သိမ်းဆည်းမှု ပင်မ Core Logic (Version 2.4)
// ==========================================================================
async function handleCalculateAndDecision() {
    const amSalesRaw = document.getElementById('amSales').value.trim();
    const amPayoutRaw = document.getElementById('amPayout').value.trim();
    const pmSalesRaw = document.getElementById('pmSales').value.trim();
    const pmPayoutRaw = document.getElementById('pmPayout').value.trim();

    if (!amSalesRaw && !amPayoutRaw && !pmSalesRaw && !pmPayoutRaw) { alert("⚠️ ဒေတာ ဖြည့်သွင်းပါ။"); return; }

    const commPercent = parseFloat(document.getElementById('cfgComm').value) || 0;
    const myProfitPercent = parseFloat(document.getElementById('cfgMyProfit').value) || 0;
    const amSales = parseFloat(amSalesRaw) || 0; const amPayout = parseFloat(amPayoutRaw) || 0;
    const pmSales = parseFloat(pmSalesRaw) || 0; const pmPayout = parseFloat(pmPayoutRaw) || 0;

    const amCommSales = amSales * (1 - (commPercent / 100));
    const amActualPayout = amPayout * 80; const amTotalProfit = amCommSales - amActualPayout;
    const amMyProfit = amTotalProfit * (myProfitPercent / 100);

    const pmCommSales = pmSales * (1 - (commPercent / 100));
    const pmActualPayout = pmPayout * 80; const pmTotalProfit = pmCommSales - pmActualPayout;
    const pmMyProfit = pmTotalProfit * (myProfitPercent / 100);

    // 🎯 ပြက္ခဒိန်မှ အသုံးပြုသူ ရွေးချယ်ထားသော နှစ်သက်ရာ ရက်စွဲကို ရယူခြင်း
    const chosenDateStr = document.getElementById('calcTargetDate').value;

    // ယာယီ သိမ်းဆည်းမည့် Object တည်ဆောက်ခြင်း
    temporaryCalculatedRecord = {
        record_date: chosenDateStr, comm_percent: commPercent, my_profit_percent: myProfitPercent,
        am_sales: amSales, am_payout: amPayout, pm_sales: pmSales, pm_payout: pmPayout,
        total_day_profit: Math.round(amTotalProfit + pmTotalProfit), total_my_profit: Math.round(amMyProfit + pmMyProfit)
    };

    // UI ပေါ်တွင် တွက်ချက်မှု ရလဒ်များအား အရင်ဆုံး ထုတ်ပြခြင်း
    renderResultsToUI(amSales, amPayout, pmSales, pmPayout, amCommSales, amActualPayout, amTotalProfit, amMyProfit, pmCommSales, pmActualPayout, pmTotalProfit, pmMyProfit, chosenDateStr);

    // Checkbox အခြေအနေကို စစ်ဆေးခြင်း
    const isAutoSaveChecked = document.getElementById('chkAutoSave').checked;

    if (isAutoSaveChecked) {
        // အမှန်ခြစ် ထားပါက - ဒေတာဘေ့စ်ထဲ တခါတည်း တိုက်ရိုက်သိမ်းမည်
        document.getElementById('btnManualSave').style.display = 'none';
        await executeSaveProcess(temporaryCalculatedRecord);
    } else {
        // အမှန်ခြစ် မထားပါက - ရလဒ်ပဲပြပြီး၊ အောက်ဆုံးတွင် "သိမ်းဆည်းမည် Button" ကို ဖော်ပေးမည်
        document.getElementById('btnManualSave').style.display = 'block';
        alert("📊 တွက်ချက်မှု ရလဒ်ကိုသာ ပြသထားပါသည်။ ဒေတာဘေ့စ်တွင် သိမ်းဆည်းလိုပါက အောက်ဆုံးရှိ ခလုတ်ကို နှိပ်နိုင်ပါတယ်ဗျာ။");
    }
}

// 🆕 ရလဒ်များကို UI ပေါ်သို့ Render လုပ်ပေးသည့် သီးသန့် Function
function renderResultsToUI(amSales, amPayout, pmSales, pmPayout, amCommSales, amActualPayout, amTotalProfit, amMyProfit, pmCommSales, pmActualPayout, pmTotalProfit, pmMyProfit, chosenDateStr) {
    document.getElementById('rAmOriginSales').innerText = amSales.toLocaleString();
    document.getElementById('rAmOriginPayout').innerText = amPayout.toLocaleString();
    document.getElementById('rPmOriginSales').innerText = pmSales.toLocaleString();
    document.getElementById('rPmOriginPayout').innerText = pmPayout.toLocaleString();
    document.getElementById('rAmCommSales').innerText = Math.round(amCommSales).toLocaleString() + " ကျပ်";
    document.getElementById('rAmActualPayout').innerText = "-" + amActualPayout.toLocaleString() + " ကျပ်";
    document.getElementById('rAmTotalProfit').innerText = Math.round(amTotalProfit).toLocaleString() + " ကျပ်";
    document.getElementById('rAmMyProfit').innerText = Math.round(amMyProfit).toLocaleString() + " ကျပ်";
    document.getElementById('rPmCommSales').innerText = Math.round(pmCommSales).toLocaleString() + " ကျပ်";
    document.getElementById('rPmActualPayout').innerText = "-" + pmActualPayout.toLocaleString() + " ကျပ်";
    document.getElementById('rPmTotalProfit').innerText = Math.round(pmTotalProfit).toLocaleString() + " ကျပ်";
    document.getElementById('rPmMyProfit').innerText = Math.round(pmMyProfit).toLocaleString() + " ကျပ်";

    const tProf = amTotalProfit + pmTotalProfit; const tMy = amMyProfit + pmMyProfit;
    document.getElementById('rFinalDayProfit').innerText = Math.round(tProf).toLocaleString() + " ကျပ်";
    document.getElementById('rFinalDayProfit').style.color = tProf < 0 ? "#ef4444" : "#2563eb";
    document.getElementById('rFinalMyProfit').innerText = Math.round(tMy).toLocaleString() + " ကျပ်";
    document.getElementById('rFinalMyProfit').style.color = tMy < 0 ? "#ef4444" : "#10b981";

    const dateObj = new Date(chosenDateStr);
    const cMonthText = getMonthNameMM(dateObj.getMonth() + 1);
    const cWeekText = getMyanmarWeekName(chosenDateStr);
    document.getElementById('calcBlockTitle').innerText = `📋 ${dateObj.getFullYear()} ခုနှစ် ${cMonthText} (${cWeekText}) စာရင်းချုပ် (တနင်္လာ - သောကြာ)`;

    document.getElementById('resultBoard').style.display = 'block';
    refreshWeeklyTableBlock(chosenDateStr);
}

// 🆕 ရလဒ်အောက်က Button နှိပ်မှ Manual အနေဖြင့် သိမ်းဆည်းပေးမည့် Function
async function handleManualSaveAction() {
    if(!temporaryCalculatedRecord) return;
    await executeSaveProcess(temporaryCalculatedRecord);
    document.getElementById('btnManualSave').style.display = 'none'; // သိမ်းပြီးပါက ခလုတ်အား ပြန်ဖျောက်ခြင်း
}

// 🆕 ပင်မ Database သိမ်းဆည်းခြင်း လုပ်ငန်းစဉ်
async function executeSaveProcess(recordObj) {
    const result = await saveDailyRecord(recordObj);
    if (result !== null) {
        alert("✅ စာရင်းအား ဒေတာဘေ့စ်ထဲသို့ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီဗျာ။");
        await refreshWeeklyTableBlock(recordObj.record_date);
    } else {
        alert("❌ ဒေတာသိမ်းဆည်းမှု မအောင်မြင်ပါ။");
    }
}

// 🆕 ရွေးချယ်ထားသော ရက်စွဲရှိသည့် ရက်သတ္တပတ် ဇယားကွက်ကို အလိုအလျောက် Update လုပ်ပေးရန်
async function refreshWeeklyTableBlock(targetDateStr) {
    dbCachedRecords = await getAllRecordsFromDB();
    const currentWNum = getWeekNumber(targetDateStr);
    const targetYear = new Date(targetDateStr).getFullYear();
    
    const currentWeekRecords = dbCachedRecords.filter(r => 
        new Date(r.record_date).getFullYear() === targetYear && 
        getWeekNumber(r.record_date) === currentWNum
    );
    
    document.getElementById('calcBlockTableBody').innerHTML = generateBlockRows(currentWeekRecords);
}

async function renderHistoryVisual() {
  const container = document.getElementById("historyContainer");
  if (!container) return;
  container.innerHTML = "";
  document.getElementById("singleDayDetailBoard").style.display = "none";

  dbCachedRecords = await getAllRecordsFromDB();
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;

  if (currentFilter === "week") {
    document.getElementById("historyFilterBox").style.display = "flex";
    const currentWeekNum = getWeekNumber(today);
    const records = dbCachedRecords.filter(
      (r) =>
        new Date(r.record_date).getFullYear() === thisYear &&
        getWeekNumber(r.record_date) === currentWeekNum,
    );

    container.innerHTML = `
            <div class="block-card">
                <div class="block-header">📊 ${thisYear} ခုနှစ် ${getMonthNameMM(thisMonth)} (${getMyanmarWeekName(today.toISOString().split("T")[0])}) စာရင်းချုပ်</div>
                <div class="table-responsive-wrapper">
                    <table class="w-table">
                        <thead><tr><th>ရက်စွဲ (နေ့)</th><th>မနက်(ဒိုင်)</th><th>မနက်(မိမိ)</th><th>ညနေ(ဒိုင်)</th><th>ညနေ(မိမိ)</th><th>စုစုပေါင်း(ဒိုင်)</th><th>စုစုပေါင်း(မိမိ)</th></tr></thead>
                        <tbody>${generateBlockRows(records)}</tbody>
                    </table>
                </div>
            </div>
        `;
  } else if (currentFilter === "month") {
    document.getElementById("historyFilterBox").style.display = "flex";
    const currentMonthRecords = dbCachedRecords.filter((r) => {
      const d = new Date(r.record_date);
      return d.getFullYear() === thisYear && d.getMonth() + 1 === thisMonth;
    });
    renderWeeksLevel(
      currentMonthRecords,
      container,
      `${thisYear} ခုနှစ် ${getMonthNameMM(thisMonth)}`,
    );
  } else if (currentFilter === "all") {
    const filteredByYear = dbCachedRecords.filter(
      (r) => new Date(r.record_date).getFullYear() === selectedYear,
    );

    if (navigationState.level === "root") {
      document.getElementById("historyFilterBox").style.display = "flex";
      const monthlyGrouped = {};
      filteredByYear.forEach((row) => {
        const mNum = new Date(row.record_date).getMonth() + 1;
        if (!monthlyGrouped[mNum]) monthlyGrouped[mNum] = [];
        monthlyGrouped[mNum].push(row);
      });

      const sortedMonths = Object.keys(monthlyGrouped)
        .map(Number)
        .sort((a, b) => b - a);
      sortedMonths.forEach((mNum) => {
        const records = monthlyGrouped[mNum];
        let tDay = 0,
          tMy = 0;
        records.forEach((r) => {
          tDay += r.total_day_profit;
          tMy += r.total_my_profit;
        });

        const blockDiv = document.createElement("div");
        blockDiv.className = "clickable-block";
        blockDiv.style.border = "2px solid #10b981";
        blockDiv.onclick = () => {
          navigationState = { level: "month", month: mNum, weekNum: null };
          renderHistoryVisual();
        };
        blockDiv.innerHTML = `
                    <div style="font-weight:bold; color:#065f46; margin-bottom:5px; font-size:14px;">📅 ${selectedYear} ခုနှစ် - ${getMonthNameMM(mNum)}</div>
                    <div style="display:flex; justify-content:space-between; font-size:12px;">
                        <span>ဒိုင်ချုပ်: <strong class="blue-text">${tDay.toLocaleString()}</strong></span>
                        <span>မိမိချုပ်: <strong class="plus-text">${tMy.toLocaleString()}</strong></span>
                    </div>
                `;
        container.appendChild(blockDiv);
      });
      if (sortedMonths.length === 0)
        container.innerHTML =
          "<p style='text-align:center; padding:20px;'>ဒေတာမရှိသေးပါ။</p>";
    } else if (navigationState.level === "month") {
      document.getElementById("historyFilterBox").style.display = "none";
      const backBtn = document.createElement("button");
      backBtn.className = "back-nav-btn";
      backBtn.innerText = "⬅️ လချုပ်များသို့ ပြန်သွားရန်";
      backBtn.onclick = () => {
        navigationState = { level: "root", month: null, weekNum: null };
        renderHistoryVisual();
      };
      container.appendChild(backBtn);

      const monthRecords = filteredByYear.filter(
        (r) => new Date(r.record_date).getMonth() + 1 === navigationState.month,
      );
      renderWeeksLevel(
        monthRecords,
        container,
        `${selectedYear} ခုနှစ် ${getMonthNameMM(navigationState.month)}`,
      );
    } else if (navigationState.level === "week") {
      document.getElementById("historyFilterBox").style.display = "none";
      const backBtn = document.createElement("button");
      backBtn.className = "back-nav-btn";
      backBtn.innerText = "⬅️ အပတ်စဉ်စာရင်းများသို့ ပြန်သွားရန်";
      backBtn.onclick = () => {
        navigationState.level = "month";
        renderHistoryVisual();
      };
      container.appendChild(backBtn);

      const weekRecords = filteredByYear.filter(
        (r) =>
          new Date(r.record_date).getMonth() + 1 === navigationState.month &&
          getWeekNumber(r.record_date) === navigationState.weekNum,
      );
      const sampleDate = weekRecords[0] ? weekRecords[0].record_date : "";

      const card = document.createElement("div");
      card.className = "block-card";
      card.innerHTML = `
                <div class="block-header">📊 ${selectedYear} ခုနှစ် ${getMonthNameMM(navigationState.month)} (${getMyanmarWeekName(sampleDate)}) စာရင်းချုပ်</div>
                <div class="table-responsive-wrapper">
                    <table class="w-table">
                        <thead><tr><th>ရက်စွဲ (နေ့)</th><th>မနက်(ဒိုင်)</th><th>မနက်(မိမိ)</th><th>ညနေ(ဒိုင်)</th><th>ညနေ(မိမိ)</th><th>စုစုပေါင်း(ဒိုင်)</th><th>စုစုပေါင်း(မိမိ)</th></tr></thead>
                        <tbody>${generateBlockRows(weekRecords)}</tbody>
                    </table>
                </div>
            `;
      container.appendChild(card);
    }
  }
}

function renderWeeksLevel(records, container, titlePrefix) {
  const titleHeader = document.createElement("h3");
  titleHeader.style =
    "font-size:14px; color:#1e3a8a; margin:10px 0; text-align:center;";
  titleHeader.innerText = `📦 ${titlePrefix} (အပတ်စဉ် အနှစ်ချုပ်များ)`;
  container.appendChild(titleHeader);

  const grouped = {};
  records.forEach((row) => {
    const wNum = getWeekNumber(row.record_date);
    if (!grouped[wNum]) grouped[wNum] = [];
    grouped[wNum].push(row);
  });

  const sortedWeeks = Object.keys(grouped).sort((a, b) => b - a);
  sortedWeeks.forEach((wNum) => {
    const weekRecs = grouped[wNum];
    const lastDate = weekRecs[0].record_date;
    let totalDay = 0,
      totalMy = 0;
    weekRecs.forEach((r) => {
      totalDay += r.total_day_profit;
      totalMy += r.total_my_profit;
    });

    const blockDiv = document.createElement("div");
    blockDiv.className = "clickable-block";
    blockDiv.onclick = () => {
      if (currentFilter === "all") {
        navigationState = {
          level: "week",
          month: navigationState.month,
          weekNum: parseInt(wNum),
        };
        renderHistoryVisual();
      } else {
        navigationState = {
          level: "week",
          month: new Date(lastDate).getMonth() + 1,
          weekNum: parseInt(wNum),
        };
        currentFilter = "all";
        renderHistoryVisual();
      }
    };
    blockDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:5px; color:#1e40af;">
                <span>📦 ${getMyanmarWeekName(lastDate)}</span>
                <span style="font-size:11px; color:#64748b;">${weekRecs[weekRecs.length - 1].record_date.substring(5)} မှ ${lastDate.substring(5)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px;">
                <span>ဒိုင်ချုပ်: <strong class="blue-text">${totalDay.toLocaleString()}</strong></span>
                <span>မိမိရလဒ်: <strong class="plus-text">${totalMy.toLocaleString()}</strong></span>
            </div>
        `;
    container.appendChild(blockDiv);
  });
}
