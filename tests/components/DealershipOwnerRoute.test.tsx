import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DealershipOwnerRoute from "@/components/DealershipOwnerRoute";

const authMock = vi.hoisted(() => vi.fn());
const dealershipCtxMock = vi.hoisted(() => vi.fn());

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authMock(),
}));

vi.mock("@/contexts/DealershipContext", () => ({
  useDealershipCtx: () => dealershipCtxMock(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to} />
    ),
  };
});

describe("DealershipOwnerRoute", () => {
  beforeEach(() => {
    authMock.mockReset();
    dealershipCtxMock.mockReset();

    dealershipCtxMock.mockReturnValue({
      slug: "my-dealer",
      dealership: { ownerEmail: "owner@example.com" },
    });
  });

  it("renders nothing while auth is loading", () => {
    authMock.mockReturnValue({ user: null, loading: true });

    const { container } = render(
      <DealershipOwnerRoute>
        <div>Protected</div>
      </DealershipOwnerRoute>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("redirects unauthenticated users to login", () => {
    authMock.mockReturnValue({ user: null, loading: false });

    render(
      <DealershipOwnerRoute>
        <div>Protected</div>
      </DealershipOwnerRoute>,
    );

    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/login");
  });

  it("redirects non-owners to dealership storefront", () => {
    authMock.mockReturnValue({
      loading: false,
      user: { email: "different@example.com" },
    });

    render(
      <DealershipOwnerRoute>
        <div>Protected</div>
      </DealershipOwnerRoute>,
    );

    expect(screen.getByTestId("navigate")).toHaveAttribute(
      "data-to",
      "/d/my-dealer",
    );
  });

  it("renders children for the owner (case-insensitive email check)", () => {
    authMock.mockReturnValue({
      loading: false,
      user: { email: "OWNER@EXAMPLE.COM" },
    });

    render(
      <DealershipOwnerRoute>
        <div>Protected</div>
      </DealershipOwnerRoute>,
    );

    expect(screen.getByText("Protected")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });
});
