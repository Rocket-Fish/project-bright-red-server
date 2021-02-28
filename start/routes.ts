/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

Route.get("/", async () => {
  return { hello: "world" };
});

// events
Route.get("events/all", "EventsController.index"); // TODO: comment out for dev/admin use only
Route.post("event", "EventsController.create");
Route.get("event", "EventsController.getEvent");
Route.get("events/mine", "EventsController.myEvents");

Route.get("event/queue", async ({ response }) => response.ok({ todo: "WIP" }));
Route.post("event/queue", async ({ response }) => response.ok({ todo: "WIP" }));

Route.get("event/party", async ({ response }) => response.ok({ todo: "WIP" }));

// auth
Route.post("/register", "AuthController.register");
Route.post("/login", "AuthController.login");

// roles
Route.get("/roles", "RolesController.index");

// health
Route.get("health", async ({ response }) => {
  const report = await HealthCheck.getReport();

  return report.healthy ? response.ok(report) : response.badRequest(report);
  // return response.badRequest(report);
});
