export default async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "All";
  const language = url.searchParams.get("language") || "en";
  const page = url.searchParams.get("page") || "1";

  const apiKey = Netlify.env.get("VITE_NEWS_API_KEY");

  const apiUrl = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&language=${language}&page=${page}&pageSize=24&apiKey=${apiKey}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config = { path: "/api/news" };