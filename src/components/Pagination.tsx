import React from "react";
import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <PaginationContainer>
      {pagesArray.map((page) => (
        <PageNumber
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </PageNumber>
      ))}
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

interface PageNumberProps {
  active: boolean;
}

const PageNumber = styled.button<PageNumberProps>`
  border: none;
  background-color: ${({ active }) => (active ? "lightblue" : "white")};
  color: ${({ active }) => (active ? "white" : "black")};
  padding: 5px 10px;
  margin: 0 2px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? "lightblue" : "lightgray")};
  }
`;

export default Pagination;
