import styles from "./sub-heading.module.css";

export default function SubHeading({ children }) {
  return <h2 className={styles.container}>{children}</h2>;
}
