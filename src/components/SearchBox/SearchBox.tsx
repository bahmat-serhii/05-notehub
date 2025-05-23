import React, { type ChangeEvent, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string; // Контрольоване значення input
  onSearch: (searchText: string) => void; // Колбек при пошуку (з дебаунсом)
  onChange: (newValue: string) => void; // Колбек для оновлення значення input
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onSearch, onChange }) => {
  // Дебаунс для значення, яке прийшло з пропів
  const [debouncedValue] = useDebounce(value, 500);

  // Виклик onSearch після затримки дебаунсу
  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // Передаємо нове значення батьку
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value} // Контрольоване значення
      onChange={handleChange}
      autoComplete="off"
    />
  );
};

export default SearchBox;
