import Navbar from "./components/navbar/navbar.tsx";
import ThemedToastContainer from "./components/theme/themed-toast-container.tsx";
import DeclarationFillerPage from "./pages/declaration-filler-page.tsx";

export default function App() {
  return (
    <div className=" dark:bg-gray-900">
      <ThemedToastContainer />
      <Navbar />
      <DeclarationFillerPage />
    </div>
  );
}
