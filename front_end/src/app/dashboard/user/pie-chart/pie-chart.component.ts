import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';
import { registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div style="display: block; width: 100%; height: 120px; position: relative;">
      <canvas baseChart #myChart="base-chart"
        [data]="chartData" 
        [type]="type" 
        [options]="chartOptions">
      </canvas>
    </div>
  `
})
export class DashboardChartComponent implements OnChanges {
  @Input() type: ChartType = 'pie';
  @Input() data: Array<{ label: string, value: number }> = [];

  // Permet d'accéder directement à l'instance du graphique ng2-charts
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  public chartData: ChartData<ChartType, any[], string> = {
    labels: [],
    datasets: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    const cleanAndShorten = (text: string): string => {
      if (!text) return '';
      let clean = text.trim();
      if (clean.startsWith(',')) {
        clean = clean.substring(1).trim();
      }
      return clean.length > 12 ? clean.substring(0, 12) + '...' : clean;
    };

    // 1. Ré-initialisation des options de configuration selon le type
    if (this.type === 'pie') {
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            display: true,
            labels: {
              font: { size: 8 },
              boxWidth: 6,
              color: '#ffffff',
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels?.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i, true);
                    return {
                      text: cleanAndShorten(label as string),
                      index: i,
                      datasetIndex: 0,
                      fillStyle: style?.['backgroundColor'] as string,
                      strokeStyle: style?.['borderColor'] as string,
                      lineWidth: style?.['borderWidth'] as number,
                      hidden: !chart.getDataVisibility(i)
                    };
                  });
                }
                return [];
              }
            }
          }
        }
      };
    } else {
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            grid: { display: false },
            ticks: {
              font: { size: 7 },
              color: '#ffffffcc',
              maxRotation: 45,
              minRotation: 0,
              callback: function(this: any, value: string | number) {
                const label = this.getLabelForValue(value as number);
                if (typeof label === 'string') {
                  let clean = label.trim();
                  if (clean.startsWith(',')) {
                    clean = clean.substring(1).trim();
                  }
                  return clean.length > 12 ? clean.substring(0, 12) + '...' : clean;
                }
                return label;
              }
            }
          },
          y: {
            display: true,
            grid: { display: false },
            ticks: { font: { size: 7 }, color: '#ffffffcc' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      };
    }

    // 2. Assignation des données (Création d'une NOUVELLE référence d'objet)
    if (this.data && Array.isArray(this.data)) {
      this.chartData = {
        labels: this.data.map(item => cleanAndShorten(item.label)),
        datasets: [{
          data: this.data.map(item => item.value),
          backgroundColor: this.type === 'pie' 
            ? ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'] 
            : '#ffffffcc',
          borderColor: this.type === 'pie' ? '#1c222c' : '#ffffff',
          borderWidth: 1,
          tension: 0.4,
          pointRadius: this.type === 'line' ? 3 : 0
        }]
      };

      // 3. FORCE LE RENDU IMMÉDIAT DU GRAPHQUE SI L'INSTANCE EXISTE DÉJÀ
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
        }
      }, 0);
    }
  }
}