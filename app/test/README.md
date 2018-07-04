# Tests

To test the example API, do the following:
```
git clone https://github.com/Informasjonsforvaltning/eksempel-api.git
cd eksempel-api/app
npm install
npm run dev #in a dedicated shell
npm test
```

Useful curl for testing POST:
```
curl \
  --header "Content-Type: application/json"  \
  --request POST \
  --data '{"name":"Garfield","species":"cat"}' \
  http://localhost:8080/pets
```
