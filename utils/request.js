export const api = 'https://api.flickr.com/services';
export const apikey = '00d379111523bdd157d8ba51a9125b57';

export function fetchFromPublicApi(url) {
    // nojsoncallback = true to disable jsonp callback on request and get "clean" json response instead of jsonp
    url = api + url +'format=json&nojsoncallback=true';
    
    const headers = new Headers()
    headers.append('Accept', 'application/json')

    let options = {
        headers: headers,
        method: 'GET',
    }
    
    return fetch(url, options);
}