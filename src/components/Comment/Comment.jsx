import { useState } from "react";
import CommentComp from "./CommentComp";

const Comment = ({ created_at, id, content, pubkey, replies }) => {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);

  return (
    <>
      <CommentComp
        createdAt={created_at}
        uniqId={id}
        pubkey={pubkey}
        // likeByMe={likeByMe}
        // likeCount={likeCount}
        comment={content}
      />

      {replies?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${areChildrenHidden && "hide"}`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              {replies.map((comment) => (
                <div className="comment-stack" key={comment.id}>
                  <Comment {...comment} />
                </div>
              ))}
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden && "hide"}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
