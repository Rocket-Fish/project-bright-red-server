FROM node:14

# Create app directory
WORKDIR /adonis/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD package*.json /adonis/

# RUN npm install
# If you are building your code for production
RUN npm ci

# Bundle app source
ADD . /adonis/

EXPOSE 3333
CMD [ "node", "build/server.js" ]