from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.conf import settings



# Create your models here.
class Report(models.Model):
    report_name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(
            default=timezone.now)
    updated_at = models.DateTimeField(
            blank=True, null=True)
    def update(self):
        self.updated_at = timezone.now()
        self.save()

    def __unicode__(self):
     return self.report_name

class Employee(models.Model):
    employee_id = models.CharField(max_length=10)
    A = 'A'
    B = 'B'
    JOB_GROUP_TYPE = (
        (A, 'A'),
        (B, 'B'),
    )
    created_at = models.DateTimeField(
            default=timezone.now)
    updated_at = models.DateTimeField(
            blank=True, null=True)
    job_group = models.CharField(
        max_length=2,
        choices=JOB_GROUP_TYPE,
        default=None,
    )

    start_date = models.CharField(max_length=10, blank=True, null=True)
    end_date = models.CharField(max_length=10, blank=True, null=True)

    hours_worked = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, blank=True, null=True)

    @property
    def pay_period(self):
        return {
            "start_date": self.start_date,
            "end_date": self.end_date
        }

    class Meta:
        ordering = ['employee_id', 'start_date']

class DailyRecord(models.Model):
    created_at = models.DateTimeField(
            default=timezone.now)
    updated_at = models.DateTimeField(
            blank=True, null=True)
    date = models.CharField(max_length=10, blank=True, null=True)
    hours_worked = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # employee = models.ForeignKey(Employee, related_name="employee_hours_worked", on_delete=models.CASCADE, blank=True, null=True)
    employee_id = models.CharField(max_length=10)
    class Meta:
        unique_together = (('employee_id', 'date'))
        ordering = ['employee_id', 'date']

