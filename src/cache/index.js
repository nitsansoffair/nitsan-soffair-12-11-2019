import NodeCache from 'node-cache';

class Cache {
    static cache;

    static init(){
        this.cache = new NodeCache();
    }

    static getWeather(id){
        return Cache.cache.get(id, (err, weather) => !err && weather);
    }

    static setWeather(weather){
        return Cache.cache.set(weather.id, weather, err => !err && weather.id);
    }
}

export default Cache;