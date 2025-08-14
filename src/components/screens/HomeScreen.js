import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const mainFeatures = [
    {
      id: 'read',
      title: 'Ler a Bíblia',
      subtitle: '73 livros católicos',
      icon: 'book-outline',
      color: '#4A90E2',
      onPress: () => navigation.navigate('Books')
    },
    {
      id: 'search',
      title: 'Pesquisar',
      subtitle: 'Encontre versículos',
      icon: 'search-outline',
      color: '#27AE60',
      onPress: () => navigation.navigate('Search')
    }
  ];

  const spiritualFeatures = [
    {
      id: 'favorites',
      title: 'Favoritos',
      subtitle: 'Versículos salvos',
      icon: 'heart-outline',
      color: '#E74C3C',
      onPress: () => navigation.navigate('Favoritos')
    },
    {
      id: 'diary',
      title: 'Diário Espiritual',
      subtitle: 'Reflexões pessoais',
      icon: 'journal-outline',
      color: '#9B59B6',
      onPress: () => navigation.navigate('DiarioEspiritual')
    },
    {
      id: 'prayer',
      title: 'Orando com a Bíblia',
      subtitle: 'Jornadas de oração',
      icon: 'praying-hands',
      color: '#E67E22',
      onPress: () => navigation.navigate('OrandoComBiblia')
    }
  ];

  const renderFeatureCard = (feature, isLarge = false) => {
    const cardWidth = isLarge ? width - 40 : (width - 60) / 2;
    
    return (
      <TouchableOpacity
        key={feature.id}
        style={[
          styles.featureCard,
          {
            width: cardWidth,
            backgroundColor: feature.color,
            height: isLarge ? 120 : 100,
          }
        ]}
        onPress={feature.onPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Ionicons 
            name={feature.icon} 
            size={isLarge ? 32 : 28} 
            color="#FFFFFF" 
          />
          <Text style={[
            styles.cardTitle,
            { fontSize: isLarge ? 18 : 16 }
          ]}>
            {feature.title}
          </Text>
          <Text style={[
            styles.cardSubtitle,
            { fontSize: isLarge ? 14 : 12 }
          ]}>
            {feature.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bíblia Católica</Text>
        <Text style={styles.subtitleText}>
          "Toda a Escritura divinamente inspirada é proveitosa" - 2 Timóteo 3:16
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leitura da Palavra</Text>
        <View style={styles.mainFeaturesContainer}>
          {mainFeatures.map(feature => renderFeatureCard(feature, true))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vida Espiritual</Text>
        <View style={styles.featuresGrid}>
          {spiritualFeatures.map(feature => renderFeatureCard(feature))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos Extras</Text>
        <View style={styles.extraFeatures}>
          <TouchableOpacity style={styles.extraFeatureItem}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
            <View style={styles.extraFeatureText}>
              <Text style={styles.extraFeatureTitle}>Palavra do Dia</Text>
              <Text style={styles.extraFeatureSubtitle}>Notificações personalizadas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.extraFeatureItem}>
            <Ionicons name="color-palette-outline" size={24} color="#666" />
            <View style={styles.extraFeatureText}>
              <Text style={styles.extraFeatureTitle}>Temas e Fundos</Text>
              <Text style={styles.extraFeatureSubtitle}>Personalize sua leitura</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.extraFeatureItem}>
            <Ionicons name="cloud-download-outline" size={24} color="#666" />
            <View style={styles.extraFeatureText}>
              <Text style={styles.extraFeatureTitle}>Backup & Restauração</Text>
              <Text style={styles.extraFeatureSubtitle}>Sincronize seus dados</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho" - Salmos 119:105
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 15,
  },
  mainFeaturesContainer: {
    gap: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  featureCard: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  extraFeatures: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  extraFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  extraFeatureText: {
    flex: 1,
    marginLeft: 15,
  },
  extraFeatureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  extraFeatureSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;