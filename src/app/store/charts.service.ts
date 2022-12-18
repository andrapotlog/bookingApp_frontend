import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as fromModel from './charts.model';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  constructor(private http: HttpClient) {}

  getCapacityReport(): Observable<fromModel.ChartReport> {
    return this.http.get<fromModel.ChartReport>(
      'http://localhost:8000/getCapacityReport'
    );
  }

  getPeriodReport(): Observable<fromModel.ChartReport> {
    return this.http.get<fromModel.ChartReport>(
      'http://localhost:8000/getPeriodReport'
    );
  }
}
