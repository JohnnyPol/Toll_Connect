import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken, isValidFormat } from "@/src/utils.ts";

/**
 * Fetches charges by a toll operator for a specific date range.
 */
async function fetchChargesBy(opid: string, from: string, to: string, format: string = "json") {
    try {
        // Check if the --format option is valid
        if (!isValidFormat(format)) return;


        console.log(`🔍 Fetching charges for operator ${opid} from ${from} to ${to}...`);

        // Read stored token
        const token = await getAuthToken();
        if (!token) return;

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        // Make API request to logout
        const response = await fetch(`${CONFIG.API_URL}/chargesBy/${opid}/${from}/${to}?format=${format}`, {
            method: "GET",
            headers,
        });

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
        //console.log("Json data response: ", data);

        if (!data.vOpList || data.vOpList.length === 0) {
            console.log("⚠️ No transactions found for the given period.");
            return;
        }

        console.log("✅ Charges retrieved successfully.");
        console.table(data.vOpList);
    } catch (error) {
        console.error("❌ Error fetching charges:", error);
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
        .option("--format <format>", "")
        .action(async ({ opid, from, to, format }: { opid: string; from: string; to: string; format?: string }) => {
            await fetchChargesBy(opid, from, to, format || "csv");
        });
};
