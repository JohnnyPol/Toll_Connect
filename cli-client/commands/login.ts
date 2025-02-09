import type { CommandOptions } from "@/types.ts";

export const loginCommand = (program: CommandOptions) => {
  program
    .command("login", "User Login")
    .requiredOption("--username <username>", "Define the Username")
    .requiredOption("--passw <password>", "Define the Password")
    .action(({ username, passw }: { username: string; passw: string }) => {
      console.log(username, passw);
    });
};
