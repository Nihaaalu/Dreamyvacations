
export enum RoomType {
  ROOM = 'Room',
  COTTAGE = 'Cottage',
  COTTAGE_PLUS_ROOM = 'Cottage + Room'
}

export enum BookingPlatform {
  BOOKING_COM = 'Booking.com',
  DIRECT = 'Direct'
}

export enum BookingMode {
  PER_ROOM = 'perRoom',
  PER_PERSON = 'perPerson',
  NONE = ''
}

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
  bookingMode: BookingMode;
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
