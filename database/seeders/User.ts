import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";
import { DateTime } from "luxon";
import uniqueString from "unique-string";

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true;
  public async run() {
    // Write your database queries inside the run method
    const randomUsers = [] as Partial<User>[];
    for (let i = 0; i < 5; i++) {
      randomUsers.push({
        username: uniqueString(),
        password: uniqueString(),
        displayName: uniqueString(),
        lastActive: DateTime.now().minus({ weeks: 1 }),
      });
    }
    try {
      await User.createMany(randomUsers);
    } catch (e) {
      console.log("at least 1 user exists ");
    }
  }
}
