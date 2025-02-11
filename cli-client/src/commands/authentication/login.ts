import type { CommandOptions } from "@/types.ts";
import { apiLoginRequest } from "../../utils.ts"
import { CONFIG } from "@/src/config.ts";


// Function to hash the password with SHA-512
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

// Logs in the user and saves the authentication token.
async function login(username: string, password: string) {
  try {
    console.log("Logging in...");
    const passwordhash = hashPassword(password);
    const response = await apiLoginRequest(username, await passwordhash);

    if (response.token) {
      await Deno.writeTextFile(CONFIG.TOKEN_FILE, response.token);
      console.log("Login successful! Token saved.");
    } else {
      console.error(" Login failed: No token received.");
      Deno.exit(1);
    }
  } catch (error) {
    console.error("Login failed:", error);
    Deno.exit(1);
  }
}
export const loginCommand = (program: CommandOptions) => {
  program
    .command("login", "User Login")
    .requiredOption("--username <username>", "Define the Username")
    .requiredOption("--passw <password>", "Define the Password")
    .action(async ({ username, passw }: { username: string; passw: string }) => {

      await login(username, passw);

    });
};
