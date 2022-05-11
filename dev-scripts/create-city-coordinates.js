const { center } = require('@turf/turf');
const geoFeatures = require('../social-survey-app-admin-panel/src/assets/json/geoFeatures.json');
const fs = require('fs');

let featureList = [];
for (const geoFeature of Object.values(geoFeatures)) {
  featureList.push({
    name: geoFeature.name,
    coordinates: center(geoFeature).geometry.coordinates,
  });
}

fs.writeFile("cities.json", JSON.stringify(featureList), function(err) {
    if (err) {
        console.log(err);
    }
});
