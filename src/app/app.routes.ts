import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dialer',
    loadComponent: () => import('./features/dialer/test-softphone/test-softphone.component').then(m => m.TestSoftphoneComponent),
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
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
