import React from "react";
import "./index.css";

import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "./routes/App";
import { CreatePost } from "./routes/CreatePost";
import { PostDetails } from "./components/PostDetails";
import { Login } from "./routes/Login";
import { Root } from "./routes/Root";
import { Register } from "./routes/Register";

const router = createBrowserRouter(
  [
    {
      element: <Root />,
      children: [
        {
          path: "/",
          element: <App />,
        },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {
          path: "/create-post",
          element: <CreatePost />,
        },
        {
          path: "/posts/:post_id",
          element: <PostDetails />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
