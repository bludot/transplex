#!/bin/bash

if [[ -d "/config/Library/Application Support/Plex Media Server/Plug-ins/Hama.bundle" ]]; then
  echo "dir exists!"
else

  apt update
  apt install git unzip -y
  # service plexmediaserver stop
  cd '/config/Library/Application Support/Plex Media Server/Plug-ins'
  git clone https://github.com/ZeroQI/Hama.bundle.git
  chown -R root:root '/config/Library/Application Support/Plex Media Server/Plug-ins/Hama.bundle'
  chmod 775 -R '/config/Library/Application Support/Plex Media Server/Plug-ins/Hama.bundle'
  
  mkdir -p '/config/Library/Application Support/Plex Media Server/Scanners/Series'
  wget -O '/config/Library/Application Support/Plex Media Server/Scanners/Series/Absolute Series Scanner.py' https://raw.githubusercontent.com/ZeroQI/Absolute-Series-Scanner/master/Scanners/Series/Absolute%20Series%20Scanner.py
  chown -R root:root '/config/Library/Application Support/Plex Media Server/Scanners'
  chmod 775 -R '/config/Library/Application Support/Plex Media Server/Scanners'
  
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/AniDB'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/Plex'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/OMDB'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TMDB'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/blank'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/_cache/fanart/original'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/episodes'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/fanart/original'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/fanart/vignette'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/graphical'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/posters'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/seasons'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/seasonswide'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/TVDB/text'
  mkdir -p '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama/DataItems/FanartTV'
  chown -R root:root '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama'
  chmod 775 -R '/config/Library/Application Support/Plex Media Server/Plug-in Support/Data/com.plexapp.agents.hama'
  #service plexmediaserver restart
fi

tail -f /dev/null