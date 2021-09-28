import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { RegisterListComponent } from './register-list.component';
import { RegisterDetailComponent } from './register-detail.component';
import { RegisterEditComponent } from './register-edit.component';
import { RegisterService } from './register.service';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'users', component: RegisterListComponent },
      { path: 'users/:id', component: RegisterDetailComponent },
      { path: 'users/:id/edit', component: RegisterEditComponent }
    ])
  ],
  declarations: [
    RegisterListComponent,
    RegisterDetailComponent,
    RegisterEditComponent
  ]
})
export class RegisterModule { }
