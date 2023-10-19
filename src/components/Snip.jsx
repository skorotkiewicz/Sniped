import { Link } from "react-router-dom";
import { dateFormatter, sendSignEvent, shortPubKey } from "../utils";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useNostr } from "../context/NostrProvider";
import { useAtom } from "react-atomize-store";
import { useNavigate } from "react-router-dom";

const Snip = ({ events }) => {
  const [keypair] = useAtom("keypair");
  const navigate = useNavigate();
  const { publish } = useNostr();

  const onDeleteSnip = (id) => {
    sendSignEvent({
      kind: 5,
      content: "deleted",
      tags: [["e", id]],
      keypair,
      publish,
    }).then(() => navigate("/"));
  };

  return (
    <div className="Snip">
      {events.map((data, key) => {
        const s = JSON.parse(data.content);

        return (
          <div key={key} className="snip-content">
            <p>
              <span>
                <Link to={`/snip/${data.id}`}>
                  {s.fileName}.{s.mode}
                </Link>
              </span>
              <span>{dateFormatter(data.created_at)}</span>
            </p>

            <SyntaxHighlighter language={s.mode} style={dracula}>
              {s.snip}
            </SyntaxHighlighter>

            <p>
              {data.pubkey === keypair.pk && (
                <button onClick={() => onDeleteSnip(data.id)}>Delete</button>
              )}
              author
              <Link to={`/profile/${data.pubkey}`}>
                {shortPubKey(data.pubkey, 7)}
              </Link>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Snip;
