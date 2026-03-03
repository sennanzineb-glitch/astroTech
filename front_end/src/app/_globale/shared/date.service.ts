import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private datePipe: DatePipe) {}

  formatDate(date: Date | string): string {
    const formatted = this.datePipe.transform(
      date,
      'EEEE d MMMM y'
    );

    return formatted?.toUpperCase() || '';
  }

}