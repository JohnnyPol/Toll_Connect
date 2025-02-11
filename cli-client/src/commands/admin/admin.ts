import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken } from "../../utils.ts";

/**
 * Handles different admin operations.
 */
async function executeAdminCommand(
    usermod: boolean,
    users: boolean,
    addpasses: boolean,
    username?: string,
    passw?: string,
    source?: string
) {
    try {
        console.log("🛠 Executing admin operation...");

        // Read authentication token
        const token = await getAuthToken();
        if (!token) return;

        // Define headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-OBSERVATORY-AUTH": token,
        };

        let endpoint = "";
        let requestBody: object | undefined;

        // Modify user credentials
        if (usermod) {
            if (!username || !passw) {
                console.error("❌ Error: --username and --passw are required for user modification.");
                return;
            }
            endpoint = `/admin/usermod`;
            requestBody = { username, password: passw };
        }

        // List all users
        else if (users) {
            endpoint = `/admin/users`;
        }

        // Add passes from CSV file
        else if (addpasses) {
            if (!source) {
                console.error("❌ Error: --source (CSV file path) is required for adding passes.");
                return;
            }

            // Read file contents
            let file: Uint8Array;
            try {
                file = await Deno.readFile(source);
            } catch (_error) {
                console.error("❌ Error: File not found or cannot be read.");
                return;
            }

            const formData = new FormData();
            formData.append("file", new Blob([file], { type: "text/csv" }), source);

            endpoint = `/admin/addpasses`;
            requestBody = formData;
        }

        // If no valid option was selected
        else {
            console.error("❌ Error: No valid admin option provided.");
            return;
        }

        // Perform the API request
        const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: requestBody ? JSON.stringify(requestBody) : undefined,
        });

        // Handle errors based on response status code
        if (!response.ok) {
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            Deno.exit(1);
        }

        // Parse the response body
        const data = await response.json();

        // Check if operation was successful
        if (data.status === "OK") {
            console.log("✅ Success.");
        } else if (data.status === "failed") {
            console.error(`❌ Operation failed: ${data.info || "Unknown error occurred."}`);
            Deno.exit(1);
        } else {
            console.error("❌ Error");
            Deno.exit(1);
        }

    } catch (error) {
        console.error("❌ Execution failed:", error);
    }
}

/**
 * Registers the `admin` command with Denomander.
 */
export const adminCommands = (program: CommandOptions) => {
    program
        .command("admin", "Administration Commands")
        .option("--usermod", "Modify user credentials")
        .option("--users", "List all users")
        .option("--addpasses", "Insert new pass data")
        .option("--username <username>", "Username of the user to modify")
        .option("--passw <newpassw>", "New password for the user")
        .option("--source <path>", "Path to the CSV file containing new passes")
        .action(async ({
            usermod,
            users,
            addpasses,
            username,
            passw,
            source,
        }: {
            usermod: boolean;
            users: boolean;
            addpasses: boolean;
            username?: string;
            passw?: string;
            source?: string;
        }) => {
            await executeAdminCommand(usermod, users, addpasses, username, passw, source);
        });
};
