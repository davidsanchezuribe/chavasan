import LocalizedStrings from 'react-localization';

const messages = new LocalizedStrings({
  en: {
    example: 'Example',
    homepage: {
      helloWorld: 'Hello World',
    }
  },
  es: {
    example: 'Ejemplo',
    homepage: {
      helloWorld: 'Hola Mundo',
    }
  }
});

export default messages;
