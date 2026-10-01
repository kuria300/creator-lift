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
# double underscore is used to traverse relationships in Django ORM queries. For example, if you have a model A that has a ForeignKey to model B, and model B has a field called 'name', you can filter instances of model A based on the 'name' field of related model B using double underscores: A.objects.filter(b__name='some_name'). This allows you to query across relationships in a concise way.


#  tags = serializers.SerializerMethodField() indicates that the tags field is read-only and its value is dynamically computed by a method on the serializer class, rather than being directly mapped to a model attribute.
# queryset - it is data we want to get back so it has't touched db yet just a list of commands you want to happen- they are just instruction or blueprints SQL statements to be run
# no data has been fetched operates on lazy evaluation 

## aggregate - this boils down a query set into a single row of data  it wraps the instruction in sum()/avg()
## annotate - calculates summary on every row of the query set



"""
You mentioned "Gunicorn or Uvicorn," but in production, you often use both:

Command: gunicorn myproject.asgi:application -k uvicorn.workers.UvicornWorker
How it works:
Gunicorn acts as the "Master Process." It manages process stability, logging, and graceful restarts (things raw Uvicorn is bad at).
Gunicorn spawns Uvicorn Workers.
These workers contain the Event Loop.
Request Flow: Client → Gunicorn Master → Uvicorn Worker (Event Loop) → Django. 



which is a Linux utility that returns the full path of the executable, which we pass as an argument.
there are three ways to run a service suing system managers, init, as a process
A System manager is one of the building blocks of Linux. 
It runs using the PID 1 and is responsible for starting the entire Linux system. systemd, init, and upstart are the three most widely used system managers in Linux. 
"""


"""
when running minio we download it as an executable file first as a file then chomd +x minio
sudo mv minio /usr/local/bin - makes it possible to be called anywhere one is 

sudo useradd -r minio-user -s /sbin/nologin - create a user that does't allow login through terminal  and we give him no access to anythinh just folder to write and read data

/etc: This directory is reserved strictly for static configuration files (text settings like nginx.conf, redis.conf, or minio.conf). 
It is never supposed to hold raw user data, massive media uploads, or databases.
/mnt -: This directory is designed for mounting storage filesystems (like extra hard drives, SSDs, or dedicated cloud storage blocks).


/etc - editable text configuration(system wide sttings files live here) - nginx.conf, valkey.conf
/usr/local/bin - user installed executable(programs downloaded manually instaed of os DNF) - minio
/mnt - mounted storage(Temporary or permanently attached hard drives, SSDs, and storage volumes.) - where avatar images live
/var/log - variable data logs(system and application error logs) - /var/log/nginx/error.log
/home - user personal directories
/usr/bin - primary system executable - onstalled via os pacakege manager

gcs, play, s3 are just default aliases mc ships with out of the box
they allow you to talk





kushdev@fedora:~$ chmod +x mc --downloaded the mc executable file and made it executable used to talk to minio and other s3 servers
kushdev@fedora:~$ sudo mv mc /usr/local/bin/
[sudo] password for kushdev: 
kushdev@fedora:~$ sudo restorecon -v /usr/local/bin/mc  ---this command is used to relabel the security context of the mc executable file in SELinux, ensuring it has the correct permissions and access rights for execution.
Relabeled /usr/local/bin/mc from unconfined_u:object_r:user_home_t:s0 to unconfined_u:object_r:bin_t:s0
kushdev@fedora:~$ # set up the alias (connection to your MinIO instance)
mc alias set local http://localhost:9000 minio-minio-admin YourStrongPassword123! --- used to set up an alias named local for the MinIO server running at http://localhost:9000 with the provided access key and secret key. This allows you to interact with the MinIO server using the mc command-line tool.
mc: Configuration written to `/home/kushdev/.mc/config.json`. Please update your access credentials.
mc: Successfully created `/home/kushdev/.mc/share`.
mc: Initialized share uploads `/home/kushdev/.mc/share/uploads.json` file.
mc: Initialized share downloads `/home/kushdev/.mc/share/downloads.json` file.
Added `local` successfully.
kushdev@fedora:~$ mc ls local
[2026-08-13 13:09:28 EAT]     0B avatars/
kushdev@fedora:~$ mc anonymous set download minio darkness/avatars
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── (q)uit/esc
Name:                                                                                                                                                                                                                    
  mc anonymous - manage anonymous access to buckets and objects                                                                                                                                                          
                                                                                                                                                                                                                         
USAGE:                                                                                                                                                                                                                   
  mc anonymous [FLAGS] set PERMISSION TARGET                                                                                                                                                                             
  mc anonymous [FLAGS] set-json FILE TARGET                                                                                                                                                                              
  mc anonymous [FLAGS] get TARGET                                                                                                                                                                                        
  mc anonymous [FLAGS] get-json TARGET                                                                                                                                                                                   
  mc anonymous [FLAGS] list TARGET                                                                                                                                                                                       
                                                                                                                                                                                                                         
FLAGS:                                                                                                                                                                                                                   
  --recursive, -r                  list recursively                                                                                                                                                                      
  --config-dir value, -C value     path to configuration folder (default: "/home/kushdev/.mc") [$MC_CONFIG_DIR]                                                                                                          
  --quiet, -q                      disable progress bar display [$MC_QUIET]                                                                                                                                              
  --disable-pager, --dp            disable mc internal pager and print to raw stdout [$MC_DISABLE_PAGER]                                                                                                                 
  --no-color                       disable color theme [$MC_NO_COLOR]                                                                                                                                                    
  --json                           enable JSON lines formatted output [$MC_JSON]                                                                                                                                         
  --debug                          enable debug output [$MC_DEBUG]                                                                                                                                                       
  --resolve value                  resolves HOST[:PORT] to an IP address. Example: minio.local:9000=10.10.75.1 [$MC_RESOLVE]                                                                                             
  --insecure                       disable SSL certificate verification [$MC_INSECURE]                                                                                                                                   
  --limit-upload value             limits uploads to a maximum rate in KiB/s, MiB/s, GiB/s. (default: unlimited) [$MC_LIMIT_UPLOAD]                                                                                      
  --limit-download value           limits downloads to a maximum rate in KiB/s, MiB/s, GiB/s. (default: unlimited) [$MC_LIMIT_DOWNLOAD]                                                                                  
  --custom-header value, -H value  add custom HTTP header to the request. 'key:value' format.                                                                                                                            
  --help, -h                       show help                                                                                                                                                                             
                                                                                                                                                                                                                         
PERMISSION:                                                                                                                                                                                                              
  Allowed policies are: [private, public, download, upload].                                                                                                                                                             
                                                                                                                                                                                                                         
FILE:                                                                                                                                                                                                                    
  A valid S3 anonymous JSON filepath.                                                                                                                                                                                    
                                                                                                                                                                                                                         
EXAMPLES:                                                                                                                                                                                                                
  1. Set bucket to "download" on Amazon S3 cloud storage.                                                                                                                                                                
     $ mc anonymous set download s3/mybucket                                                                                                                                                                             
                                                                                                                                                                                                                         
  2. Set bucket to "public" on Amazon S3 cloud storage.                                                                                                                                                                  
     $ mc anonymous set public s3/shared                                                                                                                                                                                 
                                                                                                                                                                                                                         
  3. Set bucket to "upload" on Amazon S3 cloud storage.                                                                                                                                                                  
     $ mc anonymous set upload s3/incoming                                                                                                                                                                               
                                                                                                                                                                                                                         
  4. Set anonymous to "public" for bucket with prefix on Amazon S3 cloud storage.                                                                                                                                        
     $ mc anonymous set public s3/public-commons/images                                                                                                                                                                  
kushdev@fedora:~$ mc alias list -- mc is a cli tool used to talk to s3 servers  like minio, amazon s3
gcs  
  URL       : https://storage.googleapis.com
  AccessKey : YOUR-ACCESS-KEY-HERE
  SecretKey : YOUR-SECRET-KEY-HERE
  API       : S3v2
  Path      : dns
  Src       : /home/kushdev/.mc/config.json

local
  URL       : http://localhost:9000
  AccessKey : minio-minio-admin
  SecretKey : YourStrongPassword123!
  API       : s3v4
  Path      : auto
  Src       : /home/kushdev/.mc/config.json

play 
  URL       : https://play.min.io
  AccessKey : Q3AM3UQ867SPQQA43P2F
  SecretKey : zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG
  API       : S3v4
  Path      : auto
  Src       : /home/kushdev/.mc/config.json

s3   
  URL       : https://s3.amazonaws.com
  AccessKey : YOUR-ACCESS-KEY-HERE
  SecretKey : YOUR-SECRET-KEY-HERE
  API       : S3v4
  Path      : dns
  Src       : /home/kushdev/.mc/config.json

kushdev@fedora:~$ mc anonymous set download local/avatars  -- used to chnage acces s of images in s3 from denied to downloads
Access permission for `local/avatars` is set to `download`
kushdev@fedora:~$ 


"""


# minio upload we upload through frontend for if we use backend it will utilize alot of bandwidth and cpu lets say 100 proplr were uploding  5mb photo
# user clicks add photo file opens and uploads a photo so frontend send the metadata {'file': 'photo.jpg', 'file_ext': 'jpg'} to backend 
# and backend sends a request to minio to generate a presigned url and send it back to frontend and frontend uses that url to upload the photo directly to minio without going through backend

# that url needs to expire as it requires no login it gives one permission to upload to minio for a whhile like 5minutes


######websockets in drf

# we need to use Channels with DRF since normal DRF views sync WSGI handler we need async ASGI for my websookets. thus keeping normal http endpoints as WSGI
# uv add channels daphne channels_redis confluent-kafka
       # adds the third party library to talk to kafka server
       # Django since its built for normal HTTP req-res cycle it can't handle an open 2-way communication
       # Django channels and daphne are ways to bring real-time 2-way comm in django
       # chaneels are an extensions to django that allows Django to handle protocals other than HTTP
       # Daphne acts as the ASGI server that intercepts traffic and figures out websocket connections from normal HTTP

    #   """Client (Browser) ──[ WebSocket Connection ]──> Daphne (ASGI Server) ──> Django Channels (Consumers)"""
       # django channels capture the connection using ASGI routing system and directs it to a python class(consumer)


  # consumers.py is the websockets view, it handles direct, live connection between users browser and django backend
  # with kafka its different
       # client sends message via websocket
       # consumers.py receives and inside acts as the kfka producer publishing it into a kaflka topic
    #server->client : to send message from kafka to browser, you need a long-running background pocess( a kafka consumer.py )
      # kafka consumer runs inside a mangemnt or celery worker contantly listening to kafka topic
      # When a new message arrives in Kafka, this background worker grabs it.
      # The worker uses the Django Channels Channel Layer (channel_layer.group_send) to pass the message over to the WebSocket network.
      # The user's specific consumer.py receives that group message and pushes it down the WebSocket to the browser.



    # use uvicorn_worker the uvicorn.workers is depreceated

    #  CMD ["gunicorn", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", 
    # "--bind", "0.0.0.0:8000", "--limit-concurrency", "1000", "app:app"]  runs 4 gunicorn processes and each has a uvicon workers with async capabilities 1000 connections map Each worker handles up to 1000 concurrent async connections

    # gunicorn creatorProject.asgi:application -k uvicorn.workers.UvicornWorker --workers 4 --bind 0.0.0.0:8000 -k kind of workers to spawn 
    #request.META( info about the request, who sent ip address, authorization ) attached to request before reaches django
    # request.data DRF attches what user submitted to be accessed in views

    # uvicorn creatorProject.asgi:application --host 0.0.0.0 --port 8000 --workers 4 -start uv alone no gunicorn to acts as process manager
    # but uv and gunicoen together is better production worthy 



#     Browser
#   │  GET /ws/chat/lobby/?token=a123   (Upgrade: websocket)
#   ▼
# Nginx        forwards the Upgrade headers
#   ▼
# Uvicorn      parses the request and BUILDS the scope dict
#   ▼
# ProtocolTypeRouter      scope["type"] == "websocket"? go to the websocket branch
#   ▼
# AllowedHostsOriginValidator   checks the Origin header (cheap check first)
#   ▼
# Your JWT middleware           reads the token, ADDS scope["user"]
#   ▼
# URLRouter                     matches the path, ADDS scope["url_route"]
#   ▼
# ChatConsumer                  connect() runs, then accept() (101 Switching Protocols)


# AuthMiddlewareStack reads the Django session cookie from the WebSocket handshake and populates self.scope["user"].
# This works if your WebSocket connection comes from the same domain as your Django app and the browser sends cookies with the upgrade request.




# receive() runs on the sender's consumer. It parses the JSON, checks access, and calls save_message, which writes the message and the notification row to the database.
# group_send("user_<other_id>", {...}) hands the event to Redis. Your code picks the target here by building the group name from other_id. After that, Redis doesn't decide anything. It only looks up who joined that group (recorded earlier by group_add in connect()).
# Every consumer in that group gets the event. If the recipient has two tabs open, both consumers receive it. Channels reads "type": "new_message" and calls the method with that name, new_message(event), on each one. A consumer that never joined the group never sees it.
# new_message forwards the event to the browser. It calls send_json, which writes to that consumer's own WebSocket, so it reaches the recipient's browser.