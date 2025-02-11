import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken } from "../../utils.ts";

/**
 * Sends a request to reset toll stations.
 */
async function resetStations() {
    try {
        console.log("🛠 Resetting toll stations...");

        // Read authentication token
        const token = await getAuthToken();
        if (!token) return;

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        // Perform the API request
        const response = await fetch(`${CONFIG.API_URL}/admin/resetstations`, {
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
            console.log("✅ Toll stations have been reset successfully: \n", data);
        } else if (data.status === "failed") {
            console.error(`❌ Reset failed: ${data.info || "Unknown error occurred."}`);
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
 * Registers the `resetstations` command with Denomander.
 */
export const resetStationsCommand = (program: CommandOptions) => {
    program
        .command("resetstations", "Resets all toll station records")
        .action(async () => {
            await resetStations();
        });
};
