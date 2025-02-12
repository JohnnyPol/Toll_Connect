import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken } from "../../utils.ts";

/*
 * Sends a request to reset all pass records.
*/
async function resetPasses() {
    try {
        console.log("🛠 Resetting all pass records...");

        // Read authentication token
        const token = await getAuthToken();
        if (!token) return;

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        // Perform the API request
        const response = await fetch(`${CONFIG.API_URL}/admin/resetpasses`, {
            method: "POST",
            headers,
        });

        // Handle errors based on response status code
        if (!response.ok) {
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            Deno.exit(1);
        }

        // Parse the response body
        const data = await response.json();

        // Check if reset was successful
        if (data.status === "OK") {
            console.log("✅ All pass records have been reset successfully: \n", data);
        } else if (data.status === "failed") {
            console.error(`❌ Reset failed: \n${data.info || "Unknown error occurred."}`);
            Deno.exit(1);
        } else {
            console.error("❌ Unexpected response format from the server.");
            Deno.exit(1);
        }

    } catch (error) {
        console.error("❌ Reset failed:", error);
    }
}

/**
 * Registers the `resetpasses` command with Denomander.
 */
export const resetPassesCommand = (program: CommandOptions) => {
    program
        .command("resetpasses", "Resets all pass records (Nuke)")
        .action(async () => {
            await resetPasses();
        });
};
