/**
 * Board Service — business logic for Kanban boards and saved views.
 */

import * as api from '@/lib/api/client';
import type { Board, SavedView } from '@/types/kanban';

export const BoardService = {
  async getAll(): Promise<Board[]> {
    return api.getBoards();
  },

  async getById(id: string): Promise<Board> {
    return api.getBoard(id);
  },

  async getSavedViews(boardId?: string): Promise<SavedView[]> {
    return api.getSavedViews(boardId);
  },

  async getMetadata(): Promise<{ labels: string[] }> {
    return api.getKanbanMetadata();
  },
};
