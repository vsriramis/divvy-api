export interface RiderByAge{
    age: string,
    trips: TripStats[]
}

export interface TripStats{
    date: string,
    count: number
}