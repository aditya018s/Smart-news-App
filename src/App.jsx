import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'

export default function App() {
  let [theme, setTheme] = useState(() => localStorage.getItem("news-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("news-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <>
    <BrowserRouter>
    <Navbar theme={theme} toggleTheme={toggleTheme}/>
    <Routes>
        <Route path='' element={<Homepage/>} />
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}
