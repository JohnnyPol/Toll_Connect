import { CONFIG } from "@/src/config.ts";


/**
 * Reads and returns the authentication token from the stored file.
 * @returns {Promise<string | null>} The token if found, otherwise `null`.
 */
export async function getAuthToken(): Promise<string | null> {
    try {
        const token = await Deno.readTextFile(CONFIG.TOKEN_FILE);
        return token.trim();
    } catch (_error) {
        console.warn("⚠️ No authentication token found. Login first.");
        return null;
    }
}

/**
 * Special API request function for login requests.
 */
export async function apiLoginRequest(username: string, passwordHash: string) {

    const response = await fetch(`${CONFIG.API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: username,
            password: passwordHash,
        }).toString(),
    });
    if (!response.ok) {
        console.error(`Login failed: ${response.status} ${response.statusText}`);
        Deno.exit(1);
    }

    return response.json();
}


/**
 * Validates the `--format` option.
 * @param {string} format - The format string to validate.
 * @returns {boolean} Returns `true` if valid, otherwise `false`.
 */
export function isValidFormat(format: string): boolean {
    const validFormats = ["json", "csv"];
    if (!validFormats.includes(format)) {
        console.error("❌ Error: --format can only have 'json' or 'csv' value.");
        return false;
    }
    return true;
}