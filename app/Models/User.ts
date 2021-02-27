import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Candidate from "./Candidate";
import Event from "./Event";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public username: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public displayName: string;

  @column()
  public rememberMeToken?: string;

  @hasMany(() => Candidate)
  public candidacy: HasMany<typeof Candidate>; // candidates are basically Q positions

  @hasMany(() => Event, {
    foreignKey: "organizerId",
  })
  public organizedEvents: HasMany<typeof Event>; // events which this person organized (is admin for)

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
