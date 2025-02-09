import type { CommandOptions } from "@/types.ts";

export const resetStationsCommand = (program: CommandOptions) => {
  program
    .command("resetstations", "Resets Stations to original state")
    .action(() => {
			console.log("Reprogramming beep beep...");
    });
};