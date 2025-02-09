import type { CommandOptions } from "@/types.ts";

export const healthCheckCommand = (program: CommandOptions) => {
  program
    .command("healthcheck", "Check the system's health")
    .action(() => {
			console.log("Hopefully all good!");
    });
};

