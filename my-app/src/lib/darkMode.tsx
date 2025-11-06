"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      html.classList.add("dark");
      setIsDark(true);
    } else if (saved === "light") {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        html.classList.add("dark");
        setIsDark(true);
      }
    }
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const newValue = html.classList.contains("dark");
    setIsDark(newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-1">
      <Sun className="h-4 w-4 text-yellow-400" />
      <Switch
        checked={isDark}
        onCheckedChange={toggleDark}
        className="bg-zinc-200 dark:bg-zinc-700 data-[state=checked]:bg-blue-500 cursor-pointer"
      >
        <span className="sr-only">Toggle Dark Mode</span>
      </Switch>
      <Moon className="h-4 w-4 text-blue-400" />
    </div>
  );
}
