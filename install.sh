#!/bin/bash

# Run this script to install the bot fully.
# Use curl <LINK TO THIS RAW FILE HERE> | bash
# THIS SCRIPT IS IN PROGRESS AND MAY NOT WORK. If it doesn't just do things manually, sorry. :(

echo -e -n "This script will install the bot. Do you wish to continue? (y/N): "
read -r CONFIRM_INSTALL

if [[ "$CONFIRM_INSTALL" =~ [Yy] ]]; then
    # Update machine repos and software
    sudo apt update
    sudo apt dist-upgrade -y

    sudo apt install git redis build-essential

    # Clone the bot repository
    git clone https://github.com/jack3898/discord-youtube-bot
    cd discord-youtube-bot

    # Install nvm (Node Version Manager)
    curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

    # Install the latest stable release of Node.js
    nvm install stable -y

    # Install Rust, needed to compile the RedisJSON module
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env

    # Download the RedisJSON code, compile it and then install it into this project
    sudo rm -rf RedisJSON
    git clone https://github.com/RedisJSON/RedisJSON.git
    cd RedisJSON
    git submodule update --init --recursive
    sudo make setup
    make
    cd ..
    sudo mkdir /etc/redis/redis_modules
    mv RedisJSON/target/release/rejson.so /etc/redis/redis_modules/rejson.so
    sudo rm -rf RedisJSON
    sudo bash -c "echo \"loadmodule /etc/redis/redis_modules/rejson.so\" >> /etc/redis/redis.conf"

    # Install the bot npm dependencies
    npm install
    sudo service redis-server start

    echo "Installation complete. Now, just type 'npm run bot'!"
    echo "Make sure sure you have the following environment variables: DISCORD_TOKEN and GOOGLE_API_TOKEN."
else
    echo 'Installation cancelled'
fi
