NAME 		= PONGTIME

# Colors
RED			= \033[0;31m
GREEN 	= \033[0;32m
BLUE		= \033[0;34m
CYAN		= \033[0;36m
YELLOW	= \033[0;33m
PURPLE	= \033[0;35m
NC 			= \033[0m

INFO 		= $(CYAN)[INFO]$(NC)
SUCCESS = $(GREEN)[SUCCESS]$(NC)
WARNING = $(YELLOW)[WARNING]$(NC)
ERROR 	= $(RED)[ERROR]$(NC)
PROJECT = $(PURPLE)[$(NAME)]$(NC)

define print_credit
	@echo
	@printf "$(PURPLE)"
	@printf "██████╗  ██████╗ ███╗   ██╗ ██████╗████████╗██╗███╗   ███╗███████╗\n"
	@printf "██╔══██╗██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██║████╗ ████║██╔════╝\n"
	@printf "██████╔╝██║   ██║██╔██╗ ██║██║  ███╗  ██║   ██║██╔████╔██║█████╗ \n"
	@printf "██╔═══╝ ██║   ██║██║╚██╗██║██║   ██║  ██║   ██║██║╚██╔╝██║██╔══╝ \n"
	@printf "██║     ╚██████╔╝██║ ╚████║╚██████╔╝  ██║   ██║██║ ╚═╝ ██║███████╗ \n"
	@printf "╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝ \n"
	@printf "%35s: $(CYAN)%s - %s - %s$(NC)\n" "By" "fathjami" "ael-khni" "zsarir"
	@printf "\n$(NC)"
	@echo
endef

define copy_env
	@if [ ! -f ./srcs/.env ]; then \
		printf "$(INFO) $(PROJECT): Copying .env file from .env.example\n"; \
			cp ./srcs/.env.example ./srcs/.env; \
	else \
		printf "$(INFO) $(PROJECT): $(WARNING) The .env file already exists.\n"; \
	fi
endef

define install_dependencies
	@printf "$(INFO) $(PROJECT): Installing dependencies\n"
	@npm install --prefix ./srcs/frontend 
	@npm install --prefix ./srcs/backend
endef

define remove_dependencies
	@printf "$(INFO) $(PROJECT): Removing dependencies\n"
	@rm -rf ./srcs/frontend/node_modules
	@rm -rf ./srcs/backend/node_modules
endef

.PHONY: all clean fclean re restart log ps

all: $(NAME)

$(NAME): 
	$(call print_credit)
	$(call copy_env)

	docker-compose -f srcs/docker-compose.yml up --force-recreate --build -d

	@printf "$(PROJECT) $(SUCCESS): build completed\n"

clean:
	@printf "$(PROJECT) $(INFO): $(WARNING) Removing all containers\n"
	docker-compose -f srcs/docker-compose.yml down -v --remove-orphans
	$(call remove_dependencies)
	@rm -rf ./srcs/.env
	@printf "$(PROJECT) $(SUCCESS): $@ completed\n"

fclean: clean
	@printf "$(PROJECT) $(INFO): $(WARNING) Purging all containers, images, volumes and networks\n"
	docker system prune --volumes --all --force
	docker network prune --force
	docker volume prune --force
	@printf "$(PROJECT) $(SUCCESS): $@ completed\n"

restart	:
	@printf "$(PROJECT) $(INFO): $(WARNING) Restarting all containers\n"
	docker-compose -f srcs/docker-compose.yml restart
	@printf "$(PROJECT) $(SUCCESS): $@ completed\n"

log:
	@printf "$(PROJECT) $(INFO): Showing logs\n"
	docker-compose -f srcs/docker-compose.yml logs -f
	@printf "$(PROJECT) $(SUCCESS): $@ completed\n"

ps:
	@printf "$(PROJECT) $(INFO): Showing containers status\n"
	docker-compose -f srcs/docker-compose.yml ps
	@printf "$(PROJECT) $(SUCCESS): $@ completed\n"

re: clean all

frontend:
	$(call copy_env)
	docker-compose -f srcs/docker-compose.yml up --build frontend

backend:
	$(call copy_env)
	docker-compose -f srcs/docker-compose.yml up --build backend

update-db:
	$(call copy_env)
	docker-compose -f srcs/docker-compose.yml exec backend npx prisma db push