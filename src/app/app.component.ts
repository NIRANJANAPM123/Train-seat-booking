import { Component } from '@angular/core';

interface Seat {
  booked: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seatMap: Seat[][] = [];
  rows: number = 11;
  seatsPerRow: number = 7;
  seatsToBook: number = 1;
  bookedSeats: string[] = [];

  constructor() {
    this.initializeSeatMap();
  }

  initializeSeatMap() {
    for (let i = 0; i < this.rows; i++) {
      const row: Seat[] = [];
      const seatsInRow = i === 10 ? 3 : this.seatsPerRow; // Last row has only 3 seats
      for (let j = 0; j < seatsInRow; j++) {
        row.push({ booked: false });
      }
      this.seatMap.push(row);
    }
  }

  bookSeats() {
    let bookedCount = 0;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.seatMap[i].length; j++) {
        if (!this.seatMap[i][j].booked && bookedCount < this.seatsToBook) {
          this.seatMap[i][j].booked = true;
          bookedCount++;
          this.bookedSeats.push(`Row ${i + 1} Seat ${j + 1}`);
        }
      }
      if (bookedCount === this.seatsToBook) {
        break; // Exit if all requested seats are booked
      }
    }

    if (bookedCount < this.seatsToBook) {
      alert('Not enough seats available.');
    }
  }

  toggleSeat(row: Seat[], seat: Seat) {
    if (!seat.booked) {
      seat.booked = !seat.booked;
    }
  }
}
