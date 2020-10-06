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
  voltaje = 5;
  ts = 0.1;

  T(temperatura: number): number {
    return temperatura;
  }
  // entrada voltaje
  V(voltaje = 1): number {
    return voltaje;
  }

  basico(size = 1): void {
    this.resultados = [];
    size = 20;
    let interval = null;
    this.imprimir = new Formula(this.tiempo, this.V(this.voltaje) * this.ts * 0 + this.T(0));
    this.resultados.push(this.imprimir);
    this.tiempo = 1;
    interval = setInterval(() => {
      this.imprimir = new Formula(this.tiempo, this.V(this.voltaje) * this.ts + this.T(this.resultados[this.tiempo - 1].resultado));
      // paso de milisegundos a segundos
      this.resultados.push(this.imprimir);
      this.tiempo++;
      if (this.tiempo === size + 1) {
        clearInterval(interval);
        this.tiempo = 0;
      }
    }, this.ts * 1000);
  }
}

