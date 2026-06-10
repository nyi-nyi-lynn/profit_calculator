// Tab ပြောင်းလဲခြင်း စနစ်
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  if (event) {
    event.currentTarget.classList.add("active");
  }
}

// တွက်ချက်ခြင်းနှင့် Validation စစ်ဆေးပြီး ဒေတာသိမ်းဆည်းခြင်း လုပ်ငန်းစဉ်
async function handleCalculateAndSave() {
  // Input Box များမှ စာသားကို တိုက်ရိုက်ယူခြင်း (Validation စစ်ရန်)
  const amSalesRaw = document.getElementById("amSales").value.trim();
  const amPayoutRaw = document.getElementById("amPayout").value.trim();
  const pmSalesRaw = document.getElementById("pmSales").value.trim();
  const pmPayoutRaw = document.getElementById("pmPayout").value.trim();

  // 🛑 [FORM VALIDATION] - ကွက်လပ်အားလုံး ဗလာဖြစ်နေခြင်း သို့မဟုတ် ဂဏန်းလုံးဝမရှိခြင်းကို စစ်ဆေးရန်
  if (
    amSalesRaw === "" &&
    amPayoutRaw === "" &&
    pmSalesRaw === "" &&
    pmPayoutRaw === ""
  ) {
    alert(
      "⚠️ ကျေးဇူးပြု၍ မနက်ပိုင်း သို့မဟုတ် ညနေပိုင်းအတွက် ရောင်းရငွေ/လျော်ရငွေ အနည်းဆုံးတစ်ခုခု ဖြည့်စွက်ပေးပါ။ စာရင်းအလွတ်ကြီး သိမ်း၍မရပါ။",
    );
    return;
  }

  const commPercent = parseFloat(document.getElementById("cfgComm").value) || 0;
  const myProfitPercent =
    parseFloat(document.getElementById("cfgMyProfit").value) || 0;

  // Validation ကျော်ရင် ဂဏန်းအဖြစ်ပြောင်းလဲခြင်း (မဖြည့်ထားလျှင် 0 အဖြစ်ယူမည်)
  const amSales = parseFloat(amSalesRaw) || 0;
  const amPayout = parseFloat(amPayoutRaw) || 0;
  const pmSales = parseFloat(pmSalesRaw) || 0;
  const pmPayout = parseFloat(pmPayoutRaw) || 0;

  // 🛑 [FORM VALIDATION 2] - အားလုံးကို 0 ချည်းပဲ ဖြည့်ထားခြင်းကို စစ်ဆေးရန်
  if (amSales === 0 && amPayout === 0 && pmSales === 0 && pmPayout === 0) {
    alert(
      "⚠️ ရောင်းရငွေနှင့် လျော်ရငွေတန်ဖိုးများ '0' ချည်းပဲဖြစ်နေသဖြင့် မသိမ်းဆည်းပေးနိုင်ပါ။",
    );
    return;
  }

  // 📊 Logic တွက်ချက်မှုအပိုင်း
  const amCommSales = amSales * (1 - commPercent / 100);
  const amActualPayout = amPayout * 80;
  const amTotalProfit = amCommSales - amActualPayout;
  const amMyProfit = amTotalProfit * (myProfitPercent / 100);

  const pmCommSales = pmSales * (1 - commPercent / 100);
  const pmActualPayout = pmPayout * 80;
  const pmTotalProfit = pmCommSales - pmActualPayout;
  const pmMyProfit = pmTotalProfit * (myProfitPercent / 100);

  const totalDayProfit = amTotalProfit + pmTotalProfit;
  const totalMyProfit = amMyProfit + pmMyProfit;

  // Database ထဲထည့်ရန် Data Object တည်ဆောက်ခြင်း
  const recordData = {
    record_date: new Date().toISOString().split("T")[0],
    comm_percent: commPercent,
    my_profit_percent: myProfitPercent,
    am_sales: amSales,
    am_payout: amPayout,
    pm_sales: pmSales,
    pm_payout: pmPayout,
    total_day_profit: Math.round(totalDayProfit),
    total_my_profit: Math.round(totalMyProfit),
  };

  // 🗄️ DB သို့ လှမ်းသိမ်းခြင်း
  const result = await saveDailyRecord(recordData);

  // 🔔 [ALERT NOTIFICATIONS & UI RENDERING]
  if (result !== null) {
    alert(
      "✅ ယနေ့စာရင်းကို အောင်မြင်စွာ တွက်ချက်ပြီး သိမ်းဆည်းလိုက်ပါပြီ။",
    );

    // မျက်နှာပြင်ပေါ်တွင် ရလဒ်များ ထုတ်ပြခြင်း
    document.getElementById("rAmCommSales").innerText =
      Math.round(amCommSales).toLocaleString() + " ကျပ်";
    document.getElementById("rAmActualPayout").innerText =
      "-" + amActualPayout.toLocaleString() + " ကျပ်";
    document.getElementById("rAmTotalProfit").innerText =
      Math.round(amTotalProfit).toLocaleString() + " ကျပ်";
    document.getElementById("rAmMyProfit").innerText =
      Math.round(amMyProfit).toLocaleString() + " ကျပ်";

    document.getElementById("rPmCommSales").innerText =
      Math.round(pmCommSales).toLocaleString() + " ကျပ်";
    document.getElementById("rPmActualPayout").innerText =
      "-" + pmActualPayout.toLocaleString() + " ကျပ်";
    document.getElementById("rPmTotalProfit").innerText =
      Math.round(pmTotalProfit).toLocaleString() + " ကျပ်";
    document.getElementById("rPmMyProfit").innerText =
      Math.round(pmMyProfit).toLocaleString() + " ကျပ်";

    // စုစုပေါင်း ဒိုင်အမြတ်ငွေ ပြသခြင်း
    const finalDayProfitEl = document.getElementById("rFinalDayProfit");
    finalDayProfitEl.innerText =
      Math.round(totalDayProfit).toLocaleString() + " ကျပ်";
    finalDayProfitEl.style.color = totalDayProfit < 0 ? "#ef4444" : "#2563eb";

    // စုစုပေါင်း မိမိအမြတ်ငွေ ပြသခြင်း
    const finalMyProfitEl = document.getElementById("rFinalMyProfit");
    finalMyProfitEl.innerText =
      Math.round(totalMyProfit).toLocaleString() + " ကျပ်";
    finalMyProfitEl.style.color = totalMyProfit < 0 ? "#ef4444" : "#10b981";

    // Result Board ကို ဖော်ပြပေးခြင်း
    document.getElementById("resultBoard").style.display = "block";
  } else {
    alert(
      "❌ စနစ်ချို့ယွင်းချက်ကြောင့် ဒေတာသိမ်းဆည်းခြင်း မအောင်မြင်ပါ။ အင်တာနက်လိုင်းကို စစ်ဆေးပြီး ပြန်လည်ကြိုးစားပါ။",
    );
  }
}

// သမိုင်းကြောင်း စာရင်းဟောင်းများကို ဇယားဖြင့် ပြသခြင်း
async function loadHistory(filterType = "all") {
  const data = await getHistoryData(filterType);
  const tbody = document.getElementById("historyTableBody");
  tbody.innerHTML = "";

  let sumDay = 0;
  let sumMy = 0;

  data.forEach((row) => {
    sumDay += row.total_day_profit;
    sumMy += row.total_my_profit;

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${row.record_date}</td>
            <td style="color: ${row.total_day_profit < 0 ? "red" : "blue"}">${row.total_day_profit.toLocaleString()}</td>
            <td style="color: ${row.total_my_profit < 0 ? "red" : "green"}">${row.total_my_profit.toLocaleString()}</td>
        `;
    tbody.appendChild(tr);
  });

  document.getElementById("sumDayProfit").innerText =
    Math.round(sumDay).toLocaleString();
  document.getElementById("sumMyProfit").innerText =
    Math.round(sumMy).toLocaleString();
}
