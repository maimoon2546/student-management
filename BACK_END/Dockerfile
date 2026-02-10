# -------- Base image --------
FROM node:latest
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN npm run build


EXPOSE 3001

CMD ["npm", "start"]