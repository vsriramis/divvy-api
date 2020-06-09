import express = require('express');
import * as csv from 'fast-csv';
import * as fs from 'fs';
import rp from "request-promise";
import { Station, StationRes } from './src/model/StationData';
import { Trip } from './src/model/TripData';
require('dotenv').config()

const lodash = require('lodash')
const app: express.Application = express();
const PORT = 8080;
const tripData: any[] = []
const STATIONINFOURL: string = `https://gbfs.divvybikes.com/gbfs/en/station_information.json`
const authMiddleware = require('./auth')
/**
 * bootstrap function
 */
app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}!`);
  loadTripData();
});
app.use(authMiddleware)

/**
 * GET all station information
 */
app.get('/stationInfo', async (req, res) => {
  console.log(`getting station information....`)
  try {
    const response = await getStationInfo()
    console.log(JSON.stringify(response))
    res.send(response.data);
  } catch (exception) {
    process.stderr.write(`ERROR received from ${STATIONINFOURL}: ${exception}\n`);
    res.send(`ERROR received from ${STATIONINFOURL}: ${exception}\n`);
  }
});

/**
 * GET station information with stationId
 */
app.get('/stationInfo/:id', async (req, res) => {
  console.log(`getting information for station# ${JSON.stringify(req.params.id)}`)
  let stationId = req.params.id
  try {
    const stationInfo: StationRes = await getStationInfo()
    let stations: Station[] = stationInfo.data.stations
    let station = stations.find(i => i.station_id === stationId)
    if (station) {
      console.log(`station match: ${JSON.stringify(station)}`)
      res.status(200).send(station);
    } else {
      console.log(`station not found...`)
      res.status(404).send(station);
    }
  } catch (exception) {
    process.stderr.write(`ERROR received from ${STATIONINFOURL}: ${exception}\n`);
    res.send(`ERROR received from ${STATIONINFOURL}: ${exception}\n`);
  }
});

/**
 * Test endpoint
 * GET trip information with a line number
 */
app.get('/tripInfo/:id', async (req, res) => {
  console.log(`inside GET trip information....`)
  let lineId: string = req.params.id
  if (tripData && tripData.length > 0) {
    res.status(200).send(tripData[+lineId]);
  } else {
    loadTripData();
    res.status(200).send(tripData[+lineId]);
  }
});

/**
 * GET trips for a given station id(s)
 */
app.get('/trips/station/:id', async (req, res) => {
  console.log(`inside GET trips for station(s)....`)
  let stationId: string = req.params.id;
  let stationIds: string[] = stationId.split(',');
  let trips: Trip[] = await getTripsByStation(stationIds);
  res.status(200).send(trips);
});

/**
 * GET riders count for a given station id(s)
 */
app.get('/riders/station/:id', async (req, res) => {
  console.log(`inside GET riders for station(s)....`)
  let stationId: string = req.params.id
  let stationIds: string[] = stationId.split(',');
  try {
    let trips: Trip[] = await getTripsByStation(stationIds);
    const ridersByAgeGroup = lodash.chain(trips)
    .groupBy("ageGroup")
    .map((value: Trip, key: string) => ({ ageGroup: key, trips: value }))
    .value();
    let result = getRidersCount(ridersByAgeGroup);
    res.status(200).send(result);
  } catch (exception) {
    process.stderr.write(`ERROR while getting trips by age group: ${exception}\n`);
    res.send(`ERROR while getting trips by age group: ${exception}\n`);
  }
});

/**
 * Utility function to build riders count trip response 
 */
function getRidersCount(ridersByAgeGroup: any){
  return ridersByAgeGroup.map((item: { ageGroup: any; trips: string | any[]; }) => {
    return {
      ageGroup: item.ageGroup,
      count: item.trips.length
    }
  })
}

/**
 * Utility function to identify the rider's age group
 * @param birthYear 
 */
function getAgeGroup(birthYear: string) {
  // console.log(`getting age group for ${birthYear}`)
  let age = calculateRiderAge(birthYear);
  if (age > 0 && age < 21) {
    return '0-20';
  } else if (age > 20 && age < 31) {
    return '20-30';
  } else if (age > 30 && age < 41) {
    return '30-40';
  } else if (age > 40 && age < 51) {
    return '40-50';
  } else if (age > 50) {
    return '51+';
  } else {
    return 'unknown';
  }
}

/**
 * Utility function to get trip information by station
 * @param stationIds 
 */
async function getTripsByStation(stationIds: string[]) {
  let trips: Trip[] = [];
  await Promise.all(stationIds.map(async (station) => {
    const match = tripData.find(trip => trip.endStationId === station);
    if (match) {
      trips.push(match);
    }
  }));
  return trips;
}

/**
 * Utility function to calculate riders age from birthYear
 * @param birthYear 
 */
function calculateRiderAge(birthYear: string) {
  let currentYear = new Date().getFullYear();
  return currentYear - (+birthYear);
}
/**
 * Function to read trip data from file
 */
function loadTripData() {
  console.log(`Going to read trip information.... ${Date()}`)
  try {
    Promise.resolve(fs.createReadStream('./Divvy_Trips_2019_Q2.csv')
      .pipe(csv.parse({ headers: true }))
      .on('error', error => console.error(error))
      .on('data', row => {
        tripData.push(mapTripData(row))
      })
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`)
        console.log(`Trip data count ${tripData.length} rows : ${Date()}`)
      }));

  } catch (exception) {
    process.stderr.write(`ERROR reading trip information: ${exception}\n`);
  }
}
/**
 * Function to map trip data line to custom object
 * @param row 
 */
function mapTripData(row: any) {
  var rentalIdIndex = Object.keys(row)[0];
  var startTimeIndex = Object.keys(row)[1];
  var endTimeIndex = Object.keys(row)[2];
  var bikeIdIndex = Object.keys(row)[3];
  var durationIndex = Object.keys(row)[4];
  var startStationIdIndex = Object.keys(row)[5];
  var startStationNameIndex = Object.keys(row)[6];
  var endStationIdIndex = Object.keys(row)[7];
  var endStationNameIndex = Object.keys(row)[8];
  var userTypeIndex = Object.keys(row)[9];
  var genderIndex = Object.keys(row)[10];
  var birthYearIndex = Object.keys(row)[11];
  return {
    rentalId: row[rentalIdIndex],
    startTime: row[startTimeIndex],
    endTime: row[endTimeIndex],
    bikeId: row[bikeIdIndex],
    durationSecs: row[durationIndex],
    startStationId: row[startStationIdIndex],
    startStationName: row[startStationNameIndex],
    endStationId: row[endStationIdIndex],
    endStationName: row[endStationNameIndex],
    userType: row[userTypeIndex],
    gender: row[genderIndex],
    birthYear: row[birthYearIndex],
    ageGroup: getAgeGroup(row[birthYearIndex])
  }
}

// async function mapTripStation() {
//   console.log(`Inside mapTripStation()...`)
//   if (tripData && tripData.length > 0) {
//     console.log(`trip data length is >0 and before creating trip by station map...`)
//     Promise.all(tripData.map(async trip => {
//       if (tripByStation.has(trip.startStationId)) {
//         //if data already exists in the map, add the new trip to existing value in the map
//         tripByStation.set(trip.startStationId, tripByStation.get(trip.startStationId).push(trip))
//       } else {
//         //if data doesn't exist in the map, add the new trip to the map
//         tripByStation.set(trip.startStationId, [trip])
//       }
//     }));
//     console.log(`after trip by stations: ${JSON.stringify(tripByStation.entries)}`)
//   }
// }

function getStationInfo() {
  console.log(`Inside getStatuinInfo`);
  return rp.get(STATIONINFOURL, {
    json: true,
  });
}

module.exports = app;
