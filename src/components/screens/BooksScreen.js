// src/components/screens/BooksScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import BibliaEngine from '../../core/BibliaEngine';

export default function BooksScreen({ navigation }) {
  const [currentView, setCurrentView] = useState('testaments');
  const [booksData, setBooksData] = useState({ AT: [], NT: [] });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const allBooks = BibliaEngine.getAllBooks();
      setBooksData(allBooks);
    } catch (error) {
      console.log('Erro ao carregar livros:', error);
    }
  };

  // Tela de seleção de testamentos
  const renderTestamentSelection = () => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escrituras</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.testamentsSection}>
          <Text style={styles.sectionTitle}>Escolha o Testamento</Text>
          <Text style={styles.sectionSubtitle}>
            A Bíblia está dividida em duas principais coleções de livros
          </Text>

          <View style={styles.testamentsContainer}>
            {/* Antigo Testamento */}
            <TouchableOpacity
              style={styles.testamentCard}
              onPress={() => setCurrentView('AT')}
            >
              <View style={styles.testamentIconContainer}>
                <Text style={styles.testamentIcon}>📜</Text>
              </View>
              <View style={styles.testamentInfo}>
                <Text style={styles.testamentTitle}>Antigo Testamento</Text>
                <Text style={styles.testamentSubtitle}>{booksData.AT.length} livros</Text>
              </View>
              <Text style={styles.exploreText}>›</Text>
            </TouchableOpacity>

            {/* Novo Testamento */}
            <TouchableOpacity
              style={[styles.testamentCard, styles.testamentCardNew]}
              onPress={() => setCurrentView('NT')}
            >
              <View style={[styles.testamentIconContainer, styles.testamentIconContainerNew]}>
                <Text style={styles.testamentIcon}>✝️</Text>
              </View>
              <View style={styles.testamentInfo}>
                <Text style={styles.testamentTitle}>Novo Testamento</Text>
                <Text style={styles.testamentSubtitle}>{booksData.NT.length} livros</Text>
              </View>
              <Text style={styles.exploreText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  // Lista de livros
  const renderBooksList = (testament) => {
    const books = booksData[testament] || [];
    const testamentName = testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento';

    const renderBook = ({ item, index }) => (
      <TouchableOpacity
        style={[
          styles.bookCard,
          !item.hasContent && styles.bookCardDisabled
        ]}
        onPress={() => {
          if (item.hasContent) {
            navigation.navigate('Chapters', { 
              bookName: item.key,
              displayName: item.name,
              testament: testament
            });
          }
        }}
        disabled={!item.hasContent}
      >
        <Text style={[
          styles.bookName,
          !item.hasContent && styles.bookNameDisabled
        ]}>
          {item.name}
        </Text>
        
        <Text style={[
          styles.bookCategory,
          !item.hasContent && styles.bookCategoryDisabled
        ]}>
          {item.category || 'Livro Bíblico'}
        </Text>

        {!item.hasContent && (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>Em breve</Text>
          </View>
        )}
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentView('testaments')}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{testamentName}</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          {/* Lista de livros */}
          <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={(item) => item.key}
            numColumns={2}
            contentContainerStyle={styles.booksGrid}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.bookRow}
          />
        </View>
      </View>
    );
  };

  // Renderização condicional
  if (currentView === 'testaments') {
    return renderTestamentSelection();
  } else if (currentView === 'AT') {
    return renderBooksList('AT');
  } else if (currentView === 'NT') {
    return renderBooksList('NT');
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },

  // Seleção de Testamentos
  testamentsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  testamentsContainer: {
    gap: 16,
  },
  testamentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5A2B',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testamentCardNew: {
    borderLeftColor: '#2563EB',
  },
  testamentIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testamentIconContainerNew: {
    backgroundColor: '#F3F4F6',
  },
  testamentIcon: {
    fontSize: 20,
  },
  testamentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  testamentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  testamentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },

  // Grid de livros
  booksGrid: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  bookRow: {
    justifyContent: 'space-between',
  },
  bookCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  bookCardDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  bookName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  bookNameDisabled: {
    color: '#9CA3AF',
  },
  bookCategory: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookCategoryDisabled: {
    color: '#D1D5DB',
  },
  comingSoon: {
    marginTop: 4,
  },
  comingSoonText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});