import Candidate from "App/Models/Candidate";
import Event from "App/Models/Event";

/**
 * Mutates event candidates and party list
 *
 * @param event Event will be mutated
 */
export const algorithm1 = async (event: Event): Promise<Event> => {
  const parties = event.parties;
  const candidates = event.queue;
  // reset candidates
  // we will be rebuilding candidates relationships
  candidates.forEach((candidate) => {
    candidate.activeRole = undefined;
    candidate.partyId = undefined;
  });
  parties.forEach((party) => {
    party.candidates.splice(0, party.candidates.length);
  });

  // this for loop is mostly so that async and forEach behaviour is unpredictable.
  for (let i = 0; i < parties.length; i++) {
    const party = parties[i];
    const roles = JSON.parse(party.partyComp);
    for (const role of roles) {
      for (const candidate of candidates) {
        if (!candidate.partyId && !candidate.activeRole) {
          // search if current required role is in candidate's role
          const isGoodFit = JSON.stringify(candidate.roles).includes(role);
          if (isGoodFit) {
            candidate.activeRole = role;
            await party.related("candidates").save(candidate);
            const remappedCandidate = await Candidate.query().where("id", candidate.id).preload("user").firstOrFail();
            party.candidates.push(remappedCandidate);

            break;
          }
        } else {
          candidate.save();
        }
      }
    }
  }
  return event;
};
