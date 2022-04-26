import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ListsComponent } from './report/lists/lists.component';
import { DetailComponent } from './report/detail/detail.component';

import { PagesComponent } from './pages.component';
import { PagerComponent } from '../pages/shared/pager/pager.component';

const approutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'report-list', component: ListsComponent },
            { path: 'report-detail', component: DetailComponent },
        ]
    },
    { 
        path: 'not-found', 
        loadChildren: () =>
        import('../../app/not-found/not-found.module').then(
            (m) => m.NotFoundModule
        ) 
    },
    {   
        path: '**', redirectTo: 'not-found' 
    }
];

@NgModule({
    declarations: [
        PagesComponent,
        PagerComponent,
        ListsComponent,
        DetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(approutes),
    ],
    entryComponents: [

    ],
    exports: [RouterModule],
})
export class PagesRoutingModule { }
