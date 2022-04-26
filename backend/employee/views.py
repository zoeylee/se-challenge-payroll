# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, action
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import status
from django.db.models import Q
from employee.models import (
    Employee,  
    Report, 
    DailyRecord
)
from employee.serializers import (
    PayrollReportSerializer, 
    EmployeeReportSerializer, 
    EmployeeSerializer, 
    ReportSerializer, 
    FileUploadSerializer, 
    DailyRecordSerializer
)
from django.utils import timezone
import io, csv, pandas as pd
import datetime

class EmployeeList(generics.ListAPIView):
    serializer_class        = EmployeeSerializer
    permission_classes      = [IsAuthenticated]
    authentication_classes  = [JSONWebTokenAuthentication]

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            qs = DailyRecord.objects.filter(employee_id=query)
        else:
            qs = Employee.objects.all()
        return qs

class DailyRecordList(generics.ListAPIView):
    serializer_class        = DailyRecordSerializer
    permission_classes      = [IsAuthenticated]
    authentication_classes  = [JSONWebTokenAuthentication]

    def get_queryset(self):
        query = self.request.GET.get("employee_id")
        if query:
            qs = DailyRecord.objects.filter(employee_id=query).order_by('id')
        else:
            return Response(data={ 'detail': 'employee_id required' }, status=status.HTTP_400_BAD_REQUEST)
        return qs

class ReportList(generics.ListAPIView):
    serializer_class        = ReportSerializer
    permission_classes      = [IsAuthenticated]
    authentication_classes  = [JSONWebTokenAuthentication]

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            qs = Report.objects.filter(user__username__icontains=query)
        else:
            qs = Report.objects.all().order_by('id')
        return qs

class UploadFileView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    def last_day_of_month(self, date):
            if date.month == 12:
                return date.replace(day=31)
            return date.replace(month=date.month+1, day=1) - datetime.timedelta(days=1)

    def get_date_range(self, date):
        start_date = date
        if date.day > 15:
            start_date = datetime.date(date.year, date.month, 16)
            end_date = datetime.date(date.year, date.month, self.last_day_of_month(date).day)
        else:
            start_date = datetime.date(date.year, date.month, 1)
            end_date = datetime.date(date.year, date.month, 15)
        return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")
        
    def post(self, request, *args, **kwargs):
        if request.data['file'] is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                        data={"detail": "Invalid file name"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        file = serializer.validated_data['file']
        report = Report.objects.filter(report_name=file)
        if report.first():
            return Response(
                    data={"detail": "Duplicate file name"},
                    status=status.HTTP_409_CONFLICT
                )
        try:
            report = Report(report_name=file, updated_at=datetime.datetime.now())
            report.save()
        except Exception as e:
            return Response(
                data={"detail": "unexpected error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        employee_reports = []
        reader = pd.read_csv(file)
        job_group_type = { "A": 20, "B": 30 }

        for _, row in reader.iterrows():
            employee_id = row[2]
            daliy_hours = float(row[1])
            new_entry = {
                "date": datetime.datetime.strptime(row[0], "%d/%m/%Y") ,
                "hours_worked": daliy_hours,
                "amount_paid":  daliy_hours * job_group_type.get(row[3])
            }

            start_date, end_date = self.get_date_range(new_entry.get("date"))
            entry = Employee.objects.filter(employee_id=employee_id, start_date=start_date,end_date=end_date)
            if not entry.first():
                Employee.objects.create(
                        employee_id = row[2],
                        job_group = row[3],
                        start_date = start_date,
                        end_date = end_date,
                        hours_worked = new_entry.get("hours_worked"),
                        amount_paid = new_entry.get("amount_paid"),
                        updated_at = timezone.now(),
                        report = report
                )
                DailyRecord.objects.create(
                    employee_id = employee_id,
                    date = row[0],
                    hours_worked = new_entry.get("hours_worked"),
                    updated_at = timezone.now(),
                )

            daily_record = DailyRecord.objects.filter(employee_id=employee_id, date=row[0])
            if not daily_record.first():
                new_entry["amount_paid"] =  float(entry[0].amount_paid) + new_entry.get("amount_paid")
                Employee.objects.filter(employee_id=employee_id, start_date=start_date, end_date=end_date).update(
                    hours_worked = float(entry[0].hours_worked) + new_entry.get("hours_worked"),
                    amount_paid = new_entry.get("amount_paid"),
                    updated_at = timezone.now()
                )
                DailyRecord.objects.create(
                    employee_id = employee_id,
                    date = row[0],
                    hours_worked = new_entry.get("hours_worked"),
                    updated_at = timezone.now(),
                )
        report_id = report.id
        qs = Employee.objects.filter(report_id=report_id)
        serializer = PayrollReportSerializer({'employee_reports': qs})

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PayRollReportView(generics.ListAPIView):
    serializer_class        = EmployeeReportSerializer
    permission_classes      = [IsAuthenticated]
    authentication_classes  = [JSONWebTokenAuthentication]
    lookup_url_kwarg = "rid"

    @action(detail=False)
    def get(self, request, *args, **kwargs):
        rid = self.kwargs.get(self.lookup_url_kwarg)
        if rid is None:
            return Response(data={'detail': 'Invaild file'}, status=status.HTTP_400_BAD_REQUEST)
        
        report_id = None
        try:
            report_id = int(rid)
        except Exception as e:
            return Response(data={'detail': 'Invaild file'}, status=status.HTTP_400_BAD_REQUEST)

        report = Report.objects.filter(id=report_id)
        if not report.first():
            return Response(data={'detail': 'Invaild file'}, status=status.HTTP_400_BAD_REQUEST)
        
        report_id = report[0].id
        qs = Employee.objects.filter(report_id=report_id)
        serializer = PayrollReportSerializer({'employee_reports': qs})

        return Response(serializer.data, status=status.HTTP_200_OK)