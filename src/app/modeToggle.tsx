import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function ModeToggle() {
  const [darkTheme, setDarkTheme] = useState(false);
  const { setTheme } = useTheme();

  function toggleDarkTheme() {
    setTheme(!darkTheme ? "dark" : "light");
    setDarkTheme(!darkTheme);
  }

  return (
    <Button
      className="ml-4"
      variant="outline"
      onClick={() => toggleDarkTheme()}
    >
      {darkTheme ? <Moon /> : <Sun />}
    </Button>
  );
}
