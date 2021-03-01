import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Candidate from "App/Models/Candidate";
import Event from "App/Models/Event";

export default class PartiesController {
  public returnInvalidUser({ response }: HttpContextContract) {
    return response.badRequest({
      errors: [{ message: "JWT provided invalid username" }],
    });
  }

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
    const { response, auth, request } = context;
    await auth.authenticate();
    const user = auth.user;
    if (!user) return this.returnInvalidUser(context);

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
      .preload("parties", (query) =>
        query
          .preload("candidates", (query) => query.preload("user"))
          .orderBy("id")
      )
      .first();

    if (!event) return this.returnInvalidEvent(context);

    if (event.organizerId !== user.id)
      return this.returnInvalidOrganizer(context);

    const parties = event.parties;
    const candidates = event.queue;

    for (let i = 0; i < parties.length; i++) {
      const party = parties[i];
      const roles = JSON.parse(party.partyComp);
      for (const role of roles) {
        for (const candidate of candidates) {
          if (candidate.partyId === null && candidate.activeRole === null) {
            // search if current required role is in candidate's role
            const isGoodFit = JSON.stringify(candidate.roles).includes(role);
            if (isGoodFit) {
              candidate.activeRole = role;
              await party.related("candidates").save(candidate);
              const remappedCandidate = await Candidate.query()
                .where("id", candidate.id)
                .preload("user")
                .firstOrFail();
              party.candidates.push(remappedCandidate);

              break;
            }
          }
        }
      }
    }

    return event;
  }
}
