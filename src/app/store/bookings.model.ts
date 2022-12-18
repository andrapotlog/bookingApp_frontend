export interface Booking {
  firstName: string;
  lastName: string;
  daterange: DateRange;
  capacity: number;
  cnp: string;
  price: number;
  bookingTime: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}
