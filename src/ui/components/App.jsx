import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import {Button} from "@swc-react/button";
import {Theme} from "@swc-react/theme";
import React, {useEffect, useState} from "react";
import "./App.css";

const UNSPLASH_ACCESS_KEY = "-uuQ6asuxb4pOy7UvmJS7yUZGDuu2nTZLEICWdTtaAg";

const App = ({addOnUISdk, sandboxProxy}) => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    images.forEach((img) => {
      const elementId = `img-${img.id}`;
      const previewUrl = `${img.urls.thumb}&w=300`;

      const imageEl = document.getElementById(elementId);
      if (!imageEl) return;

      try {
        addOnUISdk.app.enableDragToDocument(imageEl, {
          previewCallback: () => new URL(previewUrl),
          completionCallback: async () => {
            const blob = await fetch(img.urls.full).then((res) => res.blob());
            return [{blob}];
          },
        });
      } catch (err) {
        console.error(`drag setup failed for image ${img.id}`, err);
      }
    });
  }, [images, addOnUISdk]);

  const searchImages = async () => {
    if (!query) return;
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await res.json();
    setImages(data.results);
  };

  return (
    <Theme system="express" scale="medium" color="light">
      <div
        style={{
          padding: "2rem",
          maxWidth: 960,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{marginBottom: "1.5rem", fontSize: "1.75rem"}}>
          Moodboard Generator
        </h2>
        <div style={{marginBottom: "1.5rem"}}>
          <Button
            variant="primary"
            onClick={() => sandboxProxy.createText({text: "Moodboard Title"})}
          >
            Add Title Text
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Search Unsplash..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flexGrow: 1,
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <Button variant="secondary" onClick={searchImages}>
            Search
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "1.5rem",
            justifyContent: "flex-start",
          }}
        >
          {images.map((img) => (
            <img
              id={`img-${img.id}`}
              key={img.id}
              src={`${img.urls.thumb}&w=300`}
              alt={img.alt_description}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: "6px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                cursor: "grab",
                transition: "transform 0.2s ease",
              }}
              draggable={true}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1.0)")
              }
            />
          ))}
        </div>
      </div>
    </Theme>
  );
};

export default App;
