# Aleph Zero Staking Dashboard

## Setup for development
```create .env file with this content: REACT_APP_DISABLE_FIAT=1
npm install --legacy-peer-deps.
npm run start
```

## Environment Variables
Optionally apply the following envrionment variables in an environment file such as `.env` or with `yarn build` to customise the build of staking dashboard:

```
# disable all mentioning of fiat values and token prices
REACT_APP_DISABLE_FIAT=1

# display an organisation label in the network bar
REACT_APP_ORGANISATION="© Cardinal"

# provide a privacy policy url in the network bar
REACT_APP_PRIVACY_URL=https://...

# disable mainnet network (for testnet deployment)
REACT_APP_DISABLE_MAINNET=1


# add connection to a custom network (for example a feature net, local and devnet are avaliable by default in a development build)
REACT_APP_ENABLE_CUSTOM_NETWORK=1
REACT_APP_CUSTOM_WS_ADDRESS=wss://ws.test.azero.dev
```
