import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { LocationsList } from "./pages/LocationsList.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LocationsList/>,
  },
]);
