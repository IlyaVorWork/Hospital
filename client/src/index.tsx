import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginPage from "./LoginPage";
import { Cookies, CookiesProvider } from "react-cookie";
import AssignPage from "./AssignPage";

const queryClient = new QueryClient();
const cookies = new Cookies();

const isLoggedIn = async () => {
  const accessToken = cookies.get("Access_token");
  if (!accessToken) {
    return redirect("/login");
  }
  return redirect("/assign");
};

const router = createBrowserRouter([
  {
    path: "/",
    loader: isLoggedIn,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/assign",
    element: <AssignPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
