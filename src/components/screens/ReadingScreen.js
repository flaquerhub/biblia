// src/components/screens/ReadingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import BibliaEngine from '../../core/BibliaEngine';

export default function ReadingScreen({ route, navigation }) {
  const { bookName, displayName, chapterNumber } = route.params;
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [highlights, setHighlights] = useState(new Set());
  const [showActions, setShowActions] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    loadChapter();
  }, []);

  const loadChapter = async () => {
    try {
      const chapterData = BibliaEngine.getChapter(bookName, chapterNumber);
      setChapter(chapterData);
    } catch (error) {
      console.log('Erro ao carregar capítulo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (verseNumber) => {
    const verseId = `${bookName}-${chapterNumber}-${verseNumber}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(verseId)) {
      newFavorites.delete(verseId);
    } else {
      newFavorites.add(verseId);
    }
    setFavorites(newFavorites);
  };

  const toggleHighlight = (verseNumber) => {
    const verseId = `${bookName}-${chapterNumber}-${verseNumber}`;
    const newHighlights = new Set(highlights);
    if (newHighlights.has(verseId)) {
      newHighlights.delete(verseId);
    } else {
      newHighlights.add(verseId);
    }
    setHighlights(newHighlights);
  };

  const renderVerse = (verse, index) => {
    const verseId = `${bookName}-${chapterNumber}-${verse.number}`;
    const isFavorite = favorites.has(verseId);
    const isHighlighted = highlights.has(verseId);

    return (
      <View key={index} style={styles.verseContainer}>
        <TouchableOpacity
          style={[
            styles.verseNumber,
            isFavorite && styles.verseNumberFavorite
          ]}
          onPress={() => toggleFavorite(verse.number)}
        >
          <Text style={[
            styles.verseNumberText,
            isFavorite && styles.verseNumberTextFavorite
          ]}>
            {verse.number}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.verseTextContainer}
          onPress={() => toggleHighlight(verse.number)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.verseText,
            { fontSize },
            isHighlighted && styles.verseTextHighlighted
          ]}>
            {verse.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Carregando capítulo...</Text>
        </View>
      </View>
    );
  }

  if (!chapter) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>📖</Text>
          <Text style={styles.errorTitle}>Capítulo não encontrado</Text>
          <Text style={styles.errorText}>
            Este capítulo ainda não está disponível.
          </Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Voltar</Text>
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
          <Text style={styles.headerSubtitle}>Capítulo {chapterNumber}</Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowActions(!showActions)}
        >
          <Text style={styles.menuIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Action Bar */}
      {showActions && (
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setFontSize(Math.max(14, fontSize - 2))}
          >
            <Text style={styles.actionIcon}>A⁻</Text>
            <Text style={styles.actionLabel}>Menor</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setFontSize(Math.min(24, fontSize + 2))}
          >
            <Text style={styles.actionIcon}>A⁺</Text>
            <Text style={styles.actionLabel}>Maior</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.actionIcon}>💝</Text>
            <Text style={styles.actionLabel}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Compartilhar */}}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionLabel}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.versesContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter Info */}
        {chapter.title && (
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
          </View>
        )}

        {/* Verses */}
        <View style={styles.versesSection}>
          {chapter.verses && chapter.verses.map((verse, index) => 
            renderVerse(verse, index)
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>← Capítulo anterior</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Próximo capítulo →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.bottomNavIcon}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={() => navigation.navigate('Books')}
        >
          <Text style={styles.bottomNavIcon}>📚</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.bottomNavIcon}>🔍</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bottomNavButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.bottomNavIcon}>💝</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
    paddingBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Action Bar
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Content
  content: {
    flex: 1,
  },
  versesContainer: {
    paddingBottom: 100,
  },

  // Chapter Info
  chapterInfo: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'center',
  },

  // Verses
  versesSection: {
    padding: 20,
  },
  verseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
  },
  verseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  verseNumberFavorite: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  verseNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  verseNumberTextFavorite: {
    color: '#D97706',
  },
  verseTextContainer: {
    flex: 1,
    paddingVertical: 4,
  },
  verseText: {
    lineHeight: 28,
    color: '#1A1A2E',
    textAlign: 'justify',
  },
  verseTextHighlighted: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Navigation
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomNavButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomNavIcon: {
    fontSize: 24,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
