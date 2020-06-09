# divvy-api
Station - Where the bikes can originate and end 
Trip - the dates, times, station, and rider info 
Rider - the person renting the bike

API
1. API to return the information for one station given a station id
HTTP: GET
URL: /stationInfo/{stationId}
Description: API to fetch information for a given station 

2. API to return the count of riders by age groups [0-20,21-30,31-40,41-50,51+, unknown], given one or more station ids
HTTP: GET
URL: /riders/station/{comma_separated_stationIds}
Description: API to fetch count of riders for a given stationId(s) grouped by age group

3. API to return the trips that ended at the station, given one or more station ids
HTTP: GET
URL: /trips/station/{comma_separated_stationIds}
Description: API to fetch trips for a given stationId(s) 

All the above APIs take Authorization tokan which is OKTA Bearer token. Here is the CURL command to generate the Bearer token

curl --location --request POST 'https://dev-864152.okta.com/oauth2/default/v1/token' \
--header 'Accept: application/json' \
--header 'Authorization: Basic MG9hZWZsYThsSjJFd2xSS3g0eDY6bDBsS2x4a3hFcnFaQk8zRGNOQjlCdEc3cmxOMms3eFpBQWs0cFVOSQ==' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: t=default; DT=DI0EOcw_WFwQTWDAK0rz1ktIw; JSESSIONID=0956D92A5AC292215D5DF5E3A1C98EC1' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=divvy-api'
