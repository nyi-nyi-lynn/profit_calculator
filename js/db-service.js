// ၁။ နေ့စဉ်စာရင်းဒေတာကို Supabase ထဲသို့ သိမ်းဆည်းရန် Function (ဒေတာသိမ်းပြီးရင် Result ပြန်တောင်းရန် .select() ထည့်ထားပါသည်)
async function saveDailyRecord(recordData) {
    const { data, error } = await supabaseClient
        .from('daily_records')
        .upsert([recordData], { onConflict: 'record_date' })
        .select(); // ⚠️ ပြန်လာမယ့် Result ဗလာ (null) မဖြစ်စေဖို့ ဒီကောင်လေး ဖြည့်ပေးလိုက်ပါပြီ။
    
    if (error) {
        console.error("Error saving data:", error);
        return null;
    }
    return data;
}

// ၂။ တစ်ပတ်စာ၊ တစ်လစာ စာရင်းများကို ရက်စွဲအလိုက် စစ်ထုတ်ယူရန် Function
async function getHistoryData(filterType = "all") {
  // ⚠️ supabase.from အစား supabaseClient.from လို့ ပြောင်းထားပါတယ်
  let query = supabaseClient
    .from("daily_records")
    .select("*")
    .order("record_date", { ascending: false });

  const today = new Date();

  if (filterType === "week") {
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7))
      .toISOString()
      .split("T")[0];
    query = query.gte("record_date", oneWeekAgo);
  } else if (filterType === "month") {
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1))
      .toISOString()
      .split("T")[0];
    query = query.gte("record_date", oneMonthAgo);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data;
}
