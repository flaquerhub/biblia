// src/components/screens/LiturgyScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';

export default function LiturgyScreen() {
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header da Liturgia */}
        <View style={styles.liturgyHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.liturgyIcon}>⛪</Text>
            <View style={styles.dateInfo}>
              <Text style={styles.liturgyTitle}>Liturgia de Hoje</Text>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
          </View>
          
          <View style={styles.liturgicalInfo}>
            <View style={styles.liturgicalItem}>
              <Text style={styles.liturgicalLabel}>Tempo Litúrgico</Text>
              <Text style={styles.liturgicalValue}>Tempo Comum</Text>
            </View>
            <View style={styles.liturgicalItem}>
              <Text style={styles.liturgicalLabel}>Cor</Text>
              <Text style={styles.liturgicalValue}>Verde</Text>
            </View>
          </View>
        </View>
        
        {/* Leituras */}
        <View style={styles.readingsContainer}>
          <Text style={styles.sectionTitle}>Leituras da Missa</Text>
          
          {/* Primeira Leitura */}
          <View style={styles.readingCard}>
            <Text style={styles.readingType}>📖 Primeira Leitura</Text>
            <Text style={styles.readingReference}>1Rs 19,9a.11-13a</Text>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>9</Text>
              </View>
              <Text style={styles.readingText}>
                Naqueles dias, Elias chegou ao monte de Deus, o Horeb, e ali entrou numa caverna. 
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>11</Text>
              </View>
              <Text style={styles.readingText}>
                O Senhor lhe disse: "Sai e fica de pé sobre a montanha, diante do Senhor, porque ele vai passar!" 
                Veio um vento impetuoso e violento, que fendia as montanhas e quebrava rochedos diante do Senhor; 
                mas o Senhor não estava no vento.
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>12</Text>
              </View>
              <Text style={styles.readingText}>
                Depois do vento, houve um terremoto; mas o Senhor não estava no terremoto. 
                Depois do terremoto, houve um fogo; mas o Senhor não estava no fogo. 
                E depois do fogo, uma brisa suave.
              </Text>
            </View>
            <Text style={styles.readingNote}>
              Esta funcionalidade será implementada em breve com as leituras diárias completas.
            </Text>
          </View>

          {/* Salmo Responsorial */}
          <View style={styles.readingCard}>
            <Text style={styles.readingType}>🎵 Salmo Responsorial</Text>
            <Text style={styles.readingReference}>Sl 84</Text>
            <View style={styles.responseContainer}>
              <Text style={styles.responseText}>
                R. Mostrai-nos, ó Senhor, vossa bondade, e dai-nos vossa salvação.
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>8</Text>
              </View>
              <Text style={styles.readingText}>
                Vou escutar o que o Senhor irá falar: ele falará de paz para o seu povo 
                e seus fiéis, e para os que se convertem de coração.
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>9</Text>
              </View>
              <Text style={styles.readingText}>
                Perto está a salvação daqueles que o temem, e a glória habitará em nossa terra.
              </Text>
            </View>
            <Text style={styles.readingNote}>
              O salmo responsorial completo será exibido aqui.
            </Text>
          </View>

          {/* Segunda Leitura */}
          <View style={styles.readingCard}>
            <Text style={styles.readingType}>📜 Segunda Leitura</Text>
            <Text style={styles.readingReference}>Rm 9,1-5</Text>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>1</Text>
              </View>
              <Text style={styles.readingText}>
                Irmãos, digo a verdade em Cristo, não minto, e minha consciência dá testemunho 
                comigo no Espírito Santo:
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>2</Text>
              </View>
              <Text style={styles.readingText}>
                tenho uma grande tristeza e uma dor constante no coração.
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>3</Text>
              </View>
              <Text style={styles.readingText}>
                Eu mesmo desejaria ser anátema, separado de Cristo, em favor de meus irmãos, 
                que são meus parentes segundo a carne.
              </Text>
            </View>
            <Text style={styles.readingNote}>
              Disponível em domingos e solenidades.
            </Text>
          </View>

          {/* Evangelho */}
          <View style={styles.readingCard}>
            <Text style={styles.readingType}>✝️ Evangelho</Text>
            <Text style={styles.readingReference}>Mt 14,22-33</Text>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>22</Text>
              </View>
              <Text style={styles.readingText}>
                Naquele tempo, logo em seguida, Jesus obrigou os discípulos a subir na barca 
                e ir adiante dele para o outro lado do mar, enquanto ele despedia as multidões.
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>23</Text>
              </View>
              <Text style={styles.readingText}>
                Tendo despedido as multidões, subiu sozinho à montanha para orar. 
                Ao anoitecer, estava lá, sozinho.
              </Text>
            </View>
            <View style={styles.verseContainer}>
              <View style={[styles.verseNumber, styles.verseNumberWithComment]}>
                <Text style={[styles.verseNumberText, styles.verseNumberTextWithComment]}>24</Text>
              </View>
              <Text style={styles.readingText}>
                A barca já estava longe da terra, muitos estádios distante, 
                sendo açoitada pelas ondas, porque o vento era contrário.
              </Text>
            </View>
            <Text style={styles.readingNote}>
              O evangelho do dia será mostrado completo nesta seção.
            </Text>
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.additionalInfo}>
          <Text style={styles.infoTitle}>💡 Sobre a Liturgia</Text>
          <Text style={styles.infoText}>
            A liturgia diária é o conjunto de leituras bíblicas e orações que a Igreja Católica
            propõe para cada dia do ano litúrgico. Esta funcionalidade será expandida para
            incluir as leituras completas, comentários e reflexões.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },

  // Header da Liturgia
  liturgyHeader: {
    backgroundColor: '#1A1A2E',
    padding: 24,
    paddingTop: 60,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  liturgyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  dateInfo: {
    flex: 1,
  },
  liturgyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#A0A0A0',
    textTransform: 'capitalize',
  },
  liturgicalInfo: {
    flexDirection: 'row',
    gap: 32,
  },
  liturgicalItem: {
    alignItems: 'center',
  },
  liturgicalLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  liturgicalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Seções
  readingsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  // Cards de Leitura
  readingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  readingType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  readingReference: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 16,
  },

  // Versículos
  verseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  verseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: 'transparent',
  },
  verseNumberWithComment: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  verseNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  verseNumberTextWithComment: {
    color: '#FFFFFF',
  },
  readingText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    textAlign: 'justify',
  },

  // Resposta do Salmo
  responseContainer: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  responseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  readingNote: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: 8,
  },

  // Informações Adicionais
  additionalInfo: {
    margin: 20,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
});