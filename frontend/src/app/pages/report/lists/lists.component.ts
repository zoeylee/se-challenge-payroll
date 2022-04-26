import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { throwIfEmpty } from 'rxjs';
import { Errors } from 'src/app/providers/models/errors.model';
import { EmployeeReport, PayrollReport } from 'src/app/providers/models/report.model';
import { ReportService } from 'src/app/providers/services/report.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
    
    loading = false;
    payrollReport: PayrollReport;
    employeeReports: EmployeeReport[];
    show = false;
    file = null;
    errorMessage = '';
    constructor(private reportService: ReportService) { }

    ngOnInit() {
    
    }
    
    onClick() {
        this.errorMessage = ''
    }

    onFilechange(event: any) {
        
        console.log(event.target.files[0])
        this.file = event.target.files[0]
        this.show = false
    }

    uploadFile() {
        if (!this.file) {
            return
        }
        let formParams = new FormData();
        formParams.append('file', this.file)
        this.reportService.uploadFile(formParams).subscribe((res: PayrollReport) => {
                if (res.payrollReport.employeeReports.length > 0) {
                    this.show = true;
                    this.employeeReports = res.payrollReport.employeeReports;
                }   
            }, (err: Errors) => {
                this.errorMessage = err.detail;
            })
    }

}
