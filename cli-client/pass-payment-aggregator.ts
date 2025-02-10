import fs from "node:fs";
import Papa from "npm:papaparse";
import * as dfd from "npm:danfojs-node";

// Function to extract letters from a string
function extractLetters(text: string): string {
  const match = text.match(/[a-zA-Z]+/);
  return match ? match[0] : "";
}

// Read CSV file
const csvData = fs.readFileSync("passes-sample.csv", "utf8");

// Parse CSV
const parsed = Papa.parse(csvData, { header: true });
let df = new dfd.DataFrame(parsed.data);

// Extract letters from `tollID` into `operatorId`
df.addColumn(
  "operatorId",
  df["tollID"].apply(extractLetters),
  { inplace: true },
);

// Convert `timestamp` to Date (without time)
df.addColumn(
  "timestamp",
  df["timestamp"].apply((ts: string) =>
    new Date(ts).toISOString().split("T")[0]
  ),
  { inplace: true },
);

// Convert `charge` to Decimal (Fixed Precision)
df.addColumn(
  "charge",
  df["charge"].apply((val: string) => parseFloat(val)),
  { inplace: true },
);

// Group by `tagHomeID`, `operatorId`, `timestamp` and sum `charge`
let groupedDf = df.groupby(["tagHomeID", "operatorId", "timestamp"]).col([
  "charge",
]).sum();

// Convert summed charge to fixed point
groupedDf.addColumn(
  "charge_sum",
  groupedDf["charge_sum"].apply((val: number) => Number(val.toFixed(2))),
  { inplace: true }
);


// Save to CSV
dfd.toCSV(groupedDf, { filePath: "aggregated_passes.csv" });

console.log(groupedDf);
