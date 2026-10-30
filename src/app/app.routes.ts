import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rrhhGuard } from './features/asistencia/asistencia.guards';
import { adminGuard } from './core/guards/admin.guard';
import { menuAccesoGuard } from './core/guards/menu-acceso.guard';
import { gestionPendienteGuard } from './core/guards/gestion-pendiente.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
//  {
//    path: 'dialer',
//    loadComponent: () => import('./features/dialer/dialer-main/dialer-main.component').then(m => m.DialerMainComponent),
//    canActivate: [authGuard, menuAccesoGuard]
//  },
  {
    path: 'admin/monitoring',
    loadComponent: () => import('./features/admin/admin-monitoring/admin-monitoring.component').then(m => m.AdminMonitoringComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/supervision/:callUuid',
    loadComponent: () => import('./features/admin/admin-call-supervision/admin-call-supervision').then(m => m.AdminCallSupervision),
    canActivate: [authGuard, menuAccesoGuard],
    data: { acceso: '/admin/monitoring' }
  },
  {
    path: 'admin/campaigns/new',
    loadComponent: () => import('./features/admin/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/campaigns/generation',
    loadComponent: () => import('./features/legacy/campaign/pages/campaign-page/campaign-page.component').then(m => m.CampaignPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/campaigns/grupos',
    loadComponent: () => import('./features/admin/grupos-campana/grupos-campana.component').then(m => m.GruposCampanaComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/campaigns/:id/edit',
    loadComponent: () => import('./features/admin/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/campaigns/:id',
    loadComponent: () => import('./features/admin/campaign-detail/campaign-detail.component').then(m => m.CampaignDetailComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/campaigns',
    loadComponent: () => import('./features/admin/campaign-management/campaign-management.component').then(m => m.CampaignManagementComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/campaign-monitoring',
    loadComponent: () => import('./features/admin/campaign-monitoring/campaign-monitoring.component').then(m => m.CampaignMonitoringComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/system-health',
    loadComponent: () => import('./features/admin/system-health/system-health.component').then(m => m.SystemHealthComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/system-monitoring',
    loadComponent: () => import('./features/admin/system-monitoring/system-monitoring.component').then(m => m.SystemMonitoringComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // REPORTES LEGACY
  // ========================================
  {
    path: 'reports/contact',
    loadComponent: () => import('./features/legacy/reports/pages/contact-report/contact-report.component').then(m => m.ContactReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/ranking',
    loadComponent: () => import('./features/legacy/reports/pages/ranking-report/ranking-report.component').then(m => m.RankingReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/speech',
    loadComponent: () => import('./features/legacy/reports/pages/speech-report/speech-report.component').then(m => m.SpeechReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/monitoring',
    loadComponent: () => import('./features/legacy/reports/pages/monitoring-report/monitoring-report.component').then(m => m.MonitoringReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/powerbi',
    loadComponent: () => import('./features/legacy/reports/pages/powerbi-report/powerbi-report.component').then(m => m.PowerbiReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/cartera-propia',
    loadComponent: () => import('./features/legacy/reports/pages/cartera-propia-report/cartera-propia-report.component').then(m => m.CarteraPropiaReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/conciliacion-pagos',
    loadComponent: () => import('./pagos-bancarios/pages/conciliacion-report/conciliacion-report.component').then(m => m.ConciliacionReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/continuidad',
    loadComponent: () => import('./features/reports/continuidad-report/continuidad-report.component').then(m => m.ContinuidadReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/excepciones',
    loadComponent: () => import('./features/reports/excepciones-report/excepciones-report.component').then(m => m.ExcepcionesReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/gestiones',
    loadComponent: () => import('./features/reports/gestiones-report/gestiones-report.component').then(m => m.GestionesReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/compromisos',
    loadComponent: () => import('./features/reports/compromisos-report/compromisos-report.component').then(m => m.CompromisosReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/historial-llamadas',
    loadComponent: () => import('./features/reports/historial-llamadas-report/historial-llamadas-report.component').then(m => m.HistorialLlamadasReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    // Cada asesor ve su propia jornada. Sin guard de supervisor: el backend acota por
    // el usuario del token, no por parametro.
    path: 'mis-tiempos',
    loadComponent: () => import('./features/mis-tiempos/mis-tiempos.component').then(m => m.MisTiemposComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/estado-agentes',
    loadComponent: () => import('./features/reports/estado-agentes-report/estado-agentes-report.component').then(m => m.EstadoAgentesReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/produccion/historico',
    loadComponent: () => import('./features/reports/produccion-report/produccion-metas-historico.component').then(m => m.ProduccionMetasHistoricoComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/produccion',
    loadComponent: () => import('./features/reports/produccion-report/produccion-report.component').then(m => m.ProduccionReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'reports/entregables',
    loadComponent: () => import('./features/reports/entregables-report/entregables-report.component').then(m => m.EntregablesReportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // SMS
  // ========================================
  {
    path: 'sms/combos',
    loadComponent: () => import('./features/sms-tenores/tenores-lista.component').then(m => m.TenoresListaComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'sms/tenores/nuevo',
    loadComponent: () => import('./features/sms-tenores/tenor-form.component').then(m => m.TenorFormComponent),
    canActivate: [authGuard, menuAccesoGuard],
    data: { acceso: '/sms/combos' }
  },
  {
    path: 'sms/tenores/:id',
    loadComponent: () => import('./features/sms-tenores/tenor-form.component').then(m => m.TenorFormComponent),
    canActivate: [authGuard, menuAccesoGuard],
    data: { acceso: '/sms/combos' }
  },

  // ========================================
  // OTROS MÓDULOS LEGACY
  // ========================================
  {
    path: 'recordings',
    loadComponent: () => import('./features/legacy/recordings/pages/recordings-page/recordings-page.component').then(m => m.RecordingsPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'blacklist',
    loadComponent: () => import('./features/legacy/blacklist/blacklist.component').then(m => m.BlacklistComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'blacklist-main',
    loadComponent: () => import('./features/blacklist-main/blacklist/pages/blacklist-page/blacklist-page.component').then(m => m.BlacklistMainPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'phone-lines',
    loadComponent: () => import('./features/phone-lines/pages/phone-lines-page/phone-lines-page.component').then(m => m.PhoneLinesPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'agreements',
    loadComponent: () => import('./features/legacy/agreements/agreements.component').then(m => m.AgreementsComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'cartas/no-adeudo/email',
    loadComponent: () => import('./features/gestor-cartas/presentation/pages/carta-no-adeudo-email-page/carta-no-adeudo-email-page.component').then(m => m.CartaNoAdeudoEmailPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    // Vista oculta (sin entrada en el menú): solo ADMIN, se entra por URL.
    path: 'cartas/no-adeudo/carga-historica',
    loadComponent: () => import('./features/gestor-cartas/presentation/pages/carta-no-adeudo-carga-historica-page/carta-no-adeudo-carga-historica-page.component').then(m => m.CartaNoAdeudoCargaHistoricaPageComponent),
    canActivate: [authGuard, adminGuard, menuAccesoGuard]
  },
  {
    path: 'cartas/no-adeudo',
    loadComponent: () => import('./features/legacy/agreements/pages/no-debt-letter-page/no-debt-letter-page.component').then(m => m.NoDebtLetterPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'cartas/no-adeudo/nueva-version',
    loadComponent: () => import('./features/legacy/agreements/pages/no-debt-letter-validated-page/no-debt-letter-validated-page.component').then(m => m.NoDebtLetterValidatedPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'admin/extensions',
    loadComponent: () => import('./features/admin/extensions-registry/extensions-registry.component').then(m => m.ExtensionsRegistryComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'whatsapp/dashboard',
    loadComponent: () => import('./whatsapp/componentes/pages/whatsapp-dashboard/whatsapp-dashboard.component').then(m => m.WhatsappDashboardComponent),
    canActivate: [authGuard, adminGuard, menuAccesoGuard]
  },
  {
    path: 'whatsapp/history',
    loadComponent: () => import('./whatsapp/componentes/pages/whatsapp-history/whatsapp-history.component').then(m => m.WhatsappHistoryComponent),
    canActivate: [authGuard, adminGuard, menuAccesoGuard]
  },
  {
    // /whatsapp ahora sirve la page nueva (app/whatsapp). El módulo viejo
    // (features/whatsapp/.../main.component) queda huérfano a propósito.
    path: 'whatsapp',
    loadComponent: () => import('./whatsapp/componentes/pages/whatsapp-page/whatsapp-page.component').then(m => m.WhatsappPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    // Alias que ya usa el popup de notificaciones; apunta a la misma page nueva.
    path: 'wsp2',
    loadComponent: () => import('./whatsapp/componentes/pages/whatsapp-page/whatsapp-page.component').then(m => m.WhatsappPageComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'agent-dashboard',
    loadComponent: () => import('./features/agent-dashboard/agent-status-dashboard.component').then(m => m.AgentStatusDashboardComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'collection-management',
    loadComponent: () => import('./collection-management/pages/collection-management.page').then(m => m.CollectionManagementPage),
    canActivate: [authGuard],
    canDeactivate: [gestionPendienteGuard]
  },
  {
    path: 'seguimiento',
    loadComponent: () => import('./features/seguimiento/seguimiento.page').then(m => m.SeguimientoPage),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // CARGA DE DATOS (Solo Admin)
  // ========================================
  {
    path: 'admin/data-load/consolidated',
    loadComponent: () => import('./data-load/components/consolidated-load/consolidated-load.component').then(m => m.ConsolidatedLoadComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/data-load/initial',
    loadComponent: () => import('./data-load/components/initial-load/initial-load.component').then(m => m.InitialLoadComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/data-load/daily',
    loadComponent: () => import('./data-load/components/daily-load/daily-load.component').then(m => m.DailyLoadComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/data-load/phones',
    loadComponent: () => import('./data-load/components/phone-load/phone-load.component').then(m => m.PhoneLoadComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // MANTENIMIENTO (Solo Admin)
  // ========================================
  {
    path: 'admin/maintenance/tenants',
    loadComponent: () => import('./maintenance/components/tenant-maintenance/tenant-maintenance.component').then(m => m.TenantMaintenanceComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/portfolios',
    loadComponent: () => import('./maintenance/components/portfolio-maintenance/portfolio-maintenance.component').then(m => m.PortfolioMaintenanceComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/subportfolios',
    loadComponent: () => import('./maintenance/components/subportfolio-maintenance/subportfolio-maintenance.component').then(m => m.SubPortfolioMaintenanceComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/headers',
    loadComponent: () => import('./maintenance/components/header-configuration/header-configuration.component').then(m => m.HeaderConfigurationComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/roles',
    loadComponent: () => import('./maintenance/components/roles-management/roles-management.component').then(m => m.RolesManagementComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/users',
    loadComponent: () => import('./maintenance/components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/blacklist',
    loadComponent: () => import('./maintenance/components/blacklist-maintenance/blacklist-maintenance.component').then(m => m.BlacklistMaintenanceComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/typifications',
    loadComponent: () => import('./maintenance/components/typification-maintenance/typification-maintenance.component').then(m => m.TypificationMaintenanceComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/amount-display',
    loadComponent: () => import('./maintenance/components/amount-display-config/amount-display-config.component').then(m => m.AmountDisplayConfigComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/metas-productividad',
    loadComponent: () => import('./maintenance/components/meta-productividad/meta-productividad.component').then(m => m.MetaProductividadComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/mantenimiento-sistema',
    loadComponent: () => import('./features/mantenimiento-sistema/mantenimiento-sistema.component').then(m => m.MantenimientoSistemaComponent),
    canActivate: [authGuard, adminGuard, menuAccesoGuard]
  },
  {
    path: 'admin/control-intensidad',
    loadComponent: () => import('./features/control-intensidad/control-intensidad.component').then(m => m.ControlIntensidadComponent),
    canActivate: [authGuard, adminGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/menu-config',
    loadComponent: () => import('./maintenance/components/menu-configuration/menu-configuration.component').then(m => m.MenuConfigurationComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/maintenance/plantillas-carta',
    loadComponent: () => import('./maintenance/components/plantilla-carta-maintenance/plantilla-carta-maintenance.component').then(m => m.PlantillaCartaMaintenanceComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    // Unica pantalla de configuracion del seguimiento: periodos + horarios.
    path: 'admin/maintenance/seguimiento-periodos',
    loadComponent: () => import('./maintenance/components/seguimiento-periodos/seguimiento-periodos.component').then(m => m.SeguimientoPeriodosComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    // La pantalla de horarios se fusiono con la de seguimiento. Se deja la ruta
    // vieja redirigiendo porque la entrada del menu (que vive en BD) apunta
    // aqui: asi sigue funcionando sin tocar Configuracion de Menu.
    path: 'admin/maintenance/horarios-recordatorios',
    redirectTo: 'admin/maintenance/seguimiento-periodos',
    pathMatch: 'full'
  },
  {
    path: 'admin/maintenance/umbrales-estado',
    loadComponent: () => import('./maintenance/components/umbrales-estado/umbrales-estado.component').then(m => m.UmbralesEstadoComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    // Programacion y nombres de los reportes entregables de cada subcartera.
    path: 'admin/maintenance/entregables-reporte',
    loadComponent: () => import('./maintenance/components/entregables-reporte/entregables-reporte.component').then(m => m.EntregablesReporteComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // PAGOS BANCARIOS
  // ========================================
  {
    path: 'pagos-bancarios',
    loadComponent: () => import('./pagos-bancarios/pages/pagos-bancarios.page').then(m => m.PagosBancariosPage),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'correccion-pagos',
    loadComponent: () => import('./pagos-bancarios/pages/correccion-pagos/correccion-pagos.page').then(m => m.CorreccionPagosPage),
    canActivate: [authGuard, menuAccesoGuard],
    data: { acceso: '/pagos-bancarios' }
  },
  {
    path: 'reportes-pagos-bancarios',
    loadComponent: () => import('./pagos-bancarios/pages/reportes-pagos-bancarios/reportes-pagos-bancarios.page').then(m => m.ReportesPagosBancariosPage),
    canActivate: [authGuard, menuAccesoGuard],
    data: { acceso: '/pagos-bancarios' }
  },
  {
    path: 'conciliaciones-pagos-manage',
    loadComponent: () => import('./pagos-bancarios/pages/conciliaciones-pagos/conciliaciones-pagos.page').then(m => m.ConciliacionesPagosPage),
    canActivate: [authGuard, menuAccesoGuard],
    data: { acceso: '/pagos-bancarios' }
  },

  // ========================================
  // COMISIONES
  // ========================================
  {
    path: 'comisiones',
    loadComponent: () => import('./comisiones/pages/comisiones.page').then(m => m.ComisionesPage),
    canActivate: [authGuard, menuAccesoGuard] // Acceso por configuración de menú (COMISIONES); el backend lo valida igual
  },
  {
    path: 'mis-comisiones',
    loadComponent: () => import('./comisiones/pages/mis-comisiones.page').then(m => m.MisComisionesPage),
    canActivate: [authGuard, menuAccesoGuard] // Acceso por configuración de menú (MIS_COMISIONES); cada uno ve solo lo suyo
  },
  {
    path: 'dashboard/payments',
    loadComponent: () => import('./pagos-bancarios/pages/payments-dashboard/payments-dashboard.component').then(m => m.PaymentsDashboardComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'admin/cartas-cesion',
    loadComponent: () => import('./features/admin/carta-cesion-viewer/carta-cesion-viewer.component').then(m => m.CartaCesionViewerComponent),
    canActivate: [authGuard, menuAccesoGuard] // Acceso controlado por configuración de menú dinámico
  },
  {
    path: 'admin/promesas',
    loadComponent: () => import('./features/admin/promise-management/promise-management.component').then(m => m.PromiseManagementComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'excepciones',
    loadComponent: () => import('./features/excepciones/excepciones.component').then(m => m.ExcepcionesComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/agent-productivity',
    loadComponent: () => import('./features/admin/agent-productivity/agent-productivity.component').then(m => m.AgentProductivityComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/recordings',
    loadComponent: () => import('./features/admin/admin-recordings/admin-recordings.component').then(m => m.AdminRecordingsComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },
  {
    path: 'admin/amd-test',
    loadComponent: () => import('./features/admin/amd-test/amd-test.component').then(m => m.AmdTestComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // GESTIÓN MANUAL (Tipificación sin llamada)
  // ========================================
  {
    path: 'manual-management',
    loadComponent: () => import('./features/manual-management/manual-management.component').then(m => m.ManualManagementComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // TEAM RANKING (Para Agentes)
  // ========================================
  {
    path: 'team-ranking',
    loadComponent: () => import('./features/team-ranking/team-ranking.component').then(m => m.TeamRankingComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // CONSULTA DE CLIENTE
  // ========================================
  {
    path: 'customer-search',
    loadComponent: () => import('./customers/components/customer-view/customer-view.component').then(m => m.CustomerViewComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // CARTAS DE ACUERDO PENDIENTES
  // ========================================
  {
    path: 'cartas-pendientes',
    loadComponent: () => import('./features/cartas-pendientes/cartas-pendientes.component').then(m => m.CartasPendientesComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // PLANTILLAS DE REPORTE SPEECH
  // ========================================
  {
    path: 'plantillas-speech',
    loadComponent: () => import('./features/plantillas-speech/plantillas-speech.component').then(m => m.PlantillasSpeechComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // CONVENIOS
  // ========================================
  {
    path: 'admin/convenios/import',
    loadComponent: () => import('./features/convenios/convenio-import.component').then(m => m.ConvenioImportComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  // ========================================
  // CONFIGURACIÓN DE USUARIO
  // ========================================
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'bot-agenda',
    loadComponent: () => import('./features/bot-agenda/bot-agenda.component').then(m => m.BotAgendaComponent),
    // sin adminGuard a proposito: el asesor tiene que ver SUS llamadas agendadas.
    // El filtrado lo hace el backend (/mias resuelve por el usuario del token).
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'bot-voz',
    loadComponent: () => import('./features/bot-voz/bot-voz.component').then(m => m.BotVozComponent),
    // sin adminGuard: la supervisora arma la cola de su cartera. BotAdminController
    // admite ADMIN y SUPERVISOR, y acota por subcartera; lo que sigue siendo solo de
    // administracion —guardar las condiciones de negociacion— lo corta el propio
    // controlador con 403, y la vista no ofrece el boton.
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'mi-asistencia',
    loadComponent: () => import('./features/asistencia/mi-asistencia.component').then(m => m.MiAsistenciaComponent),
    // Sin adminGuard ni nada: son las horas de quien entra. El backend resuelve
    // de quién son por el token, no por un parámetro.
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'control-acceso',
    loadComponent: () => import('./features/asistencia/control-acceso.component').then(m => m.ControlAccesoComponent),
    // Decidir qué máquina entra es de administración; el controlador corta con
    // ADMIN y OPERACIONES.
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: 'personal',
    loadComponent: () => import('./features/asistencia/personal.component').then(m => m.PersonalComponent),
    // Las fichas son de RR.HH., igual que Control de Asistencia.
    canActivate: [authGuard, rrhhGuard, menuAccesoGuard]
  },

  {
    path: 'asistencia',
    loadComponent: () => import('./features/asistencia/control-asistencia.component').then(m => m.ControlAsistenciaComponent),
    // De RR.HH.: corregir, aprobar, cerrar y configurar. RR.HH. es configuración
    // (asistencia_rrhh) y no rol, por eso no basta un roleGuard; la supervisora
    // que llega por la URL va a la vista de su equipo.
    canActivate: [authGuard, rrhhGuard, menuAccesoGuard]
  },

  {
    path: 'asistencia-equipo',
    loadComponent: () => import('./features/asistencia/asistencia-equipo.component').then(m => m.AsistenciaEquipoComponent),
    // La vista de la supervisora: alertas de su equipo y justificaciones por
    // revisar. El reporte que la alimenta ya acota por subcartera.
    canActivate: [authGuard, menuAccesoGuard]
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
