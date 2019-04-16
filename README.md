# Exit Pass System

Exit Pass System is a web application for recording students' exit and return record. Students should tap their RFID student card on the card reader, which is connected to the iPad.

The iPad is using [Kiosk Pro](https://www.kioskproapp.com/) as a web browser. A credential key is added to Kiosk Pro so only iPads with a key can access the Exit Pass System.

# Getting Started

## Prerequisites

This product requires the following software and requirements:

Software :
* Docker
* Nginx
* Mysql
* Kiosk Pro Basic Version

Hardware :
* Card Reader
* RFID Card

## Docker config

Change ports to an available port in your computer

    # docker-compose.yml
    ...
    nginx:
    ...
        ports:
            - '{{available_port}}:80'


## Nginx config

Copy exitpass.conf to your `nginx/conf.d` folder,

## Create alias to domain name in `/etc/hosts`

The name we are using is `exitpass.com`

    # exitpass.conf
    
    server{ 
        listen       80;
        # You can change the server_name
        server_name  exitpass.com;

So insert an alias to `/etc/hosts`

    # /etc/hosts

    127.0.0.1       exitpass.com

## Build and Run

Run command 

    sh rebuild.sh

After the project is built,

Enter your domain name alias ( which is `exitpass.com` as default).

# Demo

Forbbiden

![](https://media.giphy.com/media/ic6dFCpf78auhfssy8/giphy.gif)

Exit and Return

![](https://media.giphy.com/media/fXzYSOGwy4t66aU3mH/giphy.gif)