declare var require: any;
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { of, timer, interval } from "rxjs";
import { map } from "rxjs/operators";
import { ComunicadorSubject } from "src/app/services/comunicator-subject";
import { Chart, ChartDataSets, ChartOptions } from "chart.js";
import "../../chartjs-chart-financial";
import { BaseChartDirective, Label, Color } from "ng2-charts";
import { historicWrapper } from "src/app/interfaces/historicWrapper";
import { historicRegistry } from "src/app/interfaces/historicRegistry";
import * as ChartjsPluginZoom from "chartjs-plugin-zoom";
import * as ChartjsPluginCrosshair from "chartjs-plugin-crosshair";
import { ConfigPluginsService } from "src/app/services/config-plugins.service";
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public selectedCrypto: any = "ETH";
  public selectedCounter: any = "USDT";
  public mensajeAlerta: string = null;
  barCount = 60;
  initialDateStr = "01 Apr 2017 00:00 Z";

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  cities1: SelectItem[];
  selectedCity1: any;
  public dataAvalaible: boolean = false;

  public financialChartData = [
    {
      label: "CHRT - Chart.js Corporation",
      data: []
    }
  ];
  public financialChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: this.configPlugins.returnZoomPluginConfig(),
      crosshair: this.configPlugins.returnCrosshairConfig()
    },
    scales: {
      xAxes: [
        {
          display: false
        }
      ]
    }
  };
  public financialChartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,0,0,0.3)"
    }
  ];
  public financialChartLegend = false;
  public financialChartType = "candlestick";
  public financialChartPlugins = [ChartjsPluginZoom, ChartjsPluginCrosshair];

  constructor(
    private http: HttpClient,
    private comunicadorSubject: ComunicadorSubject,
    private configPlugins: ConfigPluginsService
  ) {
    this.comunicadorSubject.asignarNuevoCryptoActivo(this.selectedCrypto);
    this.comunicadorSubject.asignarNuevoCounterActivo(this.selectedCounter);

    document.getElementsByTagName("html")[0].addEventListener("keyup", () => {
      this.chart.chart.options.plugins.crosshair.zoom.enabled = false;
      this.chart.chart.options.plugins.zoom.pan.enabled = true;
      this.chart.update();
    });

    this.cities1 = [
      {label:'Select City', value:null},
      {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
      {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
      {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
      {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
      {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
  ];
  }

  ngOnInit() {
    this.comunicadorSubject.errorData$.subscribe(data => {
      if (data != undefined) {
        this.mensajeAlerta = data.error.message;
      }
    });
  }

  ngAfterViewInit() {
    this.realizarConexion();

    interval(60000).subscribe(data => {
      this.getUltimoPrecio();
    });
  }

  update() {
    // candlestick vs ohlc
    this.financialChartType =
      this.financialChartType === "candlestick" ? "ohlc" : "candlestick";
  }

  private realizarConexion() {
    this.dataAvalaible = false;
    this.comunicadorSubject.asignarNuevoCounterActivo(this.selectedCounter);
    this.comunicadorSubject.asignarNuevoCryptoActivo(this.selectedCrypto);
    let sub = timer(1000).subscribe(data => {
      if (this.comunicadorSubject.historicData$ != undefined) {
        this.comunicadorSubject.historicData$.subscribe(data => {
          if (data != undefined) {
            sub.unsubscribe();
            of(data)
              .pipe(map(historic => historic.rawHistoricData))
              .subscribe(data => {
                let resData = data.map(registrosData => {
                  return {
                    t: new Date(+registrosData.open_time),
                    o: registrosData.open,
                    h: registrosData.high,
                    l: registrosData.low,
                    c: registrosData.close
                  };
                });
                this.financialChartData[0].data = resData;
                this.dataAvalaible = true;
              });
          }
        });
      }
    });
  }

  public resetZoom() {
    //this.chart.chart.reset();
  }

  private getUltimoPrecio() {
    this.http
      .get(
        "https://metacortex.herokuapp.com/data/historic?base=BTC&counter=USDT&historicInterval=1m"
      )
      .subscribe((data: historicWrapper) => {
        let hist: historicRegistry =
          data.rawHistoricData[data.rawHistoricData.length - 1];
        this.financialChartData[0].data.push(hist);
        this.chart.update();
        this.comunicadorSubject.enviarUltimoPrecio(hist);
      });
  }

  public onChangeSelect(event: any, type: number) {
    this.mensajeAlerta = null;
    type == 0 ? (this.selectedCrypto = event) : (this.selectedCounter = event);
    this.comunicadorSubject.asignarNuevoCryptoActivo(this.selectedCrypto);
    this.comunicadorSubject.asignarNuevoCounterActivo(this.selectedCounter);
    this.comunicadorSubject.recibirDatosHistoricos();
    this.comunicadorSubject.historicData$.subscribe(data => {
      of(data)
        .pipe(map(historic => historic.rawHistoricData))
        .subscribe(data => {
          let resData = data.map(registrosData => {
            return {
              t: new Date(+registrosData.open_time),
              o: registrosData.open,
              h: registrosData.high,
              l: registrosData.low,
              c: registrosData.close
            };
          });
          this.financialChartData[0].data = resData;
          this.chart.update();
        });
    });
  }
}
