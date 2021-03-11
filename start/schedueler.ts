import schedule from "node-schedule";

import Event from "App/Models/Event";
import { DateTime } from "luxon";
import User from "App/Models/User";

const logNow = () => {
  console.log(DateTime.now().toFormat("MMMM dd, yyyy - hh:mm a z"));
};

const initOutdatedEventsCleanup = () => {
  // this function sets up recurring schedule that deletes
  // old events at 1:01 am evety day
  const rule = new schedule.RecurrenceRule();
  rule.minute = 1;
  rule.hour = 13;

  // currently once every hour
  schedule.scheduleJob(rule, async () => {
    console.log("The goal of all life is death");
    logNow();
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
};
initOutdatedEventsCleanup();

const initInactiveUserCleanup = () => {
  // anonymous users that have not been logged in for at least 2 weeks will be deleted

  const rule = new schedule.RecurrenceRule();
  rule.minute = 1;
  rule.hour = 14;

  schedule.scheduleJob(rule, async () => {
    console.log("Those who dwell in the past does not see the future;");
    logNow();

    const users = await User.all();
    console.log("Total Users", users.length);

    let count = 0;
    const twoWeeksAgo = DateTime.now().minus({ weeks: 2 });
    users.forEach(async (user) => {
      if (!user.notAnon) {
        // not a nonAnon user = is anon user
        if (!user.lastActive) {
          // lastActive = null
          // delete user
          count++;
          await user.delete();
        } else {
          // lastActive exists check if last active is older than w weeks
          if (user.lastActive < twoWeeksAgo) {
            count++;
            await user.delete();
          }
        }
      }
    });
    console.log("deleted", count, "entries");
  });
};
initInactiveUserCleanup();
