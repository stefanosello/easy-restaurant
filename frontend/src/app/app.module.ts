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
import { RequestInterceptor } from './_helpers/request.interceptor';
import { CookComponent } from './cook/cook.component';
import { BartenderComponent } from './bartender/bartender.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CashdeskTableCardComponent } from './cashdesk/cashdesk-table-card/cashdesk-table-card.component';
import { CashdeskInfoModalComponent } from './cashdesk/cashdesk-info-modal/cashdesk-info-modal.component';
import { CashdeskBillModalComponent } from './cashdesk/cashdesk-bill-modal/cashdesk-bill-modal.component';
import { WaiterTableCardComponent } from './waiter/waiter-table-card/waiter-table-card.component';
import { MatChipsModule } from '@angular/material/chips';
import { WaiterStatusModalComponent } from './waiter/waiter-status-modal/waiter-status-modal.component';
import { WaiterOrderModalComponent } from './waiter/waiter-order-modal/waiter-order-modal.component';

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
    WaiterOrderModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    MatChipsModule
  ],
  exports: [ModalModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  entryComponents: [
    CashdeskInfoModalComponent,
    CashdeskBillModalComponent,
    WaiterStatusModalComponent,
    WaiterOrderModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
