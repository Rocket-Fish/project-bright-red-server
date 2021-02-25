import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Parties extends BaseSchema {
  protected tableName = "parties";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("party_comp").notNullable();
      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
