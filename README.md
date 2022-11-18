# Shopizer Administration (shopizer-admin) Angular web app

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/twlabs/Retail---Marketplace-SellerPortalFrontEnd/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/twlabs/Retail---Marketplace-SellerPortalFrontEnd/tree/main)

## Tested with node v12.22.7

Requires Angular cli installed (npm install -g @angular/cli@13.3.x)

# Set backend api

## Run locally

npm install --legacy-peer-deps

ng serve -o

http://localhost:4200

## Build app

ng build

## Run docker images

Assumes your backend runs on http://localhost:8080

```
docker run \
-e "APP_BASE_URL=http://localhost:9090/api" \
-it --rm -p 4200:80 shopizerecomm/shopizer-admin
```

Username: admin@shopizer.com

Password: password
