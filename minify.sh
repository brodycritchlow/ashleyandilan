#!/bin/bash

if ! command -v terser &> /dev/null; then
    echo "Installing terser..."
    npm install -g terser
fi

echo "Minifying script.js with terser..."
terser script.js --compress --mangle --output script.min.js

echo "✓ Minified script.js -> script.min.js"