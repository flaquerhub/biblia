import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DatabaseManager from '../../utils/DatabaseManager';

const { width } = Dimensions.get('window');

// Fundos Temáticos Católicos e Natureza Bíblica
const BACKGROUND_THEMES = {
  catholic: {
    name: 'Católicos',
    icon: '✝️',
    color: '#8B4513',
    backgrounds: [
      {
        id: 'sacred_heart',
        name: 'Sagrado Coração',
        description: 'Coração de Jesus em tons dourados',
        colors: ['#8B0000', '#DC143C', '#FFD700'],
        textColor: '#FFFFFF',
        preview: 'sacred_heart'
      },
      {
        id: 'our_lady',
        name: 'Nossa Senhora',
        description: 'Manto azul de Maria Santíssima',
        colors: ['#000080', '#4169E1', '#87CEEB'],
        textColor: '#FFFFFF',
        preview: 'our_lady'
      },
      {
        id: 'pope_francis',
        name: 'Papa Francisco',
        description: 'Branco papal com detalhes dourados',
        colors: ['#FFFFFF', '#F5F5F5', '#FFD700'],
        textColor: '#333333',
        preview: 'pope'
      },
      {
        id: 'vatican',
        name: 'Vaticano',
        description: 'Cúpula de São Pedro',
        colors: ['#8B4513', '#CD853F', '#DAA520'],
        textColor: '#FFFFFF',
        preview: 'vatican'
      },
      {
        id: 'crucifix',
        name: 'Crucifixo',
        description: 'Madeira sagrada e cruz',
        colors: ['#654321', '#8B4513', '#D2691E'],
        textColor: '#FFFFFF',
        preview: 'crucifix'
      },
      {
        id: 'stained_glass',
        name: 'Vitral',
        description: 'Vitral colorido de igreja',
        colors: ['#483D8B', '#6A5ACD', '#9370DB'],
        textColor: '#FFFFFF',
        preview: 'stained_glass'
      }
    ]
  },
  biblical_nature: {
    name: 'Natureza Bíblica',
    icon: '🌿',
    color: '#228B22',
    backgrounds: [
      {
        id: 'garden_eden',
        name: 'Jardim do Éden',
        description: 'Paraíso verdejante',
        colors: ['#228B22', '#32CD32', '#98FB98'],
        textColor: '#FFFFFF',
        preview: 'garden'
      },
      {
        id: 'mount_sinai',
        name: 'Monte Sinai',
        description: 'Montanha rochosa ao amanhecer',
        colors: ['#A0522D', '#CD853F', '#F4A460'],
        textColor: '#FFFFFF',
        preview: 'mountain'
      },
      {
        id: 'jordan_river',
        name: 'Rio Jordão',
        description: 'Águas cristalinas e paz',
        colors: ['#4682B4', '#6495ED', '#87CEEB'],
        textColor: '#FFFFFF',
        preview: 'river'
      },
      {
        id: 'galilee_sea',
        name: 'Mar da Galileia',
        description: 'Lago sereno ao entardecer',
        colors: ['#191970', '#4169E1', '#6495ED'],
        textColor: '#FFFFFF',
        preview: 'sea'
      },
      {
        id: 'desert_sunrise',
        name: 'Deserto ao Amanhecer',
        description: 'Dunas douradas sob o sol',
        colors: ['#DAA520', '#F0E68C', '#FFE4B5'],
        textColor: '#8B4513',
        preview: 'desert'
      },
      {
        id: 'olive_grove',
        name: 'Oliveira',
        description: 'Bosque de oliveiras centenárias',
        colors: ['#6B8E23', '#8FBC8F', '#9ACD32'],
        textColor: '#FFFFFF',
        preview: 'olive'
      }
    ]
  },
  minimalist: {
    name: 'Minimalista',
    icon: '⚪',
    color: '#666666',
    backgrounds: [
      {
        id: 'white_cross',
        name: 'Cruz Branca',
        description: 'Simplicidade cristã',
        colors: ['#FFFFFF', '#F8F8FF', '#F5F5F5'],
        textColor: '#333333',
        preview: 'white'
      },
      {
        id: 'gold_gradient',
        name: 'Dourado Suave',
        description: 'Elegância dourada',
        colors: ['#FFD700', '#FFFF99', '#FFF8DC'],
        textColor: '#8B4513',
        preview: 'gold'
      },
      {
        id: 'blue_serenity',
        name: 'Serenidade Azul',
        description: 'Paz em tons de azul',
        colors: ['#87CEEB', '#B0E0E6', '#E6F3FF'],
        textColor: '#2F4F4F',
        preview: 'blue'
      },
      {
        id: 'warm_beige',
        name: 'Bege Acolhedor',
        description: 'Neutralidade confortável',
        colors: ['#F5F5DC', '#FFF8DC', '#FFFACD'],
        textColor: '#8B4513',
        preview: 'beige'
      }
    ]
  }
};

const BackgroundSelector = ({ 
  visible, 
  onClose, 
  onBackgroundSelect,
  currentBackground = 'white_cross'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('catholic');
  const [selectedBackground, setSelectedBackground] = useState(currentBackground);
  const [previewBackground, setPreviewBackground] = useState(null);

  useEffect(() => {
    if (visible) {
      setSelectedBackground(currentBackground);
    }
  }, [visible, currentBackground]);

  const handleBackgroundSelect = async (backgroundId) => {
    setSelectedBackground(backgroundId);
    
    // Salvar no banco de dados
    await DatabaseManager.setSetting('selectedBackground', backgroundId);
    
    // Chamar callback
    onBackgroundSelect(backgroundId);
  };

  const getBackgroundData = (backgroundId) => {
    for (const category of Object.values(BACKGROUND_THEMES)) {
      const background = category.backgrounds.find(bg => bg.id === backgroundId);
      if (background) return background;
    }
    return BACKGROUND_THEMES.minimalist.backgrounds[0]; // fallback
  };

  const renderCategoryTab = (categoryKey, category) => (
    <TouchableOpacity
      key={categoryKey}
      style={[
        styles.categoryTab,
        selectedCategory === categoryKey && styles.activeCategoryTab,
        { borderBottomColor: category.color }
      ]}
      onPress={() => setSelectedCategory(categoryKey)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === categoryKey && [
            styles.activeCategoryText,
            { color: category.color }
          ]
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBackgroundPreview = (background) => (
    <TouchableOpacity
      key={background.id}
      style={[
        styles.backgroundItem,
        selectedBackground === background.id && styles.selectedBackgroundItem
      ]}
      onPress={() => handleBackgroundSelect(background.id)}
      onLongPress={() => setPreviewBackground(background)}
    >
      <LinearGradient
        colors={background.colors}
        style={styles.backgroundPreview}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.backgroundOverlay}>
          <Text
            style={[
              styles.backgroundSampleText,
              { color: background.textColor }
            ]}
          >
            Aa
          </Text>
          {selectedBackground === background.id && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          )}
        </View>
      </LinearGradient>
      
      <View style={styles.backgroundInfo}>
        <Text style={styles.backgroundName}>{background.name}</Text>
        <Text style={styles.backgroundDescription}>
          {background.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPreviewModal = () => (
    <Modal
      visible={previewBackground !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setPreviewBackground(null)}
    >
      <View style={styles.previewOverlay}>
        <TouchableOpacity
          style={styles.previewOverlayTouch}
          onPress={() => setPreviewBackground(null)}
        >
          <View style={styles.previewContainer}>
            <LinearGradient
              colors={previewBackground?.colors || ['#FFFFFF']}
              style={styles.previewBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.previewContent}>
                <Text
                  style={[
                    styles.previewTitle,
                    { color: previewBackground?.textColor || '#333' }
                  ]}
                >
                  {previewBackground?.name}
                </Text>
                <Text
                  style={[
                    styles.previewVerse,
                    { color: previewBackground?.textColor || '#333' }
                  ]}
                >
                  "No princípio, Deus criou os céus e a terra."
                </Text>
                <Text
                  style={[
                    styles.previewReference,
                    { color: previewBackground?.textColor || '#666' }
                  ]}
                >
                  Gênesis 1:1
                </Text>
              </View>
            </LinearGradient>
            
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.previewActionButton}
                onPress={() => {
                  handleBackgroundSelect(previewBackground.id);
                  setPreviewBackground(null);
                }}
              >
                <Text style={styles.previewActionText}>Usar Este Fundo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#8B4513" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fundos Temáticos</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneButton}>Pronto</Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {Object.entries(BACKGROUND_THEMES).map(([key, category]) =>
            renderCategoryTab(key, category)
          )}
        </ScrollView>

        {/* Backgrounds Grid */}
        <ScrollView style={styles.backgroundsContainer}>
          <Text style={styles.sectionTitle}>
            {BACKGROUND_THEMES[selectedCategory].name}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Toque para selecionar, toque longo para visualizar
          </Text>
          
          <View style={styles.backgroundsGrid}>
            {BACKGROUND_THEMES[selectedCategory].backgrounds.map(renderBackgroundPreview)}
          </View>

          {/* Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color="#8B4513" />
              <Text style={styles.infoTitle}>Sobre os Fundos Temáticos</Text>
            </View>
            <Text style={styles.infoText}>
              Os fundos temáticos foram cuidadosamente escolhidos para proporcionar uma experiência de leitura mais imersiva e contemplativa da Palavra de Deus.
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Católicos:</Text> Símbolos e imagens da tradição católica
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Natureza Bíblica:</Text> Paisagens mencionadas nas Escrituras
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Minimalista:</Text> Simplicidade para focar na leitura
            </Text>
          </View>
        </ScrollView>

        {/* Preview Modal */}
        {renderPreviewModal()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  doneButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesScroll: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeCategoryTab: {
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryText: {
    fontWeight: 'bold',
  },
  backgroundsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 20,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  backgroundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  backgroundItem: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFF',
  },
  selectedBackgroundItem: {
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  backgroundPreview: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundSampleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  backgroundInfo: {
    padding: 12,
  },
  backgroundName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  backgroundDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  infoSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoBold: {
    fontWeight: 'bold',
    color: '#8B4513',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlayTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  previewBackground: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewVerse: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  previewReference: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewActions: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
  },
  previewActionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  previewActionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BackgroundSelector;