import Navbar from "./components/Navbar";
import Dashboard from "./pages/DashBoard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import MarketPlace from "./pages/MarketPlace";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
