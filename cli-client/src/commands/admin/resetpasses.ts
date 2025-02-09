import type { CommandOptions } from "@/types.ts";

export const resetPassesCommand = (program: CommandOptions) => {
  program
    .command("resetpasses", "Resets Pass Records (Nuke)")
    .action(() => {
			console.log("Nuking...");
    });
};

