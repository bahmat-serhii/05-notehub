export interface Note {
  id: number;
  title: string;
  content: string;
  tag: Tag;
  createdAt?: string;
  updatedAt?: string;
  isArchived: boolean;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalNotes: number;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  tag: Tag;
}
export enum Tag {
  Todo = "Todo",
  Work = "Work",
  Personal = "Personal",
  Meeting = "Meeting",
  Shopping = "Shopping",
}
