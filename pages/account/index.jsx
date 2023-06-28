import Heading from "@components/heading";
import styles from "./account.module.css";
import { getUser } from "../../api-routes/user";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

const userCacheKey = "/account";

export default function Account() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  const id = user?.id;

  console.log(id);

  const { data, error } = useSWR(id ? [userCacheKey, id] : null, () =>
    getUser({ id })
  );

  if (error) {
    return <div>Error loading user data</div>;
  }

  if (!data) {
    return <div>Loading user data...</div>;
  }

  console.log(data);

  return (
    <div className={styles.container}>
      <Heading>My Account</Heading>
      {/* Render user data here */}
    </div>
  );
}

// import Heading from "@components/heading";
// import styles from "./account.module.css";
// import { getUser } from "../../api-routes/user";
// import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
// import useSWR from "swr";

// const userCacheKey = "/account";

// export default function Account() {
//   const supabaseClient = useSupabaseClient();
//   const user = useUser();

//   const id = user ? user.id : null;

//   console.log(id);

//   const { data: { data = {} } = {}, error } = useSWR(
//     id ? `${userCacheKey}${id}` : null,
//     () => getUser({ id })
//   );

//   if (error) {
//     return <div>Error loading user data</div>;
//   }

//   if (!data) {
//     return <div>Loading user data...</div>;
//   }

//   console.log(data);

//   return (
//     <div className={styles.container}>
//       <Heading>My Account</Heading>
//       {/* <p className={styles.author}>{author}</p>
//       <p>{comment}</p> */}
//     </div>
//   )
// };
