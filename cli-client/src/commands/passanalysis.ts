import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";

/**
 * Fetches pass analysis data between two operators for a specific date range.
 */
async function fetchPassAnalysis(stationop: string, tagop: string, from: string, to: string) {
    try {
        console.log(`🔍 Fetching pass analysis between operators ${stationop} and ${tagop} from ${from} to ${to}...`);

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
        const response = await fetch(`${CONFIG.API_URL}/passAnalysis/${stationop}/${tagop}/${from}/${to}`, {
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

        // Check if data is valid
        if (!data.totalPasses || !data.totalCost) {
            console.log("✅ No pass analysis data available for the specified period.");
            return;
        }

        console.log("\n✅ Pass Analysis Summary:");
        console.table({
            "Operator 1": stationop,
            "Operator 2": tagop,
            "Date Range": `${from} to ${to}`,
            "Total Passes": data.totalPasses,
            "Total Cost (€)": data.totalCost,
        });

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
        .action(async ({ stationop, tagop, from, to }: { stationop: string; tagop: string; from: string; to: string }) => {
            await fetchPassAnalysis(stationop, tagop, from, to);
        });
};
