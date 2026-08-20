import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from './pages/Home.jsx'
import Layout from './components/Layout.jsx'
import RTIAssistant from './pages/RTIAssistant.jsx'
import RightsNavigator from './pages/RightsNavigator.jsx'
import SchemeAssistant from './pages/SchemeAssistant.jsx' // Naya import

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "rti",
        element: <RTIAssistant />,
      },
      {
        path: "rights",
        element: <RightsNavigator />,
      },
      {
        path: "schemes", // Naya Route
        element: <SchemeAssistant />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App