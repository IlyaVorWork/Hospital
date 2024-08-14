import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginPage, { tokenClaims } from "./LoginPage";
import { Cookies, CookiesProvider } from "react-cookie";
import AppointmentPage from "./AppointmentPage";
import ProfilePage from "./ProfilePage";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "./NotFoundPage";
import CabinetPage from "./CabinetsPage";
import DoctorsPage from "./DoctorsPage";
import ManageAppointmentsPage from "./ManageAppointmentsPage";
import SchedulePage from "./SchedulePage";

const queryClient = new QueryClient();
const cookies = new Cookies();

const adminAllowedPaths = ["cabinets", "doctors", "schedule", "appointments"];
const patientAllowedPaths = ["makeAppointment", "profile"];

const isLoggedIn = async ({ request }: LoaderFunctionArgs) => {
  console.log("Проверка авторизации");
  const accessToken = cookies.get("Access_token");
  let destination = request.url.split("/").pop();
  if (!accessToken && destination === "login") {
    return null;
  }
  if (!accessToken) {
    return redirect("/login");
  }
  let claims: tokenClaims = jwtDecode(accessToken);
  if (claims.exp * 1000 < new Date().getTime()) {
    cookies.remove("Access_token");
    return redirect("/login");
  }
  switch (claims.role) {
    case "patient":
      if (
        patientAllowedPaths.findIndex((value) => value === destination) === -1
      ) {
        return redirect("/makeAppointment");
      }
      break;
    case "admin":
      if (
        adminAllowedPaths.findIndex((value) => value === destination) === -1
      ) {
        return redirect("/cabinets");
      }
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    loader: isLoggedIn,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
        loader: isLoggedIn,
      },
      {
        path: "makeAppointment",
        element: <AppointmentPage />,
        loader: isLoggedIn,
      },
      {
        path: "profile",
        element: <ProfilePage />,
        loader: isLoggedIn,
      },
      {
        path: "cabinets",
        element: <CabinetPage />,
        loader: isLoggedIn,
      },
      {
        path: "doctors",
        element: <DoctorsPage />,
        loader: isLoggedIn,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
        loader: isLoggedIn,
      },
      {
        path: "appointments",
        element: <ManageAppointmentsPage />,
        loader: isLoggedIn,
      },
    ],
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
