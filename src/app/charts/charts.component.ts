import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as fromModel from '../store/charts.model';

import { ApexChart, ApexResponsive, ChartComponent } from 'ng-apexcharts';

import { ChartsService } from '../store/charts.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  // @ts-ignore
  @ViewChild('chart') pieChart: ChartComponent;
  public chartOne: fromModel.pieChartOptions = {} as fromModel.pieChartOptions;
  public chartTwo: fromModel.pieChartOptions = {} as fromModel.pieChartOptions;

  private chart: ApexChart = {
    width: 450,
    type: 'pie',
  };

  private responsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ];

  // @ts-ignore
  @ViewChild('report', { static: false }) report: ElementRef;

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {
    this.chartsService.getCapacityReport().subscribe((report) => {
      this.chartOne = {
        series: report.series,
        chart: this.chart,
        labels: report.labels,
        responsive: this.responsive,
      };
    });

    this.chartsService.getPeriodReport().subscribe((report) => {
      this.chartTwo = {
        series: report.series,
        chart: { ...this.chart, width: 500 },
        labels: report.labels,
        responsive: this.responsive,
      };
    });
  }

  public downloadAsPDF() {
    let doc = new jsPDF('portrait', 'pt', 'a4');

    doc.html(this.report.nativeElement, {
      callback: (doc) => {
        doc.save('report.pdf');
      },
    });
  }
}
