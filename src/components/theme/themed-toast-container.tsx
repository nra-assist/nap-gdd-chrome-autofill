"use client";
import { ToastContainer, Zoom } from "react-toastify";
import { useTheme } from "./theme-context.tsx";

export default function ThemedToastContainer() {
  const { theme } = useTheme();

  return <ToastContainer limit={1} transition={Zoom} closeOnClick pauseOnHover theme={theme} />;
}
