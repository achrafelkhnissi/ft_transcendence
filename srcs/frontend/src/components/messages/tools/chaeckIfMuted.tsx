import exp from "constants";
import { Mute } from "../data";

const checkIfMuted = (muteObject: Mute): boolean => {
    const timestamp = new Date(muteObject.createdAt);
    const now = new Date();

    let durationInMilliseconds = 0;

    switch (muteObject.duration) {
        case 'MINUTE':
          durationInMilliseconds = 1000 * 60; // Convert minutes to milliseconds
          break;
        case 'HOUR':
          durationInMilliseconds = 1000 * 60 * 60; // Convert hours to milliseconds
          break;
        case 'DAY':
          durationInMilliseconds = 1000 * 60 * 60 * 24; // Convert days to milliseconds
          break;
      }

    return (now < new Date(timestamp.getTime() + durationInMilliseconds));
}

export default checkIfMuted;