import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BookingsService } from '../store/bookings.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  checked = false;

  cnpChars = 13;

  form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z]+$'),
    ]),

    daterange: new FormGroup({
      start: new FormControl<Date | null>(null, Validators.required),
      end: new FormControl<Date | null>(null, Validators.required),
    }),

    capacity: new FormControl(null, [Validators.required]),

    cnp: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(this.cnpChars),
      Validators.maxLength(this.cnpChars),
    ]),
  });

  constructor(
    private fb: FormBuilder,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.bookingsService.getBookings().subscribe((res) => {
      console.log(res);
    });
  }

  onSubmit() {
    this.bookingsService
      .addBooking(
        this.form.controls.firstName.value,
        this.form.controls.lastName.value,
        {
          start: this.form.controls.daterange.controls.start.value,
          end: this.form.controls.daterange.controls.end.value,
        },
        this.form.controls.capacity.value,
        this.form.controls.cnp.value,
        this.calculatePrice()
      )
      .subscribe((res) => console.log(res));

    this.download();
    console.log(this.checked);
  }

  calculatePrice(): number {
    return this.form.controls.capacity.value
      ? this.form.controls.capacity.value *
          this.getDayDiff(
            this.form.controls.daterange.controls.end.value,
            this.form.controls.daterange.controls.start.value
          ) *
          50
      : 0;
  }

  getDayDiff(startDate: Date | null, endDate: Date | null): number {
    const msInDay = 24 * 60 * 60 * 1000;

    return Math.round(Math.abs(Number(endDate) - Number(startDate)) / msInDay);
  }

  unavailableDays(date: Date) {
    return date > new Date();
  }

  under18(cnp: string | null) {
    if (
      cnp != null &&
      (cnp[0] === '5' || cnp[0] === '6') &&
      parseInt(cnp.substring(1, 3)) > 4
    ) {
      this.checked = false;
      return true;
    }
    this.checked = true;
    return false;
  }

  cnpValidation(cnp: string | null) {
    return (
      cnp != null &&
      (cnp[0] === '5' || cnp[0] === '6' || cnp[0] === '1' || cnp[0] === '2')
    );
  }

  download() {
    let text =
      'Payment receipt\n' +
      'Name: ' +
      this.form.controls.firstName.value +
      ' ' +
      this.form.controls.lastName.value +
      '\n' +
      'Booked nights:' +
      this.getDayDiff(
        this.form.controls.daterange.controls.start.value,
        this.form.controls.daterange.controls.end.value
      ) +
      '\n' +
      'People: ' +
      this.form.controls.capacity.value +
      '\n' +
      'Suma platita:' +
      this.calculatePrice();
    let file = new Blob([text], { type: '.txt' });
    let a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'factura';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
