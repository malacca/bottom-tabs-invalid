import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  GestureResponderEvent,
  AccessibilityRole,
  AccessibilityStates,
} from 'react-native';
import { Link, Route, useTheme } from '@react-navigation/native';
import Color from 'color';

import BottomTabBadge from './BottomTabBadge';
import { BottomTabItemOptions } from '../types';

// android api level > 20 才支持 rippleColor
const supportRipple = Platform.OS === 'android' && Platform.Version > 20;

type Props = BottomTabItemOptions & {
  // 新增: 下标 index
  index: any;
  /**
   * Whether the tab is focused.
   */
  focused: boolean;
  /**
   * The route object which should be specified by the tab.
   */
  route: Route<string>;
  /**
   * URL to use for the link to the tab.
   */
  to?: string;
  /**
   * Whether the label should be aligned with the icon horizontally.
   */
  horizontal: boolean;
  /**
   * Function to execute on press in React Native.
   * On the web, this will use onClick.
   */
  onPress: (
    e: React.MouseEvent<HTMLElement, MouseEvent> | GestureResponderEvent
  ) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress: (e: GestureResponderEvent) => void;
};

function makeBottomTabBarItem({
  focused,
  route,
  tabBarLabel,
  tabBarIcon,
  to,
  tabBarButton,
  tabBarAccessibilityLabel:accessibilityLabel,
  tabBarTestID:testID,
  onPress,
  onLongPress,
  horizontal,
  activeTintColor: customActiveTintColor,
  inactiveTintColor: customInactiveTintColor,
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  showLabel = true,
  showIcon = true,
  allowFontScaling,
  labelStyle,
  tabStyle,
  // 新增
  index, 
  rippleColor,
  activeOpacity,
  badge,
  badgeStyle,
  dotStyle,
}: Props) {
  const { colors } = useTheme();

  const activeTintColor =
    customActiveTintColor === undefined
      ? colors.primary
      : customActiveTintColor;

  const inactiveTintColor =
    customInactiveTintColor === undefined
      ? Color(colors.text).mix(Color(colors.card), 0.5).hex()
      : customInactiveTintColor;
  
  const useIcon = showIcon === true && tabBarIcon !== undefined;

  // 读取 badge 角标
  let badgeElement = typeof badge === 'function' ? badge({index, route, showIcon:useIcon, badgeStyle, dotStyle}) : badge;
  if (badgeElement === undefined) {
    badgeElement = null;
  }
  if (badgeElement !== null) {
    if (!React.isValidElement(badgeElement)) {
      badgeElement = <BottomTabBadge
        showIcon={showIcon}
        isDot={badgeElement === 0}
        badge={badgeElement}
        badgeStyle={badgeStyle}
        dotStyle={dotStyle}
      />
    }
  }
  const itemBadge = badgeElement === null ? null : <View style={styles.badgeWrapper}>{badgeElement}</View>;

  // 读取 Label
  const renderLabel = ({ route, focused }: { route: Route<string>, focused: boolean }) => {
    const color = focused ? activeTintColor : inactiveTintColor;
    const tabBarLabelTxt = typeof tabBarLabel === 'function' 
      ? tabBarLabel({ index, route, focused, color, showIcon:useIcon, beside:horizontal })
      : tabBarLabel;
    const tabBarLabelNode = typeof tabBarLabelTxt === 'string' ?  (
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.label,
          { color },
          useIcon ? (horizontal ? styles.labelBeside : styles.labelBeneath) : styles.labelOnly,
          labelStyle,
        ]}
        allowFontScaling={allowFontScaling}
      >
        {tabBarLabel}
      </Animated.Text>
    ) : tabBarLabelTxt;
    return useIcon ? tabBarLabelNode : (<View>
      {tabBarLabelNode}
      {itemBadge}
    </View>);
  };

  // 读取 Icon 图标  
  const renderIcon = ({ focused }: { focused: boolean }) => {
    if (tabBarIcon === undefined) {
      return null;
    }
    const size = horizontal ? 20 : 24;
    const activeIcon = tabBarIcon({
      index,
      route,
      focused: true,
      size,
      color: activeTintColor,
      style: focused ? null : {position:"absolute", opacity:0},
    }) as React.ReactElement;
    const inactiveIcon = tabBarIcon({
      index,
      route,
      focused: false,
      size,
      color: inactiveTintColor,
      style: focused ? {position:"absolute", opacity:0} : null,
    }) as React.ReactElement;
    return (
      <View>
        {activeIcon}
        {inactiveIcon}
        {itemBadge}
      </View>
    );
  };

  // 读取 TabItem
  const scene = { route, focused };

  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const buttonProps = {
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityStates: (focused ? ['selected'] : []) as AccessibilityStates[],
  };

  const accessibilityRole = 'button' as AccessibilityRole;

  const buttonStyle = [
    styles.tab,
    { backgroundColor },
    horizontal || !useIcon || !showLabel ? styles.tabLandscape : styles.tabPortrait,
    tabStyle,
  ];

  const buttonChildren = (
    <React.Fragment>
      {useIcon ? renderIcon(scene) : null}
      {showLabel ? renderLabel(scene) : null}
    </React.Fragment>
  );
  
  if (tabBarButton) {
    return tabBarButton({
      ...buttonProps,
      children: buttonChildren,
      style: buttonStyle,
      onPress,
      to,
      accessibilityRole,
      rippleColor,
      activeOpacity,
    })
  }

  // web
  if (Platform.OS === 'web' && to) {
    // React Native Web doesn't forward `onClick` if we use `TouchableWithoutFeedback`.
    // We need to use `onClick` to be able to prevent default browser handling of links.
    return (
      <Link
        {...buttonProps}
        to={to}
        style={[styles.button, buttonStyle]}
        onPress={(e: any) => {
          if (
            !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
            (e.button == null || e.button === 0) // ignore everything but left clicks
          ) {
            e.preventDefault();
            onPress?.(e);
          }
        }}
      >
        {buttonChildren}
      </Link>
    );
  }

  const propsRippleColor = supportRipple && rippleColor ? rippleColor : null;
  const propsActiveOpacity = typeof activeOpacity === 'number' ? activeOpacity : 1;
  const nativeProps = {...buttonProps, accessibilityRole, onPress}

  if (!propsRippleColor && propsActiveOpacity === 1) {
    return (<TouchableWithoutFeedback {...nativeProps}>
      <View style={buttonStyle}>{buttonChildren}</View>
    </TouchableWithoutFeedback>);
  }

  if (propsRippleColor) {
    return (<TouchableNativeFeedback {...nativeProps} background={TouchableNativeFeedback.Ripple(
        propsRippleColor, true
      )}>
        <View style={buttonStyle}>{buttonChildren}</View>
    </TouchableNativeFeedback>);
  }

  return (<TouchableOpacity {...nativeProps} style={buttonStyle} activeOpacity={propsActiveOpacity}>
    {buttonChildren}
  </TouchableOpacity>);
}

export default function BottomTabBarItem(props:Props) {
  return makeBottomTabBarItem(props)as React.ReactElement;
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    display: 'flex',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeneath: {
    fontSize: 11,
    marginBottom: 4,
  },
  labelBeside: {
    fontSize: 12,
    marginLeft: 12,
    lineHeight: 14,
  },

  labelOnly:{
    fontSize:14,
  },
  badgeWrapper:{
    position: 'absolute',
    height:20,
    width:50,
    top:-6,
    right:-25,
    alignItems:"center",
    justifyContent:"center",
  },
});
