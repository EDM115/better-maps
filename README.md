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
SEED_ICONS='[{"name": "Home", "color": "#50FA7B", "icon": "mdi-home-outline"}, {"name": "Groceries", "color": "#8BE9FD", "icon": "mdi-cart-outline"}, {"name": "Schools", "color": "#FF79C6", "icon": "mdi-book-open-variant-outline"}, {"name": "Work", "color": "#BD93F9", "icon": "mdi-bag-personal-outline"}, {"name": "Food", "color": "#F1FA8C", "icon": "mdi-food-outline"}]'
SEED=true
GOOGLE_MAPS_API_KEY=Abc-Def123
STARTING_POINT=48.8566,2.3522,3
COUNTRY=fr
```
- `JWT_SECRET` : generate with `node -e "import('crypto').then(crypto => console.log(crypto.randomBytes(64).toString('hex')))"`
- `SEED_USERS` : if any value should contain a quote, write instead `\'` (or `\"`)
- `SEED_ICONS` : the color should be a hex color code starting with `#`, the icon should be a Material Design Icon name (`mdi-` + the name of the icon found at [Material Design Icons](https://pictogrammers.com/library/mdi/))
- `STARTING_POINT` : the starting point of the map, in the format `lat,lng,zoom`
- `COUNTRY` : the base country to "limit" the search results, lowercase country code only
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
docker run -d -p 27400:27400 --env-file .env -v better_maps_db:/app/db --name better-maps edm115/better-maps
```

## DB Scheme
### User
| Column   | Type   | Extra                                 |
| :------- | :----- | :------------------------------------ |
| id       | int    | Primary Key, Autoincrement            |
| username | string | Not Null, Unique                      |
| password | string | Not Null                              |
| role     | string | Not Null, "admin" or "user" (default) |
| map_id   | int    | Foreign Key, Not Null                 |

### Map
| Column       | Type   | Extra                                  |
| :----------- | :----- | :------------------------------------- |
| id           | int    | Primary Key, Autoincrement             |
| name         | string | Not Null, "Default Map" (default)      |
| user_id      | int    | Foreign Key, Not Null, can be multiple |
| start_lat    | float  | Not Null                               |
| start_lng    | float  | Not Null                               |
| start_zoom   | int    | Not Null                               |
| country      | string | Not Null, lowercase country code       |
| show_transit | bool   | Not Null, default false                |

### Point
| Column      | Type   | Extra                      |
| :---------- | :----- | :------------------------- |
| id          | int    | Primary Key, Autoincrement |
| name        | string | Not Null                   |
| description | string | Not Null, default ""       |
| address     | string | Not Null                   |
| lat         | float  | Not Null                   |
| lng         | float  | Not Null                   |
| color       | string | Not Null, default ""       |
| icon        | string | Not Null, default "house"  |
| map_id      | int    | Foreign Key, Not Null      |
| visible     | bool   | Not Null, default true     |
| favorite    | bool   | Not Null, default false    |

### Icon
| Column | Type   | Extra                      |
| :----- | :----- | :------------------------- |
| id     | int    | Primary Key, Autoincrement |
| name   | string | Not Null                   |
| color  | string | Not Null                   |
| icon   | string | Not Null                   |

## Dev left to do
- [ ] Admin panel
  - [ ] Add/delete users (on add, add a linked map)
  - [ ] Ability to switch maps
  - [ ] Add/edit/delete map
- [ ] proper i18n

## Unplanned
- [ ] ~~Show/hide any category of points~~ *very broken, unstyles points and defeats the purpose of the dummy pin*
