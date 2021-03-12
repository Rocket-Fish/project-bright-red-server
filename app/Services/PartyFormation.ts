import schedule from "node-schedule";
import { algorithm1 } from "App/Services/PartyAlgorithms";
import Event from "App/Models/Event";
import Ws from "./Ws";

class PartyFormation {
  protected eventsMap = new Map<number, number>();

  public start() {
    schedule.scheduleJob("*/2 * * * * *", async () => {
      this.nextBeat();
    });
  }

  public queueFormParty(eventId: number) {
    this.eventsMap.set(eventId, eventId);
  }

  protected async nextBeat() {
    const toBeProcessed = this.eventsMap;
    this.eventsMap = new Map();

    // start processing stuff here
    toBeProcessed.forEach(async (_value, key) => {
      const event = await Event.query()
        .where("id", key)
        .forUpdate()
        .preload("organizer")
        .preload("queue", (query) => query.orderBy("id"))
        .preload("parties", (query) => query.preload("candidates", (query) => query.preload("user")).orderBy("id"))
        .first();

      if (!event) return;

      const eventModified = await algorithm1(event);
      Ws.io.in(eventModified.url).emit("update-event", eventModified);
    });
  }
}

export default new PartyFormation();
