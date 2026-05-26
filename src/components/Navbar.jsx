import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const primaryCategories = [
  "All",
  "Politics",
  "Education",
  "Crime",
  "Entertainment",
  "Science",
  "Technology",
  "Economics",
];

const moreCategories = ["GeoPolitics", "Sports", "Cricket", "Soccer", "World", "India", "Jokes"];

const languages = [
  { label: "Hindi", code: "hi" },
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "German", code: "de" },
  { label: "Chinese", code: "zh" },
];

export default function Navbar({ theme, toggleTheme }) {
  let [search, setSearch] = useState("");
  let [q, setQ] = useState("All");
  let [language, setLanguage] = useState("hi");
  let [searchParams] = useSearchParams();

  let navigate = useNavigate();

  function postSearch(e) {
    e.preventDefault();
    let nextSearch = search.trim() || "All";
    navigate(`/?q=${encodeURIComponent(nextSearch)}&language=${language}`);
    closeMenus();
  }

  function closeMenus() {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => menu.classList.remove("show"));
    document.querySelectorAll(".dropdown-toggle.show").forEach((toggle) => {
      toggle.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".dropdown.show").forEach((dropdown) => dropdown.classList.remove("show"));

    let navContent = document.getElementById("navbarSupportedContent");
    let navToggler = document.querySelector(".app-toggler");
    if (navContent?.classList.contains("show")) {
      navContent.classList.remove("show");
      navToggler?.setAttribute("aria-expanded", "false");
    }
  }

  useEffect(() => {
    (() => {
      setQ(searchParams?.get("q") ?? "All");
      setLanguage(searchParams?.get("language") ?? "hi");
    })();
  }, [searchParams]);

  useEffect(() => {
    function handleScroll() {
      closeMenus();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let currentLanguage = languages.find((item) => item.code === language)?.label ?? "Language";

  return (
    <nav className="navbar navbar-expand-xxl app-navbar sticky-top">
      <div className="container-fluid app-nav-shell">
        <Link className="navbar-brand app-brand" to={`/?q=All&language=${language}`}>
          <span className="brand-mark">N</span>
          <span>NewsApp</span>
        </Link>
        <button
          className="navbar-toggler app-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse app-nav-content" id="navbarSupportedContent">
          <ul className="navbar-nav app-nav-links me-auto mb-3 mb-xl-0">
            {primaryCategories.map((category) => (
              <li className="nav-item" key={category}>
                <Link
                  className={`nav-link ${q === category ? "active" : ""}`}
                  to={`/?q=${category}&language=${language}`}
                  onClick={closeMenus}
                >
                  {category}
                </Link>
              </li>
            ))}

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                More
              </a>
              <ul className="dropdown-menu app-dropdown">
                {moreCategories.map((category) => (
                  <li key={category}>
                    <Link className={`dropdown-item ${q === category ? "active" : ""}`} to={`/?q=${category}&language=${language}`} onClick={closeMenus}>
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {currentLanguage}
              </a>
              <ul className="dropdown-menu app-dropdown">
                {languages.map((item) => (
                  <li key={item.code}>
                    <Link className={`dropdown-item ${language === item.code ? "active" : ""}`} to={`/?q=${q}&language=${item.code}`} onClick={closeMenus}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <form className="app-search" role="search" onSubmit={postSearch}>
            <input
              className="form-control app-search-input"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="search"
              placeholder="Search news"
              aria-label="Search"
            />
            <button className="btn app-search-button" type="submit">
              Search
            </button>
          </form>
          <button className="btn app-theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
            <span className="theme-icon">{theme === "dark" ? "L" : "D"}</span>
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
