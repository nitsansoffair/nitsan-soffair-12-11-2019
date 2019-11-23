import NodeCache from 'node-cache';
import{ DEFAULT_TTL } from './constants';

class Cache {
    constructor(){
        this.cache = new NodeCache({
            stdTTL: DEFAULT_TTL,
            useClones: false
        });
    }

    getWeather(key){
        return this.cache.get(key);
    }

    setWeather(key, selectedWeather){
        return this.cache.set(key, selectedWeather);
    }

    getTerms(q){
        return this.cache.get(q);
    }

    setTerms(q, autocompleteTerms){
        return this.cache.set(q, autocompleteTerms);
    }

    getTermsByCoords(q){
        return this.cache.get(q);
    }

    setTermsWithCoords(q, terms){
        return this.cache.set(q, terms);
    }
}

const CacheInstance = new Cache();

export default CacheInstance;