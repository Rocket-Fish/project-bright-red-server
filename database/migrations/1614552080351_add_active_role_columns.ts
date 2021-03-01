import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Candidates extends BaseSchema {
  protected tableName = "candidates";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("active_role").nullable();
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("active_role");
    });
  }
}
