export default {
    api: {
        fetchWeather: (errorLocation) => `Error fetch selected weather occurred at ${errorLocation} function.`,
        fetchGeoposition: (errorLocation) => `Error fetch current weather occurred at ${errorLocation} function.`,
        asyncCall: ({ message }, errorLocation) => `Async call error - ${message} occurred at ${errorLocation} function.`,
    },
    cache: {
        setError: (errorLocation) => `Error at set weather on cache occurred at ${errorLocation} function.`
    },
    other: {
        setError: (errorLocation) => `Error at set weather occurred at ${errorLocation} function.`,
        getError: (errorLocation) => `Error at get weather occurred at ${errorLocation} function.`,
    },
    defaultError: {
        error: "Internal server error."
    }
};