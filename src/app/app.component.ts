import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { DataChart } from './clases';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'hornoDinamicos2';

  // variables primer ejercicio, sin disipacion
  tituloGraficaBasica = 'grafica1';
  tiempo1 = 0;
  resultado1 = 0;
  voltaje = 5;
  ts1 = 0.1;
  graficaBasica: any;
  resultados = [];
  datos = [];
  interval1 = null;
  pausadoBasico = true;

  // variables segundo ejercicio, con disipacion
  titulograficaDisipacion = 'grafica2';
  numDisipacion = 1.1;
  num1 = this.numDisipacion * 0.008594;
  num2 = this.numDisipacion * 0.008548;
  den1 = 1.984;
  den2 = -0.9841;
  salidaSistema = [0, 0, 0, 0];
  voltaje2 = 2;
  u = [this.voltaje2, this.voltaje2, this.voltaje2, this.voltaje2];
  ts2 = 1;
  tiempo2 = 0;
  referencia2 = 1;
  interval2 = null;
  resultado2 = 0;
  datos2 = [];
  graficaDisipacion: any;
  temperaturaRedondeo = 0;
  pausadoDisipasion = true;

  private T(temperatura: number): number {
    return temperatura;
  }
  private V(voltaje = 1): number {
    return voltaje;
  }

  private graficarBasica(): void {
    this.graficaBasica = new Chart(this.tituloGraficaBasica, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura en el Tiempo',
          showLine: true,
          backgroundColor: 'rgba(56, 111, 164, 0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datos,
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

  private graficarDisipacion(): void {
    this.graficaDisipacion = new Chart(this.titulograficaDisipacion, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura en el Tiempo con Disipación',
          showLine: true,
          backgroundColor: 'rgb(255,69,0,0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datos2,
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

  private insercionDatosBasico(): void {
    this.datos.push(new DataChart(this.tiempo1, this.resultado1));
    this.resultados.push(this.resultado1);
    this.graficaBasica.update();
  }

  private insercionDatosDisipacion(): void {
    this.temperaturaRedondeo = Math.round(this.resultado2);
    this.salidaSistema.push(this.resultado2);
    this.u.push(this.voltaje2);
    this.datos2.push(new DataChart(this.tiempo2, this.resultado2));
    this.graficaDisipacion.update();
  }

  public apagarBasico(): void {
    clearInterval(this.interval1);
    this.tiempo1--;
  }

  public apagarDisipacion(): void {
    clearInterval(this.interval2);
    this.tiempo2--;
  }

  public pausarBasico(): void {
    this.pausadoBasico = !this.pausadoBasico;
  }

  public pausarDisipacion(): void {
    this.pausadoDisipasion = !this.pausadoDisipasion;
  }

  public hornoBasico(): void {
    this.pausadoBasico = true;
    this.datos = [];
    this.resultados = [];
    this.graficarBasica();
    this.resultado1 = 0;
    const size = 400;
    this.tiempo1 = 0;
    this.resultado1 = this.V(this.voltaje) * this.ts1 * 0 + this.T(0);
    this.insercionDatosBasico();
    this.tiempo1 = 1;
    this.interval1 = setInterval(() => {
      if (this.pausadoBasico) {
        this.resultado1 = this.V(this.voltaje) * this.ts1 + this.T(this.resultados[this.tiempo1 - 1]);
        this.insercionDatosBasico();
        this.tiempo1++;
        if (this.tiempo1 === size + 1) {
          this.apagarBasico();
        }
      }
    }, this.ts1);
  }

  public hornoDisipacion(): void {
    this.pausadoDisipasion = true;
    this.salidaSistema = [0, 0, 0, 0];
    this.u = [this.voltaje2, this.voltaje2, this.voltaje2, this.voltaje2];
    this.datos2 = [];
    this.tiempo2 = 4;
    this.datos2.push(new DataChart(this.tiempo2 - 4, this.salidaSistema[this.tiempo2 - 4]));
    this.datos2.push(new DataChart(this.tiempo2 - 3, this.salidaSistema[this.tiempo2 - 3]));
    this.datos2.push(new DataChart(this.tiempo2 - 2, this.salidaSistema[this.tiempo2 - 2]));
    this.datos2.push(new DataChart(this.tiempo2 - 1, this.salidaSistema[this.tiempo2 - 1]));
    this.graficarDisipacion();
    const size = 500;
    this.interval2 = setInterval(() => {
      if (this.pausadoDisipasion) {
        // formula
        this.resultado2 = this.num1 * this.u[this.tiempo2 - 1] + this.num2 * this.u[this.tiempo2 - 2] +
          this.den1 * this.salidaSistema[this.tiempo2 - 1] + this.den2 * this.salidaSistema[this.tiempo2 - 2];
        this.insercionDatosDisipacion();
        this.tiempo2++;
        if (this.tiempo2 === size + 1) {
          this.apagarDisipacion();
        }
      }
    }, this.ts2);
  }
}

