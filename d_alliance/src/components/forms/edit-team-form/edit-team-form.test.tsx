import EditTeam from "./edit-team-form";
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import supabase from "@/lib/supabase-frontend";
import type { Team } from "@/lib/teams";

vi.mock('@/lib/supabase-frontend', () => ({
    default: { from: vi.fn() }
}));

const upsertMock = vi.fn();
const removeSlotEq = vi.fn();
const onClose = vi.fn();
const onChanged = vi.fn();

// fake team with Goku in slot 1 and the rest empty
const team: Team = {
    id: 'team-1',
    name: 'Test Team',
    members: [{ id: 1, name: 'Goku', title: 'Saiyan Raised on Earth' }, null, null, null, null, null]
};

// fake search results returned by the cards api
const cards = [
    { id: 2, name: 'Vegeta', title: 'Saiyan Prince' },
    { id: 1, name: 'Goku', title: 'Saiyan Raised on Earth' }
];

/**
 * mocks a render of the edit team popup with a search that returns the fake cards
 */
function renderEditTeam() {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ data: cards })
    });

    render(<EditTeam team={team} onClose={onClose} onChanged={onChanged}/>);
}

async function searchFor(text: string) {
    await userEvent.type(screen.getByLabelText("Search"), text);
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
}

/**
 * Tests for the edit team popup: FFT-10 checks picking a character for a slot,
 * UT-9 checks the saved team data stays consistent when editing
 */
describe("Edit Team Testing", () => {
    beforeEach(() => {
        upsertMock.mockResolvedValue({ error: null });
        removeSlotEq.mockResolvedValue({ error: null });
        onChanged.mockResolvedValue(undefined);

        (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
            upsert: upsertMock,
            delete: () => ({ eq: () => ({ eq: removeSlotEq }) })
        });
    });

    test("FFT-10: selecting a character for an empty slot saves it and refreshes the team", async () => {
        renderEditTeam();

        // first empty slot is slot index 1, since Goku is in slot 0
        await userEvent.click(screen.getAllByRole("button", { name: "Empty Slot" })[0]);
        await searchFor("Vegeta");
        await userEvent.click(await screen.findByRole("button", { name: "Saiyan Prince | Vegeta" }));

        expect(onChanged).toHaveBeenCalled();
    });

    test("UT-9: picking a character writes the right team, slot and card", async () => {
        renderEditTeam();

        await userEvent.click(screen.getAllByRole("button", { name: "Empty Slot" })[0]);
        await searchFor("Vegeta");
        await userEvent.click(await screen.findByRole("button", { name: "Saiyan Prince | Vegeta" }));

        expect(upsertMock).toHaveBeenCalledWith(
            { team_id: 'team-1', slot: 1, card_id: 2 },
            { onConflict: 'team_id,slot' }
        );
    });

    test("UT-9: a card already on the team cannot be added to another slot", async () => {
        renderEditTeam();

        await userEvent.click(screen.getAllByRole("button", { name: "Empty Slot" })[0]);
        await searchFor("Goku");

        const gokuButtons = await screen.findAllByRole("button", { name: "Saiyan Raised on Earth | Goku" });
        await userEvent.click(gokuButtons[gokuButtons.length - 1]);

        expect(await screen.findByRole("alert")).toHaveTextContent("That card is already on this team");
        expect(upsertMock).not.toHaveBeenCalled();
    });

    test("UT-9: removing a character deletes only the selected slot", async () => {
        renderEditTeam();

        // slot 0 (Goku) is selected by default
        await userEvent.click(screen.getByRole("button", { name: "Remove from slot 1" }));

        expect(removeSlotEq).toHaveBeenCalledWith('slot', 0);
        expect(onChanged).toHaveBeenCalled();
    });
});