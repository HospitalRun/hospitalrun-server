#!/usr/bin/env bash

set -x
set -e

TAG="${TRAVIS_TAG}"
COMMIT="${TRAVIS_COMMIT}"
BRANCH="${TRAVIS_BRANCH}"
PR="${TRAVIS_PULL_REQUEST}"


if [ -z "${TAG}" ]; then
    echo "No tags, tagging as: ${COMMIT}"
    TAG="${COMMIT}"
fi

export TAG=$TAG

if [ "$TRAVIS_BRANCH" == "master" ]; then
    docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";

    docker-compose build
    docker tag "${PROJECT_NAME}:latest" "${DOCKER_IMAGE_REPO}/${PROJECT_NAME}:${TAG}"
    docker push "${DOCKER_IMAGE_REPO}/${PROJECT_NAME}:${TAG}"

    # Push Logstash
    docker tag "${PROJECT_NAME}_logstash:latest" "${DOCKER_IMAGE_REPO}/${PROJECT_NAME}_logstash:${TAG}"
    docker push "${DOCKER_IMAGE_REPO}/${PROJECT_NAME}_logstash:${TAG}"

    # Push Nginx
    docker tag "${PROJECT_NAME}_nginx:latest" "${DOCKER_IMAGE_REPO}/${PROJECT_NAME}_nginx:${TAG}"
    docker push "${DOCKER_IMAGE_REPO}/${PROJECT_NAME}_nginx:${TAG}"


    else echo "Branch is not a baseline branch. No build will be made or pushed to the repository"
fi