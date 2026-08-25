import userEvent from '@testing-library/user-event';

export type UserEvent = ReturnType<typeof userEvent.setup>;

/**
 * Create a userEvent instance for interaction testing.
 *
 * @example
 *   it('xxx', async () => {
 *       const user = setup();
 *       await user.click(btn);
 *   });
 */
export function setup(): UserEvent {
    return userEvent.setup();
}
