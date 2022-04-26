#!/bin/bash

PWD=$(pwd -P)
if [ -d "${PWD}/../static/dist" ]; then
    rm -rf "${PWD}/../static/dist"
    echo "==> remove dist file if dist file exist"
fi

ng build --build-optimizer --vendor-chunk=true --aot --output-hashing none --output-path ../backend/static/dist