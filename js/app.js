let currentFilter = "week";
let selectedYear = 2026;
let navigationState = { level: "root", month: null, weekNum: null };
let dbCachedRecords = [];
let temporaryCalculatedRecord = null;

// ==========================================================================
// AUTHENTICATION (VERSION 2.6)
// ==========================================================================

window.addEventListener("DOMContentLoaded", async () => {
  applyLanguage();
  setupNumericInputs();
  refreshStaticTableHeaders();

  const dateInput = document.getElementById("calcTargetDate");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  setGlobalLoading(true);
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (session && session.user) {
      showMainApp(session.user);
    } else {
      showAuthScreen();
    }
  } finally {
    setGlobalLoading(false);
  }
});

function onLanguageChanged() {
  refreshStaticTableHeaders();
  const resultBoard = document.getElementById("resultBoard");
  if (resultBoard && resultBoard.style.display !== "none" && temporaryCalculatedRecord) {
    const r = temporaryCalculatedRecord;
    const amCommSales = r.am_sales * (1 - r.comm_percent / 100);
    const amActualPayout = r.am_payout * 80;
    const amTotalProfit = amCommSales - amActualPayout;
    const amMyProfit = amTotalProfit * (r.my_profit_percent / 100);
    const pmCommSales = r.pm_sales * (1 - r.comm_percent / 100);
    const pmActualPayout = r.pm_payout * 80;
    const pmTotalProfit = pmCommSales - pmActualPayout;
    const pmMyProfit = pmTotalProfit * (r.my_profit_percent / 100);
    renderResultsToUI(
      r.am_sales,
      r.am_payout,
      r.pm_sales,
      r.pm_payout,
      amCommSales,
      amActualPayout,
      amTotalProfit,
      amMyProfit,
      pmCommSales,
      pmActualPayout,
      pmTotalProfit,
      pmMyProfit,
      r.record_date,
      false,
    );
  }
  const mainSection = document.getElementById("mainAppSection");
  if (mainSection && mainSection.style.display !== "none") {
    renderHistoryVisual();
  }
}

function refreshStaticTableHeaders() {
  const head = document.getElementById("calcBlockTableHead");
  if (head) head.innerHTML = getTableHeadersHtml();
}

function showMainApp(user) {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("mainAppSection").style.display = "block";
  document.getElementById("userDisplayEmail").innerText = user.email.split("@")[0];
  renderHistoryVisual();
}

function showAuthScreen() {
  document.getElementById("authSection").style.display = "block";
  document.getElementById("mainAppSection").style.display = "none";
}

async function handleLogin() {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();
  if (!email || !password) {
    showToast(t("toastFillEmailPassword"), "warning");
    return;
  }

  setButtonLoading("btnLogin", true);
  setGlobalLoading(true);
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        showToast(t("toastLoginFailed"), "error");
      } else {
        showToast(t("toastLoginError", { msg: error.message }), "error");
      }
    } else {
      showMainApp(data.user);
      showToast(t("toastLoginSuccess"), "success", 2500);
    }
  } finally {
    setButtonLoading("btnLogin", false);
    setGlobalLoading(false);
  }
}

async function handleLogout() {
  setButtonLoading("btnLogout", true);
  setGlobalLoading(true);
  try {
    await supabaseClient.auth.signOut();
    showAuthScreen();
    document.getElementById("authEmail").value = "";
    document.getElementById("authPassword").value = "";
    document.getElementById("resultBoard").style.display = "none";
    temporaryCalculatedRecord = null;
  } finally {
    setButtonLoading("btnLogout", false);
    setGlobalLoading(false);
  }
}

// ==========================================================================
// DATE & LOCALIZATION HELPERS
// ==========================================================================

function getWeekNumber(dateString) {
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
}

function isWeekend(dateString) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6;
}

function formatYearLabel(year) {
  return currentLang === "mm"
    ? `${year} ${t("yearSuffix")}`
    : `${year}`;
}

// ==========================================================================
// UI NAVIGATION
// ==========================================================================

function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (event) event.currentTarget.classList.add("active");
  document.getElementById("singleDayDetailBoard").style.display = "none";
}

function toggleFilterBtn(btn) {
  document.querySelectorAll(".filter-box button").forEach((b) => b.classList.remove("active"));
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
    opt.innerText = `📅 ${formatYearLabel(y)} ${t("yearRecords")}`;
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
  document.getElementById("calendarContainer").style.display = type === "all" ? "block" : "none";
  if (type === "all" && !document.getElementById("yearSelector").innerHTML) setupYearSelector();
  renderHistoryVisual();
}

// ==========================================================================
// TABLE RENDERING
// ==========================================================================

function generateBlockRows(records) {
  let html = "";
  let tAmProf = 0,
    tAmMy = 0,
    tPmProf = 0,
    tPmMy = 0,
    tDay = 0,
    tMy = 0;
  const sorted = [...records].sort((a, b) => new Date(a.record_date) - new Date(b.record_date));

  sorted.forEach((row) => {
    if (isWeekend(row.record_date)) return;

    const dayName = getLocalizedDayName(row.record_date);
    const amSales = row.am_sales || 0;
    const amPayout = row.am_payout || 0;
    const amProf = Math.round(amSales * (1 - row.comm_percent / 100) - amPayout * 80);
    const amMy = Math.round(amProf * (row.my_profit_percent / 100));
    const pmSales = row.pm_sales || 0;
    const pmPayout = row.pm_payout || 0;
    const pmProf = Math.round(pmSales * (1 - row.comm_percent / 100) - pmPayout * 80);
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
      </tr>`;
  });

  html += `
    <tr class="total-row">
      <td>${t("total")}</td>
      <td class="${tAmProf < 0 ? "minus-text" : ""}">${tAmProf.toLocaleString()}</td>
      <td class="${tAmMy < 0 ? "minus-text" : ""}">${tAmMy.toLocaleString()}</td>
      <td class="${tPmProf < 0 ? "minus-text" : ""}">${tPmProf.toLocaleString()}</td>
      <td class="${tPmMy < 0 ? "minus-text" : ""}">${tPmMy.toLocaleString()}</td>
      <td class="${tDay < 0 ? "minus-text" : "blue-text"}">${tDay.toLocaleString()}</td>
      <td class="${tMy < 0 ? "minus-text" : "plus-text"}">${tMy.toLocaleString()}</td>
    </tr>`;
  return html;
}

function showSingleDayDetail(dateStr) {
  const target = dbCachedRecords.find((r) => r.record_date === dateStr);
  if (!target) return;

  const board = document.getElementById("singleDayDetailBoard");
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
  const dayName = getLocalizedDayName(dateStr);

  board.innerHTML = `
    <button class="back-nav-btn" onclick="document.getElementById('singleDayDetailBoard').style.display='none';">${t("close")}</button>
    <h3 style="font-size:14px; color:#1e40af; margin-bottom:12px; text-align:center;">${t("detailDate", { date: dateStr, day: dayName })} ${t("detailTitle")}</h3>
    <div class="session-result">
      <h4 style="color:#2563eb; margin-bottom:6px;">${t("morningSection")}</h4>
      <div class="res-row input-origin">
        <span>${t("originSales")} <strong>${amSales.toLocaleString()}</strong></span>
        <span>${t("originPayout")} <strong>${amPayout.toLocaleString()}</strong></span>
      </div>
      <div class="res-row"><span>${t("commAdjustedSales")}</span><span>${formatCurrency(amCommSales)}</span></div>
      <div class="res-row"><span>${t("actualPayout")}</span><span class="minus-text">-${amActualPayout.toLocaleString()} ${t("currency")}</span></div>
      <div class="res-row bold"><span>${t("dealerProfitShort")}</span><span class="blue-text">${formatCurrency(amProf)}</span></div>
      <div class="res-row"><span>${t("myProfitShort")}</span><span class="plus-text">${formatCurrency(amMy)}</span></div>
    </div>
    <div class="session-result">
      <h4 style="color:#7c3aed; margin-bottom:6px;">${t("eveningSection")}</h4>
      <div class="res-row input-origin">
        <span>${t("originSales")} <strong>${pmSales.toLocaleString()}</strong></span>
        <span>${t("originPayout")} <strong>${pmPayout.toLocaleString()}</strong></span>
      </div>
      <div class="res-row"><span>${t("commAdjustedSales")}</span><span>${formatCurrency(pmCommSales)}</span></div>
      <div class="res-row"><span>${t("actualPayout")}</span><span class="minus-text">-${pmActualPayout.toLocaleString()} ${t("currency")}</span></div>
      <div class="res-row bold"><span>${t("dealerProfitShort")}</span><span class="blue-text">${formatCurrency(pmProf)}</span></div>
      <div class="res-row"><span>${t("myProfitShort")}</span><span class="plus-text">${formatCurrency(pmMy)}</span></div>
    </div>
    <div class="summary-box day-profit-box">
      <h3>${t("totalDealerShort")}</h3>
      <div class="final-amount" style="color:${dTot < 0 ? "#ef4444" : "#2563eb"}">${formatCurrency(dTot)}</div>
    </div>
    <div class="summary-box day-myprofit-box" style="margin-bottom:20px;">
      <h3>${t("totalMyShort")}</h3>
      <div class="final-amount" style="color:${mTot < 0 ? "#ef4444" : "#10b981"}">${formatCurrency(mTot)}</div>
    </div>`;
  board.style.display = "block";
  board.scrollIntoView({ behavior: "smooth" });
}

// ==========================================================================
// CALCULATION & SAVE (BUSINESS LOGIC UNCHANGED)
// ==========================================================================

async function handleCalculateAndDecision() {
  const validated = validateCalculationForm();
  if (!validated) return;

  const { commPercent, myProfitPercent, amSales, amPayout, pmSales, pmPayout, chosenDateStr } = validated;

  const amCommSales = amSales * (1 - commPercent / 100);
  const amActualPayout = amPayout * 80;
  const amTotalProfit = amCommSales - amActualPayout;
  const amMyProfit = amTotalProfit * (myProfitPercent / 100);

  const pmCommSales = pmSales * (1 - commPercent / 100);
  const pmActualPayout = pmPayout * 80;
  const pmTotalProfit = pmCommSales - pmActualPayout;
  const pmMyProfit = pmTotalProfit * (myProfitPercent / 100);

  temporaryCalculatedRecord = {
    record_date: chosenDateStr,
    comm_percent: commPercent,
    my_profit_percent: myProfitPercent,
    am_sales: amSales,
    am_payout: amPayout,
    pm_sales: pmSales,
    pm_payout: pmPayout,
    total_day_profit: Math.round(amTotalProfit + pmTotalProfit),
    total_my_profit: Math.round(amMyProfit + pmMyProfit),
  };

  renderResultsToUI(
    amSales,
    amPayout,
    pmSales,
    pmPayout,
    amCommSales,
    amActualPayout,
    amTotalProfit,
    amMyProfit,
    pmCommSales,
    pmActualPayout,
    pmTotalProfit,
    pmMyProfit,
    chosenDateStr,
  );

  const isAutoSaveChecked = document.getElementById("chkAutoSave").checked;

  setButtonLoading("btnCalculate", true);
  try {
    if (isAutoSaveChecked) {
      document.getElementById("btnManualSave").style.display = "none";
      await executeSaveProcess(temporaryCalculatedRecord);
    } else {
      document.getElementById("btnManualSave").style.display = "block";
      showToast(t("toastPreviewOnly"), "info");
    }
  } finally {
    setButtonLoading("btnCalculate", false);
  }
}

function renderResultsToUI(
  amSales,
  amPayout,
  pmSales,
  pmPayout,
  amCommSales,
  amActualPayout,
  amTotalProfit,
  amMyProfit,
  pmCommSales,
  pmActualPayout,
  pmTotalProfit,
  pmMyProfit,
  chosenDateStr,
  refreshTable = true,
) {
  document.getElementById("rAmOriginSales").innerText = amSales.toLocaleString();
  document.getElementById("rAmOriginPayout").innerText = amPayout.toLocaleString();
  document.getElementById("rPmOriginSales").innerText = pmSales.toLocaleString();
  document.getElementById("rPmOriginPayout").innerText = pmPayout.toLocaleString();
  document.getElementById("rAmCommSales").innerText = formatCurrency(amCommSales);
  document.getElementById("rAmActualPayout").innerText = `-${amActualPayout.toLocaleString()} ${t("currency")}`;
  document.getElementById("rAmTotalProfit").innerText = formatCurrency(amTotalProfit);
  document.getElementById("rAmMyProfit").innerText = formatCurrency(amMyProfit);
  document.getElementById("rPmCommSales").innerText = formatCurrency(pmCommSales);
  document.getElementById("rPmActualPayout").innerText = `-${pmActualPayout.toLocaleString()} ${t("currency")}`;
  document.getElementById("rPmTotalProfit").innerText = formatCurrency(pmTotalProfit);
  document.getElementById("rPmMyProfit").innerText = formatCurrency(pmMyProfit);

  const tProf = amTotalProfit + pmTotalProfit;
  const tMy = amMyProfit + pmMyProfit;
  document.getElementById("rFinalDayProfit").innerText = formatCurrency(tProf);
  document.getElementById("rFinalDayProfit").style.color = tProf < 0 ? "#ef4444" : "#2563eb";
  document.getElementById("rFinalMyProfit").innerText = formatCurrency(tMy);
  document.getElementById("rFinalMyProfit").style.color = tMy < 0 ? "#ef4444" : "#10b981";

  const dateObj = new Date(chosenDateStr);
  const cMonthText = getLocalizedMonthName(dateObj.getMonth() + 1);
  const cWeekText = getLocalizedWeekName(chosenDateStr);
  document.getElementById("calcBlockTitle").innerText = `📋 ${formatYearLabel(dateObj.getFullYear())} ${cMonthText} (${cWeekText}) ${t("weekSummary")}`;

  document.getElementById("resultBoard").style.display = "block";
  if (refreshTable) refreshWeeklyTableBlock(chosenDateStr);
}

async function handleManualSaveAction() {
  if (!temporaryCalculatedRecord) return;
  setButtonLoading("btnManualSave", true);
  setGlobalLoading(true);
  try {
    await executeSaveProcess(temporaryCalculatedRecord);
    document.getElementById("btnManualSave").style.display = "none";
  } finally {
    setButtonLoading("btnManualSave", false);
    setGlobalLoading(false);
  }
}

async function executeSaveProcess(recordObj) {
  setGlobalLoading(true);
  try {
    const result = await saveDailyRecord(recordObj);
    if (result !== null) {
      showToast(t("toastSaveSuccess"), "success");
      await refreshWeeklyTableBlock(recordObj.record_date);
    } else {
      showToast(t("toastSaveFailed"), "error");
    }
  } finally {
    setGlobalLoading(false);
  }
}

async function refreshWeeklyTableBlock(targetDateStr) {
  setGlobalLoading(true);
  try {
    dbCachedRecords = await getAllRecordsFromDB();
    const currentWNum = getWeekNumber(targetDateStr);
    const targetYear = new Date(targetDateStr).getFullYear();
    const currentWeekRecords = dbCachedRecords.filter(
      (r) =>
        new Date(r.record_date).getFullYear() === targetYear &&
        getWeekNumber(r.record_date) === currentWNum,
    );
    document.getElementById("calcBlockTableBody").innerHTML = generateBlockRows(currentWeekRecords);
  } finally {
    setGlobalLoading(false);
  }
}

// ==========================================================================
// HISTORY VIEW
// ==========================================================================

async function renderHistoryVisual() {
  const container = document.getElementById("historyContainer");
  if (!container) return;
  container.innerHTML = "";
  document.getElementById("singleDayDetailBoard").style.display = "none";

  setGlobalLoading(true);
  try {
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
          <div class="block-header">📊 ${formatYearLabel(thisYear)} ${getLocalizedMonthName(thisMonth)} (${getLocalizedWeekName(today.toISOString().split("T")[0])}) ${t("weekSummary")}</div>
          <div class="table-responsive-wrapper">
            <table class="w-table">
              <thead>${getTableHeadersHtml()}</thead>
              <tbody>${generateBlockRows(records)}</tbody>
            </table>
          </div>
        </div>`;
    } else if (currentFilter === "month") {
      document.getElementById("historyFilterBox").style.display = "flex";
      const currentMonthRecords = dbCachedRecords.filter((r) => {
        const d = new Date(r.record_date);
        return d.getFullYear() === thisYear && d.getMonth() + 1 === thisMonth;
      });
      renderWeeksLevel(
        currentMonthRecords,
        container,
        `${formatYearLabel(thisYear)} ${getLocalizedMonthName(thisMonth)}`,
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
            <div style="font-weight:bold; color:#065f46; margin-bottom:5px; font-size:14px;">📅 ${formatYearLabel(selectedYear)} - ${getLocalizedMonthName(mNum)}</div>
            <div style="display:flex; justify-content:space-between; font-size:12px;">
              <span>${t("dealerTotal")} <strong class="blue-text">${tDay.toLocaleString()}</strong></span>
              <span>${t("myTotal")} <strong class="plus-text">${tMy.toLocaleString()}</strong></span>
            </div>`;
          container.appendChild(blockDiv);
        });
        if (sortedMonths.length === 0)
          container.innerHTML = `<p style='text-align:center; padding:20px;'>${t("noData")}</p>`;
      } else if (navigationState.level === "month") {
        document.getElementById("historyFilterBox").style.display = "none";
        const backBtn = document.createElement("button");
        backBtn.className = "back-nav-btn";
        backBtn.innerText = t("backToMonths");
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
          `${formatYearLabel(selectedYear)} ${getLocalizedMonthName(navigationState.month)}`,
        );
      } else if (navigationState.level === "week") {
        document.getElementById("historyFilterBox").style.display = "none";
        const backBtn = document.createElement("button");
        backBtn.className = "back-nav-btn";
        backBtn.innerText = t("backToWeeks");
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
          <div class="block-header">📊 ${formatYearLabel(selectedYear)} ${getLocalizedMonthName(navigationState.month)} (${getLocalizedWeekName(sampleDate)}) ${t("weekSummary")}</div>
          <div class="table-responsive-wrapper">
            <table class="w-table">
              <thead>${getTableHeadersHtml()}</thead>
              <tbody>${generateBlockRows(weekRecords)}</tbody>
            </table>
          </div>`;
        container.appendChild(card);
      }
    }
  } finally {
    setGlobalLoading(false);
  }
}

function renderWeeksLevel(records, container, titlePrefix) {
  const titleHeader = document.createElement("h3");
  titleHeader.style = "font-size:14px; color:#1e3a8a; margin:10px 0; text-align:center;";
  titleHeader.innerText = `📦 ${titlePrefix} ${t("weeklySummaries")}`;
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
    const fromDate = weekRecs[weekRecs.length - 1].record_date.substring(5);
    const toDate = lastDate.substring(5);
    blockDiv.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:5px; color:#1e40af;">
        <span>📦 ${getLocalizedWeekName(lastDate)}</span>
        <span style="font-size:11px; color:#64748b;">${fromDate} ${t("fromTo")} ${toDate}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:12px;">
        <span>${t("dealerTotal")} <strong class="blue-text">${totalDay.toLocaleString()}</strong></span>
        <span>${t("myResult")} <strong class="plus-text">${totalMy.toLocaleString()}</strong></span>
      </div>`;
    container.appendChild(blockDiv);
  });
}
