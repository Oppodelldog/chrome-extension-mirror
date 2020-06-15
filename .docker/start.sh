#!/bin/bash

sudo sysctl -w fs.inotify.max_user_watches=20000
yarn start