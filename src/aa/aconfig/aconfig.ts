import {Debugger} from "./debugger";
import {MYSQL_MAX_DATE, MYSQL_MAX_DATETIME, MYSQL_MIN_DATE, MYSQL_MIN_DATETIME} from '../atype/a_server_consts'
import {t_date, t_datetime} from '../atype/a_define'
import Registry from './registry'

class AConfigure {
    enableZeroDate: boolean = true
    timezone = 'Asia/Shanghai'
    readonly debugger = new Debugger()
    readonly registry = new Registry()


    minDate: t_date = MYSQL_MIN_DATE
    maxDate: t_date = MYSQL_MAX_DATE
    minDatetime: t_datetime = MYSQL_MIN_DATETIME
    maxDatetime: t_datetime = MYSQL_MAX_DATETIME
}

const aconfig = new AConfigure()

export default aconfig