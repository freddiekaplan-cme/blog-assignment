import { useRouter } from "next/router";
import styles from "./blog-post.module.css";
import Comments from "./partials/comments";
import AddComment from "./partials/add-comment";
import Button from "@components/button";
import Heading from "@components/heading";
import BlogImageBanner from "@components/blog-image-banner";

import useSWR from "swr";

import { getPost, removePost } from "../../../api-routes/posts";

const cacheKey = "blogPost";
// const cacheKey = `blogPost:${slug}`;

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const { data, error } = useSWR(slug ? cacheKey : null, () => 
    getPost({ slug })
  );

  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (!data) {
    return <div>Loading blog data...</div>;
  }

  const post = data.data;

  const handleDeletePost = () => {
    const id = post.id;
    removePost(id);
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
          <time className={styles.date}>{post.createdAt.slice(0,10) + " " + post.createdAt.slice(11,16)}</time>
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
