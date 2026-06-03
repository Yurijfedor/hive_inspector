import React from 'react';

import {Dimensions} from 'react-native';

import {LineChart} from 'react-native-chart-kit';

type Props = {
  chartData: any;
};

export const AnalyticsChart = ({chartData}: Props) => {
  const screenWidth = Dimensions.get('window').width;

  if (!chartData) {
    return null;
  }

  return (
    <LineChart
      data={chartData}
      width={screenWidth - 32}
      height={220}
      chartConfig={{
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
      }}
      bezier
    />
  );
};
