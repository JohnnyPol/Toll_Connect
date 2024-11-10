# Docker Version of auto-tool

## Requirements
Docker Engine and CLI

## How to use

Setup VPN credentials:
They are stored in a plain text file (not tracked by git). Create the file `vpn-auth.txt` and in it put your credentials like:
```
USERNAME
PASSWORD
```

Build the image
```
docker build -t ai-log-auto-tool .
```

Run the application (spin up a container)
```
docker run -v $(pwd)/..:/usr/src/app/output --dns 8.8.8.8 -it --privileged --rm ai-log-auto-tool create
```

This first sets up the vpn connection and then starts the auto-tool. 
At the end you can submit to the ailog server by entering your credentials again.
