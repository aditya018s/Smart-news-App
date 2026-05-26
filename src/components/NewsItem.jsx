import React from "react";

export default function NewsItem(props) {
  let publishedDate = props.date
    ? new Date(props.date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xxl-3 news-grid-item">
      <article className="card news-card">
        <div className="news-image-wrap">
          <img src={props.pic ?? "/image/noimg.jpg"} className="card-img-top news-image" alt={props.title ?? "News article"} />
        </div>
        <div className="card-body news-card-body">
          <div className="source">
            <span>{props.source || "News Source"}</span>
            <span>{publishedDate}</span>
          </div>
          <h5 className="card-title">{props.title || "Untitled news article"}</h5>
          <p className="card-text">{props.description || "Open the full article to read the latest details from the publisher."}</p>
          <a href={props.url} target="_blank" rel="noreferrer" className="btn app-read-button">
              Read Full Article
          </a>
        </div>
      </article>
    </div>
  );
}
