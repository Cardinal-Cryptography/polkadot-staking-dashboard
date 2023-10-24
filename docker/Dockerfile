FROM node:18-alpine as builder

ARG BUILD_ENVS

# Install any needed packages
RUN apk add curl git gnupg ca-certificates

WORKDIR /apps
COPY . .

RUN yarn install
RUN export $BUILD_ENVS && yarn build

# ===========================================================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/build /usr/share/nginx/html
