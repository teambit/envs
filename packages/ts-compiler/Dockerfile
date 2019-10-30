FROM node:12.3.1
WORKDIR /app
RUN npm i -g bit-bin
ADD package.json .
ADD tsconfig.json .
ADD src src
ADD test test
ADD package-lock.json .
RUN npm i
CMD npm run test

