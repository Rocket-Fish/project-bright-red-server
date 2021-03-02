import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Users extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dateTime("last_active");
      table.boolean("not_anon");
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("last_active");
      table.dropColumn("not_anon");
    });
  }
}
