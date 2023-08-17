import React from "react";
import '@/assets/css/base.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Example from "./example";

const App = () => {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/:id" element={<Example />} />
            <Route path="*" element={<p>404 NoFound</p>} />
          </Routes>
        </BrowserRouter>
    );
  };

export default App;