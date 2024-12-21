import "./App.css";
import Hero from "./Pages/Hero/Hero.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Men from './Pages/Men/Men.jsx'
import { Routes, Route } from "react-router-dom";
import Women from './Pages/Women/Women.jsx'
import Product from "./components/Product/Product.jsx";
import CartItems from "./components/Cart/CartItems.jsx";
import LoginSignups from "./components/LoginSignup/userCrendentials/LoginSignup.jsx";
import OrderCheckout from "./components/orderComponent/OrderCheckout.jsx";
import OrderHistory from "./components/orderComponent/OrderHistory.jsx";
import Payment from "./components/orderComponent/Payment.jsx";
import Kids from "./Pages/Kids/Kids.jsx";

function App() {
  return (
    <div className="App">
     

      <NavBar />
      
      <Routes>
        <Route path="/" element={<Hero />}></Route>
        <Route path="/home" element={<Hero />}></Route>
        <Route path="/men" element={<Men/>}></Route>
        <Route path="/women" element={<Women/>}></Route>
        <Route path="/kids" element={<Kids/>}></Route>
        <Route path="/login" element={<LoginSignups/>}></Route>
        <Route path="/product" element={<Product/>}>
        <Route path=':productId' element={<Product/>}/></Route>
        <Route path='/order-checkout' element={<OrderCheckout/>}/>
        <Route path='/order-history' element={<OrderHistory/>}/>
        <Route path='/payment/:orderId' element={<Payment/>}/>
        <Route path="/cart" element={<CartItems/>} />
        
      </Routes>

      <Footer />
     
    </div>
  );
}

export default App;
