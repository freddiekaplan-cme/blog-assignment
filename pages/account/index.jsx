import Heading from "@components/heading";
import SubHeading from "@components/sub-heading";
import styles from "./account.module.css";
import { getUser } from "../../api-routes/user";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { getAuthorFromEmail } from "../../utils/getAuthorFromEmail";
import { dateCleanUp } from "../../utils/dateCleanUp";
import { cacheKey } from "../blog/index";
import { userPosts } from "../../api-routes/posts";
import Link from "next/link";

const userCacheKey = "/account";

export default function Account() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const id = user?.id;

  console.log(id);

  const { data: { data = {} } = {}, error } = useSWR(
    id ? `${userCacheKey}${id}` : null,
    () => getUser(id)
  );

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading user data...</div>;
  }

  const { data: { data: post = [] } = {}, error: postError } = useSWR(
    cacheKey,
    () => userPosts(id)
  );

  console.log(post);

  if (postError) {
    return <div>Error loading user posts: {postError.message}</div>;
  }

  const userName =
    data.name != null ? data.name : getAuthorFromEmail(data.email);

  return (
    <section className={styles.container}>
      <Heading>My Account</Heading>
      <p>Email: {data.email}</p>
      <p>Username: {userName}</p>

      <div>
        <SubHeading>Posts</SubHeading>
        {post.map((post) => (
          <Link
            key={post.slug}
            className={styles.link}
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p>{post.title}</p>
              <time className={styles.date}>{dateCleanUp(post.createdAt)}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
