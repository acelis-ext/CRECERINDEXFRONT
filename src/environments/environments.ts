export const environment = {
  production: false,

  //desarrollo local
  apiBaseUrl: 'https://localhost:7144', //


  //antiguo QA sin seguridad (ya no se usa asi, sino que se usar con el Frontdoor)
  // apiBaseUrl: 'https://crecer-indexapi.azurewebsites.net/api/',


  //ESTE ES PARA HACER LOS PASE A QA (AZURE Frontdoor)
  //produccion
  //por cambios de vnet privada se va dejar vacio el apiBaseUrl SAME-ORIGIN REQUEST
  // apiBaseUrl: '',


  //ESTE ES PARA HACER LOS PASES A PRODUCCION EN EL DMZ SERVIDOR LOCAL DE CRECER SEGUROS
  //apiBaseUrl: 'https://api-index.crecerseguros.pe', 

  
  CAPTCHA_KEY: '6LfdwNArAAAAAMf0LQIrbfg27Qvqsgf-w3OOHZDS' // clave de prueba pública de Google


  
};