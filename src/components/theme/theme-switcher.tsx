import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // On mount, determine theme from localStorage or system preference
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const resolved = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <div className="size-11 rounded-full bg-gray-100 p-2 dark:bg-gray-900" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition duration-300 ease-in-out hover:bg-gray-300/90 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700/80"
    >
      {theme === "dark" ? (
        // Sun Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-4 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        // Moon Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 text-gray-800"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
