import type { CommandOptions } from "@/types.ts";

export const logoutCommand = (program: CommandOptions) => {
  program
    .command("logout", "User Logout")
    .action(() => {
			console.log("Logging out...");
    });
};
