import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { SlotsProvider, useSlots } from './SlotsContext';

// Test component that exposes SlotsContext values
function TestConsumer({ onContextReady }) {
  const context = useSlots();
  React.useEffect(() => {
    onContextReady(context);
  }, [context, onContextReady]);

  return (
    <div>
      <input
        data-testid="search"
        value={context.searchQuery}
        onChange={(e) => context.setSearchQuery(e.target.value)}
      />
      <p data-testid="count">{context.filteredMachines.length} machines</p>
      <ul data-testid="machines">
        {context.filteredMachines.slice(0, 10).map(m => (
          <li key={m.id}>{m.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe('SlotsContext Fuzzy Search', () => {
  let contextRef;

  const renderWithProvider = () => {
    contextRef = null;
    return render(
      <SlotsProvider>
        <TestConsumer onContextReady={(ctx) => { contextRef = ctx; }} />
      </SlotsProvider>
    );
  };

  describe('Basic Search Functionality', () => {
    it('shows all machines when search is empty', async () => {
      renderWithProvider();

      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBeGreaterThan(50); // Should have many machines
      });
    });

    it('filters machines when searching with exact match', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'Buffalo Gold' } });

      await waitFor(() => {
        const machineList = screen.getByTestId('machines');
        expect(machineList.textContent).toContain('Buffalo Gold');
      });
    });

    it('handles fuzzy search with typos - "Bufalo" finds "Buffalo"', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'Bufalo' } });

      await waitFor(() => {
        const machineList = screen.getByTestId('machines');
        expect(machineList.textContent).toContain('Buffalo');
      });
    });

    it('handles fuzzy search with typos - "Lighnting" finds "Lightning"', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'Lighnting' } });

      await waitFor(() => {
        const machineList = screen.getByTestId('machines');
        expect(machineList.textContent).toContain('Lightning');
      });
    });

    it('handles fuzzy search with typos - "Whell" finds "Wheel"', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'Whell' } });

      await waitFor(() => {
        const machineList = screen.getByTestId('machines');
        expect(machineList.textContent).toContain('Wheel');
      });
    });

    it('is case insensitive', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'BUFFALO' } });
      await waitFor(() => {
        expect(screen.getByTestId('machines').textContent).toContain('Buffalo');
      });

      fireEvent.change(searchInput, { target: { value: 'buffalo' } });
      await waitFor(() => {
        expect(screen.getByTestId('machines').textContent).toContain('Buffalo');
      });
    });

    it('shows zero results for nonsense query', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'xyzzyqwerty123' } });

      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBe(0);
      });
    });

    it('clears filter when search is cleared', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      // Get initial count
      let initialCount;
      await waitFor(() => {
        initialCount = parseInt(screen.getByTestId('count').textContent);
        expect(initialCount).toBeGreaterThan(50);
      });

      // Search for something specific that will have fewer results
      fireEvent.change(searchInput, { target: { value: 'xyzspecificmachine' } });
      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBe(0); // No matches
      });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBe(initialCount); // Should show all machines again
      });
    });
  });

  describe('ShortName Search', () => {
    it('finds machines by shortName', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      // Many machines have shortNames like "BG" for Buffalo Gold
      fireEvent.change(searchInput, { target: { value: 'MHB' } });

      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles single character search', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: 'B' } });

      // Single char may or may not match depending on minMatchCharLength
      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        // Should either show results or show 0 (both are valid behaviors)
        expect(count).toBeGreaterThanOrEqual(0);
      });
    });

    it('handles whitespace-only search', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      fireEvent.change(searchInput, { target: { value: '   ' } });

      await waitFor(() => {
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBeGreaterThan(50); // Should show all (whitespace trimmed)
      });
    });

    it('handles search with special characters', async () => {
      renderWithProvider();
      const searchInput = screen.getByTestId('search');

      // Search for something that might have special chars
      fireEvent.change(searchInput, { target: { value: "Dragon's" } });

      await waitFor(() => {
        // Should not crash
        const count = parseInt(screen.getByTestId('count').textContent);
        expect(count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Common Machine Searches', () => {
    const commonSearches = [
      { query: 'Buffalo', shouldFind: 'Buffalo' },
      { query: 'Lightning', shouldFind: 'Lightning' },
      { query: 'Dragon', shouldFind: 'Dragon' },
      { query: 'Wheel', shouldFind: 'Wheel' },
      { query: 'Fortune', shouldFind: 'Fortune' },
    ];

    commonSearches.forEach(({ query, shouldFind }) => {
      it(`finds "${shouldFind}" when searching "${query}"`, async () => {
        renderWithProvider();
        const searchInput = screen.getByTestId('search');

        fireEvent.change(searchInput, { target: { value: query } });

        await waitFor(() => {
          const machineList = screen.getByTestId('machines');
          expect(machineList.textContent).toContain(shouldFind);
        });
      });
    });
  });

  describe('Common Typos', () => {
    const typoTests = [
      { typo: 'Bufalo', correct: 'Buffalo' },
      { typo: 'Lightening', correct: 'Lightning' },
      { typo: 'Dragen', correct: 'Dragon' },
      { typo: 'Fotune', correct: 'Fortune' },
    ];

    typoTests.forEach(({ typo, correct }) => {
      it(`finds "${correct}" with typo "${typo}"`, async () => {
        renderWithProvider();
        const searchInput = screen.getByTestId('search');

        fireEvent.change(searchInput, { target: { value: typo } });

        await waitFor(() => {
          const machineList = screen.getByTestId('machines');
          expect(machineList.textContent).toContain(correct);
        });
      });
    });
  });
});
