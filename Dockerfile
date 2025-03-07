FROM node:18-buster as builder
WORKDIR /home
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN NODE_OPTIONS=--max_old_space_size=4096 pnpm run build

FROM nginx
RUN mkdir /home/dist/
COPY --from=builder /home/dist/ /home/dist/
COPY deployment/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY deployment/config/403.html /home/dist/