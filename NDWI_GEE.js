
//You must create a polygon (feature) to act as a ROI. Name it 'polygon' for the spatial filter, export and clipping to work properly
//You will also need to set the dates desired for the temporal filter

// var polygon = ee.Geometry

var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');



var spatialFiltered = l8.filterBounds(polygon);
print('spatialFiltered', spatialFiltered);

var temporalFiltered = spatialFiltered.filterDate('2017-08-15', '2017-10-31');
print('temporalFiltered', temporalFiltered);

// This will sort from least to most cloudy.
var sorted = temporalFiltered.sort('CLOUD_COVER');
print(sorted);

// Get the first (least cloudy) image.
var scene = ee.Image(sorted.first());


// Get the median over time, in each band, in each pixel.
var mode = l8.filterDate('2017-08-15', '2017-10-31').mode();
// Make a handy variable of visualization parameters.
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};

// Display the median composite.
Map.addLayer(mode, visParams, 'median');

// Compute the Normalized Difference Vegetation Index (NDVI).
var nir = mode.select('B5');
var green = mode.select('B3');
var ndvi = nir.subtract(green).divide(nir.add(green)).rename('NDWI');

// Display the result.
// Map.centerObject(mode, 9);
var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
Map.addLayer(ndvi, ndviParams, 'NDVI image');

// //Load a Fusion Table containing the location of PopPlaces
// var PopPlaces = ee.FeatureCollection('ft: 1kbaI0nYzThtGpN2ku06HxdjYDhrQLLCkh7HRKYqq');
// Map.addLayer(PopPlaces, {}, "PopPlaces")

Map.addLayer(table);

// Export the image, specifying scale and region.
Export.image.toDrive({
  image: ndvi,
  description: 'desired_name',
  scale: 30,
  folder: 'folder_name_and_path',
  region: polygon
});
