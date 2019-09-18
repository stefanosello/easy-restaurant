import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_helpers/material/material.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { WaiterComponent } from './waiter/waiter.component';
import { CashdeskComponent } from './cashdesk/cashdesk.component';
import { RequestInterceptor } from './_interceptors/request.interceptor';
import { CookComponent } from './cook/cook.component';
import { BartenderComponent } from './bartender/bartender.component';
import { LayoutModule } from '@angular/cdk/layout';
// tslint:disable-next-line: max-line-length
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CashdeskTableCardComponent } from './cashdesk/cashdesk-table-card/cashdesk-table-card.component';
import { CashdeskInfoModalComponent } from './cashdesk/cashdesk-info-modal/cashdesk-info-modal.component';
import { CashdeskBillModalComponent } from './cashdesk/cashdesk-bill-modal/cashdesk-bill-modal.component';
import { WaiterTableCardComponent } from './waiter/waiter-table-card/waiter-table-card.component';
import { MatChipsModule } from '@angular/material/chips';
import { WaiterStatusModalComponent } from './waiter/waiter-status-modal/waiter-status-modal.component';
import { WaiterOrderModalComponent } from './waiter/waiter-order-modal/waiter-order-modal.component';
import { CashdeskAddCardModalComponent } from './cashdesk/cashdesk-add-card-modal/cashdesk-add-card-modal.component';
import { FormsModule } from '@angular/forms';
import { BartenderOrderCardComponent } from './bartender/bartender-order-card/bartender-order-card.component';
import { CookOrderCardComponent } from './cook/cook-order-card/cook-order-card.component';
import { NoticesComponent } from './notices/notices.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { StatisticsModalComponent } from './statistics/statistics-modal/statistics-modal.component';
import { UsersComponent } from './users/users.component';
import { UserInfoModalComponent } from './users/user-info-modal/user-info-modal.component';
import { UserAddModalComponent } from './users/user-add-modal/user-add-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    WaiterComponent,
    CashdeskComponent,
    CookComponent,
    BartenderComponent,
    HomeComponent,
    CashdeskTableCardComponent,
    CashdeskInfoModalComponent,
    CashdeskBillModalComponent,
    WaiterTableCardComponent,
    WaiterStatusModalComponent,
    WaiterOrderModalComponent,
    CashdeskAddCardModalComponent,
    BartenderOrderCardComponent,
    CookOrderCardComponent,
    NoticesComponent,
    StatisticsComponent,
    StatisticsModalComponent,
    UsersComponent,
    UserInfoModalComponent,
    UserAddModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    MatChipsModule,
    FormsModule,
  ],
  exports: [ModalModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  entryComponents: [
    CashdeskInfoModalComponent,
    CashdeskBillModalComponent,
    WaiterStatusModalComponent,
    WaiterOrderModalComponent,
    CashdeskAddCardModalComponent,
    StatisticsModalComponent,
    UserInfoModalComponent,
    UserAddModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
