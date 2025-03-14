import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IProps {
  useSafeArea?: boolean;
  onlyTopSafeArea?: boolean;
  onlyBottomSafeArea?: boolean;
  style?: StyleProp<ViewStyle>;
}

const StyledScreen: React.FC<React.PropsWithChildren<IProps>> = ({
  style,
  children,
  useSafeArea,
  onlyTopSafeArea,
  onlyBottomSafeArea,
}) => {
  // Если использовать SafeArea, а не useSafeAreaInsets, то отступы появляются с задержкой при 1 запуске
  const {left, top, right, bottom} = useSafeAreaInsets();
  const safeAreaPaddings = React.useMemo(() => {
    if (onlyTopSafeArea) {
      return {paddingTop: top};
    }
    if (onlyBottomSafeArea) {
      return {paddingBottom: bottom};
    }
    if (useSafeArea) {
      return {
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
        paddingBottom: bottom,
      };
    }
    return undefined;
  }, [
    useSafeArea,
    onlyTopSafeArea,
    onlyBottomSafeArea,
    left,
    top,
    right,
    bottom,
  ]);

  const containerStyle = React.useMemo(() => {
    return [{flex: 1}, safeAreaPaddings, style];
  }, [safeAreaPaddings, style]);
  return <View style={containerStyle}>{children}</View>;
};

export {StyledScreen};
