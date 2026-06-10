async function saveDailyRecord(recordData) {
  const { data, error } = await supabaseClient
    .from("daily_records")
    .upsert([recordData], { onConflict: "record_date" })
    .select();
  return error ? null : data;
}

async function getAllRecordsFromDB() {
  const { data, error } = await supabaseClient
    .from("daily_records")
    .select("*")
    .order("record_date", { ascending: true }); // တနင်္လာမှ သောကြာ အစဉ်လိုက်ရရန်
  return error ? [] : data;
}
