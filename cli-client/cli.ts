import Denomander from "https://deno.land/x/denomander@0.9.3/mod.ts";
import { loginCommand } from "@/src/commands/authentication/login.ts";
import { logoutCommand } from "@/src/commands/authentication/logout.ts";
import { resetPassesCommand } from "@/src/commands/admin/resetpasses.ts";
import { resetStationsCommand } from "@/src/commands/admin/resetstations.ts";
import { healthCheckCommand } from "@/src/commands/admin/healthcheck.ts";
import { adminCommands } from "@/src/commands/admin/admin.ts";
import { chargesByCommand } from "@/src/commands/chargesby.ts";

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


program.parse(Deno.args);
