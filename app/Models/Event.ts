import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Event extends BaseModel {
  public static table = "events";
  public static selfAssignPrimaryKey = true;

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
  public autoFormParty: boolean;

  @column()
  public timeZone: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
