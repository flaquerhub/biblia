import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DatabaseManager from './DatabaseManager';

// Configuração de como as notificações devem ser tratadas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationManager {
  constructor() {
    this.dailyVerses = [
      {
        text: "Porque eu sei que pensamentos tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
        reference: "Jeremias 29:11",
        book_id: 24,
        chapter_id: 29,
        verse_id: 11
      },
      {
        text: "Tudo posso naquele que me fortalece.",
        reference: "Filipenses 4:13",
        book_id: 50,
        chapter_id: 4,
        verse_id: 13
      },
      {
        text: "O Senhor é o meu pastor; nada me faltará.",
        reference: "Salmos 23:1",
        book_id: 19,
        chapter_id: 23,
        verse_id: 1
      },
      {
        text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
        reference: "Provérbios 3:5",
        book_id: 20,
        chapter_id: 3,
        verse_id: 5
      },
      {
        text: "Buscai primeiro o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.",
        reference: "Mateus 6:33",
        book_id: 40,
        chapter_id: 6,
        verse_id: 33
      },
      {
        text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
        reference: "Mateus 11:28",
        book_id: 40,
        chapter_id: 11,
        verse_id: 28
      },
      {
        text: "Não temais, porque eu sou convosco; não vos assombreis, porque eu sou o vosso Deus.",
        reference: "Isaías 41:10",
        book_id: 23,
        chapter_id: 41,
        verse_id: 10
      },
      {
        text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
        reference: "Romanos 8:28",
        book_id: 45,
        chapter_id: 8,
        verse_id: 28
      }
    ];
  }

  async initialize() {
    try {
      // Verificar se é um dispositivo físico
      if (Device.isDevice) {
        // Solicitar permissões
        const { status } = await Notifications.getPermissionsAsync();
        let finalStatus = status;

        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          finalStatus = newStatus;
        }

        if (finalStatus !== 'granted') {
          console.warn('Permissão para notificações negada');
          return { success: false, error: 'Permissões negadas' };
        }

        // Configurar canal de notificação (Android)
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('palavra-do-dia', {
            name: 'Palavra do Dia',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#8B4513',
            sound: true,
          });
        }

        console.log('✅ NotificationManager inicializado com sucesso');
        return { success: true };
      } else {
        console.warn('Notificações só funcionam em dispositivos físicos');
        return { success: false, error: 'Não é um dispositivo físico' };
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar NotificationManager:', error);
      return { success: false, error: error.message };
    }
  }

  async scheduleWordOfDay(settings) {
    try {
      // Cancelar notificações existentes
      await this.cancelAllWordOfDayNotifications();

      // Configurações padrão
      const defaultSettings = {
        enabled: true,
        times: ['07:00'],
        frequency: 'daily', // 'daily', 'multiple', 'interval', 'custom'
        intervalMinutes: 60,
        soundEnabled: true,
        vibrationEnabled: true,
        includeImage: false,
        customTimes: [],
        ...settings
      };

      if (!defaultSettings.enabled) {
        return { success: true, message: 'Notificações desabilitadas' };
      }

      let scheduledCount = 0;

      switch (defaultSettings.frequency) {
        case 'daily':
          scheduledCount = await this.scheduleDailyNotifications(defaultSettings);
          break;
        
        case 'multiple':
          scheduledCount = await this.scheduleMultipleNotifications(defaultSettings);
          break;
        
        case 'interval':
          scheduledCount = await this.scheduleIntervalNotifications(defaultSettings);
          break;
        
        case 'custom':
          scheduledCount = await this.scheduleCustomNotifications(defaultSettings);
          break;
      }

      // Salvar configurações
      await DatabaseManager.setSetting('wordOfDaySettings', defaultSettings);

      return { 
        success: true, 
        scheduledCount,
        message: `${scheduledCount} notificações agendadas` 
      };

    } catch (error) {
      console.error('Erro ao agendar palavra do dia:', error);
      return { success: false, error: error.message };
    }
  }

  async scheduleDailyNotifications(settings) {
    let count = 0;
    const time = settings.times[0] || '07:00';
    const [hours, minutes] = time.split(':').map(Number);

    // Agendar para os próximos 30 dias
    for (let day = 0; day < 30; day++) {
      const notificationDate = new Date();
      notificationDate.setDate(notificationDate.getDate() + day);
      notificationDate.setHours(hours, minutes, 0, 0);

      // Se o horário já passou hoje, começar amanhã
      if (day === 0 && notificationDate.getTime() <= Date.now()) {
        continue;
      }

      const verse = this.getVerseForDate(notificationDate);
      
      await Notifications.scheduleNotificationAsync({
        identifier: `word-of-day-${day}`,
        content: {
          title: '✝️ Palavra do Dia',
          body: `"${verse.text}" - ${verse.reference}`,
          sound: settings.soundEnabled ? 'default' : null,
          vibrate: settings.vibrationEnabled ? [0, 250, 250, 250] : null,
          data: {
            type: 'word_of_day',
            verse,
            date: notificationDate.toISOString()
          }
        },
        trigger: {
          date: notificationDate,
        }
      });

      count++;
    }

    return count;
  }

  async scheduleMultipleNotifications(settings) {
    let count = 0;
    const times = settings.times || ['07:00', '12:00', '19:00'];

    // Agendar para os próximos 7 dias
    for (let day = 0; day < 7; day++) {
      for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
        const time = times[timeIndex];
        const [hours, minutes] = time.split(':').map(Number);

        const notificationDate = new Date();
        notificationDate.setDate(notificationDate.getDate() + day);
        notificationDate.setHours(hours, minutes, 0, 0);

        // Se o horário já passou hoje, pular
        if (day === 0 && notificationDate.getTime() <= Date.now()) {
          continue;
        }

        const verse = this.getVerseForDate(notificationDate, timeIndex);
        
        await Notifications.scheduleNotificationAsync({
          identifier: `word-of-day-${day}-${timeIndex}`,
          content: {
            title: '✝️ Palavra do Dia',
            body: `"${verse.text}" - ${verse.reference}`,
            sound: settings.soundEnabled ? 'default' : null,
            vibrate: settings.vibrationEnabled ? [0, 250, 250, 250] : null,
            data: {
              type: 'word_of_day',
              verse,
              date: notificationDate.toISOString(),
              timeIndex
            }
          },
          trigger: {
            date: notificationDate,
          }
        });

        count++;
      }
    }

    return count;
  }

  async scheduleIntervalNotifications(settings) {
    let count = 0;
    const intervalMinutes = settings.intervalMinutes || 60;
    const startTime = settings.times[0] || '07:00';
    const endTime = settings.endTime || '21:00';

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    // Agendar para hoje e próximos 6 dias
    for (let day = 0; day < 7; day++) {
      let currentTime = new Date();
      currentTime.setDate(currentTime.getDate() + day);
      currentTime.setHours(startHours, startMinutes, 0, 0);

      const endTimeToday = new Date();
      endTimeToday.setDate(endTimeToday.getDate() + day);
      endTimeToday.setHours(endHours, endMinutes, 0, 0);

      let notificationIndex = 0;

      while (currentTime.getTime() <= endTimeToday.getTime()) {
        // Se for hoje e o horário já passou, pular
        if (day === 0 && currentTime.getTime() <= Date.now()) {
          currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
          continue;
        }

        const verse = this.getVerseForDate(currentTime, notificationIndex);
        
        await Notifications.scheduleNotificationAsync({
          identifier: `word-interval-${day}-${notificationIndex}`,
          content: {
            title: '✝️ Palavra do Dia',
            body: `"${verse.text}" - ${verse.reference}`,
            sound: settings.soundEnabled ? 'default' : null,
            vibrate: settings.vibrationEnabled ? [0, 250, 250, 250] : null,
            data: {
              type: 'word_of_day_interval',
              verse,
              date: currentTime.toISOString()
            }
          },
          trigger: {
            date: currentTime,
          }
        });

        count++;
        notificationIndex++;
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
      }
    }

    return count;
  }

  async scheduleCustomNotifications(settings) {
    let count = 0;
    const customTimes = settings.customTimes || [];

    if (customTimes.length === 0) {
      return 0;
    }

    // Agendar para os próximos 7 dias
    for (let day = 0; day < 7; day++) {
      for (let timeIndex = 0; timeIndex < customTimes.length; timeIndex++) {
        const customTime = customTimes[timeIndex];
        const [hours, minutes] = customTime.time.split(':').map(Number);

        const notificationDate = new Date();
        notificationDate.setDate(notificationDate.getDate() + day);
        notificationDate.setHours(hours, minutes, 0, 0);

        // Se o horário já passou hoje, pular
        if (day === 0 && notificationDate.getTime() <= Date.now()) {
          continue;
        }

        const verse = customTime.verse || this.getVerseForDate(notificationDate, timeIndex);
        
        await Notifications.scheduleNotificationAsync({
          identifier: `word-custom-${day}-${timeIndex}`,
          content: {
            title: customTime.title || '✝️ Palavra do Dia',
            body: customTime.customMessage || `"${verse.text}" - ${verse.reference}`,
            sound: settings.soundEnabled ? 'default' : null,
            vibrate: settings.vibrationEnabled ? [0, 250, 250, 250] : null,
            data: {
              type: 'word_of_day_custom',
              verse,
              date: notificationDate.toISOString(),
              customData: customTime
            }
          },
          trigger: {
            date: notificationDate,
          }
        });

        count++;
      }
    }

    return count;
  }

  getVerseForDate(date, index = 0) {
    // Gerar um índice baseado na data e index para ter variedade
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const verseIndex = (dayOfYear + index) % this.dailyVerses.length;
    return this.dailyVerses[verseIndex];
  }

  async cancelAllWordOfDayNotifications() {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      const wordOfDayNotifications = scheduledNotifications.filter(notification => 
        notification.identifier.includes('word-of-day') || 
        notification.identifier.includes('word-interval') ||
        notification.identifier.includes('word-custom')
      );

      for (const notification of wordOfDayNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      console.log(`✅ ${wordOfDayNotifications.length} notificações canceladas`);
      return { success: true, canceledCount: wordOfDayNotifications.length };
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  async getScheduledNotifications() {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      const wordOfDayNotifications = scheduledNotifications.filter(notification => 
        notification.identifier.includes('word-of-day') || 
        notification.identifier.includes('word-interval') ||
        notification.identifier.includes('word-custom')
      );

      return wordOfDayNotifications.map(notification => ({
        identifier: notification.identifier,
        date: notification.trigger.date,
        title: notification.content.title,
        body: notification.content.body,
        data: notification.content.data
      }));
    } catch (error) {
      console.error('Erro ao buscar notificações agendadas:', error);
      return [];
    }
  }

  async getCurrentSettings() {
    try {
      return await DatabaseManager.getSetting('wordOfDaySettings', {
        enabled: false,
        times: ['07:00'],
        frequency: 'daily',
        intervalMinutes: 60,
        soundEnabled: true,
        vibrationEnabled: true,
        includeImage: false,
        customTimes: []
      });
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return null;
    }
  }

  // Método para testar uma notificação imediatamente
  async testNotification() {
    try {
      const verse = this.dailyVerses[0];
      
      await Notifications.scheduleNotificationAsync({
        identifier: 'test-notification',
        content: {
          title: '✝️ Teste - Palavra do Dia',
          body: `"${verse.text}" - ${verse.reference}`,
          sound: 'default',
          data: {
            type: 'test',
            verse
          }
        },
        trigger: {
          seconds: 2,
        }
      });

      return { success: true, message: 'Notificação de teste enviada' };
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para adicionar novos versículos à lista
  async addCustomVerse(text, reference, bookId, chapterId, verseId) {
    try {
      const newVerse = {
        text,
        reference,
        book_id: bookId,
        chapter_id: chapterId,
        verse_id: verseId
      };

      // Salvar versículos personalizados no banco
      const customVerses = await DatabaseManager.getSetting('customDailyVerses', []);
      customVerses.push(newVerse);
      await DatabaseManager.setSetting('customDailyVerses', customVerses);

      // Adicionar à lista local também
      this.dailyVerses.push(newVerse);

      return { success: true, message: 'Versículo adicionado' };
    } catch (error) {
      console.error('Erro ao adicionar versículo personalizado:', error);
      return { success: false, error: error.message };
    }
  }

  async loadCustomVerses() {
    try {
      const customVerses = await DatabaseManager.getSetting('customDailyVerses', []);
      this.dailyVerses = [...this.dailyVerses, ...customVerses];
      return { success: true, count: customVerses.length };
    } catch (error) {
      console.error('Erro ao carregar versículos personalizados:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instância única
const notificationManager = new NotificationManager();
export default notificationManager;