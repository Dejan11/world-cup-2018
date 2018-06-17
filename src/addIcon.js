
let addIcon = function(name,icon, coordinates){
    //map.loadImage(url, function(error, image) {
       // if (error) throw error;
       // map.addImage(url.substring(66), image);
       if(!map.getLayer(name)){
        map.addLayer({
            "id": name,
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": coordinates
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": icon,
                "icon-size": 2
            }
        });
    //});
    }
}