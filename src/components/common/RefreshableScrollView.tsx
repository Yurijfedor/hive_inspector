import React, {ReactNode} from 'react';
import {RefreshControl, ScrollView, StyleProp, ViewStyle} from 'react-native';

type Props = {
  children: ReactNode;
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function RefreshableScrollView({
  children,
  refreshing,
  onRefresh,
  contentContainerStyle,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {children}
    </ScrollView>
  );
}
