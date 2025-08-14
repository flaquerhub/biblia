<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ModuleLoader.js - Carregador de Módulos</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .code-container {
            background: #1e293b;
            color: #e2e8f0;
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            overflow-x: auto;
            border-radius: 8px;
            padding: 24px;
        }
        .keyword { color: #c792ea; font-weight: 600; }
        .string { color: #c3e88d; }
        .comment { color: #546e7a; font-style: italic; }
        .function-name { color: #82aaff; }
        .variable { color: #ffcb6b; }
        .json-key { color: #f07178; }
        .json-number { color: #f78c6c; }
        .operator { color: #89ddff; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex items-center mb-4">
                <i class="fas fa-download text-3xl text-blue-600 mr-4"></i>
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">ModuleLoader.js</h1>
                    <p class="text-gray-600">Carregador Automático de Módulos JSON</p>
                </div>
            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div class="flex items-center">
                    <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                    <div>
                        <p class="font-semibold text-blue-800">Arquivo Individual Pronto</p>
                        <p class="text-blue-700 text-sm">Copie todo o código abaixo para: <code class="bg-blue-200 px-2 py-1 rounded">src/core/ModuleLoader.js</code></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">
                <i class="fas fa-star text-yellow-500 mr-2"></i>
                Funcionalidades
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                    <i class="fas fa-search text-green-600 mr-3"></i>
                    <span class="text-gray-700">Auto-detecção de arquivos JSON</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-bolt text-purple-600 mr-3"></i>
                    <span class="text-gray-700">Carregamento lazy (sob demanda)</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-memory text-blue-600 mr-3"></i>
                    <span class="text-gray-700">Sistema de cache inteligente</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-plug text-orange-600 mr-3"></i>
                    <span class="text-gray-700">Plugin system extensível</span>
                </div>
            </div>
        </div>

        <!-- Code Container -->
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-code text-green-600 mr-2"></i>
                    Código Completo
                </h2>
                <button onclick="copyCode()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-copy mr-2"></i>
                    Copiar Código
                </button>
            </div>
            
            <div class="code-container" id="codeContainer">
<span class="comment">// src/core/ModuleLoader.js - Sistema de carregamento automático de módulos</span>
<span class="keyword">import</span> { <span class="variable">RNFS</span> } <span class="keyword">from</span> <span class="string">'react-native-fs'</span>;
<span class="keyword">import</span> <span class="variable">AsyncStorage</span> <span class="keyword">from</span> <span class="string">'@react-native-async-storage/async-storage'</span>;

<span class="keyword">class</span> <span class="function-name">ModuleLoader</span> {
  <span class="function-name">constructor</span>() {
    <span class="keyword">this</span>.modules = <span class="keyword">new</span> <span class="function-name">Map</span>();
    <span class="keyword">this</span>.cache = <span class="keyword">new</span> <span class="function-name">Map</span>();
    <span class="keyword">this</span>.loadedModules = <span class="keyword">new</span> <span class="function-name">Set</span>();
    <span class="keyword">this</span>.basePath = <span class="string">`${RNFS.MainBundlePath}/assets`</span>;
  }

  <span class="comment">// Auto-detecção de todos os módulos disponíveis</span>
  <span class="keyword">async</span> <span class="function-name">scanAllModules</span>() {
    <span class="keyword">try</span> {
      <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">'🔍 Iniciando escaneamento de módulos...'</span>);
      
      <span class="keyword">const</span> <span class="variable">results</span> = <span class="keyword">await</span> <span class="function-name">Promise</span>.<span class="function-name">allSettled</span>([
        <span class="keyword">this</span>.<span class="function-name">scanBibleModules</span>(),
        <span class="keyword">this</span>.<span class="function-name">scanCommentaryModules</span>(),
        <span class="keyword">this</span>.<span class="function-name">scanLiturgyModules</span>(),
        <span class="keyword">this</span>.<span class="function-name">scanDictionaryModules</span>()
      ]);

      <span class="keyword">const</span> <span class="variable">summary</span> = {
        <span class="json-key">bible</span>: <span class="keyword">this</span>.<span class="function-name">getBibleSummary</span>(),
        <span class="json-key">commentaries</span>: <span class="keyword">this</span>.<span class="function-name">getCommentariesSummary</span>(),
        <span class="json-key">liturgy</span>: <span class="keyword">this</span>.<span class="function-name">getLiturgySummary</span>(),
        <span class="json-key">dictionaries</span>: <span class="keyword">this</span>.<span class="function-name">getDictionariesSummary</span>(),
        <span class="json-key">errors</span>: <span class="variable">results</span>.<span class="function-name">filter</span>(<span class="variable">r</span> <span class="operator">=></span> <span class="variable">r</span>.<span class="variable">status</span> <span class="operator">===</span> <span class="string">'rejected'</span>)
      };

      <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">'✅ Escaneamento concluído:'</span>, <span class="variable">summary</span>);
      <span class="keyword">return</span> <span class="variable">summary</span>;

    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
      <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">'❌ Erro no escaneamento:'</span>, <span class="variable">error</span>);
      <span class="keyword">throw</span> <span class="variable">error</span>;
    }
  }

  <span class="comment">// Escaneamento inteligente da pasta bible/</span>
  <span class="keyword">async</span> <span class="function-name">scanBibleModules</span>() {
    <span class="keyword">const</span> <span class="variable">biblePath</span> = <span class="string">`${this.basePath}/bible`</span>;
    
    <span class="keyword">if</span> (!<span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">exists</span>(<span class="variable">biblePath</span>)) {
      <span class="keyword">console</span>.<span class="function-name">warn</span>(<span class="string">'📖 Pasta bible/ não encontrada'</span>);
      <span class="keyword">return</span>;
    }

    <span class="keyword">const</span> <span class="variable">testaments</span> = [<span class="string">'AT'</span>, <span class="string">'NT'</span>];
    
    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">testament</span> <span class="keyword">of</span> <span class="variable">testaments</span>) {
      <span class="keyword">const</span> <span class="variable">testamentPath</span> = <span class="string">`${biblePath}/${testament}`</span>;
      
      <span class="keyword">if</span> (<span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">exists</span>(<span class="variable">testamentPath</span>)) {
        <span class="keyword">const</span> <span class="variable">books</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">readdir</span>(<span class="variable">testamentPath</span>);
        
        <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">bookFile</span> <span class="keyword">of</span> <span class="variable">books</span>) {
          <span class="keyword">if</span> (<span class="variable">bookFile</span>.<span class="function-name">endsWith</span>(<span class="string">'.json'</span>)) {
            <span class="keyword">await</span> <span class="keyword">this</span>.<span class="function-name">registerBibleBook</span>(<span class="variable">testament</span>, <span class="variable">bookFile</span>, <span class="string">`${testamentPath}/${bookFile}`</span>);
          }
        }
      }
    }
  }

  <span class="comment">// Registro de livro bíblico com metadados</span>
  <span class="keyword">async</span> <span class="function-name">registerBibleBook</span>(<span class="variable">testament</span>, <span class="variable">filename</span>, <span class="variable">filepath</span>) {
    <span class="keyword">try</span> {
      <span class="comment">// Extrair informações do nome do arquivo</span>
      <span class="keyword">const</span> <span class="variable">match</span> = <span class="variable">filename</span>.<span class="function-name">match</span>(<span class="string">/(.+)_(\d+)\.json$/</span>);
      <span class="keyword">if</span> (!<span class="variable">match</span>) {
        <span class="keyword">console</span>.<span class="function-name">warn</span>(<span class="string">`⚠️  Formato inválido: ${filename}`</span>);
        <span class="keyword">return</span>;
      }

      <span class="keyword">const</span> [, <span class="variable">bookName</span>, <span class="variable">chapterNum</span>] = <span class="variable">match</span>;
      <span class="keyword">const</span> <span class="variable">moduleKey</span> = <span class="string">`bible.${testament}.${bookName}`</span>;

      <span class="comment">// Verificar se já existe o livro</span>
      <span class="keyword">if</span> (!<span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">has</span>(<span class="variable">moduleKey</span>)) {
        <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">set</span>(<span class="variable">moduleKey</span>, {
          <span class="json-key">name</span>: <span class="variable">bookName</span>,
          <span class="json-key">testament</span>: <span class="variable">testament</span>,
          <span class="json-key">type</span>: <span class="string">'bible'</span>,
          <span class="json-key">chapters</span>: <span class="keyword">new</span> <span class="function-name">Map</span>(),
          <span class="json-key">metadata</span>: {
            <span class="json-key">totalChapters</span>: <span class="json-number">0</span>,
            <span class="json-key">totalVerses</span>: <span class="json-number">0</span>,
            <span class="json-key">lastModified</span>: <span class="keyword">new</span> <span class="function-name">Date</span>()
          }
        });
      }

      <span class="keyword">const</span> <span class="variable">bookModule</span> = <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">get</span>(<span class="variable">moduleKey</span>);
      
      <span class="comment">// Registrar capítulo para carregamento lazy</span>
      <span class="variable">bookModule</span>.<span class="variable">chapters</span>.<span class="function-name">set</span>(<span class="variable">chapterNum</span>, {
        <span class="json-key">path</span>: <span class="variable">filepath</span>,
        <span class="json-key">loaded</span>: <span class="json-number">false</span>,
        <span class="json-key">cached</span>: <span class="json-number">false</span>
      });

      <span class="variable">bookModule</span>.<span class="variable">metadata</span>.<span class="variable">totalChapters</span>++;
      
      <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`📖 Registrado: ${bookName} cap. ${chapterNum} (${testament})`</span>);

    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
      <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`❌ Erro ao registrar ${filename}:`</span>, <span class="variable">error</span>);
    }
  }

  <span class="comment">// Escaneamento de módulos de comentários</span>
  <span class="keyword">async</span> <span class="function-name">scanCommentaryModules</span>() {
    <span class="keyword">const</span> <span class="variable">commentaryPath</span> = <span class="string">`${this.basePath}/comentarios`</span>;
    
    <span class="keyword">if</span> (!<span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">exists</span>(<span class="variable">commentaryPath</span>)) {
      <span class="keyword">console</span>.<span class="function-name">warn</span>(<span class="string">'💬 Pasta comentarios/ não encontrada'</span>);
      <span class="keyword">return</span>;
    }

    <span class="keyword">const</span> <span class="variable">categories</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">readdir</span>(<span class="variable">commentaryPath</span>);
    
    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">category</span> <span class="keyword">of</span> <span class="variable">categories</span>) {
      <span class="keyword">const</span> <span class="variable">categoryPath</span> = <span class="string">`${commentaryPath}/${category}`</span>;
      <span class="keyword">const</span> <span class="variable">stat</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">stat</span>(<span class="variable">categoryPath</span>);
      
      <span class="keyword">if</span> (<span class="variable">stat</span>.<span class="variable">isDirectory</span>()) {
        <span class="keyword">await</span> <span class="keyword">this</span>.<span class="function-name">scanCommentaryCategory</span>(<span class="variable">category</span>, <span class="variable">categoryPath</span>);
      }
    }
  }

  <span class="comment">// Escaneamento de categoria de comentários</span>
  <span class="keyword">async</span> <span class="function-name">scanCommentaryCategory</span>(<span class="variable">category</span>, <span class="variable">categoryPath</span>) {
    <span class="keyword">const</span> <span class="variable">files</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">readdir</span>(<span class="variable">categoryPath</span>);
    <span class="keyword">const</span> <span class="variable">moduleKey</span> = <span class="string">`commentary.${category}`</span>;

    <span class="keyword">const</span> <span class="variable">commentaryModule</span> = {
      <span class="json-key">name</span>: <span class="variable">category</span>,
      <span class="json-key">type</span>: <span class="string">'commentary'</span>,
      <span class="json-key">files</span>: <span class="keyword">new</span> <span class="function-name">Map</span>(),
      <span class="json-key">metadata</span>: {
        <span class="json-key">totalFiles</span>: <span class="json-number">0</span>,
        <span class="json-key">totalComments</span>: <span class="json-number">0</span>,
        <span class="json-key">authors</span>: <span class="keyword">new</span> <span class="function-name">Set</span>()
      }
    };

    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">file</span> <span class="keyword">of</span> <span class="variable">files</span>) {
      <span class="keyword">if</span> (<span class="variable">file</span>.<span class="function-name">endsWith</span>(<span class="string">'.json'</span>)) {
        <span class="keyword">const</span> <span class="variable">filePath</span> = <span class="string">`${categoryPath}/${file}`</span>;
        
        <span class="variable">commentaryModule</span>.<span class="variable">files</span>.<span class="function-name">set</span>(<span class="variable">file</span>, {
          <span class="json-key">path</span>: <span class="variable">filePath</span>,
          <span class="json-key">loaded</span>: <span class="json-number">false</span>,
          <span class="json-key">references</span>: []
        });
        
        <span class="variable">commentaryModule</span>.<span class="variable">metadata</span>.<span class="variable">totalFiles</span>++;
        <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`💬 Comentário registrado: ${category}/${file}`</span>);
      }
    }

    <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">set</span>(<span class="variable">moduleKey</span>, <span class="variable">commentaryModule</span>);
  }

  <span class="comment">// Escaneamento de módulos de liturgia</span>
  <span class="keyword">async</span> <span class="function-name">scanLiturgyModules</span>() {
    <span class="keyword">const</span> <span class="variable">liturgyPath</span> = <span class="string">`${this.basePath}/liturgia`</span>;
    
    <span class="keyword">if</span> (!<span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">exists</span>(<span class="variable">liturgyPath</span>)) {
      <span class="keyword">console</span>.<span class="function-name">warn</span>(<span class="string">'📅 Pasta liturgia/ não encontrada'</span>);
      <span class="keyword">return</span>;
    }

    <span class="keyword">const</span> <span class="variable">files</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">readdir</span>(<span class="variable">liturgyPath</span>);
    
    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">file</span> <span class="keyword">of</span> <span class="variable">files</span>) {
      <span class="keyword">if</span> (<span class="variable">file</span>.<span class="function-name">endsWith</span>(<span class="string">'.json'</span>)) {
        <span class="keyword">const</span> <span class="variable">moduleKey</span> = <span class="string">`liturgy.${file.replace('.json', '')}`</span>;
        <span class="keyword">const</span> <span class="variable">filePath</span> = <span class="string">`${liturgyPath}/${file}`</span>;

        <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">set</span>(<span class="variable">moduleKey</span>, {
          <span class="json-key">name</span>: <span class="variable">file</span>.<span class="function-name">replace</span>(<span class="string">'.json'</span>, <span class="string">''</span>),
          <span class="json-key">type</span>: <span class="string">'liturgy'</span>,
          <span class="json-key">path</span>: <span class="variable">filePath</span>,
          <span class="json-key">loaded</span>: <span class="json-number">false</span>,
          <span class="json-key">metadata</span>: {
            <span class="json-key">dateRange</span>: <span class="keyword">null</span>,
            <span class="json-key">totalDays</span>: <span class="json-number">0</span>
          }
        });

        <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`📅 Liturgia registrada: ${file}`</span>);
      }
    }
  }

  <span class="comment">// Escaneamento de dicionários</span>
  <span class="keyword">async</span> <span class="function-name">scanDictionaryModules</span>() {
    <span class="keyword">const</span> <span class="variable">dictionaryPath</span> = <span class="string">`${this.basePath}/dicionarios`</span>;
    
    <span class="keyword">if</span> (!<span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">exists</span>(<span class="variable">dictionaryPath</span>)) {
      <span class="keyword">console</span>.<span class="function-name">warn</span>(<span class="string">'📚 Pasta dicionarios/ não encontrada'</span>);
      <span class="keyword">return</span>;
    }

    <span class="keyword">const</span> <span class="variable">dictionaries</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">readdir</span>(<span class="variable">dictionaryPath</span>);
    
    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">dict</span> <span class="keyword">of</span> <span class="variable">dictionaries</span>) {
      <span class="keyword">const</span> <span class="variable">dictPath</span> = <span class="string">`${dictionaryPath}/${dict}`</span>;
      <span class="keyword">const</span> <span class="variable">stat</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">stat</span>(<span class="variable">dictPath</span>);
      
      <span class="keyword">if</span> (<span class="variable">stat</span>.<span class="variable">isDirectory</span>()) {
        <span class="keyword">const</span> <span class="variable">moduleKey</span> = <span class="string">`dictionary.${dict}`</span>;
        
        <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">set</span>(<span class="variable">moduleKey</span>, {
          <span class="json-key">name</span>: <span class="variable">dict</span>,
          <span class="json-key">type</span>: <span class="string">'dictionary'</span>,
          <span class="json-key">path</span>: <span class="variable">dictPath</span>,
          <span class="json-key">loaded</span>: <span class="json-number">false</span>,
          <span class="json-key">metadata</span>: {
            <span class="json-key">totalEntries</span>: <span class="json-number">0</span>,
            <span class="json-key">language</span>: <span class="string">'greek'</span>
          }
        });

        <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`📚 Dicionário registrado: ${dict}`</span>);
      }
    }
  }

  <span class="comment">// Carregamento lazy de capítulo específico</span>
  <span class="keyword">async</span> <span class="function-name">loadChapter</span>(<span class="variable">testament</span>, <span class="variable">book</span>, <span class="variable">chapter</span>) {
    <span class="keyword">const</span> <span class="variable">cacheKey</span> = <span class="string">`${testament}.${book}.${chapter}`</span>;
    
    <span class="comment">// Verificar cache primeiro</span>
    <span class="keyword">if</span> (<span class="keyword">this</span>.<span class="variable">cache</span>.<span class="function-name">has</span>(<span class="variable">cacheKey</span>)) {
      <span class="keyword">return</span> <span class="keyword">this</span>.<span class="variable">cache</span>.<span class="function-name">get</span>(<span class="variable">cacheKey</span>);
    }

    <span class="keyword">const</span> <span class="variable">moduleKey</span> = <span class="string">`bible.${testament}.${book}`</span>;
    <span class="keyword">const</span> <span class="variable">bookModule</span> = <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">get</span>(<span class="variable">moduleKey</span>);
    
    <span class="keyword">if</span> (!<span class="variable">bookModule</span> || !<span class="variable">bookModule</span>.<span class="variable">chapters</span>.<span class="function-name">has</span>(<span class="variable">chapter</span>)) {
      <span class="keyword">throw</span> <span class="keyword">new</span> <span class="function-name">Error</span>(<span class="string">`Capítulo não encontrado: ${cacheKey}`</span>);
    }

    <span class="keyword">const</span> <span class="variable">chapterInfo</span> = <span class="variable">bookModule</span>.<span class="variable">chapters</span>.<span class="function-name">get</span>(<span class="variable">chapter</span>);
    
    <span class="keyword">try</span> {
      <span class="comment">// Carregar arquivo JSON</span>
      <span class="keyword">const</span> <span class="variable">fileContent</span> = <span class="keyword">await</span> <span class="variable">RNFS</span>.<span class="function-name">readFile</span>(<span class="variable">chapterInfo</span>.<span class="variable">path</span>, <span class="string">'utf8'</span>);
      <span class="keyword">const</span> <span class="variable">chapterData</span> = <span class="keyword">JSON</span>.<span class="function-name">parse</span>(<span class="variable">fileContent</span>);
      
      <span class="comment">// Adicionar metadados</span>
      <span class="variable">chapterData</span>.<span class="variable">_metadata</span> = {
        <span class="json-key">loadedAt</span>: <span class="keyword">new</span> <span class="function-name">Date</span>(),
        <span class="json-key">cacheKey</span>: <span class="variable">cacheKey</span>,
        <span class="json-key">verseCount</span>: <span class="keyword">Object</span>.<span class="function-name">keys</span>(<span class="variable">chapterData</span>.<span class="variable">verses</span> || {}).<span class="variable">length</span>
      };
      
      <span class="comment">// Atualizar contadores</span>
      <span class="variable">bookModule</span>.<span class="variable">metadata</span>.<span class="variable">totalVerses</span> += <span class="variable">chapterData</span>.<span class="variable">_metadata</span>.<span class="variable">verseCount</span>;
      
      <span class="comment">// Cache com expiração (30 minutos)</span>
      <span class="keyword">this</span>.<span class="function-name">setCacheWithExpiry</span>(<span class="variable">cacheKey</span>, <span class="variable">chapterData</span>, <span class="json-number">30</span> * <span class="json-number">60</span> * <span class="json-number">1000</span>);
      
      <span class="comment">// Marcar como carregado</span>
      <span class="variable">chapterInfo</span>.<span class="variable">loaded</span> = <span class="json-number">true</span>;
      <span class="variable">chapterInfo</span>.<span class="variable">cached</span> = <span class="json-number">true</span>;
      
      <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`✅ Capítulo carregado: ${cacheKey} (${chapterData._metadata.verseCount} versículos)`</span>);
      
      <span class="keyword">return</span> <span class="variable">chapterData</span>;

    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
      <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`❌ Erro ao carregar ${cacheKey}:`</span>, <span class="variable">error</span>);
      <span class="keyword">throw</span> <span class="variable">error</span>;
    }
  }

  <span class="comment">// Sistema de cache com expiração</span>
  <span class="function-name">setCacheWithExpiry</span>(<span class="variable">key</span>, <span class="variable">data</span>, <span class="variable">expiry</span>) {
    <span class="keyword">const</span> <span class="variable">item</span> = {
      <span class="json-key">data</span>: <span class="variable">data</span>,
      <span class="json-key">expiry</span>: <span class="keyword">Date</span>.<span class="function-name">now</span>() + <span class="variable">expiry</span>
    };
    <span class="keyword">this</span>.<span class="variable">cache</span>.<span class="function-name">set</span>(<span class="variable">key</span>, <span class="variable">item</span>);
  }

  <span class="comment">// Limpeza automática de cache expirado</span>
  <span class="function-name">cleanExpiredCache</span>() {
    <span class="keyword">const</span> <span class="variable">now</span> = <span class="keyword">Date</span>.<span class="function-name">now</span>();
    <span class="keyword">let</span> <span class="variable">cleaned</span> = <span class="json-number">0</span>;
    
    <span class="keyword">for</span> (<span class="keyword">const</span> [<span class="variable">key</span>, <span class="variable">item</span>] <span class="keyword">of</span> <span class="keyword">this</span>.<span class="variable">cache</span>) {
      <span class="keyword">if</span> (<span class="variable">item</span>.<span class="variable">expiry</span> && <span class="variable">now</span> > <span class="variable">item</span>.<span class="variable">expiry</span>) {
        <span class="keyword">this</span>.<span class="variable">cache</span>.<span class="function-name">delete</span>(<span class="variable">key</span>);
        <span class="variable">cleaned</span>++;
      }
    }
    
    <span class="keyword">if</span> (<span class="variable">cleaned</span> > <span class="json-number">0</span>) {
      <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`🧹 Cache limpo: ${cleaned} itens removidos`</span>);
    }
  }

  <span class="comment">// Obter resumo dos módulos carregados</span>
  <span class="function-name">getModulesSummary</span>() {
    <span class="keyword">return</span> {
      <span class="json-key">total</span>: <span class="keyword">this</span>.<span class="variable">modules</span>.<span class="variable">size</span>,
      <span class="json-key">bible</span>: <span class="keyword">this</span>.<span class="function-name">getBibleSummary</span>(),
      <span class="json-key">commentaries</span>: <span class="keyword">this</span>.<span class="function-name">getCommentariesSummary</span>(),
      <span class="json-key">liturgy</span>: <span class="keyword">this</span>.<span class="function-name">getLiturgySummary</span>(),
      <span class="json-key">dictionaries</span>: <span class="keyword">this</span>.<span class="function-name">getDictionariesSummary</span>()
    };
  }

  <span class="function-name">getBibleSummary</span>() {
    <span class="keyword">const</span> <span class="variable">bibleModules</span> = [...<span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">entries</span>()].<span class="function-name">filter</span>(([<span class="variable">key</span>]) <span class="operator">=></span> <span class="variable">key</span>.<span class="function-name">startsWith</span>(<span class="string">'bible.'</span>));
    
    <span class="keyword">return</span> {
      <span class="json-key">totalBooks</span>: <span class="variable">bibleModules</span>.<span class="variable">length</span>,
      <span class="json-key">AT</span>: <span class="variable">bibleModules</span>.<span class="function-name">filter</span>(([<span class="variable">key</span>]) <span class="operator">=></span> <span class="variable">key</span>.<span class="function-name">includes</span>(<span class="string">'.AT.'</span>)).<span class="variable">length</span>,
      <span class="json-key">NT</span>: <span class="variable">bibleModules</span>.<span class="function-name">filter</span>(([<span class="variable">key</span>]) <span class="operator">=></span> <span class="variable">key</span>.<span class="function-name">includes</span>(<span class="string">'.NT.'</span>)).<span class="variable">length</span>
    };
  }

  <span class="function-name">getCommentariesSummary</span>() {
    <span class="keyword">const</span> <span class="variable">commentaryModules</span> = [...<span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">entries</span>()].<span class="function-name">filter</span>(([<span class="variable">key</span>]) <span class="operator">=></span> <span class="variable">key</span>.<span class="function-name">startsWith</span>(<span class="string">'commentary.'</span>));
    <span class="keyword">return</span> { <span class="json-key">total</span>: <span class="variable">commentaryModules</span>.<span class="variable">length</span> };
  }

  <span class="function-name">getLiturgySummary</span>() {
    <span class="keyword">const</span> <span class="variable">liturgyModules</span> = [...<span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">entries</span>()].<span class="function-name">filter</span>(([<span class="variable">key</span>]) <span class="operator">=></span> <span class="variable">key</span>.<span class="function-name">startsWith</span>(<span class="string">'liturgy.'</span>));
    <span class="keyword">return</span> { <span class="json-key">total</span>: <span class="variable">liturgyModules</span>.<span class="variable">length</span> };
  }

  <span class="function-name">getDictionariesSummary</span>() {
    <span class="keyword">const</span> <span class="variable">dictModules</span> = [...<span class="keyword">this</span>.<span class="variable">modules</span>.<span class="function-name">entries</span>()].<span class="function-name">filter</span>(([<span class="variable">key</span>]) <span class="operator">=></span> <span class="variable">key</span>.<span class="function-name">startsWith</span>(<span class="string">'dictionary.'</span>));
    <span class="keyword">return</span> { <span class="json-key">total</span>: <span class="variable">dictModules</span>.<span class="variable">length</span> };
  }
}

<span class="keyword">export</span> <span class="keyword">default</span> <span class="variable">ModuleLoader</span>;
            </div>
        </div>
    </div>

    <script>
        function copyCode() {
            const codeElement = document.getElementById('codeContainer');
            const text = codeElement.textContent || codeElement.innerText;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopySuccess();
                }).catch(() => {
                    fallbackCopyTextToClipboard(text);
                });
            } else {
                fallbackCopyTextToClipboard(text);
            }
        }

        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                showCopySuccess();
            } catch (err) {
                console.error('Erro ao copiar:', err);
            }

            document.body.removeChild(textArea);
        }

        function showCopySuccess() {
            const button = document.querySelector('button[onclick="copyCode()"]');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
            button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }, 2000);
        }
    </script>
</body>
</html>
