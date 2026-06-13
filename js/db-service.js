// 🆕 တွက်ချက်ပြီး ဒေတာသိမ်းဆည်းရာတွင် လက်ရှိ Login ဝင်ထားသော User ID ကိုပါ ထည့်သွင်းသိမ်းဆည်းခြင်း
async function saveDailyRecord(recordData) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) return null;

  // Record ထဲသို့ လက်ရှိ user_id ကို ပူးတွဲထည့်သွင်းခြင်း
  const finalizedData = {
    ...recordData,
    user_id: user.id,
  };

  const { data, error } = await supabaseClient
    .from("daily_records")
    .upsert([finalizedData], { onConflict: "user_id,record_date" }) // 🆕 user_id ပါဝင်သော Multi-user Key စနစ်
    .select();

  if (error) console.error("Error saving data:", error.message);
  if (!error) {
    // update local cache immediately so UI can reuse fresh data without refetching
    try {
      _recordsCache.data = data || [];
      _recordsCache.ts = Date.now();
    } catch (e) {
      // ignore if cache isn't available in this scope
    }
  }
  return error ? null : data;
}

// 🆕 ဒေတာဆွဲယူရာတွင် RLS ရှိနေသဖြင့် ဝင်ထားသော User ၏ ဒေတာများကိုသာ Auto စစ်ထုတ်ပေးမည်
// 🆕 ဒေတာဆွဲယူရာတွင် လက်ရှိ Login ဝင်ထားသော User ID ၏ ဒေတာသက်သက်ကိုသာ စစ်ထုတ်ယူခြင်း
async function getAllRecordsFromDB() {
    // Lightweight in-module cache to avoid redundant network calls during rapid UI interactions
    // TTL kept small so recent saves reflect quickly but repetitive UI re-renders don't refetch constantly
  }

  // In-module cache
  let _recordsCache = { data: [], ts: 0 };
  const RECORDS_CACHE_TTL = 30 * 1000; // 30 seconds

  // Fetch all records for current logged-in user with optional force refresh
  async function getAllRecordsFromDB(forceRefresh = false) {
    if (!forceRefresh && _recordsCache.data.length && Date.now() - _recordsCache.ts < RECORDS_CACHE_TTL) {
      return _recordsCache.data;
    }

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabaseClient
      .from('daily_records')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', { ascending: true });

    if (error) {
      console.error('Error fetching records:', error.message || error);
      return [];
    }

    _recordsCache = { data: data || [], ts: Date.now() };
    return _recordsCache.data;
}