import { useParams, Link } from "react-router-dom";
import { useNostrEvents } from "../context/NostrProvider";
import Snip from "../components/Snip";
import { shortPubKey } from "../utils";
import { Loading } from "../components/Loading";
import { TOPIC } from "../config";
import Settings from "../components/Settings";
import { useAtom } from "react-atomize-store";

const Profile = () => {
  const { id } = useParams();

  return <div>{id !== "profile" ? <Set id={id} /> : <Settings />}</div>;
};

const Set = ({ id }) => {
  const [keypair] = useAtom("keypair");

  const { events, isLoading } = useNostrEvents({
    filter: {
      "#t": [TOPIC],
      kinds: [1],
      authors: [id],
      limit: 100,
    },
  });

  return (
    <>
      <h2>Profile {shortPubKey(id, 10)}</h2>
      {id === keypair.pk && <Link to={`/profile`}>Settings</Link>}
      {isLoading ? <Loading /> : <Snip events={events} />}
    </>
  );
};

export default Profile;
