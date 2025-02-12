import { assertEquals, assertNotEquals } from "https://deno.land/std@0.213.0/assert/mod.ts";
import { getAuthToken, isValidFormat, hashPassword } from "@/src/utils.ts";
import { CONFIG } from "@/src/config.ts";

/**
 * Test `getAuthToken`
 */
Deno.test("getAuthToken returns a valid token if the file exists", async () => {
    // Create a temporary token file
    const tempFile = await Deno.makeTempFile();
    await Deno.writeTextFile(tempFile, "test_token");

    // Mock CONFIG.TOKEN_FILE to use temp file
    const originalTokenFile = CONFIG.TOKEN_FILE;
    CONFIG.TOKEN_FILE = tempFile;

    const token = await getAuthToken();
    assertEquals(token, "test_token");

    // Cleanup
    await Deno.remove(tempFile);
    CONFIG.TOKEN_FILE = originalTokenFile;
});

Deno.test("getAuthToken returns null if the token file does not exist", async () => {
    // Mock CONFIG.TOKEN_FILE to a non-existent file
    const originalTokenFile = CONFIG.TOKEN_FILE;
    CONFIG.TOKEN_FILE = "non_existent_file.txt";

    const token = await getAuthToken();
    assertEquals(token, null);

    CONFIG.TOKEN_FILE = originalTokenFile;
});

/**
 * Test `isValidFormat`
 */
Deno.test("isValidFormat should return true for valid formats", () => {
    assertEquals(isValidFormat("json"), true);
    assertEquals(isValidFormat("csv"), true);
});

Deno.test("isValidFormat should return false for invalid formats", () => {
    const originalConsoleError = console.error; // Backup original console.error
    console.error = () => { }; // Temporarily disable error logging

    assertEquals(isValidFormat("xml"), false);
    assertEquals(isValidFormat("txt"), false);
    assertEquals(isValidFormat(""), false);

    console.error = originalConsoleError; // Restore console.error
});

/**
 * Test `hashPassword`
 */
Deno.test("hashPassword should return a hashed value of the password", async () => {
    const password = "securepassword123";
    const hashed1 = await hashPassword(password);
    const hashed2 = await hashPassword(password);

    // ✅ The same password should produce the same hash
    assertEquals(hashed1, hashed2);

    // ✅ The hash should not be the same as the original password
    assertNotEquals(hashed1, password);
});
