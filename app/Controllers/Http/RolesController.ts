// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from "App/Models/Role";

export default class RolesController {
  public async index() {
    const roles = await Promise.all(
      ["tank", "healer", "dps"].map((r) =>
        Role.query().where("name", r).preload("subroles").first()
      )
    );
    return roles;
  }
}
