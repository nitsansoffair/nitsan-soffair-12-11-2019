import NodeCache from 'node-cache';
import{ DEFAULT_TTL } from './constants';

class Cache {
    constructor(){
        this.cache = new NodeCache({
            stdTTL: DEFAULT_TTL,
            useClones: false
        });
    }

    getWeather(term){
        return this.cache.get(term);
    }

    setWeather(term, weather){
        return this.cache.set(term, weather);
    }

    // TODO - Add autocomplete terms to catch
    getTerms(term){

    }

    setTerms(term, autocompleteTerms){

    }
}

const CacheInstance = new Cache();

export default CacheInstance;