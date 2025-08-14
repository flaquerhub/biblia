// src/components/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, StatusBar } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [fontSize, setFontSize] = useState('medium');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [readingMode, setReadingMode] = useState('normal');
  const [autoBookmark, setAutoBookmark] = useState(true);

  const fontSizes = [
    { key: 'small', label: 'Pequena', size: 'A' },
    { key: 'medium', label: 'Média', size: 'A' },
    { key: 'large', label: 'Grande', size: 'A' },
    { key: 'xlarge', label: 'Muito Grande', size: 'A' }
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Configurações</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const renderSettingSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderSettingItem = (icon, title, subtitle, rightComponent) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  const renderToggleItem = (icon, title, subtitle, value, onValueChange) => (
    renderSettingItem(
      icon,
      title,
      subtitle,
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#6C63FF' }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
      />
    )
  );

  const renderActionItem = (icon, title, subtitle, onPress, color = '#6B7280') => (
    <TouchableOpacity onPress={onPress}>
      {renderSettingItem(
        icon,
        title,
        subtitle,
        <Text style={[styles.actionArrow, { color }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      {renderHeader()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Leitura */}
        {renderSettingSection('📖 Leitura', 
          <>
            {/* Tamanho da Fonte */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Text style={styles.iconText}>📝</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Tamanho da fonte</Text>
                  <Text style={styles.settingSubtitle}>Ajuste o tamanho do texto</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.fontSizeContainer}>
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size.key}
                  style={[
                    styles.fontSizeButton,
                    fontSize === size.key && styles.fontSizeButtonActive
                  ]}
                  onPress={() => setFontSize(size.key)}
                >
                  <Text style={[
                    styles.fontSizeText,
                    fontSize === size.key && styles.fontSizeTextActive
                  ]}>
                    {size.size}
                  </Text>
                  <Text style={[
                    styles.fontSizeLabel,
                    fontSize === size.key && styles.fontSizeLabelActive
                  ]}>
                    {size.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {renderToggleItem(
              '🌙', 
              'Modo noturno', 
              'Tema escuro para leitura', 
              darkMode, 
              setDarkMode
            )}

            {renderToggleItem(
              '📌', 
              'Marcador automático', 
              'Salva automaticamente onde parou', 
              autoBookmark, 
              setAutoBookmark
            )}
          </>
        )}

        {/* Notificações */}
        {renderSettingSection('🔔 Notificações',
          <>
            {renderToggleItem(
              '📱', 
              'Notificações', 
              'Lembrete diário de leitura', 
              notifications, 
              setNotifications
            )}

            {renderActionItem(
              '⏰', 
              'Horário do lembrete', 
              notifications ? '08:00' : 'Desativado'
            )}

            {renderActionItem(
              '📅', 
              'Liturgia diária', 
              'Notificação das leituras do dia'
            )}
          </>
        )}

        {/* Dados */}
        {renderSettingSection('💾 Dados',
          <>
            {renderActionItem(
              '⬇️', 
              'Downloads', 
              'Gerenciar conteúdo offline'
            )}

            {renderActionItem(
              '☁️', 
              'Sincronização', 
              'Favoritos e progresso na nuvem'
            )}

            {renderActionItem(
              '🗑️', 
              'Limpar cache', 
              'Liberar espaço de armazenamento'
            )}
          </>
        )}

        {/* Sobre */}
        {renderSettingSection('ℹ️ Sobre',
          <>
            <View style={styles.aboutCard}>
              <View style={styles.aboutHeader}>
                <View style={styles.appIcon}>
                  <Text style={styles.appIconText}>📖</Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>Bíblia Católica</Text>
                  <Text style={styles.appVersion}>Versão 1.0.0</Text>
                </View>
              </View>
              
              <View style={styles.aboutStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>73</Text>
                  <Text style={styles.statLabel}>Livros</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1189</Text>
                  <Text style={styles.statLabel}>Capítulos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>31k+</Text>
                  <Text style={styles.statLabel}>Versículos</Text>
                </View>
              </View>
            </View>

            {renderActionItem(
              '⭐', 
              'Avaliar app', 
              'Sua opinião é importante'
            )}

            {renderActionItem(
              '📧', 
              'Suporte', 
              'Precisa de ajuda? Entre em contato'
            )}

            {renderActionItem(
              '📄', 
              'Termos de uso', 
              'Políticas e termos'
            )}
          </>
        )}

        {/* Botões de ação */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📤 Compartilhar app</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
            <Text style={styles.actionButtonTextSecondary}>🔄 Restaurar padrões</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Feito com ❤️ para glorificar a Deus
          </Text>
          <Text style={styles.footerCopyright}>
            Bíblia de Jerusalém © 2024
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },

  // Sections
  section: {
    margin: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },

  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Font Size
  fontSizeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  fontSizeButtonActive: {
    backgroundColor: '#6C63FF',
  },
  fontSizeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  fontSizeTextActive: {
    color: '#FFFFFF',
  },
  fontSizeLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  fontSizeLabelActive: {
    color: '#FFFFFF',
  },

  // About Card
  aboutCard: {
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
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appIconText: {
    fontSize: 30,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Actions
  actionsSection: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});