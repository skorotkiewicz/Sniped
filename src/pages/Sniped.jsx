import { useMemo } from "react";
import { useNostrEvents } from "../context/NostrProvider";
import { useParams } from "react-router-dom";
import Snip from "../components/Snip";
import { computeThreads } from "../utils";
import { useAtom } from "react-atomize-store";
import { Loading } from "../components/Loading";
import Comment from "../components/Comment/Comment";
import AddComment from "../components/Comment/AddComment";
import "./../styles/Comments.scss";

const Sniped = () => {
  const { id } = useParams();
  const [keypair] = useAtom("keypair");

  const { events: event, isLoading } = useNostrEvents({
    filter: {
      ids: [id],
    },
  });

  const { events, isLoadingComments } = useNostrEvents({
    filter: {
      kinds: [1, 6, 7, 9735],
      "#e": [id],
      limit: 100,
    },
  });

  const threads = useMemo(() => computeThreads(events), [events]);

  return (
    <div>
      <h2>Sniped</h2>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {event.length > 0 ? (
            <>
              <Snip events={event} />
              <AddComment keypair={keypair} postId={id} />

              {isLoadingComments ? (
                <Loading />
              ) : (
                threads.map((comment) => (
                  <div className="comment-stack" key={comment.id}>
                    <Comment {...comment} />
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="e404">404</div>
          )}
        </>
      )}
    </div>
  );
};

export default Sniped;
