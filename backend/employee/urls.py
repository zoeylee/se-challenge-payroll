from django.conf.urls import url

from .views import EmployeeList, UploadFileView, ReportList, DailyRecordList, PayRollReportView

urlpatterns = [
    url(r'^list$', EmployeeList.as_view()),
    url(r'^daily_record$', DailyRecordList.as_view()),
    url(r'^file_upload$', UploadFileView.as_view()),
    url(r'^report$', ReportList.as_view()),
    url(r'^payroll_report/(?P<rid>[-\w]+)$', PayRollReportView.as_view()),
    
]