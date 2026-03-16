import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "@/pages/Landing";

const authMock = vi.hoisted(() => vi.fn());
const themeMock = vi.hoisted(() => vi.fn());
const myDealershipsMock = vi.hoisted(() => vi.fn());
const registerDealershipMock = vi.hoisted(() => vi.fn());

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authMock(),
}));

vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => themeMock(),
}));

vi.mock("@/hooks/use-dealership", () => ({
  useMyDealerships: (...args: unknown[]) => myDealershipsMock(...args),
  useRegisterDealership: () => registerDealershipMock(),
}));

describe("Landing", () => {
  beforeEach(() => {
    authMock.mockReset();
    themeMock.mockReset();
    myDealershipsMock.mockReset();
    registerDealershipMock.mockReset();

    authMock.mockReturnValue({ user: null, loading: false });
    themeMock.mockReturnValue({
      darkMode: false,
      toggleDarkMode: vi.fn(),
    });
    myDealershipsMock.mockReturnValue({ data: [] });
    registerDealershipMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("toggles theme from landing navbar", () => {
    const toggleDarkMode = vi.fn();
    themeMock.mockReturnValue({ darkMode: false, toggleDarkMode });

    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTitle("Switch to dark mode"));
    expect(toggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it("shows sign in button when logged out", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.queryByText("My Account")).not.toBeInTheDocument();
  });

  it("shows account actions when logged in", () => {
    authMock.mockReturnValue({
      user: { email: "owner@example.com" },
      loading: false,
    });

    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("My Account").length).toBeGreaterThan(0);
    expect(screen.getByText("Register Dealership")).toBeInTheDocument();
  });
});
