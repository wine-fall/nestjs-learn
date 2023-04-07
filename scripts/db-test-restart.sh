pnpm docker compose rm test-db -s -f -v
pnpm docker compose up test-db -d
pnpm sleep 1
pnpm dotenv -e .env.test -- prisma migrate deploy