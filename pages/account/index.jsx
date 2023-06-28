import Heading from "@components/heading";
import SubHeading from "@components/sub-heading";
import styles from "./account.module.css";
import { getUser, updateUser } from "../../api-routes/user";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getAuthorFromEmail } from "../../utils/getAuthorFromEmail";
import { dateCleanUp } from "../../utils/dateCleanUp";
import { cacheKey } from "../blog/index";
import { userPosts } from "../../api-routes/posts";
import Link from "next/link";
import Button from "@components/button";
import { useState, useRef } from "react";
import Label from "@components/label";
import Input from "@components/input";
import TextArea from "@components/text-area";

export const userCacheKey = "/account";

export default function Account() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const formRef = useRef();
  const id = user?.id;
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

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
    id ? `${cacheKey}${id}` : null,
    () => userPosts(id)
  );

  if (postError) {
    return <div>Error loading user posts: {postError.message}</div>;
  }

  const userName =
    data.name != null ? data.name : getAuthorFromEmail(data.email);

  const userDescription = data.info != null ? data.info : "None";

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const info = formData.get("info");
    const updatedUser = {
      name: name,
      info: info,
      id: id,
    };

    const { error, status } = await updateTrigger({ arg: updatedUser });

    formRef.current.reset();
    toggleUpdateForm();
  };

  const { trigger: updateTrigger } = useSWRMutation(
    id ? `${userCacheKey}${id}` : null,
    updateUser
  );

  return (
    <section className={styles.container}>
      <Heading>My Account</Heading>

      <p>Email: {data.email}</p>
      <p>Username: {userName}</p>
      <p>Description: {userDescription}</p>

      <Button
        className={styles.updateButton}
        type="submit"
        onClick={toggleUpdateForm}
      >
        {showUpdateForm ? "Close" : "Update info"}
      </Button>

      {showUpdateForm && (
        <form ref={formRef} className={styles.form} onSubmit={handleOnSubmit}>
          <SubHeading>Update your info</SubHeading>
          <div className={styles.inputContainer}>
            <Label htmlFor="name">Username</Label>
            <Input id="name" name="name" />
          </div>

          <div className={styles.inputContainer}>
            <Label htmlFor="info">Short description</Label>
            <TextArea id="info" name="info" />
          </div>

          <Button className={styles.updateButton} type="submit">
            Submit
          </Button>
        </form>
      )}

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
