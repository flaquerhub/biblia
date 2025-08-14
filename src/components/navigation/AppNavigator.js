// src/components/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importa as telas
import HomeScreen from '../screens/HomeScreen';
import BooksScreen from '../screens/BooksScreen';
import ChaptersScreen from '../screens/ChaptersScreen';
import ReadingScreen from '../screens/ReadingScreen';
import SearchScreen from '../screens/SearchScreen';
import LiturgyScreen from '../screens/LiturgyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A1A2E', // Cor moderna escura
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
          borderBottomWidth: 0, // Remove linha inferior
        },
        headerTintColor: '#FFFFFF', // Texto branco
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false, // Remove "Back" no iOS
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          headerShown: false // Esconde header na home
        }}
      />
      
      <Stack.Screen 
        name="Books" 
        component={BooksScreen}
        options={{ 
          headerShown: false // Esconde header - usa header customizado
        }}
      />
      
      <Stack.Screen 
        name="Chapters" 
        component={ChaptersScreen}
        options={{ 
          headerShown: false // Esconde header - usa header customizado
        }}
      />
      
      <Stack.Screen 
        name="Reading" 
        component={ReadingScreen}
        options={{ 
          headerShown: false // Esconde header - usa header customizado
        }}
      />
      
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          title: 'Buscar',
          headerStyle: {
            backgroundColor: '#1A1A2E',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      
      <Stack.Screen 
        name="Liturgy" 
        component={LiturgyScreen}
        options={{ 
          title: 'Liturgia do Dia',
          headerStyle: {
            backgroundColor: '#1A1A2E',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{ 
          title: 'Favoritos',
          headerStyle: {
            backgroundColor: '#1A1A2E',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Configurações',
          headerStyle: {
            backgroundColor: '#1A1A2E',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;