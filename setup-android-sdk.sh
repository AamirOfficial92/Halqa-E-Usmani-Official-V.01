#!/usr/bin/env bash
set -e

echo "Starting Android SDK setup..."

# 1. Create directories
mkdir -p /opt/android-sdk/cmdline-tools

# 2. Download Android Command Line Tools
echo "Downloading command line tools..."
wget -q -O /tmp/cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# 3. Unzip
echo "Extracting command line tools..."
unzip -q /tmp/cmdline-tools.zip -d /opt/android-sdk/cmdline-tools

# 4. Re-organize directories so that we have cmdline-tools/latest
echo "Organizing cmdline-tools directories..."
mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest

# 5. Clean up zip
rm -f /tmp/cmdline-tools.zip

# 6. Verify sdkmanager exists
if [ -f "/opt/android-sdk/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "sdkmanager successfully installed at /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager"
else
    echo "Error: sdkmanager not found!"
    exit 1
fi

echo "Android SDK CLI Tools setup complete."
