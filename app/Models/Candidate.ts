import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Candidate extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public forEvent: number;

  @column()
  public roles: string; // this would contain an array like [tank, tank, healer, healer, melee, melee, ranged, caster]
  // NOTE: im doing this to save on table row count, heroku hobby 10 million rows. I don't want extra rows for pivot tables
  // This would save a row per role selected
  // just match roles before writing to json string

  @column()
  public activeRole: string; // this would contain current active role of this candidate, should only be populated if in party

  @column()
  public partyId: number;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
