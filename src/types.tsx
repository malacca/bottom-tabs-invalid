import * as React from 'react';
import {
  TouchableWithoutFeedbackProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import {
  Route,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  Descriptor,
  TabNavigationState,
  TabActionHelpers,
  RouteProp,
} from '@react-navigation/native';

export type BottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
  /**
   * Event which fires on long press on the tab in the tab bar.
   */
  tabLongPress: { data: undefined };
};

export type BottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = {
  navigation: BottomTabNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type LabelPosition = 'beside-icon' | 'below-icon';

export type BottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  BottomTabNavigationEventMap
>;

export type BottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  BottomTabNavigationOptions,
  BottomTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type BottomTabDescriptor = Descriptor<
  ParamListBase,
  string,
  TabNavigationState,
  BottomTabNavigationOptions
>;

export type BottomTabDescriptorMap = {
  [key: string]: BottomTabDescriptor;
};

export type BottomTabNavigationConfig = {
  /**
   * Whether the screens should render the first time they are accessed. Defaults to `true`.
   * Set it to `false` if you want to render all screens on initial render.
   */
  lazy?: boolean;
  /**
   * Function that returns a React element to display as the tab bar.
   */
  tabBar?: (props: BottomTabBarProps) => React.ReactNode;
  
  // 自定义的插入 Tab, 可插入多个
  injectTabs?: Array<BottomTabInjectTabConfig>;
};

export type BottomTabInjectTabConfig = {
  /**
   * 新增: 自定义 Button 插入位置
   */
  index?: number;
  /**
   * 内部使用该字段
   */
  inject?: boolean;
  /**
   * 新增: 自定义 Button 组件
   */
  tabButton?: (props: {beside:boolean}) => React.ReactNode;
};

export type BottomTabStyle = ViewStyle & {
  /**
   * 新增: TabBar 支持一个非规则的 style
   */
  landHeight?: number | string;
};

export type BottomTabBarIconOptions = {
  /**
   * Color for the icon and label in the active tab.
   */
  activeTintColor?: string;
  /**
   * Color for the icon and label in the inactive tabs.
   */
  inactiveTintColor?: string;
  /**
   * A function that given { focused: boolean, color: string } returns a React.Node to display in the tab bar.
   */
  tabBarIcon?: (props: {
    index: number;
    route: Route<string>;
    focused: boolean;
    color: string;
    size: number;
    style?: StyleProp<ViewStyle>;
  }) => React.ReactNode;
}

export type BottomTabItemOptions = BottomTabBarIconOptions & {
  /**
   * Background color for the active tab.
   */
  activeBackgroundColor?: string;
  /**
   * background color for the inactive tabs.
   */
  inactiveBackgroundColor?: string;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
  /**
   * Whether the tab label should be visible. Defaults to `true`.
   */
  showLabel?: boolean;
  /**
   * Whether the tab icon should be visible. Defaults to `true`.
   */
  showIcon?: boolean;
  /**
   * Style object for the tab label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the tab container.
   */
  tabStyle?: StyleProp<ViewStyle>;

  /**
   * Title string of a tab displayed in the tab bar
   * or a function that given { focused: boolean, color: string } returns a React.Node to display in tab bar.
   * When undefined, scene title is used. To hide, see tabBarOptions.showLabel in the previous section.
   */
  tabBarLabel?: | string | ((props: { 
      index:number; 
      route: Route<string>; 
      focused: boolean; 
      color: string;
      showIcon: boolean;
      beside: boolean;
     }) => string | React.ReactNode);
  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   * It's recommended to set this if you don't have a label for the tab.
   */
  tabBarAccessibilityLabel?: string;
  /**
   * ID to locate this tab button in tests.
   */
  tabBarTestID?: string;
  /**
   * Function which returns a React element to render as the tab bar button.
   * Renders `TouchableWithoutFeedback` by default.
   */
  tabBarButton?: (props: BottomTabBarButtonProps) => React.ReactNode;

  /**
   * 新增: Style object for the tab text badge.
   */
  badgeStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the tab dot badge.
   */
  dotStyle?: StyleProp<TextStyle>;
  /**
   * 新增: 水波纹颜色
   */
  rippleColor?: string;
  /**
   * 新增: 按下透明度
   */
  activeOpacity?: number;
  /**
  * 新增: 角标
  */
  badge?: number | string | React.ReactNode | ((props: {
    index:number; 
    route: Route<string>;
    showIcon: boolean;
    badgeStyle: StyleProp<TextStyle>;
    dotStyle: StyleProp<TextStyle>;
  }) => number | string | React.ReactNode);
}

export type BottomTabNavigationOptions = BottomTabItemOptions & {
  /**
   * Whether the tab bar gets hidden when the keyboard is shown. Defaults to `false`.
   */
  keyboardHidesTabBar?: boolean;
  /**
   * Whether the label is rendered below the icon or beside the icon.
   * By default, in `vertical` orinetation, label is rendered below and in `horizontal` orientation, it's rendered beside.
   */
  labelPosition?: LabelPosition;
  /**
   * Whether the label position should adapt to the orientation.
   */
  adaptive?: boolean;
  /**
   * Safe area insets for the tab bar. This is used to avoid elements like the navigation bar on Android and bottom safe area on iOS.
   * By default, the device's safe area insets are automatically detected. You can override the behavior with this option.
   */
  safeAreaInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /**
   * Style object for the tab bar container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Title text for the screen.
   */
  title?: string;
  /**
   * Boolean indicating whether the tab bar is visible when this screen is active.
   */
  tabBarVisible?: boolean;
  /**
   * Whether this screen should be unmounted when navigating away from it.
   * Defaults to `false`.
   */
  unmountOnBlur?: boolean;

  /**
   * 新增
   */
  tabBarTransparent?: boolean;
  tabBarBackground?: (props: {
    style: StyleProp<ViewStyle>;
  }) => React.ReactNode;
};

export type BottomTabBarProps = {
  state: TabNavigationState;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  injectTabs?: Array<BottomTabInjectTabConfig>;
};

export type BottomTabBarButtonProps = Omit<
  TouchableWithoutFeedbackProps,
  'onPress'
> & {
  to?: string;
  children: React.ReactNode;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
  /**
   * 新增: 水波纹颜色
   */
  rippleColor?: string;
  /**
   * 新增: 按下透明度
   */
  activeOpacity?: number;
};
