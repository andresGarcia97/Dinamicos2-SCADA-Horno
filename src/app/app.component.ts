import { Component } from '@angular/core';
import { Chart } from 'chart.js';

class Formula {
  tiempo: number;
  temperatura: number;
  constructor(tiempo = 0, resultado = 0) {
    this.tiempo = tiempo;
    this.temperatura = resultado;
  }
}

class DataChart {
  x: number;
  y: number;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'hornoDinamicos2';
  tituloGrafica = 'grafica';
  tiempo = 0;
  imprimir: Formula = new Formula();
  resultados: Formula[] = [];
  voltaje = 5;
  ts = 0.1;
  chart: any;
  datas = [];
  interval = null;

  private T(temperatura: number): number {
    return temperatura;
  }
  private V(voltaje = 1): number {
    return voltaje;
  }

  private graficar(): void {
    this.chart = new Chart(this.tituloGrafica, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura en el Tiempo',
          showLine: true,
          backgroundColor: 'rgba(56, 111, 164, 0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datas,
        }],
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Tiempo'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Temperatura'
            }
          }]
        }
      }
    });
  }

  private insercionDatos(): void {
    this.resultados.push(this.imprimir);
    this.datas.push(new DataChart(this.tiempo, this.imprimir.temperatura));
    this.chart.update();
  }

  public apagar(): void {
    clearInterval(this.interval);
    this.tiempo--;
  }

  public hornoBasico(size = 1): void {
    this.datas = [];
    this.graficar();
    this.resultados = [];
    size = 20;
    this.tiempo = 0;
    this.imprimir = new Formula(this.tiempo, this.V(this.voltaje) * this.ts * 0 + this.T(0));
    this.insercionDatos();
    this.tiempo = 1;
    this.interval = setInterval(() => {
      this.imprimir = new Formula(this.tiempo, this.V(this.voltaje) * this.ts + this.T(this.resultados[this.tiempo - 1].temperatura));
      this.insercionDatos();
      this.tiempo++;
      if (this.tiempo === size + 1) {
        this.apagar();
      }
    }, this.ts * 1000);
  }
}

