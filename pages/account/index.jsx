import Heading from "@components/heading";
import styles from "./account.module.css";
import { getUser } from "../../api-routes/user";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
import { getAuthorFromEmail } from "../../utils/getAuthorFromEmail";

const userCacheKey = "/account";

export default function Account() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const id = user?.id;

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

  const userName =
    data.name != null ? data.name : getAuthorFromEmail(data.email);

  return (
    <div className={styles.container}>
      <Heading>My Account</Heading>
      <p>Email: {data.email}</p>
      <p>Username: {userName}</p>
    </div>
  );
}
