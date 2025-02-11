import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken, isValidFormat } from "@/src/utils.ts";

/**
 * Fetches pass analysis data between two operators for a specific date range.
 */
async function fetchPassAnalysis(stationop: string, tagop: string, from: string, to: string, format: string) {
    try {
        // Check if the --format option is valid
        if (!isValidFormat(format)) return;

        console.log(`🔍 Fetching pass analysis between operators ${stationop} and ${tagop} from ${from} to ${to}...`);

        // Read authentication token
        const token = await getAuthToken();
        if (!token) return;

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        // Perform the API request
        const response = await fetch(`${CONFIG.API_URL}/passAnalysis/${stationop}/${tagop}/${from}/${to}/?format=${format}`, {
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
        // TODO: See if you need to output all the parameters including the passList.
        // Check if data is valid
        if (!data) {
            console.log("✅ No pass analysis data available for the specified period.");
            return;
        }

        console.log("\n✅ Pass Analysis Summary:");
        console.table(data.passList);

    } catch (error) {
        console.error("❌ Fetch failed:", error);
    }
}

/**
 * Registers the `passanalysis` command with Denomander.
 */
export const passAnalysisCommand = (program: CommandOptions) => {
    program
        .command("passanalysis", "Retrieve pass statistics between two operators")
        .requiredOption("--stationop <stationop>", "Operator 1 ID")
        .requiredOption("--tagop <tagop>", "Operator 2 ID")
        .requiredOption("--from <from>", "Start date (YYYYMMDD)")
        .requiredOption("--to <to>", "End date (YYYYMMDD)")
        .option("--format <format>", "Response format (json/csv)")
        .action(async ({ stationop, tagop, from, to, format }: { stationop: string; tagop: string; from: string; to: string, format: string }) => {
            await fetchPassAnalysis(stationop, tagop, from, to, format || "csv");
        });
};
