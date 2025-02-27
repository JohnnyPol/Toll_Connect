# Use an official Node.js image as the base
FROM node:18-slim

# RUN apk update && apk add openvpn
RUN apt update && apt install -y vim openvpn iproute2 bind9-dnsutils

# Create a directory for the app
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install 

COPY ntua.ovpn /etc/openvpn/config.ovpn

COPY vpn-auth.txt /etc/openvpn/vpn-auth.txt
RUN chmod 600 /etc/openvpn/vpn-auth.txt

# Copy the rest of the application code
COPY . .

RUN chmod +x vpn_init.sh

# Set the command to run your CLI
ENTRYPOINT ["./vpn_init.sh"]
