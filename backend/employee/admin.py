from django.contrib import admin
from .models import Employee, Report, DailyRecord

# Register your models here.
admin.site.register(Employee)
admin.site.register(Report)
admin.site.register(DailyRecord)