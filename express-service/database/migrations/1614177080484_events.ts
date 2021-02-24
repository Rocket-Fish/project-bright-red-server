import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Events extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('numberOfParties').notNullable()
      table.integer('maxPlayersInQueue').notNullable()
      table.string('eventTime').notNullable()
      table.boolean('autoFormParty').notNullable()
      table.string('timeZone').notNullable()

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
