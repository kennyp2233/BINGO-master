export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function generateDate() {
  var sp = '/';
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return dd + sp + mm + sp + yyyy;
}

export function initDate() {
  var iniDate = new Date();
  var dd = iniDate.getDate();
  var mm = iniDate.getMonth() + 1;
  var yy = iniDate.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yy;
}

export function endDateMonth() {
  var iniDate = new Date();
  var priorDate = new Date().setDate(iniDate.getDate() + 30);
  var endDate = new Date(priorDate);
  var d = endDate.getDate();
  var m = endDate.getMonth() + 1;
  var y = endDate.getFullYear();
  if (d < 10) {
    d = '0' + d;
  }
  if (m < 10) {
    m = '0' + m;
  }
  return d + '/' + m + '/' + y;
}

export function endDateYear() {
  var iniDate = new Date();
  var priorDate = new Date().setDate(iniDate.getDate() + 365);
  var endDate = new Date(priorDate);
  var d = endDate.getDate();
  var m = endDate.getMonth() + 1;
  var y = endDate.getFullYear();
  if (d < 10) {
    d = '0' + d;
  }
  if (m < 10) {
    m = '0' + m;
  }
  return d + '/' + m + '/' + y;
}

export function endDateWithParam(days) {
  var iniDate = new Date();
  var priorDate = new Date().setDate(iniDate.getDate() + days);
  var endDate = new Date(priorDate);
  var d = endDate.getDate();
  var m = endDate.getMonth() + 1;
  var y = endDate.getFullYear();
  if (d < 10) {
    d = '0' + d;
  }
  if (m < 10) {
    m = '0' + m;
  }
  return d + '/' + m + '/' + y;
}

export function fullDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  month = (month < 10 ? '0' : '') + month;
  day = (day < 10 ? '0' : '') + day;
  hour = (hour < 10 ? '0' : '') + hour;
  min = (min < 10 ? '0' : '') + min;
  sec = (sec < 10 ? '0' : '') + sec;
  var str = date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  return str;
}

export const getCurrentHour = () => {
  const now = new Date();
  const currentHour = now.getHours();
  return currentHour;
};

export const isValidYouTubeUrl = (url) => {
  const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})/;
  return youtubeUrlPattern.test(url);
};

export const getCurrentHourFormatted = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const formattedHour = hour < 10 ? `0${hour}` : hour;
  const formattedMinute = minute < 10 ? `0${minute}` : minute;
  const formattedSecond = second < 10 ? `0${second}` : second;
  const formattedTime = `${formattedHour}:${formattedMinute}:${formattedSecond}`;
  return formattedTime;
};

export const calcularDiferenciaFechas = (fecha1, fecha2) => {
  const fechaInicio = new Date(fecha1);
  const fechaFin = new Date(fecha2);
  const diferenciaMilisegundos = fechaFin - fechaInicio;
  const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  return diferenciaDias;
};
