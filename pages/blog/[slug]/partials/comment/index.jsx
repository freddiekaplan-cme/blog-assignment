import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useUser } from "@supabase/auth-helpers-react";

import Button from "@components/button";
import { getPost } from "../../../../../api-routes/posts";
import { getReplies } from "../../../../../api-routes/commentReplies";
import { removeComment } from "../../../../../api-routes/comments";
import { removeReply } from "../../../../../api-routes/commentReplies";
import styles from "./comment.module.css";
import { dateCleanUp } from "../../../../../utils/dateCleanUp";
import AddReply from "../add-reply";
import { replyCacheKey } from "../../partials/add-reply/index";
import { commentCacheKey } from "../../../../../api-routes/comments";

export default function Comment({ comment, created_at, author, id }) {
  const user = useUser();
  const router = useRouter();
  const { slug } = router.query;
  const [showReply, setShowReply] = useState(false);

  const toggleReply = () => {
    setShowReply(!showReply);
  };

  const closeReplyInputs = () => {
    setShowReply(false);
  };

  const getPostCacheKey = "/post";

  const { data: { data: post = {} } = {}, error } = useSWR(
    slug ? `${getPostCacheKey}${slug}` : null,
    () => getPost({ slug })
  );

  if (error) {
    return <div>Error loading comments</div>;
  }

  const authorIsLoggedIn = user ? post.user_id === user.id : false;

  const postId = post.id;

  const { trigger: removeCommentTrigger } = useSWRMutation(
    postId ? `${commentCacheKey}${postId}` : null,
    removeComment
  );

  const handleDelete = async () => {
    if (authorIsLoggedIn) {
      const { error, status } = await removeCommentTrigger(id);
    } else {
      return router.push("/login");
    }
  };

  const { data: { data: reply = [] } = {}, error: replyError } = useSWR(
    id ? `${replyCacheKey}${id}` : null,
    () => getReplies(id)
  );

  if (replyError) {
    return <div>Error loading comment replies</div>;
  }

  const handleRemoveReply = async (replyId) => {
    const { data, error } = await removeReplyTrigger(replyId);
  };

  const { trigger: removeReplyTrigger } = useSWRMutation(
    id ? `${replyCacheKey}${id}` : null,
    removeReply,
    {
      onError: (error) => {
        return <div>Error while attempting to delete reply</div>;
      },
    }
  );

  return (
    <div className={styles.container}>
      <p className={styles.author}>{author}</p>
      <p>{comment}</p>
      <time className={styles.date}>{dateCleanUp(created_at)}</time>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.commentButton}
          type="submit"
          onClick={toggleReply}
        >
          {showReply ? "Cancel" : "Reply"}
        </Button>

        {authorIsLoggedIn && <Button onClick={handleDelete}>❌ Comment</Button>}
      </div>

      {showReply && <AddReply commentId={id} onClose={closeReplyInputs} />}

      {reply.map((reply) => (
        <div key={reply.id} className={styles.replyContainer}>
          <p className={styles.author}>{reply.author}</p>
          <p className={styles.reply}>{reply.reply}</p>
          <time className={styles.date}>{dateCleanUp(reply.created_at)}</time>

          {authorIsLoggedIn && (
            <div className={styles.buttonContainer}>
              <Button onClick={() => handleRemoveReply(reply.id)}>
                ❌ Reply
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
