import { Link } from "react-router-dom";
import logoIconText from "../../assets/logo-icon-text.svg";

import ThemeSwitcher from "../theme/theme-switcher.tsx";

export default function Navbar() {
  return (
    <nav className="min-w-[570px] px-2 py-2 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img
            src={logoIconText}
            alt="Nra Assist"
            className="h-8 w-auto cursor-pointer transition duration-300 ease-in-out hover:brightness-90 dark:hover:brightness-110"
          />
        </Link>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
