<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PluginSystem.js - Sistema de Plugins</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            overflow-x: auto;
            white-space: pre;
        }
        .keyword { color: #569cd6; }
        .string { color: #ce9178; }
        .comment { color: #6a9955; font-style: italic; }
        .function-name { color: #dcdcaa; }
        .variable { color: #9cdcfe; }
        .json-key { color: #92c5f8; }
        .json-number { color: #b5cea8; }
        .copy-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #007acc;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .copy-btn:hover {
            background: #005a9e;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i class="fas fa-plug text-white text-xl"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">PluginSystem.js</h1>
                    <p class="text-gray-600">Sistema Extensível de Plugins</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-folder text-blue-500"></i>
                    <span><strong>Local:</strong> src/core/PluginSystem.js</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-puzzle-piece text-green-500"></i>
                    <span><strong>Função:</strong> Gerenciador de Plugins</span>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-link text-purple-500"></i>
                    <span><strong>Conecta:</strong> BibliaEngine</span>
                </div>
            </div>
        </div>

        <!-- Funcionalidades -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <i class="fas fa-star text-yellow-500 mr-2"></i>
                Funcionalidades do Plugin System
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <i class="fas fa-heart text-red-500"></i>
                    <div>
                        <h3 class="font-semibold text-blue-800">Plugin de Favoritos</h3>
                        <p class="text-blue-600 text-sm">Marcar versículos, destacar textos</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <i class="fas fa-comments text-green-500"></i>
                    <div>
                        <h3 class="font-semibold text-green-800">Plugin de Comentários</h3>
                        <p class="text-green-600 text-sm">Comentários patrísticos modulares</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <i class="fas fa-edit text-purple-500"></i>
                    <div>
                        <h3 class="font-semibold text-purple-800">Plugin de Anotações</h3>
                        <p class="text-purple-600 text-sm">Notas pessoais por versículo</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <i class="fas fa-bell text-orange-500"></i>
                    <div>
                        <h3 class="font-semibold text-orange-800">Plugin de Notificações</h3>
                        <p class="text-orange-600 text-sm">Palavra do dia, lembretes</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Código -->
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-800 flex items-center">
                    <i class="fas fa-code text-blue-500 mr-2"></i>
                    Código Completo
                </h2>
                <button onclick="copyCode()" class="copy-btn">
                    <i class="fas fa-copy mr-1"></i>
                    Copiar Código
                </button>
            </div>
            
            <div class="relative">
                <div class="code-block" id="codeBlock">// src/core/PluginSystem.js
<span class="comment">// Sistema extensível de plugins para o app bíblico</span>

<span class="keyword">import</span> <span class="variable">AsyncStorage</span> <span class="keyword">from</span> <span class="string">'@react-native-async-storage/async-storage'</span>;

<span class="keyword">class</span> <span class="function-name">PluginSystem</span> {
  <span class="function-name">constructor</span>(<span class="variable">bibliaEngine</span>) {
    <span class="keyword">this</span>.engine = <span class="variable">bibliaEngine</span>;
    <span class="keyword">this</span>.plugins = <span class="keyword">new</span> <span class="function-name">Map</span>();
    <span class="keyword">this</span>.hooks = <span class="keyword">new</span> <span class="function-name">Map</span>();
    <span class="keyword">this</span>.eventListeners = <span class="keyword">new</span> <span class="function-name">Map</span>();
  }

  <span class="comment">// Registrar plugin no sistema</span>
  <span class="keyword">async</span> <span class="function-name">registerPlugin</span>(<span class="variable">pluginInstance</span>) {
    <span class="keyword">try</span> {
      <span class="keyword">const</span> <span class="variable">pluginName</span> = <span class="variable">pluginInstance</span>.<span class="variable">name</span>;
      
      <span class="keyword">if</span> (<span class="keyword">this</span>.<span class="variable">plugins</span>.<span class="function-name">has</span>(<span class="variable">pluginName</span>)) {
        <span class="keyword">console</span>.<span class="function-name">warn</span>(<span class="string">`Plugin ${pluginName} já está registrado`</span>);
        <span class="keyword">return</span> <span class="json-number">false</span>;
      }

      <span class="comment">// Inicializar plugin</span>
      <span class="keyword">if</span> (<span class="variable">pluginInstance</span>.<span class="function-name">init</span>) {
        <span class="keyword">await</span> <span class="variable">pluginInstance</span>.<span class="function-name">init</span>(<span class="keyword">this</span>.<span class="variable">engine</span>);
      }

      <span class="comment">// Registrar hooks do plugin</span>
      <span class="keyword">if</span> (<span class="variable">pluginInstance</span>.<span class="variable">hooks</span>) {
        <span class="keyword">for</span> (<span class="keyword">const</span> [<span class="variable">hookName</span>, <span class="variable">hookFunction</span>] <span class="keyword">of</span> <span class="function-name">Object</span>.<span class="function-name">entries</span>(<span class="variable">pluginInstance</span>.<span class="variable">hooks</span>)) {
          <span class="keyword">this</span>.<span class="function-name">registerHook</span>(<span class="variable">hookName</span>, <span class="variable">hookFunction</span>, <span class="variable">pluginName</span>);
        }
      }

      <span class="comment">// Armazenar plugin</span>
      <span class="keyword">this</span>.<span class="variable">plugins</span>.<span class="function-name">set</span>(<span class="variable">pluginName</span>, <span class="variable">pluginInstance</span>);
      
      <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`🔌 Plugin registrado: ${pluginName}`</span>);
      <span class="keyword">return</span> <span class="json-number">true</span>;
      
    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
      <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">'Erro ao registrar plugin:'</span>, <span class="variable">error</span>);
      <span class="keyword">return</span> <span class="json-number">false</span>;
    }
  }

  <span class="comment">// Sistema de hooks extensível</span>
  <span class="function-name">registerHook</span>(<span class="variable">hookName</span>, <span class="variable">hookFunction</span>, <span class="variable">pluginName</span>) {
    <span class="keyword">if</span> (!<span class="keyword">this</span>.<span class="variable">hooks</span>.<span class="function-name">has</span>(<span class="variable">hookName</span>)) {
      <span class="keyword">this</span>.<span class="variable">hooks</span>.<span class="function-name">set</span>(<span class="variable">hookName</span>, []);
    }
    
    <span class="keyword">this</span>.<span class="variable">hooks</span>.<span class="function-name">get</span>(<span class="variable">hookName</span>).<span class="function-name">push</span>({
      <span class="json-key">function</span>: <span class="variable">hookFunction</span>,
      <span class="json-key">plugin</span>: <span class="variable">pluginName</span>
    });
  }

  <span class="comment">// Executar hooks</span>
  <span class="keyword">async</span> <span class="function-name">executeHook</span>(<span class="variable">hookName</span>, <span class="variable">data</span>) {
    <span class="keyword">const</span> <span class="variable">hooks</span> = <span class="keyword">this</span>.<span class="variable">hooks</span>.<span class="function-name">get</span>(<span class="variable">hookName</span>) || [];
    <span class="keyword">let</span> <span class="variable">result</span> = <span class="variable">data</span>;

    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">hook</span> <span class="keyword">of</span> <span class="variable">hooks</span>) {
      <span class="keyword">try</span> {
        <span class="variable">result</span> = <span class="keyword">await</span> <span class="variable">hook</span>.<span class="keyword">function</span>(<span class="variable">result</span>) || <span class="variable">result</span>;
      } <span class="keyword">catch</span> (<span class="variable">error</span>) {
        <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`Erro no hook ${hookName} do plugin ${hook.plugin}:`</span>, <span class="variable">error</span>);
      }
    }

    <span class="keyword">return</span> <span class="variable">result</span>;
  }

  <span class="comment">// Obter plugin específico</span>
  <span class="function-name">getPlugin</span>(<span class="variable">pluginName</span>) {
    <span class="keyword">return</span> <span class="keyword">this</span>.<span class="variable">plugins</span>.<span class="function-name">get</span>(<span class="variable">pluginName</span>);
  }

  <span class="comment">// Listar plugins ativos</span>
  <span class="function-name">getActivePlugins</span>() {
    <span class="keyword">return</span> <span class="function-name">Array</span>.<span class="function-name">from</span>(<span class="keyword">this</span>.<span class="variable">plugins</span>.<span class="function-name">keys</span>());
  }

  <span class="comment">// Sistema de eventos entre plugins</span>
  <span class="function-name">addEventListener</span>(<span class="variable">eventName</span>, <span class="variable">callback</span>, <span class="variable">pluginName</span>) {
    <span class="keyword">if</span> (!<span class="keyword">this</span>.<span class="variable">eventListeners</span>.<span class="function-name">has</span>(<span class="variable">eventName</span>)) {
      <span class="keyword">this</span>.<span class="variable">eventListeners</span>.<span class="function-name">set</span>(<span class="variable">eventName</span>, []);
    }
    
    <span class="keyword">this</span>.<span class="variable">eventListeners</span>.<span class="function-name">get</span>(<span class="variable">eventName</span>).<span class="function-name">push</span>({
      <span class="json-key">callback</span>: <span class="variable">callback</span>,
      <span class="json-key">plugin</span>: <span class="variable">pluginName</span>
    });
  }

  <span class="comment">// Disparar evento</span>
  <span class="keyword">async</span> <span class="function-name">emitEvent</span>(<span class="variable">eventName</span>, <span class="variable">data</span>) {
    <span class="keyword">const</span> <span class="variable">listeners</span> = <span class="keyword">this</span>.<span class="variable">eventListeners</span>.<span class="function-name">get</span>(<span class="variable">eventName</span>) || [];
    
    <span class="keyword">for</span> (<span class="keyword">const</span> <span class="variable">listener</span> <span class="keyword">of</span> <span class="variable">listeners</span>) {
      <span class="keyword">try</span> {
        <span class="keyword">await</span> <span class="variable">listener</span>.<span class="variable">callback</span>(<span class="variable">data</span>);
      } <span class="keyword">catch</span> (<span class="variable">error</span>) {
        <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`Erro no evento ${eventName} do plugin ${listener.plugin}:`</span>, <span class="variable">error</span>);
      }
    }
  }

  <span class="comment">// Interface de contexto para versículos</span>
  <span class="keyword">async</span> <span class="function-name">getVerseContext</span>(<span class="variable">testament</span>, <span class="variable">book</span>, <span class="variable">chapter</span>, <span class="variable">verse</span>) {
    <span class="keyword">const</span> <span class="variable">context</span> = {
      <span class="json-key">testament</span>: <span class="variable">testament</span>,
      <span class="json-key">book</span>: <span class="variable">book</span>,
      <span class="json-key">chapter</span>: <span class="variable">chapter</span>,
      <span class="json-key">verse</span>: <span class="variable">verse</span>,
      <span class="json-key">reference</span>: <span class="string">`${book} ${chapter}:${verse}`</span>,
      <span class="json-key">plugins</span>: {}
    };

    <span class="comment">// Consultar cada plugin ativo</span>
    <span class="keyword">for</span> (<span class="keyword">const</span> [<span class="variable">pluginName</span>, <span class="variable">plugin</span>] <span class="keyword">of</span> <span class="keyword">this</span>.<span class="variable">plugins</span>) {
      <span class="keyword">if</span> (<span class="variable">plugin</span>.<span class="function-name">getVerseContext</span>) {
        <span class="keyword">try</span> {
          <span class="variable">context</span>.<span class="variable">plugins</span>[<span class="variable">pluginName</span>] = <span class="keyword">await</span> <span class="variable">plugin</span>.<span class="function-name">getVerseContext</span>(<span class="variable">testament</span>, <span class="variable">book</span>, <span class="variable">chapter</span>, <span class="variable">verse</span>);
        } <span class="keyword">catch</span> (<span class="variable">error</span>) {
          <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`Erro no contexto do plugin ${pluginName}:`</span>, <span class="variable">error</span>);
        }
      }
    }

    <span class="comment">// Executar hook de contexto</span>
    <span class="keyword">return</span> <span class="keyword">await</span> <span class="keyword">this</span>.<span class="function-name">executeHook</span>(<span class="string">'verse_context'</span>, <span class="variable">context</span>);
  }

  <span class="comment">// Persistência de dados de plugins</span>
  <span class="keyword">async</span> <span class="function-name">savePluginData</span>(<span class="variable">pluginName</span>, <span class="variable">data</span>) {
    <span class="keyword">try</span> {
      <span class="keyword">const</span> <span class="variable">key</span> = <span class="string">`plugin_${pluginName}_data`</span>;
      <span class="keyword">await</span> <span class="variable">AsyncStorage</span>.<span class="function-name">setItem</span>(<span class="variable">key</span>, <span class="keyword">JSON</span>.<span class="function-name">stringify</span>(<span class="variable">data</span>));
      <span class="keyword">return</span> <span class="json-number">true</span>;
    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
      <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`Erro ao salvar dados do plugin ${pluginName}:`</span>, <span class="variable">error</span>);
      <span class="keyword">return</span> <span class="json-number">false</span>;
    }
  }

  <span class="comment">// Carregar dados de plugin</span>
  <span class="keyword">async</span> <span class="function-name">loadPluginData</span>(<span class="variable">pluginName</span>) {
    <span class="keyword">try</span> {
      <span class="keyword">const</span> <span class="variable">key</span> = <span class="string">`plugin_${pluginName}_data`</span>;
      <span class="keyword">const</span> <span class="variable">data</span> = <span class="keyword">await</span> <span class="variable">AsyncStorage</span>.<span class="function-name">getItem</span>(<span class="variable">key</span>);
      <span class="keyword">return</span> <span class="variable">data</span> ? <span class="keyword">JSON</span>.<span class="function-name">parse</span>(<span class="variable">data</span>) : <span class="keyword">null</span>;
    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
      <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`Erro ao carregar dados do plugin ${pluginName}:`</span>, <span class="variable">error</span>);
      <span class="keyword">return</span> <span class="keyword">null</span>;
    }
  }

  <span class="comment">// Busca em plugins</span>
  <span class="keyword">async</span> <span class="function-name">searchInPlugins</span>(<span class="variable">query</span>, <span class="variable">options</span> = {}) {
    <span class="keyword">const</span> <span class="variable">results</span> = [];

    <span class="keyword">for</span> (<span class="keyword">const</span> [<span class="variable">pluginName</span>, <span class="variable">plugin</span>] <span class="keyword">of</span> <span class="keyword">this</span>.<span class="variable">plugins</span>) {
      <span class="keyword">if</span> (<span class="variable">plugin</span>.<span class="function-name">search</span>) {
        <span class="keyword">try</span> {
          <span class="keyword">const</span> <span class="variable">pluginResults</span> = <span class="keyword">await</span> <span class="variable">plugin</span>.<span class="function-name">search</span>(<span class="variable">query</span>, <span class="variable">options</span>);
          <span class="keyword">if</span> (<span class="variable">pluginResults</span> && <span class="variable">pluginResults</span>.<span class="variable">length</span> > <span class="json-number">0</span>) {
            <span class="variable">results</span>.<span class="function-name">push</span>(...<span class="variable">pluginResults</span>.<span class="function-name">map</span>(<span class="variable">result</span> => ({
              ...<span class="variable">result</span>,
              <span class="json-key">plugin</span>: <span class="variable">pluginName</span>
            })));
          }
        } <span class="keyword">catch</span> (<span class="variable">error</span>) {
          <span class="keyword">console</span>.<span class="function-name">error</span>(<span class="string">`Erro na busca do plugin ${pluginName}:`</span>, <span class="variable">error</span>);
        }
      }
    }

    <span class="keyword">return</span> <span class="variable">results</span>;
  }

  <span class="comment">// Status do sistema de plugins</span>
  <span class="function-name">getSystemStatus</span>() {
    <span class="keyword">return</span> {
      <span class="json-key">totalPlugins</span>: <span class="keyword">this</span>.<span class="variable">plugins</span>.<span class="variable">size</span>,
      <span class="json-key">activePlugins</span>: <span class="keyword">this</span>.<span class="function-name">getActivePlugins</span>(),
      <span class="json-key">registeredHooks</span>: <span class="function-name">Array</span>.<span class="function-name">from</span>(<span class="keyword">this</span>.<span class="variable">hooks</span>.<span class="function-name">keys</span>()),
      <span class="json-key">eventListeners</span>: <span class="function-name">Array</span>.<span class="function-name">from</span>(<span class="keyword">this</span>.<span class="variable">eventListeners</span>.<span class="function-name">keys</span>())
    };
  }
}

<span class="comment">// Interface base para plugins</span>
<span class="keyword">class</span> <span class="function-name">BasePlugin</span> {
  <span class="function-name">constructor</span>(<span class="variable">name</span>) {
    <span class="keyword">this</span>.name = <span class="variable">name</span>;
    <span class="keyword">this</span>.version = <span class="string">'1.0.0'</span>;
    <span class="keyword">this</span>.hooks = {};
  }

  <span class="comment">// Método de inicialização (sobrescrever)</span>
  <span class="keyword">async</span> <span class="function-name">init</span>(<span class="variable">engine</span>) {
    <span class="keyword">this</span>.engine = <span class="variable">engine</span>;
    <span class="keyword">console</span>.<span class="function-name">log</span>(<span class="string">`Plugin ${this.name} inicializado`</span>);
  }

  <span class="comment">// Contexto do versículo (sobrescrever)</span>
  <span class="keyword">async</span> <span class="function-name">getVerseContext</span>(<span class="variable">testament</span>, <span class="variable">book</span>, <span class="variable">chapter</span>, <span class="variable">verse</span>) {
    <span class="keyword">return</span> {};
  }

  <span class="comment">// Busca no plugin (sobrescrever)</span>
  <span class="keyword">async</span> <span class="function-name">search</span>(<span class="variable">query</span>, <span class="variable">options</span>) {
    <span class="keyword">return</span> [];
  }

  <span class="comment">// Salvar dados específicos</span>
  <span class="keyword">async</span> <span class="function-name">saveData</span>(<span class="variable">data</span>) {
    <span class="keyword">if</span> (<span class="keyword">this</span>.engine && <span class="keyword">this</span>.engine.<span class="variable">pluginSystem</span>) {
      <span class="keyword">return</span> <span class="keyword">await</span> <span class="keyword">this</span>.engine.<span class="variable">pluginSystem</span>.<span class="function-name">savePluginData</span>(<span class="keyword">this</span>.name, <span class="variable">data</span>);
    }
    <span class="keyword">return</span> <span class="json-number">false</span>;
  }

  <span class="comment">// Carregar dados específicos</span>
  <span class="keyword">async</span> <span class="function-name">loadData</span>() {
    <span class="keyword">if</span> (<span class="keyword">this</span>.engine && <span class="keyword">this</span>.engine.<span class="variable">pluginSystem</span>) {
      <span class="keyword">return</span> <span class="keyword">await</span> <span class="keyword">this</span>.engine.<span class="variable">pluginSystem</span>.<span class="function-name">loadPluginData</span>(<span class="keyword">this</span>.name);
    }
    <span class="keyword">return</span> <span class="keyword">null</span>;
  }
}

<span class="keyword">export</span> { <span class="variable">PluginSystem</span>, <span class="variable">BasePlugin</span> };</div>
            </div>
        </div>

        <!-- Instruções de Uso -->
        <div class="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 class="text-lg font-semibold mb-3 text-blue-800 flex items-center">
                <i class="fas fa-info-circle mr-2"></i>
                Como Usar Este Arquivo
            </h3>
            <ol class="list-decimal list-inside space-y-2 text-blue-700">
                <li>Copie o código acima</li>
                <li>Crie o arquivo <code class="bg-white px-2 py-1 rounded">src/core/PluginSystem.js</code></li>
                <li>Cole o código completo no arquivo</li>
                <li>O sistema estará pronto para receber plugins!</li>
            </ol>
        </div>
    </div>

    <script>
        function copyCode() {
            const codeBlock = document.getElementById('codeBlock');
            const textContent = codeBlock.textContent;
            
            navigator.clipboard.writeText(textContent).then(() => {
                const btn = document.querySelector('.copy-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
                btn.style.background = '#10b981';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '#007acc';
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                alert('Erro ao copiar código. Tente selecionar manualmente.');
            });
        }
    </script>
</body>
</html>
