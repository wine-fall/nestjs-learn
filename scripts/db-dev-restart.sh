pnpm docker compose rm dev-db -s -f -v
pnpm docker compose up dev-db -d
pnpm sleep 1
pnpm prisma migrate deploy