import { useState } from 'react'
import {createBrowserRouter , RouterProvider} from "react-router-dom"
import './App.css'
import Home from './pages/Home.jsx'
import Layout from './components/Layout.jsx'
import RTIAssistant from './pages/RTIAssistant.jsx'
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
    ],
  },
]);

function App() {
  return (
   <>
   <RouterProvider router={router}/>
   </>
  )
}

export default App
