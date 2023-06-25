import Link from "next/link";
import { dateCleanUp } from "../../utils/dateCleanUp";
import { useRef, useState } from "react";
import Heading from "@components/heading";
import Button from "@components/button";
import Input from "@components/input";
import Label from "@components/label";
import styles from "./search.module.css";
import useSWRMutation from "swr/mutation";
import { searchPosts } from "../../api-routes/posts";
import SubHeading from "@components/sub-heading";

const searchCacheKey = "/search";
let errorMessage = "";

export default function Search() {
  const formRef = useRef();
  const [searchResults, setSearchResults] = useState([]);

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const search = formData.get("searchInput");

    const { data, error } = await searchTrigger({ arg: search });

    setSearchResults(data || []);

    if (error) {
		console.log(error);
		console.log(error.message);
		errorMessage = "Error loading search results. " + error.message;
	}

    formRef.current.reset();
  };

  const { trigger: searchTrigger } = useSWRMutation(
    searchCacheKey,
    searchPosts
  );

  return (
    <div className={styles.container}>
      <Heading>Search</Heading>

      <form ref={formRef} className={styles.form} onSubmit={handleOnSubmit}>
        <div className={styles.inputContainer}>
          <Label htmlFor="searchInput">Query</Label>
          <Input id="searchInput" name="searchInput" />
        </div>

        <Button className={styles.searchButton} type="submit">
          Search
        </Button>
      </form>

      <section>
        <SubHeading>Search Results</SubHeading>
        {searchResults.map((post) => (
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
      </section>
		<p>{errorMessage}</p>
    </div>
  );
}
