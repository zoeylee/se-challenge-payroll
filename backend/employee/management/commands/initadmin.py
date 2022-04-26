from django.contrib.auth.management.commands import createsuperuser
from django.contrib.auth.models import User
from django.core.management import CommandError

class Command(createsuperuser.Command):

    def handle(self, *args, **options):
        options.setdefault('interactive', False)
        if User.objects.count() == 0:
            user = User(
                username = "admin",
                email = "admin@admin.com"
            )
            user.set_password("1q2w#E$R")
            user.is_superuser = True
            user.is_active = True
            user.is_staff = True
            user.save()
            print('Admin accounts has been initialized')
        else:
            print('Admin accounts can only be initialized if no Accounts exist')
