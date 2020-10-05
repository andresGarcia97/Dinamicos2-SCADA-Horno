import { Component } from '@angular/core';

class Formula {
  tiempo: number;
  resultado: number;
  constructor(tiempo = 0, resultado = 0) {
    this.tiempo = tiempo;
    this.resultado = resultado;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'hornoDinamicos2';
  resultado = 0;
  tiempo = 0;
  imprimir: Formula = new Formula();
  resultados: Formula[] = [];

  // valor inicial  = 0
  T(i: number): number {
    return 0;
  }
  // entrada escalon
  V(i: number): number {
    return 1;
  }

  basico(size = 1): void {
    this.resultados = [];
    size = 20;
    let interval = null;
    // tiempo de muestreo
    let ts = 0.1;
    let i = 0;
    this.imprimir = new Formula(i, this.V(i) * ts * i + this.T(i));
    this.resultados.push(this.imprimir);
    i = 1;
    interval = setInterval(() => {
      this.imprimir = new Formula(i, this.V(i) * ts * i + this.T(i));
      // paso de milisegundos a segundos
      this.imprimir.resultado = Math.round(this.imprimir.resultado / ts);
      this.resultados.push(this.imprimir);
      i++;
      if (i === size + 1) {
        clearInterval(interval);
      }
    }, ts * 1000);
  }
}

