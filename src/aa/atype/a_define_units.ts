import type {t_expires, t_millisecond, t_second} from './a_define'


export const InSecond: t_second = 1
export const MinuteInSecond: t_second = 60 // 60 * InSecond
export const MinutesInSecond = MinuteInSecond
export const HourInSecond: t_second = 3600 // 60 * MinuteInSecond
export const HoursInSecond = HourInSecond
export const DayInSecond: t_second = 86400 // 24 * HourInSecond
export const DaysInSecond = DayInSecond

export const NO_EXPIRES: t_expires = 86400000  //  1000 * DaysInSecond, note: client storage is not reliable


export const Millisecond: t_millisecond = 1
export const Milliseconds = Millisecond
export const Second: t_millisecond = 1000
export const Seconds = Second
export const Minute: t_millisecond = 60000 // 60 * Seconds
export const Minutes = Minute
export const Hour: t_millisecond = 3600000 // 60 * Minutes
export const Hours = Hour
export const Day: t_millisecond = 86400000 // 24 * Hours
export const Days = Day


export const Wan = 10000
export const Million = 100 * Wan
export const Yii = 10000 * Wan
export const Billion = 10 * Yii

export const KB = 1024
export const MB = 1024 * KB
export const GB = 1024 * MB
export const TB = 1024 * MB
export const PB = 1024 * TB
export const EB = 1024 * PB
export const ZB = 1024 * EB
export const YB = 1024 * ZB


export const Cent = 100
export const Cents = Cent
export const Dime = 10 * Cent
export const Dimes = Dime
export const Dollar = 100 * Dime
export const Dollars = Dollar
export const KDollar = 1000 * Dollar
export const KDollars = KDollar
export const MDollar = 1000 * KDollar   //million dollar
export const MDollars = MDollar
export const BDollar = 1000 * MDollar  // billion dollar
export const BDollars = BDollar
export const Yuan = Dollar
export const KYuan = KDollar
export const WanYuan = 10000 * Yuan
export const MYuan = MDollar
export const YiiYuan = 10000 * WanYuan


export const Percent = 100.0  // %
export const Thousandth = 10.0 // ‰