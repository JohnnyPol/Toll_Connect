import { CONFIG } from "@/src/config.ts";


export async function apiRequest(endpoint: string, method: string = "GET") {

    let token: string;
    // Add authentication token if available
    try {
        token = await Deno.readTextFile(CONFIG.TOKEN_FILE);
        token = token.trim(); // Ensure it's cleaned
    } catch (_error) {
        console.warn("No authentication token found. Login first.");
        return;
    }


    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: method,
        headers: {
            "X-OBSERVATORY-AUTH": token,
        },
    });

    if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        Deno.exit(1);
    }
    return response;
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
