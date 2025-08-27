import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slice/theme";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

function ThemeBtn() {
  const theme = useSelector((state) => state.theme.darkMode); // Selector
  const dispatch = useDispatch();

  // Update Tailwind's `dark` class on <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="text-2xl">
      <button
        className={`cursor-pointer p-2 rounded-full shadow-lg transition-all duration-300 
          ${theme === "dark" ? "dark-btn" : "light-btn"}
        `}
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === "dark" ? (
          <MdOutlineLightMode className="text-dark-text" />
        ) : (
          <MdDarkMode className="text-light-text" />
        )}
      </button>
    </div>
  );
}

export default ThemeBtn;
