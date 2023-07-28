var intlFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/New_York',
});

function getMinutesIntoMarketDay(dateOrIso){
    return dateOrIso instanceof Date ? getMinutesIntoMarketDay_date(dateOrIso) : getMinutesIntoMarketDay_iso(dateOrIso);
}

function getMinutesIntoMarketDay_iso(isoDateString) {
    // Parse the ISO date string into a JavaScript Date object
    var date = new Date(isoDateString);
    return getMinutesIntoMarketDay_date(date);
}

function getMinutesIntoMarketDay_date(date){
    // Adjust the time to EST
    var localeString = intlFormat.format(date);
    var estDate = new Date(localeString);

    // Get hours and minutes of EST time
    var estHours = estDate.getHours();
    var estMinutes = estDate.getMinutes();

    // console.log({isoDateString,estHours,estMinutes});

    // Define the market open and close times in minutes from midnight
    var marketOpen = 9.5 * 60;  // 9:30am
    var marketClose = 16 * 60;  // 4:00pm

    // Calculate how many minutes into the day the provided time is
    var minutesIntoDay = estHours * 60 + estMinutes;

    // Return the difference between the provided time and the market times
    if (minutesIntoDay < marketOpen) {
        return minutesIntoDay - marketOpen;
    } else if (minutesIntoDay > marketClose) {
        return minutesIntoDay - marketClose - 2 * (marketClose - marketOpen);
    } else {
        return minutesIntoDay - marketOpen;
    }
}

module.exports = {
    getMinutesIntoMarketDay
}