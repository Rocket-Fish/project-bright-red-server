import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import { DateTime } from "luxon";

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const { username, password, displayName } = await request.validate({
      schema: schema.create({
        username: schema.string({ trim: true }, [rules.unique({ table: "users", column: "username" }), rules.minLength(2), rules.maxLength(200)]),
        password: schema.string({ trim: true }),
        displayName: schema.string({ trim: true }, [rules.minLength(2), rules.maxLength(200)]),
      }),
    });

    const user = new User();
    user.username = username;
    user.password = password;
    user.displayName = displayName;
    user.lastActive = DateTime.now();
    user.notAnon = false;
    await user.save();

    const token = await auth.use("api").attempt(username, password);
    return { ...token.toJSON(), id: user.id };
  }
  // public async login({ request, auth }: HttpContextContract) {
  //   const username = request.input("username");
  //   const password = request.input("password");
  //   const token = await auth
  //     .use("api")
  //     .attempt(username, password;
  //   const user = auth.user;
  //   if (user) {
  //     user.lastActive = DateTime.now();
  //     await user.save();
  //   }
  //   return { ...token.toJSON() };
  // }

  public async authCheck({ response, auth }: HttpContextContract) {
    await auth.authenticate();
    return response.ok("OK");
  }

  // public async doSomething(){
  // // forUpdate() is important because it locks the row until save
  // // https://github.com/lffg-archive/adonisjs-lucid-hooks-race-condition-problem/pull/1/files
  // // https://github.com/adonisjs/lucid/issues/542
  // await User.query().where('id', 1).forUpdate().firstOrFail();
  // user.username = 'asdf'
  // awit user.save();
  // }
}
