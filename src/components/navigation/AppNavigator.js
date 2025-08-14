import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ===== IMPORTS DAS TELAS EXISTENTES =====
import HomeScreen from '../screens/HomeScreen';
import BooksScreen from '../screens/BooksScreen';
import ChaptersScreen from '../screens/ChaptersScreen';
import ReadingScreen from '../screens/ReadingScreen';
import SearchScreen from '../screens/SearchScreen';

// ===== IMPORTS DAS NOVAS TELAS =====
import FavoritosScreen from '../screens/FavoritosScreen';
import DiarioEspiritualScreen from '../screens/DiarioEspiritualScreen';
import OrandoComBibliaScreen from '../screens/OrandoComBibliaScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A1A2E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          cardStyle: {
            backgroundColor: '#F5F5F5',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Bíblia Católica',
            headerStyle: {
              backgroundColor: '#1A1A2E',
            },
          }}
        />
        
        <Stack.Screen 
          name="Books" 
          component={BooksScreen}
          options={{
            title: 'Livros da Bíblia',
          }}
        />
        
        <Stack.Screen 
          name="Chapters" 
          component={ChaptersScreen}
          options={({ route }) => ({
            title: route.params?.bookName || 'Capítulos',
          })}
        />
        
        <Stack.Screen 
          name="Reading" 
          component={ReadingScreen}
          options={({ route }) => ({
            title: `${route.params?.bookName || 'Livro'} ${route.params?.chapter || ''}`,
            headerStyle: {
              backgroundColor: '#1A1A2E',
            },
          })}
        />
        
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            title: 'Pesquisar',
          }}
        />

        {/* ===== NOVAS TELAS ===== */}
        <Stack.Screen 
          name="Favoritos" 
          component={FavoritosScreen}
          options={{
            title: 'Meus Favoritos',
            headerShown: false, // Usando header personalizado
          }}
        />

        <Stack.Screen 
          name="DiarioEspiritual" 
          component={DiarioEspiritualScreen}
          options={{
            title: 'Diário Espiritual',
            headerShown: false, // Usando header personalizado
          }}
        />

        <Stack.Screen 
          name="OrandoComBiblia" 
          component={OrandoComBibliaScreen}
          options={{
            title: 'Orando com a Bíblia',
            headerShown: false, // Usando header personalizado
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;