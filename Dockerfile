FROM node:16.15.1

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package* ./
RUN npm ci

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "npm", "start" ]
