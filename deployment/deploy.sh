#!/bin/bash

PWD=$(pwd -P)
if [ -d "${PWD}/../static/dist" ]; then
    rm -rf "${PWD}/../backend/static/dist"
    echo "==> remove dist file if dist file exist"
fi

cd "${PWD}/../frontend"
ng build --build-optimizer --vendor-chunk=true --aot --output-hashing none --output-path dist

docker
