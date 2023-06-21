import Link from "next/link";
import styles from "./blog.module.css";
import Heading from "@components/heading";
import useSWR from "swr";
import { getPosts } from "../../api-routes/posts";

export const cacheKey = "/post";

export default function Blog() {
  const {
    data: { data = [] } = {},
    error,
    isLoading,
  } = useSWR(cacheKey, getPosts);

  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (isLoading) {
    return <div>Loading blog data...</div>;
  }

  return (
    <section>
      <Heading>Blog</Heading>
      {data.map((post) => (
        <Link
          key={post.slug}
          className={styles.link}
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col">
            <p>{post.title}</p>
            <time className={styles.date}>
              {post.createdAt.slice(0, 10) + " " + post.createdAt.slice(11, 16)}
            </time>
          </div>
        </Link>
      ))}
    </section>
  );
}
