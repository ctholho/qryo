# Get the workspace url without https://
export WORKSPACE_HOST := $(shell echo $$GITPOD_WORKSPACE_URL | cut -c9- | rev | rev)

# HELP
# Display target ## comments as help: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: start-debug
start-debug: # start shift app but show docker logs
	docker compose -f directus/docker-compose.yaml

.PHONY: start-barebones
start-barebones:
	docker compose -f directus/docker-compose.yaml up -d
	cd nuxt-example && yarn dev

.PHONY: start
start: ## Run the shift app
	make start-barebones
	@clear
	@echo "⚠️ These URLs are \033[31mpublicly\033[0m available as long as this workspace is running!\n"
	@echo "\033[34mNuxt App:\033[0m $(shell gp url 3000)"
	@echo "\033[34mDirectus:\033[0m $(shell gp url 8055)\n"

.PHONY: stop
stop: ## Stop directus and dev server
	docker compose -f directus/docker-compose.yaml down
	@echo "Dev Servers stopped."

.PHONY: ssh
ssh: ## Connect terminal via SSH (with SSH Key)
	@$(eval HOST_URL := $(shell echo "${GITPOD_WORKSPACE_URL}" | sed 's#.*${GITPOD_WORKSPACE_ID}\(\)#\1#'))
	@echo "Paste the next line into your local shell (SSH key required via gitpod.io):"
	@echo "ssh '${GITPOD_WORKSPACE_ID}@${GITPOD_WORKSPACE_ID}.ssh${HOST_URL}'"

.DEFAULT_GOAL := help