import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Events extends BaseSchema {
  protected tableName = "events";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer("organizer_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("organizer_id");
    });
  }
}
