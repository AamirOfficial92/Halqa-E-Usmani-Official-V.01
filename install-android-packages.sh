#!/usr/bin/env bash
set -e

echo "Starting Android SDK packages installation..."

# Define paths
export ANDROID_HOME=/opt/android-sdk
SDKMANAGER=$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager

echo "Using sdkmanager at $SDKMANAGER"

# 1. Accept licenses
echo "Accepting Android SDK licenses..."
yes | $SDKMANAGER --licenses

# 2. Install platforms, build-tools, and platform-tools
echo "Installing platform;android-34, build-tools;34.0.0, platform-tools..."
$SDKMANAGER --install "platforms;android-34" "build-tools;34.0.0" "platform-tools"

echo "Android SDK packages successfully installed."
