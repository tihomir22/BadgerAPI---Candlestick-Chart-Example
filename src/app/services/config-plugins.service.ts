import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ConfigPluginsService {
  constructor() {}

  public returnZoomPluginConfig(): any {
    return {
      // Container for pan options
      pan: {
        // Boolean to enable panning
        enabled: false,

        // Panning directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow panning in the y direction
        mode: "xy"
      },

      // Container for zoom options
      zoom: {
        // Boolean to enable zooming
        enabled: true,

        // Zooming directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow zooming in the y direction
        mode: "xy"
      }
    };
  }

  public returnCrosshairConfig(): any {
    return {
      line: {
        color: "#F66", // crosshair line color
        width: 1 // crosshair line width
      },
      sync: {
        enabled: true, // enable trace line syncing with other charts
        group: 1, // chart group
        suppressTooltips: false // suppress tooltips when showing a synced tracer
      },
      zoom: {
        enabled: true, // enable zooming
        zoomboxBackgroundColor: "rgba(66,133,244,0.2)", // background color of zoom box
        zoomboxBorderColor: "#48F", // border color of zoom box
        zoomButtonText: "Reset Zoom", // reset zoom button text
        zoomButtonClass: "btn btn-primary arriba" // reset zoom button class
          
      },
      callbacks: {
        beforeZoom: function(start, end) {
          // called before zoom, return false to prevent zoom
          return true;
        },
        afterZoom: function(start, end) {
          console.log("debemos permitir reiniciar el zoom");
        }
      }
    };
  }
}
