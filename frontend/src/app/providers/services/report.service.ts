import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PayrollReport } from '../models/report.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

    constructor(private apiService: ApiService) {
        
    }

    getAll(): Observable<any> {
        return this.apiService.get(`/empl/report`).pipe(map(
            data => {
                if (data) {
                    return data as PayrollReport;
                }
                return null;
            }
        ));
    }

    getReport(id: string): Observable<any> {
        return this.apiService.get(`/empl/payroll_report/${id}`).pipe(map(
            (data: any) => {
                if (data) {
                    return data;
                }
                return null;
            }
        ));
    }

    uploadFile(file: any): Observable<any> {
        return this.apiService.post('/empl/file_upload', file).pipe(map(
            (data: any) => {
                if (data) {
                    return data as PayrollReport;
                }
                    return null;
            }
        ));
    }
}
