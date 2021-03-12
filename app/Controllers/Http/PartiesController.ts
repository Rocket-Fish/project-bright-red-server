import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Event from "App/Models/Event";
import { algorithm1 } from "App/Services/PartyAlgorithms";

export default class PartiesController {
  public returnInvalidEvent({ response }: HttpContextContract) {
    return response.badRequest({
      errors: [
        {
          field: "forEvent",
          message: "bad event",
        },
      ],
    });
  }

  public returnInvalidOrganizer({ response }: HttpContextContract) {
    return response.badRequest({
      errors: [
        {
          message: "This is not your party to admin",
        },
      ],
    });
  }

  public async formParty(context: HttpContextContract) {
    const { auth, request } = context;
    const user = await auth.authenticate();

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required()]),
      }),
    });

    const event = await Event.query()
      .where("id", validated.forEvent)
      .forUpdate()
      .preload("organizer")

      .preload("queue", (query) => query.orderBy("id"))
      .preload("parties", (query) => query.preload("candidates", (query) => query.preload("user")).orderBy("id"))
      .first();

    if (!event) return this.returnInvalidEvent(context);

    if (event.organizerId !== user.id) return this.returnInvalidOrganizer(context);

    return await algorithm1(event);
  }
}
