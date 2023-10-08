//Map.setCenter(0.0, 0.0, 2);
var naip = ee.ImageCollection("USDA/NAIP/DOQQ").filter(ee.Filter.date('2017-01-01', '2018-12-31'));

var median = naip.reduce(ee.Reducer.median());
//var mean = meth.reduce(ee.Reducer.median());

var trueColor = naip.select(['R', 'G', 'B'])
var trueColorVis = {
  min: 0,
  max: 255,
}

var bBox = ee.Geometry.BBox(-96.84, 32.45, -96.64, 32.60)
// Apply the bounds method to the BBox object.
var slope = ee.Terrain.slope(median);
var bBoxBounds = bBox.bounds();
var stats = median.clipToBoundsAndScale({
  geometry: bBox,
  width: 2000,  // pixels
  height: 1000  // pixels
});


var snic = ee.Algorithms.Image.Segmentation.SNIC({
  image: stats,
  size: 40,
  compactness: 2,
  connectivity: 8,
  neighborhoodSize: 200,
});

Map.setCenter(-96.65, 32.46, 12);
Map.addLayer(bBox,
             {'color': 'black'},
             'Geometry [black]: bBox');

// Display the image on the map.
Map.addLayer(stats);

//Map.addLayer(bBox);
// Display the clusters.
Map.addLayer(snic.randomVisualizer(), null, 'Clusters');
var bandNames = snic.bandNames()
var bandsToRemovergb = ['clusters','seeds']
var bandsToKeep = bandNames.removeAll(bandsToRemovergb)

var snic_rgb = snic.select(bandsToKeep)
var snic_cluster = snic.select('clusters')

//res = ee.Algorithms.CrossCorrelation(imageA, imageB, maxGap, windowSize, maxMaskedFrac)
// Display the RGB cluster means.
var visParams = {
  bands: ['R_mean', 'G_mean', 'B_mean'],
  min: 0,
  max: 255
};
Map.addLayer(snic.select('clusters'));
//Map.addLayer(snic, visParams, 'RGB cluster means');
Export.image.toDrive({
  image: snic.select('clusters'),
  description: 'image_export_cls2',
  folder: 'ee_demos',
  region: bBox,
  scale: 30,
  crs: 'EPSG:4326'
});