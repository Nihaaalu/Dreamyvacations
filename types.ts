
export enum RoomType {
  ROOM = 'Room',
  COTTAGE = 'Cottage'
  ROOM COTTAGE = 'Room + Cottage'
}

export enum BookingPlatform {
  BOOKING_COM = 'Booking.com',
  DIRECT = 'Direct'
}

export type PaymentMethod = 'perPerson' | 'perRoom' | 'fullPayment' | '';

export interface BookingData {
  bookingId: string;
  guestName: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  numRooms: number;
  numNights: number;
  reservation: string;
  roomType: RoomType | '';
  adults: number;
  children: number;
  roomRent: number;
  advanceCollected: number;
  platform: BookingPlatform;
  logo?: string;
  includeBreakfast: boolean;
  breakfastItems: string[];
  breakfastCustomItems: string[];
  includeDinner: boolean;
  dinnerItems: string[];
  dinnerCustomItems: string[];
  includeSnacks: boolean;
  snacksItems: string[];
  snacksCustomItems: string[];
  // New Payment Fields
  paymentMethod: PaymentMethod;
  amtPerAdult: number;
  amtPerChild: number;
  amtPerRoom: number;
}

export interface ResortDetails {
  name: string;
  address: string;
  googleMaps: string;
  phone: string[];
  email: string;
}
