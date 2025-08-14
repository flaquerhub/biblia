import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseManager from '../../utils/DatabaseManager';
import TagManager from '../common/TagManager';

const FavoritosScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showTagManager, setShowTagManager] = useState(false);
  const [groupBy, setGroupBy] = useState('tag'); // tag, book, date

  useEffect(() => {
    loadFavorites();
    loadTags();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteVerses = await DatabaseManager.getFavorites();
      setFavorites(favoriteVerses);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const loadTags = async () => {
    try {
      const allTags = await DatabaseManager.getTags();
      setTags(allTags);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  };

  const removeFavorite = async (favoriteId) => {
    Alert.alert(
      'Remover Favorito',
      'Deseja remover este versículo dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseManager.removeFavorite(favoriteId);
              loadFavorites();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o favorito');
            }
          }
        }
      ]
    );
  };

  const shareVerse = async (verse) => {
    const shareText = `${verse.text}\n\n${verse.book} ${verse.chapter}:${verse.verse}`;
    
    try {
      if (Share) {
        await Share.share({
          message: shareText,
          title: 'Versículo Favorito'
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    const matchesTag = selectedTag === 'all' || 
                      (fav.tags && fav.tags.includes(selectedTag));
    const matchesSearch = !searchText || 
                         fav.text.toLowerCase().includes(searchText.toLowerCase()) ||
                         `${fav.book} ${fav.chapter}:${fav.verse}`.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesTag && matchesSearch;
  });

  const groupedFavorites = () => {
    if (groupBy === 'tag') {
      const grouped = {};
      filteredFavorites.forEach(fav => {
        const favTags = fav.tags && fav.tags.length > 0 ? fav.tags : ['Sem tag'];
        favTags.forEach(tagName => {
          if (!grouped[tagName]) grouped[tagName] = [];
          grouped[tagName].push(fav);
        });
      });
      return grouped;
    } else if (groupBy === 'book') {
      const grouped = {};
      filteredFavorites.forEach(fav => {
        if (!grouped[fav.book]) grouped[fav.book] = [];
        grouped[fav.book].push(fav);
      });
      return grouped;
    } else {
      const grouped = {};
      filteredFavorites.forEach(fav => {
        const date = new Date(fav.created_at).toLocaleDateString('pt-BR');
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(fav);
      });
      return grouped;
    }
  };

  const renderFavoriteItem = ({ item }) => {
    const tagColor = item.color || '#4A90E2';
    
    return (
      <View style={styles.favoriteCard}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.verseReference}>
            {item.book} {item.chapter}:{item.verse}
          </Text>
          <View style={styles.favoriteActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => shareVerse(item)}
            >
              <Ionicons name="share-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => removeFavorite(item.id)}
            >
              <Ionicons name="heart" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.verseText}>{item.text}</Text>

        {item.personal_note && (
          <View style={styles.noteContainer}>
            <Ionicons name="create-outline" size={14} color="#666" />
            <Text style={styles.noteText}>{item.personal_note}</Text>
          </View>
        )}

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tagName, index) => {
              const tag = tags.find(t => t.name === tagName);
              return (
                <View
                  key={index}
                  style={[
                    styles.tagChip,
                    { backgroundColor: tag?.color || '#E0E0E0' }
                  ]}
                >
                  <Text style={[
                    styles.tagText,
                    { color: tag?.color ? '#FFFFFF' : '#666' }
                  ]}>
                    {tagName}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.dateText}>
          Adicionado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    );
  };

  const renderGroupedSection = (groupName, items) => (
    <View key={groupName} style={styles.groupSection}>
      <Text style={styles.groupHeader}>{groupName} ({items.length})</Text>
      {items.map((item, index) => (
        <View key={`${groupName}-${index}`}>
          {renderFavoriteItem({ item })}
        </View>
      ))}
    </View>
  );

  const grouped = groupedFavorites();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <TouchableOpacity
          style={styles.tagManagerButton}
          onPress={() => setShowTagManager(true)}
        >
          <Ionicons name="pricetag-outline" size={24} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar nos favoritos..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedTag === 'all' && styles.activeFilterChip
            ]}
            onPress={() => setSelectedTag('all')}
          >
            <Text style={[
              styles.filterText,
              selectedTag === 'all' && styles.activeFilterText
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          {tags.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.filterChip,
                selectedTag === tag.name && styles.activeFilterChip,
                { backgroundColor: selectedTag === tag.name ? tag.color : '#F0F0F0' }
              ]}
              onPress={() => setSelectedTag(tag.name)}
            >
              <Text style={[
                styles.filterText,
                selectedTag === tag.name && styles.activeFilterText
              ]}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.groupByContainer}>
        <Text style={styles.groupByLabel}>Agrupar por:</Text>
        {['tag', 'book', 'date'].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.groupByButton,
              groupBy === option && styles.activeGroupBy
            ]}
            onPress={() => setGroupBy(option)}
          >
            <Text style={[
              styles.groupByText,
              groupBy === option && styles.activeGroupByText
            ]}>
              {option === 'tag' ? 'Tag' : option === 'book' ? 'Livro' : 'Data'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.favoritesContainer} showsVerticalScrollIndicator={false}>
        {Object.keys(grouped).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Nenhum favorito encontrado</Text>
            <Text style={styles.emptyText}>
              {searchText || selectedTag !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece marcando versículos como favoritos durante a leitura'
              }
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([groupName, items]) =>
            renderGroupedSection(groupName, items)
          )
        )}
      </ScrollView>

      <Modal
        visible={showTagManager}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <TagManager
          onClose={() => setShowTagManager(false)}
          onTagsUpdated={() => {
            loadTags();
            loadFavorites();
          }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  tagManagerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A2E',
  },
  searchIcon: {
    marginLeft: 10,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: '#1A1A2E',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  groupByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  groupByLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  groupByButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  activeGroupBy: {
    backgroundColor: '#1A1A2E',
  },
  groupByText: {
    fontSize: 12,
    color: '#666',
  },
  activeGroupByText: {
    color: '#FFFFFF',
  },
  favoritesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  groupSection: {
    marginBottom: 25,
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 15,
    paddingLeft: 5,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  favoriteActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  verseText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default FavoritosScreen;