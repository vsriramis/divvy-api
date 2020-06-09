"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request_promise_1 = __importDefault(require("request-promise"));
var fs = __importStar(require("fs"));
var csv = __importStar(require("fast-csv"));
var lodash = require('lodash');
var PORT = 8080;
var tripData = [];
var tripByStation = new Map();
var STATIONINFOURL = "https://gbfs.divvybikes.com/gbfs/en/station_information.json";
var app = express();
app.listen(PORT, function () {
    console.log("App is listening on port " + PORT + "!");
    loadTripData();
});
app.get('/stationInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, exception_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("getting station information....");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getStationInfo()];
            case 2:
                response = _a.sent();
                console.log(JSON.stringify(response));
                res.send(response.data);
                return [3 /*break*/, 4];
            case 3:
                exception_1 = _a.sent();
                process.stderr.write("ERROR received from " + STATIONINFOURL + ": " + exception_1 + "\n");
                res.send("ERROR received from " + STATIONINFOURL + ": " + exception_1 + "\n");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/stationInfo/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stationId, stationInfo, stations, station, exception_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("getting information for station# " + JSON.stringify(req.params.id));
                stationId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getStationInfo()];
            case 2:
                stationInfo = _a.sent();
                stations = stationInfo.data.stations;
                station = stations.find(function (i) { return i.station_id === stationId; });
                if (station) {
                    console.log("station match: " + JSON.stringify(station));
                    res.status(200).send(station);
                }
                else {
                    console.log("station not found...");
                    res.status(404).send(station);
                }
                return [3 /*break*/, 4];
            case 3:
                exception_2 = _a.sent();
                process.stderr.write("ERROR received from " + STATIONINFOURL + ": " + exception_2 + "\n");
                res.send("ERROR received from " + STATIONINFOURL + ": " + exception_2 + "\n");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/tripInfo/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lineId;
    return __generator(this, function (_a) {
        console.log("inside GET trip information....");
        lineId = req.params.id;
        if (tripData && tripData.length > 0) {
            res.status(200).send(tripData[+lineId]);
        }
        else {
            loadTripData();
            res.status(200).send(tripData[+lineId]);
        }
        return [2 /*return*/];
    });
}); });
app.get('/trips/station/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stationId, stationIds, trips;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("inside GET trips for station(s)....");
                stationId = req.params.id;
                stationIds = stationId.split(',');
                return [4 /*yield*/, getTripsByStation(stationIds)];
            case 1:
                trips = _a.sent();
                res.status(200).send(trips);
                return [2 /*return*/];
        }
    });
}); });
app.get('/riders/station/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stationId, stationIds, trips, ridersByAgeGroup, result, exception_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("inside GET riders for station(s)....");
                stationId = req.params.id;
                stationIds = stationId.split(',');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getTripsByStation(stationIds)];
            case 2:
                trips = _a.sent();
                ridersByAgeGroup = lodash.chain(trips)
                    .groupBy("ageGroup")
                    .map(function (value, key) { return ({ ageGroup: key, trips: value }); })
                    .value();
                result = getRidersCount(ridersByAgeGroup);
                // console.log(`Riders by age group: ${JSON.stringify(ridersByAgeGroup)}`)
                res.status(200).send(result);
                return [3 /*break*/, 4];
            case 3:
                exception_3 = _a.sent();
                process.stderr.write("ERROR while getting trips by age group: " + exception_3 + "\n");
                res.send("ERROR while getting trips by age group: " + exception_3 + "\n");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
function getRidersCount(ridersByAgeGroup) {
    return ridersByAgeGroup.map(function (item) {
        return {
            ageGroup: item.ageGroup,
            count: item.trips.length
        };
    });
}
function getAgeGroup(birthYear) {
    // console.log(`getting age group for ${birthYear}`)
    var age = calculateRiderAge(birthYear);
    if (age > 0 && age < 21) {
        return '0-20';
    }
    else if (age > 20 && age < 31) {
        return '20-30';
    }
    else if (age > 30 && age < 41) {
        return '30-40';
    }
    else if (age > 40 && age < 51) {
        return '40-50';
    }
    else if (age > 50) {
        return '51+';
    }
    else {
        return 'unknown';
    }
}
function getTripsByStation(stationIds) {
    return __awaiter(this, void 0, void 0, function () {
        var trips;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trips = [];
                    return [4 /*yield*/, Promise.all(stationIds.map(function (station) { return __awaiter(_this, void 0, void 0, function () {
                            var match;
                            return __generator(this, function (_a) {
                                match = tripData.find(function (trip) { return trip.endStationId === station; });
                                if (match) {
                                    trips.push(match);
                                }
                                return [2 /*return*/];
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, trips];
            }
        });
    });
}
// async function mapTripsByRiders(trips: Trip[]) {
//   let ridersMap = new Map();
//   let arr20, arr30, arr40, arr50, arr51, unknown = []
//   var result = new Map(trips.map(i => [i.key, i.val]));
//   trips.map(async trip => {
//     let age = calculateRiderAge(trip.birthYear);
//     if (age > 0 && age < 21) {
//       arr20.push(trip)
//     } else if (age > 20 && age < 31) {
//       arr30.push(trip)
//     } else if (age > 30 && age < 41) {
//       arr40.push(trip)
//     } else if (age > 30 && age < 41) {
//       arr40.push(trip)
//     } else if (age > 40 && age < 51) {
//       arr50.push(trip)
//     } else if (age > 50) {
//       arr51.push(trip)
//     } else {
//       unknown.push(trip)
//     }
//   })
// }
// function getCountByDate(trips: Trip[], ageGroup; string){
//   let count=0
//   trips.map(trip=>{
//   });
// }
function calculateRiderAge(birthYear) {
    var currentYear = new Date().getFullYear();
    return currentYear - (+birthYear);
}
function loadTripData() {
    console.log("Going to read trip information.... " + Date());
    try {
        Promise.resolve(fs.createReadStream('./Divvy_Trips_2019_Q2.csv')
            .pipe(csv.parse({ headers: true }))
            .on('error', function (error) { return console.error(error); })
            .on('data', function (row) {
            tripData.push(mapTripData(row));
        })
            .on('end', function (rowCount) {
            console.log("Parsed " + rowCount + " rows");
            console.log("Trip data count " + tripData.length + " rows : " + Date());
            // mapTripStation();
        }));
    }
    catch (exception) {
        process.stderr.write("ERROR reading trip information: " + exception + "\n");
    }
}
function mapTripData(row) {
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
    };
}
function mapTripStation() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            console.log("Inside mapTripStation()...");
            if (tripData && tripData.length > 0) {
                console.log("trip data length is >0 and before creating trip by station map...");
                Promise.all(tripData.map(function (trip) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (tripByStation.has(trip.startStationId)) {
                            //if data already exists in the map, add the new trip to existing value in the map
                            tripByStation.set(trip.startStationId, tripByStation.get(trip.startStationId).push(trip));
                        }
                        else {
                            //if data doesn't exist in the map, add the new trip to the map
                            tripByStation.set(trip.startStationId, [trip]);
                        }
                        return [2 /*return*/];
                    });
                }); }));
                console.log("after trip by stations: " + JSON.stringify(tripByStation.entries));
            }
            return [2 /*return*/];
        });
    });
}
function getStationInfo() {
    console.log("Inside getStatuinInfo");
    return request_promise_1.default.get(STATIONINFOURL, {
        json: true,
    });
}
