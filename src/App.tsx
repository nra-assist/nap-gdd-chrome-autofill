import Navbar from "./components/navbar/navbar.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import HoldingsPage from "./pages/holdings-page.tsx";
import DividendsPage from "./pages/dividends-page.tsx";
import SellsPage from "./pages/sales-page.tsx";
import InterestPage from "./pages/interest-page.tsx";
import CashbackPage from "./pages/cashback-page.tsx";

export default function App() {
  return (
    <div className="bg-gray-200 dark:bg-gray-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/holdings" replace />} />
        <Route path="/holdings" element={<HoldingsPage />} />
        <Route path="/dividends" element={<DividendsPage />} />
        <Route path="/sells" element={<SellsPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/cashback" element={<CashbackPage />} />
      </Routes>
    </div>
  );
}
