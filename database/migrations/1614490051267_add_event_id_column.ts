import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Parties extends BaseSchema {
  protected tableName = "parties";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("events")
        .onDelete("CASCADE");
      table.integer("party_number");
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("event_id");
      table.dropColumn("party_number");
    });
  }
}
