#!/bin/bash

sudo curl --silent --location https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum -y install nodejs

sudo npm install -g pnpm

cd /var/app/staging/

pnpm install

pnpm build

chown -R webapp:webapp node_modules/ || true # allow to fail