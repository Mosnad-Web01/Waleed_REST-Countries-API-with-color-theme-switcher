// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  themeToggle.textContent = body.classList.contains("dark")
    ? "Light Mode" // If dark mode is active, show "Light Mode"
    : "Dark Mode"; // If light mode is active, show "Dark Mode"
});

// Data fetching and rendering from data.json
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    renderCountries(data); // Render the list of countries after fetching data
    setupSearchFunctionality(data); // Set up search functionality
  })
  .catch((error) => console.error("Error fetching countries:", error));

// Function to render the list of countries
function renderCountries(countries) {
  const countryList = document.getElementById("country-list");
  countryList.innerHTML = ""; // Clear the list before re-rendering

  countries.forEach((country) => {
    const li = document.createElement("li");
    li.classList.add("country-item");
    li.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${country.name}">
      <div class="info">
        <h2>${country.name}</h2>
        <p>Population: ${country.population.toLocaleString()}</p>
        <p>Region: ${country.region}</p>
        <p>Capital: ${country.capital}</p>
      </div>
    `;
    li.addEventListener("click", () => showCountryDetails(country));
    countryList.appendChild(li);
  });
}

// Function to show detailed information of a selected country
function showCountryDetails(country) {
  const countryList = document.getElementById("country-list");
  const countryDetails = document.getElementById("country-details");

  countryList.style.display = "none"; // Hide the list of countries
  countryDetails.classList.add("active"); // Show the details section

  let detailsHTML = `
    <button class="back-button">Back</button>
    <div class="details">
      <img src="${country.flags.svg}" alt="Flag of ${country.name}">
      <div class="text">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Native Name:</strong> ${country.nativeName}</p>
        <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(
          ", "
        )}</p>
        <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Demonym:</strong> ${country.demonym}</p>
        <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
        <p><strong>Numeric Code:</strong> ${country.numericCode}</p>
        <p><strong>Alpha2 Code:</strong> ${country.alpha2Code}</p>
        <p><strong>Alpha3 Code:</strong> ${country.alpha3Code}</p>
        <p><strong>Calling Codes:</strong> ${country.callingCodes.join(
          ", "
        )}</p>
        <p><strong>Alt Spellings:</strong> ${country.altSpellings.join(
          ", "
        )}</p>
        <strong>Currencies:</strong>
        <ul>`;

  country.currencies.forEach((currency) => {
    detailsHTML += `<li>${currency.code} - ${currency.name} (${currency.symbol})</li>`;
  });

  detailsHTML += `</ul>
        <strong>Languages:</strong>
        <ul>`;

  country.languages.forEach((language) => {
    detailsHTML += `<li>${language.name} (${language.nativeName})</li>`;
  });

  detailsHTML += `</ul>`;

  if (country.borders.length > 0) {
    detailsHTML += `<strong>Bordering Countries:</strong><ul>`;
    country.borders.forEach((borderCode) => {
      detailsHTML += `<li>${borderCode}</li>`; // Currently shows only country code
    });
    detailsHTML += `</ul>`;
  }

  detailsHTML += `</div></div>`;

  countryDetails.innerHTML = detailsHTML;

  const backButton = countryDetails.querySelector(".back-button");
  backButton.addEventListener("click", () => {
    countryDetails.classList.remove("active");
    countryList.style.display = "grid"; // Show the list of countries again
  });
}

// Function to set up search functionality
function setupSearchFunctionality(countries) {
  const searchInput = document.getElementById("search");
  const regionSelect = document.getElementById("region-filter");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );
    renderCountries(filteredCountries);
  });

  regionSelect.addEventListener("change", () => {
    const selectedRegion = regionSelect.value;
    const filteredCountries =
      selectedRegion === ""
        ? countries
        : countries.filter((country) => country.region === selectedRegion);
    renderCountries(filteredCountries);
  });
}
