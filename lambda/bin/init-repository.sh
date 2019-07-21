#!/bin/bash

echo Initializing repository to dir $1

if [ "$1" == "" ]; then
	echo SYNTAX: init-repository.sh [TARGET_DIR]
	exit -1
fi

if test -d "${1%/}/"; then
    echo Using target directory $1
else
    echo $1 is not a directory
    exit -1
fi

# Files to copy to the target dir: package.json, tsconfig.json, webpack.config.js, src/index.ts, index.test.ts, handler.test.ts
# tslint.json, babel.config.js

to_copy="./package.json ./tsconfig.json tsconfig.json tslint.json webpack.config.js babel.config.js src/index.ts"
to_copy_src="index.ts index.test.ts handler.test.ts"

for f in $to_copy; do
    echo Copying $f to ${1%/}/
    cp $f ${1%/}/
done

mkdir ${1%/}/src

for f in $to_copy_src; do
    echo Copying $f to ${1%/}/
    cp ./src/${f} ${1%/}/src/
done

