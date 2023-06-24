import { useRef } from "react";
import Button from "@components/button";
import Input from "@components/input";
import Label from "@components/label";
import TextArea from "@components/text-area";
import styles from "./add-comment.module.css";
import {
  commentCacheKey,
  addComment,
} from "../../../../../api-routes/comments";
import useSWRMutation from "swr/mutation";

export default function AddComment({ postId }) {
  const formRef = useRef();
  let commentAuthor = "";

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { author, comment } = Object.fromEntries(formData);
    const newComment = { author, comment, post_id: postId };
    commentAuthor = newComment.author;

    const { error, status } = await addTrigger(newComment);

    formRef.current.reset();
  };

  const { trigger: addTrigger } = useSWRMutation(
    `${commentCacheKey}${commentAuthor}`,
    addComment
  );

  return (
    <div className={styles.container}>
      <h2>Add a comment</h2>
      <form ref={formRef} className={styles.form} onSubmit={handleOnSubmit}>
        <div className={styles.inputContainer}>
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="comment">Comment</Label>
          <TextArea id="comment" name="comment" />
        </div>

        <Button className={styles.addCommentButton} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
