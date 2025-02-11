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
        if (format === "json") {
            // Parse the response body
            const data = await response.json();

            //console.log("Json data response: ", data);

            // deno-lint-ignore no-unused-vars
            const { passList, ...passInfo } = data;
            console.log("\n🚏 Passes Info:");
            console.table([passInfo]); // Put it inside an array for correct table formatting

            // Check if data is valid
            if (!data.passList || data.passList.length === 0) {
                console.log("✅ No pass records found.");
                return;
            }

            console.log("\n✅ Toll Station Passes:");
            console.table(data.passList);
        }
        else {
            // Read response body as text
            const csvText = await response.text();

            // Extract the main fields from the CSV (excluding `passList` for now)
            const csvRows = csvText.split("\n").map(row => row.trim()).filter(row => row.length > 0);
            const headers = csvRows[0].split(",");
            const values: string[] = [];
            let insidePassList = false;
            let passListRaw = "";

            csvRows[1].split(",").forEach((part, index) => {
                if (headers[index] === "passList" || insidePassList) {
                    // Keep appending to passListRaw until the entire JSON is captured
                    insidePassList = true;
                    passListRaw += part + ",";

                    // Detect end of JSON array
                    if (part.endsWith("}]\"")) {
                        insidePassList = false;
                        values.push(passListRaw.slice(0, -1)); // ✅ Remove trailing comma
                    }
                } else {
                    values.push(part);
                }
            });

            // Convert CSV row into an object
            const csvData: Record<string, string> = {};
            headers.forEach((header, index) => {
                if (header !== "passList") {
                    csvData[header] = values[index];
                }
            });
            console.log("\n🚏 Toll Station Info:");
            console.table([csvData]);

            // Extract and parse `passList` field (which is a JSON string inside the CSV)
            try {
                const passListRaw = values[headers.indexOf("passList")];
                if (!passListRaw) {
                    console.log("⚠️ No pass records found in the CSV response.");
                    return;
                }

                // Convert JSON string into an arrayheaders.indexOf("passList")
                const formattedPassListRaw = passListRaw.replace(/""/g, '"').replace(/^"|"$/g, ""); // Remove surrounding quotes                

                const passList = JSON.parse(formattedPassListRaw);
                console.log("\n✅ Toll Station Passes:");
                console.table(passList);
            } catch (error) {
                console.error("❌ Error parsing `passList` JSON:", error);
            }
        }
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
