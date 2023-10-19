import { useState } from "react";
import { useParams } from "react-router-dom";
import { dateFormatter, shortPubKey } from "./../../utils";
import { Icon } from "@iconify/react";
import IconBtn from "./../IconBtn";
import CommentForm from "./CommentForm";
import { sendSignEvent } from "./../../utils";
import { useNostr } from "../../context/NostrProvider";
import { useAtom } from "react-atomize-store";

const CommentComp = ({
  createdAt,
  uniqId,
  // likeByMe,
  // likeCount,
  comment,
  pubkey,
  type,
}) => {
  // const [isEditting, setIsEditting] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [showFullPubkey, setShowFullPubkey] = useState(false);
  const [keypair] = useAtom("keypair");
  const { id } = useParams();
  const { publish } = useNostr();

  // const onCommentUpdate = (message) => {
  //   setIsEditting(false);
  //   console.log("update");
  // };

  //
  const onCommentReply = (message) => {
    const postId = id;
    const replyingTo = uniqId;

    sendSignEvent({
      kind: 1,
      keypair,
      tags:
        postId && !replyingTo
          ? [["e", postId, "", "root"]]
          : [
              ["e", postId, "", "root"],
              ["e", replyingTo, "", "reply"],
            ],
      content: message,
      publish,
    }).then(() => setIsReplaying(false));
  };

  //
  const onDeleteComment = () => {
    console.log("delete", uniqId);

    sendSignEvent({
      kind: 5,
      content: "deleted",
      tags: [["e", uniqId]],
      keypair,
      publish,
    }).then(() => console.log("deleted"));
  };

  //
  // const onToggleCommentLike = () => {
  //   console.log("like/unlike");

  //   sendSignEvent({
  //     kind: 7,
  //     content: "+",
  //     tags: [["e", uniqId, "p", keypair.pk]],
  //     // tags: [["e", id, "r", uniqId, "p", keypair.pk]],
  //     keypair,
  //     publish,
  //   }).then((e) => console.log(e, "liked"));
  // };

  // const likeByMe = false;
  // const likeCount = 0;

  return (
    <>
      <div className="comment">
        <div className="header">
          <span
            onClick={() => setShowFullPubkey((prev) => !prev)}
            className="name pointer"
          >
            {showFullPubkey ? pubkey : shortPubKey(pubkey)}
          </span>
          <span className="date">{dateFormatter(createdAt)}</span>
        </div>

        {/* {isEditting ? (
          <CommentForm
            autoFocus
            initialValue={comment}
            onSubmit={onCommentUpdate}
            // loading={updateCommentFn.loading}
            // error={updateCommentFn.errors}
            loading={false}
            error={""}
          />
        ) : ( */}
        <div className="message">{comment}</div>
        {/* )} */}

        <div className="footer">
          {/* <IconBtn
            aria-label={likeByMe ? "Unlike" : "Like"}
            Icon={
              likeByMe ? (
                <Icon icon="mdi:cards-heart" />
              ) : (
                <Icon icon="mdi:cards-heart-outline" />
              )
            }
            onClick={onToggleCommentLike}
            // disabled={toggleCommentLikeFn.loading}
          >
            {likeCount}
          </IconBtn> */}

          {type !== "e" && keypair.pk && (
            <IconBtn
              aria-label={isReplaying ? "Cancel Reply" : "Reply"}
              Icon={<Icon icon="bi:reply-fill" />}
              onClick={() => setIsReplaying((prev) => !prev)}
              isActive={isReplaying}
            />
          )}
          {pubkey === keypair.pk && (
            <>
              {/* <IconBtn
                isActive={isEditting}
                Icon={<Icon icon="material-symbols:edit" />}
                aria-label={isEditting ? "Cancel Edit" : "Edit"}
                onClick={() => setIsEditting((prev) => !prev)}
              /> */}
              <IconBtn
                Icon={<Icon icon="ph:trash-simple-fill" />}
                color="danger"
                aria-label="Delete"
                onClick={onDeleteComment}
              />
            </>
          )}
        </div>
      </div>
      {isReplaying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            // loading={createCommentFn.loading}
            // error={createCommentFn.errors}
          />
        </div>
      )}
    </>
  );
};

export default CommentComp;
