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
import EventController from "App/Controllers/Http/EventsController";
import AuthController from "App/Controllers/Http/AuthController";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.get("events", new EventController().index);
Route.post("event", new EventController().create);

Route.get("health", async ({ response }) => {
  const report = await HealthCheck.getReport();

  return report.healthy ? response.ok(report) : response.badRequest(report);
  // return response.badRequest(report);
});

Route.post("/register", new AuthController().register);
Route.post("/login", new AuthController().login);
