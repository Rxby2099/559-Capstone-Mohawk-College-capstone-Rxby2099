import { fetchTeamsAndCharacters } from "./teams";
import supabase from "@/lib/supabase-frontend";

vi.mock('@/lib/supabase-frontend', () => ({
    default: { from: vi.fn() }
}));

/**
 * mocks supabase returning one team row, and the cards api returning the matching cards
 */
function mockTeam(slots: number[]) {
    const rows = [{
        id: 'team-1',
        name: 'Test Team',
        team_members: slots.map(slot => ({ slot, card_id: slot + 1 }))
    }];

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: () => ({ order: () => Promise.resolve({ data: rows, error: null }) })
    });

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => slots.map(slot => ({ id: slot + 1, name: `Card ${slot + 1}`, title: 'Title' }))
    });
}

/**
 * Tests for team data: UT-4 checks a team can never hold more than 6 characters
 */
describe("Team size testing", () => {
    test("UT-4: a team always has exactly 6 slots", async () => {
        mockTeam([0, 1]);

        const teams = await fetchTeamsAndCharacters();

        expect(teams[0].members).toHaveLength(6);
    });

    test("UT-4: a 7th character is rejected", async () => {
        mockTeam([0, 1, 2, 3, 4, 5, 6]);

        const teams = await fetchTeamsAndCharacters();

        expect(teams[0].members).toHaveLength(6);
        expect(teams[0].members.some(m => m?.id === 7)).toBe(false);
    });
});