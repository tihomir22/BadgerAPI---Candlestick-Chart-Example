import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartsModule } from "ng2-charts";
import { ComunicadorSubject } from "./services/comunicator-subject";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ListboxModule } from "primeng/listbox";
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ListboxModule
  ],
  entryComponents: [AppComponent],
  providers: [ComunicadorSubject],
  bootstrap: [AppComponent]
})
export class AppModule {}
