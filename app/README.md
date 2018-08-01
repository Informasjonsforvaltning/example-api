# An example API implementation

To run the example API, do the following:
```
git clone https://github.com/Informasjonsforvaltning/example-api.git
cd example-api/app
npm install
npm run dev
```
The example-API is also available as a docker-image. To run it:
```
docker run -d -p 8080:8080 informasjonsforvaltning/example-api
```
Open your browser and navigate to http://localhost:8080/pets
or e.g.
```
curl -i -X GET http://localhost:8080/pets
curl -i -X GET http://localhost:8080/pets/1
```
