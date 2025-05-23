import React from "react";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import { toast } from "react-hot-toast";

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  // Використовуємо useMutation для видалення нотатки
  const { mutate, status } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // Інвалюємо кеш запиту після успішного видалення
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  if (!notes.length) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button
              className={css.button}
              onClick={() => mutate(id)}
              disabled={status === "pending"}
            >
              {status === "pending" ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
