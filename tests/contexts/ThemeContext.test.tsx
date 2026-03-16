import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ThemeHarness() {
  const { darkMode, primaryColor, updateTheme, toggleDarkMode } = useTheme();

  return (
    <div>
      <p data-testid="dark-mode">{String(darkMode)}</p>
      <p data-testid="primary-color">{primaryColor}</p>
      <button
        type="button"
        onClick={() => updateTheme({ primaryColor: "#123456" })}>
        update-primary
      </button>
      <button type="button" onClick={toggleDarkMode}>
        toggle-dark
      </button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("restores only darkMode from localStorage", () => {
    localStorage.setItem(
      "whitelabel-theme",
      JSON.stringify({ darkMode: true, primaryColor: "#000000" }),
    );

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("dark-mode")).toHaveTextContent("true");
    // Branding should come from defaults, not from localStorage
    expect(screen.getByTestId("primary-color")).toHaveTextContent("#2563eb");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("persists only darkMode even after branding updates", () => {
    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText("update-primary"));

    const stored = JSON.parse(localStorage.getItem("whitelabel-theme") || "{}");
    expect(stored).toEqual({ darkMode: false });
  });

  it("toggles dark mode and updates storage", () => {
    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText("toggle-dark"));

    expect(screen.getByTestId("dark-mode")).toHaveTextContent("true");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const stored = JSON.parse(localStorage.getItem("whitelabel-theme") || "{}");
    expect(stored).toEqual({ darkMode: true });
  });
});
