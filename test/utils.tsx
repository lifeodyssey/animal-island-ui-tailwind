import userEvent from '@testing-library/user-event';

export type UserEvent = ReturnType<typeof userEvent.setup>;

export function setup(): UserEvent {
    return userEvent.setup();
}
