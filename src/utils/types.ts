/**
 * Shared component sizing scale used across form controls.
 *
 * Several components (`Button`, `Input`, `Radio`, `Checkbox`) expose the same
 * `'small' | 'middle' | 'large'` scale. Each keeps its own public type name
 * (`ButtonSize`, `InputSize`, etc.) for API stability, but they are all aliases
 * of this single union so the literal set is declared once.
 *
 * Note: `Switch` deliberately does NOT use this — its `SwitchSize` is
 * `'small' | 'default'`, a different scale that mirrors upstream.
 */
export type ComponentSize = 'small' | 'middle' | 'large';
