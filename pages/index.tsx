import React from "react";
import Heading from "@components/heading";
import SubHeading from "@components/sub-heading";
import BlogImageBanner from "@components/blog-image-banner";
import styles from "pages/blog/blog.module.css";
import useSWR from "swr";
import { latestPost } from "../api-routes/posts";
import { cacheKey } from "../pages/blog";
import { dateCleanUp } from "../utils/dateCleanUp";

interface PostData {
  post?: any;
  email?: string;
}

export default function Home() {
  const { data, error } = useSWR(`${cacheKey}/latest`, latestPost);

  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (!data) {
    return <div>Loading blog data...</div>;
  }

  const { post, email }: PostData = data.data || {};

  const latestPostData = post || {};

  const emailSubstring = email ? email.split("@")[0] : "";

  return (
    <section>
      <Heading>Latest Blog Post</Heading>
      <SubHeading>{latestPostData.title}</SubHeading>
      {latestPostData?.image && (
        <BlogImageBanner
          src={latestPostData.image}
          alt={latestPostData.title}
        />
      )}
      <div className={styles.dateContainer}>
        <time className={styles.date}>
          {dateCleanUp(latestPostData.createdAt)}
        </time>
        <div className={styles.border} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: latestPostData.body }} />
      <p className={styles.author}>Author: {emailSubstring}</p>
    </section>
  );
}
