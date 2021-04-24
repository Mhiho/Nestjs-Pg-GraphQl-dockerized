FROM node:14 as development

WORKDIR /michal/src/api

COPY package*.json ./

# Install npm packages
RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /michal/src/api/dist ./dist

CMD ["node", "dist/main"]