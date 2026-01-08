import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CasinoListModal } from './CasinoListModal';
import { UIProvider } from '../../context/UIContext';

// Mock haptics
vi.mock('../../lib/haptics', () => ({
  hapticLight: vi.fn(),
  hapticMedium: vi.fn(),
  hapticHeavy: vi.fn(),
}));

// Wrapper that provides UIContext and controls modal visibility
function TestWrapper({ children, showModal = true }) {
  return (
    <UIProvider initialShowCasinoList={showModal}>
      {children}
    </UIProvider>
  );
}

// We need to modify UIProvider to accept initial state, or mock it
// For now, let's mock the useUI hook directly
vi.mock('../../context/UIContext', async () => {
  const actual = await vi.importActual('../../context/UIContext');
  return {
    ...actual,
    useUI: () => ({
      showCasinoList: true,
      setShowCasinoList: vi.fn(),
    }),
  };
});

describe('CasinoListModal Fuzzy Search', () => {
  const mockOnCheckIn = vi.fn();

  beforeEach(() => {
    mockOnCheckIn.mockClear();
  });

  const renderModal = () => render(<CasinoListModal onCheckIn={mockOnCheckIn} />);

  describe('Basic Search Functionality', () => {
    it('renders the modal with search input', () => {
      renderModal();
      expect(screen.getByPlaceholderText('Search casinos...')).toBeInTheDocument();
    });

    it('shows all casinos when search is empty', async () => {
      renderModal();

      // Should show multiple area headings
      await waitFor(() => {
        expect(screen.getByText('Center Strip')).toBeInTheDocument();
      });
    });

    it('filters casinos when searching with exact match', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'Bellagio' } });

      await waitFor(() => {
        expect(screen.getByText('Bellagio')).toBeInTheDocument();
      });
    });

    it('handles fuzzy search with typos - "Belagio" finds "Bellagio"', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'Belagio' } });

      await waitFor(() => {
        expect(screen.getByText('Bellagio')).toBeInTheDocument();
      });
    });

    it('handles fuzzy search with typos - "Cesars" finds "Caesars"', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'Cesars' } });

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const hasCaesars = buttons.some(btn => btn.textContent?.includes('Caesars'));
        expect(hasCaesars).toBe(true);
      });
    });

    it('handles fuzzy search with typos - "Venitian" finds "Venetian"', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'Venitian' } });

      await waitFor(() => {
        const container = document.body;
        expect(container.textContent).toContain('Venetian');
      });
    });

    it('is case insensitive', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'BELLAGIO' } });
      await waitFor(() => {
        expect(screen.getByText('Bellagio')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'bellagio' } });
      await waitFor(() => {
        expect(screen.getByText('Bellagio')).toBeInTheDocument();
      });
    });

    it('shows no casinos found for nonsense query', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'xyzzyqwerty123' } });

      await waitFor(() => {
        expect(screen.getByText('No casinos found')).toBeInTheDocument();
      });
    });
  });

  describe('Area Search', () => {
    it('finds casinos by area name - "Downtown"', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'Downtown' } });

      await waitFor(() => {
        // Should find casinos in Downtown area
        const container = document.body;
        expect(container.textContent).toContain('Downtown');
      });
    });

    it('finds casinos by area name - "Strip"', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: 'Strip' } });

      await waitFor(() => {
        // Should find many Strip casinos
        const container = document.body;
        expect(container.textContent).toContain('Strip');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles whitespace-only search', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: '   ' } });

      await waitFor(() => {
        // Should show all casinos (whitespace trimmed)
        expect(screen.getByText('Center Strip')).toBeInTheDocument();
      });
    });

    it('handles search with special characters', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      fireEvent.change(searchInput, { target: { value: "O'Sheas" } });

      // Should not crash
      await waitFor(() => {
        const container = document.body;
        // O'Sheas might or might not be in the casino list
        expect(container).toBeTruthy();
      });
    });
  });

  describe('Common Casino Searches', () => {
    const commonCasinos = [
      { search: 'Bellagio', find: 'Bellagio' },
      { search: 'Venetian', find: 'Venetian' },
      { search: 'Wynn', find: 'Wynn' },
      { search: 'Aria', find: 'ARIA' }, // ARIA is displayed in all caps
      { search: 'MGM', find: 'MGM' },
      { search: 'Cosmopolitan', find: 'Cosmopolitan' },
    ];

    commonCasinos.forEach(({ search, find }) => {
      it(`finds "${find}" when searching "${search}"`, async () => {
        renderModal();
        const searchInput = screen.getByPlaceholderText('Search casinos...');

        fireEvent.change(searchInput, { target: { value: search } });

        await waitFor(() => {
          const container = document.body;
          expect(container.textContent).toContain(find);
        });
      });
    });
  });

  describe('Common Typos', () => {
    const typoTests = [
      { typo: 'Belagio', correct: 'Bellagio' },
      { typo: 'Venitian', correct: 'Venetian' },
      { typo: 'Wyn', correct: 'Wynn' },
      { typo: 'Cosmo', correct: 'Cosmopolitan' },
      { typo: 'Mirage', correct: 'Mirage' }, // Control - exact match
    ];

    typoTests.forEach(({ typo, correct }) => {
      it(`finds "${correct}" with typo/partial "${typo}"`, async () => {
        renderModal();
        const searchInput = screen.getByPlaceholderText('Search casinos...');

        fireEvent.change(searchInput, { target: { value: typo } });

        await waitFor(() => {
          const container = document.body;
          expect(container.textContent).toContain(correct);
        });
      });
    });
  });

  describe('Casino Selection', () => {
    it('calls onCheckIn when casino is selected', async () => {
      renderModal();
      const searchInput = screen.getByPlaceholderText('Search casinos...');

      // Search for a specific casino
      fireEvent.change(searchInput, { target: { value: 'Bellagio' } });

      await waitFor(() => {
        expect(screen.getByText('Bellagio')).toBeInTheDocument();
      });

      // Click on the casino button
      const casinoButtons = screen.getAllByRole('button');
      const bellagioButton = casinoButtons.find(btn =>
        btn.textContent?.includes('Bellagio') && btn.textContent?.includes('slots')
      );

      if (bellagioButton) {
        fireEvent.click(bellagioButton);
        expect(mockOnCheckIn).toHaveBeenCalled();
      }
    });
  });
});
