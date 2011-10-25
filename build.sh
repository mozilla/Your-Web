#!/bin/bash
echo "Compressing Javascript..."
node r.js -o name=main baseUrl=./assets/js/src paths.requireLib=libs/requirejs/require include=requireLib out=./assets/js/build/app.js
echo "Done!"

echo "Compressing CSS..."
node r.js -o cssIn=./assets/css/src/main.css  out=./assets/css/build/app.css
echo "Done!"