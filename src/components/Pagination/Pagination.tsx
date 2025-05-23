import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number; // Загальна кількість сторінок
  currentPage: number; // Поточна сторінка, 1-базована (наприклад, 1, 2, 3, ...)
  onPageChange: (selectedPage: number) => void; // Функція викликається з номером сторінки (1-базована)

  // Додаткові пропси для кастомізації
  nextLabel?: React.ReactNode;
  previousLabel?: React.ReactNode;
  breakLabel?: React.ReactNode;
  pageRangeDisplayed?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
  nextLabel = "→", // Дефолтні значення
  previousLabel = "←",
  breakLabel = "...",
  pageRangeDisplayed = 3,
}) => {
  /**
   * ReactPaginate використовує 0-базовані індекси сторінок.
   * Але наш компонент і зовнішній код працюють з 1-базованими номерами сторінок.
   * Тому при передачі в onPageChange перетворюємо selectedItem.selected (0-базований) у 1-базований.
   */
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel={breakLabel}
      nextLabel={nextLabel}
      onPageChange={handlePageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel={previousLabel}
      forcePage={currentPage - 1} // Перетворення 1-базованої сторінки в 0-базовану для компонента
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
    />
  );
};

export default Pagination;
