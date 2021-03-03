import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Event from "App/Models/Event";
import uniqueString from "unique-string";
import User from "App/Models/User";
import Party from "App/Models/Party";

export default class EventsController {
  public returnInvalidUser({ response }: HttpContextContract) {
    return response.badRequest({
      errors: [{ message: "JWT provided invalid username" }],
    });
  }

  public async create(context: HttpContextContract) {
    const { request, auth } = context;
    await auth.authenticate();
    const user = auth.user;
    if (!user) return this.returnInvalidUser(context);

    const validated = await request.validate({
      schema: schema.create({
        name: schema.string({ escape: true, trim: true }, [rules.maxLength(50)]),
        numberOfParties: schema.enum([1, 3, 6, 7] as const),
        maxPlayersInQueue: schema.number([rules.range(8, 128)]),
        eventTime: schema.date({}, [rules.after(1, "second")]),
        timeZone: schema.string(),
      }),
    });
    const event = await user.related("organizedEvents").create({
      ...validated,
      url: uniqueString(),
    });
    const partiesToBeCreated = [] as Party[];
    for (let partyNumber = 1; partyNumber <= validated.numberOfParties; partyNumber++) {
      partiesToBeCreated.push({
        partyNumber,
        partyComp: JSON.stringify(["tank", "tank", "healer", "healer", "melee", "melee", "ranged", "caster"]), // hard coded value TODO: change later
      } as Party);
    }
    await event.related("parties").createMany(partiesToBeCreated);

    return event.serialize({ fields: ["url"] });
  }

  public async getEventQuick({ request }: HttpContextContract) {
    const { url } = await request.validate({
      schema: schema.create({
        url: schema.string({ escape: true }),
      }),
    });
    const event = await Event.query().where("url", url).first();
    return event;
  }

  public async getEvent({ request, response }: HttpContextContract) {
    const { url } = await request.validate({
      schema: schema.create({
        url: schema.string({ escape: true }),
      }),
    });
    const event = await Event.query()
      .where("url", url)
      .preload("organizer")
      .preload("queue", (query) => query.orderBy("id"))
      .preload("parties", (query) => query.preload("candidates", (query) => query.preload("user")).orderBy("id"))
      .first();
    if (!event) {
      return response.notFound({
        errors: [{ code: 404, message: "Not Found" }],
      });
    }
    return event;
  }

  public async myEvents(context: HttpContextContract) {
    const { auth } = context;
    await auth.authenticate();
    const user = auth.user;
    if (!user) return this.returnInvalidUser(context);

    await user.preload("organizedEvents");
    const fullUserObject = await User.query()
      .where("id", user.id)
      .preload("candidacy", (query) => query.preload("event", (query) => query.preload("organizer")))
      .preload("organizedEvents", (query) => query.preload("organizer"))
      .firstOrFail();
    const { organizedEvents, candidacy } = fullUserObject;
    const participatingEvents = candidacy.map((c) => c.event);

    return { organizedEvents, participatingEvents };
  }
}
