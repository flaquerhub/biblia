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
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatabaseManager from '../../utils/DatabaseManager';

const TAG_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#E91E63', 
  '#9C27B0', '#607D8B', '#795548', '#FFEB3B',
  '#00BCD4', '#FF5722', '#8BC34A', '#3F51B5'
];

const TAG_ICONS = [
  '🏷️', '✝️', '🕊️', '❤️', '📢', '🤝', '🙏', '🎯', 
  '🙌', '📚', '⭐', '🔥', '🌟', '💫', '🌈', '✨'
];

const TagManager = ({ visible, onClose, onTagsUpdated }) => {
  const [tags, setTags] = useState([]);
  const [editingTag, setEditingTag] = useState(null);
  const [newTagData, setNewTagData] = useState({
    name: '',
    color: '#4CAF50',
    icon: '🏷️'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadTags();
    }
  }, [visible]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const tagsData = await DatabaseManager.getTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tags.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagData.name.trim()) {
      Alert.alert('Erro', 'Digite um nome para a tag.');
      return;
    }

    try {
      setLoading(true);
      const result = await DatabaseManager.createTag(
        newTagData.name.trim(),
        newTagData.color,
        newTagData.icon
      );

      if (result.success) {
        await loadTags();
        setNewTagData({ name: '', color: '#4CAF50', icon: '🏷️' });
        onTagsUpdated?.();
        Alert.alert('Sucesso', 'Tag criada com sucesso!');
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível criar a tag.');
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar a tag.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setNewTagData({
      name: tag.name,
      color: tag.color,
      icon: tag.icon
    });
  };

  const handleUpdateTag = async () => {
    if (!newTagData.name.trim()) {
      Alert.alert('Erro', 'Digite um nome para a tag.');
      return;
    }

    try {
      setLoading(true);
      const result = await DatabaseManager.updateTag(
        editingTag.id,
        newTagData.name.trim(),
        newTagData.color,
        newTagData.icon
      );

      if (result.success) {
        await loadTags();
        setEditingTag(null);
        setNewTagData({ name: '', color: '#4CAF50', icon: '🏷️' });
        onTagsUpdated?.();
        Alert.alert('Sucesso', 'Tag atualizada com sucesso!');
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível atualizar a tag.');
      }
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a tag.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = (tag) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a tag "${tag.name}"?\n\nEsta ação não pode ser desfeita e a tag será removida de todos os versículos, favoritos e entradas do diário.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await DatabaseManager.deleteTag(tag.id);
              
              if (result.success) {
                await loadTags();
                onTagsUpdated?.();
                Alert.alert('Sucesso', 'Tag excluída com sucesso!');
              } else {
                Alert.alert('Erro', result.error || 'Não foi possível excluir a tag.');
              }
            } catch (error) {
              console.error('Erro ao excluir tag:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir a tag.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    setEditingTag(null);
    setNewTagData({ name: '', color: '#4CAF50', icon: '🏷️' });
    setShowColorPicker(false);
    setShowIconPicker(false);
  };

  const renderTagItem = ({ item: tag }) => (
    <View style={styles.tagItem}>
      <View style={styles.tagPreview}>
        <View
          style={[
            styles.tagColorPreview,
            { backgroundColor: tag.color }
          ]}
        >
          <Text style={styles.tagIconPreview}>{tag.icon}</Text>
        </View>
        <View style={styles.tagInfo}>
          <Text style={styles.tagName}>{tag.name}</Text>
          <Text style={styles.tagMeta}>
            Cor: {tag.color} | Ícone: {tag.icon}
          </Text>
        </View>
      </View>
      
      <View style={styles.tagActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditTag(tag)}
        >
          <Ionicons name="pencil" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTag(tag)}
        >
          <Ionicons name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderColorPicker = () => (
    <Modal
      visible={showColorPicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowColorPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.colorPickerModal}>
          <Text style={styles.pickerTitle}>Escolher Cor</Text>
          <View style={styles.colorGrid}>
            {TAG_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  newTagData.color === color && styles.selectedColorOption
                ]}
                onPress={() => {
                  setNewTagData(prev => ({ ...prev, color }));
                  setShowColorPicker(false);
                }}
              >
                {newTagData.color === color && (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderIconPicker = () => (
    <Modal
      visible={showIconPicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowIconPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.iconPickerModal}>
          <Text style={styles.pickerTitle}>Escolher Ícone</Text>
          <View style={styles.iconGrid}>
            {TAG_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  newTagData.icon === icon && styles.selectedIconOption
                ]}
                onPress={() => {
                  setNewTagData(prev => ({ ...prev, icon }));
                  setShowIconPicker(false);
                }}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
          <Text style={styles.headerTitle}>Gerenciar Tags</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingTag ? 'Editar Tag' : 'Criar Nova Tag'}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome da Tag</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Digite o nome da tag"
              value={newTagData.name}
              onChangeText={(text) => setNewTagData(prev => ({ ...prev, name: text }))}
              maxLength={20}
            />
            <Text style={styles.charCounter}>{newTagData.name.length}/20</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cor</Text>
              <TouchableOpacity
                style={styles.colorSelector}
                onPress={() => setShowColorPicker(true)}
              >
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: newTagData.color }
                  ]}
                />
                <Text style={styles.colorText}>{newTagData.color}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ícone</Text>
              <TouchableOpacity
                style={styles.iconSelector}
                onPress={() => setShowIconPicker(true)}
              >
                <Text style={styles.iconPreview}>{newTagData.icon}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formActions}>
            {editingTag && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!newTagData.name.trim() || loading) && styles.saveButtonDisabled
              ]}
              onPress={editingTag ? handleUpdateTag : handleCreateTag}
              disabled={!newTagData.name.trim() || loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Salvando...' : (editingTag ? 'Atualizar' : 'Criar')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tags List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            Minhas Tags ({tags.length})
          </Text>
          
          {tags.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetag-outline" size={48} color="#CCC" />
              <Text style={styles.emptyStateText}>
                Nenhuma tag criada ainda
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Crie sua primeira tag para organizar seus versículos
              </Text>
            </View>
          ) : (
            <FlatList
              data={tags}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTagItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Color Picker Modal */}
        {renderColorPicker()}

        {/* Icon Picker Modal */}
        {renderIconPicker()}
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
  form: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  charCounter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    width: '48%',
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  colorText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    width: '48%',
  },
  iconPreview: {
    fontSize: 20,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10