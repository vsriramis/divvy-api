export interface StationRes {
    data: dataType
}

export interface dataType{
    stations: Station[]
}

export interface Station {
    eightd_has_key_dispenser: boolean,
    eightd_station_services: any[],
    station_id: string,
    external_id: string,
    has_kiosk: boolean,
    capacity: number,
    electric_bike_surcharge_waiver: boolean,
    name: string,
    lat: number,
    station_type: string,
    rental_uris: UrlType,
    rental_methods: string[],
    short_name: string,
    lon: number
}

export interface UrlType {
    android: string,
    ios: string
}