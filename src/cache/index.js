import NodeCache from 'node-cache';

class Cache {
    static cache;

    static init(){
        this.cache = new NodeCache();
    }

    static getWeather(term){
        return this.cache.get(term, (err, weather) => !err && weather);
    }

    static setWeather(term, weather){
        return this.cache.set(term, weather, err => !err && weather.id);
    }
}

export default Cache;