import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Candidate from "./Candidate";
import Party from "./Party";
import User from "./User";

export default class Event extends BaseModel {
  public static table = "events";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public numberOfParties: number;

  @column()
  public maxPlayersInQueue: number;

  @column()
  public eventTime: DateTime;

  @column()
  public timeZone: string;

  @hasMany(() => Candidate, {
    foreignKey: "forEvent",
  })
  public queue: HasMany<typeof Candidate>;

  @hasMany(() => Party, { foreignKey: "eventId" })
  public parties: HasMany<typeof Party>;

  @column()
  public organizerId: number;

  @column()
  public autoFormParty: boolean;

  @belongsTo(() => User, {
    foreignKey: "organizerId",
  })
  public organizer: BelongsTo<typeof User>;

  @column()
  public url: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
