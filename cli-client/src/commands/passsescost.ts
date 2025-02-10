import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";

/**
 * Fetches total cost of passes for a specific tag operator within a date range.
 */
async function fetchPassesCost(tagOp: string, from: string, to: string) {
    try {
        console.log(`🔍 Fetching pass cost for tag operator ${tagOp} from ${from} to ${to}...`);

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
        const response = await fetch(`${CONFIG.API_URL}/passesCost/${tagOp}/${from}/${to}`, {
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
        if (!data.totalCost) {
            console.log("✅ No cost data available for the specified period.");
            return;
        }

        console.log("\n✅ Passes Cost Summary:");
        console.table({
            "Tag Operator": tagOp,
            "Date Range": `${from} to ${to}`,
            "Total Cost (€)": data.totalCost,
        });

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
        .requiredOption("--tagOp <tagOp>", "Tag Operator ID")
        .requiredOption("--from <from>", "Start date (YYYYMMDD)")
        .requiredOption("--to <to>", "End date (YYYYMMDD)")
        .action(async ({ tagOp, from, to }: { tagOp: string; from: string; to: string }) => {
            await fetchPassesCost(tagOp, from, to);
        });
};
