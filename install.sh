#!/bin/bash

# Run this script to install the dependencies of the bot, or use it to update the dependencies
# THIS SCRIPT IS IN PROGRESS AND WILL NOT WORK. DO NOT USE THIS YET.

echo -e -n "This script will install the bot. Do you wish to continue? (y/N): "
read -r CONFIRM_INSTALL

if [[ "$CONFIRM_INSTALL" =~ [Yy] ]]; then
    # Update machine repos and software
    sudo apt update
    sudo apt dist-upgrade -y

    sudo apt install git redis build-essential

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

    # Download the RedisJSON code, compile it and then install it into redis
    sudo rm -rf RedisJSON
    git clone https://github.com/RedisJSON/RedisJSON.git
    cd RedisJSON
    git submodule update --init --recursive
    sudo make

    cd ..
    sudo rm -rf RedisJSON

    # Install the bot npm dependencies
    npm install


else
    echo 'Installation cancelled'
fi