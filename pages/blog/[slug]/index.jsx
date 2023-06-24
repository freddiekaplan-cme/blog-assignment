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

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const postCacheKey = "/post";

  const { data: { data: post = {} } = {}, error } = useSWR(
    slug ? `${postCacheKey}${slug}` : null,
    () => getPost({ slug })
  );

  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (!post) {
    return <div>Loading blog data...</div>;
  }

  const { trigger: removeTrigger } = useSWRMutation(postCacheKey, removePost);

  const handleDeletePost = async () => {
    const id = post.id;
    const { error, status } = await removeTrigger(id);

    return router.push(`/blog/`);
  };

  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };

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
        <span className={styles.author}>Author: {post.author}</span>

        {/* The Delete & Edit part should only be showed if you are authenticated and you are the author */}
        <div className={styles.buttonContainer}>
          <Button onClick={handleDeletePost}>Delete</Button>
          <Button onClick={handleEditPost}>Edit</Button>
        </div>
      </section>

      <Comments postId={post.id} />

      {/* This component should only be displayed if a user is authenticated */}
      <AddComment postId={post.id} />
    </>
  );
}
