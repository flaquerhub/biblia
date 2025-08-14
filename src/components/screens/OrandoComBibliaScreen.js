import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OrandoComBibliaScreen = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Temas de oração modulares (dados que virão do JSON)
  const orandoTemas = [
    {
      id: 'jo_sofrimento',
      titulo: 'Orando com Jó',
      subtitulo: 'Fé em tempos difíceis',
      descricao: 'Encontre esperança e força na fé inabalável de Jó',
      versiculo_chave: 'Jó 19:25',
      texto_versiculo: 'Porque eu sei que o meu Redentor vive, e que por fim se levantará sobre a terra.',
      cor_principal: '#8B4513',
      cor_secundaria: '#D2691E',
      background: 'montanha_tempestade',
      icone: 'thunderstorm-outline',
      etapas: [
        {
          titulo: 'Adoração',
          texto: 'Mesmo na dor, Jó adorou a Deus. Como você pode adorar mesmo nas dificuldades?',
          versiculo: 'Jó 1:21',
          reflexao: 'Reflita sobre a grandeza de Deus que merece nossa adoração sempre.'
        },
        {
          titulo: 'Confissão',
          texto: 'Jó foi honesto com Deus sobre seus sentimentos. Seja transparente também.',
          versiculo: 'Jó 7:11',
          reflexao: 'Confesse seus medos, dúvidas e dores a Deus com sinceridade.'
        },
        {
          titulo: 'Súplica',
          texto: 'Apresente suas necessidades confiando na soberania divina.',
          versiculo: 'Jó 14:14',
          reflexao: 'Peça a Deus força para perseverar e sabedoria para compreender.'
        },
        {
          titulo: 'Entrega',
          texto: 'Como Jó, entregue tudo nas mãos do Senhor com fé inabalável.',
          versiculo: 'Jó 13:15',
          reflexao: 'Entregue seus caminhos ao Senhor e confie em Seus planos.'
        }
      ]
    },
    {
      id: 'josue_conquista',
      titulo: 'Orando com Josué',
      subtitulo: 'Coragem para conquistar',
      descricao: 'Desenvolva coragem e determinação para enfrentar seus desafios',
      versiculo_chave: 'Josué 1:9',
      texto_versiculo: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não pasmes, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.',
      cor_principal: '#DAA520',
      cor_secundaria: '#FFD700',
      background: 'terra_prometida',
      icone: 'flag-outline',
      etapas: [
        {
          titulo: 'Preparação',
          texto: 'Josué se preparou espiritualmente antes das batalhas. Como você se prepara?',
          versiculo: 'Josué 1:8',
          reflexao: 'Prepare-se através da oração e meditação na Palavra.'
        },
        {
          titulo: 'Confiança',
          texto: 'Desenvolva confiança inabalável nas promessas de Deus.',
          versiculo: 'Josué 21:45',
          reflexao: 'Lembre-se das promessas que Deus já cumpriu em sua vida.'
        },
        {
          titulo: 'Ação',
          texto: 'Josué agiu com fé. Que passos de fé você precisa dar?',
          versiculo: 'Josué 6:20',
          reflexao: 'Peça direção para agir com sabedoria e coragem.'
        },
        {
          titulo: 'Gratidão',
          texto: 'Celebre as vitórias que Deus tem dado em sua jornada.',
          versiculo: 'Josué 24:15',
          reflexao: 'Agradeça pela fidelidade de Deus e renove seu compromisso.'
        }
      ]
    },
    {
      id: 'davi_adoracao',
      titulo: 'Orando com Davi',
      subtitulo: 'Coração adorador',
      descricao: 'Cultive um coração que busca a Deus em toda situação',
      versiculo_chave: 'Salmos 63:1',
      texto_versiculo: 'Ó Deus, tu és o meu Deus, de madrugada te buscarei; a minha alma tem sede de ti; a minha carne te deseja muito em uma terra seca e cansada, onde não há água.',
      cor_principal: '#4682B4',
      cor_secundaria: '#87CEEB',
      background: 'campo_pastoreio',
      icone: 'musical-notes-outline',
      etapas: [
        {
          titulo: 'Intimidade',
          texto: 'Davi buscava intimidade com Deus. Como está sua relação pessoal com Ele?',
          versiculo: 'Salmos 27:8',
          reflexao: 'Busque a face de Deus em oração íntima e adoração.'
        },
        {
          titulo: 'Transparência',
          texto: 'Davi era transparente com Deus sobre todos os seus sentimentos.',
          versiculo: 'Salmos 62:8',
          reflexao: 'Derrame seu coração diante de Deus sem reservas.'
        },
        {
          titulo: 'Louvor',
          texto: 'Mesmo nas dificuldades, Davi escolhia louvar.',
          versiculo: 'Salmos 34:1',
          reflexao: 'Louve a Deus por quem Ele é, não apenas pelo que Ele faz.'
        },
        {
          titulo: 'Confiança',
          texto: 'Davi depositava toda sua confiança no Senhor.',
          versiculo: 'Salmos 23:1',
          reflexao: 'Descanse na certeza de que o Senhor é seu pastor.'
        }
      ]
    },
    {
      id: 'maria_entrega',
      titulo: 'Orando com Maria',
      subtitulo: 'Fiat - "Faça-se"',
      descricao: 'Aprenda a dizer sim aos planos de Deus como Maria',
      versiculo_chave: 'Lucas 1:38',
      texto_versiculo: 'Disse então Maria: Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra.',
      cor_principal: '#9370DB',
      cor_secundaria: '#DDA0DD',
      background: 'nazare_galileia',
      icone: 'rose-outline',
      etapas: [
        {
          titulo: 'Escuta',
          texto: 'Maria soube escutar a voz de Deus. Como você cultiva a escuta?',
          versiculo: 'Lucas 2:19',
          reflexao: 'Pratique o silêncio e a atenção à voz de Deus.'
        },
        {
          titulo: 'Aceitação',
          texto: 'Maria aceitou a vontade de Deus mesmo sem entender tudo.',
          versiculo: 'Lucas 1:45',
          reflexao: 'Aceite os planos de Deus mesmo quando não compreende.'
        },
        {
          titulo: 'Entrega',
          texto: 'O "fiat" de Maria é modelo de entrega total.',
          versiculo: 'João 2:5',
          reflexao: 'Entregue seus planos e aceite a vontade divina.'
        },
        {
          titulo: 'Perseverança',
          texto: 'Maria perseverou mesmo diante das dificuldades.',
          versiculo: 'João 19:25',
          reflexao: 'Persevere na fé mesmo nos momentos difíceis.'
        }
      ]
    },
    {
      id: 'abraao_fe',
      titulo: 'Orando com Abraão',
      subtitulo: 'Caminhada de fé',
      descricao: 'Desenvolva uma fé que confia nas promessas de Deus',
      versiculo_chave: 'Hebreus 11:8',
      texto_versiculo: 'Pela fé Abraão, sendo chamado, obedeceu, indo para um lugar que havia de receber por herança; e saiu, sem saber para onde ia.',
      cor_principal: '#CD853F',
      cor_secundaria: '#DEB887',
      background: 'deserto_estrelas',
      icone: 'star-outline',
      etapas: [
        {
          titulo: 'Chamado',
          texto: 'Abraão respondeu ao chamado de Deus. Como você responde?',
          versiculo: 'Gênesis 12:1',
          reflexao: 'Reflita sobre como Deus está chamando você hoje.'
        },
        {
          titulo: 'Obediência',
          texto: 'A obediência de Abraão abriu caminho para as bênçãos.',
          versiculo: 'Gênesis 22:18',
          reflexao: 'Busque graça para obedecer mesmo quando não entende.'
        },
        {
          titulo: 'Esperança',
          texto: 'Abraão esperou contra toda esperança humana.',
          versiculo: 'Romanos 4:18',
          reflexao: 'Mantenha a esperança viva mesmo em situações impossíveis.'
        },
        {
          titulo: 'Fidelidade',
          texto: 'Deus foi fiel às promessas feitas a Abraão.',
          versiculo: 'Gênesis 21:1',
          reflexao: 'Confie na fidelidade de Deus para sua vida.'
        }
      ]
    },
    {
      id: 'jesus_pai_nosso',
      titulo: 'Orando com Jesus',
      subtitulo: 'O Pai Nosso',
      descricao: 'Aprenda a orar como Jesus ensinou seus discípulos',
      versiculo_chave: 'Mateus 6:9',
      texto_versiculo: 'Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome.',
      cor_principal: '#B22222',
      cor_secundaria: '#FA8072',
      background: 'monte_oliveiras',
      icone: 'praying-hands',
      etapas: [
        {
          titulo: 'Intimidade',
          texto: 'Jesus nos ensina a chamar Deus de "Pai". Desenvolva esta intimidade.',
          versiculo: 'Mateus 6:9',
          reflexao: 'Aproxime-se de Deus como um filho se aproxima do pai.'
        },
        {
          titulo: 'Adoração',
          texto: '"Santificado seja o teu nome" - comece sempre adorando.',
          versiculo: 'Mateus 6:9',
          reflexao: 'Reconheça a santidade e majestade de Deus.'
        },
        {
          titulo: 'Submissão',
          texto: '"Seja feita a tua vontade" - submeta seus desejos a Deus.',
          versiculo: 'Mateus 6:10',
          reflexao: 'Busque alinhar sua vontade com a vontade divina.'
        },
        {
          titulo: 'Dependência',
          texto: 'Reconheça sua dependência total de Deus para todas as coisas.',
          versiculo: 'Mateus 6:11',
          reflexao: 'Peça a Deus o que você precisa com gratidão.'
        }
      ]
    }
  ];

  const renderThemeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.themeCard}
      onPress={() => setSelectedTheme(item)}
    >
      <LinearGradient
        colors={[item.cor_principal, item.cor_secundaria]}
        style={styles.themeGradient}
      >
        <View style={styles.themeHeader}>
          <Ionicons name={item.icone} size={40} color="#FFFFFF" />
          <Text style={styles.themeTitle}>{item.titulo}</Text>
          <Text style={styles.themeSubtitle}>{item.subtitulo}</Text>
        </View>
        <Text style={styles.themeDescription}>{item.descricao}</Text>
        <View style={styles.verseContainer}>
          <Text style={styles.verseReference}>{item.versiculo_chave}</Text>
          <Text style={styles.verseText} numberOfLines={2}>
            "{item.texto_versiculo}"
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPrayerGuide = () => {
    if (!selectedTheme) return null;

    const currentEtapa = selectedTheme.etapas[currentStep];

    return (
      <View style={styles.prayerGuide}>
        <View style={styles.prayerHeader}>
          <TouchableOpacity
            style={styles.backToThemes}
            onPress={() => {
              setSelectedTheme(null);
              setCurrentStep(0);
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.prayerTitle}>{selectedTheme.titulo}</Text>
        </View>

        <View style={styles.progressBar}>
          {selectedTheme.etapas.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.activeDot,
                { backgroundColor: index <= currentStep ? selectedTheme.cor_principal : '#E0E0E0' }
              ]}
            />
          ))}
        </View>

        <LinearGradient
          colors={[selectedTheme.cor_principal + '20', selectedTheme.cor_secundaria + '20']}
          style={styles.stepCard}
        >
          <Text style={[styles.stepTitle, { color: selectedTheme.cor_principal }]}>
            {currentEtapa.titulo}
          </Text>
          
          <Text style={styles.stepText}>{currentEtapa.texto}</Text>
          
          <View style={styles.stepVerse}>
            <Text style={[styles.stepVerseRef, { color: selectedTheme.cor_principal }]}>
              {currentEtapa.versiculo}
            </Text>
            {/* Aqui você pode buscar o texto do versículo usando o BibliaEngine */}
          </View>
          
          <View style={styles.reflectionBox}>
            <Text style={styles.reflectionLabel}>💭 Reflexão:</Text>
            <Text style={styles.reflectionText}>{currentEtapa.reflexao}</Text>
          </View>
        </LinearGradient>

        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: selectedTheme.cor_secundaria }]}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          {currentStep < selectedTheme.etapas.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: selectedTheme.cor_principal }]}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.navButtonText}>Próximo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: selectedTheme.cor_principal }]}
              onPress={() => {
                setSelectedTheme(null);
                setCurrentStep(0);
              }}
            >
              <Text style={styles.navButtonText}>Finalizar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orando com a Bíblia</Text>
        <View style={{ width: 24 }} />
      </View>

      {!selectedTheme ? (
        <ScrollView style={styles.themesContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.introText}>
            Escolha um personagem bíblico e deixe-se guiar em uma jornada de oração inspirada em sua fé e experiência com Deus.
          </Text>
          
          <FlatList
            data={orandoTemas}
            keyExtractor={item => item.id}
            renderItem={renderThemeCard}
            numColumns={2}
            columnWrapperStyle={styles.themesRow}
            scrollEnabled={false}
          />
        </ScrollView>
      ) : (
        renderPrayerGuide()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  themesContainer: {
    flex: 1,
    padding: 20,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  themesRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  themeCard: {
    width: (width - 50) / 2,
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  themeGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  themeHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  themeSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  themeDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
  verseContainer: {
    alignItems: 'center',
  },
  verseReference: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  verseText: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  prayerGuide: {
    flex: 1,
    padding: 20,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backToThemes: {
    padding: 8,
    marginRight: 10,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    transform: [{ scale: 1.3 }],
  },
  stepCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  stepVerse: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepVerseRef: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  reflectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  reflectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrandoComBibliaScreen;