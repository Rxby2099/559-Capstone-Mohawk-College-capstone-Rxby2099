import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom';
import { beforeAll, beforeEach, afterEach, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeAll(() => {
    class ResizeObserverMock {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

});

beforeEach(() => {
    mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({
            message: "No mock set up needed for this test"
        })
    });
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks()
});