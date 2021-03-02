import schedule from "node-schedule";

import Event from "App/Models/Event";
import { DateTime } from "luxon";

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// currently once every hour
schedule.scheduleJob("* */1 * * *", async () => {
  console.log("The goal of all life is death");
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
