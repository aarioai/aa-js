export enum Continent {
    NilContinent = 0,  // no, or invalid continent
    Asia = 1,
    Europe = 2,
    NorthAmerica = 3,
    SouthAmerica = 4,
    Oceania = 5,
    Africa = 6,
    Antarctica = 7,
}

export const Continents = new Set(Object.values(Continent))
export type t_continent = Continent