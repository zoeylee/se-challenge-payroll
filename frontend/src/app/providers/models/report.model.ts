export interface PayPeriod {
    startDate: string;
    endDate: string;
}

export interface EmployeeReport {
    employeeId: number;
    amountPaid: number;
    payPeriod: PayPeriod;
}

export interface EmployeeReports {
    employeeReports: EmployeeReport[];
}
    

export interface PayrollReport {
    payrollReport: EmployeeReports;
}

export interface Report {
    id: string;
    reportName: string;
    createdAt: string;
    updatedAt: string;
}