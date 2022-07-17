# Migrate the production database. This will apply any missing migrations
prisma migrate deploy

# Run pm2 on src/server.ts and keep the process alive, utilizing 4 CPU threads
export NODE_ENV=production
pm2-runtime dist/src/server.js -i 4