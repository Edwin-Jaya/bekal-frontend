import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { authGuard } from './core/auth/auth-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('./features/landing/landing').then(m=>m.Landing)
    },
    {
        path:'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path:'',
        component:MainLayout,
        canActivate: [authGuard],
        children:[
            {
                path:'admin/dashboard',
                loadComponent: () => import('./features/dashboard/super-admin-dashboard/super-admin-dashboard').then(m => m.SuperAdminDashboard),
                // canActivate:[permissionGuard]
            },
            {
                path:'admin/users',
                loadComponent: () => import('./features/user-management/user-management').then(m => m.UserManagement),
                canActivate:[permissionGuard]
            },
                        {
                path:'admin/roles',
                loadComponent: () => import('./features/role-management/role-management').then(m => m.RoleManagement),
                canActivate:[permissionGuard]
            },
                        {
                path:'admin/menus',
                loadComponent: () => import('./features/menu-management/menu-management').then(m => m.MenuManagement),
                canActivate:[permissionGuard]
            },
                        {
                path:'admin/access',
                loadComponent: () => import('./features/access-management/access-management').then(m => m.AccessManagement),
                canActivate:[permissionGuard]
            },
        ]
    },
    {
        path:'',
        component:MainLayout,
        canActivate: [authGuard],
        children:[
            {
                path:'marketing/dashboard',
                loadComponent: () => import('./features/dashboard/marketing-dashboard/marketing-dashboard').then(m => m.MarketingDashboard),
                // canActivate:[permissionGuard]
            },
                       {
                path:'marketing/loan-reviews',
                loadComponent: () => import('./features/loan-review/loan-review-list/loan-review-list').then(m => m.LoanReviewList),
                canActivate:[permissionGuard]
            },
                                  {
                path:'marketing/loan-reviews/:id',
                loadComponent: () => import('./features/loan-review/loan-review-detail/loan-review-detail').then(m => m.LoanReviewDetail),
                // canActivate:[permissionGuard]
            },                                  {
                path:'marketing/history',
                loadComponent: () => import('./features/loan-review/loan-review-history/loan-review-history').then(m => m.LoanReviewHistory),
                // canActivate:[permissionGuard]
            }
        ]
    },
        {
        path:'',
        component:MainLayout,
        canActivate: [authGuard],
        children:[
            {
                path:'branch-manager/dashboard',
                loadComponent: () => import('./features/dashboard/branch-manager-dashboard/branch-manager-dashboard').then(m => m.BranchManagerDashboard),
                // canActivate:[permissionGuard]
            },
                       {
                path:'branch-manager/loan-approvals',
                loadComponent: () => import('./features/loan-approval/loan-approval-list/loan-approval-list').then(m => m.LoanApprovalList),
                canActivate:[permissionGuard]
            },
                                  {
                path:'branch-manager/loan-approvals/:id',
                loadComponent: () => import('./features/loan-approval/loan-approval-detail/loan-approval-detail').then(m => m.LoanApprovalDetail),
                // canActivate:[permissionGuard]
            },                                  {
                path:'branch-manager/history',
                loadComponent: () => import('./features/loan-approval/loan-approval-history/loan-approval-history').then(m => m.LoanApprovalsHistory),
                // canActivate:[permissionGuard]
            }
        ]
    },
            {
        path:'',
        component:MainLayout,
        canActivate: [authGuard],
        children:[
            {
                path:'back-office/dashboard',
                loadComponent: () => import('./features/dashboard/back-office-dashboard/back-office-dashboard').then(m => m.BackOfficeDashboard),
                // canActivate:[permissionGuard]
            },
                       {
                path:'back-office/loan-disbursement',
                loadComponent: () => import('./features/loan-disbursement/loan-disbursement-list/loan-disbursement-list').then(m => m.LoanDisbursementList),
                canActivate:[permissionGuard]
            },
                                  {
                path:'back-office/loan-disbursement/:id',
                loadComponent: () => import('./features/loan-disbursement/loan-disbursement-detail/loan-disbursement-detail').then(m => m.LoanDisbursementDetail),
                // canActivate:[permissionGuard]
            },                                  {
                path:'back-office/history',
                loadComponent: () => import('./features/loan-disbursement/loan-disbursement-history/loan-disbursement-history').then(m => m.LoanDisbursementHistory),
                // canActivate:[permissionGuard]
            }
        ]
    }
];
