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
        if (format === "json") {

            // Parse the response body
            const data = await response.json();
            //console.log("Json data response: ", data);
            // deno-lint-ignore no-unused-vars
            const { vOpList, ...chargesByInfo } = data;
            console.log("\n🚏 Charges Info:");
            console.table([chargesByInfo]);

            if (!data.vOpList || data.vOpList.length === 0) {
                console.log("⚠️ No transactions found for the given period.");
                return;
            }

            console.log("✅ Charges retrieved successfully.");
            console.table(data.vOpList);
        }
        else {
            // Read response body as text
            const csvText = await response.text();

            // Extract the main fields from the CSV (excluding `vOpList` for now)
            const csvRows = csvText.split("\n").map(row => row.trim()).filter(row => row.length > 0);
            const headers = csvRows[0].split(",");
            const values: string[] = [];
            let insidevOpList = false;
            let vOpListRaw = "";

            csvRows[1].split(",").forEach((part, index) => {
                if (headers[index] === "vOpList" || insidevOpList) {
                    // Keep appending to vOpListRaw until the entire JSON is captured
                    insidevOpList = true;
                    vOpListRaw += part + ",";

                    // Detect end of JSON array
                    if (part.endsWith("}]\"")) {
                        insidevOpList = false;
                        values.push(vOpListRaw.slice(0, -1)); // ✅ Remove trailing comma
                    }
                } else {
                    values.push(part);
                }
            });

            // Convert CSV row into an object
            const csvData: Record<string, string> = {};
            headers.forEach((header, index) => {
                if (header !== "vOpList") {
                    csvData[header] = values[index];
                }
            });
            console.log("\n🚏 Toll Station Info:");
            console.table([csvData]);

            // Extract and parse `vOpList` field (which is a JSON string inside the CSV)
            try {
                const vOpListRaw = values[headers.indexOf("vOpList")];
                if (!vOpListRaw) {
                    console.log("⚠️ No pass records found in the CSV response.");
                    return;
                }

                // Convert JSON string into an arrayheaders.indexOf("vOpList")
                const formattedvOpListRaw = vOpListRaw.replace(/""/g, '"').replace(/^"|"$/g, ""); // Remove surrounding quotes                

                const vOpList = JSON.parse(formattedvOpListRaw);
                console.log("\n✅ Toll Station Passes:");
                console.table(vOpList);
            } catch (error) {
                console.error("❌ Error parsing `vOpList` JSON:", error);
            }
        }
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
