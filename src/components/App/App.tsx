import React, { useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import NoteModal from "../NoteModal/NoteModal";
import Pagination from "../Pagination/Pagination";

import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";

const PER_PAGE = 12;

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const App: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // debounce значення для пошуку
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", { page, search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useCallback((searchText: string) => {
    setPage(1);
    setSearch(searchText);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
        />

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

      {data && <NoteList notes={data.notes} />}

      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
};

export default App;
