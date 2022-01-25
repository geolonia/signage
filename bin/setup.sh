#!/usr/bin/env bash

set -ex

sudo raspi-config nonint do_change_locale ja_JP.UTF-8

sudo apt update
sudo apt upgrade -y

sudo apt purge wolfram-engine scratch nuscratch sonic-pi idle3 smartsim java-common libreoffice* -y

sudo apt install unclutter -y

sudo apt clean
sudo apt autoremove -y

curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install nodejs

sudo rm -f /etc/xdg/lxsession/LXDE-pi/sshpwd.sh

mkdir -p ~/.config/lxsession/LXDE-pi
mkdir -p ~/.config/openbox

rm -fr app
git clone https://github.com/geolonia/signage.git app
cd app
npm install

echo "@openbox-session" > ~/.config/lxsession/LXDE-pi/autostart

cat <<EOS > ~/.config/openbox/autostart
xset -dpms &     # Disable DPMS (Energy Star) features
xset s off &     # Disable screensaver
xset s noblank & # Don't blank video device

unclutter -idle 0 &

cd ~/app
git pull origin main > ~/git.log 2>&1
npm install > ~/npm.log 2>&1
npm run build:style && npm run build
npm run serve > /dev/null 2>&1 &

chromium-browser --noerrdialogs --disable-infobars --gpu --gpu-launcher --in-process-gpu --ignore-gpu-blacklist --ignore-gpu-blocklist --kiosk http://localhost:3000
EOS