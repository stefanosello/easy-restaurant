import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CashdeskInfoModalComponent } from 'src/app/cashdesk/cashdesk-info-modal/cashdesk-info-modal.component';
import { UserService } from 'src/app/_services/user.service';
import { User, Roles } from 'src/app/_models/user';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistics-modal',
  templateUrl: './statistics-modal.component.html',
  styleUrls: ['./statistics-modal.component.scss']
})
export class StatisticsModalComponent implements OnInit {

  public userInfo: any;
  public chartJS: any = null;
  public richInfo: any = null;
  @ViewChild('chart') chart: ElementRef;

  constructor(public dialogRef: MatDialogRef<CashdeskInfoModalComponent>,
              @Inject(MAT_DIALOG_DATA) public user: User,
              private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  private getUser() {
    this.userService.get(this.user).subscribe(
      data => {
        console.log(data);
        this.richInfo = data.richInfo;
      },
      err => { console.error(err); },
      () => { this.initChart(); }
    );
  }

  private initChart() {
    const ctx = this.chart.nativeElement.getContext('2d');
    const data = {
      datasets: [{
        data: this.getUserDataForChart().data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }],
      labels: this.getUserDataForChart().labels
    };
    const options = {};
    this.chartJS = new Chart(ctx, {
      type: 'doughnut',
      data,
      options
    });
    console.log(this.chart);
  }

  private getUserDataForChart() {
    const response: any = {};
    if (this.user.role === Roles.Waiter) {
      response.data = [this.richInfo.servicesServedAmount, this.richInfo.servicesTotalsAmount - this.richInfo.servicesServedAmount];
      response.labels = [`services managed by ${this.user.username}`, `services not managed by ${this.user.username}`];
    }
    if (this.user.role === Roles.Cook || this.user.role === Roles.Bartender) {
      response.data = [this.richInfo.itemsPreparedAmount, this.richInfo.itemsTotalsAmount - this.richInfo.itemsPreparedAmount];
      response.labels = [`items prepared by ${this.user.username}`, `items not prepared by ${this.user.username}`];
    }
    return response;
  }

}
