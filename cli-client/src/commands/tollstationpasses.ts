import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken, isValidFormat } from "@/src/utils.ts";

/**
 * Fetches toll station pass records.
 */
async function fetchTollStationPasses(station: string, from: string, to: string, format: string = "csv") {
    try {
        // Check if the --format option is valid
        if (!isValidFormat(format)) return;

        console.log(`🔍 Fetching pass records for station ${station} from ${from} to ${to}...`);

        // Read authentication token
        const token = await getAuthToken();
        if (!token) return;

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
            const { passList, ...tollStationInfo } = data;
            console.log("\n🚏 Toll Station Info:");
            console.table([tollStationInfo]); // Put it inside an array for correct table formatting

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
            // Split the CSV into rows and clean up empty lines
            const csvRows = csvText.split("\n").map(row => row.trim()).filter(row => row.length > 0);

            // Extract headers and values
            const headers = csvRows[0].split(",");
            const values = csvRows.slice(1).map(row => row.split(","));

            // Extract general toll station info (first unique row, up until nPasses column)
            const stationInfoHeaders = headers.slice(0, 6); // stationID to nPasses
            const stationInfoValues = values[0].slice(0, 6); // First row (only general info)

            // Display Toll Station Information (excluding individual pass records)
            console.log("\n🚏 Toll Station Info:");
            console.table([{ ...Object.fromEntries(stationInfoHeaders.map((h, i) => [h, stationInfoValues[i]])) }]);

            // Extract passList records (passIndex onwards)
            const passListHeaders = headers.slice(6); // Headers from passIndex onwards
            const passListValues = values.map(row => row.slice(6)); // Extract only pass data

            // Convert extracted data into an array of objects for console.table()
            const passList = passListValues.map(row => Object.fromEntries(passListHeaders.map((h, i) => [h, row[i]])));

            // Display Pass Records in a table format
            console.log("\n✅ Toll Station Passes:");
            console.table(passList);
        }

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
