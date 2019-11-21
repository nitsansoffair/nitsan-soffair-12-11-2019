import NodeCache from 'node-cache';
import{ DEFAULT_TTL } from './constants';

// TODO - Add time to Flush
class Cache {
    constructor(){
        this.cache = new NodeCache({
            stdTTL: DEFAULT_TTL,
            useClones: false
        });
    }

    getWeather(term){
        const termObject = this.cache.get(term);

        if(termObject){
            const { selectedWeather } = termObject;

            return selectedWeather;
        }

        return null;
    }

    setWeather(term, selectedWeather){
        let termObject = this.cache.get(term);

        termObject = {
            ...termObject,
            selectedWeather
        };

        return this.cache.set(term, termObject);
    }

    // TODO - Add autocomplete terms to catch
    getTerms(term){
        const termObject = this.cache.get(term);

        if(termObject){
            const { autocompleteTerms } = termObject;

            return autocompleteTerms;
        }

        return null;
    }

    setTerms(term, autocompleteTerms){
        let termObject = this.cache.get(term);
        termObject = {
            ...termObject,
            autocompleteTerms
        };

        return this.cache.set(term, termObject);
    }
}

const CacheInstance = new Cache();

export default CacheInstance;