import Denomander from "https://deno.land/x/denomander@0.9.3/mod.ts";
import { loginCommand } from "@/src/commands/authentication/login.ts";
import { logoutCommand } from "@/src/commands/authentication/logout.ts";
import { resetPassesCommand } from "@/src/commands/admin/resetpasses.ts";
import { resetStationsCommand } from "@/src/commands/admin/resetstations.ts";
import { healthCheckCommand } from "@/src/commands/admin/healthcheck.ts";
import { adminCommands } from "@/src/commands/admin/admin.ts";
import { chargesByCommand } from "@/src/commands/chargesby.ts";
import { tollStationPassesCommand } from "@/src/commands/tollstationpasses.ts";
import { passesCostCommand } from "@/src/commands/passsescost.ts";
import { passAnalysisCommand } from "@/src/commands/passanalysis.ts";

const program = new Denomander({
  app_name: "Toll Connect Adminstration CLI",
  app_description: "THE control panel for Toll Connect",
  app_version: "0.0.1",
});

// Register commands
loginCommand(program);
logoutCommand(program);

// Admin Commands
resetPassesCommand(program);
resetStationsCommand(program);
healthCheckCommand(program);
adminCommands(program);

// Features
chargesByCommand(program);
tollStationPassesCommand(program);
passesCostCommand(program);
passAnalysisCommand(program);


// Ensure `--help` is shown when an error occurs
program.errorMessages({
  COMMAND_NOT_FOUND: "Command not found! Use --help to see available commands.",
  OPTION_NOT_FOUND: "Invalid option! Use --help to see correct usage.",
  REQUIRED_OPTION_NOT_FOUND: "Missing required option! Check --help for required options.",
  REQUIRED_VALUE_NOT_FOUND: "Missing required value for a command option! Use --help to see correct usage.",
  TOO_MANY_PARAMS: "Error: Too many parameters provided! Double-check your input.",
  INVALID_RULE: "Error: The provided input does not match the expected format.",
  REQUIRED_COMMAND_VALUE_NOT_FOUND: "Error: A required value for a command is missing.",
  OPTION_CHOICE: "Error: Invalid option choice! Use --help to view valid choices.",
  ONLY_ONE_COMMAND_ALLOWED: "Error: Multiple commands detected! Only one command is allowed at a time.",
});

program.parse(Deno.args);

function fetchPassAnalysis(program: Denomander) {
  throw new Error("Function not implemented.");
}
