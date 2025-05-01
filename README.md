# better-maps
A quick way to add pin-points to a map, with details, filters and more. Made for my gf

## Get started
```pwsh
git clone https://github.com/EDM115/better-maps.git
cd better-maps
```
Create a `.env` file in the root directory and add the following variables :
```env
JWT_SECRET=4451b7b6411db0854895824f2fce24721989ac47da45c862cb1baf15383dbc6ef07c1f700304693dde08207bcf75e7e50ad9b146e8bdc4ebf16ade6e6cb9f173
SEED_USERS='[{"username": "admin", "password": "admin", "role": "admin"}, {"username": "test", "password": "test", "role": "user"}]'
SEED=false
```
For the `JWT_SECRET`, generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.  If any value in the `SEED_USERS` should contain a quote, write instead `\'` (or `\"`)
```pwsh
pnpm i
pnpm dev
```

## Build and run
```pwsh
docker build -t edm115/better-maps .
docker run -d -p 27400:27400 --name better-maps edm115/better-maps
```

## DB Scheme
### User
| Column   | Type   |
| :------- | :----- |
| id       | int    |
| username | string |
| password | string |
| role     | string |

## Dev left to do
- [ ] **Mobile first**
- [ ] Use volumes for the DB file
- [ ] Small add user button for admin
- [ ] Add a map with Nuxt Scripts and use the Maps JS API/SDK
- [ ] Ability to add and save a point on the map
  - [ ] Name (autocomplete/bare address if not found)
  - [ ] Description (optional)
  - [ ] Color + Icon (house, caddie, book, handbag, pizza, ...)
- [ ] Ability to add public transportation lines
- [ ] Show/hide any point/line
- [ ] On load : show an overview of the area
- [ ] Each user is linked to a map, a map can have multiple users
