import type { CommandOptions } from "@/types.ts";
import { CONFIG } from "@/src/config.ts";
import { getAuthToken, hashPassword } from "@/src/utils.ts";

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
            const passwordHash = await hashPassword(passw);

            // Make a POST request to the /login API
            const response = await fetch('http://localhost:9115/api/admin/addadmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-OBSERVATORY-AUTH': token,
                },
                body: new URLSearchParams({
                    id: username,
                    password: passwordHash,
                }).toString(),
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
                console.log("✅ Success.\n");
                console.log("Response JSON: ", data)
            } else if (data.status === "failed") {
                console.error(`❌ Operation failed:\n ${data.info || "Unknown error occurred."}`);
                Deno.exit(1);
            } else {
                console.error("❌ Error");
                Deno.exit(1);
            }
            return;
        }

        // List all users
        else if (users) {

            // Make a POST request to the /login API
            const response = await fetch('http://localhost:9115/api/admin/', {
                method: 'POST',
                headers: {
                    'X-OBSERVATORY-AUTH': token,
                },
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
                console.log("✅ Success.\n", data);
            } else if (data.status === "failed") {
                console.error(`❌ Operation failed:\n ${data.info || "Unknown error occurred."}`);
                Deno.exit(1);
            } else {
                console.error("❌ Error");
                Deno.exit(1);
            }
        }

        // Add passes from CSV file
        else if (addpasses) {

            if (!source) {
                console.error("❌ Error: --source (CSV file path) is required for adding passes.");
                return;
            }

            try {
                console.log(`📂 Reading CSV file: ${source}`);
                // Read the CSV file
                const fileData = await Deno.readFile(source);

                // Create a FormData object
                const formData = new FormData();
                formData.append("file", new Blob([fileData], { type: "text/csv" }), source);

                console.log("📤 Sending file to API...");
                // Perform the API request
                const response = await fetch(`${CONFIG.API_URL}/admin/addpasses`, {
                    method: "POST",
                    headers: { "X-OBSERVATORY-AUTH": token },
                    body: formData,
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
                    console.log("✅ Success.\n");
                    console.log("Response JSON: ", data)
                } else if (data.status === "failed") {
                    console.error(`❌ Operation failed:\n ${data.info || "Unknown error occurred."}`);
                    Deno.exit(1);
                } else {
                    console.error("❌ Error");
                    Deno.exit(1);
                }
                return;
            } catch (error) {
                console.error("❌ Error: Failed to read file:", error);
                return;
            }
        }


        // If no valid option was selected
        else {
            console.error("❌ Error: No valid admin option provided.");
            return;
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
