(function () {
    'use strict';

    var app = {
        isLoading: true,
        visibleCards: {},
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main'),
        addDialog: document.querySelector('.dialog-container'),
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };


    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    document.getElementById('butAdd').addEventListener('click', function () {
        // Open/show the add new city dialog
        app.toggleAddDialog(true);
    });

    document.getElementById('butAddSupplier').addEventListener('click', function () {
        // var selected = select.options[select.selectedIndex];
        // var key = selected.value;
        // var label = selected.textContent;
        // app.getForecast(key, label);
        // app.selectedCities.push({key: key, label: label});
        // app.saveSelectedCities();
        // app.toggleAddDialog(false);
    });

    document.getElementById('butAddCancel').addEventListener('click', function () {
        // Close the add new city dialog
        app.toggleAddDialog(false);
    });


    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new city dialog.
    app.toggleAddDialog = function (visible) {
        if (visible) {
            app.addDialog.classList.add('dialog-container--visible');
        } else {
            app.addDialog.classList.remove('dialog-container--visible');
        }
    };

    app.updateAlertCard = function (data) {
        var dataLastUpdated = new Date(data.created);
        // var current = data.channel.item.condition;
        // var humidity = data.channel.atmosphere.humidity;
        // var wind = data.channel.wind;

        var card = app.visibleCards[data.key];
        if (!card) {
            card = app.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.supplierName').textContent = data.name;
            card.removeAttribute('hidden');
            app.container.appendChild(card);
            app.visibleCards[data.key] = card;
        }

        // Verifies the data provide is newer than what's already visible
        // on the card, if it's not bail, if it is, continue and update the
        // time saved in the card
        var cardLastUpdatedElem = card.querySelector('.card-last-updated');
        var cardLastUpdated = cardLastUpdatedElem.textContent;
        if (cardLastUpdated) {
            cardLastUpdated = new Date(cardLastUpdated);
            // Bail if the card has more recent data then the data
            if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
                return;
            }
        }
        cardLastUpdatedElem.textContent = data.created;

        card.querySelector('.business-type').textContent = data.businessType;
        card.querySelector('.chain').textContent = data.chain;
        card.querySelector('.current .icon').classList.add("alert");
        card.querySelector('.current .supplier-type').textContent = data.supplierType;
        card.querySelector('.current .department-type').textContent = data.departmentType;
        card.querySelector('.current .supplier-status').textContent = data.supplierStatus;
        card.querySelector('.current .street-address').textContent = data.streetAddress;
        card.querySelector('.current .street-address2').textContent = data.streetAddress2;
        card.querySelector('.current .city').textContent = data.city;
        card.querySelector('.current .governing-district').textContent = data.governingDistrict;
        card.querySelector('.current .postal-code').textContent = data.postalCode;
        card.querySelector('.current .operating-region').textContent = data.operatingRegion;


        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };


    /*****************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/

    /*
     * Gets a forecast for a specific city and updates the card with the data.
     * getForecast() first checks if the weather data is in the cache. If so,
     * then it gets that data and populates the card with the cached data.
     * Then, getForecast() goes to the network for fresh data. If the network
     * request goes through, then the card gets updated a second time with the
     * freshest data.
     */
    // app.getForecast = function(key, label) {
    //   var statement = 'select * from weather.forecast where woeid=' + key;
    //   var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
    //       statement;
    //   // TODO add cache logic here
    //   if ('caches' in window) {
    //     /*
    //      * Check if the service worker has already cached this city's weather
    //      * data. If the service worker has the data, then display the cached
    //      * data while the app fetches the latest data.
    //      */
    //     caches.match(url).then(function(response) {
    //       if (response) {
    //         response.json().then(function updateFromCache(json) {
    //           var results = json.query.results;
    //           results.key = key;
    //           results.label = label;
    //           results.created = json.query.created;
    //           app.updateAlertCard(results);
    //         });
    //       }
    //     });
    //   }
    //   // Fetch the latest data.
    //   var request = new XMLHttpRequest();
    //   request.onreadystatechange = function() {
    //     if (request.readyState === XMLHttpRequest.DONE) {
    //       if (request.status === 200) {
    //         var response = JSON.parse(request.response);
    //         var results = response.query.results;
    //         results.key = key;
    //         results.label = label;
    //         results.created = response.query.created;
    //         app.updateAlertCard(results);
    //       }
    //     } else {
    //       // Return the initial weather forecast since no data is available.
    //       app.updateAlertCard(initialWeatherForecast);
    //     }
    //   };
    //   request.open('GET', url);
    //   request.send();
    // };

    // Iterate all of the cards and attempt to get the latest forecast data
    app.updateForecasts = function () {
        var keys = Object.keys(app.visibleCards);
        keys.forEach(function (key) {
            app.getForecast(key);
        });
    };

    // TODO add saveSelectedCities function here
    // Save list of cities to localStorage.
    app.saveSelectedCities = function () {
        var selectedCities = JSON.stringify(app.selectedCities);
        localStorage.selectedCities = selectedCities;
    };

    var alertOne = {
        key: '2459115',
        name: 'Courtyard Marriott Stockholm',
        parent: 'Marriott Inernational',
        // created: '2016-07-22T01:00:00Z',
        businessType: 'Hotel',
        chain: 'Marriott',
        supplierType: 'Accommodation',
        departmentType: 'SMM',
        supplierStatus: 'Preferred Partner',
        streetAddress: 'Rålambshovsleden 50',
        streetAddress2: '112 19',
        city: 'Stockholm',
        governingDistrict: '',
        postalCode: '112 19',
        operatingRegion: 'EMEA',
        phone: '+46 8 441 31 00',
        email: 'info@stockhom.marriott.com',
        fax: '+46 8 441 31 77',
        web: 'www.marriott.com/stockholm',
        billingCurrency: '',
        financialSystems: '',
        contacts: ''
    };

    var alertTwo = {
        key: '2459775',
        name: 'New York Marriott Marquis',
        parent: 'Marriott Inernational',
        // created: '2016-07-22T01:00:00Z',
        businessType: 'Hotel',
        chain: 'Marriott',
        supplierType: 'Accommodation',
        departmentType: 'SMM',
        supplierStatus: 'Preferred Partner',
        streetAddress: '1535 Broadway',
        streetAddress2: '',
        city: 'New York',
        governingDistrict: 'NY',
        postalCode: '10036',
        operatingRegion: 'NORAM',
        phone: '(212) 398-1900',
        email: '',
        fax: '(212) 398-1901',
        web: 'http://www.marriott.com/hotels/travel/nycmq-new-york-marriott-marquis',
        billingCurrency: '',
        financialSystems: '',
        contacts: ''
    };


    // TODO uncomment line below to test app with fake data
    // app.updateAlertCard(alertOne);
    // app.updateAlertCard(alertTwo);

    /************************************************************************
     *
     * Code required to start the app
     *
     * NOTE: To simplify this codelab, we've used localStorage.
     *   localStorage is a synchronous API and has serious performance
     *   implications. It should not be used in production applications!
     *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
     *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
     ************************************************************************/

    // TODO add startup code here
    app.selectedCities = localStorage.selectedCities;
    if (app.selectedCities) {
        app.selectedCities = JSON.parse(app.selectedCities);
        app.selectedCities.forEach(function (city) {
            app.getForecast(city.key, city.label);
        });
    } else {
        app.updateAlertCard(alertOne);
        app.updateAlertCard(alertTwo);
    }

})();
