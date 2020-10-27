import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { DataChart } from './clases';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // variables globales
  voltaje = 1;
  ts = 1;
  tiempoAlentamiento = 10;
  referencia = 100;
  maximoIteraciones = 1000;
  k = 1;

  // variables primer ejercicio, sin disipacion
  tituloGraficaBasica = 'grafica1';
  tiempo1 = 0;
  temperaturaBasico = 0;
  graficaBasica: any;
  resultados = [];
  datosBasico = [];
  intervalBasico = null;
  pausadoBasico = true;
  apagadoBasico = true;

  // variables segundo ejercicio, con disipacion
  titulograficaDisipacion = 'grafica2';
  numDisipacion = 1.1;
  num1 = this.numDisipacion * 0.008594;
  num2 = this.numDisipacion * 0.008548;
  den1 = 1.984;
  den2 = -0.9841;
  salidaSistema = [0, 0, 0, 0];
  u = [this.voltaje, this.voltaje, this.voltaje, this.voltaje];
  tiempo2 = 0;
  intervalDisipacion = null;
  temperaturaDisipacion = 0;
  datosDisipacion = [];
  graficaDisipacion: any;
  temperaturaRedondeo = 0;
  pausadoDisipasion = true;
  apagadoDisipasion = true;

  // variables horno basico con controlP
  tituloGraficaBasicaControl = 'grafica3';
  tiempo3 = 0;
  kControl = 10;
  temperaturaBasicoControl = 0;
  voltajeInternoControl = this.voltaje.valueOf();
  graficaBasicaControl: any;
  resultadosControl = [];
  datosBasicoControl = [];
  datosReferenciaBasicoControl = [];
  intervalBasicoControl = null;
  pausadoBasicoControl = true;
  apagadoBasicoControl = true;

  // variables segundo ejercicio, con disipacion y controlP
  titulograficaDisipacionControl = 'grafica4';
  numDisipacionControl = 1.1;
  num1Control = this.numDisipacion * 0.008594;
  num2Control = this.numDisipacion * 0.008548;
  den1Control = 1.984;
  den2Control = -0.9841;
  salidaSistemaControl = [0, 0, 0, 0];
  voltajeInternoDisipacion = this.voltaje.valueOf();
  uControl = [this.voltajeInternoDisipacion, this.voltajeInternoDisipacion, this.voltajeInternoDisipacion, this.voltajeInternoDisipacion];
  tiempo4 = 0;
  kDisipacion = 10;
  intervalDisipacionControl = null;
  temperaturaDisipacionControl = 0;
  datosDisipacionControl = [];
  datosReferenciaDisipacionControl = [];
  graficaDisipacionControl: any;
  temperaturaRedondeoControl = 0;
  pausadoDisipasionControl = true;
  apagadoDisipasionControl = true;

  // variables horno basico con controlP e indicadores
  tituloGraficaBasicaControlIndicadores = 'grafica5';
  tiempo5 = 0;
  kControlIndicadores = 10;
  temperaturaBasicoControlIndicadores = 0;
  voltajeInternoControlIndicadores = this.voltaje.valueOf();
  graficaBasicaControlIndicadores: any;
  resultadosControlIndicadores = [];
  datosBasicoControlIndicadores = [];
  datosReferenciaBasicoControlIndicadores = [];
  intervalBasicoControlIndicadores = null;
  pausadoBasicoControlIndicadores = true;
  apagadoBasicoControlIndicadores = true;
  errorBasicoControlIndicadores = 0;

  // variables horno con disipacion y controlP e indicadores
  titulograficaDisipacionControlIndicadores = 'grafica6';
  numDisipacionControlIndicadores = 1.1;
  num1ControlIndicadores = this.numDisipacionControlIndicadores * 0.008594;
  num2ControlIndicadores = this.numDisipacionControlIndicadores * 0.008548;
  den1ControlIndicadores = 1.984;
  den2ControlIndicadores = -0.9841;
  salidaSistemaControlIndicadores = [0, 0, 0, 0];
  voltajeInternoDisipacionIndicadores = this.voltaje.valueOf();
  uControlIndicadores = [this.voltajeInternoDisipacionIndicadores, this.voltajeInternoDisipacionIndicadores,
  this.voltajeInternoDisipacionIndicadores, this.voltajeInternoDisipacionIndicadores];
  tiempo6 = 0;
  kDisipacionIndicadores = 10;
  intervalDisipacionControlIndicadores = null;
  temperaturaDisipacionControlIndicadores = 0;
  datosDisipacionControlIndicadores = [];
  datosReferenciaDisipacionControlIndicadores = [];
  graficaDisipacionControlIndicadores: any;
  temperaturaRedondeoControlIndicadores = 0;
  pausadoDisipasionControlIndicadores = true;
  apagadoDisipasionControlIndicadores = true;
  errorDisipacionControlIndicadores = 0;

  // funciones horno basico

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
          label: 'Temperatura sin Disipación',
          showLine: true,
          backgroundColor: 'rgba(56, 111, 164, 0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosBasico,
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
    this.datosBasico.push(new DataChart(this.tiempo1, this.temperaturaBasico));
    this.resultados.push(this.temperaturaBasico);
    this.graficaBasica.update();
  }
  public apagarBasico(): void {
    clearInterval(this.intervalBasico);
    this.pausadoBasico = false;
    this.intervalBasico = null;
    this.apagadoBasico = false;
    return;
  }
  public pausarBasico(): void {
    this.pausadoBasico = !this.pausadoBasico;
  }
  public hornoBasico(): void {
    this.apagadoBasico = true;
    this.pausadoBasico = true;
    this.datosBasico = [];
    this.resultados = [];
    this.graficarBasica();
    this.temperaturaBasico = 0;
    this.tiempo1 = 0;
    this.temperaturaBasico = this.V(this.voltaje) * this.ts * 0 + this.T(0);
    this.resultados.push(this.temperaturaBasico);
    this.insercionDatosBasico();
    this.tiempo1 = 1;
    this.intervalBasico = setInterval(() => {
      if (this.pausadoBasico) {
        // formula
        this.temperaturaBasico = this.V(this.voltaje) * this.ts + this.T(this.resultados[this.tiempo1 - 1]);
        this.insercionDatosBasico();
        this.tiempo1++;
        if (this.temperaturaBasico === this.referencia || this.tiempo1 === this.maximoIteraciones) {
          this.apagarBasico();
        }
      }
    }, this.ts * this.tiempoAlentamiento);
  }
  public descargarArchivoSinDisipacion(): void {
    this.crearDocumentoExcel(this.datosBasico, '-sin-disipacion');
  }

  // funciones horno con disipacion

  private graficarDisipacion(): void {
    this.graficaDisipacion = new Chart(this.titulograficaDisipacion, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura con Disipación',
          showLine: true,
          backgroundColor: 'rgb(255,69,0,0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosDisipacion,
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
  private insercionDatosDisipacion(): void {
    this.salidaSistema.push(this.temperaturaDisipacion);
    this.u.push(this.voltaje);
    this.datosDisipacion.push(new DataChart(this.tiempo2, this.temperaturaDisipacion));
    this.graficaDisipacion.update();
  }
  public apagarDisipacion(): void {
    clearInterval(this.intervalDisipacion);
    this.pausadoDisipasion = false;
    this.intervalDisipacion = null;
    this.apagadoDisipasion = false;
    return;
  }
  public pausarDisipacion(): void {
    this.pausadoDisipasion = !this.pausadoDisipasion;
  }
  public hornoDisipacion(): void {
    this.pausadoDisipasion = true;
    this.apagadoDisipasion = true;
    this.salidaSistema = [0, 0, 0, 0];
    this.u = [this.voltaje, this.voltaje, this.voltaje, this.voltaje];
    this.datosDisipacion = [];
    this.tiempo2 = 4;
    this.datosDisipacion.push(new DataChart(this.tiempo2 - 4, this.salidaSistema[this.tiempo2 - 4]));
    this.datosDisipacion.push(new DataChart(this.tiempo2 - 3, this.salidaSistema[this.tiempo2 - 3]));
    this.datosDisipacion.push(new DataChart(this.tiempo2 - 2, this.salidaSistema[this.tiempo2 - 2]));
    this.datosDisipacion.push(new DataChart(this.tiempo2 - 1, this.salidaSistema[this.tiempo2 - 1]));
    this.graficarDisipacion();
    this.intervalDisipacion = setInterval(() => {
      if (this.pausadoDisipasion) {
        // formula
        this.temperaturaDisipacion = this.num1 * this.u[this.tiempo2 - 1] + this.num2 * this.u[this.tiempo2 - 2] +
          this.den1 * this.salidaSistema[this.tiempo2 - 1] + this.den2 * this.salidaSistema[this.tiempo2 - 2];
        this.insercionDatosDisipacion();
        this.tiempo2++;
        this.temperaturaRedondeo = Math.round(this.temperaturaDisipacion);
        if (this.temperaturaRedondeo === this.referencia || this.tiempo2 === this.maximoIteraciones) {
          this.apagarDisipacion();
        }
      }
    }, this.ts * this.tiempoAlentamiento);
  }
  public descargarArchivoConDisipacion(): void {
    this.crearDocumentoExcel(this.datosDisipacion, '-con-disipacion');
  }

  // funcion horno basica con control

  private graficarBasicaControl(): void {
    this.graficaBasicaControl = new Chart(this.tituloGraficaBasicaControl, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Temperatura sin Disipación y control',
            showLine: true,
            backgroundColor: 'rgba(48, 107, 52, 0.6)',
            pointBorderColor: 'rgba(0, 0, 0)',
            pointBackgroundColor: 'rgba(255, 255, 255)',
            borderColor: 'rgba(0, 0, 0)',
            data: this.datosBasicoControl,
          },
          {
            label: 'Referencia',
            showLine: false,
            pointBorderColor: 'rgba(0, 0, 0)',
            pointBackgroundColor: 'rgba(255, 255, 255)',
            borderColor: 'rgba(0, 0, 0)',
            data: this.datosReferenciaBasicoControl,
          }
        ],
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
  private insercionDatosBasicoControl(): void {
    this.datosReferenciaBasicoControl.push(new DataChart(this.tiempo3, this.referencia));
    this.datosBasicoControl.push(new DataChart(this.tiempo3, this.temperaturaBasicoControl));
    this.resultadosControl.push(this.temperaturaBasicoControl);
    this.graficaBasicaControl.update();
  }
  public apagarBasicoControl(): void {
    clearInterval(this.intervalBasicoControl);
    this.pausadoBasicoControl = false;
    this.intervalBasicoControl = null;
    this.apagadoBasicoControl = false;
    return;
  }
  public pausarBasicoControl(): void {
    this.pausadoBasicoControl = !this.pausadoBasicoControl;
  }
  public hornoBasicoConControl(): void {
    this.voltajeInternoControl = this.voltaje;
    this.apagadoBasicoControl = true;
    this.pausadoBasicoControl = true;
    this.datosBasicoControl = [];
    this.datosReferenciaBasicoControl = [];
    this.resultadosControl = [];
    this.graficarBasicaControl();
    this.temperaturaBasicoControl = 0;
    this.tiempo3 = 0;
    this.temperaturaBasicoControl = this.V(this.voltajeInternoControl) * this.ts * 0 + this.T(0);
    this.resultadosControl.push(this.temperaturaBasicoControl);
    this.insercionDatosBasicoControl();
    this.tiempo3 = 1;
    this.intervalBasicoControl = setInterval(() => {
      if (this.pausadoBasicoControl) {
        // formula
        this.temperaturaBasicoControl = this.V(this.voltajeInternoControl) * this.ts + this.T(this.resultadosControl[this.tiempo3 - 1]);
        this.insercionDatosBasicoControl();
        this.tiempo3++;
        this.validarReferennciaBasicoControl();
      }
    }, this.ts * this.tiempoAlentamiento);
  }
  private validarReferennciaBasicoControl(): void {
    if (this.temperaturaBasicoControl > this.referencia) {
      this.voltajeInternoControl = this.voltajeInternoControl - this.kControl;
    }
    else if (this.temperaturaBasicoControl < this.referencia) {
      this.voltajeInternoControl = this.voltajeInternoControl + this.kControl;
    }
    else if (this.temperaturaBasicoControl === this.referencia || this.tiempo3 === this.maximoIteraciones) {
      this.apagarBasicoControl();
    }
    return;
  }
  public descargarArchivoSinDisipacionControl(): void {
    this.crearDocumentoExcel(this.datosBasicoControl, '-sin-disipacion-controlP');
  }

  // funciones horno con disipacion y control

  private graficarDisipacionControl(): void {
    this.graficaDisipacionControl = new Chart(this.titulograficaDisipacionControl, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura con Disipación y Control',
          showLine: true,
          backgroundColor: 'rgb(255, 252, 49,0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosDisipacionControl,
        },
        {
          label: 'Referencia',
          showLine: false,
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosReferenciaDisipacionControl,
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
  private insercionDatosDisipacionControl(): void {
    this.datosReferenciaDisipacionControl.push(new DataChart(this.tiempo4, this.referencia));
    this.salidaSistemaControl.push(this.temperaturaDisipacionControl);
    this.uControl.push(this.voltajeInternoDisipacion);
    this.datosDisipacionControl.push(new DataChart(this.tiempo4, this.temperaturaDisipacionControl));
    this.graficaDisipacionControl.update();
  }
  public apagarDisipacionControl(): void {
    clearInterval(this.intervalDisipacionControl);
    this.pausadoDisipasionControl = false;
    this.intervalDisipacionControl = null;
    this.apagadoDisipasionControl = false;
    return;
  }
  public pausarDisipacionControl(): void {
    this.pausadoDisipasionControl = !this.pausadoDisipasionControl;
  }
  public hornoDisipacionControl(): void {
    this.pausadoDisipasionControl = true;
    this.apagadoDisipasionControl = true;
    this.voltajeInternoDisipacion = this.voltaje;
    this.salidaSistemaControl = [0, 0, 0, 0];
    this.uControl = [this.voltajeInternoDisipacion, this.voltajeInternoDisipacion,
    this.voltajeInternoDisipacion, this.voltajeInternoDisipacion];
    this.datosDisipacionControl = [];
    this.datosReferenciaDisipacionControl = [];
    this.tiempo4 = 4;
    this.datosReferenciaDisipacionControl.push(new DataChart(this.tiempo4 - 4, this.referencia));
    this.datosReferenciaDisipacionControl.push(new DataChart(this.tiempo4 - 3, this.referencia));
    this.datosReferenciaDisipacionControl.push(new DataChart(this.tiempo4 - 2, this.referencia));
    this.datosReferenciaDisipacionControl.push(new DataChart(this.tiempo4 - 1, this.referencia));
    this.datosDisipacionControl.push(new DataChart(this.tiempo4 - 4, this.salidaSistemaControl[this.tiempo4 - 4]));
    this.datosDisipacionControl.push(new DataChart(this.tiempo4 - 3, this.salidaSistemaControl[this.tiempo4 - 3]));
    this.datosDisipacionControl.push(new DataChart(this.tiempo4 - 2, this.salidaSistemaControl[this.tiempo4 - 2]));
    this.datosDisipacionControl.push(new DataChart(this.tiempo4 - 1, this.salidaSistemaControl[this.tiempo4 - 1]));
    this.graficarDisipacionControl();
    this.intervalDisipacionControl = setInterval(() => {
      if (this.pausadoDisipasionControl) {
        // formula
        this.temperaturaDisipacionControl = this.num1Control * this.uControl[this.tiempo4 - 1]
          + this.num2Control * this.uControl[this.tiempo4 - 2] +
          this.den1Control * this.salidaSistemaControl[this.tiempo4 - 1] + this.den2Control * this.salidaSistemaControl[this.tiempo4 - 2];
        this.insercionDatosDisipacionControl();
        this.tiempo4++;
        this.temperaturaRedondeoControl = Math.round(this.temperaturaDisipacionControl);
        this.validarReferennciaDisipacionControl();
      }
    }, this.ts * this.tiempoAlentamiento);
  }
  private validarReferennciaDisipacionControl(): void {
    if (this.temperaturaRedondeoControl > this.referencia) {
      this.voltajeInternoDisipacion = -1;
    }
    if (this.temperaturaRedondeoControl < this.referencia && this.tiempo4 % 10 === 0) {
      if (this.voltajeInternoDisipacion <= 0) {
        this.voltajeInternoDisipacion = 1;
      }
      this.voltajeInternoDisipacion++;
    }
    else if (this.temperaturaRedondeoControl === this.referencia || this.tiempo4 === this.maximoIteraciones) {
      this.apagarDisipacionControl();
    }
    return;
  }
  public descargarArchivoConDisipacionControl(): void {
    this.crearDocumentoExcel(this.datosDisipacionControl, '-con-disipacion-control');
  }

  // funciones horno basico con control e indicaciones

  private graficarBasicaControlIndicadores(): void {
    this.graficaBasicaControlIndicadores = new Chart(this.tituloGraficaBasicaControlIndicadores, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Temperatura sin Disipación, control, indicadores',
            showLine: true,
            backgroundColor: 'rgba(36, 16, 35, 0.6)',
            pointBorderColor: 'rgba(0, 0, 0)',
            pointBackgroundColor: 'rgba(255, 255, 255)',
            borderColor: 'rgba(0, 0, 0)',
            data: this.datosBasicoControlIndicadores,
          },
          {
            label: 'Referencia',
            showLine: false,
            pointBorderColor: 'rgba(0, 0, 0)',
            pointBackgroundColor: 'rgba(255, 255, 255)',
            borderColor: 'rgba(0, 0, 0)',
            data: this.datosReferenciaBasicoControlIndicadores,
          }
        ],
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

  private insercionDatosBasicoControlIndicadores(): void {
    this.datosReferenciaBasicoControlIndicadores.push(new DataChart(this.tiempo5, this.referencia));
    this.datosBasicoControlIndicadores.push(new DataChart(this.tiempo5, this.temperaturaBasicoControlIndicadores));
    this.resultadosControlIndicadores.push(this.temperaturaBasicoControlIndicadores);
    this.graficaBasicaControlIndicadores.update();
  }

  public apagarBasicoControlIndicadores(): void {
    clearInterval(this.intervalBasicoControlIndicadores);
    this.pausadoBasicoControlIndicadores = false;
    this.intervalBasicoControlIndicadores = null;
    this.apagadoBasicoControlIndicadores = false;
    return;
  }

  public pausarBasicoControlIndicadores(): void {
    this.pausadoBasicoControlIndicadores = !this.pausadoBasicoControlIndicadores;
  }

  public hornoBasicoConControlIndicadores(): void {
    this.voltajeInternoControlIndicadores = this.voltaje;
    this.apagadoBasicoControlIndicadores = true;
    this.pausadoBasicoControlIndicadores = true;
    this.datosBasicoControlIndicadores = [];
    this.datosReferenciaBasicoControlIndicadores = [];
    this.resultadosControlIndicadores = [];
    this.graficarBasicaControlIndicadores();
    this.temperaturaBasicoControlIndicadores = 0;
    this.tiempo5 = 0;
    this.errorBasicoControlIndicadores = 0;
    this.temperaturaBasicoControlIndicadores = this.V(this.voltajeInternoControlIndicadores) * this.ts * 0 + this.T(0);
    this.resultadosControlIndicadores.push(this.temperaturaBasicoControlIndicadores);
    this.insercionDatosBasicoControlIndicadores();
    this.tiempo5 = 1;
    this.intervalBasicoControlIndicadores = setInterval(() => {
      if (this.pausadoBasicoControlIndicadores) {
        // formula
        this.temperaturaBasicoControlIndicadores = this.V(this.voltajeInternoControlIndicadores) * this.ts +
          this.T(this.resultadosControlIndicadores[this.tiempo5 - 1]);
        this.insercionDatosBasicoControlIndicadores();
        this.temperaturaBasicoControlIndicadores = Math.round(this.temperaturaBasicoControlIndicadores);
        this.tiempo5++;
        this.validarReferennciaBasicoControlIndicadores();
      }
    }, this.ts * this.tiempoAlentamiento);
  }

  private validarReferennciaBasicoControlIndicadores(): void {
    this.errorBasicoControlIndicadores = Math.abs(this.referencia - this.temperaturaBasicoControlIndicadores);
    if (this.temperaturaBasicoControlIndicadores > this.referencia) {
      this.voltajeInternoControlIndicadores = this.voltajeInternoControlIndicadores -
        this.k * this.errorBasicoControlIndicadores;
    }
    else if (this.temperaturaBasicoControlIndicadores < this.referencia) {
      this.voltajeInternoControlIndicadores = this.voltajeInternoControlIndicadores +
        this.k * this.errorBasicoControlIndicadores;
    }
    else if (this.temperaturaBasicoControlIndicadores === this.referencia || this.tiempo5 === this.maximoIteraciones) {
      this.apagarBasicoControlIndicadores();
    }
    return;
  }

  public descargarArchivoSinDisipacionControlIndicadores(): void {
    this.crearDocumentoExcel(this.datosBasicoControl, '-sin-disipacion-control-indicadores');
  }

  // funciones horno con disipacion, control e indicadores

  private graficarDisipacionControlIndicadores(): void {
    this.graficaDisipacionControlIndicadores = new Chart(this.titulograficaDisipacionControlIndicadores, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Temperatura con Disipación, Control, indicadores',
          showLine: true,
          backgroundColor: 'rgb(0, 168, 150,0.6)',
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosDisipacionControlIndicadores,
        },
        {
          label: 'Referencia',
          showLine: false,
          pointBorderColor: 'rgba(0, 0, 0)',
          pointBackgroundColor: 'rgba(255, 255, 255)',
          borderColor: 'rgba(0, 0, 0)',
          data: this.datosReferenciaDisipacionControlIndicadores,
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

  private insercionDatosDisipacionControlIndicadores(): void {
    this.datosReferenciaDisipacionControlIndicadores.push(new DataChart(this.tiempo6, this.referencia));
    this.salidaSistemaControlIndicadores.push(this.temperaturaDisipacionControlIndicadores);
    this.uControlIndicadores.push(this.voltajeInternoDisipacionIndicadores);
    this.datosDisipacionControlIndicadores.push(new DataChart(this.tiempo6, this.temperaturaDisipacionControlIndicadores));
    this.graficaDisipacionControlIndicadores.update();
  }

  public apagarDisipacionControlIndicadores(): void {
    clearInterval(this.intervalDisipacionControlIndicadores);
    this.pausadoDisipasionControlIndicadores = false;
    this.intervalDisipacionControlIndicadores = null;
    this.apagadoDisipasionControlIndicadores = false;
    return;
  }

  public pausarDisipacionControlIndicadores(): void {
    this.pausadoDisipasionControlIndicadores = !this.pausadoDisipasionControlIndicadores;
  }

  public hornoDisipacionControlIndicadores(): void {
    this.pausadoDisipasionControlIndicadores = true;
    this.apagadoDisipasionControlIndicadores = true;
    this.voltajeInternoDisipacionIndicadores = this.voltaje;
    this.salidaSistemaControlIndicadores = [0, 0, 0, 0];
    this.uControlIndicadores = [this.voltajeInternoDisipacionIndicadores, this.voltajeInternoDisipacionIndicadores,
    this.voltajeInternoDisipacionIndicadores, this.voltajeInternoDisipacionIndicadores];
    this.datosDisipacionControlIndicadores = [];
    this.datosReferenciaDisipacionControlIndicadores = [];
    this.tiempo6 = 4;
    this.errorDisipacionControlIndicadores = 0;
    this.datosReferenciaDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 4, this.referencia));
    this.datosReferenciaDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 3, this.referencia));
    this.datosReferenciaDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 2, this.referencia));
    this.datosReferenciaDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 1, this.referencia));
    this.datosDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 4, this.salidaSistemaControlIndicadores[this.tiempo6 - 4]));
    this.datosDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 3, this.salidaSistemaControlIndicadores[this.tiempo6 - 3]));
    this.datosDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 2, this.salidaSistemaControlIndicadores[this.tiempo6 - 2]));
    this.datosDisipacionControlIndicadores.push(new DataChart(this.tiempo6 - 1, this.salidaSistemaControlIndicadores[this.tiempo6 - 1]));
    this.graficarDisipacionControlIndicadores();
    this.intervalDisipacionControlIndicadores = setInterval(() => {
      if (this.pausadoDisipasionControlIndicadores) {
        // formula
        this.temperaturaDisipacionControlIndicadores = this.num1ControlIndicadores * this.uControlIndicadores[this.tiempo6 - 1]
          + this.num2ControlIndicadores * this.uControlIndicadores[this.tiempo6 - 2] +
          this.den1ControlIndicadores * this.salidaSistemaControlIndicadores[this.tiempo6 - 1] +
          this.den2ControlIndicadores * this.salidaSistemaControlIndicadores[this.tiempo6 - 2];
        this.insercionDatosDisipacionControlIndicadores();
        this.tiempo6++;
        this.temperaturaRedondeoControlIndicadores = Math.round(this.temperaturaDisipacionControlIndicadores);
        this.validarReferennciaDisipacionControlIndicadores();
      }
    }, this.ts * this.tiempoAlentamiento);
  }

  private validarReferennciaDisipacionControlIndicadores(): void {
    this.errorDisipacionControlIndicadores = Math.abs(this.referencia - this.temperaturaRedondeoControlIndicadores);
    if (this.temperaturaRedondeoControlIndicadores > this.referencia) {
      this.voltajeInternoDisipacionIndicadores = this.voltajeInternoDisipacionIndicadores * this.k * -1;
    }
    if (this.temperaturaRedondeoControlIndicadores < this.referencia) {
      this.voltajeInternoDisipacionIndicadores =
        this.k * Math.abs(this.errorDisipacionControlIndicadores);
    }
    else if (this.temperaturaRedondeoControlIndicadores === this.referencia || this.tiempo6 === this.maximoIteraciones) {
      this.apagarDisipacionControlIndicadores();
    }
    return;
  }

  public descargarArchivoConDisipacionControlIndicadores(): void {
    this.crearDocumentoExcel(this.datosDisipacionControl, '-con-disipacion-control-indicadores');
  }

  // funciones transversales

  private crearDocumentoExcel(datos: any[], nombre: string): void {
    const nombreHoja = 'Temp en el tiempo';
    const nombreArchivoExcel = 'resultados-horno'.concat(nombre);
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'Resultados',
      Subject: 'Dinamicos, Horno SCADA',
      Author: 'Andres Garcia',
      CreatedDate: new Date()
    };
    wb.SheetNames.push(nombreHoja);
    const wsData = [['tiempo', 'temperatura']];

    datos.forEach((data: { x: any; y: any; }) => {
      const tiempo = data.x;
      const temperatura = data.y;
      wsData.push([tiempo, temperatura]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    wb.Sheets[nombreHoja] = ws;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s): ArrayBuffer {
      const buf = new ArrayBuffer(s.length); // convert s to arrayBuffer
      const view = new Uint8Array(buf);  // create uint8array as viewer
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      } // convert to octet
      return buf;
    }
    // se descarga el archivo
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), nombreArchivoExcel.concat('.xlsx'));
  }

}
