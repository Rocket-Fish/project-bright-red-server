import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const { username, password, displayName } = await request.validate({
      schema: schema.create({
        username: schema.string({ trim: true }, [
          rules.unique({ table: "users", column: "username" }),
          rules.minLength(2),
          rules.maxLength(200),
        ]),
        password: schema.string({ trim: true }),
        displayName: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(200),
        ]),
      }),
    });

    const user = new User();
    user.username = username;
    user.password = password;
    user.displayName = displayName;
    await user.save();

    const token = await auth.use("api").attempt(username, password);
    return token.toJSON();
  }
  public async login({ request, auth }: HttpContextContract) {
    const username = request.input("username");
    const password = request.input("password");
    const token = await auth.use("api").attempt(username, password);
    return token.toJSON();
  }
}
