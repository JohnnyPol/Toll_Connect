import Denomander from "https://deno.land/x/denomander/mod.ts";
import { loginCommand } from "@/commands/login.ts";
import { logoutCommand } from "@/commands/logout.ts";
import { resetPassesCommand } from "@/commands/admin/resetpasses.ts";
import { resetStationsCommand } from "@/commands/admin/resetstations.ts";
import { healthCheckCommand } from "@/commands/admin/healthcheck.ts";
import { adminCommands } from "@/commands/admin/admin.ts";

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

program.parse(Deno.args);
