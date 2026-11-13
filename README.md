# nearmiss-api

Backend for our final year capstone at RMIT (2023, team of five): a phone app where cyclists drop a pin and a short note
after a near miss with a car, door, tram track, whatever. The idea was to give councils something better than anecdotes
about which intersections are bad.

We trialled it with 35 riders for four weeks in semester 1. About 280 reports came in, and Sydney Road and the Brunswick
end of the Upfield path came up a lot.

This repo is the API I mostly worked on. The React Native app was in a teammate's repo.

## Stack

Node.js + Express, PostgreSQL. Location is stored as plain lat/lng columns; we talked about PostGIS but the trial
was small enough that a bounding box query was fine.

## Endpoints

| method | path | what |
|---|---|---|
| POST | /reports | create a report (lat, lng, kind, note, occurred_at) |
| GET | /reports?bbox=minLng,minLat,maxLng,maxLat | reports in a map area |
| GET | /hotspots?cell=0.002 | counts per grid cell, busiest first |

## Running

```
cp .env.example .env
createdb nearmiss && npm run db:init
npm install
npm run dev
```

Tests use Node's built-in runner: `npm test`.
