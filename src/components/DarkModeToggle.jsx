import { useTheme } from "../context/ThemeContext";

export default function DarkModeToggle({ mobile = false }) {
  const { dark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      aria-label="Toggle dark mode"
      className={`
        flex items-center gap-2 transition-colors
        ${mobile
          ? "w-full text-sm text-gray-600 dark:text-gray-300 py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          : "w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 items-center justify-center"
        }
      `}
    >
      {dark ? (
        <>
          <span className="text-lg">☀️</span>
          {mobile && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <span className="text-lg">🌙</span>
          {mobile && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
}