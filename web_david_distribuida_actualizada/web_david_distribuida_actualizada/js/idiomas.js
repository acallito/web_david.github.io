/* Textos del JavaScript en cada idioma (el resto viven en data-ca / data-es del HTML) */
/* ============================================================
   IDIOMA · el català és sempre el que es carrega en entrar.
   Els textos fixos viuen als atributs data-ca / data-es del HTML;
   aquí només hi ha les etiquetes que genera el JavaScript.
   ============================================================ */
let idioma = 'ca';

const ETIQUETES = {
  ca: {
    distancia: 'Distància', desnivell: 'Desnivell', durada: 'Durada',
    perPersona: 'Per persona', reservar: 'Reservar plaça',
    material: 'Material i condicions', calPortar: 'Cal portar:', especial: 'Esdeveniment especial',
    masInfo: 'Més informació de l’escapada',
    franjaEspecial: 'Nova escapada · Singles a Mont-ral · 7 i 8 de novembre',
    franjaMes: 'Més informació',
    waFlotantAria: 'Obrir xat de WhatsApp',
    waMissatge: 'Hola! Tinc un dubte sobre les excursions',
    buit: 'No hi ha cap excursió amb aquesta dificultat de moment.',
    capProgramada: 'De moment no hi ha excursions programades. Escriu-nos i t\u2019avisem de les properes.',
    proxima: 'Pròxima sortida', properes: 'Properes sortides',
    senseDecidir: 'Encara no ho tinc decidit',
    tallerOpcio: 'Taller pràctic de GPS — 17 i 18 d\u2019octubre',
    falten: 'Cal indicar el nom i el correu electrònic.',
    assumpte: 'Reserva · ', consulta: 'Consulta general', senseMissatge: '(sense missatge)',
    cNom: 'Nom', cCorreu: 'Correu', cTelefon: 'Telèfon', cActivitat: 'Activitat', cPlaces: 'Places',
    titol: 'Territori a Peu · Coneix la teva terra · Excursions guiades des d\u2019Alcover',
    descripcio: 'Excursions guiades en grups reduïts per les Muntanyes de Prades, el Montsant i el Priorat. Sortides des d\u2019Alcover amb David Velasco, guia de senderisme.',
    catBuit: 'No hi ha cap ruta amb aquesta dificultat al catàleg.',
    catReservar: 'Consultar disponibilitat',
    catSobDemanda: 'Sota demanda'
  },
  es: {
    distancia: 'Distancia', desnivell: 'Desnivel', durada: 'Duración',
    perPersona: 'Por persona', reservar: 'Reservar plaza',
    material: 'Material y condiciones', calPortar: 'Hay que llevar:', especial: 'Evento especial',
    masInfo: 'Más información de la escapada',
    franjaEspecial: 'Nueva escapada · Singles en Mont-ral · 7 y 8 de noviembre',
    franjaMes: 'Más información',
    waFlotantAria: 'Abrir chat de WhatsApp',
    waMissatge: 'Hola! Tengo una duda sobre las excursiones',
    buit: 'No hay ninguna excursión con esta dificultad por ahora.',
    capProgramada: 'De momento no hay excursiones programadas. Escríbenos y te avisamos de las próximas.',
    proxima: 'Próxima salida', properes: 'Próximas salidas',
    senseDecidir: 'Aún no lo tengo decidido',
    tallerOpcio: 'Taller práctico de GPS — 17 y 18 de octubre',
    falten: 'Hay que indicar el nombre y el correo electrónico.',
    assumpte: 'Reserva · ', consulta: 'Consulta general', senseMissatge: '(sin mensaje)',
    cNom: 'Nombre', cCorreu: 'Correo', cTelefon: 'Teléfono', cActivitat: 'Actividad', cPlaces: 'Plazas',
    titol: 'Territori a Peu · Coneix la teva terra · Excursiones guiadas desde Alcover',
    descripcio: 'Excursiones guiadas en grupos reducidos por las Montañas de Prades, el Montsant y el Priorat. Salidas desde Alcover con David Velasco, guía de senderismo.',
    catBuit: 'No hay ninguna ruta con esta dificultad en el catálogo.',
    catReservar: 'Consultar disponibilidad',
    catSobDemanda: 'Bajo demanda'
  }
};
const T = () => ETIQUETES[idioma];
/* Agafa el camp traduït si existeix; si no, el català */
const camp = (r, nom) => (idioma === 'es' && r[nom + '_es'] !== undefined) ? r[nom + '_es'] : r[nom];
