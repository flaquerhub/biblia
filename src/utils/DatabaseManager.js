import * as SQLite from 'expo-sqlite';

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('biblia_catolica.db');
      await this.createTables();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }

  async createTables() {
    const createTablesSQL = `
      -- Tabela de marcações de versículos
      CREATE TABLE IF NOT EXISTS verse_markings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        chapter_id INTEGER NOT NULL,
        verse_id INTEGER NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id, chapter_id, verse_id)
      );

      -- Tabela de tags personalizadas
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL DEFAULT '#4CAF50',
        icon TEXT DEFAULT '🏷️',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela de favoritos
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        chapter_id INTEGER NOT NULL,
        verse_id INTEGER NOT NULL,
        verse_text TEXT NOT NULL,
        book_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id, chapter_id, verse_id)
      );

      -- Tabela de relacionamento: marcações com tags
      CREATE TABLE IF NOT EXISTS marking_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marking_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY (marking_id) REFERENCES verse_markings (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
        UNIQUE(marking_id, tag_id)
      );

      -- Tabela de relacionamento: favoritos com tags
      CREATE TABLE IF NOT EXISTS favorite_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        favorite_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY (favorite_id) REFERENCES favorites (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
        UNIQUE(favorite_id, tag_id)
      );

      -- Tabela de anotações pessoais
      CREATE TABLE IF NOT EXISTS verse_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        chapter_id INTEGER NOT NULL,
        verse_id INTEGER NOT NULL,
        note_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id, chapter_id, verse_id)
      );

      -- Tabela de diário espiritual
      CREATE TABLE IF NOT EXISTS spiritual_diary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        template_type TEXT NOT NULL,
        content TEXT NOT NULL,
        book_id INTEGER,
        chapter_id INTEGER,
        verse_id INTEGER,
        verse_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela de relacionamento: diário com tags
      CREATE TABLE IF NOT EXISTS diary_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        diary_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        FOREIGN KEY (diary_id) REFERENCES spiritual_diary (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
        UNIQUE(diary_id, tag_id)
      );

      -- Tabela de configurações do usuário
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Índices para melhor performance
      CREATE INDEX IF NOT EXISTS idx_verse_markings_location ON verse_markings(book_id, chapter_id, verse_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_location ON favorites(book_id, chapter_id, verse_id);
      CREATE INDEX IF NOT EXISTS idx_verse_notes_location ON verse_notes(book_id, chapter_id, verse_id);
      CREATE INDEX IF NOT EXISTS idx_diary_created_at ON spiritual_diary(created_at);
      CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
    `;

    await this.db.execAsync(createTablesSQL);

    // Inserir tags padrão se não existirem
    await this.insertDefaultTags();
  }

  async insertDefaultTags() {
    const defaultTags = [
      { name: 'Fé', color: '#4CAF50', icon: '✝️' },
      { name: 'Esperança', color: '#2196F3', icon: '🕊️' },
      { name: 'Amor', color: '#E91E63', icon: '❤️' },
      { name: 'Evangelização', color: '#FF9800', icon: '📢' },
      { name: 'Promessas', color: '#9C27B0', icon: '🤝' },
      { name: 'Oração', color: '#607D8B', icon: '🙏' },
      { name: 'Propósitos', color: '#795548', icon: '🎯' },
      { name: 'Gratidão', color: '#FFEB3B', icon: '🙌' },
      { name: 'Perdão', color: '#00BCD4', icon: '🕊️' },
      { name: 'Sabedoria', color: '#FF5722', icon: '📚' }
    ];

    for (const tag of defaultTags) {
      try {
        await this.db.runAsync(
          'INSERT OR IGNORE INTO tags (name, color, icon) VALUES (?, ?, ?)',
          [tag.name, tag.color, tag.icon]
        );
      } catch (error) {
        console.warn(`Tag já existe: ${tag.name}`);
      }
    }
  }

  // =============================================
  // MARCAÇÕES DE VERSÍCULOS
  // =============================================

  async saveVerseMarking(bookId, chapterId, verseId, color, tags = []) {
    try {
      // Inserir ou atualizar marcação
      const result = await this.db.runAsync(
        `INSERT OR REPLACE INTO verse_markings 
         (book_id, chapter_id, verse_id, color, updated_at) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [bookId, chapterId, verseId, color]
      );

      const markingId = result.lastInsertRowId;

      // Limpar tags antigas desta marcação
      await this.db.runAsync(
        'DELETE FROM marking_tags WHERE marking_id = ?',
        [markingId]
      );

      // Inserir novas tags
      for (const tag of tags) {
        await this.db.runAsync(
          'INSERT OR IGNORE INTO marking_tags (marking_id, tag_id) VALUES (?, ?)',
          [markingId, tag.id]
        );
      }

      return { success: true, markingId };
    } catch (error) {
      console.error('Erro ao salvar marcação:', error);
      return { success: false, error: error.message };
    }
  }

  async getVerseMarking(bookId, chapterId, verseId) {
    try {
      const marking = await this.db.getFirstAsync(
        `SELECT vm.*, GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names, 
                GROUP_CONCAT(t.color) as tag_colors, GROUP_CONCAT(t.icon) as tag_icons
         FROM verse_markings vm
         LEFT JOIN marking_tags mt ON vm.id = mt.marking_id
         LEFT JOIN tags t ON mt.tag_id = t.id
         WHERE vm.book_id = ? AND vm.chapter_id = ? AND vm.verse_id = ?`,
        [bookId, chapterId, verseId]
      );

      if (!marking) return null;

      // Parse tags
      const tags = [];
      if (marking.tag_ids) {
        const ids = marking.tag_ids.split(',');
        const names = marking.tag_names.split(',');
        const colors = marking.tag_colors.split(',');
        const icons = marking.tag_icons.split(',');

        for (let i = 0; i < ids.length; i++) {
          tags.push({
            id: parseInt(ids[i]),
            name: names[i],
            color: colors[i],
            icon: icons[i]
          });
        }
      }

      return {
        ...marking,
        tags
      };
    } catch (error) {
      console.error('Erro ao buscar marcação:', error);
      return null;
    }
  }

  async deleteVerseMarking(bookId, chapterId, verseId) {
    try {
      await this.db.runAsync(
        'DELETE FROM verse_markings WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
        [bookId, chapterId, verseId]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar marcação:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllMarkings() {
    try {
      const markings = await this.db.getAllAsync(`
        SELECT vm.*, 
               GROUP_CONCAT(t.id) as tag_ids, 
               GROUP_CONCAT(t.name) as tag_names,
               GROUP_CONCAT(t.color) as tag_colors,
               GROUP_CONCAT(t.icon) as tag_icons
        FROM verse_markings vm
        LEFT JOIN marking_tags mt ON vm.id = mt.marking_id
        LEFT JOIN tags t ON mt.tag_id = t.id
        GROUP BY vm.id
        ORDER BY vm.created_at DESC
      `);

      return markings.map(marking => {
        const tags = [];
        if (marking.tag_ids) {
          const ids = marking.tag_ids.split(',');
          const names = marking.tag_names.split(',');
          const colors = marking.tag_colors.split(',');
          const icons = marking.tag_icons.split(',');

          for (let i = 0; i < ids.length; i++) {
            tags.push({
              id: parseInt(ids[i]),
              name: names[i],
              color: colors[i],
              icon: icons[i]
            });
          }
        }
        return { ...marking, tags };
      });
    } catch (error) {
      console.error('Erro ao buscar todas as marcações:', error);
      return [];
    }
  }

  // =============================================
  // FAVORITOS
  // =============================================

  async addToFavorites(bookId, chapterId, verseId, verseText, bookName, tags = []) {
    try {
      const result = await this.db.runAsync(
        `INSERT OR REPLACE INTO favorites 
         (book_id, chapter_id, verse_id, verse_text, book_name) 
         VALUES (?, ?, ?, ?, ?)`,
        [bookId, chapterId, verseId, verseText, bookName]
      );

      const favoriteId = result.lastInsertRowId;

      // Limpar tags antigas
      await this.db.runAsync(
        'DELETE FROM favorite_tags WHERE favorite_id = ?',
        [favoriteId]
      );

      // Inserir novas tags
      for (const tag of tags) {
        await this.db.runAsync(
          'INSERT OR IGNORE INTO favorite_tags (favorite_id, tag_id) VALUES (?, ?)',
          [favoriteId, tag.id]
        );
      }

      return { success: true, favoriteId };
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      return { success: false, error: error.message };
    }
  }

  async removeFromFavorites(bookId, chapterId, verseId) {
    try {
      await this.db.runAsync(
        'DELETE FROM favorites WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
        [bookId, chapterId, verseId]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      return { success: false, error: error.message };
    }
  }

  async isFavorite(bookId, chapterId, verseId) {
    try {
      const result = await this.db.getFirstAsync(
        'SELECT id FROM favorites WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
        [bookId, chapterId, verseId]
      );
      return result !== null;
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }

  async getFavorites(tagId = null) {
    try {
      let query = `
        SELECT f.*, 
               GROUP_CONCAT(t.id) as tag_ids,
               GROUP_CONCAT(t.name) as tag_names,
               GROUP_CONCAT(t.color) as tag_colors,
               GROUP_CONCAT(t.icon) as tag_icons
        FROM favorites f
        LEFT JOIN favorite_tags ft ON f.id = ft.favorite_id
        LEFT JOIN tags t ON ft.tag_id = t.id
      `;

      let params = [];
      
      if (tagId) {
        query += ' WHERE ft.tag_id = ?';
        params.push(tagId);
      }

      query += ' GROUP BY f.id ORDER BY f.created_at DESC';

      const favorites = await this.db.getAllAsync(query, params);

      return favorites.map(favorite => {
        const tags = [];
        if (favorite.tag_ids) {
          const ids = favorite.tag_ids.split(',');
          const names = favorite.tag_names.split(',');
          const colors = favorite.tag_colors.split(',');
          const icons = favorite.tag_icons.split(',');

          for (let i = 0; i < ids.length; i++) {
            tags.push({
              id: parseInt(ids[i]),
              name: names[i],
              color: colors[i],
              icon: icons[i]
            });
          }
        }
        return { ...favorite, tags };
      });
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  }

  // =============================================
  // TAGS
  // =============================================

  async createTag(name, color = '#4CAF50', icon = '🏷️') {
    try {
      const result = await this.db.runAsync(
        'INSERT INTO tags (name, color, icon) VALUES (?, ?, ?)',
        [name, color, icon]
      );
      
      return {
        id: result.lastInsertRowId,
        name,
        color,
        icon,
        success: true
      };
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      return { success: false, error: error.message };
    }
  }

  async getTags() {
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM tags ORDER BY name ASC'
      );
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      return [];
    }
  }

  async updateTag(tagId, name, color, icon) {
    try {
      await this.db.runAsync(
        'UPDATE tags SET name = ?, color = ?, icon = ? WHERE id = ?',
        [name, color, icon, tagId]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTag(tagId) {
    try {
      await this.db.runAsync('DELETE FROM tags WHERE id = ?', [tagId]);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar tag:', error);
      return { success: false, error: error.message };
    }
  }

  // =============================================
  // ANOTAÇÕES
  // =============================================

  async saveVerseNote(bookId, chapterId, verseId, noteText) {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO verse_notes 
         (book_id, chapter_id, verse_id, note_text, updated_at) 
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [bookId, chapterId, verseId, noteText]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar anotação:', error);
      return { success: false, error: error.message };
    }
  }

  async getVerseNote(bookId, chapterId, verseId) {
    try {
      return await this.db.getFirstAsync(
        'SELECT * FROM verse_notes WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
        [bookId, chapterId, verseId]
      );
    } catch (error) {
      console.error('Erro ao buscar anotação:', error);
      return null;
    }
  }

  async deleteVerseNote(bookId, chapterId, verseId) {
    try {
      await this.db.runAsync(
        'DELETE FROM verse_notes WHERE book_id = ? AND chapter_id = ? AND verse_id = ?',
        [bookId, chapterId, verseId]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar anotação:', error);
      return { success: false, error: error.message };
    }
  }

  // =============================================
  // DIÁRIO ESPIRITUAL
  // =============================================

  async saveDiaryEntry(title, templateType, content, bookId = null, chapterId = null, verseId = null, verseText = null, tags = []) {
    try {
      const result = await this.db.runAsync(
        `INSERT INTO spiritual_diary 
         (title, template_type, content, book_id, chapter_id, verse_id, verse_text) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, templateType, content, bookId, chapterId, verseId, verseText]
      );

      const diaryId = result.lastInsertRowId;

      // Inserir tags do diário
      for (const tag of tags) {
        await this.db.runAsync(
          'INSERT OR IGNORE INTO diary_tags (diary_id, tag_id) VALUES (?, ?)',
          [diaryId, tag.id]
        );
      }

      return { success: true, diaryId };
    } catch (error) {
      console.error('Erro ao salvar entrada do diário:', error);
      return { success: false, error: error.message };
    }
  }

  async getDiaryEntries(orderBy = 'created_at', orderDirection = 'DESC', tagId = null) {
    try {
      let query = `
        SELECT sd.*, 
               GROUP_CONCAT(t.id) as tag_ids,
               GROUP_CONCAT(t.name) as tag_names,
               GROUP_CONCAT(t.color) as tag_colors,
               GROUP_CONCAT(t.icon) as tag_icons
        FROM spiritual_diary sd
        LEFT JOIN diary_tags dt ON sd.id = dt.diary_id
        LEFT JOIN tags t ON dt.tag_id = t.id
      `;

      let params = [];
      
      if (tagId) {
        query += ' WHERE dt.tag_id = ?';
        params.push(tagId);
      }

      query += ` GROUP BY sd.id ORDER BY sd.${orderBy} ${orderDirection}`;

      const entries = await this.db.getAllAsync(query, params);

      return entries.map(entry => {
        const tags = [];
        if (entry.tag_ids) {
          const ids = entry.tag_ids.split(',');
          const names = entry.tag_names.split(',');
          const colors = entry.tag_colors.split(',');
          const icons = entry.tag_icons.split(',');

          for (let i = 0; i < ids.length; i++) {
            tags.push({
              id: parseInt(ids[i]),
              name: names[i],
              color: colors[i],
              icon: icons[i]
            });
          }
        }
        return { ...entry, tags };
      });
    } catch (error) {
      console.error('Erro ao buscar entradas do diário:', error);
      return [];
    }
  }

  async updateDiaryEntry(diaryId, title, content, tags = []) {
    try {
      await this.db.runAsync(
        'UPDATE spiritual_diary SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, diaryId]
      );

      // Atualizar tags
      await this.db.runAsync(
        'DELETE FROM diary_tags WHERE diary_id = ?',
        [diaryId]
      );

      for (const tag of tags) {
        await this.db.runAsync(
          'INSERT OR IGNORE INTO diary_tags (diary_id, tag_id) VALUES (?, ?)',
          [diaryId, tag.id]
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar entrada do diário:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteDiaryEntry(diaryId) {
    try {
      await this.db.runAsync('DELETE FROM spiritual_diary WHERE id = ?', [diaryId]);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar entrada do diário:', error);
      return { success: false, error: error.message };
    }
  }

  // =============================================
  // CONFIGURAÇÕES
  // =============================================

  async setSetting(key, value) {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO user_settings (setting_key, setting_value, updated_at) 
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, JSON.stringify(value)]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return { success: false, error: error.message };
    }
  }

  async getSetting(key, defaultValue = null) {
    try {
      const result = await this.db.getFirstAsync(
        'SELECT setting_value FROM user_settings WHERE setting_key = ?',
        [key]
      );
      
      if (result) {
        return JSON.parse(result.setting_value);
      }
      
      return defaultValue;
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      return defaultValue;
    }
  }

  // =============================================
  // ESTATÍSTICAS E RELATÓRIOS
  // =============================================

  async getStatistics() {
    try {
      const stats = {};

      // Contar marcações
      const markingsCount = await this.db.getFirstAsync(
        'SELECT COUNT(*) as count FROM verse_markings'
      );
      stats.markings = markingsCount.count || 0;

      // Contar favoritos
      const favoritesCount = await this.db.getFirstAsync(
        'SELECT COUNT(*) as count FROM favorites'
      );
      stats.favorites = favoritesCount.count || 0;

      // Contar anotações
      const notesCount = await this.db.getFirstAsync(
        'SELECT COUNT(*) as count FROM verse_notes'
      );
      stats.notes = notesCount.count || 0;

      // Contar entradas do diário
      const diaryCount = await this.db.getFirstAsync(
        'SELECT COUNT(*) as count FROM spiritual_diary'
      );
      stats.diary = diaryCount.count || 0;

      // Contar tags
      const tagsCount = await this.db.getFirstAsync(
        'SELECT COUNT(*) as count FROM tags'
      );
      stats.tags = tagsCount.count || 0;

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        markings: 0,
        favorites: 0,
        notes: 0,
        diary: 0,
        tags: 0
      };
    }
  }
}

// Instância única (Singleton)
const databaseManager = new DatabaseManager();
export default databaseManager;