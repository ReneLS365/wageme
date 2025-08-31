.PHONY: dev build test typecheck lint e2e db\:migrate db\:seed db\:reset deploy

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

typecheck:
	npm run typecheck

lint:
	npm run lint

e2e:
	npm -w apps/web run test:e2e

db\:migrate:
	npm run db:migrate

db\:seed:
	npm run db:seed

db\:reset:
	npm run db:reset

deploy:
	npm run deploy
