import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Share,
  Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DatabaseManager from '../../utils/DatabaseManager';

const { width, height } = Dimensions.get('window');

const MARKING_COLORS = [
  { id: 'yellow', color: '#FFEB3B', name: 'Amarelo', icon: '🟡' },
  { id: 'green', color: '#4CAF50', name: 'Verde', icon: '🟢' },
  { id: 'blue', color: '#2196F3', name: 'Azul', icon: '🔵' },
  { id: 'red', color: '#F44336', name: 'Vermelho', icon: '🔴' },
  { id: 'purple', color: '#9C27B0', name: 'Roxo', icon: '🟣' },
  { id: 'orange', color: '#FF9800', name: 'Laranja', icon: '🟠' },
  { id: 'pink', color: '#E91E63', name: 'Rosa', icon: '🩷' },
  { id: 'teal', color: '#009688', name: 'Verde-azulado', icon: '🟢' }
];

const VerseMarkingMenu = ({
  visible,
  verse,
  verseReference,
  bookName,
  bookId,
  chapterId,
  verseId,
  onClose,
  onMarkingComplete,
  currentMarking = null,
  currentNote = null,
  isFavorite = false
}) => {
  const [selectedColor, setSelectedColor] = useState(currentMarking?.color || null);
  const [selectedTags, setSelectedTags] = useState(currentMarking?.tags || []);
  const [availableTags, setAvailableTags] = useState([]);
  const [noteText, setNoteText] = useState(currentNote?.note_text || '');
  const [showTagCreator, setShowTagCreator] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4CAF50');
  const [activeTab, setActiveTab] = useState('marking');

  useEffect(() => {
    if (visible) {
      loadTags();
      setSelectedColor(currentMarking?.color || null);
      setSelectedTags(currentMarking?.tags || []);
      setNoteText(currentNote?.note_text || '');
    }
  }, [visible, currentMarking, currentNote]);

  const loadTags = async () => {
    try {
      const tags = await DatabaseManager.getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  };

  const handleColorSelect = (colorData) => {
    setSelectedColor(selectedColor === colorData.color ? null : colorData.color);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags => {
      const exists = prevTags.find(t => t.id === tag.id);
      if (exists) {
        return prevTags.filter(t => t.id !== tag.id);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleSaveMarking = async () => {
    if (!selectedColor && selectedTags.length === 0) {
      Alert.alert('Atenção', 'Selecione uma cor ou pelo menos uma tag para marcar o versículo.');
      return;
    }

    try {
      if (selectedColor) {
        await DatabaseManager.saveVerseMarking(bookId, chapterId, verseId, selectedColor, selectedTags);
      }

      if (noteText.trim()) {
        await DatabaseManager.saveVerseNote(bookId, chapterId, verseId, noteText.trim());
      }

      onMarkingComplete();
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a marcação.');
    }
  };

  const handleRemoveMarking = async () => {
    Alert.alert(
      'Confirmar Remoção',
      'Deseja remover a marcação deste versículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseManager.deleteVerseMarking(bookId, chapterId, verseId);
              onMarkingComplete();
              onClose();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover a marcação.');
            }
          }
        }
      ]
    );
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await DatabaseManager.removeFromFavorites(bookId, chapterId, verseId);
      } else {
        await DatabaseManager.addToFavorites(bookId, chapterId, verseId, verse, bookName, selectedTags);
      }
      onMarkingComplete();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  };

  const handleShare = async (type = 'text') => {
    try {
      const message = `📖 ${verseReference}\n\n"${verse}"\n\n✝️ Compartilhado via Bíblia Católica`;
      
      if (type === 'whatsapp') {
        // Implementar compartilhamento específico para WhatsApp se necessário
        await Share.share({ message, title: verseReference });
      } else {
        await Share.share({ message, title: verseReference });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o versículo.');
    }
  };

  const handleCopyText = async () => {
    try {
      const text = `${verse} - ${verseReference}`;
      await Clipboard.setString(text);
      Alert.alert('Copiado!', 'Versículo copiado para a área de transferência.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o texto.');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      Alert.alert('Erro', 'Digite um nome para a tag.');
      return;
    }

    try {
      const result = await DatabaseManager.createTag(newTagName.trim(), newTagColor);
      if (result.success) {
        await loadTags();
        setNewTagName('');
        setNewTagColor('#4CAF50');
        setShowTagCreator(false);
        
        // Auto-selecionar a nova tag
        setSelectedTags(prev => [...prev, {
          id: result.id,
          name: newTagName.trim(),
          color: newTagColor,
          icon: '🏷️'
        }]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a tag.');
    }
  };

  const handleAddToDiary = async () => {
    try {
      // Navegar para a tela de diário com o versículo pré-selecionado
      // Isso será implementado quando integrarmos com a navegação
      Alert.alert('Em breve', 'Funcionalidade de diário será implementada em breve.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar ao diário.');
    }
  };

  const renderColorPicker = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎨 Cores de Marcação</Text>
      <View style={styles.colorsContainer}>
        {MARKING_COLORS.map((colorData) => (
          <TouchableOpacity
            key={colorData.id}
            style={[
              styles.colorButton,
              { backgroundColor: colorData.color },
              selectedColor === colorData.color && styles.selectedColor
            ]}
            onPress={() => handleColorSelect(colorData)}
          >
            {selectedColor === colorData.color && (
              <Ionicons name="checkmark" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTagSelector = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🏷️ Tags</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowTagCreator(!showTagCreator)}
        >
          <Ionicons name="add" size={20} color="#4CAF50" />
          <Text style={styles.addButtonText}>Nova</Text>
        </TouchableOpacity>
      </View>

      {showTagCreator && (
        <View style={styles.tagCreator}>
          <TextInput
            style={styles.tagInput}
            placeholder="Nome da tag"
            value={newTagName}
            onChangeText={setNewTagName}
            maxLength={20}
          />
          <View style={styles.tagColorPicker}>
            {MARKING_COLORS.slice(0, 4).map((color) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.smallColorButton,
                  { backgroundColor: color.color },
                  newTagColor === color.color && styles.selectedTagColor
                ]}
                onPress={() => setNewTagColor(color.color)}
              />
            ))}
          </View>
          <View style={styles.tagCreatorActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowTagCreator(false);
                setNewTagName('');
                setNewTagColor('#4CAF50');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateTag}>
              <Text style={styles.createButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tagsContainer}>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.find(t => t.id === tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                { backgroundColor: isSelected ? tag.color : '#F5F5F5' },
                isSelected && styles.selectedTag
              ]}
              onPress={() => handleTagToggle(tag)}
            >
              <Text style={[
                styles.tagText,
                { color: isSelected ? '#FFF' : '#333' }
              ]}>
                {tag.icon} {tag.name}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#FFF" style={styles.tagCheck} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderNoteEditor = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>✏️ Anotação Pessoal</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Escreva sua reflexão sobre este versículo..."
        value={noteText}
        onChangeText={setNoteText}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Text style={styles.charCounter}>{noteText.length}/500</Text>
    </View>
  );

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.toolButton} onPress={handleToggleFavorite}>
        <Ionicons 
          name={isFavorite ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={isFavorite ? "#FF6B6B" : "#666"} 
        />
        <Text style={styles.toolButtonText}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.toolButton} onPress={() => handleShare('text')}>
        <Ionicons name="share-outline" size={24} color="#666" />
        <Text style={styles.toolButtonText}>Compartilhar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.toolButton} onPress={handleCopyText}>
        <Ionicons name="copy-outline" size={24} color="#666" />
        <Text style={styles.toolButtonText}>Copiar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.toolButton} onPress={handleAddToDiary}>
        <Ionicons name="journal-outline" size={24} color="#666" />
        <Text style={styles.toolButtonText}>Diário</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'marking' && styles.activeTab]}
        onPress={() => setActiveTab('marking')}
      >
        <Ionicons name="color-palette" size={20} color={activeTab === 'marking' ? '#8B4513' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'marking' && styles.activeTabText]}>
          Marcação
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'note' && styles.activeTab]}
        onPress={() => setActiveTab('note')}
      >
        <Ionicons name="pencil" size={20} color={activeTab === 'note' ? '#8B4513' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'note' && styles.activeTabText]}>
          Anotação
        </Text>
      </TouchableOpacity>
    </View>
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
          <Text style={styles.headerTitle}>Marcar Versículo</Text>
          <TouchableOpacity 
            onPress={handleSaveMarking}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        {/* Versículo */}
        <View style={styles.verseContainer}>
          <Text style={styles.verseText}>"{verse}"</Text>
          <Text style={styles.verseReference}>{verseReference}</Text>
        </View>

        {/* Toolbar */}
        {renderToolbar()}

        {/* Tabs */}
        {renderTabs()}

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'marking' && (
            <>
              {renderColorPicker()}
              {renderTagSelector()}
            </>
          )}
          
          {activeTab === 'note' && renderNoteEditor()}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          {currentMarking && (
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveMarking}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              <Text style={styles.removeButtonText}>Remover Marcação</Text>
            </TouchableOpacity>
          )}
        </View>
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
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  verseContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verseText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  verseReference: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  toolButton: {
    alignItems: 'center',
    flex: 1,
  },
  toolButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F0F0F0',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#4CAF50',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTag: {
    borderColor: 'transparent',
  },
  tagText: {
    fontSize: 14,
  },
  tagCheck: {
    marginLeft: 6,
  },
  tagCreator: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  tagInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagColorPicker: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  smallColorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  selectedTagColor: {
    borderWidth: 2,
    borderColor: '#333',
  },
  tagCreatorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noteInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  charCounter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  actions: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  removeButtonText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default VerseMarkingMenu;