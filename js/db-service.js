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
  return error ? null : data;
}

// 🆕 ဒေတာဆွဲယူရာတွင် RLS ရှိနေသဖြင့် ဝင်ထားသော User ၏ ဒေတာများကိုသာ Auto စစ်ထုတ်ပေးမည်
// 🆕 ဒေတာဆွဲယူရာတွင် လက်ရှိ Login ဝင်ထားသော User ID ၏ ဒေတာသက်သက်ကိုသာ စစ်ထုတ်ယူခြင်း
async function getAllRecordsFromDB() {
    // ၁။ လက်ရှိ Login ဝင်ထားတဲ့ user ကို အရင်တောင်းရယူရပါမယ်
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return []; // User မရှိရင် ဘာဒေတာမှ မပြဘဲ ပိတ်မည်

    // ၂။ ဒေတာဘေ့စ်ထဲက user_id ကွင်းပြင်သည် လက်ရှိ user.id နှင့် တူညီသော record များကိုသာ ဆွဲယူမည်
    const { data, error } = await supabaseClient
        .from('daily_records')
        .select('*')
        .eq('user_id', user.id) // 🎯 ဤနေရာတွင် လက်ရှိ User ဒေတာတစ်ခုတည်းဖြစ်အောင် အသေသပ် စစ်ထုတ်လိုက်ပါပြီ
        .order('record_date', { ascending: true });
        
    return error ? [] : data;
}