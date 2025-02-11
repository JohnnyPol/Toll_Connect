import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken, isValidFormat } from "@/src/utils.ts";

/**
 * Fetches total cost of passes for a specific tag operator within a date range.
 */
async function fetchPassesCost(stationop: string, tagop: string, from: string, to: string, format: string) {
    try {
        // Check if the --format option is valid
        if (!isValidFormat(format)) return;

        console.log(`🔍 Fetching passes cost for station operator ${stationop} with tag operator ${tagop} from ${from} to ${to}...`);

        // Read authentication token
        const token = await getAuthToken();
        if (!token) return;

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        // Perform the API request
        const response = await fetch(`${CONFIG.API_URL}/passesCost/${stationop}/${tagop}/${from}/${to}/?format=${format}`, {
            method: "GET",
            headers,
        });

        // Handle errors based on response status code
        if (response.status === 204) {
            console.log("✅ No pass records found for the given period.");
            return;
        }

        if (!response.ok) {
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            Deno.exit(1);
        }

        // Parse the response body
        const data = await response.json();
        //console.log("Response JSON:, ", data);

        // Check if data is valid
        if (!data) {
            console.log("✅ No cost data available for the specified period.");
            return;
        }

        console.log("\n✅ Passes Cost Summary:");
        console.table(data);

    } catch (error) {
        console.error("❌ Fetch failed:", error);
    }
}

/**
 * Registers the `passescost` command with Denomander.
 */
export const passesCostCommand = (program: CommandOptions) => {
    program
        .command("passescost", "Retrieve total cost of passes for a tag operator")
        .requiredOption("--stationop <stationop>", "Station Operator ID")
        .requiredOption("--tagop <tagOp>", "Tag Operator ID")
        .requiredOption("--from <from>", "Start date (YYYYMMDD)")
        .requiredOption("--to <to>", "End date (YYYYMMDD)")
        .option("--format <format>", "Response format (json/csv)")
        .action(async ({ stationop, tagop, from, to, format }: { stationop: string, tagop: string; from: string; to: string, format: string }) => {
            await fetchPassesCost(stationop, tagop, from, to, format || "csv");
        });
};
