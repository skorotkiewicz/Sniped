/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { relayInit } from "nostr-tools";
import { uniqBy, log } from "../utils";

const NostrContext = createContext({
  isLoading: true,
  connectedRelays: [],
  onConnect: () => null,
  onDisconnect: () => null,
  publish: () => null,
});

export function NostrProvider({ children, relayUrls, debug }) {
  const [isLoading, setIsLoading] = useState(true);
  const [connectedRelays, setConnectedRelays] = useState([]);
  const [relays, setRelays] = useState([]);
  const relayUrlsRef = useRef([]);

  let onConnectCallback = null;
  let onDisconnectCallback = null;

  const disconnectToRelays = useCallback(
    (relayUrls) => {
      relayUrls.forEach(async (relayUrl) => {
        await relays.find((relay) => relay.url === relayUrl)?.close();
        setRelays((prev) => prev.filter((r) => r.url !== relayUrl));
      });
    },
    [relays]
  );

  const connectToRelays = useCallback(
    (relayUrls) => {
      relayUrls.forEach(async (relayUrl) => {
        const relay = relayInit(relayUrl);

        if (connectedRelays.findIndex((r) => r.url === relayUrl) >= 0) {
          // already connected, skip
          return;
        }

        setRelays((prev) => uniqBy([...prev, relay], "url"));
        relay.connect();

        relay.on("connect", () => {
          log(debug, "info", `✅ nostr (${relayUrl}): Connected!`);
          setIsLoading(false);
          onConnectCallback?.(relay);
          setConnectedRelays((prev) => uniqBy([...prev, relay], "url"));
        });

        relay.on("disconnect", () => {
          log(debug, "warn", `🚪 nostr (${relayUrl}): Connection closed.`);
          onDisconnectCallback?.(relay);
          setConnectedRelays((prev) => prev.filter((r) => r.url !== relayUrl));
        });

        relay.on("error", () => {
          log(debug, "error", `❌ nostr (${relayUrl}): Connection error!`);
        });
      });
    },
    [connectedRelays, debug, onConnectCallback, onDisconnectCallback]
  );

  useEffect(() => {
    if (relayUrlsRef.current === relayUrls) {
      // relayUrls isn't updated, skip
      return;
    }

    const relayUrlsToDisconnect = relayUrlsRef.current.filter(
      (relayUrl) => !relayUrls.includes(relayUrl)
    );

    disconnectToRelays(relayUrlsToDisconnect);
    connectToRelays(relayUrls);

    relayUrlsRef.current = relayUrls;
  }, [relayUrls, connectToRelays, disconnectToRelays]);

  const publish = (event) => {
    return connectedRelays.map((relay) => {
      log(debug, "info", `⬆️ nostr (${relay.url}): Sending event:`, event);

      return relay.publish(event);
    });
  };

  const value = {
    debug,
    isLoading,
    connectedRelays,
    publish,
    onConnect: (_onConnectCallback) => {
      if (_onConnectCallback) {
        onConnectCallback = _onConnectCallback;
      }
    },
    onDisconnect: (_onDisconnectCallback) => {
      if (_onDisconnectCallback) {
        onDisconnectCallback = _onDisconnectCallback;
      }
    },
  };

  return (
    <NostrContext.Provider value={value}>{children}</NostrContext.Provider>
  );
}

export function useNostr() {
  return useContext(NostrContext);
}

export function useNostrEvents({ filter, enabled = true }) {
  const {
    isLoading: isLoadingProvider,
    onConnect,
    debug,
    connectedRelays,
  } = useNostr();

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(() => {
    return;
  });

  let onEventCallback = null;
  let onSubscribeCallback = null;
  let onDoneCallback = null;

  // Lets us detect changes in the nested filter object for the useEffect hook
  const filterBase64 =
    typeof window !== "undefined" ? window.btoa(JSON.stringify(filter)) : null;

  const _unsubscribe = (sub, relay) => {
    log(
      debug,
      "info",
      `🙉 nostr (${relay.url}): Unsubscribing from filter:`,
      filter
    );
    return sub.unsub();
  };

  const subscribe = useCallback((relay, filter) => {
    log(
      debug,
      "info",
      `👂 nostr (${relay.url}): Subscribing to filter:`,
      filter
    );
    const sub = relay.sub([filter]);

    setIsLoading(true);

    const unsubscribeFunc = () => {
      _unsubscribe(sub, relay);
    };

    setUnsubscribe(() => unsubscribeFunc);

    sub.on("event", (event) => {
      log(debug, "info", `⬇️ nostr (${relay.url}): Received event:`, event);
      onEventCallback?.(event);
      setEvents((_events) => {
        return [event, ..._events];
      });
    });

    sub.on("eose", () => {
      setIsLoading(false);
      onDoneCallback?.();
    });

    return sub;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const relaySubs = connectedRelays.map((relay) => {
      const sub = subscribe(relay, filter);

      onSubscribeCallback?.(sub, relay);

      return {
        sub,
        relay,
      };
    });

    return () => {
      relaySubs.forEach(({ sub, relay }) => {
        _unsubscribe(sub, relay);
      });
    };
  }, [connectedRelays, filterBase64, enabled]);

  const uniqEvents = events.length > 0 ? uniqBy(events, "id") : [];
  const sortedEvents = uniqEvents.sort((a, b) => b.created_at - a.created_at);

  return {
    isLoading: isLoading || isLoadingProvider,
    events: sortedEvents,
    onConnect,
    connectedRelays,
    unsubscribe,
    onSubscribe: (_onSubscribeCallback) => {
      if (_onSubscribeCallback) {
        onSubscribeCallback = _onSubscribeCallback;
      }
    },
    onEvent: (_onEventCallback) => {
      if (_onEventCallback) {
        onEventCallback = _onEventCallback;
      }
    },
    onDone: (_onDoneCallback) => {
      if (_onDoneCallback) {
        onDoneCallback = _onDoneCallback;
      }
    },
  };
}
