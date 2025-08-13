
import { generatePassword } from "./passwordUtils";
import { toast } from "sonner";

// Helper to wait until the profile record is created after sign up
async function waitForProfileCreation(userId: string, attempts = 10, delayMs = 500) {
  for (let i = 0; i < attempts; i++) {
    // Все обращения к supabase удалены. Временные заглушки:
    // const { data } = await supabase
    //   .from("profiles")
    //   .select("id")
    //   .eq("id", userId)
    //   .single();
    // if (data) {
    //   return true;
    // }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

// Function to register a guest user and place an order
export async function guestCheckout() { return null; }

// Function to send welcome email to guest users
async function sendWelcomeEmail(email: string, name: string, password: string): Promise<void> {
  // In a real application, you would use an email service like SendGrid, Mailgun, etc.
  // For now, we'll just log the message
  console.log(`Welcome email would be sent to ${email} with password ${password}`);
  
  // Placeholder for email sending functionality
  // This would be replaced with actual email sending code
  toast("Письмо с данными для входа отправлено на указанную почту");
}
