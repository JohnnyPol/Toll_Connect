import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken } from "@/src/utils.ts";

/**
 * Fetches and displays the system health status.
 */
async function fetchHealthCheck() {
  try {
    console.log("🔍 Checking system health...");

    // Read authentication token if available
    const token = await getAuthToken();
    if (!token) return;
    // Define headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["X-OBSERVATORY-AUTH"] = token;
    }

    // Perform the API request
    const response = await fetch(`${CONFIG.API_URL}/admin/healthcheck`, {
      method: "GET",
      headers,
    });

    // Handle errors
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      Deno.exit(1);
    }

    // Parse response
    const data = await response.json();

    console.log("\n✅ System Health Status:");
    console.table({
      Status: data.status,
      "DB Connection": data.dbconnection,
      "Toll Stations": data.n_stations,
      "Tags Count": data.n_tags,
      "Passes Count": data.n_passes,
    });

  } catch (error) {
    console.error("❌ Health check failed:", error);
  }
}

/**
 * Registers the `healthcheck` command with Denomander.
 */
export const healthCheckCommand = (program: CommandOptions) => {
  program
    .command("healthcheck", "Check the system's health")
    .action(async () => {
      await fetchHealthCheck();
    });
};
