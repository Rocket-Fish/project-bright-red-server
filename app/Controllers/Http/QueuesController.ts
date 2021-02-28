import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Event from "App/Models/Event";
import Role from "App/Models/Role";

export default class QueuesController {
  public async status(context: HttpContextContract) {
    const { response, auth, request } = context;
    await auth.authenticate();
    const user = auth.user;
    if (!user) return this.returnInvalidUser(context);

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required(), rules.unsigned()]),
      }),
    });

    const event = await Event.find(validated.forEvent);
    if (!event) {
      return this.returnInvalidEvent(context);
    }
    const candidacy = await event
      .related("queue")
      .query()
      .where("userId", user.id)
      .first();

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

    await auth.authenticate();
    const user = auth.user;
    if (!user) return this.returnInvalidUser(context);

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required(), rules.unsigned()]),
        roles: schema.string({ escape: false, trim: false }, [
          rules.required(),
        ]),
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
    const event = await Event.find(validated.forEvent);
    if (!event) {
      return this.returnInvalidEvent(context);
    }
    const existingCandidacy = await event
      .related("queue")
      .query()
      .where("userId", user.id)
      .first();
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

    return candidate;
  }
  public async leave(context: HttpContextContract) {
    const { response, auth, request } = context;
    await auth.authenticate();
    const user = auth.user;
    if (!user) return this.returnInvalidUser(context);

    const validated = await request.validate({
      schema: schema.create({
        forEvent: schema.number([rules.required(), rules.unsigned()]),
      }),
    });

    const event = await Event.find(validated.forEvent);
    if (!event) {
      return this.returnInvalidEvent(context);
    }
    await event.related("queue").query().where("userId", user.id).delete();

    return response.ok("OK");
  }
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
}
