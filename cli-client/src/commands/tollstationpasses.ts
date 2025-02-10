import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";

/**
 * Fetches toll station pass records.
 */
async function fetchTollStationPasses(station: string, from: string, to: string, format: string = "csv") {
    try {
        console.log(`🔍 Fetching pass records for station ${station} from ${from} to ${to}...`);

        // Read authentication token
        let token: string | null = null;
        try {
            token = await Deno.readTextFile(CONFIG.TOKEN_FILE);
            token = token.trim();
        } catch (_error) {
            console.warn("⚠️ No authentication token found. Login first.");
            return;
        }

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        // Perform the API request
        const response = await fetch(`${CONFIG.API_URL}/tollStationPasses/${station}/${from}/${to}?format=${format}`, {
            method: "GET",
            headers,
        });
        console.log("Response: ", response);
        // Handle errors based on response status code
        if (response.status === 204) {
            console.log("✅ No passes found for the given period.");
            return;
        }

        if (!response.ok) {
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            Deno.exit(1);
        }

        // Parse the response body
        const data = await response.json();

        // Check if data is valid
        if (!data.passList || data.passList.length === 0) {
            console.log("✅ No pass records found.");
            return;
        }

        console.log("\n✅ Toll Station Passes:");
        console.table(data.passList);

    } catch (error) {
        console.error("❌ Fetch failed:", error);
    }
}

/**
 * Registers the `tollstationpasses` command with Denomander.
 */
export const tollStationPassesCommand = (program: CommandOptions) => {
    program
        .command("tollstationpasses", "Retrieve pass records from a toll station")
        .requiredOption("--station <station>", "Station ID")
        .requiredOption("--from <from>", "Start date (YYYYMMDD)")
        .requiredOption("--to <to>", "End date (YYYYMMDD)")
        .option("--format <format>", "Response format (json/csv)")
        .action(async ({ station, from, to, format }: { station: string; from: string; to: string; format?: string }) => {
            await fetchTollStationPasses(station, from, to, format || "csv");
        });
};
