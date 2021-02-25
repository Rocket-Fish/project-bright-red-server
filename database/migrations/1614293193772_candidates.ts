import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Candidates extends BaseSchema {
  protected tableName = "candidates";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("for_event")
        .unsigned()
        .references("id")
        .inTable("events")
        .onDelete("CASCADE"); // if event is deleted candidate should also be deleted
      table.string("roles").notNullable();
      table.integer("party_id").unsigned().references("id").inTable("parties");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
