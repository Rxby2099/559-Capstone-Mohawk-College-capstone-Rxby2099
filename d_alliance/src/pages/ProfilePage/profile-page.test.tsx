import ProfilePage from "./profile-page";
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import supabase from "@/lib/supabase-frontend";
import { MemoryRouter } from "react-router-dom";

vi.mock('@/lib/supabase-frontend', () => ({
    default: {
        from: vi.fn(),
        auth: {
            signOut: vi.fn(),
            onAuthStateChange: vi.fn()
        }
    }
}));

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'user-1' } })
}));

// Fake "users" row that the mocked supabase returns and updates
let profile = { username: "OldName", email: "email@email.com", created_at: "2026-01-15T00:00:00Z" };

/**
 * Tests for the profile page: FFT-5 checks the account details are displayed,
 * FFT-6 checks that updating the account details shows the new value.
 */
describe("Profile Page Testing", () => {

    beforeEach(() => {
        profile = { username: "OldName", email: "email@email.com", created_at: "2026-01-15T00:00:00Z" };

        (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: { ...profile }, error: null })
                })
            }),
            update: (values: object) => ({
                eq: () => {
                    profile = { ...profile, ...values };
                    return Promise.resolve({ error: null });
                }
            })
        }));
    });

    test("FFT-5: Account details are displayed", async () => {
        render(<MemoryRouter><ProfilePage/></MemoryRouter>);

        expect(await screen.findByText("OldName")).toBeInTheDocument();
        expect(screen.getByText("email@email.com")).toBeInTheDocument();
        expect(screen.getByText("Date Joined:")).toBeInTheDocument();
    });


    test("FFT-6: Account details updated successfully", async () => {
        render(<MemoryRouter><ProfilePage/></MemoryRouter>);
        await screen.findByText("OldName");

        await userEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
        await userEvent.type(screen.getByLabelText("New Username:"), "NewName");
        await userEvent.click(screen.getByTitle("subBtn"));

        expect(await screen.findByText("NewName")).toBeInTheDocument();
    });
});