// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const ctaAccount = 'CTAACC';

export const bingoValues = {
  INIT: 1,
  LIMIT: 125,
  B_START: 1,
  B_END: 25,
  I_START: 26,
  I_END: 50,
  N_START: 51,
  N_END: 75,
  G_START: 76,
  G_END: 100,
  O_START: 101,
  O_END: 125,
  STATE_AVAILABLE: 1,
  STATE_NOT_AVAILABLE: 0,
  STATE_DESC_AVAILABLE: 'DISPONIBLE',
  STATE_DESC_NOT_AVAILABLE: 'NO DISPONIBLE',
  STATE_EV_INC: 'PENDIENTE',
  STATE_EV_ACT: 'ACTIVO',
  STATE_EV_END: 'FINALIZADO',
  CONST_STA_PN: 0,
  CONST_STA_ON: 1,
  CONST_STA_OFF: 2
};

export const genConst = {
  CONST_PRO_ADM: 1001, // Administrador
  CONST_PRO_DEF: 2002, // Usuario
  CONST_PRO_VIS: 3003, // Visitante
  CONST_PRO_ADM_BING: 4004, // Administrador Bingo
  CONST_ADM_NOT: 'Administrador del Sistema',
  CONST_PRO_ADM_TXT: 'Administrador',
  CONST_PRO_STU_TXT: 'Usuario',
  CONST_PRO_VIS_TXT: 'Visitante',
  CONST_PRO_ADM_BING_TXT: 'Administrador Bingo',
  CONST_STA_ACT: 1,
  CONST_STA_INACT: 0,
  CONST_STATE_IN: 0,
  CONST_STATE_AC: 1,
  CONST_STATE_PN: 2,
  CONST_NOTIF_NL: 0,
  CONST_NOTIF_LE: 1,
  CONST_SUB_STATE_INACTIVE: 0,
  CONST_SUB_STATE_ACTIVE: 1,
  CONST_SUB_STATE_ACT_TEXT: 'ACTIVA',
  CONST_SUB_STATE_INA_TEXT: 'INACTIVA',
  CONST_STA_ACT_TXT: 'Activo',
  CONST_STA_INACT_TXT: 'Inactivo',
  CONST_EXT_IMAGE: '.jpg',
  CONST_EXT_PDF: '.pdf',
  CONST_EXT_VIDEO_MP4: '.mp4',
  CONST_EXT_VIDEO_AVI: '.avi',
  CONST_PRIMARY_COLOR: '#00adef',
  CONST_SECONDARY_COLOR: '#a8afda',
  CONST_THIRD_COLOR: '#04a604',
  CONST_CREATE_COLOR: '#00adef',
  CONST_VIEW_COLOR: '#a8afda',
  CONST_UPDATE_COLOR: '#0d6889',
  CONST_DELETE_COLOR: '#179cdc',
  CONST_CANCEL_COLOR: '#0d6889',
  CONST_SUCCESS_COLOR: '#04a604',
  CONST_INFO_COLOR: '#828cc9',
  CONST_ERROR_COLOR: '#179cdc',
  CONST_WARNING_COLOR: '#fdfd96',
  CONST_APPBAR_SEARCH: '#00adef',
  CONST_APPBAR: '#00adef',
  CONST_MTD_1_LBL: 'Tarjeta Débito / Crédito',
  CONST_MTD_2_LBL: 'Depósito / Transferencia',
  CONST_MTD_3_LBL: 'De Una',
  CONST_MTD_4_LBL: 'PayPal',
  CONST_MTD_5_LBL: 'Mercado Pago',
  CONST_MTD_6_LBL: 'Otro',
  CONST_MTD_7_LBL: 'Otro',
  CONST_MTD_1_VAL: 1,
  CONST_MTD_2_VAL: 2,
  CONST_MTD_3_VAL: 3,
  CONST_MTD_4_VAL: 4,
  CONST_MTD_5_VAL: 5,
  CONST_MTD_6_VAL: 6,
  CONST_CTA_AHO_DES: 'CTA. AHORROS',
  CONST_CTA_AHO_VAL: 'CTAAHO',
  CONST_CTA_COR_DES: 'CTA. CORRIENTE',
  CONST_CTA_COR_VAL: 'CTACORR',
  CONST_MONTH_VALUE: 50,
  CONST_YEAR_VALUE: 500,
  CONST_MONTH_DAYS: 30,
  CONST_YEAR_DAYS: 365,
  CONST_MONTH_CHAR: 1,
  CONST_YEAR_CHAR: 2,
  CONST_IVA: 1.12,
  CONST_400: 400,
  CONST_200: 200,
  CONST_LVL1: 0.2,
  CONST_LVL2: 0.15,
  CONST_LVL3: 0.1,
  CONST_LVL4: 0.05,
  CONST_BEN_CAN: 0,
  CONST_BEN_PAI: 1,
  CONST_BEN_PEN: 2,
  CONST_MAX_BUSINESS: 3,
  CONST_STA_PN: 0,
  CONST_STA_ON: 1,
  CONST_STA_OFF: 2
};

export const PAYPHONE_CONFIG = {
  SERVER_URL: 'https://pay.payphonetodoesposible.com/api/button/V2/Confirm',
  TOKEN: import.meta.env.VITE_PAYPHONE_TOKEN,
  STORE_ID: import.meta.env.VITE_STORE_ID
};

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID
};
