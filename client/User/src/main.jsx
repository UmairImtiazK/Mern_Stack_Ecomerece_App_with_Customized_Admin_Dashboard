import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import ShopCategoryComp from "../src/context/ProductContext.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
      <AuthProvider>
      <ShopCategoryComp>
          <App />
      </ShopCategoryComp>
         </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)