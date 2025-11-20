import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { adminOrSupervisorGuard } from './core/guards/admin-or-supervisor.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dialer',
    loadComponent: () => import('./features/dialer/dialer-main/dialer-main.component').then(m => m.DialerMainComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/contact-list.component').then(m => m.ContactListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/monitoring',
    loadComponent: () => import('./features/admin/admin-monitoring/admin-monitoring.component').then(m => m.AdminMonitoringComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/supervision/:callUuid',
    loadComponent: () => import('./features/admin/admin-call-supervision/admin-call-supervision').then(m => m.AdminCallSupervision),
    canActivate: [authGuard]
  },
  {
    path: 'admin/campaigns/new',
    loadComponent: () => import('./features/admin/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/campaigns/generation',
    loadComponent: () => import('./features/legacy/campaign/pages/campaign-page/campaign-page.component').then(m => m.CampaignPageComponent),
    canActivate: [authGuard, adminOrSupervisorGuard]
  },
  {
    path: 'admin/campaigns/:id/edit',
    loadComponent: () => import('./features/admin/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/campaigns/:id',
    loadComponent: () => import('./features/admin/campaign-detail/campaign-detail.component').then(m => m.CampaignDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/campaigns',
    loadComponent: () => import('./features/admin/campaign-management/campaign-management.component').then(m => m.CampaignManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/campaign-monitoring',
    loadComponent: () => import('./features/admin/campaign-monitoring/campaign-monitoring.component').then(m => m.CampaignMonitoringComponent),
    canActivate: [authGuard]
  },

  // ========================================
  // REPORTES LEGACY
  // ========================================
  {
    path: 'reports/contact',
    loadComponent: () => import('./features/legacy/reports/pages/contact-report/contact-report.component').then(m => m.ContactReportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports/ranking',
    loadComponent: () => import('./features/legacy/reports/pages/ranking-report/ranking-report.component').then(m => m.RankingReportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports/speech',
    loadComponent: () => import('./features/legacy/reports/pages/speech-report/speech-report.component').then(m => m.SpeechReportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports/monitoring',
    loadComponent: () => import('./features/legacy/reports/pages/monitoring-report/monitoring-report.component').then(m => m.MonitoringReportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports/powerbi',
    loadComponent: () => import('./features/legacy/reports/pages/powerbi-report/powerbi-report.component').then(m => m.PowerbiReportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports/cartera-propia',
    loadComponent: () => import('./features/legacy/reports/pages/cartera-propia-report/cartera-propia-report.component').then(m => m.CarteraPropiaReportComponent),
    canActivate: [authGuard]
  },

  // ========================================
  // SMS LEGACY
  // ========================================
  {
    path: 'sms/combos',
    loadComponent: () => import('./features/legacy/sms/pages/combo-list/combo-list.component').then(m => m.ComboListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'sms/dynamic',
    loadComponent: () => import('./features/legacy/sms/pages/dyn-query/dyn-query.component').then(m => m.DynQueryComponent),
    canActivate: [authGuard]
  },

  // ========================================
  // OTROS MÓDULOS LEGACY
  // ========================================
  {
    path: 'recordings',
    loadComponent: () => import('./features/legacy/recordings/pages/recordings-page/recordings-page.component').then(m => m.RecordingsPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blacklist',
    loadComponent: () => import('./features/legacy/blacklist/blacklist.component').then(m => m.BlacklistComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blacklist-main',
    loadComponent: () => import('./features/blacklist-main/blacklist/pages/blacklist-page/blacklist-page.component').then(m => m.BlacklistMainPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'agreements',
    loadComponent: () => import('./features/legacy/agreements/agreements.component').then(m => m.AgreementsComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/extensions',
    loadComponent: () => import('./features/admin/extensions-registry/extensions-registry.component').then(m => m.ExtensionsRegistryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'whatsapp',
    loadComponent: () => import('./features/whatsapp/components/main/main.component').then(m => m.MainComponent),
    canActivate: [authGuard]
  },
  {
    path: 'agent-dashboard',
    loadComponent: () => import('./features/agent-dashboard/agent-status-dashboard.component').then(m => m.AgentStatusDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'collection-management',
    loadComponent: () => import('./collection-management/pages/collection-management.page').then(m => m.CollectionManagementPage),
    canActivate: [authGuard]
  },

  // ========================================
  // CARGA DE DATOS (Solo Admin)
  // ========================================
  {
    path: 'admin/data-load/initial',
    loadComponent: () => import('./data-load/components/initial-load/initial-load.component').then(m => m.InitialLoadComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/data-load/daily',
    loadComponent: () => import('./data-load/components/daily-load/daily-load.component').then(m => m.DailyLoadComponent),
    canActivate: [authGuard, adminGuard]
  },

  // ========================================
  // MANTENIMIENTO (Solo Admin)
  // ========================================
  {
    path: 'admin/maintenance/tenants',
    loadComponent: () => import('./maintenance/components/tenant-maintenance/tenant-maintenance.component').then(m => m.TenantMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/portfolios',
    loadComponent: () => import('./maintenance/components/portfolio-maintenance/portfolio-maintenance.component').then(m => m.PortfolioMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/subportfolios',
    loadComponent: () => import('./maintenance/components/subportfolio-maintenance/subportfolio-maintenance.component').then(m => m.SubPortfolioMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/headers',
    loadComponent: () => import('./maintenance/components/header-configuration/header-configuration.component').then(m => m.HeaderConfigurationComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/roles',
    loadComponent: () => import('./maintenance/components/roles-management/roles-management.component').then(m => m.RolesManagementComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/users',
    loadComponent: () => import('./maintenance/components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/blacklist',
    loadComponent: () => import('./maintenance/components/blacklist-maintenance/blacklist-maintenance.component').then(m => m.BlacklistMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/maintenance/typifications',
    loadComponent: () => import('./maintenance/components/typification-maintenance/typification-maintenance.component').then(m => m.TypificationMaintenanceComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/cartas-cesion',
    loadComponent: () => import('./features/admin/carta-cesion-viewer/carta-cesion-viewer.component').then(m => m.CartaCesionViewerComponent),
    canActivate: [authGuard, adminOrSupervisorGuard]
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
