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
  tiempoAlentamiento = 100;
  referencia = 100;
  maximoIteraciones = 600;

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
        this.temperaturaBasico = this.temperaturaMinima(this.temperaturaBasico);
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
        this.temperaturaDisipacion = this.temperaturaMinima(this.temperaturaDisipacion);
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

  // funciones horno basico con control

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
        this.temperaturaBasicoControl = this.temperaturaMinima(this.temperaturaBasicoControl);
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
        // this.temperaturaDisipacionControl = this.temperaturaMinima(this.temperaturaDisipacionControl);
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

  // funciones transversales

  private temperaturaMinima(temperatura: number): number {
    if (temperatura <= 0) {
      return 0;
    }
    return temperatura;
  }

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
