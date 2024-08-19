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
import { Cookies, CookiesProvider } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "./pages/NotFoundPage";
import CabinetPage from "./pages/CabinetsPage";
import DoctorsPage from "./pages/DoctorsPage";
import ManageAppointmentsPage from "./pages/ManageAppointmentsPage";
import SchedulePage from "./pages/SchedulePage";
import { TokenClaims } from "./types/Auth.types";
import LoginPage from "./pages/LoginPage";
import AppointmentPage from "./pages/AppointmentPage";
import ProfilePage from "./pages/ProfilePage";
import PatientsPage from "./pages/PatientsPage";

const queryClient = new QueryClient();
const cookies = new Cookies();

const adminAllowedPaths = [
  "patients",
  "cabinets",
  "doctors",
  "schedule",
  "appointments",
];
const patientAllowedPaths = ["makeAppointment", "profile"];

const isLoggedIn = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = cookies.get("Access_token");
  let destination = request.url.split("/").pop();
  if (!accessToken && destination === "login") {
    return null;
  }
  if (!accessToken) {
    return redirect("/login");
  }
  let claims: TokenClaims = jwtDecode(accessToken);
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
        path: "patients",
        element: <PatientsPage />,
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
