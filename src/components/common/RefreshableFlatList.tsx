import React from 'react';
import {FlatList, FlatListProps, RefreshControl} from 'react-native';

type Props<T> = FlatListProps<T> & {
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
};

export function RefreshableFlatList<T>({
  refreshing,
  onRefresh,
  ...props
}: Props<T>) {
  return (
    <FlatList
      {...props}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
