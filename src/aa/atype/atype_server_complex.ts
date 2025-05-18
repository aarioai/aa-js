import {t_float64} from "./atype_server";

export type t_coordinate = {
    latitude: t_float64,
    longitude: t_float64,
    height?: t_float64,
}
export type t_location = {
    latitude: t_float64,
    longitude: t_float64,
    height?: t_float64,
    name?: string,
    address?: string,
}

export type t_point = {
    x: t_float64,
    y: t_float64,
}
