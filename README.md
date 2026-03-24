# Crushing Plant animation
 
Angular 19, ASP.NET Core 9, PostgreSQL, all containerized with Docker.
 
## Quick Start
 
**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)
 
1. Clone the repository:
   ```bash
   git clone https://github.com/NazarPetrakov/CrushingPlant.git
   cd CrushingPlant
   ```
 
2. Create `.env` next to `docker-compose.yaml`:
   ```
   POSTGRES_PASSWORD=password
   DEFAULT_DB_NAME=crushing_db
   ```
 
3. Build and run:
   ```bash
   docker-compose up -d --build
   ```
 
## Services
 
| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost      |
| API      | http://localhost:5000 |
| Adminer  | http://localhost:8081 |
 
### Connecting to the DB via Adminer
 
Open http://localhost:8081 and log in with:
 
| Field    | Value                          |
|----------|--------------------------------|
| System   | PostgreSQL                     |
| Server   | `db`                           |
| Username | `postgres`                     |
| Password | your `POSTGRES_PASSWORD`       |
| Database | your `DEFAULT_DB_NAME`         |
 
## Database
 
SQL scripts in `./CrushingPlant/CrushingPlantApi/Infrastructure/Database/Scripts` are auto-mounted and run on first start to create and seed tables.
 
To reset:
```bash
docker-compose down -v
docker-compose up -d
```
 
