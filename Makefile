
# Colors
RED			= \033[0;31m
GREEN 	= \033[0;32m
BLUE		= \033[0;34m
CYAN		= \033[0;36m
YELLOW	= \033[0;33m
NC 			= \033[0m

all: credit env run

env:
	@echo "\n${GREEN}Setting up environment variables...${NC}"
	@if [ ! -f ./srcs/.env ]; then cp ./srcs/.env-example ./srcs/.env; fi

credit:
	@echo
	@echo "\n${GREEN}Welcome to ft_transcendence!${NC}"

run:
	@echo "\n${GREEN}Running ft_transcendence...${NC}"
	docker-compose -f srcs/docker-compose.yaml up --build

up:
	@echo "\n${GREEN}Building and starting containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml up -d 

stop:
	@echo "\n${GREEN}Stopping containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml stop

down:
	@echo "\n${GREEN}Stopping and removing containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml down

build:
	@echo "\n${GREEN}Building containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml up --build -d

logs:
	@echo "\n${GREEN}Displaying logs...${NC}"
	docker-compose -f srcs/docker-compose.yaml logs -f

exec:
	@echo "\n${GREEN}Executing command in container...${NC}"
	docker-compose -f srcs/docker-compose.yaml exec $(c) $(cmd)

execroot:
	@echo "\n${RED}Executing command in container as root...${NC}"
	docker-compose -f srcs/docker-compose.yaml exec --user root $(c) $(cmd)

execuser:
	@echo "\n${GREEN}Executing command in container as user...${NC}"
	docker-compose -f srcs/docker-compose.yaml exec --user $(USER) $(c) $(cmd)

clean: down
	@echo "\n${YELLOW}Stopping and removing containers and volumes and networks...${NC}"
	docker-compose -f srcs/docker-compose.yaml rm -fsv

fclean: clean
	@echo "\n${RED}Stopping and removing containers and volumes and networks and images and env files...${NC}"
	docker-compose -f srcs/docker-compose.yaml down --rmi all
	@# rm -rf ./srcs/.env

frontend: # todo: remove this
	# @if [ ! -f ./srcs/.env ]; then cp ./srcs/.env-example ./srcs/.env; fi
	# rm -rf ./srcs/requirements/frontend/node_modules
	docker-compose -f srcs/docker-compose.yaml up --build frontend

backend: # todo: remove this
	@if [ ! -f ./srcs/.env ]; then cp ./srcs/.env-example ./srcs/.env; fi
	rm -rf ./srcs/requirements/backend/node_modules
	docker-compose -f srcs/docker-compose.yaml up --build backend

prune:
	docker system prune -a

re: fclean all
