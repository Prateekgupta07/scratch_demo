import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../homescreen';
import CommandsScreen from '../commandScreen';
import {CommandsProvider} from '../command_context';
const Stack = createStackNavigator();

export default function App() {
  const [commands, setCommands] = useState([]);

  return (
    <CommandsProvider>

    <NavigationContainer independent="true">
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props} commands={commands} setCommands={setCommands} />}
        </Stack.Screen>
        <Stack.Screen name="Commands">
          {props => <CommandsScreen {...props} commands={commands} setCommands={setCommands} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </CommandsProvider>
  );
}
