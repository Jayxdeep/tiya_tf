import React from "react";
import ReactDOM from "react-dom/client";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import "@fontsource-variable/inter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App";
import "./styles.css";

self.MonacoEnvironment = {
  getWorker: () => new Worker(
    new URL("monaco-editor/editor/editor.worker.js", import.meta.url),
    { type: "module" },
  ),
};
loader.config({ monaco });

window.addEventListener("error", (event) => {
  console.error("Global window error:", event.error || event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

