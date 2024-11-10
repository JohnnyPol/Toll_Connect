#!/bin/bash

openvpn --config /etc/openvpn/config.ovpn &
until ip a | grep tun0; do echo "Waiting for VPN..."; sleep 1; done

node tool $@
