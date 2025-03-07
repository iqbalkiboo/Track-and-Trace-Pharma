import { DateTime } from "luxon"

export function isoToLocale(input: string) {
    return DateTime.fromISO(input).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY, {
        locale: "id",
    })
}
