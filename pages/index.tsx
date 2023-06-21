import React from "react";
import Heading from "@components/heading";
import SubHeading from "@components/sub-heading";
import BlogImageBanner from "@components/blog-image-banner";
import styles from "pages/blog/blog.module.css";
import useSWR from "swr";
import { latestPost } from "../api-routes/posts";
import { cacheKey } from "../pages/blog";

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
          {latestPostData.createdAt?.slice(0, 10) +
            " " +
            latestPostData.createdAt?.slice(11, 16)}
        </time>
        <div className={styles.border} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: latestPostData.body }} />
      <p className={styles.author}>Author: {emailSubstring}</p>
    </section>
  );
}

// import React, { useState, useEffect } from 'react';
// import Heading from "@components/heading";
// import SubHeading from "@components/sub-heading";
// import BlogImageBanner from "@components/blog-image-banner";
// import styles from "pages/blog/blog.module.css";
// import useSWR from "swr";
// import { latestPost } from "../api-routes/posts";
// import { cacheKey } from "../pages/blog";

// export default function Home() {
//   const {
//     data: { data: post = [] } = {},
//     error
//   } = useSWR(cacheKey, latestPost);

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (post) {
//       const delay = setTimeout(() => {
//         setIsLoading(false);
//       }, 2000);

//       return () => clearTimeout(delay);
//     }
//   }, [post]);

//   if (error) {
//     return <div>Error loading blog data</div>;
//   }

//   if (isLoading || !post) {
//     return <div>Loading blog data...</div>;
//   }

//   const { post: latestPostData, email } = post as { post: any; email: string };
//   const substring = email ? email.split('@')[0] : '';

//   return (
//     <section>
//       <Heading>Newest Blog Post</Heading>
//       <SubHeading>{latestPostData.title}</SubHeading>
//       {latestPostData?.image && <BlogImageBanner src={latestPostData.image} alt={latestPostData.title} />}
//       <div className={styles.dateContainer}>
//         <time className={styles.date}>
//           {latestPostData.createdAt.slice(0, 10) + ' ' + latestPostData.createdAt.slice(11, 16)}
//         </time>
//         <div className={styles.border} />
//       </div>
//       <div dangerouslySetInnerHTML={{ __html: latestPostData.body }} />
//       <p className={styles.author}>Author: {substring}</p>
//     </section>
//   );
// }
