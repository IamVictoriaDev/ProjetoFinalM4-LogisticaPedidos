import { create } from "zustand";

type SearchState = {
  busca: string;
  setBusca: (value: string) => void;
  limparBusca: () => void;
};

export const useSearch = create<SearchState>((set) => ({
  busca: "",
  setBusca: (value) => set({ busca: value }),
  limparBusca: () => set({ busca: "" }),
}));