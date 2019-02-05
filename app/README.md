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
Open your browser and navigate to http://localhost:8080/industrialcodes
or e.g.
```
curl -i -X GET http://localhost:8080/api/industrialcodes -w "\n"
curl -i -X GET http://localhost:8080/api/industrialcodes/1 -w "\n"
curl \
  --include \
  --header "Content-Type: application/json"  \
  --request POST \
  --data '{"industrialcode":"01.120","description":"Dyrking av ris"}' \
  --url http://localhost:8080/api/industrialcodes \
  --write-out "\n"
```
