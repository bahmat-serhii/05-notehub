import React, { useState, useCallback } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import NoteModal from "../NoteModal/NoteModal";
import Pagination from "../Pagination/Pagination";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { Note, CreateNoteData } from "../../types/note";

const PER_PAGE = 12;

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const App: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", { page, search }],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation: UseMutationResult<Note, Error, CreateNoteData> =
    useMutation({
      mutationFn: createNote,
      onSuccess: () => {
        toast.success("Note created!");
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        setModalOpen(false);
      },
      onError: () => {
        toast.error("Failed to create note");
      },
    });

  const deleteNoteMutation = useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleSearch = useCallback((searchText: string) => {
    setPage(1);
    setSearch(searchText);
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handleCreate = (data: CreateNoteData) => {
    createNoteMutation.mutate(data);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create Note +
        </button>
      </header>

      {isLoading && <p className={css.status}>Loading...</p>}
      {isError && (
        <p className={css.status}>Error: {error?.message ?? "Unknown error"}</p>
      )}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <NoteModal onClose={closeModal}>
          <NoteForm
            onSubmit={handleCreate}
            onCancel={closeModal}
            isSubmitting={createNoteMutation.status === "pending"}
          />
        </NoteModal>
      )}
    </div>
  );
};

export default App;
