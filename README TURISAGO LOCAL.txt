PROYECTO TURISTICO MICROSERVICIOS
INICAR XAMPP
MYSQL -> Back
POTSGRESS -> BI

-------------------------------------

INICIAR BI
turisago-bi-service

cd turisago-bi-service
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload


--------------------------------------
BACKEND
client-service

cd cliente-service
mvn spring-boot:run

--------------------------------------
FRONTEND
client-front

cd client-front
npm run dev

----------------------------------------

APP MOVIL
Correr en el celular misma wifi