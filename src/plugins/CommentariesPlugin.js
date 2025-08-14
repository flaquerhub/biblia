import * as FileSystem from 'expo-file-system';

class CommentariesPlugin {
  constructor() {
    this.name = 'comentarios';
    this.commentaries = new Map();
    this.sources = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      await this.scanCommentaryModules();
      this.initialized = true;
      console.log('✅ Plugin de Comentários inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar plugin de comentários:', error);
    }
  }

  async scanCommentaryModules() {
    const commentaryPaths = [
      'padres-igreja',
      'aquino',
      'agostinho',
      'jeronimo'
    ];

    for (const source of commentaryPaths) {
      try {
        const sourcePath = `${FileSystem.bundleDirectory}assets/comentarios/${source}/`;
        const files = await FileSystem.readDirectoryAsync(sourcePath);
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            await this.loadCommentaryFile(source, file);
          }
        }
      } catch (error) {
        console.log(`📁 Pasta ${source} não encontrada, criando dados de exemplo...`);
        this.createSampleCommentaries(source);
      }
    }
  }

  createSampleCommentaries(source) {
    const sampleCommentaries = {
      'padres-igreja': {
        'Mt.1.1': {
          titulo: 'A genealogia de Jesus Cristo',
          comentarios: [
            {
              autor: 'São João Crisóstomo',
              texto: 'A genealogia mostra que Cristo é verdadeiramente Deus e verdadeiramente homem, cumprindo as promessas feitas aos patriarcas.',
              fonte: 'Homilias sobre Mateus',
              categoria: 'exegese'
            },
            {
              autor: 'Santo Agostinho',
              texto: 'Jesus Cristo é chamado filho de Davi porque Deus prometeu a Davi que de sua descendência nasceria o Cristo.',
              fonte: 'Questões sobre os Evangelhos',
              categoria: 'teologia'
            }
          ]
        },
        'Gn.1.1': {
          titulo: 'No princípio, Deus criou',
          comentarios: [
            {
              autor: 'São Basílio Magno',
              texto: 'No princípio significa antes de todos os tempos. Não havia nada co-eterno com Deus, exceto o Filho e o Espírito Santo.',
              fonte: 'Homilias sobre o Hexaemeron',
              categoria: 'cosmologia'
            }
          ]
        }
      }
    };

    const sourceData = sampleCommentaries[source];
    if (sourceData) {
      Object.entries(sourceData).forEach(([verseId, commentary]) => {
        this.commentaries.set(verseId, {
          ...commentary,
          source,
          loadedAt: new Date().toISOString()
        });
      });
    }
  }

  async loadCommentaryFile(source, fileName) {
    try {
      const filePath = `${FileSystem.bundleDirectory}assets/comentarios/${source}/${fileName}`;
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const commentaryData = JSON.parse(fileContent);

      Object.entries(commentaryData).forEach(([verseId, commentary]) => {
        this.commentaries.set(verseId, {
          ...commentary,
          source,
          fileName,
          loadedAt: new Date().toISOString()
        });
      });

      console.log(`📝 Comentários carregados: ${fileName} (${source})`);
    } catch (error) {
      console.error(`❌ Erro ao carregar ${fileName}:`, error);
    }
  }

  getVerseId(testament, book, chapter, verse) {
    const bookAbbr = this.getBookAbbr(book);
    return `${bookAbbr}.${chapter}.${verse}`;
  }

  getCommentaries(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    return this.commentaries.get(verseId) || null;
  }

  hasCommentaries(testament, book, chapter, verse) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    return this.commentaries.has(verseId);
  }

  getCommentariesBySource(source) {
    const result = [];
    this.commentaries.forEach((commentary, verseId) => {
      if (commentary.source === source) {
        result.push({
          verseId,
          ...commentary
        });
      }
    });
    return result;
  }

  searchCommentaries(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    this.commentaries.forEach((commentary, verseId) => {
      // Buscar no título
      if (commentary.titulo?.toLowerCase().includes(searchTerm)) {
        results.push({
          verseId,
          type: 'titulo',
          text: commentary.titulo,
          source: commentary.source,
          ...this.parseVerseId(verseId)
        });
      }

      // Buscar nos comentários
      commentary.comentarios?.forEach((comentario) => {
        if (comentario.texto.toLowerCase().includes(searchTerm) || 
            comentario.autor.toLowerCase().includes(searchTerm)) {
          results.push({
            verseId,
            type: 'comentario',
            text: comentario.texto,
            author: comentario.autor,
            source: comentario.fonte || commentary.source,
            category: comentario.categoria,
            ...this.parseVerseId(verseId)
          });
        }
      });
    });

    return results.slice(0, 50);
  }

  parseVerseId(verseId) {
    const parts = verseId.split('.');
    if (parts.length >= 3) {
      return {
        bookAbbr: parts[0],
        chapter: parts[1],
        verse: parts[2]
      };
    }
    return {};
  }

  getBookAbbr(bookName) {
    const abbreviations = {
      'genesis': 'Gn',
      'êxodo': 'Ex',
      'levítico': 'Lv',
      'números': 'Nm',
      'deuteronômio': 'Dt',
      'josué': 'Js',
      'juízes': 'Jz',
      'rute': 'Rt',
      'mateus': 'Mt',
      'marcos': 'Mc',
      'lucas': 'Lc',
      'joão': 'Jo',
      'atos': 'At',
      'romanos': 'Rm',
      'coríntios': 'Cor',
      'gálatas': 'Gl',
      'efésios': 'Ef',
      'filipenses': 'Fl',
      'colossenses': 'Cl',
      'tessalonicenses': 'Ts',
      'timóteo': 'Tm',
      'tito': 'Tt',
      'filêmon': 'Fm',
      'hebreus': 'Hb',
      'tiago': 'Tg',
      'pedro': 'Pd',
      'apocalipse': 'Ap'
    };
    
    return abbreviations[bookName.toLowerCase()] || bookName.substring(0, 2).toUpperCase();
  }

  getAvailableSources() {
    const sources = new Set();
    this.commentaries.forEach((commentary) => {
      sources.add(commentary.source);
    });
    return Array.from(sources);
  }

  getCommentariesCount() {
    return this.commentaries.size;
  }

  getAuthors() {
    const authors = new Set();
    this.commentaries.forEach((commentary) => {
      commentary.comentarios?.forEach((comentario) => {
        authors.add(comentario.autor);
      });
    });
    return Array.from(authors).sort();
  }

  getCommentariesByAuthor(authorName) {
    const results = [];
    this.commentaries.forEach((commentary, verseId) => {
      commentary.comentarios?.forEach((comentario) => {
        if (comentario.autor.toLowerCase().includes(authorName.toLowerCase())) {
          results.push({
            verseId,
            text: comentario.texto,
            author: comentario.autor,
            source: comentario.fonte || commentary.source,
            title: commentary.titulo,
            ...this.parseVerseId(verseId)
          });
        }
      });
    });
    return results;
  }

  getContext(testament, book, chapter, verse) {
    const commentary = this.getCommentaries(testament, book, chapter, verse);
    
    return {
      hasCommentaries: !!commentary,
      commentariesCount: commentary?.comentarios?.length || 0,
      title: commentary?.titulo,
      source: commentary?.source,
      authors: commentary?.comentarios?.map(c => c.autor) || []
    };
  }

  async addCustomCommentary(testament, book, chapter, verse, commentaryData) {
    const verseId = this.getVerseId(testament, book, chapter, verse);
    
    const customCommentary = {
      titulo: commentaryData.title || 'Comentário pessoal',
      comentarios: [{
        autor: 'Usuário',
        texto: commentaryData.text,
        fonte: 'Anotação pessoal',
        categoria: 'pessoal',
        dateAdded: new Date().toISOString()
      }],
      source: 'custom',
      loadedAt: new Date().toISOString()
    };

    this.commentaries.set(verseId, customCommentary);
    
    // Salvar no AsyncStorage para comentários personalizados
    try {
      const customCommentaries = await AsyncStorage.getItem('@biblia_custom_commentaries');
      const parsed = customCommentaries ? JSON.parse(customCommentaries) : {};
      parsed[verseId] = customCommentary;
      await AsyncStorage.setItem('@biblia_custom_commentaries', JSON.stringify(parsed));
    } catch (error) {
      console.error('Erro ao salvar comentário personalizado:', error);
    }
  }
}

export default CommentariesPlugin;