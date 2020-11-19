#!/bin/sh
mkdir -p dist/static/css dist/static/js dist/res

cp src/js/*.js dist/static/js
cp src/css/*.css dist/static/css
cp res/* dist/res

rm -rf example/image-gallery
cp -r dist example/image-gallery
