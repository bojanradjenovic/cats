import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Images from "./components/Images";
import 'bootstrap/dist/css/bootstrap.min.css';
import Upload from "./components/Upload";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Images />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}
