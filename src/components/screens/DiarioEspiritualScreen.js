import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseManager from '../../utils/DatabaseManager';
import TagManager from '../common/TagManager';

// Modelos de diário espiritual
const DIARY_TEMPLATES = {
  lectio_divina: {
    name: 'Lectio Divina',
    icon: '📖',
    description: 'Método tradicional de oração com as Escrituras',
    fields: [
      { key: 'reading', label: 'Leitura (Lectio)', placeholder: 'Qual texto você leu hoje?' },
      { key: 'meditation', label: 'Meditação (Meditatio)', placeholder: 'O que este texto significa?' },
      { key: 'prayer', label: 'Oração (Oratio)', placeholder: 'Como você conversou com Deus sobre isso?' },
      { key: 'contemplation', label: 'Contemplação (Contemplatio)', placeholder: 'O que Deus falou ao seu coração?' }
    ]
  },
  daily_reflection: {
    name: 'Reflexão Diária',
    icon: '💭',
    description: 'Reflexão pessoal sobre a Palavra de Deus',
    fields: [
      { key: 'verse', label: 'Versículo do Dia', placeholder: 'Qual versículo tocou seu coração?' },
      { key: 'understanding', label: 'O que Deus fala', placeholder: 'O que você entendeu desta passagem?' },
      { key: 'application', label: 'Como aplicar', placeholder: 'Como aplicar isso em sua vida?' },
      { key: 'prayer_request', label: 'Oração', placeholder: 'Sua oração sobre este ensino' }
    ]
  },
  gratitude: {
    name: 'Gratidão',
    icon: '🙏',
    description: 'Registro de gratidão e bênçãos recebidas',
    fields: [
      { key: 'grateful_for', label: 'Sou grato por...', placeholder: 'Pelo que você é grato hoje?' },
      { key: 'blessings', label: 'Bênçãos recebidas', placeholder: 'Quais bênçãos você reconhece?' },
      { key: 'verse_gratitude', label: 'Versículo de gratidão', placeholder: 'Um versículo que expressa sua gratidão' },
      { key: 'prayer_thanks', label: 'Oração de agradecimento', placeholder: 'Sua oração de gratidão a Deus' }
    ]
  },
  examination: {
    name: 'Exame de Consciência',
    icon: '🔍',
    description: 'Reflexão sobre o dia à luz da fé',
    fields: [
      { key: 'presence', label: 'Presença de Deus', placeholder: 'Como você sentiu a presença de Deus hoje?' },
      { key: 'gratitude_exam', label: 'Gratidão', placeholder: 'Pelo que você é mais grato hoje?' },
      { key: 'review', label: 'Revisão do dia', placeholder: 'Como foi seu dia? O que aconteceu?' },
      { key: 'forgiveness', label: 'Perdão', placeholder: 'O que você precisa perdoar ou pedir perdão?' },
      { key: 'tomorrow', label: 'Graça para amanhã', placeholder: 'Que graça você pede para amanhã?' }
    ]
  },
  rhema: {
    name: 'Palavra Rhema',
    icon: '⚡',
    description: 'Palavra viva que Deus fala hoje',
    fields: [
      { key: 'rhema_word', label: 'Palavra Rhema', placeholder: 'Que palavra específica Deus falou?' },
      { key: 'context', label: 'Contexto', placeholder: 'Em que situação ou momento isso aconteceu?' },
      { key: 'confirmation', label: 'Confirmação', placeholder: 'Como você soube que era de Deus?' },
      { key: 'action', label: 'Ação', placeholder: 'O que você vai fazer com esta palavra?' }
    ]
  }
};

const DiarioEspiritualScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', 'calendar'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'template', 'tag'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newEntry, setNewEntry] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [selectedTag, sortBy, sortOrder]);

  const loadData = async () => {
    await Promise.all([
      loadEntries(),
      loadTags()
    ]);
  };

  const loadEntries = async () => {
    try {
      const entriesData = await DatabaseManager.getDiaryEntries(
        sortBy === 'date' ? 'created_at' : sortBy,
        sortOrder.toUpperCase(),
        selectedTag?.id
      );
      setEntries(entriesData);
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await DatabaseManager.getTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateEntry = (templateKey) => {
    setSelectedTemplate(templateKey);
    setNewEntry({});
    setSelectedTags([]);
    setShowNewEntry(true);
  };

  const handleSaveEntry = async () => {
    const template = DIARY_TEMPLATES[selectedTemplate];
    if (!template) return;

    // Validar se pelo menos um campo foi preenchido
    const hasContent = Object.values(newEntry).some(value => value && value.trim());
    if (!hasContent) {
      Alert.alert('Atenção', 'Preencha pelo menos um campo para salvar a entrada.');
      return;
    }

    try {
      const title = newEntry[template.fields[0].key] || `${template.name} - ${new Date().toLocaleDateString('pt-BR')}`;
      const content = JSON.stringify(newEntry);

      const result = await DatabaseManager.saveDiaryEntry(
        title,
        selectedTemplate,
        content,
        null, // bookId
        null, // chapterId  
        null, // verseId
        null, // verseText
        selectedTags
      );

      if (result.success) {
        setShowNewEntry(false);
        setNewEntry({});
        setSelectedTags([]);
        setSelectedTemplate(null);
        await loadEntries();
        Alert.alert('Sucesso', 'Entrada salva no diário espiritual!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a entrada.');
    }
  };

  const handleDeleteEntry = (entry) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta entrada do diário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseManager.deleteDiaryEntry(entry.id);
              await loadEntries();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a entrada.');
            }
          }
        }
      ]
    );
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredEntries = () => {
    let filtered = entries;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = entries.filter(entry => {
        const title = entry.title.toLowerCase();
        const content = entry.content.toLowerCase();
        return title.includes(query) || content.includes(query);
      });
    }

    return filtered;
  };

  const renderTemplateSelector = () => (
    <Modal
      visible={showNewEntry && !selectedTemplate}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowNewEntry(false)}>
            <Ionicons name="close" size={28} color="#8B4513" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Escolher Modelo</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.templatesContainer}>
          <Text style={styles.templatesTitle}>
            Escolha um modelo para sua nova entrada:
          </Text>
          
          {Object.entries(DIARY_TEMPLATES).map(([key, template]) => (
            <TouchableOpacity
              key={key}
              style={styles.templateCard}
              onPress={() => handleCreateEntry(key)}
            >
              <View style={styles.templateHeader}>
                <Text style={styles.templateIcon}>{template.icon}</Text>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderNewEntryForm = () => {
    const template = DIARY_TEMPLATES[selectedTemplate];
    if (!template) return null;

    return (
      <Modal
        visible={showNewEntry && selectedTemplate}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => setSelectedTemplate(null)}>
              <Ionicons name="arrow-back" size={28} color="#8B4513" />
            </TouchableOpacity>
            <Text style={styles.formTitle}>{template.name}</Text>
            <TouchableOpacity onPress={handleSaveEntry}>
              <Text style={styles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContent}>
            {template.fields.map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={field.placeholder}
                  value={newEntry[field.key] || ''}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, [field.key]: text }))}
                  multiline
                  numberOfLines={4}
                />
              </View>
            ))}

            {/* Tags */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tags (opcional)</Text>
              <View style={styles.tagsSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {tags.map((tag) => {
                    const isSelected = selectedTags.find(t => t.id === tag.id);
                    return (
                      <TouchableOpacity
                        key={tag.id}
                        style={[
                          styles.tagChip,
                          { backgroundColor: isSelected ? tag.color : '#F5F5F5' }
                        ]}
                        onPress={() => handleTagSelect(tag)}
                      >
                        <Text style={[
                          styles.tagChipText,
                          { color: isSelected ? '#FFF' : '#333' }
                        ]}>
                          {tag.icon} {tag.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderEntryItem = ({ item: entry }) => {
    const template = DIARY_TEMPLATES[entry.template_type];
    const content = JSON.parse(entry.content || '{}');
    const preview = Object.values(content)[0] || '';

    return (
      <TouchableOpacity style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <View style={styles.entryTitleContainer}>
            <Text style={styles.entryIcon}>{template?.icon || '📝'}</Text>
            <View style={styles.entryTitleInfo}>
              <Text style={styles.entryTitle} numberOfLines={1}>
                {entry.title}
              </Text>
              <Text style={styles.entryDate}>
                {formatDate(entry.created_at)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.entryMenuButton}
            onPress={() => handleDeleteEntry(entry)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <Text style={styles.entryPreview} numberOfLines={3}>
          {preview.substring(0, 150)}...
        </Text>

        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.entryTags}>
            {entry.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={[styles.entryTag, { backgroundColor: tag.color }]}
              >
                <Text style={styles.entryTagText}>{tag.icon}</Text>
              </View>
            ))}
            {entry.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{entry.tags.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedTag && styles.activeFilterChip
          ]}
          onPress={() => setSelectedTag(null)}
        >
          <Text style={[
            styles.filterChipText,
            !selectedTag && styles.activeFilterChipText
          ]}>
            Todas
          </Text>
        </TouchableOpacity>

        {tags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.filterChip,
              selectedTag?.id === tag.id && styles.activeFilterChip,
              { borderColor: tag.color }
            ]}
            onPress={() => setSelectedTag(selectedTag?.id === tag.id ? null : tag)}
          >
            <Text style={[
              styles.filterChipText,
              selectedTag?.id === tag.id && styles.activeFilterChipText
            ]}>
              {tag.icon} {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diário Espiritual</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowTagManager(true)}
          >
            <Ionicons name="pricetag" size={24} color="#8B4513" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowNewEntry(true)}
          >
            <Ionicons name="add" size={24} color="#8B4513" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar no diário..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Bar */}
      {renderFilterBar()}

      {/* Entries List */}
      <View style={styles.content}>
        {getFilteredEntries().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'Nenhuma entrada encontrada' : 'Seu diário está vazio'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Tente buscar por outras palavras'
                : 'Comece sua jornada espiritual criando sua primeira entrada'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => setShowNewEntry(true)}
              >
                <Text style={styles.createFirstButtonText}>
                  Criar Primeira Entrada
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={getFilteredEntries()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEntryItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8B4513']}
                tintColor="#8B4513"
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Statistics Footer */}
      <View style={styles.footer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{entries.length}</Text>
          <Text style={styles.statLabel}>Entradas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{tags.length}</Text>
          <Text style={styles.statLabel}>Tags</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {new Set(entries.map(e => e.template_type)).size}
          </Text>
          <Text style={styles.statLabel}>Modelos</Text>
        </View>
      </View>

      {/* Modals */}
      {renderTemplateSelector()}
      {renderNewEntryForm()}
      
      <TagManager
        visible={showTagManager}
        onClose={() => setShowTagManager(false)}
        onTagsUpdated={loadTags}
      />
    </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 8,
  },
  searchContainer: {