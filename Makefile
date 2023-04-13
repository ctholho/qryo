# Get the workspace url without https://
export WORKSPACE_HOST := $(shell echo $$GITPOD_WORKSPACE_URL | cut -c9- | rev | rev)
# Get local urls or gitpod urls
export DIRECTUS_URL := $(if $(GITPOD_WORKSPACE_URL),https://8055-$(WORKSPACE_HOST),http://localhost:8055)
export NUXT_URL := $(if $(GITPOD_WORKSPACE_URL),https://3000-$(WORKSPACE_HOST),http://localhost:3000)
export WEAR_URL := $(if $(GITPOD_WORKSPACE_URL),https://8080-$(WORKSPACE_HOST),http://localhost:8080)
export DOCS_URL := $(if $(GITPOD_WORKSPACE_URL),https://5173-$(WORKSPACE_HOST),http://localhost:5173)

# HELP
# Display target ## comments as help: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: start-debug
start-debug: # start apps and show docker logs
	docker compose -f server/docker-compose.yaml up

.PHONY: start-barebones
start-barebones:
	docker compose -f server/docker-compose.yaml up -d
	pnpm exec pm2 --name packages start pnpm -- run watch
	cd examples/nuxt && pnpm exec pm2 --name nuxt-example start pnpm -- run dev
	cd examples/wear && pnpm exec pm2 --name wear-example start pnpm -- run start
	pnpm exec pm2 --name docs start pnpm -- run docs:dev

.PHONY: start
start: ## Start developing the app
	@make start-barebones
	@clear
	@echo "Watching \033[32m/packages/**\033[0m and starting example app."
	@echo "⚠️ On Gitpod? These URLs are \033[31mpublicly\033[0m available as long as this workspace is running!\n"
	@echo "Not on Gitpod? Https is not setup."
	@echo "\033[34mNuxt App:\033[0m ${NUXT_URL}"
	@echo "\033[34mWear App:\033[0m ${WEAR_URL}"
	@echo "\033[34mDirectus:\033[0m ${DIRECTUS_URL}"
	@echo "\033[34mDocs:\033[0m ${DOCS_URL}"
	@echo "Login for Directus: admin@example.com, password: admin\n"

.PHONY: init-local
init-local: ## Start a local dev env, as opposed to using gitpod. Requires node, nvm & pnpm
	@pnpm i --shamefully-hoist
	@make start

.PHONY: stop
stop: ## Stop directus and dev server
	@docker compose -f server/docker-compose.yaml down
	@pnpm exec pm2 kill
	@echo "Dev Servers stopped."

.PHONY: reset
reset: ## Prune volumes and clean built packages and examples
	@docker volume prune -f
	@pnpm run clean
	@rm -rf ./examples/nuxt/.nuxt

.PHONY: logs
logs: ## Show logs of packages
	@pnpm exec pm2 logs packages --lines 100

.PHONY: ssh
ssh: ## Connect to gitpod env with SSH.
ifeq ($(GITPOD_WORKSPACE_URL),)
	@echo "Failed, because you're not using gitpod."
	@echo "This command would otherwise return a shell command to connect to the gitpod env from your local machine."
else
	@$(eval HOST_URL := $(shell echo "${GITPOD_WORKSPACE_URL}" | sed 's#.*${GITPOD_WORKSPACE_ID}\(\)#\1#'))
	@echo "Paste the next line into your local shell (SSH key required):"
	@echo "ssh '${GITPOD_WORKSPACE_ID}@${GITPOD_WORKSPACE_ID}.ssh${HOST_URL}'"
	@echo "\nIf you're having problems, see: https://www.gitpod.io/docs/references/ides-and-editors/command-line\n"
endif

.DEFAULT_GOAL := help
