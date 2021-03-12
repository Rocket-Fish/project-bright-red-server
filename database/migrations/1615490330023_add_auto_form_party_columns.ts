import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Events extends BaseSchema {
  protected tableName = "events";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.boolean("auto_form_party");
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("auto_form_party");
    });
  }
}
