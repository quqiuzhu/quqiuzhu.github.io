#!/bin/bash

# docker & compose
yum install -y docker
service docker start
curl -L https://github.com/docker/compose/releases/download/1.8.0/run.sh > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# login & pull image
echo please input docker login password:
docker login -uquqiuzhu || exit 1
docker pull quqiuzhu/sss
docker pull quqiuzhu/setup

# python tools
curl https://bootstrap.pypa.io/get-pip.py | python
pip install requests
pip install pyyaml
pip install fabric==1.14.0
pip install python-crontab

# setup service
docker run --rm --volume=/root/app:/source quqiuzhu/setup
fab -f /root/app/service.py register
fab -f /root/app/service.py crontab
