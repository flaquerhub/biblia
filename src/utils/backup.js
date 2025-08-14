import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';
import DatabaseManager from './database';

class BackupManager {
  constructor() {
    this.backupPath = RNFS.DocumentDirectoryPath + '/biblia_backup.json';
  }

  async createBackup() {
    try {
      const data = await DatabaseManager.exportData();
      const jsonData = JSON.stringify(data, null, 2);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `biblia_backup_${timestamp}.json`;
      const filePath = RNFS.DocumentDirectoryPath + '/' + fileName;
      
      await RNFS.writeFile(filePath, jsonData, 'utf8');
      
      return {
        success: true,
        filePath,
        fileName,
        message: 'Backup criado com sucesso!'
      };
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return {
        success: false,
        message: 'Erro ao criar backup: ' + error.message
      };
    }
  }

  async shareBackup() {
    try {
      const backup = await this.createBackup();
      if (!backup.success) {
        return backup;
      }

      const shareOptions = {
        title: 'Backup - Bíblia Católica',
        message: 'Backup das suas marcações, favoritos e anotações',
        url: 'file://' + backup.filePath,
        type: 'application/json',
        filename: backup.fileName
      };

      await Share.open(shareOptions);
      return { success: true, message: 'Backup compartilhado!' };
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Erro ao compartilhar backup:', error);
        return { success: false, message: 'Erro ao compartilhar: ' + error.message };
      }
      return { success: false, message: 'Compartilhamento cancelado' };
    }
  }

  async selectAndRestoreBackup() {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false
      });

      const file = result[0];
      
      if (!file.name.includes('.json')) {
        return { success: false, message: 'Por favor, selecione um arquivo .json válido' };
      }

      const fileContent = await RNFS.readFile(file.uri, 'utf8');
      const data = JSON.parse(fileContent);

      // Validar estrutura do backup
      if (!data.version || !data.export_date) {
        return { success: false, message: 'Arquivo de backup inválido' };
      }

      const result = await DatabaseManager.importData(data);
      return result;
    } catch (error) {
      if (error.message.includes('cancelled')) {
        return { success: false, message: 'Seleção cancelada' };
      }
      console.error('Erro ao restaurar backup:', error);
      return { success: false, message: 'Erro ao restaurar: ' + error.message };
    }
  }

  async getBackupInfo() {
    try {
      const stats = await DatabaseManager.exportData();
      return {
        totalMarkings: stats.markings.length,
        totalFavorites: stats.favorites.length,
        totalTags: stats.tags.length,
        totalDiaryEntries: stats.spiritual_diary.length,
        lastUpdate: new Date().toLocaleDateString('pt-BR')
      };
    } catch (error) {
      return null;
    }
  }
}

export default new BackupManager();