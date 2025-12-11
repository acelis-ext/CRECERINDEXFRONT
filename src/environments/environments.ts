export const environment = {
  production: false,

  //desarrollo local
  // apiBaseUrl: 'https://localhost:7144',


  //antiguo QA sin seguridad
  // apiBaseUrl: 'https://crecer-indexapi.azurewebsites.net/api/',


  //ESTE ES PARA HACER LOS PASE A QA Y A PROD
  //produccion
  ////por cambios de vnet privada se va dejar vacio el apiBaseUrl SAME-ORIGIN REQUEST
  //// apiBaseUrl: 'https://localhost:7144',  ya no va tener el prefijo api para cuando este desplegado a prod
  apiBaseUrl: '',
  CAPTCHA_KEY: '6LfdwNArAAAAAMf0LQIrbfg27Qvqsgf-w3OOHZDS' // clave de prueba pública de Google
  
};