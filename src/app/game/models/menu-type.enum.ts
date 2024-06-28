export const MENU_TYPE = {
  TIME: 'TIME',
  EVENT: 'EVENT',
} as const;

export type TMenuType = keyof typeof MENU_TYPE;
