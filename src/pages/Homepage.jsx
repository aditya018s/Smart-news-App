import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "../components/NewsItem";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export default function Homepage() {
  let [page, setPage] = useState(1);
  let [articles, setArticles] = useState([]);
  let [totalResults, setTotalResults] = useState(0);
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState("");

  let [q, setQ] = useState("All");
  let [language, setLanguage] = useState("hi");
  let [searchParams] = useSearchParams();

  const fetchNewsPage = useCallback(async (q, language, pageNumber) => {
    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      if (!NEWS_API_KEY) {
        return {
          status: "error",
          message: "Missing NewsAPI key. Add VITE_NEWS_API_KEY to your environment.",
        };
      }

      let response = await fetch(
        // CHANGED: switched from newsapi.org to gnews.io — newsapi.org blocks browser requests on free plan (localhost only)
        `https://gnews.io/api/v4/search?q=${q}&lang=${language}&page=${pageNumber}&max=10&token=${NEWS_API_KEY}`,
        { signal: controller.signal },
      );
      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  const getAPIData = useCallback(async (q, language) => {
    setIsLoading(true);
    setError("");
    setPage(1);

    try {
      let response = await fetchNewsPage(q, language, 1);
      // CHANGED: gnews returns "success" instead of "ok", and "totalArticles" instead of "totalResults"
      if (response.status === "success") {
        setArticles(response.articles);
        setTotalResults(response.totalArticles);
      } else {
        setArticles([]);
        setTotalResults(0);
        setError(response.message || "Unable to load articles right now.");
      }
    } catch {
      setArticles([]);
      setTotalResults(0);
      setError("Unable to connect to the news service right now.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchNewsPage]);

  let fetchData = async () => {
    let nextPage = page + 1;
    setPage(nextPage);
    try {
      let response = await fetchNewsPage(q, language, nextPage);
      // CHANGED: gnews returns "success" instead of "ok"
      if (response.status === "success") {
        setArticles(articles.concat(response.articles));
      }
    } catch {
      setError("More articles could not be loaded.");
    }
  };

  useEffect(() => {
    (() => {
      let q = searchParams?.get("q") ?? "All";
      let language = searchParams?.get("language") ?? "hi";
      setQ(q);
      setLanguage(language);
      getAPIData(q, language);
    })();
  }, [searchParams, getAPIData]);

  return (
    <main className="news-page">
      <section className="container-fluid page-hero">
        <div>
          <p className="section-kicker">Latest coverage</p>
          <h1 className="page-title text-capitalize">{q} News Articles</h1>
        </div>
        <div className="hero-meta">
          <span>{language.toUpperCase()}</span>
          <span>{totalResults.toLocaleString()} results</span>
        </div>
      </section>

      <section className="container-fluid news-section">
        {error && <div className="app-alert">{error}</div>}
        {isLoading && articles.length === 0 && <div className="loader-block">Loading latest articles...</div>}
        {!isLoading && !error && articles.length === 0 && <div className="loader-block">No articles found for this topic.</div>}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchData}
          hasMore={articles.length < totalResults}
          loader={<div className="loader-block">Loading more stories...</div>}
        >
          <div className="row g-4">
            {articles.map((item, index) => {
              return (
                <NewsItem
                  key={index}
                  source={item.source.name}
                  title={item.title}
                  description={item.description}
                  url={item.url}
                  // CHANGED: gnews uses "image" instead of "urlToImage"
                  pic={item.image}
                  date={item.publishedAt}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </section>
    </main>
  );
}