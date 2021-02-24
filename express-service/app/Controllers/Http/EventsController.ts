import { rules, schema } from "@ioc:Adonis/Core/Validator";

import Event from "App/Models/Event";

export default class EventsController {
  public async index() {
    const events = await Event.all();
    return events;
  }

  public async create({ request }) {
    const validated = await request.validate({
      schema: schema.create({
        name: schema.string({ escape: true, trim: true }, [
          rules.maxLength(24),
        ]),
        numberOfParties: schema.enum([1, 3, 6, 7] as const),
        maxPlayersInQueue: schema.number([rules.range(8, 128)]),
        eventTime: schema.date({}, [rules.after(1, "second")]),
        autoFormParty: schema.boolean(),
        timeZone: schema.string(),
      }),
    });
    const event = await Event.create(validated);
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
