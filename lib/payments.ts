export type PaymentResult = { ok:boolean; reference?:string; message:string };

export async function createSahalPayment(input:{amount:number, orderNumber:string, phone:string}):Promise<PaymentResult>{
  if (process.env.SAHAL_ENABLED !== "true") {
    return {ok:false, message:"Sahal is not configured. Add approved merchant/API credentials in .env."};
  }
  // IMPORTANT: Implement the exact Sahal/Golis merchant API contract supplied to your business.
  // Never invent endpoints or credentials. Verify payment using the provider webhook/status API.
  return {ok:false, message:"Sahal adapter is enabled but the provider-specific API contract must be implemented."};
}
