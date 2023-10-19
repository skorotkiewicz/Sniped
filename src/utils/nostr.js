import {
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  getSignature,
} from "nostr-tools";
import { dateToUnix } from "./utils";

export const getLoginKeys = () => {
  let cachedKeys = localStorage.getItem("sniped-keypair");

  if (cachedKeys) {
    cachedKeys = JSON.parse(cachedKeys);

    const sk = cachedKeys.sk;
    const pk = cachedKeys.pk;

    const keys = { sk, pk };

    return keys;
  }
};

export const generateKeys = () => {
  const sk = generatePrivateKey();
  const pk = getPublicKey(sk);

  const keys = { sk, pk };
  return keys;
};

export const sendSignEvent = ({ kind, keypair, tags, content, publish }) => {
  return new Promise((resolve) => {
    const event = {
      kind,
      pubkey: keypair.pk,
      created_at: dateToUnix(),
      tags,
      content,
    };

    event.id = getEventHash(event);

    if (keypair.sk === "nip07") {
      window.nostr.signEvent(event).then((sign) => {
        publish(sign);
        resolve(true);
      });
    } else {
      event.sig = getSignature(event, keypair.sk);
      publish(event);
      resolve(true);
    }
  });
};
