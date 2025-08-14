import AsyncStorage from '@react-native-async-storage/async-storage';

class FavoritesPlugin {
  constructor() {
    this.name = 'favoritos';
    this.favorites = new Set();
    this.highlights = new Set();
    this.notes = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      await this.loadUserData();
      this.initialized = true;
      console.log('✅ Plugin de Favoritos inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar plugin de favoritos:', error);
    }
  }

  async loadUserData() {
    try {
      const favoritesData = await AsyncStorage.getItem('@biblia_favorites');
      const highlightsData = await AsyncStorage.getItem('@biblia_highlights');
      const notesData = await AsyncStorage.getItem('@biblia_notes');

      if (favoritesData) {
        const favorites = JSON.parse(favoritesData);
        this.favorites = new Set(favorites.map(f => f.id));
      }

      if (highlightsData) {
        const highlights = JSON.parse(highlightsData);
        this.highlights = new Set(highlights.map(h => h.id));
      }

      if (notesData) {
        const notes = JSON.parse(notesData);
        this.notes = new Map(Object.entries(notes));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  async saveUserData() {
    try {
      const favoritesArray = await this.getFavoritesArray();
      const highlightsArray = await this.getHighlightsArray();
      const notesObject = Object.fromEntries(this.notes);

      await AsyncStorage.setItem('@biblia_favorites', JSON.stringify(favoritesArray));
      await AsyncStorage.setItem('@biblia_highlights', JSON.stringify(highlightsArray));
      await AsyncStorage.setItem('@biblia_notes', JSON.stringify(notesObject));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  }

  getVerseId(testament, book, chapter, verse) {
    return `${testament}.${book}.${chapter}.${verse}`;
  }

  async toggleFavorite(testament, book, chapter, verse, verseText) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    
    if (this.favorites.has(verseId)) {
      this.favorites.delete(verseId);
    } else {
      this.favorites.add(verseId);
      
      // Salvar dados completos do versículo
      const favoriteData = {
        id: verseId,
        testament,
        book,
        chapter,
        verse,
        text: verseText,
        reference: `${this.getBookAbbr(book)} ${chapter}:${verse}`,
        dateAdded: new Date().toISOString()
      };
      
      const existingFavorites = await this.getFavoritesArray();
      const updatedFavorites = [...existingFavorites.filter(f => f.id !== verseId), favoriteData];
      await AsyncStorage.setItem('@biblia_favorites', JSON.stringify(updatedFavorites));
    }
    
    await this.saveUserData();
    return this.favorites.has(verseId);
  }

  async toggleHighlight(testament, book, chapter, verse, verseText, color = 'yellow') {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    
    if (this.highlights.has(verseId)) {
      this.highlights.delete(verseId);
    } else {
      this.highlights.add(verseId);
      
      // Salvar dados completos do highlight
      const highlightData = {
        id: verseId,
        testament,
        book,
        chapter,
        verse,
        text: verseText,
        reference: `${this.getBookAbbr(book)} ${chapter}:${verse}`,
        color,
        dateAdded: new Date().toISOString()
      };
      
      const existingHighlights = await this.getHighlightsArray();
      const updatedHighlights = [...existingHighlights.filter(h => h.id !== verseId), highlightData];
      await AsyncStorage.setItem('@biblia_highlights', JSON.stringify(updatedHighlights));
    }
    
    await this.saveUserData();
    return this.highlights.has(verseId);
  }

  async addNote(testament, book, chapter, verse, noteText) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    
    const noteData = {
      text: noteText,
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
    
    this.notes.set(verseId, noteData);
    await this.saveUserData();
  }

  async removeNote(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    this.notes.delete(verseId);
    await this.saveUserData();
  }

  isFavorite(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    return this.favorites.has(verseId);
  }

  isHighlighted(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    return this.highlights.has(verseId);
  }

  hasNote(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    return this.notes.has(verseId);
  }

  getNote(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    return this.notes.get(verseId);
  }

  async getFavoritesArray() {
    try {
      const data = await AsyncStorage.getItem('@biblia_favorites');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  }

  async getHighlightsArray() {
    try {
      const data = await AsyncStorage.getItem('@biblia_highlights');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar marcações:', error);
      return [];
    }
  }

  getBookAbbr(bookName) {
    const abbreviations = {
      'genesis': 'Gn',
      'exodo': 'Ex',
      'levitico': 'Lv',
      'numeros': 'Nm',
      'deuteronomio': 'Dt',
      'mateus': 'Mt',
      'marcos': 'Mc',
      'lucas': 'Lc',
      'joao': 'Jo',
      // Adicionar mais abreviações conforme necessário
    };
    
    return abbreviations[bookName.toLowerCase()] || bookName.substring(0, 2);
  }

  getContext(testament, book, chapter, verse) {
    return {
      isFavorite: this.isFavorite(testament, book, chapter, verse),
      isHighlighted: this.isHighlighted(testament, book, chapter, verse),
      hasNote: this.hasNote(testament, book, chapter, verse),
      note: this.getNote(testament, book, chapter, verse)
    };
  }

  async exportUserData() {
    const favorites = await this.getFavoritesArray();
    const highlights = await this.getHighlightsArray();
    const notes = Object.fromEntries(this.notes);
    
    return {
      favorites,
      highlights,
      notes,
      exportDate: new Date().toISOString()
    };
  }

  async importUserData(data) {
    try {
      if (data.favorites) {
        await AsyncStorage.setItem('@biblia_favorites', JSON.stringify(data.favorites));
        this.favorites = new Set(data.favorites.map(f => f.id));
      }
      
      if (data.highlights) {
        await AsyncStorage.setItem('@biblia_highlights', JSON.stringify(data.highlights));
        this.highlights = new Set(data.highlights.map(h => h.id));
      }
      
      if (data.notes) {
        await AsyncStorage.setItem('@biblia_notes', JSON.stringify(data.notes));
        this.notes = new Map(Object.entries(data.notes));
      }
      
      console.log('✅ Dados importados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao importar dados:', error);
      throw error;
    }
  }
}

export default FavoritesPlugin;