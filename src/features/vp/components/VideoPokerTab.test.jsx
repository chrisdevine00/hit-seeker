import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoPokerTab } from './VideoPokerTab';

// Mock haptics
vi.mock('../../../lib/haptics', () => ({
  hapticLight: vi.fn(),
  hapticMedium: vi.fn(),
  hapticHeavy: vi.fn(),
}));

describe('VideoPokerTab Fuzzy Search', () => {
  const renderTab = () => render(<VideoPokerTab onSpot={vi.fn()} />);

  describe('Basic Search Functionality', () => {
    it('shows all games when search is empty', async () => {
      renderTab();
      // Should show game count > 80 (we have 88 VP games)
      await waitFor(() => {
        expect(screen.getByText(/\d+ games?/)).toBeInTheDocument();
      });
      const countText = screen.getByText(/\d+ games?/).textContent;
      const count = parseInt(countText);
      expect(count).toBeGreaterThan(80);
    });

    it('filters games when searching with exact match', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'Jacks or Better' } });

      // Should find Jacks or Better
      await waitFor(() => {
        expect(screen.getByText('Jacks or Better')).toBeInTheDocument();
      });
    });

    it('handles fuzzy search with typos - "Dueces" finds "Deuces"', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'Dueces' } });

      // Should find Deuces Wild despite typo
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
      });
    });

    it('handles fuzzy search with typos - "jaks" finds "Jacks"', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'jaks' } });

      // Should find Jacks or Better despite typo
      await waitFor(() => {
        expect(screen.getByText('Jacks or Better')).toBeInTheDocument();
      });
    });

    it('handles fuzzy search with typos - "bonsu" finds "Bonus"', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'bonsu' } });

      // Should find Bonus Poker despite typo
      await waitFor(() => {
        expect(screen.getByText('Bonus Poker')).toBeInTheDocument();
      });
    });

    it('handles partial matches - "ddb" finds Double Double Bonus', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'ddb' } });

      // DDB is the shortName for Double Double Bonus
      await waitFor(() => {
        expect(screen.getByText('Double Double Bonus')).toBeInTheDocument();
      });
    });

    it('is case insensitive', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'DEUCES WILD' } });
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: 'deuces wild' } });
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
      });
    });

    it('shows no results message for nonsense query', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'xyzzyqwerty123' } });

      await waitFor(() => {
        expect(screen.getByText('No games found')).toBeInTheDocument();
      });
    });

    it('clears search when X button is clicked', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'Deuces' } });
      expect(searchInput.value).toBe('Deuces');

      // Find and click the clear button
      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(searchInput.value).toBe('');
      });
    });
  });

  describe('Search Ignores Category Filter', () => {
    it('finds Deuces Wild when searching "Deuces" regardless of category', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      // Select "Standard" category (Deuces Wild is in 'wild' category, not 'standard')
      const categoryButtons = screen.getAllByRole('button');
      const standardButton = categoryButtons.find(btn => btn.textContent?.includes('Standard'));
      expect(standardButton).toBeTruthy();
      fireEvent.click(standardButton);

      // Verify category filter is applied (Deuces Wild shouldn't be visible)
      await waitFor(() => {
        expect(screen.queryByText('Deuces Wild')).not.toBeInTheDocument();
      });

      // Now search for Deuces
      fireEvent.change(searchInput, { target: { value: 'Deuces' } });

      // Should find Deuces Wild even though Standard category was selected
      // because search ignores category filter
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
      });
    });

    it('finds games from multiple categories when searching', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      // Search for "bonus" which appears in multiple categories
      fireEvent.change(searchInput, { target: { value: 'bonus' } });

      // Should find games from different categories
      await waitFor(() => {
        expect(screen.getByText('Bonus Poker')).toBeInTheDocument();
        expect(screen.getByText('Double Bonus')).toBeInTheDocument();
      });
    });

    it('re-applies category filter when search is cleared', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      // Select Wild category
      const wildButton = screen.getByRole('button', { name: /^Wild/ });
      fireEvent.click(wildButton);

      // Wait for category filter to apply
      await waitFor(() => {
        expect(screen.queryByText('Jacks or Better')).not.toBeInTheDocument();
      });

      // Search for Jacks
      fireEvent.change(searchInput, { target: { value: 'Jacks' } });

      // Now Jacks or Better should appear (search ignores category)
      await waitFor(() => {
        expect(screen.getByText('Jacks or Better')).toBeInTheDocument();
      });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });

      // Jacks or Better should be hidden again (category filter re-applied)
      await waitFor(() => {
        expect(screen.queryByText('Jacks or Better')).not.toBeInTheDocument();
      });
    });
  });

  describe('Category Filter Without Search', () => {
    it('filters by category when no search query', async () => {
      renderTab();

      // Click on "Wild" category
      const wildButton = screen.getByRole('button', { name: /^Wild/ });
      fireEvent.click(wildButton);

      // Should show Deuces Wild (in wild category)
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
      });

      // Should NOT show Jacks or Better (in jacks category)
      expect(screen.queryByText('Jacks or Better')).not.toBeInTheDocument();
    });

    it('shows all games when "All" category is selected', async () => {
      renderTab();

      // First select a specific category
      const wildButton = screen.getByRole('button', { name: /^Wild/ });
      fireEvent.click(wildButton);

      // Then select All
      const allButton = screen.getByRole('button', { name: /^All/ });
      fireEvent.click(allButton);

      // Should show games from multiple categories
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
        expect(screen.getByText('Jacks or Better')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles single character search (below minMatchCharLength)', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      // Single char triggers search but minMatchCharLength: 2 means no matches
      fireEvent.change(searchInput, { target: { value: 'J' } });

      // Should show "No games found" since single char doesn't meet minMatchCharLength
      await waitFor(() => {
        expect(screen.getByText('No games found')).toBeInTheDocument();
      });
    });

    it('handles whitespace-only search', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: '   ' } });

      // Should show all games (whitespace is trimmed)
      await waitFor(() => {
        const countText = screen.getByText(/\d+ games?/).textContent;
        const count = parseInt(countText);
        expect(count).toBeGreaterThan(80);
      });
    });

    it('handles search with special characters', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      // Search for "Faces n' Deuces" which has apostrophe
      fireEvent.change(searchInput, { target: { value: "Faces n' Deuces" } });

      await waitFor(() => {
        expect(screen.getByText("Faces n' Deuces")).toBeInTheDocument();
      });
    });
  });

  describe('All Deuces Games Found', () => {
    it('finds all Deuces games when searching "Deuces"', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'Deuces' } });

      // All these games should be found
      const expectedGames = [
        'Deuces Wild',
        'Loose Deuces',
        'Double Deuces',
        'Bonus Deuces Wild',
        'Double Bonus Deuces Wild',
        'Super Bonus Deuces Wild',
        'Deuces and Joker Wild',
        "Faces n' Deuces",
      ];

      await waitFor(() => {
        expectedGames.forEach(game => {
          expect(screen.getByText(game)).toBeInTheDocument();
        });
      });
    });

    it('finds all Deuces games with typo "Dueces"', async () => {
      renderTab();
      const searchInput = screen.getByPlaceholderText('Search games...');

      fireEvent.change(searchInput, { target: { value: 'Dueces' } });

      // Should find at least Deuces Wild with the typo
      await waitFor(() => {
        expect(screen.getByText('Deuces Wild')).toBeInTheDocument();
        expect(screen.getByText('Loose Deuces')).toBeInTheDocument();
      });
    });
  });
});
