const errorMessages = {
    api: {
        fetch_weather: (errorLocation) => `Error fetch selected weather occurred at ${errorLocation} function.`,
        fetch_geoposition: (errorLocation) => `Error fetch current weather occurred at ${errorLocation} function.`,
        asyncCall: ({ message }, errorLocation) => `Async call error - ${message} occurred at ${errorLocation} function.`
    },
    cache: {
        setError: (errorLocation) => `Error at set weather on cache occurred at ${errorLocation} function.`
    }
};

export default errorMessages;