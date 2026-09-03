# this is a Django management command works like normal django.setup() when you want to run command line tasks like seeding db fixing database
#normal CRUD(Views): Django is already running as a web server. It automatically loaded all your settings and database connections before the user even clicked the button.  You don't need to do anything.
#Standalone Scripts: If you write a random file like my_script.py and try to run it, Python doesn't know it's a Django project. You have to manually tell it: "Hey, load Django!" (django.setup()). 
#Management Commands: Because they live inside the special manage.py system, they automatically get the "Django Superpowers" (database access, settings, models) without you needing to write django.setup().


from django.core.management.base import BaseCommand
from ...models import Speciality

SPECIALITIES_ORIGINAL = [
    "Video", "Photography", "UGC", "Travel", "Lifestyle", "Food",
]

SPECIALITIES = [
    "Video", "Photography", "UGC", "Travel", "Lifestyle", "Food", 'Beauty' , 'Tech', 'Agriculture', 'Gaming', 
    'Fitness', 'Health', 'Fashion', 'Comedy', 'Entertainment','Sports', 'Business', 'Education', 'Art', 'Science','Finance', 'Pets', 'News', 'Politics', 'Environment',
    'Editorial', 'Review', 'Livestream', 'Music', 'Family', 'Parenting'
]
# Beauty, tech fiitness, video, photography... TODO
class Command(BaseCommand):
    help ="Seed the Speciality table with the master tag list"

    def handle(self, *args, **options):
        
        for name in SPECIALITIES:
            obj, created = Speciality.objects.get_or_create(speciality_name=name)
            status = "created" if created else "already exists"
            self.stdout.write(f"{name}: {status}")

        self.stdout.write(self.style.SUCCESS("Done seeding specialities."))

