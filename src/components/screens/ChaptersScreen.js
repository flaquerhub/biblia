// src/components/screens/ChaptersScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import BibliaEngine from '../../core/BibliaEngine';

export default function ChaptersScreen({ route, navigation }) {
  const { bookName, displayName, testament } = route.params;
  
  // Busca os capítulos reais do livro
  const bookData = BibliaEngine.books?.[bookName];
  const chapters = bookData ? Object.keys(bookData).map(ch => parseInt(ch)).sort((a, b) => a - b) : [];
  
  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterCard}
      onPress={() => navigation.navigate('Reading', { 
        bookName,
        displayName,
        chapterNumber: item 
      })}
    >
      <Text style={styles.chapterNumber}>{item}</Text>
    </TouchableOpacity>
  );

  if (chapters.length === 0) {
    return (
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{displayName}</Text>
            <Text style={styles.headerSubtitle}>Em breve</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
        
        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
          </View>
          <Text style={styles.emptyTitle}>Capítulos em breve</Text>
          <Text style={styles.emptyText}>
            Os capítulos deste livro serão disponibilizados em breve.
            Continue explorando outros livros enquanto isso.
          </Text>
          <TouchableOpacity 
            style={styles.backToBooks}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToBooksText}>Voltar aos livros</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{displayName}</Text>
          <Text style={styles.headerSubtitle}>{chapters.length} capítulos</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Progress Info */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Seu progresso</Text>
            <Text style={styles.progressSubtitle}>Continue de onde parou</Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>0%</Text>
          </View>
        </View>

        {/* Chapters Grid */}
        <Text style={styles.sectionsTitle}>Capítulos</Text>
        <FlatList
          data={chapters}
          renderItem={renderChapter}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
          contentContainerStyle={styles.chaptersContainer}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.chapterRow}
        />
      </View>
    </View>
  );
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
  headerSubtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
    padding: 20,
  },

  // Progress Card
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },

  // Sections
  sectionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  // Chapters
  chaptersContainer: {
    paddingBottom: 20,
  },
  chapterRow: {
    justifyContent: 'space-between',
  },
  chapterCard: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToBooks: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToBooksText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});