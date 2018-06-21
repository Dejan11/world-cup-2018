let html_compare;
let first;
let second;
$.getJSON('https://raw.githubusercontent.com/Dejan11/world-cup-2018/master/src/stats_countries.json', function(data) {
    $(document).ready(function(){

        $("#list tr").click(function(){
            $("#compare").remove();
            first = $(this)[0].children[0].textContent.slice(1,);
            second = $(this)[0].children[3].textContent.slice(1,);
            let firstCountry= getValues(first,data);
            let secondCountry = getValues(second,data);
            html_compare = "<div id='compare'><table><tr><th></th><th>"+first+"</th><th>VS</th><th>"+second+"<span class='close'>&times;</span></th></tr>"+
                            "<tr><td>Average Age</td><td>"+firstCountry["WC particip."]+"</td><td></td><td>"+secondCountry["WC particip."]+"</td></tr>"+
                            "<tr><td>Playing Abroad</td><td>"+firstCountry["Abroad"]+"</td><td></td><td>"+secondCountry["Abroad"]+"</td></tr>"+
                            "<tr><td>Market Value</td><td>"+firstCountry["MarketValuEuro"].split("%")[0]+"\u20AC</td><td></td><td>"+secondCountry["MarketValuEuro"].split("%")[0]+"\u20AC</td></tr>"+
                            "</table></div>";
            $("#canvas").append(html_compare);


            $(".close").on("click",function(){
                $("#compare").hide('slow');
            });

        });
    });

});

function getValues(Country,data){
    let id;
    let output;
    for (id in data){
        if(data[id].Squad==Country){
            output = data[id];
        }
    }
    return output;
}