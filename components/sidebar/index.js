import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./sidebar.module.css";
import classNames from "classnames";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  let pathname = usePathname() || "/";
  if (pathname.includes("/blog/")) {
    pathname = "/blog";
  }

  const navItems = {
    "/": {
      name: "Home",
    },
    "/blog": {
      name: "Blog",
    },
    "/about": {
      name: "About",
    },
    "/search": {
      name: "Search",
    },
    "/create-post": {
      name: "Create post",
      requiresAuth: true,
    },
    "/login": {
      name: "Login",
      requiresAuth: false,
    },
    // "/account": {
    //   name: "My Account",
    //   requiresAuth: true,
    // },
    "/logout": {
      name: "Logout",
      requiresAuth: true,
      onClick: async () => {
        await supabaseClient.auth.signOut();
        router.push("/login");
      },
    },
  };

  return (
    <aside className={styles.container}>
      <div className={styles.sticky}>
        <nav className={styles.navigation} id="nav">
          <div className={styles.navigationItemWrapper}>
            {Object.entries(navItems).map(([path, { name, requiresAuth, onClick }]) => {
              const isActive = path === pathname;
              
              if ((requiresAuth && !user) || (path === "/login" && user)) {
                return null;
              }

              if (path === "/logout") {
                return (
                  <button 
                    className={classNames(styles.navigationButon, {
                      [styles.textNeutral]: !isActive,
                      [styles.fontBold]: isActive,
                    })}
                  key={path}
                  onClick={onClick}>
                    {name}
                  </button>
                )
              }

              return (
                <Link
                  key={path}
                  href={path}
                  className={classNames(styles.navigationItem, {
                    [styles.textNeutral]: !isActive,
                    [styles.fontBold]: isActive,
                  })}
                >
                  <span className={styles.linkName}>{name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
