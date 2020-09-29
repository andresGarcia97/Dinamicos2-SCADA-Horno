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

  T(i: number): number {
    return i;
  }
  V(i: number): number {
    return i;
  }

  basico(size = 1): void {
    size = 10;
    let interval = null;
    let ts = 0.1;
    this.imprimir = new Formula(0, this.T(0) + this.V(0));
    this.resultados.push(this.imprimir);
    let i = 1;
    interval = setInterval(() => {
      this.imprimir = new Formula(i, this.T(i) + this.V(1) * ts);
      this.resultados.push(this.imprimir);
      i++;
      if (i === size + 1) {
        clearInterval(interval);
      }
    }, 1000);
  }
}

