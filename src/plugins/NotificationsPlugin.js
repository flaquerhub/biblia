import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationsPlugin {
  constructor() {
    this.name = 'notificacoes';
    this.isEnabled = false;
    this.wordOfDayEnabled = true;
    this.customReminders = [];
    this.verseBank = [];
    this.initialized = false;
  }

  async initialize() {
    try {
      await this.requestPermissions();
      await this.loadSettings();
      await this.initializeVerseBank();
      this.initialized = true;
      console.log('✅ Plugin de Notificações inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar plugin de notificações:', error);
    }
  }

  async requestPermissions() {
    if (!Device.isDevice) {
      console.log('Notificações não funcionam no simulador');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permissão para notificações negada');
      return false;
    }

    this.isEnabled = true;
    return true;
  }

  async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('@biblia_notification_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.wordOfDayEnabled = parsed.wordOfDayEnabled !== false;
        this.customReminders = parsed.customReminders || [];
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificações:', error);
    }
  }

  async saveSettings() {
    try {
      const settings = {
        wordOfDayEnabled: this.wordOfDayEnabled,
        customReminders: this.customReminders,
        lastUpdated: new Date().toISOString()
      };
      await AsyncStorage.setItem('@biblia_notification_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de notificações:', error);
    }
  }

  async initializeVerseBank() {
    // Banco de versículos para "Palavra do Dia"
    this.verseBank = [
      {
        reference: 'Jo 3:16',
        text: 'Porque Deus amou tanto o mundo, que entregou o seu Filho único, para que todo o que nele crê não pereça, mas tenha a vida eterna.',
        category: 'amor'
      },
      {
        reference: 'Fl 4:13',
        text: 'Tudo posso naquele que me fortalece.',
        category: 'força'
      },
      {
        reference: 'Sl 23:1',
        text: 'O Senhor é o meu pastor: nada me falta.',
        category: 'confiança'
      },
      {
        reference: 'Mt 5:3',
        text: 'Bem-aventurados os pobres em espírito, porque deles é o Reino dos céus.',
        category: 'bem-aventurança'
      },
      {
        reference: 'Rm 8:28',
        text: 'Sabemos que todas as coisas contribuem para o bem daqueles que amam a Deus.',
        category: 'providência'
      },
      {
        reference: 'Pr 3:5-6',
        text: 'Confia no Senhor de todo o coração e não te apoies na tua própria inteligência.',
        category: 'sabedoria'
      },
      {
        reference: '1Co 13:4',
        text: 'O amor é paciente, o amor é bondoso.',
        category: 'amor'
      }
    ];
  }

  async scheduleWordOfDay() {
    if (!this.isEnabled || !this.wordOfDayEnabled) {
      return false;
    }

    try {
      // Cancelar notificações anteriores
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Agendar para os próximos 7 dias
      for (let i = 0; i < 7; i++) {
        const verse = this.getRandomVerse();
        const notificationTime = new Date();
        notificationTime.setDate(notificationTime.getDate() + i);
        notificationTime.setHours(8, 0, 0, 0); // 8:00 AM

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '📖 Palavra do Dia',
            body: `${verse.reference} - ${verse.text.substring(0, 100)}...`,
            data: {
              type: 'word-of-day',
              verse: verse,
              date: notificationTime.toISOString()
            },
          },
          trigger: {
            date: notificationTime,
          },
        });
      }

      console.log('✅ Palavra do Dia agendada para os próximos 7 dias');
      return true;
    } catch (error) {
      console.error('❌ Erro ao agendar Palavra do Dia:', error);
      return false;
    }
  }

  getRandomVerse() {
    const randomIndex = Math.floor(Math.random() * this.verseBank.length);
    return this.verseBank[randomIndex];
  }

  getVerseByCategory(category) {
    const categoryVerses = this.verseBank.filter(v => v.category === category);
    if (categoryVerses.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryVerses.length);
      return categoryVerses[randomIndex];
    }
    return this.getRandomVerse();
  }

  async scheduleCustomReminder(reminderData) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const reminderId = `reminder_${Date.now()}`;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminderData.title || '🙏 Lembrete Bíblico',
          body: reminderData.message,
          data: {
            type: 'custom-reminder',
            id: reminderId,
            ...reminderData
          },
        },
        trigger: reminderData.trigger,
      });

      // Salvar lembrete personalizado
      this.customReminders.push({
        id: reminderId,
        ...reminderData,
        createdAt: new Date().toISOString()
      });

      await this.saveSettings();
      console.log('✅ Lembrete personalizado agendado:', reminderId);
      return reminderId;
    } catch (error) {
      console.error('❌ Erro ao agendar lembrete personalizado:', error);
      return false;
    }
  }

  async cancelReminder(reminderId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(reminderId);
      this.customReminders = this.customReminders.filter(r => r.id !== reminderId);
      await this.saveSettings();
      console.log('✅ Lembrete cancelado:', reminderId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao cancelar lembrete:', error);
      return false;
    }
  }

  async toggleWordOfDay(enabled) {
    this.wordOfDayEnabled = enabled;
    await this.saveSettings();

    if (enabled) {
      await this.scheduleWordOfDay();
    } else {
      // Cancelar apenas notificações de palavra do dia
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const wordOfDayNotifications = scheduledNotifications.filter(
        n => n.content.data?.type === 'word-of-day'
      );
      
      for (const notification of wordOfDayNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    return enabled;
  }

  async createReadingPlanReminders(planData) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const reminders = [];
      const { name, duration, readings } = planData;

      for (let day = 0; day < duration; day++) {
        const reading = readings[day];
        if (!reading) continue;

        const reminderTime = new Date();
        reminderTime.setDate(reminderTime.getDate() + day);
        reminderTime.setHours(19, 0, 0, 0); // 7:00 PM

        const reminderId = await this.scheduleCustomReminder({
          title: `📚 ${name} - Dia ${day + 1}`,
          message: `Leitura de hoje: ${reading.reference}`,
          trigger: { date: reminderTime },
          category: 'reading-plan',
          planName: name,
          day: day + 1,
          reading: reading
        });

        if (reminderId) {
          reminders.push(reminderId);
        }
      }

      console.log(`✅ ${reminders.length} lembretes criados para o plano: ${name}`);
      return reminders;
    } catch (error) {
      console.error('❌ Erro ao criar lembretes do plano de leitura:', error);
      return false;
    }
  }

  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications.map(n => ({
        id: n.identifier,
        title: n.content.title,
        body: n.content.body,
        data: n.content.data,
        trigger: n.trigger
      }));
    } catch (error) {
      console.error('Erro ao buscar notificações agendadas:', error);
      return [];
    }
  }

  async sendImmediateNotification(title, body, data = {}) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            type: 'immediate',
            timestamp: new Date().toISOString(),
            ...data
          },
        },
        trigger: null, // Enviar imediatamente
      });

      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar notificação imediata:', error);
      return false;
    }
  }

  getSettings() {
    return {
      isEnabled: this.isEnabled,
      wordOfDayEnabled: this.wordOfDayEnabled,
      customRemindersCount: this.customReminders.length,
      verseBankSize: this.verseBank.length
    };
  }

  async addVerseToBank(verse) {
    this.verseBank.push({
      reference: verse.reference,
      text: verse.text,
      category: verse.category || 'personalizado',
      addedBy: 'user',
      addedAt: new Date().toISOString()
    });

    // Salvar banco de versículos personalizado
    try {
      await AsyncStorage.setItem('@biblia_custom_verses', JSON.stringify(this.verseBank));
    } catch (error) {
      console.error('Erro ao salvar versículo personalizado:', error);
    }
  }

  // Listener para quando o app receber uma notificação
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Listener para quando o usuário tocar na notificação
  addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export default NotificationsPlugin;