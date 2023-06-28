import { useRef } from "react";
import Button from "@components/button";
import Input from "@components/input";
import Label from "@components/label";
import TextArea from "@components/text-area";
import styles from "./add-reply.module.css";
import useSWRMutation from "swr/mutation";
import { addReply } from "../../../../../api-routes/commentReplies";

export const replyCacheKey = "/post/reply";

export default function AddReply({ commentId, onClose }) {
  const formRef = useRef();

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const replyAuthor = formData.get("replyAuthor");
    const reply = formData.get("reply");
    const newReply = {
      author: replyAuthor,
      reply: reply,
      comment_id: commentId,
    };

    const { error, status } = await addReplyTrigger({ arg: newReply });

    formRef.current.reset();
    onClose();
  };

  const { trigger: addReplyTrigger } = useSWRMutation(
    commentId ? `${replyCacheKey}${commentId}` : null,
    addReply
  );

  return (
    <div className={styles.container}>
      <h2>Reply to comment</h2>
      <form ref={formRef} className={styles.form} onSubmit={handleOnSubmit}>
        <div className={styles.inputContainer}>
          <Label htmlFor="replyAuthor">Name</Label>
          <Input id="replyAuthor" name="replyAuthor" />
        </div>

        <div className={styles.inputContainer}>
          <Label htmlFor="reply">Reply</Label>
          <TextArea id="reply" name="reply" />
        </div>

        <Button className={styles.addReplyButton} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
