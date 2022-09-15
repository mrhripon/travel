// Pages Name 
const page_home = 'index.html';
const page_viewAll = 'view-all.html';
const page_sku = 'sku.html';
const page_confirmation = 'confirmation.html';

// Site Data URL 
const APP_URL = './assets/js/data.json';

// Global Variable 
let homePackages, allPackages, departurePlace, departurePlaceValue, data;
let pageName = getPageName();


// All DOM Elements 
if (pageName === page_home) {
    departurePlace = document.getElementById('departure_place');
    departurePlaceValue = departurePlace.value;
    // packages = document.getElementById('packages');

    homePackages = document.getElementById('home-packages');
}

if (pageName === page_viewAll) {
    allPackages = document.getElementById('all-packages');
}


// Function for Getting JSON Data 
const getData = async function (url) {
    try {
        // 1. Get Data 
        const response = await fetch(url);
        data = await response.json();

        console.log(data,)

        // 2. Store Data 
        sessionStorage.setItem('data', JSON.stringify(data));

        // 3. Render
        renderHome(data, departurePlaceValue);


        departurePlace.addEventListener('change', function (event) {
            event.preventDefault();
            renderHome(data, this.value);
        })

    } catch (err) {
        console.log(err)
    }

}

if (pageName === page_home) {
    window.addEventListener('DOMContentLoaded', function () {
        getData(APP_URL);
    })

}

// Function For Render Packages in Home page 
async function renderHome(data, query) {
    console.log('home page alert')
    let html = '';
    await data.forEach((el, index) => {
        html += `<div class="pkg-rw">
        <h1 class="primary-title">Até ${data[index].discount}% OFF</h1>
        <div class="row packages-wrap">
        ${(() => {
                let innerHtml = '', dataFiltered;
                dataFiltered = data[index].products.filter(item => {
                    return item.departure_id == query;
                })

                if (dataFiltered.length == 0) {
                    return 'There is no package under your query!!';

                }
                for (let i = 0; i < dataFiltered.length; i++) {
                    if (i === 4) break;
                    innerHtml += `<div class="col-3 mb-4"><a href="#" class="package-card d-block">
                    <div class="package-card-inner">
                        <div class="package-thumb position-relative">
                            <img src="${dataFiltered[i].package_thumb}" alt="" class="img-fluid w-100">
                            <span class="badge bg-green position-absolute">Nacional</span>
                        </div>
                        <div class="package-content">
                            <h4 class="place-name">${dataFiltered[i].place_name}</h4>
                            <h3 class="price-blk">
                                <span class="from d-block">A partir de</span>
                                R$ <span class="pkg-price d-inline-block">${dataFiltered[i].price}</span>
                            </h3>
        
                            <ul class="facilites">
                                <li><img src="assets/img/airplane.svg" alt="">Voo (ida e volta)</li>
                                <li><img src="assets/img/accomodation.svg" alt="">Hospedagem</li>
                                <li><img src="assets/img/breakfast.svg" alt="">Café da manhã</li>
                            </ul>
                        </div>
                    </div>
                </a>
            </div>`;
                }
                return innerHtml;
            })()}
        </div>
    </div>`
    });
    homePackages.innerHTML = html;
}


// Function For Render Packages in view-all page 
function renderViewAll(data, query) {
    let html = '';
    data.forEach((el, index) => {
        html += `
        ${(() => {
                let innerHtml = '', dataFiltered;

                if (query) {
                    dataFiltered = data[index].products.filter(item => {
                        return item.departure_id == query;
                    })

                } else {
                    dataFiltered = data[index].products;
                }
                console.log(dataFiltered)

                for (let i = 0; i < dataFiltered.length; i++) {
                    innerHtml += `<div class="col-3 mb-4"><a href="#" class="package-card d-block">
                <div class="package-card-inner">
                    <div class="package-thumb position-relative">
                        <img src="${dataFiltered[i].package_thumb}" alt="" class="img-fluid w-100">
                        <span class="badge bg-green position-absolute">Nacional</span>
                    </div>
                    <div class="package-content">
                        <h4 class="place-name">${dataFiltered[i].place_name}</h4>
                        <h3 class="price-blk">
                            <span class="from d-block">A partir de</span>
                            R$ <span class="pkg-price d-inline-block">${dataFiltered[i].price}</span>
                        </h3>
    
                        <ul class="facilites">
                            <li><img src="assets/img/airplane.svg" alt="">Voo (ida e volta)</li>
                            <li><img src="assets/img/accomodation.svg" alt="">Hospedagem</li>
                            <li><img src="assets/img/breakfast.svg" alt="">Café da manhã</li>
                        </ul>
                    </div>
                </div>
            </a>
        </div>`;
                }
                return innerHtml;
            })()}
        `
    });
    allPackages.innerHTML = html;
}

if (pageName === page_viewAll) {
    // console.log(JSON.parse(sessionStorage.getItem('data')));
    // 1. Getting Data 
    let data = JSON.parse(sessionStorage.getItem('data'));
    // 2. Filter Data 
    // 3. Render Data
    renderViewAll(data)

    departurePlace = document.getElementById('departure_place');
    departurePlace.addEventListener('change', function (event) {
        event.preventDefault();
        // console.log(this.value)
        renderViewAll(data, this.value);
    })

}






// Getting Page Name 
function getPageName() {
    return window.location.pathname.split("/").pop();
}












