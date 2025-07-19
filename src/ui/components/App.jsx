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
    images.forEach((img, index) => {
      const elementId = `img-${index}`;
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
        console.error(`drag setup failed for image ${index}`, err);
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
      <div style={{padding: "1rem"}}>
        <h2>Moodboard Generator</h2>
        <Button
          style={{marginLeft: "1rem"}}
          onClick={() => sandboxProxy.createText({text: "Moodboard Title"})}
        >
          Add Title Text
        </Button>

        <input
          type="text"
          placeholder="Search Unsplash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{marginRight: 8, padding: "0.5rem"}}
        />
        <Button onClick={searchImages}>Search</Button>

        <div style={{display: "flex", flexWrap: "wrap", marginTop: "1rem"}}>
          {images.map((img, index) => (
            <img
              id={`img-${index}`}
              key={index}
              src={`${img.urls.thumb}&w=300`}
              alt={img.alt_description}
              style={{width: 100, margin: 5, cursor: "grab"}}
              draggable={true}
            />
          ))}
        </div>
      </div>
    </Theme>
  );
};

export default App;
