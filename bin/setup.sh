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


echo "@openbox-session" > ~/.config/lxsession/LXDE-pi/autostart

cat <<EOS > ~/.config/openbox/autostart
xset -dpms &     # Disable DPMS (Energy Star) features
xset s off &     # Disable screensaver
xset s noblank & # Don't blank video device

unclutter -idle 0 &

# --app を使用しないと settimeout() 等でコンテンツのアップデートができない。 --kiosk は、タイトルバーを非表示にする。
chromium-browser --noerrdialogs --disable-infobars --gpu --gpu-launcher --in-process-gpu --ignore-gpu-blacklist --ignore-gpu-blocklist --kiosk --app="https://geolonia.github.io/signage/#9.72/34.3901/134.0023"
EOS
