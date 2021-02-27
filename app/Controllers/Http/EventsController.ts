import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Event from "App/Models/Event";

export default class EventsController {
  public async index() {
    const events = await Event.all();
    return events;
  }

  public async create({ request, response, auth }: HttpContextContract) {
    await auth.authenticate();
    const user = auth.user;
    if (!user) {
      return response.badRequest({
        errors: [{ message: "JWT provided invalid username" }],
      });
    }
    const validated = await request.validate({
      schema: schema.create({
        name: schema.string({ escape: true, trim: true }, [
          rules.maxLength(50),
        ]),
        numberOfParties: schema.enum([1, 3, 6, 7] as const),
        maxPlayersInQueue: schema.number([rules.range(8, 128)]),
        eventTime: schema.date({}, [rules.after(1, "second")]),
        autoFormParty: schema.boolean(),
        timeZone: schema.string(),
      }),
    });
    const event = await Event.create({
      ...validated,
      organizerId: user.$attributes.id,
    });
    return event;
  }
}

/*
        name: "",
        numberOfParties: 1,
        maxPlayersInQueue: 100,
        time: DateTime.now().setZone("local").toFormat("HH:mm"),
        date: DateTime.now().setZone("local").toFormat("yyyy-MM-dd"),
        autoFormParty: false,
        timeZone: "local",
 */
