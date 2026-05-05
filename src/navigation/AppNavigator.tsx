import React from 'react';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AppBackground} from '../components/AppBackground';
// import {DevScreen} from '../screens/DevScreen';
import {TasksScreen} from '../screens/TasksScreen';
import {TasksListScreen} from '../screens/TasksListScreen';
import {TodayScreen} from '../screens/TodayScreen';
import {HiveScreen} from '../screens/HiveScreen';
import {InspectionHistoryScreen} from '../screens/InspectionHistoryScreen';
import {ApiaryScreen} from '../screens/ApiaryScreen';
import {ApiaryCategoryScreen} from '../screens/ApiaryCategoryScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {ManualInspectionScreen} from '../screens/ManualInspectionScreen';
import {TaskCreateScreen} from '../screens/TaskCreateScreen';
import {TaskEditScreen} from '../screens/TaskEditScreen';
import {HiveCreateScreen} from '../screens/HiveCreateScreen';

enableScreens(true);
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <AppBackground>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {backgroundColor: 'transparent'},
          }}>
          {/* <Stack.Screen name="Dev" component={DevScreen} /> */}
          <Stack.Screen name="Apiary" component={ApiaryScreen} />
          <Stack.Screen
            name="ApiaryCategory"
            component={ApiaryCategoryScreen}
          />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen
            name="TasksList"
            component={TasksListScreen}
            options={{title: '📅 Мої задачі'}}
          />
          <Stack.Screen
            name="Today"
            component={TodayScreen}
            options={{title: '🐝 Сьогодні'}}
          />
          <Stack.Screen name="Hive" component={HiveScreen} />
          <Stack.Screen
            name="InspectionHistory"
            component={InspectionHistoryScreen}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen
            name="ManualInspection"
            component={ManualInspectionScreen}
            options={{title: '📝 Ручний огляд'}}
          />
          <Stack.Screen name="TaskCreate" component={TaskCreateScreen} />
          <Stack.Screen name="TaskEdit" component={TaskEditScreen} />
          <Stack.Screen name="HiveCreate" component={HiveCreateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppBackground>
  );
};
