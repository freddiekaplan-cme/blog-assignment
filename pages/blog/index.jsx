import Link from "next/link";
import styles from "./blog.module.css";
import Heading from "@components/heading";

import useSWR from "swr";
// import useSWRMutation from "swr/mutation";

import { getBlogData } from "../api";


const mockData = [
  {
    id: "123",
    title: "Community-Messaging Fit",
    slug: "community-messaging-fit",
    createdAt: "2022-02-15",
    body: "<p>This is a good community fit!</p>",
  },
  {
    id: "1234",
    title: "Why you should use a react framework",
    slug: "why-you-should-use-react-framework",
    createdAt: "2022-02-12",
    body: "<p>This is a good community fit!</p>",
  },
];

// swr

// export const cacheKey = "blogData";

// export default function blog() {
  // const {
  //   data: { data = [] } = {},
  //   error,
  //   mutate,
  //   isLoading,
  // } = useSWR(cacheKey, getBlogData);

//   const { trigger: addTrigger, isMutating } = useSWRMutation(cacheKey, addCharacter, {
//     onError: () => {
//       setToaster({
//         message: "An error occurred while adding a character.",
//       });
//     },
//   });
// }
const cacheKey = "blogData";

export default function Blog() {
  const {
    data: { data = [] } = {},
    error
    // mutate,
    // isLoading,
  } = useSWR(cacheKey, getBlogData);

  //Gör om errors
  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (!data) {
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
            <time className={styles.date}>{post.createdAt.slice(0,10) + " " + post.createdAt.slice(11,16)}</time>
          </div>
        </Link>
      ))}
    </section>
  );
}
