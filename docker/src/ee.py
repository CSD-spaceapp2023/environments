import ee
import geehydro
from IPython.display import Image
import ee
ee.Authenticate()
ee.Initialize()

poi = ee.Geometry.Point([122.1247, 13.2735]) # [long, lat]
roi = poi.buffer(distance=9.2e5)

dataset = ee.ImageCollection("MODIS/006/MOD11A1")
dataset = dataset.select('LST_Day_1km')

date_filter = ee.Filter.date('2021-01-01', '2022-01-01')
dataset = dataset.filter(date_filter)

image = dataset.mean()
image = image.multiply(0.02).add(-273.15)
visualisation_params = { 
  'min': 8,
  'max': 40,
  'dimensions': 620,
  'region': roi,
  'palette': ['blue', 'yellow', 'red']
}
url = image.getThumbUrl(visualisation_params)

Image(url=url)