export interface Station {
  iata: string;
  shortName: string;
  connections: string[];
}

export enum FareBundle {
  BASIC = 'basic',
  STANDARD = 'standard',
  PLUS = 'plus',
}

export interface Fare {
  price: {
    amount: number;
    currencyCode: string;
  }
  remainingTickets: number;
  bundle: FareBundle;
}

export interface Flight {
  departureStation: string;
  arrivalStation: string;
  departureDateTime: string;
  arrivalDateTime: string;
  fares: Fare[];
}
