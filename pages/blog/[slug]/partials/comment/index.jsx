import Button from "@components/button";
import styles from "./comment.module.css";
import { removeComment } from "../../../../../api-routes/comments";
import { commentCacheKey } from "@/api-routes/comments";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { getPost }  from "../../../../../api-routes/posts";

export default function Comment({ comment, createdAt, author, id, post_id }) {
  const user = useUser();
  const router = useRouter();

  const { slug } = router.query;
  const getPostCacheKey = "/post";

  const { data: { data: post = {} } = {}, error } = useSWR(
    slug ? `${getPostCacheKey}${slug}` : null,
    () => getPost({ slug })
  );

  const handleDelete = () => {
    if (user) {
      removeComment(commentCacheKey, id);
    } else {
      router.push("/login");
    }
  };
  
  const authorIsLoggedIn = post.user_id === user.id;

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>
          {authorIsLoggedIn && (
        <div className={styles.buttonContainer}>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </div>
  );
}
