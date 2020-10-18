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
  maximoIteraciones = 500;

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
  referencia2 = 1;
  intervalDisipacion = null;
  temperaturaDisipacion = 0;
  datosDisipacion = [];
  graficaDisipacion: any;
  temperaturaRedondeo = 0;
  pausadoDisipasion = true;
  apagadoDisipasion = true;

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

  private temperaturaMinima(temperatura: number): number {
    if (temperatura <= 0) {
      return 0;
    }
    return temperatura;
  }

  private insercionDatosBasico(): void {
    this.datosBasico.push(new DataChart(this.tiempo1, this.temperaturaBasico));
    this.resultados.push(this.temperaturaBasico);
    this.graficaBasica.update();
  }

  private insercionDatosDisipacion(): void {
    this.temperaturaRedondeo = Math.round(this.temperaturaDisipacion);
    this.salidaSistema.push(this.temperaturaDisipacion);
    this.u.push(this.voltaje);
    this.datosDisipacion.push(new DataChart(this.tiempo2, this.temperaturaDisipacion));
    this.graficaDisipacion.update();
  }

  public apagarBasico(): void {
    clearInterval(this.intervalBasico);
    this.pausadoBasico = false;
    this.intervalBasico = null;
    this.apagadoBasico = false;
    return;
  }

  public apagarDisipacion(): void {
    clearInterval(this.intervalDisipacion);
    this.pausadoDisipasion = false;
    this.intervalDisipacion = null;
    this.apagadoDisipasion = false;
    return;
  }

  public pausarBasico(): void {
    this.pausadoBasico = !this.pausadoBasico;
  }

  public pausarDisipacion(): void {
    this.pausadoDisipasion = !this.pausadoDisipasion;
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
        if (this.tiempo1 === this.maximoIteraciones) {
          this.apagarBasico();
        }
      }
    }, this.ts * this.tiempoAlentamiento);
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
        if (this.tiempo2 === this.maximoIteraciones) {
          this.apagarDisipacion();
        }
      }
    }, this.ts * this.tiempoAlentamiento);
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

  public descargarArchivoSinDisipacion(): void {
    this.crearDocumentoExcel(this.datosBasico, '-sin-disipacion');
  }

  public descargarArchivoConDisipacion(): void {
    this.crearDocumentoExcel(this.datosDisipacion, '-con-disipacion');
  }

}

