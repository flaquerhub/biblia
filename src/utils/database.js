import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseManager {
  constructor() {
    this.database = null;
  }

  async openDatabase() {
    if (!this.database) {
      this.database = await SQLite.openDatabase({
        name: 'biblia_catolica.db',
        location: 'default',
      });
      
      await this.createTables();
    }
    return this.database;
  }

  async createTables() {
    const db = await this.openDatabase();
    
    // Tabela de marcações
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS markings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_key TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        color TEXT NOT NULL,
        background_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de tags personalizadas
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de favoritos
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_key TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        tag_id INTEGER,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tag_id) REFERENCES tags (id)
      )
    `);

    // Tabela do diário espiritual
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS spiritual_diary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        book_key TEXT,
        chapter INTEGER,
        verse INTEGER,
        date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de configurações
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // Inserir configurações padrão
    await this.initDefaultSettings();
  }

  async initDefaultSettings() {
    const db = await this.openDatabase();
    
    const defaultSettings = [
      ['palavra_do_dia_enabled', 'true'],
      ['palavra_do_dia_time', '07:00'],
      ['palavra_do_dia_frequency', 'daily'],
      ['notification_sound', 'true'],
      ['backup_auto', 'false']
    ];

    for (const [key, value] of defaultSettings) {
      await db.executeSql(
        'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
        [key, value]
      );
    }
  }

  // CRUD para Marcações
  async addMarking(bookKey, chapter, verse, color, backgroundImage = null) {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'INSERT INTO markings (book_key, chapter, verse, color, background_image) VALUES (?, ?, ?, ?, ?)',
      [bookKey, chapter, verse, color, backgroundImage]
    );
    return result[0].insertId;
  }

  async getMarkings(bookKey, chapter) {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'SELECT * FROM markings WHERE book_key = ? AND chapter = ?',
      [bookKey, chapter]
    );
    return result[0].rows.raw();
  }

  async removeMarking(bookKey, chapter, verse) {
    const db = await this.openDatabase();
    await db.executeSql(
      'DELETE FROM markings WHERE book_key = ? AND chapter = ? AND verse = ?',
      [bookKey, chapter, verse]
    );
  }

  // CRUD para Tags
  async addTag(name, color) {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'INSERT INTO tags (name, color) VALUES (?, ?)',
      [name, color]
    );
    return result[0].insertId;
  }

  async getAllTags() {
    const db = await this.openDatabase();
    const result = await db.executeSql('SELECT * FROM tags ORDER BY name');
    return result[0].rows.raw();
  }

  async deleteTag(id) {
    const db = await this.openDatabase();
    await db.executeSql('DELETE FROM tags WHERE id = ?', [id]);
    await db.executeSql('DELETE FROM favorites WHERE tag_id = ?', [id]);
  }

  // CRUD para Favoritos
  async addFavorite(bookKey, chapter, verse, tagId, note = '') {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'INSERT INTO favorites (book_key, chapter, verse, tag_id, note) VALUES (?, ?, ?, ?, ?)',
      [bookKey, chapter, verse, tagId, note]
    );
    return result[0].insertId;
  }

  async getFavoritesByTag(tagId) {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'SELECT f.*, t.name as tag_name, t.color as tag_color FROM favorites f LEFT JOIN tags t ON f.tag_id = t.id WHERE f.tag_id = ? ORDER BY f.created_at DESC',
      [tagId]
    );
    return result[0].rows.raw();
  }

  async getAllFavorites() {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'SELECT f.*, t.name as tag_name, t.color as tag_color FROM favorites f LEFT JOIN tags t ON f.tag_id = t.id ORDER BY f.created_at DESC'
    );
    return result[0].rows.raw();
  }

  // CRUD para Diário Espiritual
  async addDiaryEntry(templateType, title, content, bookKey, chapter, verse, date) {
    const db = await this.openDatabase();
    const result = await db.executeSql(
      'INSERT INTO spiritual_diary (template_type, title, content, book_key, chapter, verse, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [templateType, title, content, bookKey, chapter, verse, date]
    );
    return result[0].insertId;
  }

  async getDiaryEntries(orderBy = 'date') {
    const db = await this.openDatabase();
    let orderClause = 'ORDER BY created_at DESC';
    
    switch (orderBy) {
      case 'date':
        orderClause = 'ORDER BY date DESC';
        break;
      case 'book':
        orderClause = 'ORDER BY book_key, chapter, verse';
        break;
      case 'template':
        orderClause = 'ORDER BY template_type';
        break;
    }

    const result = await db.executeSql(`SELECT * FROM spiritual_diary ${orderClause}`);
    return result[0].rows.raw();
  }

  // Configurações
  async getSetting(key) {
    const db = await this.openDatabase();
    const result = await db.executeSql('SELECT value FROM settings WHERE key = ?', [key]);
    return result[0].rows.length > 0 ? result[0].rows.item(0).value : null;
  }

  async setSetting(key, value) {
    const db = await this.openDatabase();
    await db.executeSql(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  }

  // Export para backup
  async exportData() {
    const db = await this.openDatabase();
    
    const data = {
      markings: [],
      tags: [],
      favorites: [],
      spiritual_diary: [],
      settings: [],
      version: '1.0',
      export_date: new Date().toISOString()
    };

    // Exportar cada tabela
    const tables = ['markings', 'tags', 'favorites', 'spiritual_diary', 'settings'];
    
    for (const table of tables) {
      const result = await db.executeSql(`SELECT * FROM ${table}`);
      data[table] = result[0].rows.raw();
    }

    return data;
  }

  // Import para restore
  async importData(data) {
    const db = await this.openDatabase();
    
    try {
      await db.transaction(async (tx) => {
        // Limpar dados existentes
        await tx.executeSql('DELETE FROM favorites');
        await tx.executeSql('DELETE FROM markings');
        await tx.executeSql('DELETE FROM spiritual_diary');
        await tx.executeSql('DELETE FROM tags');
        await tx.executeSql('DELETE FROM settings');

        // Importar tags primeiro (referência para favoritos)
        for (const tag of data.tags || []) {
          await tx.executeSql(
            'INSERT INTO tags (id, name, color, created_at) VALUES (?, ?, ?, ?)',
            [tag.id, tag.name, tag.color, tag.created_at]
          );
        }

        // Importar marcações
        for (const marking of data.markings || []) {
          await tx.executeSql(
            'INSERT INTO markings (book_key, chapter, verse, color, background_image, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [marking.book_key, marking.chapter, marking.verse, marking.color, marking.background_image, marking.created_at]
          );
        }

        // Importar favoritos
        for (const favorite of data.favorites || []) {
          await tx.executeSql(
            'INSERT INTO favorites (book_key, chapter, verse, tag_id, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [favorite.book_key, favorite.chapter, favorite.verse, favorite.tag_id, favorite.note, favorite.created_at]
          );
        }

        // Importar diário espiritual
        for (const entry of data.spiritual_diary || []) {
          await tx.executeSql(
            'INSERT INTO spiritual_diary (template_type, title, content, book_key, chapter, verse, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [entry.template_type, entry.title, entry.content, entry.book_key, entry.chapter, entry.verse, entry.date, entry.created_at]
          );
        }

        // Importar configurações
        for (const setting of data.settings || []) {
          await tx.executeSql(
            'INSERT INTO settings (key, value) VALUES (?, ?)',
            [setting.key, setting.value]
          );
        }
      });

      return { success: true, message: 'Dados importados com sucesso!' };
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return { success: false, message: 'Erro ao importar dados: ' + error.message };
    }
  }
}

export default new DatabaseManager();