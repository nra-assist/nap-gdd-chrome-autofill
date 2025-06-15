import { Link, useLocation } from "react-router-dom";
import logoIcon from "../../assets/logo-icon.svg";

import { NAV_LINKS } from "./nav-links";
import ThemeSwitcher from "../theme/theme-switcher.tsx";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="min-w-[570px] bg-gray-100 px-2 py-2 dark:bg-gray-900">
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src={logoIcon}
            alt="Nra Assist"
            className="h-8 w-auto cursor-pointer transition duration-300 ease-in-out hover:brightness-90 dark:hover:brightness-110"
          />
        </Link>

        <div className="flex space-x-2">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={label}
                to={href}
                className={`rounded-md p-2 font-semibold transition duration-300 ${
                  isActive
                    ? "bg-gray-600/10 text-gray-900 dark:bg-gray-600/40 dark:text-white"
                    : "text-gray-700 hover:bg-gray-600/20 dark:text-gray-200"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
