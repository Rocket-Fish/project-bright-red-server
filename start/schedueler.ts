import schedule from "node-schedule";

import Event from "App/Models/Event";
import { DateTime } from "luxon";

const rule = new schedule.RecurrenceRule();
rule.hour = 1;

// currently once every hour
schedule.scheduleJob(rule, async () => {
  console.log("The goal of all life is death");
  console.log(DateTime.now().toFormat("MMMM dd, yyyy - hh:mm a z"));
  // delete all events thats too old
  const events = await Event.all();
  console.log("Total Events", events.length);

  let count = 0;
  const yesterday = DateTime.now().minus({ days: 1 });
  events.forEach(async (event) => {
    if (event.eventTime < yesterday) {
      count++;
      await event.delete();
    }
  });
  console.log("deleted", count, "entries");
});
