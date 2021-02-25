import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Roles extends BaseSchema {
  protected tableName = "roles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("name").primary();
      table.string("is_subrole_of").nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
