import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import DatabaseManager from './DatabaseManager';

class BackupManager {
  constructor() {
    this.backupDirectory = `${FileSystem.documentDirectory}backups/`;
  }

  async ensureBackupDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(this.backupDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.backupDirectory, { intermediates: true });
    }
  }

  async createBackup() {
    try {
      await this.ensureBackupDirectory();

      // Buscar todos os dados do banco
      const backupData = {
        version: '1.0.0',
        created_at: new Date().toISOString(),
        app_name: 'Bíblia Católica',
        data: {
          markings: await DatabaseManager.getAllMarkings(),
          favorites: await DatabaseManager.getFavorites(),
          tags: await DatabaseManager.getTags(),
          notes: await this.getAllNotes(),
          diary: await DatabaseManager.getDiaryEntries(),
          settings: await this.getAllSettings()
        }
      };

      // Calcular estatísticas
      const stats = await DatabaseManager.getStatistics();

      // Nome do arquivo com timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fileName = `biblia_backup_${timestamp}.json`;
      const filePath = `${this.backupDirectory}${fileName}`;

      // Salvar arquivo
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(backupData, null, 2));

      return {
        success: true,
        filePath,
        fileName,
        stats,
        size: await this.getFileSize(filePath)
      };
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAllNotes() {
    try {
      // Como não temos um método direto, vamos buscar no banco
      return await DatabaseManager.db.getAllAsync(`
        SELECT * FROM verse_notes ORDER BY created_at DESC
      `);
    } catch (error) {
      console.error('Erro ao buscar anotações para backup:', error);
      return [];
    }
  }

  async getAllSettings() {
    try {
      return await DatabaseManager.db.getAllAsync(`
        SELECT * FROM user_settings ORDER BY setting_key
      `);
    } catch (error) {
      console.error('Erro ao buscar configurações para backup:', error);
      return [];
    }
  }

  async getFileSize(filePath) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      return fileInfo.size || 0;
    } catch (error) {
      return 0;
    }
  }

  async shareBackup(filePath) {
    try {
      await shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Compartilhar Backup - Bíblia Católica'
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao compartilhar backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async selectBackupFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets[0]) {
        return {
          success: true,
          file: result.assets[0]
        };
      }

      return { success: false, cancelled: true };
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async restoreBackup(fileUri) {
    try {
      // Ler arquivo de backup
      const backupContent = await FileSystem.readAsStringAsync(fileUri);
      const backupData = JSON.parse(backupContent);

      // Validar estrutura do backup
      if (!this.validateBackupData(backupData)) {
        throw new Error('Arquivo de backup inválido ou corrompido');
      }

      // Limpar dados existentes (opcional - pode ser configurável)
      await this.clearExistingData();

      // Restaurar dados
      await this.restoreData(backupData.data);

      return {
        success: true,
        stats: {
          markings: backupData.data.markings?.length || 0,
          favorites: backupData.data.favorites?.length || 0,
          tags: backupData.data.tags?.length || 0,
          notes: backupData.data.notes?.length || 0,
          diary: backupData.data.diary?.length || 0,
          settings: backupData.data.settings?.length || 0
        }
      };
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  validateBackupData(backupData) {
    try {
      // Verificar estrutura básica
      if (!backupData.version || !backupData.data) {
        return false;
      }

      // Verificar se tem pelo menos uma seção de dados
      const dataKeys = Object.keys(backupData.data);
      const expectedKeys = ['markings', 'favorites', 'tags', 'notes', 'diary', 'settings'];
      const hasValidKeys = dataKeys.some(key => expectedKeys.includes(key));

      return hasValidKeys;
    } catch (error) {
      return false;
    }
  }

  async clearExistingData() {
    try {
      // Limpar todas as tabelas (CUIDADO!)
      await DatabaseManager.db.runAsync('DELETE FROM marking_tags');
      await DatabaseManager.db.runAsync('DELETE FROM favorite_tags');
      await DatabaseManager.db.runAsync('DELETE FROM diary_tags');
      await DatabaseManager.db.runAsync('DELETE FROM verse_markings');
      await DatabaseManager.db.runAsync('DELETE FROM favorites');
      await DatabaseManager.db.runAsync('DELETE FROM verse_notes');
      await DatabaseManager.db.runAsync('DELETE FROM spiritual_diary');
      await DatabaseManager.db.runAsync('DELETE FROM user_settings');
      
      // Manter tags padrão - deletar apenas as personalizadas
      await DatabaseManager.db.runAsync(`
        DELETE FROM tags WHERE id NOT IN (
          SELECT id FROM tags WHERE name IN (
            'Fé', 'Esperança', 'Amor', 'Evangelização', 'Promessas',
            'Oração', 'Propósitos', 'Gratidão', 'Perdão', 'Sabedoria'
          )
        )
      `);
    } catch (error) {
      console.error('Erro ao limpar dados existentes:', error);
      throw error;
    }
  }

  async restoreData(data) {
    try {
      // Restaurar tags primeiro (dependências)
      if (data.tags) {
        for (const tag of data.tags) {
          if (tag.name && !this.isDefaultTag(tag.name)) {
            await DatabaseManager.createTag(tag.name, tag.color, tag.icon);
          }
        }
      }

      // Restaurar marcações
      if (data.markings) {
        for (const marking of data.markings) {
          await DatabaseManager.db.runAsync(`
            INSERT OR IGNORE INTO verse_markings 
            (book_id, chapter_id, verse_id, color, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            marking.book_id,
            marking.chapter_id,
            marking.verse_id,
            marking.color,
            marking.created_at,
            marking.updated_at
          ]);

          // Restaurar tags das marcações
          if (marking.tags) {
            const newMarkingId = await this.getMarkingId(
              marking.book_id,
              marking.chapter_id,
              marking.verse_id
            );

            for (const tag of marking.tags) {
              const tagId = await this.getTagIdByName(tag.name);
              if (tagId) {
                await DatabaseManager.db.runAsync(
                  'INSERT OR IGNORE INTO marking_tags (marking_id, tag_id) VALUES (?, ?)',
                  [newMarkingId, tagId]
                );
              }
            }
          }
        }
      }

      // Restaurar favoritos
      if (data.favorites) {
        for (const favorite of data.favorites) {
          await DatabaseManager.db.runAsync(`
            INSERT OR IGNORE INTO favorites 
            (book_id, chapter_id, verse_id, verse_text, book_name, created_at) 
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            favorite.book_id,
            favorite.chapter_id,
            favorite.verse_id,
            favorite.verse_text,
            favorite.book_name,
            favorite.created_at
          ]);

          // Restaurar tags dos favoritos
          if (favorite.tags) {
            const newFavoriteId = await this.getFavoriteId(
              favorite.book_id,
              favorite.chapter_id,
              favorite.verse_id
            );

            for (const tag of favorite.tags) {
              const tagId = await this.getTagIdByName(tag.name);
              if (tagId) {
                await DatabaseManager.db.runAsync(
                  'INSERT OR IGNORE INTO favorite_tags (favorite_id, tag_id) VALUES (?, ?)',
                  [newFavoriteId, tagId]
                );
              }
            }
          }
        }
      }

      // Restaurar anotações
      if (data.notes) {
        for (const note of data.notes) {
          await DatabaseManager.db.runAsync(`
            INSERT OR IGNORE INTO verse_notes 
            (book_id, chapter_id, verse_id, note_text, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            note.book_id,
            note.chapter_id,
            note.verse_id,
            note.note_text,
            note.created_at,
            note.updated_at
          ]);
        }
      }

      // Restaurar diário
      if (data.diary) {
        for (const entry of data.diary) {
          await DatabaseManager.db.runAsync(`
            INSERT OR IGNORE INTO spiritual_diary 
            (title, template_type, content, book_id, chapter_id, verse_id, verse_text, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            entry.title,
            entry.template_type,
            entry.content,
            entry.book_id,
            entry.chapter_id,
            entry.verse_id,
            entry.verse_text,
            entry.created_at,
            entry.updated_at
          ]);

          // Restaurar tags do diário
          if (entry.tags) {
            const newDiaryId = await this.getDiaryId(entry.title, entry.created_at);
            
            for (const tag of entry.tags) {
              const tagId = await this.getTagIdByName(tag.name);
              if (tagId) {
                await DatabaseManager.db.runAsync(
                  'INSERT OR IGNORE INTO diary_tags (diary_id, tag_id) VALUES (?, ?)',
                  [newDiaryId, tagId]
                );
              }
            }
          }
        }
      }

      // Restaurar configurações
      if (data.settings) {
        for (const setting of data.settings) {
          await DatabaseManager.db.runAsync(`
            INSERT OR REPLACE INTO user_settings 
            (setting_key, setting_value, updated_at) 
            VALUES (?, ?, ?)
          `, [
            setting.setting_key,
            setting.setting_value,
            setting.updated_at
          ]);
        }
      }

    } catch (error) {
      console.error('Erro ao restaurar dados:', error);
      throw error;
    }
  }

  // Métodos auxiliares para restauração
  isDefaultTag(tagName) {
    const defaultTags = ['Fé', 'Esperança', 'Amor', 'Evangelização', 'Promessas', 'Oração', 'Propósitos', 'Gratidão', 'Perdão', 'Sabedoria'];
    return defaultTags.includes(tagName);
  }

  async getMarkingId(bookId, chapterId, verseId) {
    const result = await DatabaseManager.db.getFirstAsync(
      'SELECT id FROM verse_markings WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
      [bookId, chapterId, verseId]
    );
    return result?.id;
  }

  async getFavoriteId(bookId, chapterId, verseId) {
    const result = await DatabaseManager.db.getFirstAsync(
      'SELECT id FROM favorites WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
      [bookId, chapterId, verseId]
    );
    return result?.id;
  }

  async getDiaryId(title, createdAt) {
    const result = await DatabaseManager.db.getFirstAsync(
      'SELECT id FROM spiritual_diary WHERE title = ? AND created_at = ?',
      [title, createdAt]
    );
    return result?.id;
  }

  async getTagIdByName(tagName) {
    const result = await DatabaseManager.db.getFirstAsync(
      'SELECT id FROM tags WHERE name = ?',
      [tagName]
    );
    return result?.id;
  }

  async getBackupsList() {
    try {
      await this.ensureBackupDirectory();
      
      const backupFiles = await FileSystem.readDirectoryAsync(this.backupDirectory);
      const backups = [];

      for (const fileName of backupFiles) {
        if (fileName.endsWith('.json')) {
          const filePath = `${this.backupDirectory}${fileName}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          
          backups.push({
            fileName,
            filePath,
            size: fileInfo.size,
            modificationTime: new Date(fileInfo.modificationTime * 1000),
            created: this.extractDateFromFileName(fileName)
          });
        }
      }

      // Ordenar por data de modificação (mais recente primeiro)
      backups.sort((a, b) => b.modificationTime - a.modificationTime);

      return backups;
    } catch (error) {
      console.error('Erro ao buscar lista de backups:', error);
      return [];
    }
  }

  extractDateFromFileName(fileName) {
    try {
      const match = fileName.match(/biblia_backup_(.+)\.json/);
      if (match) {
        const dateStr = match[1].replace(/-/g, ':');
        return new Date(dateStr + 'Z');
      }
    } catch (error) {
      console.error('Erro ao extrair data do nome do arquivo:', error);
    }
    return new Date();
  }

  async deleteBackup(fileName) {
    try {
      const filePath = `${this.backupDirectory}${fileName}`;
      await FileSystem.deleteAsync(filePath);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instância única
const backupManager = new BackupManager();
export default backupManager;