import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Pager } from 'src/app/providers/models/pager.model';
import { EmployeeReport, Report } from 'src/app/providers/models/report.model';
import { ReportService } from '../../../providers/services/report.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    // id: number = null;
    reports: Report[];
    employeeReports: EmployeeReport[];
    pager: Pager;
    activeId: string;
    show = false;
    constructor(
        private reportservice: ReportService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            // this.id = Number(params['report_id']);
        });
        this.getReports();
    }

    getReports() {
        this.reportservice.getAll().pipe().subscribe((res) => {
            this.reports = res.results;
        })
    }

    getReport(id: string) {
        this.show = false;
        this.activeId = id;
        this.reportservice.getReport(id).pipe().subscribe((res) => {
            this.show = true;
            this.employeeReports = res.payrollReport.employeeReports;
        })
    }
  
}
