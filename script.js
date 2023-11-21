document
  .getElementById("searchForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const placeName = document.getElementById("searchInput").value;

    const placeId = await getPlaceId(placeName);
    const insectTaxonId = await getTaxonId("Insecta");

    const observations = await getObservations(placeId, insectTaxonId);

    displayObservations(observations);
  });

async function getPlaceId(placeName) {
  const response = await fetch(
    `https://api.inaturalist.org/v1/places/autocomplete?q=${placeName}`
  );
  const data = await response.json();
  return data.results[0].id;
}

async function getTaxonId(taxonName) {
  const response = await fetch(
    `https://api.inaturalist.org/v1/taxa/autocomplete?q=${taxonName}`
  );
  const data = await response.json();
  return data.results[0].id;
}

async function getObservations(placeId, taxonId) {
  const response = await fetch(
    `https://api.inaturalist.org/v1/observations?place_id=${placeId}&taxon_id=${taxonId}`
  );
  const data = await response.json();
  return data.results;
}

function displayObservations(observations) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  observations.forEach((observation) => {
    if (
      !observation.species_guess ||
      !observation.photos ||
      observation.photos.length === 0
    ) {
      return;
    }

    const element = document.createElement("div");
    element.innerHTML = `
          <h3>${observation.species_guess}</h3>
          <img src="${observation.photos[0].url}" alt="${observation.species_guess}">
      `;
    resultsDiv.appendChild(element);
  });
}
