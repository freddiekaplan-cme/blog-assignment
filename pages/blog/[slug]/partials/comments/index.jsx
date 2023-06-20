import { useRouter } from "next/router";
import styles from "./comments.module.css";
import Comment from "../comment";
import { commentCacheKey, getComments } from '@/api-routes/comments'
import useSWR  from "swr"

export default function Comments({ postId }) {
  const router = useRouter();
  const { data : { data: post = []} = {},
    error,
  } = useSWR(postId ? `${commentCacheKey}${postId}` : null, () =>
   getComments(postId) 
   );

  if (error || !post) {
    return <p>Error loading comments</p>
  }

  if (post.length === 0) {
    return <p>Be the first to comment:</p>
  }

  return (
    <div className={styles.container}>
      <h2>Comments</h2>
      {post.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
