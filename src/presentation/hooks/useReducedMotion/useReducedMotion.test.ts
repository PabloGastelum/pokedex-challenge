import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  const remove = jest.fn();
  let listener: (value: boolean) => void;

  beforeEach(() => {
    remove.mockClear();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_, handler) => {
      listener = handler as (value: boolean) => void;
      return { remove } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>;
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('lee la preferencia del sistema', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    const { result } = await renderHook(() => useReducedMotion());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it('reacciona cuando la preferencia cambia', async () => {
    const { result } = await renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    await act(async () => listener(true));

    expect(result.current).toBe(true);
  });

  it('ignora la respuesta del sistema si llega después de desmontarse', async () => {
    let resolve: (value: boolean) => void = () => undefined;
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockReturnValue(
      new Promise((res) => {
        resolve = res;
      }),
    );
    const { result, unmount } = await renderHook(() => useReducedMotion());

    await unmount();
    await act(async () => resolve(true));

    expect(result.current).toBe(false);
  });

  it('cancela la suscripción al desmontarse', async () => {
    const { unmount } = await renderHook(() => useReducedMotion());

    await unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
