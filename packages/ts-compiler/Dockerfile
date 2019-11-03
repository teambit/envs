FROM node:12.3.1

WORKDIR /app
RUN npm i -g bit-bin
ADD package-lock.json .
ADD package.json .
RUN npm i
ADD tsconfig.json .
ADD src src
ADD test test
RUN node_modules/.bin/tsc 
CMD npm run test

