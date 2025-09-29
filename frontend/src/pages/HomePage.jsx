import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import background from "../assets/WhatsApp Image 2025-09-26 at 08.54.03_6362b8ae.jpg";
import { listServicePosts } from "../services/servicePosts";

function formatDuration(isoDuration) {
  if (!isoDuration) return "";
  try {
    const match = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(isoDuration);
    if (!match) return isoDuration;
    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    return parts.join(" ") || "0m";
  } catch {
    return isoDuration;
  }
}

function formatPrice(price) {
  if (price == null) return "Precio no disponible";
  return new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU" }).format(price);
}

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["servicePosts", { page: 0, size: 12 }],
    queryFn: () => listServicePosts({ page: 0, size: 12 }),
  });

  const posts = data?.content ?? [];
  const bullet = "\u2022";
  const noServicesMessage = `Todav\u00eda no hay servicios publicados.`;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "40px 0",
        background: "#ffffffff",
        backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.15)), url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: "100%",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "48px",
            maxWidth: "1200px",
            width: "100%",
            padding: "40px",
          }}
        >
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} style={{ height: 280, background: "rgba(255,255,255,0.1)", borderRadius: 12 }} />
          ))}

          {isError && (
            <div style={{ gridColumn: "1 / -1", color: "white", textAlign: "center" }}>
              No pudimos cargar los servicios. {error?.message}
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div style={{ gridColumn: "1 / -1", color: "white", textAlign: "center" }}>
              {noServicesMessage}
            </div>
          )}

          {posts.map((post) => {
            const description = `${formatPrice(post.price)} ${bullet} ${formatDuration(post.duration)}`;
            const image = Array.isArray(post.photosURLs) && post.photosURLs.length > 0 ? post.photosURLs[0] : undefined;
            return (
              <ServiceCard
                key={post.id ?? `${post.title}-${description}`}
                image={image}
                rating={post.rating}
                name={post.title}
                description={description}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}