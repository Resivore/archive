// src/_data/users.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

module.exports = async () => {
  // these env vars you’ll set in Netlify (or your local .env):
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase credentials; skipping user data fetch.");
    return [];
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  let { data: users, error } = await supabase
    .from("users")
    .select("id, wajasid, username");  // pull any fields you need

  if (error) {
    console.error("🛑 Failed to fetch users:", error);
    return [];
  }
  return users;
};
