mapboxgl.accessToken = 'pk.eyJ1IjoiZGVqYW4xMSIsImEiOiJjaXNicG03MXgwMDBtMnRxZngzMzg5dmw5In0.4mhclIwJa_TfuyRcTt5FDw';
    let bounds = [
        [11, 40],
        [75, 63]

        ];
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/dejan11/cjhylzgcr3hl92rpklp8eqexh',//moonlight
        center: [44,54] , // starting position [lng, lat]
        zoom: 4, // starting zoom,
        minZoom:2
      //maxBounds: bounds
    });
    let features=[];
    let tvchannels;
    let teams;
    let groups;
    let knockout;
    let round_8;
    let round_4;
    let round_2_loser;
    let round_2;
    let country_features;

    $.getJSON('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json', function(data) {

        for (var element in data.stadiums) {
            features.push(
                {
                    "type": "Feature",
                    "properties": {"id": data.stadiums[element].id, "name": data.stadiums[element].name, "city": data.stadiums[element].city, "image":data.stadiums[element].image},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [data.stadiums[element].lng, data.stadiums[element].lat]
                        }
                    }
                );
            }
            tvchannels = data.tvchannels;
            teams = data.teams;
            groups = data.groups;
            knockout = data.knockout;
        //contains - location of stadions, name and city
        let stadiums = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": features
            }
        }  
            map.on('load', function () {
            setTimeout(function(){ 

                map.addSource('point_stadiums', stadiums);
                map.addLayer({
                    "id": "points",
                    "source": "point_stadiums",
                    "type": "symbol",
                    "layout":{
                        "visibility": "visible",
                        "icon-image": "soccer-15",
                        "icon-offset": [0, -7.5],
                        "icon-allow-overlap": true,
                        "icon-size": 2.5
                        }
                });
                
                },2000);;

    });


    map.on('click', 'points', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = "<div>"+e.features[0].properties.city+":&nbsp"+e.features[0].properties.name+"</div><div><img src='"+ e.features[0].properties.image+"' height='250' width='300'>"+
        "</div><a target='_blank' href='https://en.wikipedia.org/wiki/"+e.features[0].properties.name+"'>More info</a>";

        // table cells to default     
          
        $("tr:nth-child(even) td").css("background","#F1F1F1");  
        $("tr:nth-child(odd) td").css("background", "#FEFEFE");  
        $("td").css("color","#333");

        
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
            //popup
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        //select matches on stadium select
        for ( let id in groups){
            for (let match in groups[id].matches){
                if (groups[id].matches[match].stadium==e.features[0].properties.id){
                    let td_class = "tr."+getChar(e.features[0].properties.id)+" td";
                    $(td_class).css("color","#FFF")
                                .css("background","#666");
                    }
                }

            }
            //default on popup close
            $(document).ready(function(){
                $(".mapboxgl-popup-close-button").click(function(){  
                    $("tr:nth-child(even) td").css("background","#F1F1F1");  
                    $("tr:nth-child(odd) td").css("background", "#FEFEFE");  
                    $("td").css("color","#333");

                });
            });
        });

    map.on("moveend", function(e) {
        country_features = map.queryRenderedFeatures(e.point, { 
            layers: ["world-cup-countries"]
        });
        //point finger
        map.getCanvas().style.cursor = country_features.length ? 'pointer' : '';
        //get coat of arms
        for (let object in country_features){
            let coord = country_features[object].properties["CENTROID"];
            let name = country_features[object].properties["ADMIN"];
            if (name=="France"){
                addIcon(name,'france',[2,46]);
            }else if (name=="Iceland"){
                addIcon(name,'Coat_of_arms_of_Iceland',[coord.split(",")[0],coord.split(",")[1]]);
            }else if (name=="England"){
                addIcon(name,'Royal_Arms_of_England',[coord.split(",")[0],coord.split(",")[1]]);
            }else if (name=="Spain"){
                addIcon(name,'Escudo_de_Espa%C3%B1a_(mazonado)',[coord.split(",")[0],coord.split(",")[1]]);
            }else if (name=="Switzerland"){
                addIcon(name,'Coat_of_arms_of_Switzerland',[coord.split(",")[0],coord.split(",")[1]]);
            }else if(name=="Russia"){
                addIcon(name,'Coat_of_Arms_of_the_Russian_Federation',[coord.split(",")[0],coord.split(",")[1]]);
            }else if(name=="Italy"){
                addIcon(name,'Emblem_of_Italy',[coord.split(",")[0],coord.split(",")[1]]);
            }else if(name=="Argentina"){
                addIcon(name,'Coat_of_arms_Argentina',[coord.split(",")[0],coord.split(",")[1]]);
            }else if(name=="Brazil"){
                addIcon(name,'brasil1',[coord.split(",")[0],coord.split(",")[1]]);
            }else if(name=="Serbia"){
                addIcon(name,'serbia',[coord.split(",")[0],coord.split(",")[1]]);
            }else if(name=="Croatia"){
                addIcon(name,'croatia',[coord.split(",")[0],coord.split(",")[1]]);
            }
        }
        
        
        });

        /*Create hover effect with countries*/
        map.on("mousemove", function(e) {
                var features = map.queryRenderedFeatures(e.point, { layers: ["world-cup-countries"] });
                if (features.length) {
                    map.setFilter("world-cup-countries-line", ["==", "ADMIN", features[0].properties.ADMIN]);
                } else {
                    map.setFilter("world-cup-countries-line", ["==", "admin", ""]);
                }
        });
        $(document).ready(function(){
        map.on("click", function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: ["world-cup-countries"] });
            if (features.length) {
                        //select matches on stadium select
                    let trTags = document.getElementsByTagName("tr");
                    for (var i = 0; i < trTags.length; i++) {
                        if (trTags[i].textContent.indexOf(features[0].properties.ADMIN) !== -1) {
                            $(trTags[i]).css("color","#FFF");
                                    //.css("background","#666");
                            }
                        }
                    }
                });
            });
        
/*
        map.on("click", function(e){
            let countries = map.queryRenderedFeatures(e.point, { 
                layers: ["world-cup-countries"]
            });
            console.log(countries[0].properties.ADMIN);
            var coordinates = e.lngLat;
            let description;
            let country_json = $.getJSON("https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles="+countries[0].properties.ADMIN+"&rvsection=0", function(data) {
                l = data.pages[0];
            });
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
    
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            });
  */
            let group;
            let html_group;
            for (group in groups){
                html_group ="<table style='float:left;'><tr><th colspan='4'>"+groups[group].name+"</th></tr>"+
                            "<tr title='"+getDayMonthTime(groups[group].matches[0].date)+"'class='"+getChar(groups[group].matches[0].stadium)+"'><td><a><img height='14' width='18' src='"+getFlag(groups[group].matches[0].home_team)+"'></a>&nbsp"+getCountry(groups[group].matches[0].home_team)+"</td><td>"+getNone(groups[group].matches[0].home_result)+"</td><td>"+getNone(groups[group].matches[0].away_result)+"</td><td><a><img height='16' width='20' src='"+getFlag(groups[group].matches[0].away_team)+"'></a>&nbsp"+getCountry(groups[group].matches[0].away_team)+"</td></tr>"+
                            "<tr title='"+getDayMonthTime(groups[group].matches[1].date)+"' class='"+getChar(groups[group].matches[1].stadium)+"'><td><a><img height='14' width='18' src='"+getFlag(groups[group].matches[1].home_team)+"'></a>&nbsp"+getCountry(groups[group].matches[1].home_team)+"</td><td>"+getNone(groups[group].matches[1].home_result)+"</td><td>"+getNone(groups[group].matches[1].away_result)+"</td><td><a><img height='16' width='20' src='"+getFlag(groups[group].matches[1].away_team)+"'></a>&nbsp"+getCountry(groups[group].matches[1].away_team)+"</td></tr>"+
                            "<tr title='"+getDayMonthTime(groups[group].matches[2].date)+"' class='"+getChar(groups[group].matches[2].stadium)+"'><td><a><img height='14' width='18' src='"+getFlag(groups[group].matches[2].home_team)+"'></a>&nbsp"+getCountry(groups[group].matches[2].home_team)+"</td><td>"+getNone(groups[group].matches[2].home_result)+"</td><td>"+getNone(groups[group].matches[2].away_result)+"</td><td><a><img height='16' width='20' src='"+getFlag(groups[group].matches[2].away_team)+"'></a>&nbsp"+getCountry(groups[group].matches[2].away_team)+"</td></tr>"+                            
                            "<tr title='"+getDayMonthTime(groups[group].matches[3].date)+"' class='"+getChar(groups[group].matches[3].stadium)+"'><td><a><img height='14' width='18' src='"+getFlag(groups[group].matches[3].home_team)+"'></a>&nbsp"+getCountry(groups[group].matches[3].home_team)+"</td><td>"+getNone(groups[group].matches[3].home_result)+"</td><td>"+getNone(groups[group].matches[3].away_result)+"</td><td><a><img height='16' width='20' src='"+getFlag(groups[group].matches[3].away_team)+"'></a>&nbsp"+getCountry(groups[group].matches[3].away_team)+"</td></tr>"+                            
                            "<tr title='"+getDayMonthTime(groups[group].matches[4].date)+"' class='"+getChar(groups[group].matches[4].stadium)+"'><td><a><img height='14' width='18' src='"+getFlag(groups[group].matches[4].home_team)+"'></a>&nbsp"+getCountry(groups[group].matches[4].home_team)+"</td><td>"+getNone(groups[group].matches[4].home_result)+"</td><td>"+getNone(groups[group].matches[4].away_result)+"</td><td><a><img height='16' width='20' src='"+getFlag(groups[group].matches[4].away_team)+"'></a>&nbsp"+getCountry(groups[group].matches[4].away_team)+"</td></tr>"+
                            "<tr title='"+getDayMonthTime(groups[group].matches[5].date)+"' class='"+getChar(groups[group].matches[5].stadium)+"'><td><a><img height='14' width='18' src='"+getFlag(groups[group].matches[5].home_team)+"'></a>&nbsp"+getCountry(groups[group].matches[5].home_team)+"</td><td>"+getNone(groups[group].matches[5].home_result)+"</td><td>"+getNone(groups[group].matches[5].away_result)+"</td><td><a><img height='16' width='20' src='"+getFlag(groups[group].matches[5].away_team)+"'></a>&nbsp"+getCountry(groups[group].matches[5].away_team)+"</td></tr>"+
                            "</table>"
            
                $("#list").append(html_group);
                       
            }

});

function getCountry(id){
    for (country in teams){
        if (id==teams[country].id){
            return teams[country].name;
        }
    }
}
function getNone(val){
    if (val==null){
        return "-";
    }else{
        return val;
    }
}
function getFlag(team_id){
    for(id in teams){
        if(teams[id].id==team_id){
            return teams[id].flag;
        }
    }
}

function getChar(number){
    return String.fromCharCode(97 + number); // where n is 0, 1, 2 ...
}

function getDayMonthTime(date){
    let datum = new Date(date);
    return datum.toLocaleString();
}
