// deno-lint-ignore-file no-explicit-any
import { useState } from "react";
import { sendSignEvent } from "./../../utils";
import { useNostr } from "../../context/NostrProvider";

const AddComment = ({ keypair, postId = null }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { publish } = useNostr();

  const sendMessage = () => {
    if (!message) return;

    setLoading(true);

    sendSignEvent({
      kind: 1,
      keypair,
      tags: [["e", postId, "", "root"]],
      content: message,
      publish,
    }).then(() => {
      setMessage("");
      setLoading(false);
    });
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // const handleKeyDown = (e: any) => {
  //   if (e.key === "Enter") {
  //     sendMessage();
  //   }
  // };

  return (
    <div className="entries-form">
      <div className="comment-form-row">
        <textarea
          value={message}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          className="message-input"
        ></textarea>

        <button className="btn" onClick={sendMessage} disabled={loading}>
          Post
        </button>
      </div>
    </div>
  );
};

export default AddComment;
