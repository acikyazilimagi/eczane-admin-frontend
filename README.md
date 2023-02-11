# eczane-admin-frontend

### Run Locally

Build: `docker build -t eczane-admin-panel .`

Run: `docker compose up -d`
Run: `docker run -d --rm -p 5173:5173 --name eczane-admin eczane-admin-panel:latest`


GitHub ci/cd action is running. 

For deployment: please push codes into main branch then create a pull request to prod. When pr merged to 
prod ci cd will run automatically. If you have any problem about production and ci&cd pipeline please inform 
Cloud & Devops Team -> #cloud-public discord channel
