#!/bin/bash

if ! command -v terser &> /dev/null; then
    echo "Installing terser..."
    npm install -g terser
fi

if ! command -v cssnano &> /dev/null; then
    echo "Installing cssnano-cli..."
    npm install -g cssnano-cli
fi

echo "Minifying script.js with terser..."
terser script.js --compress --mangle --output script.min.js
echo "✓ Minified script.js -> script.min.js"

echo "Minifying styles.css with cssnano..."
cssnano styles.css styles.min.css
echo "✓ Minified styles.css -> styles.min.css"

echo ""
echo "All minification complete"