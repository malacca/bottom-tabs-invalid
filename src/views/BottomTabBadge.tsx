import * as React from 'react';
import {
  StyleProp,
  TextStyle,
  StyleSheet,
  Text,
} from 'react-native';

type Props = {
  showIcon: boolean;
  isDot: boolean;
  badge: string | number;
  badgeStyle?: StyleProp<TextStyle>;
  dotStyle?: StyleProp<TextStyle>;
};

export default function BottomTabBadge({
  showIcon = true,
  isDot,
  badge,
  badgeStyle,
  dotStyle,
}: Props) {
  const badgeElementStyle = [
    isDot ? styles.badgeDot : styles.badge,
    showIcon ? null : (isDot ? styles.badgeDotLabel : styles.badgeLabel),
    isDot ? dotStyle : badgeStyle,
    !isDot && badge===null ? styles.invisible : null
  ];
  return <Text style={badgeElementStyle}>{isDot ? null : badge}</Text>;
}

const styles = StyleSheet.create({
  badge:{
    fontSize:11,
    lineHeight:16,
    minWidth:16,
    paddingHorizontal:4,
    borderRadius: 16,
    textAlign:'center',
    backgroundColor:'red',
    color: 'white',
  },
  badgeDot:{
    width:9,
    height:9,
    borderRadius:9,
    backgroundColor:'red',
  },
  badgeLabel:{
    marginLeft:16,
  },
  badgeDotLabel:{
    marginLeft:8,
  },
  invisible: {
    opacity: 0
  }
});