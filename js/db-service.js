async function saveDailyRecord(recordData) {
  const { data, error } = await supabaseClient
    .from("daily_records")
    .upsert([recordData], { onConflict: "record_date" })
    .select();
  return error ? null : data;
}

// ဒေတာများကို မှန်ကန်စွာ ယူဆောင်ရန်
async function getAllRecordsFromDB() {
  const { data, error } = await supabaseClient
    .from("daily_records")
    .select("*")
    .order("record_date", { ascending: true }); // ⚠️ Monday To Friday စဉ်ရန် true ထားပါသည်
  return error ? [] : data;
}
