
# Colors
RED			= \033[0;31m
GREEN 	= \033[0;32m
BLUE		= \033[0;34m
CYAN		= \033[0;36m
YELLOW	= \033[0;33m
NC 			= \033[0m

# Import env variables
# include srcs/.env

all: credit env run

env: # Set up environment variables
	@echo "\n${GREEN}Setting up environment variables...${NC}"
	@if [ ! -f ./srcs/.env ]; then cp ./srcs/.env-example ./srcs/.env; fi

credit: # Display credits
	@echo
	@echo "\n${GREEN}Welcome to ft_transcendence!${NC}"

run:
	@echo "\n${GREEN}Running ft_transcendence...${NC}"
	docker-compose -f srcs/docker-compose.yaml up --build # -d

up: # Build and start containers
	@echo "\n${GREEN}Building and starting containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml up -d 

stop: # Stop containers
	@echo "\n${GREEN}Stopping containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml stop

down: # Stop and remove containers
	@echo "\n${GREEN}Stopping and removing containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml down

build: # Build containers
	@echo "\n${GREEN}Building containers...${NC}"
	docker-compose -f srcs/docker-compose.yaml up --build -d

logs: # Display logs
	@echo "\n${GREEN}Displaying logs...${NC}"
	docker-compose -f srcs/docker-compose.yaml logs -f

exec: # Execute command in container
	@echo "\n${GREEN}Executing command in container...${NC}"
	docker-compose -f srcs/docker-compose.yaml exec $(c) $(cmd)

execroot: # Execute command in container as root
	@echo "\n${RED}Executing command in container as root...${NC}"
	docker-compose -f srcs/docker-compose.yaml exec --user root $(c) $(cmd)

execuser: # Execute command in container as user
	@echo "\n${GREEN}Executing command in container as user...${NC}"
	docker-compose -f srcs/docker-compose.yaml exec --user $(USER) $(c) $(cmd)

clean: down # Stop and delete containers and volumes and networks
	@echo "\n${YELLOW}Stopping and removing containers and volumes and networks...${NC}"
	docker-compose -f srcs/docker-compose.yaml rm -fsv

fclean: clean # Stop and delete containers and volumes and networks and images and env files
	@echo "\n${RED}Stopping and removing containers and volumes and networks and images and env files...${NC}"
	docker-compose -f srcs/docker-compose.yaml down --rmi all
	@# rm -rf ./srcs/.env

re: fclean all # Rebuild everything
