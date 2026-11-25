import AdminRouteLock from "./AdminRouteLock";
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

vi.mock('@/context/AuthContext', () => ({
    useAuth: vi.fn()
}));

/**
 * mocks a visit to the admin page with the given login state
 */
function visitAdminPage(auth: { session: object | null; loading: boolean; isAdmin: boolean }) {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(auth);

    render(
        <MemoryRouter initialEntries={["/admin/characters/new"]}>
            <Routes>
                <Route path="/admin/characters/new" element={<AdminRouteLock><p>Admin Page</p></AdminRouteLock>} />
                <Route path="/dashboard" element={<p>Dashboard Page</p>} />
                <Route path="/login" element={<p>Login Page</p>} />
            </Routes>
        </MemoryRouter>
    );
}

/**
 * Tests for admin only access: SET-4 checks a non admin cannot open the admin page
 */
describe("Admin Route Lock Testing", () => {
    test("SET-4: non-admin user is sent to the dashboard", () => {
        visitAdminPage({ session: { user: { id: 'user-1' } }, loading: false, isAdmin: false });

        expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
        expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
    });

    test("SET-4: logged out user is sent to the login page", () => {
        visitAdminPage({ session: null, loading: false, isAdmin: false });

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
    });

    test("admin user can see the admin page", () => {
        visitAdminPage({ session: { user: { id: 'admin-1' } }, loading: false, isAdmin: true });

        expect(screen.getByText("Admin Page")).toBeInTheDocument();
    });
});