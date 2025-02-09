import { CommandOptions } from "@/types.ts";

export const adminCommands = (program: CommandOptions) => {
  program
    .command("admin", "Administration Commands")
    .option("--usermod", "Modify user credential")
    .option("--users", "List all users")
    .option("--addpasses", "Insert new pass data")
    .option("--username [user]", "Username of the user to modify")
    .option("--passw [newpassw]", "New password for the user")
    .option("--source [path]", "Path to the CSV file containing new passes")
    .action(({ usermod, users, addpasses, username, passw, source }: {
      usermod: boolean;
      users: boolean;
      addpasses: boolean;
      username?: string;
      passw?: string;
      source?: string;
    }) => {
      if (usermod) {
        console.log(`Setting new password for ${username} : ${passw}`);
      } else if (users) {
        console.log("Cooking up your users!!!");
      } else if (addpasses) {
        console.log(`Adding passes from ${source}`);
      } else {
        throw new Error(
          "Invalid command. Use --usermod, --users, or --addpasses",
        );
      }
    });
};
