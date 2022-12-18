import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as fromModel from './bookings.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(private http: HttpClient) {}

  getBookings(): Observable<fromModel.Booking> {
    return this.http.get<fromModel.Booking>(
      'http://localhost:8000/getBookings'
    );
  }

  addBooking(
    firstName: string | null,
    lastName: string | null,
    daterange: { start: Date | null; end: Date | null },
    capacity: number | null,
    cnp: string | null,
    price: number | null
  ) {
    const options = {
      params: {
        firstName: firstName,
        lastName: lastName,
        daterange: {
          start: this.formatDate(daterange.start),
          end: this.formatDate(daterange.end),
        },
        capacity: capacity,
        cnp: cnp,
        price: price,
      },
    };

    console.log(this.formatDate(daterange.start));

    return this.http.post('http://localhost:8000/addFoodToDatabase', options, {
      responseType: 'text',
    });
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date | null) {
    return [
      // @ts-ignore
      date.getFullYear(),
      // @ts-ignore
      this.padTo2Digits(date.getMonth() + 1),
      // @ts-ignore
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }
}
