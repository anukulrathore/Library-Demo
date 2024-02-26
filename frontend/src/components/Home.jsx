import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const handleClick = async (bookId) => {
    try {
      await axios.post(`http://localhost:3000/api/v1/book/`);
      navigate("/modify");
    } catch (error) {
      console.log("Error while checking out the book", error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/book/books"
        );
        setBooks(response.data.books);
      } catch (error) {
        console.log("Error while getting books");
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>Books List</h2>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            {book.bookName} {book.numberOfCopies} Copies remaining
            <button onClick={() => handleClick(book._id)}>Checkout Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
