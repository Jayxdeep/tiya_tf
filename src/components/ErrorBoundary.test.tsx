import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

const ThrowingComponent = () => {
    throw new Error("Simulated rendering failure");
};

describe("ErrorBoundary", () => {
    it("renders children when no error occurs", () => {
        render(
            <ErrorBoundary>
                <div>Everything is fine</div>
            </ErrorBoundary>
        );
        expect(screen.getByText("Everything is fine")).toBeInTheDocument();
    });

    it("catches rendering errors and displays diagnostic details", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("Simulated rendering failure")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Return to Home" })).toBeInTheDocument();
        spy.mockRestore();
    });
});
