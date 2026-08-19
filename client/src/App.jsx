import { useState } from 'react'
import {createBrowserRouter , RouterProvider} from "react-router-dom"
import './App.css'
import Home from './pages/Home.jsx'
import Layout from './components/Layout.jsx'
import RTIAssistant from './pages/RTIAssistant.jsx'
import RightsNavigator from './pages/RightsNavigator.jsx'
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
