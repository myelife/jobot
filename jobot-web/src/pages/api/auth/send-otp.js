import { getChatResponseHeaders } from "@/network";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  const headers = getChatResponseHeaders();

  for (const key in headers) {
    res.setHeader(key, headers[key]);
  }

  if (req.method !== "POST") {
    res.send(405).json({ message: "Method not supported" });
    return;
  }
  const { email } = req.body || {};

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const supabase = createServerSupabaseClient({ req, res });

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    res
      .send(500)
      .json({ message: "Failed to send verification code. " + error.message });
    return;
  }

  res.status(200).json({ message: "Verification code sent" });
}
