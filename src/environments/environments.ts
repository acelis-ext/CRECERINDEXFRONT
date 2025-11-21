export const environment = {
  production: false,

  // apiBaseUrl: 'https://crecer-indexapi.azurewebsites.net/api/',
  // apiBaseUrl: 'https://localhost:7144/api/',
  //por cambios de vnet privada se va dejar vacio el apiBaseUrl SAME-ORIGIN REQUEST
      // apiBaseUrl: 'https://localhost:7144',  ya no va tener el prefijo api para cuando este desplegado a prod

  apiBaseUrl: '',
  CAPTCHA_KEY: '6LfdwNArAAAAAMf0LQIrbfg27Qvqsgf-w3OOHZDS' // clave de prueba pública de Google
  
};