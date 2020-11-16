import { AuthGuard } from './../../services/auth/auth.guard';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'admin/dashboard',      component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'admin/user-profile',   component: UserProfileComponent , canActivate: [AuthGuard]},
];
