# 🚀 Comandos Rápidos de Despliegue (Copiar y Pegar)

El enlace de clonado **nunca cambia**, siempre es:
`https://github.com/mildred93-code/Taller3M.git`

*(Los comandos incluyen verificación e instalación automática de Git por si la máquina no lo tuviera).*

---

### 1️⃣ Máquina de Base de Datos (PostgreSQL)
Copia y pega esto en la terminal:
```bash
which git >/dev/null 2>&1 || (sudo apt-get update -y && sudo apt-get install -y git); git clone https://github.com/mildred93-code/Taller3M.git 2>/dev/null || (cd Taller3M && git pull); cd Taller3M/scripts && bash setup-db.sh
```
> 📋 **Al finalizar:** Te mostrará en pantalla: `IP Privada de esta máquina: 172.31.X.X`. Cópiala.

---

### 2️⃣ Máquina de Backend (Node.js API)
Copia y pega esto en la terminal:
```bash
which git >/dev/null 2>&1 || (sudo apt-get update -y && sudo apt-get install -y git); git clone https://github.com/mildred93-code/Taller3M.git 2>/dev/null || (cd Taller3M && git pull); cd Taller3M/scripts && bash setup-backend.sh
```
> 📋 Te pedirá pegar la IP Privada de la BD.
> Al finalizar te mostrará: `IP Pública de esta máquina: 54.X.X.X`. Cópiala.

---

### 3️⃣ Máquina de Frontend (Vite + React)
Copia y pega esto en la terminal:
```bash
which git >/dev/null 2>&1 || (sudo apt-get update -y && sudo apt-get install -y git); git clone https://github.com/mildred93-code/Taller3M.git 2>/dev/null || (cd Taller3M && git pull); cd Taller3M/scripts && bash setup-frontend.sh
```
> 📋 Te pedirá pegar la IP Pública del Backend.
> Al finalizar te dará el link listo para abrir en tu navegador: `http://54.X.X.X:5173`.
