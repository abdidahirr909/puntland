export async function sendWhatsApp(phone:string, message:string) {
  if (process.env.WHATSAPP_ENABLED !== "true") return {ok:false, message:"WhatsApp provider not configured"};
  // Provider-specific API call goes here after you choose a supported WhatsApp Business provider.
  return {ok:false, message:"WhatsApp adapter placeholder"};
}
export async function sendSms(phone:string, message:string) {
  if (process.env.SMS_ENABLED !== "true") return {ok:false, message:"SMS provider not configured"};
  return {ok:false, message:"SMS adapter placeholder"};
}
