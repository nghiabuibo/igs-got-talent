FROM node:20.9.0 as builder

# set working directory
WORKDIR /api

# install app dependencies
COPY ./package*.json ./
RUN npm install

# copy source code
COPY ./config ./config
COPY ./server.js ./

COPY ./public/robots.txt ./public/robots.txt
COPY ./src ./src
COPY ./.env* ./

# build admin
RUN npm run build --clean

# start server using pm2
# RUN npm install pm2 -g
# CMD ["pm2-runtime", "start", "server.js"]

# start server using forever
RUN npm install forever -g
CMD ["forever", "server.js"]