import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AuthProvider } from "./context/AuthContext";
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
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
<<<<<<< Updated upstream
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
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/address" element={<PlaceholderPage title="My Address" message="Manage your saved delivery addresses here." />} />
          <Route path="/account/orders" element={<PlaceholderPage title="My Orders" message="View, track, and return your past orders." />} />
          <Route path="/account/offers" element={<PlaceholderPage title="My Privilege Offers" message="Your exclusive discounts and active coupons." />} />
          <Route path="/account/devices" element={<PlaceholderPage title="My Devices & Plans" message="Register new devices or view protection plans." />} />
          <Route path="/account/requests" element={<PlaceholderPage title="My Service Requests" message="Track real-time service feedback and repairs." />} />
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
=======
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
>>>>>>> Stashed changes
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
