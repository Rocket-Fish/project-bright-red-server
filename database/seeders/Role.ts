import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Role from "App/Models/Role";

export default class RoleSeeder extends BaseSeeder {
  // enable this for development only seeders, this one is for prod
  // public static developmentOnly = true

  public async run() {
    // Write your database queries inside the run method
    try {
      await Role.createMany([
        { name: "tank" },
        { name: "healer" },
        { name: "dps" },
        { name: "melee", isSubroleOf: "dps" },
        { name: "ranged", isSubroleOf: "dps" },
        { name: "caster", isSubroleOf: "dps" },
      ]);
    } catch (e) {
      console.log("batch 1 already exists");
    }
  }
}
