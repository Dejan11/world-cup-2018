let getCentroid = function (coord) 
{
	var center = coord.reduce(function (x,y) {
		return [x[0] + y[0]/coord.length, x[1] + y[1]/coord.length] 
	}, [0,0])
	return center;
}