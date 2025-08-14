// src/components/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';

export default function HomeScreen({ navigation }) {
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Principal */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Boa leitura!</Text>
              <Text style={styles.date}>{currentDate}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
          
          {/* Versículo do Dia */}
          <View style={styles.verseCard}>
            <Text style={styles.verseLabel}>VERSÍCULO DO DIA</Text>
            <Text style={styles.verseText}>
              "Porque Deus tanto amou o mundo que deu o seu Filho unigênito..."
            </Text>
            <Text style={styles.verseReference}>João 3:16</Text>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Continuar lendo</Text>
          
          <TouchableOpacity 
            style={styles.continueCard}
            onPress={() => navigation.navigate('Books')}
          >
            <View style={styles.continueContent}>
              <View style={styles.continueText}>
                <Text style={styles.continueTitle}>Evangelho de Marcos</Text>
                <Text style={styles.continueSubtitle}>Capítulo 3 • Último acesso ontem</Text>
              </View>
              <View style={styles.continueProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '35%' }]} />
                </View>
                <Text style={styles.progressText}>35%</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Principal */}
        <View style={styles.mainMenu}>
          <Text style={styles.sectionTitle}>Explorar</Text>
          
          <View style={styles.menuGrid}>
            {/* Linha 1 */}
            <View style={styles.menuRow}>
              <TouchableOpacity 
                style={[styles.menuCard, styles.menuCardLarge]}
                onPress={() => navigation.navigate('Books')}
              >
                <View style={styles.menuIconContainer}>
                  <Text style={styles.menuIcon}>📖</Text>
                </View>
                <Text style={styles.menuTitle}>Escrituras</Text>
                <Text style={styles.menuSubtitle}>Ler a Bíblia</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuCard}
                onPress={() => navigation.navigate('Liturgy')}
              >
                <View style={[styles.menuIconContainer, styles.iconLiturgy]}>
                  <Text style={styles.menuIcon}>⛪</Text>
                </View>
                <Text style={styles.menuTitle}>Liturgia</Text>
              </TouchableOpacity>
            </View>

            {/* Linha 2 */}
            <View style={styles.menuRow}>
              <TouchableOpacity 
                style={styles.menuCard}
                onPress={() => navigation.navigate('Search')}
              >
                <View style={[styles.menuIconContainer, styles.iconSearch]}>
                  <Text style={styles.menuIcon}>🔍</Text>
                </View>
                <Text style={styles.menuTitle}>Buscar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuCard}
                onPress={() => navigation.navigate('Favorites')}
              >
                <View style={[styles.menuIconContainer, styles.iconFavorites]}>
                  <Text style={styles.menuIcon}>💝</Text>
                </View>
                <Text style={styles.menuTitle}>Favoritos</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuCard}
                onPress={() => navigation.navigate('Settings')}
              >
                <View style={[styles.menuIconContainer, styles.iconPlans]}>
                  <Text style={styles.menuIcon}>📚</Text>
                </View>
                <Text style={styles.menuTitle}>Planos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seção de Descoberta */}
        <View style={styles.discoverySection}>
          <Text style={styles.sectionTitle}>Descobrir</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.discoveryCard}>
              <View style={styles.discoveryImage}>
                <Text style={styles.discoveryEmoji}>🌅</Text>
              </View>
              <Text style={styles.discoveryTitle}>Oração da Manhã</Text>
              <Text style={styles.discoverySubtitle}>5 min</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.discoveryCard}>
              <View style={styles.discoveryImage}>
                <Text style={styles.discoveryEmoji}>🕊️</Text>
              </View>
              <Text style={styles.discoveryTitle}>Paz Interior</Text>
              <Text style={styles.discoverySubtitle}>Reflexão</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.discoveryCard}>
              <View style={styles.discoveryImage}>
                <Text style={styles.discoveryEmoji}>💫</Text>
              </View>
              <Text style={styles.discoveryTitle}>Esperança</Text>
              <Text style={styles.discoverySubtitle}>Meditação</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },

  // Header
  headerSection: {
    backgroundColor: '#1A1A2E',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#A0A0A0',
    textTransform: 'capitalize',
  },
  profileButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },

  // Versículo do Dia
  verseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  verseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  verseText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '500',
  },

  // Seções
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  // Ações Rápidas
  quickActions: {
    padding: 20,
    paddingTop: 32,
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueText: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  continueSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  continueProgress: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Menu Principal
  mainMenu: {
    padding: 20,
  },
  menuGrid: {
    gap: 12,
  },
  menuRow: {
    flexDirection: 'row',
    gap: 12,
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 100,
  },
  menuCardLarge: {
    flex: 2,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconLiturgy: {
    backgroundColor: '#FEF3C7',
  },
  iconSearch: {
    backgroundColor: '#DBEAFE',
  },
  iconFavorites: {
    backgroundColor: '#FCE7F3',
  },
  iconPlans: {
    backgroundColor: '#D1FAE5',
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Descoberta
  discoverySection: {
    padding: 20,
    paddingBottom: 40,
  },
  discoveryCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discoveryImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  discoveryEmoji: {
    fontSize: 32,
  },
  discoveryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  discoverySubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});