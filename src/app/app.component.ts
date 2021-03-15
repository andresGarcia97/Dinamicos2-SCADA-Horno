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
  tempAmbiental = 10;
  referencia = 100;
  maximoIteraciones = 1000;
  k = 0.2;
  n = 10;
  ti = 25;
  td = 20;

  titulografica = 'grafica';
  num = 1.1;
  num1 = this.num * 0.008594;
  num2 = this.num * 0.008548;
  den1 = 1.984;
  den2 = -0.9841;
  salidaSistema = [0, 0, 0, 0];
  integrales = [0, 0, 0, 0];
  derivadas = [0, 0, 0, 0];
  voltajeInterno = this.voltaje.valueOf();
  uControl = [this.voltajeInterno, this.voltajeInterno, this.voltajeInterno, this.voltajeInterno];
  intervalDisipacion = null;
  datosDisipacion = [];
  datosReferencia = [];
  datosError = [];
  graficaDisipacion: any;
  pausado = true;
  apagado = true;
  interrump = false;
  temperaturaSalida = 0;
  numberInterrupcion = 0;
  controlProporcional = 0;
  temperaturaRedondeo = 0;
  voltajeRedondeo = 0;
  errorRedondeo = 0;
  essRedondeo = 0;
  integral = 0;
  derivada = 0;
  tiempo = 0;
  error = 0;
  tss = 0;
  ess = 0;
  mp = 0;
  po = 0;
  vf = 0;

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
    this.integrales.push(this.integral);
    this.derivadas.push(this.derivada);
    this.datosReferencia.push(new DataChart(this.tiempo, this.referencia));
    this.salidaSistema.push(this.temperaturaSalida);
    this.uControl.push(this.voltajeInterno);
    this.datosDisipacion.push(new DataChart(this.tiempo, this.temperaturaSalida));
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
    this.limpiarDatos();
    return;
  }

  public pausar(): void {
    this.pausado = !this.pausado;
  }

  private limpiarDatos(): void {
    this.datosDisipacion = [];
    this.datosReferencia = [];
    this.datosError = [];
  }

  private insercionInicialDatos(): void {
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
  }

  public horno(): void {
    this.interrump = false;
    this.pausado = this.apagado = true;
    this.voltajeInterno = this.voltaje;
    this.salidaSistema = [0, 0, 0, 0];
    this.integrales = [0, 0, 0, 0];
    this.derivadas = [0, 0, 0, 0];
    this.uControl = [this.voltajeInterno, this.voltajeInterno, this.voltajeInterno, this.voltajeInterno];
    this.limpiarDatos();
    this.tiempo = 4;
    const max = 200;
    const min = 10;
    this.numberInterrupcion = Math.round(Math.random() * (max - min) + min);
    this.mp = this.po = this.tss = this.ess = this.vf = this.error = this.controlProporcional = this.integral = 0;
    this.derivada = this.voltajeRedondeo = this.errorRedondeo = this.essRedondeo = this.temperaturaSalida = 0;
    this.insercionInicialDatos();
    this.graficar();
    this.intervalDisipacion = setInterval(() => {
      if (this.pausado) {
        // formula
        this.temperaturaSalida = this.num1 * this.uControl[this.tiempo - 1] + this.num2 * this.uControl[this.tiempo - 2] +
          this.den1 * this.salidaSistema[this.tiempo - 1] + this.den2 * this.salidaSistema[this.tiempo - 2];
        // posible interrupcion
        this.interrumpir();
        // calculando error
        this.error = this.referencia - this.temperaturaSalida;
        // calculado proporcional
        this.controlProporcional = this.k * this.error;
        // calculando integral
        this.integral = this.integrales[this.tiempo - 1] + ((this.k * this.ts) / this.ti) * this.error;
        // calculando derivada
        this.derivada = (1 - (this.n * this.ts) / this.td) * this.derivadas[this.tiempo - 1] -
          this.k * this.n * (this.temperaturaSalida - this.salidaSistema[this.tiempo - 1]);
        // cambiando el voltaje
        this.voltajeInterno = this.controlProporcional + this.integral + this.derivada;
        this.insercionDatos();
        this.redondeoDatos();
        this.tiempo++;
        this.apagadoAutomatico();
        this.revisarMP();
      }
    }, this.ts * this.tiempoAlentamiento);
  }

  private redondeoDatos(): void {
    this.temperaturaRedondeo = this.redondeo2Cifras(this.temperaturaSalida);
    this.voltajeRedondeo = this.redondeo2Cifras(this.voltajeInterno);
    this.errorRedondeo = this.redondeo2Cifras(this.error);
  }

  private apagadoAutomatico(): void {
    if (this.tiempo === this.maximoIteraciones) {
      this.apagar();
    }
    return;
  }

  private redondeo2Cifras(numero: number): number {
    return Math.round((numero + Number.EPSILON) * 100) / 100;
  }

  private interrumpir(): void {
    if (this.numberInterrupcion === this.tiempo || this.interrump) {
      this.temperaturaSalida = this.temperaturaSalida + this.tempAmbiental;
      this.interrump = false;
    }
  }

  public interrumpirTemp(): void {
    this.interrump = true;
  }

  private revisarMP(): void {
    const valorActual = this.salidaSistema[this.tiempo - 1];
    const valorAnterior = this.salidaSistema[this.tiempo - 2];
    const maximoAlcanzado = this.mp.valueOf();
    if (valorActual > valorAnterior && valorActual > maximoAlcanzado) {
      this.mp = this.redondeo2Cifras(valorActual);
    }
  }

  private calcularPo(): void {
    this.vf = this.salidaSistema[this.tiempo - 1];
    this.vf = this.redondeo2Cifras(this.vf);
    this.po = (this.mp - this.vf) / this.vf;
    this.po = this.redondeo2Cifras(this.po);
  }

  private calcularTSS(): void {
    const vfMayor = this.vf + this.vf * 0.02;
    const vfMenor = this.vf - this.vf * 0.02;
    let distancia = 0;
    this.datosDisipacion = this.datosDisipacion.reverse();
    this.datosDisipacion.forEach(element => {
      if (element.y > vfMenor && vfMayor > element.y && distancia < 20) {
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
    this.essRedondeo = this.redondeo2Cifras(this.ess);
  }

}
