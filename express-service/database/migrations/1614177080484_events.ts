import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Events extends BaseSchema {
  protected tableName = "events";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.integer("number_of_parties").notNullable();
      table.integer("max_players_in_queue").notNullable();
      table.dateTime("event_time").notNullable();
      table.boolean("auto_form_party").notNullable();
      table.string("time_zone").notNullable();

      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
