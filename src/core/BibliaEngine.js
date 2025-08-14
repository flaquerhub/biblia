// src/core/BibliaEngine.js

// Função para limpar códigos RTF
const cleanRTF = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\\par\s*/g, ' ')
    .replace(/\{\\qc\\b\s*/g, '')
    .replace(/\{\\i\s*/g, '')
    .replace(/\\qc\\b\\i\s*/g, '')
    .replace(/\{[^}]*\}/g, '')
    .replace(/\\[a-z]+\d*\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// INFORMAÇÕES COMPLETAS DE TODOS OS 73 LIVROS (mesmo código anterior)
const BOOKS_INFO = {
  // ANTIGO TESTAMENTO - Pentateuco
  genesis: { name: 'Gênesis', abbr: 'Gn', category: 'Pentateuco', chapters: 50, testament: 'AT', folder: '01_Gn', prefix: 'Gn' },
  exodus: { name: 'Êxodo', abbr: 'Ex', category: 'Pentateuco', chapters: 40, testament: 'AT', folder: '02_Ex', prefix: 'Ex' },
  leviticus: { name: 'Levítico', abbr: 'Lv', category: 'Pentateuco', chapters: 27, testament: 'AT', folder: '03_Lv', prefix: 'Lv' },
  numbers: { name: 'Números', abbr: 'Nm', category: 'Pentateuco', chapters: 36, testament: 'AT', folder: '04_Nm', prefix: 'Nm' },
  deuteronomy: { name: 'Deuteronômio', abbr: 'Dt', category: 'Pentateuco', chapters: 34, testament: 'AT', folder: '05_Dt', prefix: 'Dt' },
  
  // ANTIGO TESTAMENTO - Históricos
  joshua: { name: 'Josué', abbr: 'Js', category: 'Históricos', chapters: 24, testament: 'AT', folder: '06_Js', prefix: 'Js' },
  judges: { name: 'Juízes', abbr: 'Jz', category: 'Históricos', chapters: 21, testament: 'AT', folder: '07_Jz', prefix: 'Jz' },
  ruth: { name: 'Rute', abbr: 'Rt', category: 'Históricos', chapters: 4, testament: 'AT', folder: '08_Rt', prefix: 'Rt' },
  samuel1: { name: 'I Samuel', abbr: '1Sm', category: 'Históricos', chapters: 31, testament: 'AT', folder: '09_1Sm', prefix: '1Sm' },
  samuel2: { name: 'II Samuel', abbr: '2Sm', category: 'Históricos', chapters: 24, testament: 'AT', folder: '10_2Sm', prefix: '2Sm' },
  kings1: { name: 'I Reis', abbr: '1Rs', category: 'Históricos', chapters: 22, testament: 'AT', folder: '11_1Rs', prefix: '1Rs' },
  kings2: { name: 'II Reis', abbr: '2Rs', category: 'Históricos', chapters: 25, testament: 'AT', folder: '12_2Rs', prefix: '2Rs' },
  chronicles1: { name: 'I Crônicas', abbr: '1Cr', category: 'Históricos', chapters: 29, testament: 'AT', folder: '13_1Cr', prefix: '1Cr' },
  chronicles2: { name: 'II Crônicas', abbr: '2Cr', category: 'Históricos', chapters: 36, testament: 'AT', folder: '14_2Cr', prefix: '2Cr' },
  ezra: { name: 'Esdras', abbr: 'Ed', category: 'Históricos', chapters: 10, testament: 'AT', folder: '15_Ed', prefix: 'Ed' },
  nehemiah: { name: 'Neemias', abbr: 'Ne', category: 'Históricos', chapters: 13, testament: 'AT', folder: '16_Ne', prefix: 'Ne' },
  tobit: { name: 'Tobias', abbr: 'Tb', category: 'Históricos', chapters: 14, testament: 'AT', folder: '17_Tb', prefix: 'Tb' },
  judith: { name: 'Judite', abbr: 'Jt', category: 'Históricos', chapters: 16, testament: 'AT', folder: '18_Jt', prefix: 'Jt' },
  esther: { name: 'Ester', abbr: 'Et', category: 'Históricos', chapters: 10, testament: 'AT', folder: '19_Et', prefix: 'Et' },
  maccabees1: { name: 'I Macabeus', abbr: '1Mc', category: 'Históricos', chapters: 16, testament: 'AT', folder: '20_1Mc', prefix: '1Mc' },
  maccabees2: { name: 'II Macabeus', abbr: '2Mc', category: 'Históricos', chapters: 15, testament: 'AT', folder: '21_2Mc', prefix: '2Mc' },
  
  // ANTIGO TESTAMENTO - Sapienciais
  job: { name: 'Jó', abbr: 'Jó', category: 'Sapienciais', chapters: 42, testament: 'AT', folder: '22_Jó', prefix: 'Jó' },
  psalms: { name: 'Salmos', abbr: 'Sl', category: 'Sapienciais', chapters: 150, testament: 'AT', folder: '23_Sl', prefix: 'Sl' },
  proverbs: { name: 'Provérbios', abbr: 'Pv', category: 'Sapienciais', chapters: 31, testament: 'AT', folder: '24_Pv', prefix: 'Pv' },
  ecclesiastes: { name: 'Eclesiastes', abbr: 'Ec', category: 'Sapienciais', chapters: 12, testament: 'AT', folder: '25_Ec', prefix: 'Ec' },
  song: { name: 'Cântico dos Cânticos', abbr: 'Ct', category: 'Sapienciais', chapters: 8, testament: 'AT', folder: '26_Ct', prefix: 'Ct' },
  wisdom: { name: 'Sabedoria', abbr: 'Sb', category: 'Sapienciais', chapters: 19, testament: 'AT', folder: '27_Sb', prefix: 'Sb' },
  sirach: { name: 'Eclesiástico', abbr: 'Eclo', category: 'Sapienciais', chapters: 51, testament: 'AT', folder: '28_Eclo', prefix: 'Eclo' },
  
  // ANTIGO TESTAMENTO - Profetas
  isaiah: { name: 'Isaías', abbr: 'Is', category: 'Profetas', chapters: 66, testament: 'AT', folder: '29_Is', prefix: 'Is' },
  jeremiah: { name: 'Jeremias', abbr: 'Jr', category: 'Profetas', chapters: 52, testament: 'AT', folder: '30_Jr', prefix: 'Jr' },
  lamentations: { name: 'Lamentações', abbr: 'Lm', category: 'Profetas', chapters: 5, testament: 'AT', folder: '31_Lm', prefix: 'Lm' },
  baruch: { name: 'Baruc', abbr: 'Br', category: 'Profetas', chapters: 6, testament: 'AT', folder: '32_Br', prefix: 'Br' },
  ezekiel: { name: 'Ezequiel', abbr: 'Ez', category: 'Profetas', chapters: 48, testament: 'AT', folder: '33_Ez', prefix: 'Ez' },
  daniel: { name: 'Daniel', abbr: 'Dn', category: 'Profetas', chapters: 12, testament: 'AT', folder: '34_Dn', prefix: 'Dn' },
  hosea: { name: 'Oséias', abbr: 'Os', category: 'Profetas', chapters: 14, testament: 'AT', folder: '35_Os', prefix: 'Os' },
  joel: { name: 'Joel', abbr: 'Jl', category: 'Profetas', chapters: 3, testament: 'AT', folder: '36_Jl', prefix: 'Jl' },
  amos: { name: 'Amós', abbr: 'Am', category: 'Profetas', chapters: 9, testament: 'AT', folder: '37_Am', prefix: 'Am' },
  obadiah: { name: 'Abdias', abbr: 'Ob', category: 'Profetas', chapters: 1, testament: 'AT', folder: '38_Ob', prefix: 'Ob' },
  jonah: { name: 'Jonas', abbr: 'Jn', category: 'Profetas', chapters: 4, testament: 'AT', folder: '39_Jn', prefix: 'Jn' },
  micah: { name: 'Miqueias', abbr: 'Mq', category: 'Profetas', chapters: 7, testament: 'AT', folder: '40_Mq', prefix: 'Mq' },
  nahum: { name: 'Naum', abbr: 'Na', category: 'Profetas', chapters: 3, testament: 'AT', folder: '41_Na', prefix: 'Na' },
  habakkuk: { name: 'Habacuc', abbr: 'Hc', category: 'Profetas', chapters: 3, testament: 'AT', folder: '42_Hc', prefix: 'Hc' },
  zephaniah: { name: 'Sofonias', abbr: 'Sf', category: 'Profetas', chapters: 3, testament: 'AT', folder: '43_Sf', prefix: 'Sf' },
  haggai: { name: 'Ageu', abbr: 'Ag', category: 'Profetas', chapters: 2, testament: 'AT', folder: '44_Ag', prefix: 'Ag' },
  zechariah: { name: 'Zacarias', abbr: 'Zc', category: 'Profetas', chapters: 14, testament: 'AT', folder: '45_Zc', prefix: 'Zc' },
  malachi: { name: 'Malaquias', abbr: 'Ml', category: 'Profetas', chapters: 3, testament: 'AT', folder: '46_Ml', prefix: 'Ml' },
  
  // NOVO TESTAMENTO - Evangelhos
  matthew: { name: 'São Mateus', abbr: 'Mt', category: 'Evangelhos', chapters: 28, testament: 'NT', folder: '47_Mt', prefix: 'Mt' },
  mark: { name: 'São Marcos', abbr: 'Mc', category: 'Evangelhos', chapters: 16, testament: 'NT', folder: '48_Mc', prefix: 'Mc' },
  luke: { name: 'São Lucas', abbr: 'Lc', category: 'Evangelhos', chapters: 24, testament: 'NT', folder: '49_Lc', prefix: 'Lc' },
  john: { name: 'São João', abbr: 'Jo', category: 'Evangelhos', chapters: 21, testament: 'NT', folder: '50_Jo', prefix: 'Jo' },
  
  // NOVO TESTAMENTO - Atos e Cartas
  acts: { name: 'Atos dos Apóstolos', abbr: 'At', category: 'Históricos', chapters: 28, testament: 'NT', folder: '51_At', prefix: 'At' },
  romans: { name: 'Romanos', abbr: 'Rm', category: 'Cartas Paulinas', chapters: 16, testament: 'NT', folder: '52_Rm', prefix: 'Rm' },
  corinthians1: { name: 'I Coríntios', abbr: '1Co', category: 'Cartas Paulinas', chapters: 16, testament: 'NT', folder: '53_1Co', prefix: '1Co' },
  corinthians2: { name: 'II Coríntios', abbr: '2Co', category: 'Cartas Paulinas', chapters: 13, testament: 'NT', folder: '54_2Co', prefix: '2Co' },
  galatians: { name: 'Gálatas', abbr: 'Gl', category: 'Cartas Paulinas', chapters: 6, testament: 'NT', folder: '55_Gl', prefix: 'Gl' },
  ephesians: { name: 'Efésios', abbr: 'Ef', category: 'Cartas Paulinas', chapters: 6, testament: 'NT', folder: '56_Ef', prefix: 'Ef' },
  philippians: { name: 'Filipenses', abbr: 'Fl', category: 'Cartas Paulinas', chapters: 4, testament: 'NT', folder: '57_Fl', prefix: 'Fl' },
  colossians: { name: 'Colossenses', abbr: 'Cl', category: 'Cartas Paulinas', chapters: 4, testament: 'NT', folder: '58_Cl', prefix: 'Cl' },
  thessalonians1: { name: 'I Tessalonicenses', abbr: '1Ts', category: 'Cartas Paulinas', chapters: 5, testament: 'NT', folder: '59_1Ts', prefix: '1Ts' },
  thessalonians2: { name: 'II Tessalonicenses', abbr: '2Ts', category: 'Cartas Paulinas', chapters: 3, testament: 'NT', folder: '60_2Ts', prefix: '2Ts' },
  timothy1: { name: 'I Timóteo', abbr: '1Tm', category: 'Cartas Paulinas', chapters: 6, testament: 'NT', folder: '61_1Tm', prefix: '1Tm' },
  timothy2: { name: 'II Timóteo', abbr: '2Tm', category: 'Cartas Paulinas', chapters: 4, testament: 'NT', folder: '62_2Tm', prefix: '2Tm' },
  titus: { name: 'Tito', abbr: 'Tt', category: 'Cartas Paulinas', chapters: 3, testament: 'NT', folder: '63_Tt', prefix: 'Tt' },
  philemon: { name: 'Filêmon', abbr: 'Fm', category: 'Cartas Paulinas', chapters: 1, testament: 'NT', folder: '64_Fm', prefix: 'Fm' },
  hebrews: { name: 'Hebreus', abbr: 'Hb', category: 'Cartas Gerais', chapters: 13, testament: 'NT', folder: '65_Hb', prefix: 'Hb' },
  james: { name: 'São Tiago', abbr: 'Tg', category: 'Cartas Gerais', chapters: 5, testament: 'NT', folder: '66_Tg', prefix: 'Tg' },
  peter1: { name: 'I São Pedro', abbr: '1Pe', category: 'Cartas Gerais', chapters: 5, testament: 'NT', folder: '67_1Pe', prefix: '1Pe' },
  peter2: { name: 'II São Pedro', abbr: '2Pe', category: 'Cartas Gerais', chapters: 3, testament: 'NT', folder: '68_2Pe', prefix: '2Pe' },
  john1: { name: 'I São João', abbr: '1Jo', category: 'Cartas Gerais', chapters: 5, testament: 'NT', folder: '69_1Jo', prefix: '1Jo' },
  john2: { name: 'II São João', abbr: '2Jo', category: 'Cartas Gerais', chapters: 1, testament: 'NT', folder: '70_2Jo', prefix: '2Jo' },
  john3: { name: 'III São João', abbr: '3Jo', category: 'Cartas Gerais', chapters: 1, testament: 'NT', folder: '71_3Jo', prefix: '3Jo' },
  jude: { name: 'São Judas', abbr: 'Jd', category: 'Cartas Gerais', chapters: 1, testament: 'NT', folder: '72_Jd', prefix: 'Jd' },
  revelation: { name: 'Apocalipse', abbr: 'Ap', category: 'Profético', chapters: 22, testament: 'NT', folder: '73_Ap', prefix: 'Ap' }
};

// FUNÇÕES DE CARREGAMENTO ESPECÍFICAS PARA CADA LIVRO

// Gênesis (50 capítulos)
const tryLoadGenesis = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/01_Gn/Gn_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/01_Gn/Gn_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/01_Gn/Gn_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/01_Gn/Gn_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/01_Gn/Gn_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/01_Gn/Gn_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/01_Gn/Gn_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/01_Gn/Gn_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/01_Gn/Gn_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/01_Gn/Gn_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/01_Gn/Gn_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/01_Gn/Gn_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/01_Gn/Gn_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/01_Gn/Gn_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/01_Gn/Gn_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/01_Gn/Gn_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/01_Gn/Gn_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/01_Gn/Gn_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/01_Gn/Gn_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/01_Gn/Gn_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/01_Gn/Gn_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/01_Gn/Gn_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/01_Gn/Gn_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/01_Gn/Gn_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/01_Gn/Gn_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/01_Gn/Gn_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/01_Gn/Gn_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/01_Gn/Gn_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/01_Gn/Gn_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/01_Gn/Gn_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/01_Gn/Gn_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/01_Gn/Gn_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/01_Gn/Gn_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/01_Gn/Gn_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/01_Gn/Gn_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/01_Gn/Gn_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/01_Gn/Gn_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/01_Gn/Gn_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/01_Gn/Gn_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/01_Gn/Gn_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/01_Gn/Gn_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/01_Gn/Gn_42_pt.json');
    if (chapter === 43) return require('../../assets/bible/AT/01_Gn/Gn_43_pt.json');
    if (chapter === 44) return require('../../assets/bible/AT/01_Gn/Gn_44_pt.json');
    if (chapter === 45) return require('../../assets/bible/AT/01_Gn/Gn_45_pt.json');
    if (chapter === 46) return require('../../assets/bible/AT/01_Gn/Gn_46_pt.json');
    if (chapter === 47) return require('../../assets/bible/AT/01_Gn/Gn_47_pt.json');
    if (chapter === 48) return require('../../assets/bible/AT/01_Gn/Gn_48_pt.json');
    if (chapter === 49) return require('../../assets/bible/AT/01_Gn/Gn_49_pt.json');
    if (chapter === 50) return require('../../assets/bible/AT/01_Gn/Gn_50_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Êxodo (40 capítulos)
const tryLoadExodus = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/02_Ex/Ex_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/02_Ex/Ex_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/02_Ex/Ex_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/02_Ex/Ex_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/02_Ex/Ex_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/02_Ex/Ex_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/02_Ex/Ex_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/02_Ex/Ex_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/02_Ex/Ex_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/02_Ex/Ex_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/02_Ex/Ex_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/02_Ex/Ex_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/02_Ex/Ex_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/02_Ex/Ex_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/02_Ex/Ex_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/02_Ex/Ex_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/02_Ex/Ex_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/02_Ex/Ex_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/02_Ex/Ex_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/02_Ex/Ex_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/02_Ex/Ex_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/02_Ex/Ex_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/02_Ex/Ex_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/02_Ex/Ex_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/02_Ex/Ex_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/02_Ex/Ex_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/02_Ex/Ex_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/02_Ex/Ex_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/02_Ex/Ex_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/02_Ex/Ex_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/02_Ex/Ex_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/02_Ex/Ex_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/02_Ex/Ex_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/02_Ex/Ex_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/02_Ex/Ex_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/02_Ex/Ex_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/02_Ex/Ex_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/02_Ex/Ex_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/02_Ex/Ex_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/02_Ex/Ex_40_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Levítico (27 capítulos)
const tryLoadLeviticus = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/03_Lv/Lv_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/03_Lv/Lv_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/03_Lv/Lv_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/03_Lv/Lv_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/03_Lv/Lv_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/03_Lv/Lv_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/03_Lv/Lv_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/03_Lv/Lv_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/03_Lv/Lv_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/03_Lv/Lv_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/03_Lv/Lv_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/03_Lv/Lv_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/03_Lv/Lv_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/03_Lv/Lv_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/03_Lv/Lv_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/03_Lv/Lv_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/03_Lv/Lv_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/03_Lv/Lv_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/03_Lv/Lv_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/03_Lv/Lv_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/03_Lv/Lv_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/03_Lv/Lv_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/03_Lv/Lv_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/03_Lv/Lv_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/03_Lv/Lv_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/03_Lv/Lv_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/03_Lv/Lv_27_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Números (36 capítulos)
const tryLoadNumbers = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/04_Nm/Nm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/04_Nm/Nm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/04_Nm/Nm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/04_Nm/Nm_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/04_Nm/Nm_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/04_Nm/Nm_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/04_Nm/Nm_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/04_Nm/Nm_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/04_Nm/Nm_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/04_Nm/Nm_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/04_Nm/Nm_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/04_Nm/Nm_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/04_Nm/Nm_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/04_Nm/Nm_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/04_Nm/Nm_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/04_Nm/Nm_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/04_Nm/Nm_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/04_Nm/Nm_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/04_Nm/Nm_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/04_Nm/Nm_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/04_Nm/Nm_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/04_Nm/Nm_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/04_Nm/Nm_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/04_Nm/Nm_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/04_Nm/Nm_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/04_Nm/Nm_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/04_Nm/Nm_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/04_Nm/Nm_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/04_Nm/Nm_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/04_Nm/Nm_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/04_Nm/Nm_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/04_Nm/Nm_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/04_Nm/Nm_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/04_Nm/Nm_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/04_Nm/Nm_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/04_Nm/Nm_36_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Deuteronômio (34 capítulos)
const tryLoadDeuteronomy = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/05_Dt/Dt_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/05_Dt/Dt_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/05_Dt/Dt_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/05_Dt/Dt_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/05_Dt/Dt_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/05_Dt/Dt_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/05_Dt/Dt_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/05_Dt/Dt_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/05_Dt/Dt_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/05_Dt/Dt_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/05_Dt/Dt_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/05_Dt/Dt_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/05_Dt/Dt_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/05_Dt/Dt_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/05_Dt/Dt_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/05_Dt/Dt_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/05_Dt/Dt_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/05_Dt/Dt_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/05_Dt/Dt_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/05_Dt/Dt_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/05_Dt/Dt_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/05_Dt/Dt_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/05_Dt/Dt_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/05_Dt/Dt_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/05_Dt/Dt_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/05_Dt/Dt_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/05_Dt/Dt_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/05_Dt/Dt_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/05_Dt/Dt_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/05_Dt/Dt_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/05_Dt/Dt_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/05_Dt/Dt_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/05_Dt/Dt_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/05_Dt/Dt_34_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Josué (24 capítulos)
const tryLoadJoshua = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/06_Js/Js_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/06_Js/Js_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/06_Js/Js_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/06_Js/Js_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/06_Js/Js_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/06_Js/Js_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/06_Js/Js_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/06_Js/Js_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/06_Js/Js_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/06_Js/Js_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/06_Js/Js_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/06_Js/Js_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/06_Js/Js_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/06_Js/Js_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/06_Js/Js_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/06_Js/Js_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/06_Js/Js_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/06_Js/Js_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/06_Js/Js_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/06_Js/Js_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/06_Js/Js_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/06_Js/Js_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/06_Js/Js_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/06_Js/Js_24_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Juízes (21 capítulos)
const tryLoadJudges = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/07_Jz/Jz_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/07_Jz/Jz_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/07_Jz/Jz_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/07_Jz/Jz_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/07_Jz/Jz_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/07_Jz/Jz_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/07_Jz/Jz_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/07_Jz/Jz_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/07_Jz/Jz_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/07_Jz/Jz_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/07_Jz/Jz_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/07_Jz/Jz_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/07_Jz/Jz_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/07_Jz/Jz_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/07_Jz/Jz_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/07_Jz/Jz_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/07_Jz/Jz_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/07_Jz/Jz_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/07_Jz/Jz_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/07_Jz/Jz_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/07_Jz/Jz_21_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Rute (4 capítulos)
const tryLoadRuth = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/08_Rt/Rt_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/08_Rt/Rt_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/08_Rt/Rt_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/08_Rt/Rt_04_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Samuel (31 capítulos)
const tryLoadSamuel1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/09_1Sm/1Sm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/09_1Sm/1Sm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/09_1Sm/1Sm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/09_1Sm/1Sm_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/09_1Sm/1Sm_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/09_1Sm/1Sm_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/09_1Sm/1Sm_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/09_1Sm/1Sm_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/09_1Sm/1Sm_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/09_1Sm/1Sm_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/09_1Sm/1Sm_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/09_1Sm/1Sm_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/09_1Sm/1Sm_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/09_1Sm/1Sm_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/09_1Sm/1Sm_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/09_1Sm/1Sm_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/09_1Sm/1Sm_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/09_1Sm/1Sm_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/09_1Sm/1Sm_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/09_1Sm/1Sm_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/09_1Sm/1Sm_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/09_1Sm/1Sm_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/09_1Sm/1Sm_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/09_1Sm/1Sm_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/09_1Sm/1Sm_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/09_1Sm/1Sm_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/09_1Sm/1Sm_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/09_1Sm/1Sm_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/09_1Sm/1Sm_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/09_1Sm/1Sm_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/09_1Sm/1Sm_31_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Samuel (24 capítulos)
const tryLoadSamuel2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/10_2Sm/2Sm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/10_2Sm/2Sm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/10_2Sm/2Sm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/10_2Sm/2Sm_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/10_2Sm/2Sm_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/10_2Sm/2Sm_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/10_2Sm/2Sm_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/10_2Sm/2Sm_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/10_2Sm/2Sm_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/10_2Sm/2Sm_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/10_2Sm/2Sm_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/10_2Sm/2Sm_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/10_2Sm/2Sm_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/10_2Sm/2Sm_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/10_2Sm/2Sm_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/10_2Sm/2Sm_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/10_2Sm/2Sm_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/10_2Sm/2Sm_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/10_2Sm/2Sm_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/10_2Sm/2Sm_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/10_2Sm/2Sm_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/10_2Sm/2Sm_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/10_2Sm/2Sm_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/10_2Sm/2Sm_24_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Reis (22 capítulos)
const tryLoadKings1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/11_1Rs/1Rs_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/11_1Rs/1Rs_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/11_1Rs/1Rs_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/11_1Rs/1Rs_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/11_1Rs/1Rs_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/11_1Rs/1Rs_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/11_1Rs/1Rs_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/11_1Rs/1Rs_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/11_1Rs/1Rs_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/11_1Rs/1Rs_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/11_1Rs/1Rs_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/11_1Rs/1Rs_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/11_1Rs/1Rs_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/11_1Rs/1Rs_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/11_1Rs/1Rs_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/11_1Rs/1Rs_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/11_1Rs/1Rs_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/11_1Rs/1Rs_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/11_1Rs/1Rs_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/11_1Rs/1Rs_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/11_1Rs/1Rs_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/11_1Rs/1Rs_22_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Reis (25 capítulos)
const tryLoadKings2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/12_2Rs/2Rs_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/12_2Rs/2Rs_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/12_2Rs/2Rs_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/12_2Rs/2Rs_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/12_2Rs/2Rs_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/12_2Rs/2Rs_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/12_2Rs/2Rs_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/12_2Rs/2Rs_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/12_2Rs/2Rs_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/12_2Rs/2Rs_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/12_2Rs/2Rs_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/12_2Rs/2Rs_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/12_2Rs/2Rs_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/12_2Rs/2Rs_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/12_2Rs/2Rs_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/12_2Rs/2Rs_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/12_2Rs/2Rs_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/12_2Rs/2Rs_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/12_2Rs/2Rs_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/12_2Rs/2Rs_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/12_2Rs/2Rs_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/12_2Rs/2Rs_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/12_2Rs/2Rs_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/12_2Rs/2Rs_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/12_2Rs/2Rs_25_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Crônicas (29 capítulos)
const tryLoadChronicles1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/13_1Cr/1Cr_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/13_1Cr/1Cr_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/13_1Cr/1Cr_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/13_1Cr/1Cr_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/13_1Cr/1Cr_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/13_1Cr/1Cr_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/13_1Cr/1Cr_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/13_1Cr/1Cr_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/13_1Cr/1Cr_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/13_1Cr/1Cr_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/13_1Cr/1Cr_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/13_1Cr/1Cr_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/13_1Cr/1Cr_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/13_1Cr/1Cr_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/13_1Cr/1Cr_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/13_1Cr/1Cr_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/13_1Cr/1Cr_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/13_1Cr/1Cr_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/13_1Cr/1Cr_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/13_1Cr/1Cr_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/13_1Cr/1Cr_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/13_1Cr/1Cr_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/13_1Cr/1Cr_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/13_1Cr/1Cr_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/13_1Cr/1Cr_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/13_1Cr/1Cr_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/13_1Cr/1Cr_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/13_1Cr/1Cr_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/13_1Cr/1Cr_29_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Crônicas (36 capítulos)
const tryLoadChronicles2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/14_2Cr/2Cr_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/14_2Cr/2Cr_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/14_2Cr/2Cr_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/14_2Cr/2Cr_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/14_2Cr/2Cr_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/14_2Cr/2Cr_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/14_2Cr/2Cr_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/14_2Cr/2Cr_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/14_2Cr/2Cr_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/14_2Cr/2Cr_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/14_2Cr/2Cr_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/14_2Cr/2Cr_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/14_2Cr/2Cr_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/14_2Cr/2Cr_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/14_2Cr/2Cr_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/14_2Cr/2Cr_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/14_2Cr/2Cr_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/14_2Cr/2Cr_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/14_2Cr/2Cr_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/14_2Cr/2Cr_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/14_2Cr/2Cr_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/14_2Cr/2Cr_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/14_2Cr/2Cr_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/14_2Cr/2Cr_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/14_2Cr/2Cr_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/14_2Cr/2Cr_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/14_2Cr/2Cr_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/14_2Cr/2Cr_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/14_2Cr/2Cr_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/14_2Cr/2Cr_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/14_2Cr/2Cr_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/14_2Cr/2Cr_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/14_2Cr/2Cr_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/14_2Cr/2Cr_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/14_2Cr/2Cr_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/14_2Cr/2Cr_36_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Esdras (10 capítulos)
const tryLoadEzra = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/15_Ed/Ed_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/15_Ed/Ed_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/15_Ed/Ed_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/15_Ed/Ed_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/15_Ed/Ed_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/15_Ed/Ed_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/15_Ed/Ed_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/15_Ed/Ed_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/15_Ed/Ed_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/15_Ed/Ed_10_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Neemias (13 capítulos)
const tryLoadNehemiah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/16_Ne/Ne_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/16_Ne/Ne_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/16_Ne/Ne_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/16_Ne/Ne_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/16_Ne/Ne_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/16_Ne/Ne_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/16_Ne/Ne_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/16_Ne/Ne_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/16_Ne/Ne_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/16_Ne/Ne_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/16_Ne/Ne_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/16_Ne/Ne_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/16_Ne/Ne_13_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Tobias (14 capítulos)
const tryLoadTobit = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/17_Tb/Tb_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/17_Tb/Tb_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/17_Tb/Tb_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/17_Tb/Tb_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/17_Tb/Tb_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/17_Tb/Tb_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/17_Tb/Tb_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/17_Tb/Tb_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/17_Tb/Tb_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/17_Tb/Tb_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/17_Tb/Tb_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/17_Tb/Tb_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/17_Tb/Tb_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/17_Tb/Tb_14_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Judite (16 capítulos)
const tryLoadJudith = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/18_Jt/Jt_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/18_Jt/Jt_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/18_Jt/Jt_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/18_Jt/Jt_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/18_Jt/Jt_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/18_Jt/Jt_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/18_Jt/Jt_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/18_Jt/Jt_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/18_Jt/Jt_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/18_Jt/Jt_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/18_Jt/Jt_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/18_Jt/Jt_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/18_Jt/Jt_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/18_Jt/Jt_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/18_Jt/Jt_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/18_Jt/Jt_16_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Ester (10 capítulos)
const tryLoadEsther = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/19_Et/Et_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/19_Et/Et_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/19_Et/Et_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/19_Et/Et_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/19_Et/Et_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/19_Et/Et_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/19_Et/Et_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/19_Et/Et_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/19_Et/Et_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/19_Et/Et_10_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Macabeus (16 capítulos)
const tryLoadMaccabees1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/20_1Mc/1Mc_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/20_1Mc/1Mc_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/20_1Mc/1Mc_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/20_1Mc/1Mc_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/20_1Mc/1Mc_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/20_1Mc/1Mc_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/20_1Mc/1Mc_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/20_1Mc/1Mc_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/20_1Mc/1Mc_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/20_1Mc/1Mc_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/20_1Mc/1Mc_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/20_1Mc/1Mc_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/20_1Mc/1Mc_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/20_1Mc/1Mc_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/20_1Mc/1Mc_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/20_1Mc/1Mc_16_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Macabeus (15 capítulos)
const tryLoadMaccabees2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/21_2Mc/2Mc_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/21_2Mc/2Mc_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/21_2Mc/2Mc_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/21_2Mc/2Mc_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/21_2Mc/2Mc_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/21_2Mc/2Mc_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/21_2Mc/2Mc_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/21_2Mc/2Mc_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/21_2Mc/2Mc_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/21_2Mc/2Mc_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/21_2Mc/2Mc_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/21_2Mc/2Mc_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/21_2Mc/2Mc_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/21_2Mc/2Mc_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/21_2Mc/2Mc_15_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Jó (42 capítulos)
const tryLoadJob = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/22_Jó/Jó_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/22_Jó/Jó_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/22_Jó/Jó_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/22_Jó/Jó_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/22_Jó/Jó_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/22_Jó/Jó_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/22_Jó/Jó_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/22_Jó/Jó_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/22_Jó/Jó_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/22_Jó/Jó_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/22_Jó/Jó_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/22_Jó/Jó_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/22_Jó/Jó_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/22_Jó/Jó_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/22_Jó/Jó_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/22_Jó/Jó_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/22_Jó/Jó_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/22_Jó/Jó_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/22_Jó/Jó_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/22_Jó/Jó_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/22_Jó/Jó_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/22_Jó/Jó_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/22_Jó/Jó_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/22_Jó/Jó_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/22_Jó/Jó_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/22_Jó/Jó_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/22_Jó/Jó_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/22_Jó/Jó_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/22_Jó/Jó_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/22_Jó/Jó_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/22_Jó/Jó_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/22_Jó/Jó_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/22_Jó/Jó_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/22_Jó/Jó_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/22_Jó/Jó_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/22_Jó/Jó_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/22_Jó/Jó_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/22_Jó/Jó_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/22_Jó/Jó_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/22_Jó/Jó_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/22_Jó/Jó_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/22_Jó/Jó_42_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Salmos (150 capítulos)
const tryLoadPsalms = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/23_Sl/Sl_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/23_Sl/Sl_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/23_Sl/Sl_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/23_Sl/Sl_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/23_Sl/Sl_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/23_Sl/Sl_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/23_Sl/Sl_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/23_Sl/Sl_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/23_Sl/Sl_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/23_Sl/Sl_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/23_Sl/Sl_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/23_Sl/Sl_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/23_Sl/Sl_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/23_Sl/Sl_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/23_Sl/Sl_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/23_Sl/Sl_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/23_Sl/Sl_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/23_Sl/Sl_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/23_Sl/Sl_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/23_Sl/Sl_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/23_Sl/Sl_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/23_Sl/Sl_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/23_Sl/Sl_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/23_Sl/Sl_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/23_Sl/Sl_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/23_Sl/Sl_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/23_Sl/Sl_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/23_Sl/Sl_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/23_Sl/Sl_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/23_Sl/Sl_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/23_Sl/Sl_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/23_Sl/Sl_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/23_Sl/Sl_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/23_Sl/Sl_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/23_Sl/Sl_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/23_Sl/Sl_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/23_Sl/Sl_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/23_Sl/Sl_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/23_Sl/Sl_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/23_Sl/Sl_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/23_Sl/Sl_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/23_Sl/Sl_42_pt.json');
    if (chapter === 43) return require('../../assets/bible/AT/23_Sl/Sl_43_pt.json');
    if (chapter === 44) return require('../../assets/bible/AT/23_Sl/Sl_44_pt.json');
    if (chapter === 45) return require('../../assets/bible/AT/23_Sl/Sl_45_pt.json');
    if (chapter === 46) return require('../../assets/bible/AT/23_Sl/Sl_46_pt.json');
    if (chapter === 47) return require('../../assets/bible/AT/23_Sl/Sl_47_pt.json');
    if (chapter === 48) return require('../../assets/bible/AT/23_Sl/Sl_48_pt.json');
    if (chapter === 49) return require('../../assets/bible/AT/23_Sl/Sl_49_pt.json');
    if (chapter === 50) return require('../../assets/bible/AT/23_Sl/Sl_50_pt.json');
    if (chapter === 51) return require('../../assets/bible/AT/23_Sl/Sl_51_pt.json');
    if (chapter === 52) return require('../../assets/bible/AT/23_Sl/Sl_52_pt.json');
    if (chapter === 53) return require('../../assets/bible/AT/23_Sl/Sl_53_pt.json');
    if (chapter === 54) return require('../../assets/bible/AT/23_Sl/Sl_54_pt.json');
    if (chapter === 55) return require('../../assets/bible/AT/23_Sl/Sl_55_pt.json');
    if (chapter === 56) return require('../../assets/bible/AT/23_Sl/Sl_56_pt.json');
    if (chapter === 57) return require('../../assets/bible/AT/23_Sl/Sl_57_pt.json');
    if (chapter === 58) return require('../../assets/bible/AT/23_Sl/Sl_58_pt.json');
    if (chapter === 59) return require('../../assets/bible/AT/23_Sl/Sl_59_pt.json');
    if (chapter === 60) return require('../../assets/bible/AT/23_Sl/Sl_60_pt.json');
    if (chapter === 61) return require('../../assets/bible/AT/23_Sl/Sl_61_pt.json');
    if (chapter === 62) return require('../../assets/bible/AT/23_Sl/Sl_62_pt.json');
    if (chapter === 63) return require('../../assets/bible/AT/23_Sl/Sl_63_pt.json');
    if (chapter === 64) return require('../../assets/bible/AT/23_Sl/Sl_64_pt.json');
    if (chapter === 65) return require('../../assets/bible/AT/23_Sl/Sl_65_pt.json');
    if (chapter === 66) return require('../../assets/bible/AT/23_Sl/Sl_66_pt.json');
    if (chapter === 67) return require('../../assets/bible/AT/23_Sl/Sl_67_pt.json');
    if (chapter === 68) return require('../../assets/bible/AT/23_Sl/Sl_68_pt.json');
    if (chapter === 69) return require('../../assets/bible/AT/23_Sl/Sl_69_pt.json');
    if (chapter === 70) return require('../../assets/bible/AT/23_Sl/Sl_70_pt.json');
    if (chapter === 71) return require('../../assets/bible/AT/23_Sl/Sl_71_pt.json');
    if (chapter === 72) return require('../../assets/bible/AT/23_Sl/Sl_72_pt.json');
    if (chapter === 73) return require('../../assets/bible/AT/23_Sl/Sl_73_pt.json');
    if (chapter === 74) return require('../../assets/bible/AT/23_Sl/Sl_74_pt.json');
    if (chapter === 75) return require('../../assets/bible/AT/23_Sl/Sl_75_pt.json');
    if (chapter === 76) return require('../../assets/bible/AT/23_Sl/Sl_76_pt.json');
    if (chapter === 77) return require('../../assets/bible/AT/23_Sl/Sl_77_pt.json');
    if (chapter === 78) return require('../../assets/bible/AT/23_Sl/Sl_78_pt.json');
    if (chapter === 79) return require('../../assets/bible/AT/23_Sl/Sl_79_pt.json');
    if (chapter === 80) return require('../../assets/bible/AT/23_Sl/Sl_80_pt.json');
    if (chapter === 81) return require('../../assets/bible/AT/23_Sl/Sl_81_pt.json');
    if (chapter === 82) return require('../../assets/bible/AT/23_Sl/Sl_82_pt.json');
    if (chapter === 83) return require('../../assets/bible/AT/23_Sl/Sl_83_pt.json');
    if (chapter === 84) return require('../../assets/bible/AT/23_Sl/Sl_84_pt.json');
    if (chapter === 85) return require('../../assets/bible/AT/23_Sl/Sl_85_pt.json');
    if (chapter === 86) return require('../../assets/bible/AT/23_Sl/Sl_86_pt.json');
    if (chapter === 87) return require('../../assets/bible/AT/23_Sl/Sl_87_pt.json');
    if (chapter === 88) return require('../../assets/bible/AT/23_Sl/Sl_88_pt.json');
    if (chapter === 89) return require('../../assets/bible/AT/23_Sl/Sl_89_pt.json');
    if (chapter === 90) return require('../../assets/bible/AT/23_Sl/Sl_90_pt.json');
    if (chapter === 91) return require('../../assets/bible/AT/23_Sl/Sl_91_pt.json');
    if (chapter === 92) return require('../../assets/bible/AT/23_Sl/Sl_92_pt.json');
    if (chapter === 93) return require('../../assets/bible/AT/23_Sl/Sl_93_pt.json');
    if (chapter === 94) return require('../../assets/bible/AT/23_Sl/Sl_94_pt.json');
    if (chapter === 95) return require('../../assets/bible/AT/23_Sl/Sl_95_pt.json');
    if (chapter === 96) return require('../../assets/bible/AT/23_Sl/Sl_96_pt.json');
    if (chapter === 97) return require('../../assets/bible/AT/23_Sl/Sl_97_pt.json');
    if (chapter === 98) return require('../../assets/bible/AT/23_Sl/Sl_98_pt.json');
    if (chapter === 99) return require('../../assets/bible/AT/23_Sl/Sl_99_pt.json');
    if (chapter === 100) return require('../../assets/bible/AT/23_Sl/Sl_100_pt.json');
    if (chapter === 101) return require('../../assets/bible/AT/23_Sl/Sl_101_pt.json');
    if (chapter === 102) return require('../../assets/bible/AT/23_Sl/Sl_102_pt.json');
    if (chapter === 103) return require('../../assets/bible/AT/23_Sl/Sl_103_pt.json');
    if (chapter === 104) return require('../../assets/bible/AT/23_Sl/Sl_104_pt.json');
    if (chapter === 105) return require('../../assets/bible/AT/23_Sl/Sl_105_pt.json');
    if (chapter === 106) return require('../../assets/bible/AT/23_Sl/Sl_106_pt.json');
    if (chapter === 107) return require('../../assets/bible/AT/23_Sl/Sl_107_pt.json');
    if (chapter === 108) return require('../../assets/bible/AT/23_Sl/Sl_108_pt.json');
    if (chapter === 109) return require('../../assets/bible/AT/23_Sl/Sl_109_pt.json');
    if (chapter === 110) return require('../../assets/bible/AT/23_Sl/Sl_110_pt.json');
    if (chapter === 111) return require('../../assets/bible/AT/23_Sl/Sl_111_pt.json');
    if (chapter === 112) return require('../../assets/bible/AT/23_Sl/Sl_112_pt.json');
    if (chapter === 113) return require('../../assets/bible/AT/23_Sl/Sl_113_pt.json');
    if (chapter === 114) return require('../../assets/bible/AT/23_Sl/Sl_114_pt.json');
    if (chapter === 115) return require('../../assets/bible/AT/23_Sl/Sl_115_pt.json');
    if (chapter === 116) return require('../../assets/bible/AT/23_Sl/Sl_116_pt.json');
    if (chapter === 117) return require('../../assets/bible/AT/23_Sl/Sl_117_pt.json');
    if (chapter === 118) return require('../../assets/bible/AT/23_Sl/Sl_118_pt.json');
    if (chapter === 119) return require('../../assets/bible/AT/23_Sl/Sl_119_pt.json');
    if (chapter === 120) return require('../../assets/bible/AT/23_Sl/Sl_120_pt.json');
    if (chapter === 121) return require('../../assets/bible/AT/23_Sl/Sl_121_pt.json');
    if (chapter === 122) return require('../../assets/bible/AT/23_Sl/Sl_122_pt.json');
    if (chapter === 123) return require('../../assets/bible/AT/23_Sl/Sl_123_pt.json');
    if (chapter === 124) return require('../../assets/bible/AT/23_Sl/Sl_124_pt.json');
    if (chapter === 125) return require('../../assets/bible/AT/23_Sl/Sl_125_pt.json');
    if (chapter === 126) return require('../../assets/bible/AT/23_Sl/Sl_126_pt.json');
    if (chapter === 127) return require('../../assets/bible/AT/23_Sl/Sl_127_pt.json');
    if (chapter === 128) return require('../../assets/bible/AT/23_Sl/Sl_128_pt.json');
    if (chapter === 129) return require('../../assets/bible/AT/23_Sl/Sl_129_pt.json');
    if (chapter === 130) return require('../../assets/bible/AT/23_Sl/Sl_130_pt.json');
    if (chapter === 131) return require('../../assets/bible/AT/23_Sl/Sl_131_pt.json');
    if (chapter === 132) return require('../../assets/bible/AT/23_Sl/Sl_132_pt.json');
    if (chapter === 133) return require('../../assets/bible/AT/23_Sl/Sl_133_pt.json');
    if (chapter === 134) return require('../../assets/bible/AT/23_Sl/Sl_134_pt.json');
    if (chapter === 135) return require('../../assets/bible/AT/23_Sl/Sl_135_pt.json');
    if (chapter === 136) return require('../../assets/bible/AT/23_Sl/Sl_136_pt.json');
    if (chapter === 137) return require('../../assets/bible/AT/23_Sl/Sl_137_pt.json');
    if (chapter === 138) return require('../../assets/bible/AT/23_Sl/Sl_138_pt.json');
    if (chapter === 139) return require('../../assets/bible/AT/23_Sl/Sl_139_pt.json');
    if (chapter === 140) return require('../../assets/bible/AT/23_Sl/Sl_140_pt.json');
    if (chapter === 141) return require('../../assets/bible/AT/23_Sl/Sl_141_pt.json');
    if (chapter === 142) return require('../../assets/bible/AT/23_Sl/Sl_142_pt.json');
    if (chapter === 143) return require('../../assets/bible/AT/23_Sl/Sl_143_pt.json');
    if (chapter === 144) return require('../../assets/bible/AT/23_Sl/Sl_144_pt.json');
    if (chapter === 145) return require('../../assets/bible/AT/23_Sl/Sl_145_pt.json');
    if (chapter === 146) return require('../../assets/bible/AT/23_Sl/Sl_146_pt.json');
    if (chapter === 147) return require('../../assets/bible/AT/23_Sl/Sl_147_pt.json');
    if (chapter === 148) return require('../../assets/bible/AT/23_Sl/Sl_148_pt.json');
    if (chapter === 149) return require('../../assets/bible/AT/23_Sl/Sl_149_pt.json');
    if (chapter === 150) return require('../../assets/bible/AT/23_Sl/Sl_150_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Provérbios (31 capítulos)
const tryLoadProverbs = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/24_Pv/Pv_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/24_Pv/Pv_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/24_Pv/Pv_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/24_Pv/Pv_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/24_Pv/Pv_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/24_Pv/Pv_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/24_Pv/Pv_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/24_Pv/Pv_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/24_Pv/Pv_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/24_Pv/Pv_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/24_Pv/Pv_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/24_Pv/Pv_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/24_Pv/Pv_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/24_Pv/Pv_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/24_Pv/Pv_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/24_Pv/Pv_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/24_Pv/Pv_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/24_Pv/Pv_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/24_Pv/Pv_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/24_Pv/Pv_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/24_Pv/Pv_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/24_Pv/Pv_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/24_Pv/Pv_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/24_Pv/Pv_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/24_Pv/Pv_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/24_Pv/Pv_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/24_Pv/Pv_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/24_Pv/Pv_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/24_Pv/Pv_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/24_Pv/Pv_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/24_Pv/Pv_31_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Eclesiastes (12 capítulos)
const tryLoadEcclesiastes = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/25_Ec/Ec_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/25_Ec/Ec_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/25_Ec/Ec_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/25_Ec/Ec_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/25_Ec/Ec_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/25_Ec/Ec_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/25_Ec/Ec_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/25_Ec/Ec_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/25_Ec/Ec_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/25_Ec/Ec_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/25_Ec/Ec_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/25_Ec/Ec_12_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Cântico dos Cânticos (8 capítulos)
const tryLoadSong = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/26_Ct/Ct_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/26_Ct/Ct_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/26_Ct/Ct_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/26_Ct/Ct_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/26_Ct/Ct_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/26_Ct/Ct_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/26_Ct/Ct_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/26_Ct/Ct_08_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Sabedoria (19 capítulos)
const tryLoadWisdom = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/27_Sb/Sb_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/27_Sb/Sb_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/27_Sb/Sb_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/27_Sb/Sb_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/27_Sb/Sb_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/27_Sb/Sb_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/27_Sb/Sb_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/27_Sb/Sb_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/27_Sb/Sb_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/27_Sb/Sb_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/27_Sb/Sb_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/27_Sb/Sb_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/27_Sb/Sb_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/27_Sb/Sb_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/27_Sb/Sb_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/27_Sb/Sb_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/27_Sb/Sb_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/27_Sb/Sb_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/27_Sb/Sb_19_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Eclesiástico (51 capítulos)
const tryLoadSirach = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/28_Eclo/Eclo_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/28_Eclo/Eclo_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/28_Eclo/Eclo_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/28_Eclo/Eclo_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/28_Eclo/Eclo_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/28_Eclo/Eclo_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/28_Eclo/Eclo_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/28_Eclo/Eclo_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/28_Eclo/Eclo_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/28_Eclo/Eclo_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/28_Eclo/Eclo_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/28_Eclo/Eclo_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/28_Eclo/Eclo_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/28_Eclo/Eclo_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/28_Eclo/Eclo_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/28_Eclo/Eclo_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/28_Eclo/Eclo_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/28_Eclo/Eclo_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/28_Eclo/Eclo_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/28_Eclo/Eclo_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/28_Eclo/Eclo_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/28_Eclo/Eclo_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/28_Eclo/Eclo_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/28_Eclo/Eclo_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/28_Eclo/Eclo_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/28_Eclo/Eclo_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/28_Eclo/Eclo_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/28_Eclo/Eclo_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/28_Eclo/Eclo_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/28_Eclo/Eclo_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/28_Eclo/Eclo_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/28_Eclo/Eclo_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/28_Eclo/Eclo_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/28_Eclo/Eclo_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/28_Eclo/Eclo_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/28_Eclo/Eclo_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/28_Eclo/Eclo_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/28_Eclo/Eclo_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/28_Eclo/Eclo_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/28_Eclo/Eclo_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/28_Eclo/Eclo_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/28_Eclo/Eclo_42_pt.json');
    if (chapter === 43) return require('../../assets/bible/AT/28_Eclo/Eclo_43_pt.json');
    if (chapter === 44) return require('../../assets/bible/AT/28_Eclo/Eclo_44_pt.json');
    if (chapter === 45) return require('../../assets/bible/AT/28_Eclo/Eclo_45_pt.json');
    if (chapter === 46) return require('../../assets/bible/AT/28_Eclo/Eclo_46_pt.json');
    if (chapter === 47) return require('../../assets/bible/AT/28_Eclo/Eclo_47_pt.json');
    if (chapter === 48) return require('../../assets/bible/AT/28_Eclo/Eclo_48_pt.json');
    if (chapter === 49) return require('../../assets/bible/AT/28_Eclo/Eclo_49_pt.json');
    if (chapter === 50) return require('../../assets/bible/AT/28_Eclo/Eclo_50_pt.json');
    if (chapter === 51) return require('../../assets/bible/AT/28_Eclo/Eclo_51_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Isaías (66 capítulos)
const tryLoadIsaiah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/29_Is/Is_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/29_Is/Is_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/29_Is/Is_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/29_Is/Is_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/29_Is/Is_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/29_Is/Is_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/29_Is/Is_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/29_Is/Is_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/29_Is/Is_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/29_Is/Is_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/29_Is/Is_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/29_Is/Is_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/29_Is/Is_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/29_Is/Is_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/29_Is/Is_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/29_Is/Is_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/29_Is/Is_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/29_Is/Is_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/29_Is/Is_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/29_Is/Is_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/29_Is/Is_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/29_Is/Is_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/29_Is/Is_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/29_Is/Is_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/29_Is/Is_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/29_Is/Is_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/29_Is/Is_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/29_Is/Is_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/29_Is/Is_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/29_Is/Is_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/29_Is/Is_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/29_Is/Is_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/29_Is/Is_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/29_Is/Is_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/29_Is/Is_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/29_Is/Is_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/29_Is/Is_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/29_Is/Is_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/29_Is/Is_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/29_Is/Is_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/29_Is/Is_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/29_Is/Is_42_pt.json');
    if (chapter === 43) return require('../../assets/bible/AT/29_Is/Is_43_pt.json');
    if (chapter === 44) return require('../../assets/bible/AT/29_Is/Is_44_pt.json');
    if (chapter === 45) return require('../../assets/bible/AT/29_Is/Is_45_pt.json');
    if (chapter === 46) return require('../../assets/bible/AT/29_Is/Is_46_pt.json');
    if (chapter === 47) return require('../../assets/bible/AT/29_Is/Is_47_pt.json');
    if (chapter === 48) return require('../../assets/bible/AT/29_Is/Is_48_pt.json');
    if (chapter === 49) return require('../../assets/bible/AT/29_Is/Is_49_pt.json');
    if (chapter === 50) return require('../../assets/bible/AT/29_Is/Is_50_pt.json');
    if (chapter === 51) return require('../../assets/bible/AT/29_Is/Is_51_pt.json');
    if (chapter === 52) return require('../../assets/bible/AT/29_Is/Is_52_pt.json');
    if (chapter === 53) return require('../../assets/bible/AT/29_Is/Is_53_pt.json');
    if (chapter === 54) return require('../../assets/bible/AT/29_Is/Is_54_pt.json');
    if (chapter === 55) return require('../../assets/bible/AT/29_Is/Is_55_pt.json');
    if (chapter === 56) return require('../../assets/bible/AT/29_Is/Is_56_pt.json');
    if (chapter === 57) return require('../../assets/bible/AT/29_Is/Is_57_pt.json');
    if (chapter === 58) return require('../../assets/bible/AT/29_Is/Is_58_pt.json');
    if (chapter === 59) return require('../../assets/bible/AT/29_Is/Is_59_pt.json');
    if (chapter === 60) return require('../../assets/bible/AT/29_Is/Is_60_pt.json');
    if (chapter === 61) return require('../../assets/bible/AT/29_Is/Is_61_pt.json');
    if (chapter === 62) return require('../../assets/bible/AT/29_Is/Is_62_pt.json');
    if (chapter === 63) return require('../../assets/bible/AT/29_Is/Is_63_pt.json');
    if (chapter === 64) return require('../../assets/bible/AT/29_Is/Is_64_pt.json');
    if (chapter === 65) return require('../../assets/bible/AT/29_Is/Is_65_pt.json');
    if (chapter === 66) return require('../../assets/bible/AT/29_Is/Is_66_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Jeremias (52 capítulos)
const tryLoadJeremiah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/30_Jr/Jr_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/30_Jr/Jr_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/30_Jr/Jr_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/30_Jr/Jr_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/30_Jr/Jr_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/30_Jr/Jr_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/30_Jr/Jr_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/30_Jr/Jr_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/30_Jr/Jr_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/30_Jr/Jr_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/30_Jr/Jr_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/30_Jr/Jr_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/30_Jr/Jr_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/30_Jr/Jr_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/30_Jr/Jr_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/30_Jr/Jr_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/30_Jr/Jr_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/30_Jr/Jr_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/30_Jr/Jr_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/30_Jr/Jr_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/30_Jr/Jr_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/30_Jr/Jr_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/30_Jr/Jr_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/30_Jr/Jr_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/30_Jr/Jr_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/30_Jr/Jr_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/30_Jr/Jr_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/30_Jr/Jr_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/30_Jr/Jr_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/30_Jr/Jr_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/30_Jr/Jr_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/30_Jr/Jr_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/30_Jr/Jr_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/30_Jr/Jr_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/30_Jr/Jr_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/30_Jr/Jr_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/30_Jr/Jr_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/30_Jr/Jr_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/30_Jr/Jr_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/30_Jr/Jr_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/30_Jr/Jr_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/30_Jr/Jr_42_pt.json');
    if (chapter === 43) return require('../../assets/bible/AT/30_Jr/Jr_43_pt.json');
    if (chapter === 44) return require('../../assets/bible/AT/30_Jr/Jr_44_pt.json');
    if (chapter === 45) return require('../../assets/bible/AT/30_Jr/Jr_45_pt.json');
    if (chapter === 46) return require('../../assets/bible/AT/30_Jr/Jr_46_pt.json');
    if (chapter === 47) return require('../../assets/bible/AT/30_Jr/Jr_47_pt.json');
    if (chapter === 48) return require('../../assets/bible/AT/30_Jr/Jr_48_pt.json');
    if (chapter === 49) return require('../../assets/bible/AT/30_Jr/Jr_49_pt.json');
    if (chapter === 50) return require('../../assets/bible/AT/30_Jr/Jr_50_pt.json');
    if (chapter === 51) return require('../../assets/bible/AT/30_Jr/Jr_51_pt.json');
    if (chapter === 52) return require('../../assets/bible/AT/30_Jr/Jr_52_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Lamentações (5 capítulos)
const tryLoadLamentations = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/31_Lm/Lm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/31_Lm/Lm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/31_Lm/Lm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/31_Lm/Lm_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/31_Lm/Lm_05_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Baruc (6 capítulos)
const tryLoadBaruch = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/32_Br/Br_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/32_Br/Br_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/32_Br/Br_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/32_Br/Br_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/32_Br/Br_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/32_Br/Br_06_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Ezequiel (48 capítulos)
const tryLoadEzekiel = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/33_Ez/Ez_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/33_Ez/Ez_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/33_Ez/Ez_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/33_Ez/Ez_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/33_Ez/Ez_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/33_Ez/Ez_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/33_Ez/Ez_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/33_Ez/Ez_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/33_Ez/Ez_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/33_Ez/Ez_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/33_Ez/Ez_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/33_Ez/Ez_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/33_Ez/Ez_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/33_Ez/Ez_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/AT/33_Ez/Ez_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/AT/33_Ez/Ez_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/AT/33_Ez/Ez_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/AT/33_Ez/Ez_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/AT/33_Ez/Ez_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/AT/33_Ez/Ez_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/AT/33_Ez/Ez_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/AT/33_Ez/Ez_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/AT/33_Ez/Ez_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/AT/33_Ez/Ez_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/AT/33_Ez/Ez_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/AT/33_Ez/Ez_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/AT/33_Ez/Ez_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/AT/33_Ez/Ez_28_pt.json');
    if (chapter === 29) return require('../../assets/bible/AT/33_Ez/Ez_29_pt.json');
    if (chapter === 30) return require('../../assets/bible/AT/33_Ez/Ez_30_pt.json');
    if (chapter === 31) return require('../../assets/bible/AT/33_Ez/Ez_31_pt.json');
    if (chapter === 32) return require('../../assets/bible/AT/33_Ez/Ez_32_pt.json');
    if (chapter === 33) return require('../../assets/bible/AT/33_Ez/Ez_33_pt.json');
    if (chapter === 34) return require('../../assets/bible/AT/33_Ez/Ez_34_pt.json');
    if (chapter === 35) return require('../../assets/bible/AT/33_Ez/Ez_35_pt.json');
    if (chapter === 36) return require('../../assets/bible/AT/33_Ez/Ez_36_pt.json');
    if (chapter === 37) return require('../../assets/bible/AT/33_Ez/Ez_37_pt.json');
    if (chapter === 38) return require('../../assets/bible/AT/33_Ez/Ez_38_pt.json');
    if (chapter === 39) return require('../../assets/bible/AT/33_Ez/Ez_39_pt.json');
    if (chapter === 40) return require('../../assets/bible/AT/33_Ez/Ez_40_pt.json');
    if (chapter === 41) return require('../../assets/bible/AT/33_Ez/Ez_41_pt.json');
    if (chapter === 42) return require('../../assets/bible/AT/33_Ez/Ez_42_pt.json');
    if (chapter === 43) return require('../../assets/bible/AT/33_Ez/Ez_43_pt.json');
    if (chapter === 44) return require('../../assets/bible/AT/33_Ez/Ez_44_pt.json');
    if (chapter === 45) return require('../../assets/bible/AT/33_Ez/Ez_45_pt.json');
    if (chapter === 46) return require('../../assets/bible/AT/33_Ez/Ez_46_pt.json');
    if (chapter === 47) return require('../../assets/bible/AT/33_Ez/Ez_47_pt.json');
    if (chapter === 48) return require('../../assets/bible/AT/33_Ez/Ez_48_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Daniel (12 capítulos)
const tryLoadDaniel = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/34_Dn/Dn_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/34_Dn/Dn_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/34_Dn/Dn_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/34_Dn/Dn_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/34_Dn/Dn_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/34_Dn/Dn_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/34_Dn/Dn_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/34_Dn/Dn_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/34_Dn/Dn_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/34_Dn/Dn_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/34_Dn/Dn_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/34_Dn/Dn_12_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Oséias (14 capítulos)
const tryLoadHosea = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/35_Os/Os_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/35_Os/Os_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/35_Os/Os_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/35_Os/Os_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/35_Os/Os_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/35_Os/Os_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/35_Os/Os_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/35_Os/Os_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/35_Os/Os_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/35_Os/Os_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/35_Os/Os_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/35_Os/Os_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/35_Os/Os_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/35_Os/Os_14_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Joel (3 capítulos)
const tryLoadJoel = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/36_Jl/Jl_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/36_Jl/Jl_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/36_Jl/Jl_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Amós (9 capítulos)
const tryLoadAmos = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/37_Am/Am_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/37_Am/Am_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/37_Am/Am_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/37_Am/Am_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/37_Am/Am_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/37_Am/Am_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/37_Am/Am_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/37_Am/Am_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/37_Am/Am_09_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Abdias (1 capítulo)
const tryLoadObadiah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/38_Ob/Ob_01_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Jonas (4 capítulos)
const tryLoadJonah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/39_Jn/Jn_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/39_Jn/Jn_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/39_Jn/Jn_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/39_Jn/Jn_04_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Miqueias (7 capítulos)
const tryLoadMicah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/40_Mq/Mq_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/40_Mq/Mq_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/40_Mq/Mq_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/40_Mq/Mq_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/40_Mq/Mq_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/40_Mq/Mq_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/40_Mq/Mq_07_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Naum (3 capítulos)
const tryLoadNahum = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/41_Na/Na_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/41_Na/Na_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/41_Na/Na_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Habacuc (3 capítulos)
const tryLoadHabakkuk = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/42_Hc/Hc_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/42_Hc/Hc_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/42_Hc/Hc_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Sofonias (3 capítulos)
const tryLoadZephaniah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/43_Sf/Sf_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/43_Sf/Sf_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/43_Sf/Sf_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Ageu (2 capítulos)
const tryLoadHaggai = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/44_Ag/Ag_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/44_Ag/Ag_02_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Zacarias (14 capítulos)
const tryLoadZechariah = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/45_Zc/Zc_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/45_Zc/Zc_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/45_Zc/Zc_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/AT/45_Zc/Zc_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/AT/45_Zc/Zc_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/AT/45_Zc/Zc_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/AT/45_Zc/Zc_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/AT/45_Zc/Zc_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/AT/45_Zc/Zc_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/AT/45_Zc/Zc_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/AT/45_Zc/Zc_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/AT/45_Zc/Zc_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/AT/45_Zc/Zc_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/AT/45_Zc/Zc_14_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Malaquias (3 capítulos)
const tryLoadMalachi = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/AT/46_Ml/Ml_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/AT/46_Ml/Ml_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/AT/46_Ml/Ml_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// NOVO TESTAMENTO

// São Mateus (28 capítulos)
const tryLoadMatthew = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/47_Mt/Mt_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/47_Mt/Mt_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/47_Mt/Mt_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/47_Mt/Mt_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/47_Mt/Mt_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/47_Mt/Mt_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/47_Mt/Mt_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/47_Mt/Mt_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/47_Mt/Mt_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/47_Mt/Mt_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/47_Mt/Mt_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/47_Mt/Mt_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/47_Mt/Mt_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/47_Mt/Mt_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/47_Mt/Mt_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/47_Mt/Mt_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/NT/47_Mt/Mt_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/NT/47_Mt/Mt_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/NT/47_Mt/Mt_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/NT/47_Mt/Mt_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/NT/47_Mt/Mt_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/NT/47_Mt/Mt_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/NT/47_Mt/Mt_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/NT/47_Mt/Mt_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/NT/47_Mt/Mt_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/NT/47_Mt/Mt_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/NT/47_Mt/Mt_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/NT/47_Mt/Mt_28_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// São Marcos (16 capítulos)
const tryLoadMark = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/48_Mc/Mc_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/48_Mc/Mc_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/48_Mc/Mc_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/48_Mc/Mc_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/48_Mc/Mc_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/48_Mc/Mc_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/48_Mc/Mc_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/48_Mc/Mc_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/48_Mc/Mc_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/48_Mc/Mc_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/48_Mc/Mc_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/48_Mc/Mc_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/48_Mc/Mc_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/48_Mc/Mc_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/48_Mc/Mc_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/48_Mc/Mc_16_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// São Lucas (24 capítulos)
const tryLoadLuke = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/49_Lc/Lc_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/49_Lc/Lc_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/49_Lc/Lc_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/49_Lc/Lc_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/49_Lc/Lc_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/49_Lc/Lc_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/49_Lc/Lc_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/49_Lc/Lc_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/49_Lc/Lc_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/49_Lc/Lc_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/49_Lc/Lc_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/49_Lc/Lc_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/49_Lc/Lc_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/49_Lc/Lc_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/49_Lc/Lc_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/49_Lc/Lc_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/NT/49_Lc/Lc_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/NT/49_Lc/Lc_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/NT/49_Lc/Lc_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/NT/49_Lc/Lc_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/NT/49_Lc/Lc_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/NT/49_Lc/Lc_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/NT/49_Lc/Lc_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/NT/49_Lc/Lc_24_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// São João (21 capítulos)
const tryLoadJohn = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/50_Jo/Jo_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/50_Jo/Jo_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/50_Jo/Jo_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/50_Jo/Jo_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/50_Jo/Jo_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/50_Jo/Jo_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/50_Jo/Jo_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/50_Jo/Jo_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/50_Jo/Jo_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/50_Jo/Jo_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/50_Jo/Jo_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/50_Jo/Jo_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/50_Jo/Jo_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/50_Jo/Jo_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/50_Jo/Jo_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/50_Jo/Jo_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/NT/50_Jo/Jo_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/NT/50_Jo/Jo_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/NT/50_Jo/Jo_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/NT/50_Jo/Jo_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/NT/50_Jo/Jo_21_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Atos dos Apóstolos (28 capítulos)
const tryLoadActs = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/51_At/At_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/51_At/At_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/51_At/At_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/51_At/At_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/51_At/At_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/51_At/At_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/51_At/At_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/51_At/At_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/51_At/At_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/51_At/At_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/51_At/At_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/51_At/At_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/51_At/At_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/51_At/At_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/51_At/At_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/51_At/At_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/NT/51_At/At_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/NT/51_At/At_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/NT/51_At/At_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/NT/51_At/At_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/NT/51_At/At_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/NT/51_At/At_22_pt.json');
    if (chapter === 23) return require('../../assets/bible/NT/51_At/At_23_pt.json');
    if (chapter === 24) return require('../../assets/bible/NT/51_At/At_24_pt.json');
    if (chapter === 25) return require('../../assets/bible/NT/51_At/At_25_pt.json');
    if (chapter === 26) return require('../../assets/bible/NT/51_At/At_26_pt.json');
    if (chapter === 27) return require('../../assets/bible/NT/51_At/At_27_pt.json');
    if (chapter === 28) return require('../../assets/bible/NT/51_At/At_28_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Romanos (16 capítulos)
const tryLoadRomans = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/52_Rm/Rm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/52_Rm/Rm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/52_Rm/Rm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/52_Rm/Rm_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/52_Rm/Rm_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/52_Rm/Rm_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/52_Rm/Rm_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/52_Rm/Rm_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/52_Rm/Rm_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/52_Rm/Rm_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/52_Rm/Rm_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/52_Rm/Rm_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/52_Rm/Rm_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/52_Rm/Rm_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/52_Rm/Rm_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/52_Rm/Rm_16_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Coríntios (16 capítulos)
const tryLoadCorinthians1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/53_1Co/1Co_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/53_1Co/1Co_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/53_1Co/1Co_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/53_1Co/1Co_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/53_1Co/1Co_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/53_1Co/1Co_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/53_1Co/1Co_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/53_1Co/1Co_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/53_1Co/1Co_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/53_1Co/1Co_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/53_1Co/1Co_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/53_1Co/1Co_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/53_1Co/1Co_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/53_1Co/1Co_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/53_1Co/1Co_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/53_1Co/1Co_16_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Coríntios (13 capítulos)
const tryLoadCorinthians2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/54_2Co/2Co_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/54_2Co/2Co_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/54_2Co/2Co_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/54_2Co/2Co_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/54_2Co/2Co_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/54_2Co/2Co_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/54_2Co/2Co_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/54_2Co/2Co_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/54_2Co/2Co_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/54_2Co/2Co_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/54_2Co/2Co_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/54_2Co/2Co_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/54_2Co/2Co_13_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Gálatas (6 capítulos)
const tryLoadGalatians = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/55_Gl/Gl_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/55_Gl/Gl_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/55_Gl/Gl_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/55_Gl/Gl_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/55_Gl/Gl_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/55_Gl/Gl_06_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Efésios (6 capítulos)
const tryLoadEphesians = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/56_Ef/Ef_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/56_Ef/Ef_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/56_Ef/Ef_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/56_Ef/Ef_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/56_Ef/Ef_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/56_Ef/Ef_06_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Filipenses (4 capítulos)
const tryLoadPhilippians = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/57_Fl/Fl_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/57_Fl/Fl_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/57_Fl/Fl_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/57_Fl/Fl_04_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Colossenses (4 capítulos)
const tryLoadColossians = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/58_Cl/Cl_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/58_Cl/Cl_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/58_Cl/Cl_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/58_Cl/Cl_04_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Tessalonicenses (5 capítulos)
const tryLoadThessalonians1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/59_1Ts/1Ts_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/59_1Ts/1Ts_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/59_1Ts/1Ts_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/59_1Ts/1Ts_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/59_1Ts/1Ts_05_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Tessalonicenses (3 capítulos)
const tryLoadThessalonians2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/60_2Ts/2Ts_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/60_2Ts/2Ts_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/60_2Ts/2Ts_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I Timóteo (6 capítulos)
const tryLoadTimothy1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/61_1Tm/1Tm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/61_1Tm/1Tm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/61_1Tm/1Tm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/61_1Tm/1Tm_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/61_1Tm/1Tm_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/61_1Tm/1Tm_06_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II Timóteo (4 capítulos)
const tryLoadTimothy2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/62_2Tm/2Tm_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/62_2Tm/2Tm_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/62_2Tm/2Tm_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/62_2Tm/2Tm_04_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Tito (3 capítulos)
const tryLoadTitus = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/63_Tt/Tt_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/63_Tt/Tt_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/63_Tt/Tt_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Filêmon (1 capítulo)
const tryLoadPhilemon = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/64_Fm/Fm_01_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Hebreus (13 capítulos)
const tryLoadHebrews = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/65_Hb/Hb_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/65_Hb/Hb_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/65_Hb/Hb_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/65_Hb/Hb_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/65_Hb/Hb_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/65_Hb/Hb_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/65_Hb/Hb_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/65_Hb/Hb_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/65_Hb/Hb_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/65_Hb/Hb_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/65_Hb/Hb_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/65_Hb/Hb_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/65_Hb/Hb_13_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// São Tiago (5 capítulos)
const tryLoadJames = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/66_Tg/Tg_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/66_Tg/Tg_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/66_Tg/Tg_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/66_Tg/Tg_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/66_Tg/Tg_05_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I São Pedro (5 capítulos)
const tryLoadPeter1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/67_1Pe/1Pe_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/67_1Pe/1Pe_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/67_1Pe/1Pe_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/67_1Pe/1Pe_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/67_1Pe/1Pe_05_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II São Pedro (3 capítulos)
const tryLoadPeter2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/68_2Pe/2Pe_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/68_2Pe/2Pe_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/68_2Pe/2Pe_03_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// I São João (5 capítulos)
const tryLoadJohn1 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/69_1Jo/1Jo_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/69_1Jo/1Jo_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/69_1Jo/1Jo_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/69_1Jo/1Jo_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/69_1Jo/1Jo_05_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// II São João (1 capítulo)
const tryLoadJohn2 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/70_2Jo/2Jo_01_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// III São João (1 capítulo)
const tryLoadJohn3 = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/71_3Jo/3Jo_01_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// São Judas (1 capítulo)
const tryLoadJude = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/72_Jd/Jd_01_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Apocalipse (22 capítulos)
const tryLoadRevelation = (chapter) => {
  try {
    if (chapter === 1) return require('../../assets/bible/NT/73_Ap/Ap_01_pt.json');
    if (chapter === 2) return require('../../assets/bible/NT/73_Ap/Ap_02_pt.json');
    if (chapter === 3) return require('../../assets/bible/NT/73_Ap/Ap_03_pt.json');
    if (chapter === 4) return require('../../assets/bible/NT/73_Ap/Ap_04_pt.json');
    if (chapter === 5) return require('../../assets/bible/NT/73_Ap/Ap_05_pt.json');
    if (chapter === 6) return require('../../assets/bible/NT/73_Ap/Ap_06_pt.json');
    if (chapter === 7) return require('../../assets/bible/NT/73_Ap/Ap_07_pt.json');
    if (chapter === 8) return require('../../assets/bible/NT/73_Ap/Ap_08_pt.json');
    if (chapter === 9) return require('../../assets/bible/NT/73_Ap/Ap_09_pt.json');
    if (chapter === 10) return require('../../assets/bible/NT/73_Ap/Ap_10_pt.json');
    if (chapter === 11) return require('../../assets/bible/NT/73_Ap/Ap_11_pt.json');
    if (chapter === 12) return require('../../assets/bible/NT/73_Ap/Ap_12_pt.json');
    if (chapter === 13) return require('../../assets/bible/NT/73_Ap/Ap_13_pt.json');
    if (chapter === 14) return require('../../assets/bible/NT/73_Ap/Ap_14_pt.json');
    if (chapter === 15) return require('../../assets/bible/NT/73_Ap/Ap_15_pt.json');
    if (chapter === 16) return require('../../assets/bible/NT/73_Ap/Ap_16_pt.json');
    if (chapter === 17) return require('../../assets/bible/NT/73_Ap/Ap_17_pt.json');
    if (chapter === 18) return require('../../assets/bible/NT/73_Ap/Ap_18_pt.json');
    if (chapter === 19) return require('../../assets/bible/NT/73_Ap/Ap_19_pt.json');
    if (chapter === 20) return require('../../assets/bible/NT/73_Ap/Ap_20_pt.json');
    if (chapter === 21) return require('../../assets/bible/NT/73_Ap/Ap_21_pt.json');
    if (chapter === 22) return require('../../assets/bible/NT/73_Ap/Ap_22_pt.json');
    return null;
  } catch (error) {
    return null;
  }
};

// Função genérica que chama as funções específicas
const tryLoadFile = (bookKey, chapter) => {
  try {
    switch(bookKey) {
      // ANTIGO TESTAMENTO
      case 'genesis': return tryLoadGenesis(chapter);
      case 'exodus': return tryLoadExodus(chapter);
      case 'leviticus': return tryLoadLeviticus(chapter);
      case 'numbers': return tryLoadNumbers(chapter);
      case 'deuteronomy': return tryLoadDeuteronomy(chapter);
      case 'joshua': return tryLoadJoshua(chapter);
      case 'judges': return tryLoadJudges(chapter);
      case 'ruth': return tryLoadRuth(chapter);
      case 'samuel1': return tryLoadSamuel1(chapter);
      case 'samuel2': return tryLoadSamuel2(chapter);
      case 'kings1': return tryLoadKings1(chapter);
      case 'kings2': return tryLoadKings2(chapter);
      case 'chronicles1': return tryLoadChronicles1(chapter);
      case 'chronicles2': return tryLoadChronicles2(chapter);
      case 'ezra': return tryLoadEzra(chapter);
      case 'nehemiah': return tryLoadNehemiah(chapter);
      case 'tobit': return tryLoadTobit(chapter);
      case 'judith': return tryLoadJudith(chapter);
      case 'esther': return tryLoadEsther(chapter);
      case 'maccabees1': return tryLoadMaccabees1(chapter);
      case 'maccabees2': return tryLoadMaccabees2(chapter);
      case 'job': return tryLoadJob(chapter);
      case 'psalms': return tryLoadPsalms(chapter);
      case 'proverbs': return tryLoadProverbs(chapter);
      case 'ecclesiastes': return tryLoadEcclesiastes(chapter);
      case 'song': return tryLoadSong(chapter);
      case 'wisdom': return tryLoadWisdom(chapter);
      case 'sirach': return tryLoadSirach(chapter);
      case 'isaiah': return tryLoadIsaiah(chapter);
      case 'jeremiah': return tryLoadJeremiah(chapter);
      case 'lamentations': return tryLoadLamentations(chapter);
      case 'baruch': return tryLoadBaruch(chapter);
      case 'ezekiel': return tryLoadEzekiel(chapter);
      case 'daniel': return tryLoadDaniel(chapter);
      case 'hosea': return tryLoadHosea(chapter);
      case 'joel': return tryLoadJoel(chapter);
      case 'amos': return tryLoadAmos(chapter);
      case 'obadiah': return tryLoadObadiah(chapter);
      case 'jonah': return tryLoadJonah(chapter);
      case 'micah': return tryLoadMicah(chapter);
      case 'nahum': return tryLoadNahum(chapter);
      case 'habakkuk': return tryLoadHabakkuk(chapter);
      case 'zephaniah': return tryLoadZephaniah(chapter);
      case 'haggai': return tryLoadHaggai(chapter);
      case 'zechariah': return tryLoadZechariah(chapter);
      case 'malachi': return tryLoadMalachi(chapter);
      // NOVO TESTAMENTO
      case 'matthew': return tryLoadMatthew(chapter);
      case 'mark': return tryLoadMark(chapter);
      case 'luke': return tryLoadLuke(chapter);
      case 'john': return tryLoadJohn(chapter);
      case 'acts': return tryLoadActs(chapter);
      case 'romans': return tryLoadRomans(chapter);
      case 'corinthians1': return tryLoadCorinthians1(chapter);
      case 'corinthians2': return tryLoadCorinthians2(chapter);
      case 'galatians': return tryLoadGalatians(chapter);
      case 'ephesians': return tryLoadEphesians(chapter);
      case 'philippians': return tryLoadPhilippians(chapter);
      case 'colossians': return tryLoadColossians(chapter);
      case 'thessalonians1': return tryLoadThessalonians1(chapter);
      case 'thessalonians2': return tryLoadThessalonians2(chapter);
      case 'timothy1': return tryLoadTimothy1(chapter);
      case 'timothy2': return tryLoadTimothy2(chapter);
      case 'titus': return tryLoadTitus(chapter);
      case 'philemon': return tryLoadPhilemon(chapter);
      case 'hebrews': return tryLoadHebrews(chapter);
      case 'james': return tryLoadJames(chapter);
      case 'peter1': return tryLoadPeter1(chapter);
      case 'peter2': return tryLoadPeter2(chapter);
      case 'john1': return tryLoadJohn1(chapter);
      case 'john2': return tryLoadJohn2(chapter);
      case 'john3': return tryLoadJohn3(chapter);
      case 'jude': return tryLoadJude(chapter);
      case 'revelation': return tryLoadRevelation(chapter);
      
      default: return null;
    }
  } catch (error) {
    return null;
  }
};

// Resto do código permanece igual (loadBibleData, BibliaEngine, etc.)
const loadBibleData = () => {
  const loadedBooks = {};
  
  console.log('🔍 Carregando Bíblia completa...');
  
  for (const bookKey in BOOKS_INFO) {
    const bookInfo = BOOKS_INFO[bookKey];
    const bookLoaded = {};
    let bookCount = 0;
    
    for (let chapter = 1; chapter <= bookInfo.chapters; chapter++) {
      const chapterData = tryLoadFile(bookKey, chapter);
      
      if (chapterData) {
        const versesArray = [];
        
        for (const verseNumber in chapterData.verses || {}) {
          const verse = chapterData.verses[verseNumber];
          versesArray.push({
            number: parseInt(verseNumber),
            text: cleanRTF(verse.text),
            reference: verse.reference
          });
        }
        versesArray.sort((a, b) => a.number - b.number);
        
        bookLoaded[chapter] = {
          book: bookKey,
          chapter: chapter,
          title: `${bookInfo.name} ${chapter}`,
          subtitle: bookInfo.category,
          verses: versesArray,
          metadata: {
            book_name: bookInfo.name,
            book_abbr: bookInfo.abbr,
            book_category: bookInfo.category,
            testament: bookInfo.testament,
            verse_count: versesArray.length,
            source: chapterData.source || 'Bíblia de Jerusalém'
          }
        };
        
        bookCount++;
      }
    }
    
    if (bookCount > 0) {
      loadedBooks[bookKey] = bookLoaded;
      console.log(`✅ ${bookInfo.name}: ${bookCount}/${bookInfo.chapters} capítulos`);
    }
  }
  
  return loadedBooks;
};

// BibliaEngine (mesmo código anterior)
const BibliaEngine = {
  isInitialized: false,
  books: null,

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🚀 Inicializando BibliaEngine - Bíblia Completa...');
    
    try {
      this.books = loadBibleData();
      this.isInitialized = true;
      
      const stats = this.getStats();
      console.log(`🎉 BibliaEngine inicializado!`);
      console.log(`📊 ${stats.totalBooks} livros, ${stats.totalChapters} capítulos, ${stats.totalVerses} versículos`);
      
    } catch (error) {
      console.log('❌ Erro na inicialização:', error.message);
      this.books = {};
      this.isInitialized = true;
    }
  },

  getAvailableBooks() {
    if (!this.books) return [];
    
    return Object.keys(this.books).map(bookKey => {
      const firstChapter = Object.values(this.books[bookKey])[0];
      const metadata = firstChapter?.metadata || {};
      
      return {
        key: bookKey,
        name: metadata.book_name || bookKey,
        abbr: metadata.book_abbr || '',
        category: metadata.book_category || '',
        testament: metadata.testament || 'AT',
        chapters: Object.keys(this.books[bookKey]).map(ch => parseInt(ch)).sort((a, b) => a - b)
      };
    });
  },

  getAllBooks() {
    const result = { AT: [], NT: [] };
    
    for (const bookKey in BOOKS_INFO) {
      const bookInfo = BOOKS_INFO[bookKey];
      const hasChapters = this.books && this.books[bookKey];
      const availableChapters = hasChapters ? Object.keys(this.books[bookKey]).map(ch => parseInt(ch)) : [];
      
      result[bookInfo.testament].push({
        key: bookKey,
        name: bookInfo.name,
        abbr: bookInfo.abbr,
        category: bookInfo.category,
        totalChapters: bookInfo.chapters,
        availableChapters: availableChapters,
        hasContent: availableChapters.length > 0
      });
    }
    
    return result;
  },

  getChapter(bookName, chapterNumber) {
    if (!this.books || !this.books[bookName]) return null;
    return this.books[bookName][chapterNumber] || null;
  },

  searchVerses(query) {
    if (!this.books) return [];
    
    const results = [];
    for (const bookName in this.books) {
      for (const chapterNum in this.books[bookName]) {
        const chapter = this.books[bookName][chapterNum];
        if (chapter.verses) {
          chapter.verses.forEach(verse => {
            if (verse.text.toLowerCase().includes(query.toLowerCase())) {
              results.push({
                ...verse,
                book: bookName,
                chapter: parseInt(chapterNum),
                bookDisplay: chapter.metadata?.book_name || bookName,
                bookAbbr: chapter.metadata?.book_abbr || ''
              });
            }
          });
        }
      }
    }
    return results;
  },

  getStats() {
    let totalBooks = 0;
    let totalChapters = 0;
    let totalVerses = 0;
    
    for (const bookName in this.books || {}) {
      totalBooks++;
      for (const chapterNum in this.books[bookName]) {
        totalChapters++;
        const chapter = this.books[bookName][chapterNum];
        totalVerses += chapter.verses ? chapter.verses.length : 0;
      }
    }
    
    return { totalBooks, totalChapters, totalVerses };
  }
};

export default BibliaEngine;