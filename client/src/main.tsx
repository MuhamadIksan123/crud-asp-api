import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { RouterProvider } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { router } from "./app/routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
    </Provider>
  </StrictMode>,
);
