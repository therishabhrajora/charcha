import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slice/theme";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";

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
    <div className="text-2xl cursor-pointer">
      <button className="cursor-pointer" onClick={() => dispatch(toggleTheme())}>
        {theme === "dark" ? (
            <MdOutlineLightMode />
        ) : (
            <MdDarkMode  />
        )}
      </button>
    </div>
  );
}

export default ThemeBtn;
