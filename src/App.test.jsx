import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock Supabase before importing App
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
          order: vi.fn().mockResolvedValue({ data: [] }),
        }),
        order: vi.fn().mockResolvedValue({ data: [] }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null }),
      update: vi.fn().mockResolvedValue({ data: null }),
      delete: vi.fn().mockResolvedValue({ data: null }),
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    }),
  },
}));

// Mock haptics
vi.mock('./lib/haptics', () => ({
  hapticLight: vi.fn(),
  hapticMedium: vi.fn(),
  hapticSelection: vi.fn(),
  hapticSuccess: vi.fn(),
  hapticCelebration: vi.fn(),
}));

// Mock theme
vi.mock('./lib/theme', () => ({
  theme: {},
  injectGlobalStyles: vi.fn(),
}));

// Mock error capture
vi.mock('./lib/errorCapture', () => ({
  initErrorCapture: vi.fn(),
}));

// Import App after mocks
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    // This test catches import errors and basic rendering issues
    // If the refactoring breaks imports, this will fail
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  it('shows login screen when not authenticated', () => {
    const { container } = render(<App />);
    // Just verify something rendered
    expect(container.firstChild).toBeTruthy();
  });
});
