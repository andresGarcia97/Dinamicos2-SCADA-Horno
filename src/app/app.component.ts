import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { DataChart } from './clases';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  voltaje = 1;
  ts = 1;
  tiempoAlentamiento = 10;
  referencia = 100;
  maximoIteraciones = 1200;
  k = 0.2;

  titulografica = 'grafica';
  num = 1.1;
  num1 = this.num * 0.008594;
  num2 = this.num * 0.008548;
  den1 = 1.984;
  den2 = -0.9841;
  salidaSistema = [0, 0, 0, 0];
  voltajeInterno = this.voltaje.valueOf();
  uControl = [this.voltajeInterno, this.voltajeInterno, this.voltajeInterno, this.voltajeInterno];
  tiempo = 0;
  intervalDisipacion = null;
  temperaturaDisipacion = 0;
  datosDisipacion = [];
  datosReferencia = [];
  datosError = [];
  graficaDisipacion: any;
  temperaturaRedondeo = 0;
  pausado = true;
  apagado = true;
  error = 0;
  mp = 0;
  po = 0;
  vf = 0;
  tss = 0;
  ess = 0;
  tempAmbiental = 10;
  interrump = false;
  numberInterrupcion = 0;

  private graficar(): void {
    this.graficaDisipacion = new Chart(this.titulografica, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura',
          showLine: true,
          backgroundColor: 'rgb(0, 168, 150, 0.6)',
          pointBorderColor: 'rgba(0, 168, 150)',
          pointBackgroundColor: 'rgba(0, 168, 150)',
          borderColor: 'rgba(0, 168, 150)',
          data: this.datosDisipacion,
        },
        {
          label: 'Referencia',
          showLine: false,
          pointBorderColor: 'rgba(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosReferencia,
        },
        {
          label: 'Error',
          showLine: true,
          pointBorderColor: 'rgba(83, 19, 30)',
          backgroundColor: 'rgba(83, 19, 30, 0.5)',
          pointBackgroundColor: 'rgba(83, 19, 30)',
          borderColor: 'rgba(83, 19, 30)',
          data: this.datosError,
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
    this.datosReferencia.push(new DataChart(this.tiempo, this.referencia));
    this.salidaSistema.push(this.temperaturaDisipacion);
    this.uControl.push(this.voltajeInterno);
    this.datosDisipacion.push(new DataChart(this.tiempo, this.temperaturaDisipacion));
    this.datosError.push(new DataChart(this.tiempo, this.error));
    this.graficaDisipacion.update();
  }

  public apagar(): void {
    clearInterval(this.intervalDisipacion);
    this.calcularPo();
    this.calcularTSS();
    this.calcularESS();
    this.pausado = false;
    this.intervalDisipacion = null;
    this.apagado = false;
    return;
  }

  public pausar(): void {
    this.pausado = !this.pausado;
  }

  public horno(): void {
    this.interrump = false;
    this.pausado = this.apagado = true;
    this.voltajeInterno = this.voltaje;
    this.salidaSistema = [0, 0, 0, 0];
    this.uControl = [this.voltajeInterno, this.voltajeInterno, this.voltajeInterno, this.voltajeInterno];
    this.datosDisipacion = [];
    this.datosReferencia = [];
    this.datosError = [];
    this.tiempo = 4;
    const max = 200;
    const min = 10;
    this.numberInterrupcion = Math.round(Math.random() * (max - min) + min);
    this.mp = this.po = this.tss = this.ess = this.vf = this.error = this.numberInterrupcion = 0;
    this.datosError.push(new DataChart(this.tiempo - 4, this.error));
    this.datosError.push(new DataChart(this.tiempo - 3, this.error));
    this.datosError.push(new DataChart(this.tiempo - 2, this.error));
    this.datosError.push(new DataChart(this.tiempo - 1, this.error));
    this.datosReferencia.push(new DataChart(this.tiempo - 4, this.referencia));
    this.datosReferencia.push(new DataChart(this.tiempo - 3, this.referencia));
    this.datosReferencia.push(new DataChart(this.tiempo - 2, this.referencia));
    this.datosReferencia.push(new DataChart(this.tiempo - 1, this.referencia));
    this.datosDisipacion.push(new DataChart(this.tiempo - 4, this.salidaSistema[this.tiempo - 4]));
    this.datosDisipacion.push(new DataChart(this.tiempo - 3, this.salidaSistema[this.tiempo - 3]));
    this.datosDisipacion.push(new DataChart(this.tiempo - 2, this.salidaSistema[this.tiempo - 2]));
    this.datosDisipacion.push(new DataChart(this.tiempo - 1, this.salidaSistema[this.tiempo - 1]));
    this.graficar();
    this.intervalDisipacion = setInterval(() => {
      if (this.pausado) {
        // formula
        this.temperaturaDisipacion = this.num1 * this.uControl[this.tiempo - 1] + this.num2 * this.uControl[this.tiempo - 2] +
          this.den1 * this.salidaSistema[this.tiempo - 1] + this.den2 * this.salidaSistema[this.tiempo - 2];
        if (this.interrump) {
          this.interrumpir();
        }
        /*if (this.numberInterrupcion === this.tiempo6) {
          this.interrumpir();
        }*/
        this.insercionDatos();
        this.tiempo++;
        this.temperaturaRedondeo = Math.round(this.temperaturaDisipacion);
        this.validarReferenncia();
        this.revisarMP();
      }
    }, this.ts * this.tiempoAlentamiento);
  }

  private validarReferenncia(): void {
    this.error = this.referencia - this.temperaturaRedondeo;
    const voltaje = this.k * this.error;
    this.voltajeInterno = Math.round((voltaje + Number.EPSILON) * 100) / 100;
    if (this.tiempo === this.maximoIteraciones) {
      this.apagar();
    }
    return;
  }

  private interrumpir(): void {
    this.temperaturaDisipacion = this.temperaturaDisipacion + this.tempAmbiental;
    this.interrump = false;
  }

  public interrumpirTemp(): void {
    this.interrump = true;
  }

  private revisarMP(): void {
    const valorActual = this.salidaSistema[this.tiempo - 1];
    const valorAnterior = this.salidaSistema[this.tiempo - 2];
    const maximoAlcanzado = this.mp.valueOf();
    if (valorActual > valorAnterior && valorActual > maximoAlcanzado) {
      this.mp = Math.round(valorActual);
    }
  }

  private calcularPo(): void {
    this.vf = this.salidaSistema[this.tiempo - 1];
    this.vf = Math.round(this.vf);
    this.po = (this.mp - this.vf) / this.vf;
    this.po = Math.round((this.po + Number.EPSILON) * 100) / 100;
  }

  private calcularTSS(): void {
    const vfMayor = this.vf + this.vf * 0.02;
    const vfMenor = this.vf - this.vf * 0.02;
    let distancia = 0;
    this.datosDisipacion = this.datosDisipacion.reverse();
    this.datosDisipacion.forEach(element => {
      if (element.y > vfMenor && vfMayor > element.y && distancia < 10) {
        this.tss = element.x;
        while (distancia > 0) {
          distancia--;
        }
      }
      else {
        distancia++;
      }
    });
  }

  private calcularESS(): void {
    this.ess = this.referencia - this.vf;
  }

}
