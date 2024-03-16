# Build stage

FROM node:18 as build

WORKDIR /usr/src/my-app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Product stage

FROM node:18 as production

WORKDIR /usr/src/my-app

# Build stage의 build파일을 복사해서 build경로에 넣는다.
COPY --from=Build ./usr/src/my-app/build ./build
COPY --from=build ./usr/src/my-app/package.json ./package.json
COPY --from=build ./usr/src/my-app/package-lock.json ./package-lock.json

RUN npm install --only=production

CMD ["node","build/index.js"]