import { useRouter } from "next/router";
import styles from "./blog-post.module.css";
import Comments from "./partials/comments";
import AddComment from "./partials/add-comment";
import Button from "@components/button";
import Heading from "@components/heading";
import BlogImageBanner from "@components/blog-image-banner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getPost, removePost } from "../../../api-routes/posts";
import { dateCleanUp } from "../../../utils/dateCleanUp";
import { getAuthorFromEmail } from "../../../utils/getAuthorFromEmail";
import { getUser } from "../../../api-routes/user";
import { userCacheKey } from "../../account";
import { useUser } from "@supabase/auth-helpers-react";

export default function BlogPost() {
  const user = useUser();
  const router = useRouter();
  const { slug } = router.query;
  const postCacheKey = "/post";

  const { data: { data: post = {} } = {}, error } = useSWR(
    slug ? `${postCacheKey}${slug}` : null,
    () => getPost({ slug })
  );

  if (error) {
    return <div>Error loading blog data: {error.message}</div>;
  }

  if (!post) {
    return <div>Loading blog data...</div>;
  }

  const { trigger: removeTrigger } = useSWRMutation(postCacheKey, removePost);

  const postUserId = post.user_id;

  const { data: { data: userData = {} } = {}, error: userError } = useSWR(
    postUserId ? `${userCacheKey}${postUserId}` : null,
    () => getUser(postUserId)
  );

  if (userError) {
    return <div>Error loading user data: {userError.message}</div>;
  }

  const handleDeletePost = async () => {
    const id = post.id;
    const { error, status } = await removeTrigger(id);

    return router.push(`/blog/`);
  };

  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };

  const userName =
    userData.name != null ? userData.name : getAuthorFromEmail(userData.email);

  const userInfo = userData.info != null ? userData.info : "";

  const authorIsLoggedIn = user ? post.user_id === user.id : false;

  return (
    <>
      <section className={styles.container}>
        <Heading>{post.title}</Heading>
        {post?.image && <BlogImageBanner src={post.image} alt={post.title} />}
        <div className={styles.dateContainer}>
          <time className={styles.date}>{dateCleanUp(post.createdAt)}</time>
          <div className={styles.border} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
        <span className={styles.author}>Author: {userName}</span>
        <span className={styles.info}>{userInfo}</span>

        {authorIsLoggedIn && (
          <div className={styles.buttonContainer}>
            <Button onClick={handleDeletePost}>Delete</Button>
            <Button onClick={handleEditPost}>Edit</Button>
          </div>
        )}
      </section>

      <Comments postId={post.id} />

      <AddComment postId={post.id} />
    </>
  );
}
