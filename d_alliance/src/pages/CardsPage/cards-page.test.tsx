import CardsPage from "./cards-page";
import {render, screen} from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

/**
 * Fake list of cards
 */
const cards = [
    { id: 1, name: "Goku", title: "Saiyan Raised on Earth" },
    { id: 2, name: "Vegeta", title: "Prince of All Saiyans" },
    { id: 3, name: "Gohan", title: "Hidden Power" }
];

/**
 * FFT-7: the cards page loads and the character list is displayed.
 */
describe("Cards Page Testing", () => {

    test("Testing if character list is displayed", async () => {
        (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url: string) => {
            if (url.includes("/categories")) {
                return { ok: true, json: async () => [] };
            }
            return {
                ok: true,
                json: async () => ({ data: cards, page: 1, pageSize: 100, total: 3, totalPages: 1 })
            };
        });

        render(<MemoryRouter><CardsPage/></MemoryRouter>);

        expect(await screen.findByText("Goku")).toBeInTheDocument();
        expect(screen.getByText("Vegeta")).toBeInTheDocument();
        expect(screen.getByText("Gohan")).toBeInTheDocument();
    });
});
