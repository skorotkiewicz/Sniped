import { useParams } from "react-router-dom";
import { useNostrEvents } from "../context/NostrProvider";
import Snip from "../components/Snip";
import { shortPubKey } from "../utils";
import { Loading } from "../components/Loading";
import { TOPIC } from "../config";

const Profile = () => {
  const { id } = useParams();

  const { events, isLoading } = useNostrEvents({
    filter: {
      "#t": [TOPIC],
      kinds: [1],
      authors: [id],
      limit: 100,
    },
  });

  return (
    <div>
      <h2>Profile {shortPubKey(id, 10)}</h2>

      {isLoading ? <Loading /> : <Snip events={events} />}
    </div>
  );
};

export default Profile;
