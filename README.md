<div align="center">

<img src="https://raw.githubusercontent.com/EDM115/better-maps/master/public/images/logo.webp" alt="Better Maps" width="300" height="300">

# better-maps
A quick way to add pin-points to a map, with details, filters and more.  
Made for my gf

</div>

## What is it ?
Basically we needed a way to add custom points on a map. Google Maps works great but the customization is limited, and the UI isn't the best.  
With this app, all you need is to add a point, with a custom name, description and icon/color.  
Search for an existing place or enter an address.  
Toggle the visibility of each point/group of points.  
Toggle the visibility of certain lines of public transportation.  
Every user can access their own map, and a map can be used collaboratively by multiple users.

## Get started
```pwsh
git clone https://github.com/EDM115/better-maps.git
cd better-maps
```
Create a `.env` file in the root directory and add the following variables :
```env
JWT_SECRET=4451b7b6411db0854895824f2fce24721989ac47da45c862cb1baf15383dbc6ef07c1f700304693dde08207bcf75e7e50ad9b146e8bdc4ebf16ade6e6cb9f173
SEED_USERS='[{"username": "admin", "password": "admin", "role": "admin"}, {"username": "test", "password": "test", "role": "user"}]'
SEED=true
GOOGLE_MAPS_API_KEY=Abc-Def123
STARTING_POINT=48.8566,2.3522,3
```
- `JWT_SECRET` : generate with `node -e "import('crypto').then(crypto => console.log(crypto.randomBytes(64).toString('hex')))"`
- `SEED_USERS` : if any value should contain a quote, write instead `\'` (or `\"`)
- `STARTING_POINT` : the starting point of the map, in the format `lat,lng,zoom`
```pwsh
node --experimental-strip-types init/seed_db.ts
```
Put `SEED` to `false` once the DB is seeded.
```pwsh
pnpm i
pnpm dev
```

## Build and run
```pwsh
docker build --network=host -t edm115/better-maps .
docker run -d -p 27400:27400 --env-file .env --name better-maps edm115/better-maps
```

## DB Scheme
### User
| Column   | Type   | Extra                                 |
| :------- | :----- | :------------------------------------ |
| id       | int    | Primary Key, Autoincrement            |
| username | string | Not Null, Unique                      |
| password | string | Not Null                              |
| role     | string | Not Null, "admin" or "user" (default) |

### Map
| Column     | Type  | Extra                                  |
| :--------- | :---- | :------------------------------------- |
| id         | int   | Primary Key, Autoincrement             |
| user_id    | int   | Foreign Key, Not Null, can be multiple |
| start_lat  | float | Not Null                               |
| start_lng  | float | Not Null                               |
| start_zoom | int   | Not Null                               |

### Point
| Column      | Type   | Extra                       |
| :---------- | :----- | :-------------------------- |
| id          | int    | Primary Key, Autoincrement  |
| name        | string | Not Null                    |
| description | string | Not Null, default ""        |
| lat         | float  | Not Null                    |
| lng         | float  | Not Null                    |
| color       | string | Not Null, default "#FFB86C" |
| icon        | string | Not Null, default "house"   |
| map_id      | int    | Foreign Key, Not Null       |
| visible     | bool   | Not Null, default true      |

### Line
| Column      | Type   | Extra                       |
| :---------- | :----- | :-------------------------- |
| id          | int    | Primary Key, Autoincrement  |
| name        | string | Not Null                    |
| description | string | Not Null, default ""        |
| color       | string | Not Null, default "#8BE9FD" |
| map_id      | int    | Foreign Key, Not Null       |
| visible     | bool   | Not Null, default true      |

## Dev left to do
- [x] **Mobile first**
- [ ] Use volumes for the DB file
- [ ] Small add user button for admin
- [x] Add a map with Nuxt Scripts and use the Maps JS API/SDK
- [ ] Ability to add and save a point on the map
  - [x] Name (autocomplete/bare address if not found)
  - [x] Description (optional)
  - [x] Color + Icon (house, caddie, book, handbag, pizza, ...)
- [ ] Ability to add public transportation lines
- [ ] Show/hide any point/line
- [ ] On load : show an overview of the area
- [ ] Each user is linked to a map, a map can have multiple users
