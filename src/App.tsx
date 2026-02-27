import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CustomPCBuilderPage from "./pages/CustomPCBuilderPage";
import DealsPage from "./pages/DealsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug?" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/custom-build" element={<CustomPCBuilderPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/support" element={<PlaceholderPage title="Support" message="Contact us: Phone, WhatsApp, Email. Need help choosing? We're here to help." />} />
          <Route path="/account" element={<PlaceholderPage title="Account" message="Login or register to manage orders and wishlist." />} />
          <Route path="/wishlist" element={<PlaceholderPage title="Wishlist" message="Save your favourite products here." />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping & Delivery" message="Delivery across India. Free shipping on orders above ₹50,000." />} />
          <Route path="/returns" element={<PlaceholderPage title="Returns & Replacement" message="Easy replacement policy within warranty terms." />} />
          <Route path="/warranty" element={<PlaceholderPage title="Warranty" message="Manufacturer warranty on all products. GST invoice available." />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" message="We respect your privacy and protect your data." />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Use" message="Terms and conditions for using Shivam Computer." />} />
          <Route path="/faq" element={<PlaceholderPage title="FAQ" message="Frequently asked questions about orders, shipping, and custom builds." />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}

export default App;
