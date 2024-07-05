// auto.interface.ts

export interface Auto {
    id?: number;
    marca: string;
    modello: string;
    anno: number;
    chilometraggio: number;
    descrizione: string;
    disponibilità: boolean;
    statoVeicolo: string;
    specifiche: {
      performance: {
        topSpeed: string;
        accelerazione0a100Kmh: string;
        motore: {
          tipo: string;
          cilindrata: string;
          cavalli: number;
          coppia: string;
          trasmissione: string;
          trazione: string;
        };
        consumoCarburante: {
          città: string;
          autostrada: string;
          combinato: string;
        };
        emissioni: string;
      };
      dimensioni: {
        lunghezza: string;
        larghezza: string;
        altezza: string;
        passo: string;
        pesoAVuoto: string;
        capacitaSerbatoio: string;
      };
      interni: {
        posti: number;
        tappezzeria: string;
        caratteristiche: string[];
      };
      esterni: {
        opzioniColori: string[];
        caratteristiche: string[];
      };
      sicurezza: {
        assistenzaAllaGuida: string[];
        sicurezza: string[];
        airbags: {
          anteriore: boolean;
          laterale: boolean;
          tendina: boolean;
          ginocchia: boolean;
        };
      };
    };
    prezzo: {
      prezzoBase: number;
      tasse: number;
      optional: number;
      prezzoTotale: number;
    };
    optionalFeatures: {
      nome: string;
      prezzo: number;
    }[];
    immagini: {
      opzioneColore: string;
      url: string;
    }[];
  }
  