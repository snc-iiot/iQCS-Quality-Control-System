import App from "@/app";
import ReactDOM from "react-dom/client";
import "@/styles/globals.css";
import "@/styles/custom.css";
import AppProviders from "@/lib/app-providers.tsx";
import { Provider } from "jotai";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider>
    <AppProviders>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </AppProviders>
  </Provider>
);
