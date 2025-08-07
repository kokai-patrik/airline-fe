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
  };
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

export interface FlightsWithDates {
  flights: Flight[];
  prevDate: string | null;
  nextDate: string | null;
}
export interface ApiResponse<T> {
  data: T;
}
