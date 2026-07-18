# --fake marks the migration as applied in django_migrations without actually running the SQL, so Django and the DB are back in sync.
# python manage.py migrate creatorapp --fake

# Raw SQL ran          → tables exist in PostgreSQL
# --fake               → Django ticks them as "done" in django_migrations
#                        without running any SQL
# Now in sync          → Django knows about the tables
# Django owns models   → all future changes go through models.py → makemigrations → migrate




# Get all tags under a work:
# pythonwork = CreatorsWorks.objects.get(id=some_id)
# work.tags.all()  #  related_name on creator_work field
# "Starting from a work, give me all tag join rows" — you use tags because that's the related_name on the creator_work field.

# Get all works with a specific tag:
# pythontag = OfferTags.objects.get(name='Video')
# tag.works.all()  #  related_name on name field
# "Starting from a tag, give me all join rows that use this tag" — you use works because that's the related_name on the name field.


#  tags = serializers.SerializerMethodField() indicates that the tags field is read-only and its value is dynamically computed by a method on the serializer class, rather than being directly mapped to a model attribute.