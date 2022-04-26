import re

from django.templatetags.static import static
from rest_framework import serializers
from django.contrib.auth.models import User
from employee.models import Employee, Report, DailyRecord
from account.serializers import UserSerializer

class EmployeeSerializer(serializers.ModelSerializer):
    report_id = serializers.ReadOnlyField(source='report.id')
    class Meta:
        model = Employee
        fields = (
            'employee_id',
            'job_group',
            'start_date',
            'end_date',
            'hours_worked',
            'amount_paid',
            'created_at',
            'report_id'
        )

class DailyRecordSerializer(serializers.ModelSerializer):
    # employee_id = serializers.ReadOnlyField(source='employee.employee_id')
    class Meta:
        model = DailyRecord
        fields = (
            'employee_id',
            'date',
            'hours_worked',
            'created_at'
        )

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = (
            'id',
            'report_name',
            'created_at',
            'updated_at'
        )
        
class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate(self, data):
        upper_value = str(data['file'])
        pattern = re.compile(r'^time-report-[0-9]{1,3}.csv+$')
        if pattern.match(upper_value) is None:
            raise serializers.ValidationError("Invalid file name")
        return data

class PayPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = (
            'start_date', 'end_date'
        )

class EmployeeReportSerializer(serializers.ModelSerializer):
    pay_period = PayPeriodSerializer(many=False)
    class Meta:
        model = Employee
        fields = (
            'employee_id', 'pay_period', 'amount_paid'
        )

class PayrollReportSerializer(serializers.Serializer):
    employee_reports = EmployeeReportSerializer(many=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return { 'payroll_report': representation }
