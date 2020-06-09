# divvy-api
Station - Where the bikes can originate and end 
Trip - the dates, times, station, and rider info 
Rider - the person renting the bike

API
1. Return the information for one station given a station id
HTTP: GET
URL: /stationInfo/{stationId}
Description: API to fetch information for a given station 

2. Given one or more station ids, return the count of riders by age groups [0-20,21-30,31-40,41-50,51+, unknown]
HTTP: GET
URL: /riders/station/{comma_separated_stationIds}
Description: API to fetch count of riders for a given stationId(s) grouped by age group

3. Given one or more station ids, return the trips that ended at the station
HTTP: GET
URL: /trips/station/{comma_separated_stationIds}
Description: API to fetch trips for a given stationId(s) 
