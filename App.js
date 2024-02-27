import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/views/HomeScreen';
import DetailsScreen from './src/views/DetailsScreen';
import ResipesScreen from './src/views/ResipesScreen';
import { AppProvider } from './src/context/AppContext';
import FavoritesScreen from './src/views/FavoritesScreen';
import RecipesListScreen from "./src/views/RecipesListScreen"
const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{
            contentStyle: {
              backgroundColor: '#FFF'
            },
            headerShown: false
          }} >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Resipes" component={ResipesScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
            <Stack.Screen name="RecipesListScreen" component={RecipesListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    );
  }
}
