import axios from "axios";
import type { Note, CreateNoteData } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<{ notes: Note[]; totalPages: number }> => {
  const params: Record<string, string | number> = { page, perPage };

  if (search && search.trim() !== "") {
    params.search = search;
  }

  const response = await axiosInstance.get("/notes", { params });
  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await axiosInstance.post("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};
