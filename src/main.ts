import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { esDispositivoPermitido, pintarDispositivoNoPermitido } from './app/core/dispositivo';

// Solo computadoras y laptops: en un celular o una tablet Cashi ni siquiera carga.
if (esDispositivoPermitido()) {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
} else {
  pintarDispositivoNoPermitido();
}
