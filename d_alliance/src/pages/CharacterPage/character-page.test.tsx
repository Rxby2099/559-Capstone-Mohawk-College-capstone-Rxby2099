import CharacterPage from "./character-page";
import {render, screen} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from "react-router-dom";

// fake character to be tested
const character = {
    id: 1,
    name: "Goku",
    title: "Saiyan Raised on Earth",
    leaderSkill: "Raises ATK and DEF for all allies.",
    supers: [{ style: "Normal", kiNeeded: 3, name: "Kamehameha", description: "Fires a giant energy wave." }],
    passive: { name: "Warrior's Pride", description: "Raises ATK when attacking." },
    stats: {
        fiftyFive: { hp: 22000, atk: 21000, def: 11000 },
        rainbow: { hp: 25000, atk: 24000, def: 14000 }
    }
};

/**
 * mocks a render of the character page
 */
function renderCharacterPage() {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => character
    });

    render(
        <MemoryRouter initialEntries={["/characters/1"]}>
            <Routes>
                <Route path="/characters/:id" element={<CharacterPage/>} />
            </Routes>
        </MemoryRouter>
    );
}

/**
 * Tests for the character page: FFT-8 checks the character name, title, stats,and descriptions displayed,
 * FFT-9 checks that all character information is displayed on a single page
 */
describe("Character Page Testing", () => {
    test("Testing if name, title, stats and descriptions are displayed", async () => {
        renderCharacterPage();

        expect(await screen.findByText("Goku")).toBeInTheDocument();
        expect(screen.getByText("Saiyan Raised on Earth")).toBeInTheDocument();

        expect(screen.getByText("22000")).toBeInTheDocument();
        expect(screen.getByText("25000")).toBeInTheDocument();

        expect(screen.getByText("Raises ATK and DEF for all allies.")).toBeInTheDocument();
        expect(screen.getByText("Fires a giant energy wave.")).toBeInTheDocument();
        expect(screen.getByText("Raises ATK when attacking.")).toBeInTheDocument();
    });

    test("Testing if all character information is displayed on a single page", async () => {
        renderCharacterPage();
        await screen.findByText("Goku");

        expect(screen.getByText("--Leader Skill--")).toBeInTheDocument();
        expect(screen.getByText("--Stats--")).toBeInTheDocument();
        expect(screen.getByText(/--Super Attack: Kamehameha/)).toBeInTheDocument();
        expect(screen.getByText(/--Passive Skill: Warrior's Pride/)).toBeInTheDocument();
    });
});