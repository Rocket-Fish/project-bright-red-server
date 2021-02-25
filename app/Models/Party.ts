import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Candidate from "./Candidate";

export default class Party extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public partyComp: string; // this would contain an array like [tank, tank, healer, healer, melee, melee, ranged, caster]
  // NOTE: im doing this to save on table row count, heroku hobby 10 million rows. I don't want extra rows for pivot tables
  // this would save 8 rows per party

  @hasMany(() => Candidate)
  public candidates: HasMany<typeof Candidate>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
