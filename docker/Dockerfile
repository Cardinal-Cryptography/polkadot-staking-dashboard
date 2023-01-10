FROM node:18-alpine as builder

# Install any needed packages
RUN apk add curl git gnupg ca-certificates

WORKDIR /apps
COPY . .

RUN npm install --legacy-peer-deps
RUN NODE_ENV=production REACT_APP_DISABLE_FIAT=1 npm run build

# ===========================================================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/build /usr/share/nginx/html
