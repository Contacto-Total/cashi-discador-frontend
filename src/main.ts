import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { dispositivoRechazado, pintarDispositivoNoPermitido } from './app/core/dispositivo';

// Solo computadoras y laptops, salvo los usuarios con permiso para celular. Quién
// es se sabe recién en el login, así que la aplicación carga y decide el servidor;
// si ya rechazó este equipo en esta pestaña, se muestra el aviso.
if (!dispositivoRechazado()) {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
} else {
  pintarDispositivoNoPermitido();
}
