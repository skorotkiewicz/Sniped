import { Loading } from "../components/Loading";
import Snip from "../components/Snip";
import { TOPIC } from "../config";
import { useNostrEvents } from "../context/NostrProvider";

const Home = () => {
  const { events, isLoading } = useNostrEvents({
    filter: {
      // since: dateToUnix(now.current),
      // until: dateToUnix(now.current),
      kinds: [1],
      "#t": [TOPIC],
      limit: 100,
    },
  });

  return (
    <div>
      <h2>Home</h2>

      {isLoading ? <Loading /> : <Snip events={events} />}
    </div>
  );
};

export default Home;
