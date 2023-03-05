#!/bin/bash

GIT=`which git`
YARN=`which yarn`
NODE=`which node`

CURRENTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PARENTDIR=`dirname $CURRENTDIR`

# Change version
$YARN version --patch --no-git-tag-version

VERSION=`node -p "require('${PARENTDIR}/package.json').version"`
COMPONENT=`node -p "require('${PARENTDIR}/package.json').name"`

# Create tag
$GIT tag v$VERSION

echo "Publishing v${VERSION} of ${COMPONENT}"

# Commit and push changes
$GIT add ../package.json
$GIT commit -m "Published v$VERSION"

# Push tag to trigger build & deployment
$GIT push --tags origin v$VERSION
