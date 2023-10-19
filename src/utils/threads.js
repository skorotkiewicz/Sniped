/* eslint-disable no-constant-condition */
export function computeThreads(events) {
  const threadableEvents = events.map((event) => ({ ...event, replies: [] }));

  const threads = [];
  for (let i = threadableEvents.length - 1; i >= 0; i--) {
    const event = threadableEvents[i];
    const reply = getImmediateReply(event.tags);

    // if this is not a reply to another comment we assume it is a reply
    // to the "root"/base -- i.e. a top-level comment
    if (!reply) {
      threads.unshift(event);
      continue;
    }

    const parent = getEvent(reply);
    parent.replies.unshift(event);
  }

  return threads;

  function getImmediateReply(tags) {
    let curr = null;
    for (let t = tags.length - 1; t >= 0; t--) {
      const tag = tags[t];
      if (
        (tag[0] === "a" || tag[0] === "e") &&
        typeof tag[1] === "string" &&
        // can't be root in this context because the root
        //   is always the original website event
        tag[3] !== "root"
      ) {
        if (tag[3] === "reply") {
          return tag[1];
        }

        // use the last "e" tag if none are marked as "reply"
        if (curr === null) curr = tag[1];
      }
    }
    return curr;
  }

  function getEvent(id) {
    for (let j = 0; j < threadableEvents.length; j++) {
      if (threadableEvents[j].id === id) return threadableEvents[j];
    }

    // couldn't find this event, so manufacture one
    const fake = { id, replies: [] };
    threadableEvents.push(fake);

    return fake;
  }
}

export function insertEventIntoDescendingList(sortedArray, event) {
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;

  if (end < 0) {
    position = 0;
  } else if (event.created_at < sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at >= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at > event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at < event.created_at) {
        end = midPoint;
      } else {
        // aMidPoint === num
        position = midPoint;
        break;
      }
    }

  // insert when num is NOT already in (no duplicates)
  if (sortedArray[position]?.id !== event.id) {
    return [
      ...sortedArray.slice(0, position),
      event,
      ...sortedArray.slice(position),
    ];
  }

  return sortedArray;
}
