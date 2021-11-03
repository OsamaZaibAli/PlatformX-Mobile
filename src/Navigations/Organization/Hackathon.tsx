//Sreens
// view
// edit/ create
// details screen (submissions screen and result screen)

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Hackathon from '../../Screens/Organization/Hackathon';
import HackathonTabs from './Tabs/HackathonTab';
import ViewHackathon from '../../Screens/Organization/Hackathon/View';
import CreateEditHackathon from '../../Screens/Organization/Hackathon/CreateEdit';
const HackathonScreens = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{header: () => null}}
      initialRouteName={'HackathonTab'}>
      <Stack.Screen name={'HackathonTab'} component={HackathonTabs} />
      <Stack.Screen
        name={'Create_Edit_Hackathon'}
        component={CreateEditHackathon}
      />
    </Stack.Navigator>
  );
};

export default HackathonScreens;

const styles = StyleSheet.create({});
