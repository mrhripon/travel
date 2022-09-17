// Pages Name 
const page_home = 'index.html';
const page_viewAll = 'view-all.html';
const page_sku = 'sku.html';
const page_confirmation = 'confirmation.html';

// Site Data URL 
const APP_URL = './data.json';

// Global Variable 
let homePackages, allPackages, departurePlace, departurePlaceValue, data;

// Getting Page Name
let pageName = (() => {
    return window.location.pathname.split("/").pop();
})();


// All DOM Elements 
if (pageName === page_home) {
    departurePlace = document.getElementById('departure_place');
    departurePlaceValue = departurePlace.value;
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

        console.log(data)

        console.log(response.ok)

        // 2. Store Data 
        localStorage.setItem('data', JSON.stringify(data));

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

// Script For hero slider and filter selection 
if (pageName === page_home || pageName === page_viewAll) {
    window.addEventListener('DOMContentLoaded', function () {
        let heroCarousel = new Splide('.hero-carousel', {
            perPage: 1,
            speed: 2000,
            rewind: 'loop'
        });
        heroCarousel.mount();
        NiceSelect.bind(document.getElementById("departure_place"), { searchable: true });
        NiceSelect.bind(document.getElementById("number_of_day"));
        NiceSelect.bind(document.getElementById("number_of_package"));
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
                dataFiltered = el.products.filter(item => {
                    return item.departure_id == query;
                })

                if (dataFiltered.length == 0) {
                    return 'There is no package under your query!!';

                }
                for (let i = 0; i < dataFiltered.length; i++) {
                    if (i === 4) break;
                    innerHtml += `<div class="col-3 mb-4"><a href="sku.html" id="${dataFiltered[i].id}" class="package-card d-block">
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
    console.log('content-loaded')
    addEventToPackages();
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
                    innerHtml += `<div class="col-3 mb-4"><a href="sku.html" class="package-card d-block">
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
    let data = JSON.parse(localStorage.getItem('data'));
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


function addEventToPackages() {
    console.log('add event')
    let totalPackage = document.querySelectorAll('.package-card');
    totalPackage.forEach(each => {
        each.addEventListener('click', function (event) {

            localStorage.setItem('sku-info', each.id)
        })
    })

}


// ============= sku page part ============
if (pageName === page_sku) {

    function getDesiredSku() {
        const skuId = localStorage.getItem('sku-info');
        const data = JSON.parse(localStorage.getItem('data'));
        let skuArray = [];
        data.forEach((el) => {
            console.log(el.products)
            skuArray = [...skuArray, ...el.products];
        })
        let desiredSku = skuArray.filter(each => {
            return each.id == skuId;
        })

        return desiredSku;
    }

    function renderSku(data) {
        let html = '';
        const thumbnailSlider = document.getElementById('thumbnail-slider');
        const thumbSlContent = thumbnailSlider.querySelector('.splide__list');
        const mainSlider = document.getElementById('main-slider');
        const mainSlContent = mainSlider.querySelector('.splide__list');
        data[0].sku.skuImg.forEach(each => {
            html += `<li class="splide__slide">
            <div class="thumb-slide border_radius_4 overflow-hidden">
                <img class="img-fluid w-100" src="${each}" alt="">
            </div>
        </li>`
        })
        thumbSlContent.innerHTML = html;
        mainSlContent.innerHTML = html;

        console.log(data[0].sku)
    }

    // 1. get Desired Sku Data
    const skuData = getDesiredSku();

    // 2. Render Sku Data 
    renderSku(skuData)


    // 3. Calling slider activation 
    document.addEventListener('DOMContentLoaded', function () {
        var main = new Splide('#main-slider', {
            type: 'fade',
            heightRatio: 0.478,
            pagination: false,
            arrows: false,
            cover: true,
        });

        var thumbnails = new Splide('#thumbnail-slider', {
            rewind: true,
            fixedWidth: 54,
            fixedHeight: 54,
            isNavigation: true,
            arrows: false,
            gap: 8,
            focus: 'center',
            direction: 'ttb',
            height: '300px',
            pagination: false,
            cover: true,
            dragMinThreshold: {
                mouse: 4,
                touch: 10,
            },
            breakpoints: {
                640: {
                    fixedWidth: 66,
                    fixedHeight: 38,
                },
            },
        });

        main.sync(thumbnails);
        main.mount();
        thumbnails.mount();

    });

    // 4. script for activation Select menu
    NiceSelect.bind(document.getElementById("origin"), { searchable: true });
    NiceSelect.bind(document.getElementById("month"), { searchable: true });
    NiceSelect.bind(document.getElementById("departure_date"), { searchable: true });
    NiceSelect.bind(document.getElementById("number_of_day"));
    NiceSelect.bind(document.getElementById("number_of_package"));
}



















