import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const backgroundColor = '#1F232E';

const tabBarOptions = {
  activeBackgroundColor: backgroundColor,
  inactiveBackgroundColor: backgroundColor,
  style: {
    height: 64,
    paddingBottom: 4,
    backgroundColor,
  },
};

const BottomTabNavigator = () => (
  <BottomTab.Navigator
    initialRouteName={INITIAL_ROUTE_NAME}
    tabBarOptions={tabBarOptions}
    style={{ paddingTop: 15 }}
  >
    <BottomTab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'Get Started',
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
      }}
    />
  </BottomTab.Navigator>
);

export default BottomTabNavigator;
