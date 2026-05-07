import React from 'react';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AppBackground} from '../components/AppBackground';
import {useAuth} from '../auth/AuthProvider';
import {withLayout} from './withLayout';

// screens
import {DevScreen} from '../screens/DevScreen';
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
  const {role} = useAuth();

  return (
    <AppBackground>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: 'transparent'},
          }}>
          {/* 🔥 ADMIN ONLY */}
          {role === 'admin' && (
            <Stack.Screen name="Dev" component={DevScreen} />
          )}

          {/* 🐝 ВСІ ІНШІ ЕКРАНИ */}
          <Stack.Screen name="Apiary" component={withLayout(ApiaryScreen)} />
          <Stack.Screen
            name="ApiaryCategory"
            component={withLayout(ApiaryCategoryScreen)}
          />
          <Stack.Screen name="Tasks" component={withLayout(TasksScreen)} />
          <Stack.Screen
            name="TasksList"
            component={withLayout(TasksListScreen)}
            options={{title: '📅 Мої задачі'}}
          />
          <Stack.Screen
            name="Today"
            component={withLayout(TodayScreen)}
            options={{title: '🐝 Сьогодні'}}
          />
          <Stack.Screen name="Hive" component={withLayout(HiveScreen)} />
          <Stack.Screen
            name="InspectionHistory"
            component={withLayout(InspectionHistoryScreen)}
          />
          <Stack.Screen name="Profile" component={withLayout(ProfileScreen)} />
          <Stack.Screen
            name="ManualInspection"
            component={withLayout(ManualInspectionScreen)}
            options={{title: '📝 Ручний огляд'}}
          />
          <Stack.Screen
            name="TaskCreate"
            component={withLayout(TaskCreateScreen)}
          />
          <Stack.Screen
            name="TaskEdit"
            component={withLayout(TaskEditScreen)}
          />
          <Stack.Screen
            name="HiveCreate"
            component={withLayout(HiveCreateScreen)}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppBackground>
  );
};
