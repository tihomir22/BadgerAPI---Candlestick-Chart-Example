import { BehaviorSubject, forkJoin, timer } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { historicWrapper } from "../interfaces/historicWrapper";
import { historicRegistry } from "../interfaces/historicRegistry";

export class ComunicadorSubject {
  private historicSubject = new BehaviorSubject<historicWrapper>(undefined);

  private historicRegistrySubject = new BehaviorSubject<historicRegistry>(
    undefined
  );

  private errorSubject = new BehaviorSubject<any>(undefined);

  cryptoActivo: any;
  counterActivo: any;
  historicData$ = this.historicSubject.asObservable();
  historicRegistryData$ = this.historicRegistrySubject.asObservable();
  errorData$ = this.errorSubject.asObservable();

  // Almacenar mensaje, listo para mostrarlo a quién lo pida.
  enviarHistoricos(mensaje: historicWrapper) {
    this.historicSubject.next(mensaje);
  }

  enviarUltimoPrecio(mensaje: historicRegistry) {
    this.historicRegistrySubject.next(mensaje);
  }

  asignarNuevoCryptoActivo(crypto: string) {
    this.cryptoActivo = crypto;
  }

  asignarNuevoCounterActivo(counter: string) {
    this.counterActivo = counter;
  }
  enviarError(error: any) {
    this.errorSubject.next(error);
  }

  constructor(private http: HttpClient) {
    this.recibirDatosHistoricos();
  }

  public recibirDatosHistoricos() {
    let ob = this.http.get("https://koordinator1488.herokuapp.com/");
    let ob2 = this.http.get("https://metacortex.herokuapp.com/data/");
    forkJoin(ob, ob2).subscribe(data => {
      console.log("TODOS DESPIERTOS!");
      this.http
        .get(
          "https://metacortex.herokuapp.com/data/historic?base=" +
            this.cryptoActivo +
            "&counter=" +
            this.counterActivo +
            "&historicInterval=1m"
        )
        .subscribe(
          (data: any) => {
            this.enviarHistoricos(data);
          },
          error => {
            this.enviarError(error);
          }
        );
    });
  }
}
