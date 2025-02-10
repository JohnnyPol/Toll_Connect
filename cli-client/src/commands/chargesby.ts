import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";

/**
 * Fetches charges by a toll operator for a specific date range.
 */
async function fetchChargesBy(opid: string, from: string, to: string, format: string = "json") {
    try {
        console.log(`Fetching charges for operator ${opid} from ${from} to ${to}...`);
        // Read stored token
        const token = await Deno.readTextFile(CONFIG.TOKEN_FILE).catch(() => null);
        if (!token) {
            console.warn("No authentication token found. Already logged out.");
            return;
        }
        // Make API request to logout
        const response = await fetch(`${CONFIG.API_URL}/chargesBy/${opid}/${from}/${to}?format=${format}`, {
            method: "POST",
            headers: {
                "X-OBSERVATORY-AUTH": token.trim(),
            },
        });
        if (response.json.length === 0) {
            console.log("No transactions found for the given period.");
            return;
        }

        console.log("Charges retrieved successfully.");
        console.table(response);
    } catch (error) {
        console.error("Error fetching charges:", error);
    }
}

/**
 * Registers the `chargesby` command with Denomander.
 */
export const chargesByCommand = (program: CommandOptions) => {
    program
        .command("chargesby", "Retrieve charges from other operators")
        .requiredOption("--opid <opid>", "Operator ID")
        .requiredOption("--from <from>", "Start date (YYYYMMDD)")
        .requiredOption("--to <to>", "End date (YYYYMMDD)")
        .action(async ({ opid, from, to, format }: { opid: string; from: string; to: string; format?: string }) => {
            await fetchChargesBy(opid, from, to, format || "csv");
        });
};
