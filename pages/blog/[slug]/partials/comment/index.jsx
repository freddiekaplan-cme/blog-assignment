import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { useUser } from "@supabase/auth-helpers-react";

import Button from "@components/button";
import { commentCacheKey } from "@/api-routes/comments";
import { getPost }  from "../../../../../api-routes/posts";
import { removeComment } from "../../../../../api-routes/comments";
import styles from "./comment.module.css";

export default function Comment({ comment, created_at, author, id}) {
  const user = useUser();
  const router = useRouter();
  const { slug } = router.query;
  const getPostCacheKey = "/post";
  
  const { data: { data: post = {} } = {}, error } = useSWR(
    slug ? `${getPostCacheKey}${slug}` : null,
    () => getPost({ slug })
    );
  
  const authorIsLoggedIn = (user ? post.user_id === user.id : false);
  
  const { trigger: removeCommentTrigger } = useSWRMutation(`${commentCacheKey}${slug}`, removeComment);

  const handleDelete = async () => {
    if (authorIsLoggedIn) {
      const { error, status } = await removeCommentTrigger(id);
    } else {
      return router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      {/* <time className={styles.date}>{created_at}</time> */}
      <time className={styles.date}>{created_at?.slice(0, 10) + " " + created_at?.slice(11, 16)}</time>
          {authorIsLoggedIn && (
        <div className={styles.buttonContainer}>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </div>
  );
}
