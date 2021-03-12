import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Event from "App/Models/Event";
import Role from "App/Models/Role";
import Ws from "App/Services/Ws";
import PartyFormation from "App/Services/PartyFormation";

export default class QueuesController {
  public async status(context: HttpContextContract) {
    const { response, auth, request } = context;
    const user = await auth.authenticate();

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required(), rules.unsigned()]),
      }),
    });

    const event = await Event.find(validated.forEvent);
    if (!event) {
      return this.returnInvalidEvent(context);
    }
    const candidacy = await event.related("queue").query().where("userId", user.id).first();

    if (!candidacy) {
      return response.notFound({
        errors: [
          {
            code: 404,
            message: "Not Found",
          },
        ],
      });
    }

    return candidacy;
  }

  public async join(context: HttpContextContract) {
    const { response, auth, request } = context;

    const user = await auth.authenticate();

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required(), rules.unsigned()]),
        roles: schema.string({ escape: false, trim: false }, [rules.required()]),
      }),
    });
    // parse json and validate role manually // database row saving
    const roles = await Role.all();
    const userRoles = JSON.parse(validated.roles);
    let userRolesValid = true;
    if (Array.isArray(userRoles) && userRoles.length > 0) {
      const roleNameOnly = roles.map((role: Role) => role.name);
      userRoles.forEach((ur) => {
        userRolesValid = userRolesValid && roleNameOnly.includes(ur);
      });
    } else {
      userRolesValid = false;
    }
    if (!userRolesValid) {
      return response.badRequest({
        errors: [
          {
            field: "roles",
            message: "user roles invalid",
          },
        ],
      });
    }
    // build relationship time
    const event = await Event.query().where("id", validated.forEvent).preload("queue").first();
    if (!event) {
      return this.returnInvalidEvent(context);
    }
    if (event.maxPlayersInQueue <= event.queue.length) {
      return response.notAcceptable({
        errors: [
          {
            field: "roles",
            message: "Queue limit reached",
          },
        ],
      });
    }
    const existingCandidacy = await event.related("queue").query().where("userId", user.id).first();
    if (existingCandidacy) {
      return response.badRequest({
        errors: [
          {
            message: "Already in queue for this event",
          },
        ],
      });
    }
    const candidate = await event.related("queue").create(validated);
    user.related("candidacy").save(candidate);

    // emit this event via websocket to everyone in the event room
    Ws.io.in(event.url).emit("joined-queue", candidate);
    if (event.autoFormParty) {
      PartyFormation.queueFormParty(event.id);
    }
    return candidate;
  }
  public async leave(context: HttpContextContract) {
    const { response, auth, request } = context;
    const user = await auth.authenticate();

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required(), rules.unsigned()]),
      }),
    });

    const event = await Event.find(validated.forEvent);
    if (!event) {
      return this.returnInvalidEvent(context);
    }
    const candidate = await event.related("queue").query().where("userId", user.id).firstOrFail();
    await candidate.delete();

    Ws.io.in(event.url).emit("left-queue", candidate);
    if (event.autoFormParty) {
      PartyFormation.queueFormParty(event.id);
    }
    return response.ok("OK");
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
}
