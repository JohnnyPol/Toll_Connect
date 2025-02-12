import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken } from "../../utils.ts";

/**
 * Logs out the user by sending a request to `/logout` and removing the stored token.
 */
async function logout() {
    try {
        // Read stored token
        const token = await getAuthToken();
        if (!token)
            return;


        // Make API request to logout
        const response = await fetch(`${CONFIG.API_URL}/logout`, {
            method: "POST",
            headers: {
                "X-OBSERVATORY-AUTH": token.trim(),
            },
        });

        if (response.ok) {
            // Remove stored token
            await Deno.remove(CONFIG.TOKEN_FILE);
            console.log("Logout successful. Token removed.");
        } else {
            console.error(`Logout failed: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

export const logoutCommand = (program: CommandOptions) => {
    program
        .command("logout", "User Logout")
        .action(async () => {
            await logout();
        });
};
