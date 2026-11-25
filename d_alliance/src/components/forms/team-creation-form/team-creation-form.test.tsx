import CreateTeam from "./team-creation-form";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import supabase from "@/lib/supabase-frontend";

vi.mock('@/lib/supabase-frontend', () => ({
    default: { from: vi.fn() }
}));

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'user-1' } })
}));

const insertMock = vi.fn();
const onClose = vi.fn();
const onCreated = vi.fn();

function renderCreateTeam() {
    render(<CreateTeam onClose={onClose} onCreated={onCreated}/>);
}

/**
 * Tests for the create team popup: UT-5 checks the team name length, UT-6 checks that a name
 * with a special character is accepted, FFT-11 checks that clicking create saves the team
 */
describe("Create Team Testing", () => {
    beforeEach(() => {
        insertMock.mockResolvedValue({ error: null });
        (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ insert: insertMock });
    });

    test("UT-5: team name over 15 characters is rejected", async () => {
        renderCreateTeam();

        // fireEvent skips the input's maxLength, userEvent.type would cut the name off at 15
        fireEvent.change(screen.getByLabelText("Team Name:"), { target: { value: "VeryLongTeamName" } });
        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(/Team name must be/);
        expect(insertMock).not.toHaveBeenCalled();
    });

    test("UT-6: team name with a special character is accepted", async () => {
        renderCreateTeam();

        await userEvent.type(screen.getByLabelText("Team Name:"), "Team#1");
        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => expect(insertMock).toHaveBeenCalledWith({ user_id: 'user-1', name: 'Team#1' }));
    });

    test("FFT-11: clicking create saves the team and closes the popup", async () => {
        renderCreateTeam();

        await userEvent.type(screen.getByLabelText("Team Name:"), "My Team");
        await userEvent.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => expect(onCreated).toHaveBeenCalled());
        expect(onClose).toHaveBeenCalled();
    });
});