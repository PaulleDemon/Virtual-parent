/**
 * Given a time in UTC returns the time in local time
 */

 export function toLocalTime(utc){

    const date = new Date(utc)
    const options = {year: 'numeric', month: 'short', day: 'numeric',  hour: 'numeric', minute: 'numeric' }
    
    return new Intl.DateTimeFormat('en-US', options).format(date)
}
