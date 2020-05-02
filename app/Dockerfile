# setup react production build
FROM node:13-alpine as builder

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v1.19.0 works with Chromium 77.
RUN npm install puppeteer@1.19.0

WORKDIR /wise-old-man/app
COPY package.json ./
RUN npm install
COPY . .
ARG REACT_APP_ANALYTICS_TRACKING_ID
RUN npm run build

#setup nginx
FROM nginx:alpine
COPY /nginx.conf /etc/nginx/conf.d/
COPY --from=builder /wise-old-man/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]