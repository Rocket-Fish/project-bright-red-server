import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public name: string;

  @hasMany(() => Role, {
    foreignKey: "isSubroleOf",
  })
  public subroles: HasMany<typeof Role>;

  @column({ serializeAs: null })
  public isSubroleOf: string;
}
