/**
 * Navigators
 */
export { default as createBottomTabNavigator } from './navigators/createBottomTabNavigator';

/**
 * Views
 */
export { default as BottomTabView } from './views/BottomTabView';
export { default as BottomTabBar } from './views/BottomTabBar';
export { default as BottomTabBadge } from './views/BottomTabBadge';

/**
 * Types
 */
export type {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabBarProps,
} from './types';
