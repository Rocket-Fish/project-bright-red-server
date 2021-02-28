import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Events extends BaseSchema {
  protected tableName = "events";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("url").unique().notNullable();
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("url");
    });
  }
}
