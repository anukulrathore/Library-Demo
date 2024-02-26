import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookList from "./components/Home";
import BooksMenu from "./components/BooksMenu";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/modify" element={<BooksMenu />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
