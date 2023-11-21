const dummyImagePath = 'assets/items/air.png'; // Path to dummy icon
let config = {};
let translations = {};
let availableImages = [];

async function fetchConfig() {
  try {
    const response = await fetch('assets/config.json');
    return await response.json();
  } catch (error) {
    console.error('Error retrieving configuration data:', error);
    return {};
  }
}

async function loadTranslations() {
  try {
    const response = await fetch('assets/translations.json');
    translations = await response.json();
  } catch (error) {
    console.error('Error reading translation list:', error);
    translations = {};
  }
}

// Translation
async function getTranslation(text) {
  if (Object.keys(translations).length === 0) {
    await loadTranslations();
  }

  if (translations.hasOwnProperty(text)) {
    return translations[text];
  } else {
    return text;
  }
}

async function fetchData() {
  try {
    config = await fetchConfig();
    const response = await fetch('output.json');
    const data = await response.json();
    displayData(data.shops);
    displayLatestFileModDate(data.meta.latestfilemoddate_formatted);
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
}

function displayLatestFileModDate(date) {
  const latestFileModDateElement = document.getElementById('output-container-metadata');
  latestFileModDateElement.textContent = `Latest Data: ${date}`;
}

async function displayData(shops) {
  const outputContainer = document.getElementById('output-container');
  const indexContainer = document.getElementById('output-container-indextable');
  const indexHeadline = document.createElement('h2');
  indexHeadline.textContent = 'Shops';
  indexContainer.append(indexHeadline)

  if (Array.isArray(shops)) {
    for (const shop of shops) {
      if (Object.keys(shop.offers).length == 0 && Object.keys(shop.demands).length == 0) {
        continue;
      }
      //Entry in Index-Table
      const indexEntry = document.createElement('div');
      indexEntry.classList.add('shop-index-entry');

      const indexLink = document.createElement('a');
      indexLink.setAttribute('href', '#' + shop.shop_uuid);


      const indexName = document.createElement('span');
      indexName.classList.add('index-shop-name');
      indexName.textContent = shop.shop_name;
      indexLink.appendChild(indexName)

      const indexOwner = document.createElement('span');
      indexOwner.classList.add('index-shop-owner');
      indexOwner.textContent = `by ${shop.owner_name}`;
      indexLink.appendChild(indexOwner);

      indexEntry.appendChild(indexLink);
      indexContainer.appendChild(indexEntry);

      // Shop-Container
      const shopContainer = document.createElement('div');
      shopContainer.classList.add('shop-container');
      shopContainer.setAttribute('id', shop.shop_uuid);

      // Shopname and information about owner
      const shopInfo = document.createElement('div');
      shopInfo.classList.add('shop-info');

      const shopName = document.createElement('span');
      shopName.classList.add('shop-name');
      shopName.textContent = shop.shop_name;
      shopInfo.appendChild(shopName);

      const shopOwner = document.createElement('span');
      shopOwner.classList.add('shop-owner');
      shopOwner.textContent = `by ${shop.owner_name}`;
      shopInfo.appendChild(shopOwner);

      shopContainer.appendChild(shopInfo);

      // Sales table
      if (Object.keys(shop.offers).length > 0) {
        const sellTableContainer = document.createElement('div');
        sellTableContainer.classList.add('table-container');

        const sellTableTitle = document.createElement('h2');
        sellTableTitle.classList.add('selling-title');
        sellTableTitle.innerHTML = await getTranslation('Selling');
        sellTableContainer.appendChild(sellTableTitle);

        const sellTable = document.createElement('table');
        await setupTable(sellTable, shop.offers, false);
        sellTableContainer.appendChild(sellTable);
        shopContainer.appendChild(sellTableContainer);
      }

      // Purchase table
      if (Object.keys(shop.demands).length > 0) {
        const buyTableContainer = document.createElement('div');
        buyTableContainer.classList.add('table-container');

        const buyTableTitle = document.createElement('h2');
        buyTableTitle.classList.add('buying-title');
        buyTableTitle.innerHTML = await getTranslation('Buying');
        buyTableContainer.appendChild(buyTableTitle);

        const buyTable = document.createElement('table');
        await setupTable(buyTable, shop.demands, true);
        buyTableContainer.appendChild(buyTable);
        shopContainer.appendChild(buyTableContainer);
      }

      outputContainer.appendChild(shopContainer);
    }
  } else {
    console.error('Invalid data format:', shops);
  }
}

// Table setup function
async function setupTable(table, items, isBuyTable) {
  // Table header
  const headerRow = table.insertRow();
  let headers = [];
  if (isBuyTable) {
    headers = ['Item', 'Menge', 'Preis', 'Stückpreis', 'Nachfrage'];
  } else {
    headers = ['Item', 'Menge', 'Preis', 'Stückpreis', 'Bestand'];
  }
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  // Items
  for (const itemKey in items) {
    const item = items[itemKey];
    const row = table.insertRow();

    // Item Name
    const itemNameCell = row.insertCell();

    // Adding Item Icon
    const itemImageSpan = document.createElement('span');
    itemImageSpan.classList.add('item-image');

    const itemImage = document.createElement('img');
    let imagePath = `assets/items/${item.item.toLowerCase()}.png`; // Path to icons
    if (item.own_name !== null && item.own_name.startsWith('item.jmmf.')) {
      imagePath = `assets/items/joshs-more-foods/${item.own_name.slice(10).toLowerCase()}.png`;
    } 
    // Check if the icon exists
    if (availableImages.includes(imagePath)) {
      itemImage.src = imagePath;
      itemImage.alt = translatedName;
      itemImageSpan.appendChild(itemImage);
    } else {
      fetch(imagePath).then(response => {
        if (response.ok) {
          itemImage.src = imagePath;
          itemImage.alt = translatedName;
          availableImages.push(imagePath);
        } else {
          // Image not found, use dummy icon
          itemImage.src = dummyImagePath;
          itemImage.alt = 'Dummy Image';
        }
      }).catch(error => {
        console.error('Error on loading item image:', error);
        // If there is an error, also use the dummy icon
        itemImage.src = dummyImagePath;
        itemImage.alt = 'Dummy Image';
      }). finally(() => {
        itemImageSpan.appendChild(itemImage);
      });
    }

    // adding text
    const itemNameText = document.createElement('span');
    const translatedName = await getTranslation(item.own_name || item.item);
    itemNameText.classList.add('item-name');
    itemNameText.textContent = translatedName;

    itemNameCell.appendChild(itemImageSpan);
    itemNameCell.appendChild(itemNameText);

    // quantity
    const amountCell = row.insertCell();
    amountCell.textContent = item.amount;

    const priceCell = row.insertCell();
    const unitPriceCell = row.insertCell();

    if (typeof item.price_discount !== "undefined" && item.price_discount !== 0) {
        const discountSpan = document.createElement("span");
        discountSpan.classList.add("discount-percentage");
        discountSpan.textContent = item.price_discount + " %";
        priceCell.appendChild(discountSpan);
        priceCell.classList.add("discount");
        unitPriceCell.classList.add("discount");
    }

    // price
    let price = item.price;
    const priceSpan = document.createElement("span");
    priceSpan.classList.add("price");
    if (typeof item.price_discount !== 'undefined') {
      price = item.price_discount === 0
        ? item.price
        : item.price - (item.price * (item.price_discount / 100));
    }

    const priceSpanText = document.createElement("span");
    priceSpanText.textContent = price;

    const exchangeItemIcon = document.createElement("img");
    exchangeItemIcon.setAttribute('title', await getTranslation(item.exchange_item));

    let exImagePath = dummyImagePath; // Path to icons

    if (item.exchange_item == 'money') {
      priceSpan.textContent = config.currencySymbolPosition === 'before'
        ? `${config.currencySymbol}${price.toFixed(2)}`
        : `${price.toFixed(2)}${config.currencySymbol}`;
    } else {

      exImagePath = `assets/items/${item.exchange_item.toLowerCase()}.png`; // Path to icons
      if (item.own_name !== null && item.exchange_item.startsWith('item.jmmf.')) {
        exImagePath = `assets/items/joshs-more-foods/${item.exchange_item.slice(10).toLowerCase()}.png`;
      }

      // Check if the icon exists
      if (availableImages.includes(exImagePath)) {
        exchangeItemIcon.src = exImagePath;
        exchangeItemIcon.alt = translatedName;
      } else {
        fetch(exImagePath).then(response => {
          if (response.ok) {
            exchangeItemIcon.src = exImagePath;
            exchangeItemIcon.alt = translatedName;
            availableImages.push(exImagePath);
          } else {
            // Image not found, use dummy icon
            exchangeItemIcon.src = dummyImagePath;
            exchangeItemIcon.alt = 'Dummy Image';
          }
        }).catch(error => {
          console.error('Error on loading item image:', error);
          // If there is an error, also use the dummy icon
          exchangeItemIcon.src = dummyImagePath;
          exchangeItemIcon.alt = 'Dummy Image';
        }). finally(() => {
          if (config.currencySymbolPosition === "before"){
            priceSpan.appendChild(exchangeItemIcon);
            priceSpan.appendChild(priceSpanText);
          } else {
            priceSpan.appendChild(priceSpanText);
            priceSpan.appendChild(exchangeItemIcon);
          }
        });
      }
    }

    priceCell.appendChild(priceSpan);

    // price per unit
    const unitpriceSpan = document.createElement("span");
    unitpriceSpan.classList.add("price");

    let unit_price = item.unit_price;
    if (typeof item.price_discount !== "undefined") {
      unit_price = item.price_discount === 0
        ? item.unit_price
        : item.unit_price - item.unit_price * (item.price_discount / 100);
    }
    const unitpriceSpanText = document.createElement("span");
    unitpriceSpanText.textContent = unit_price;

    if (item.exchange_item == 'money') {
      unitpriceSpan.textContent = config.currencySymbolPosition === "before"
        ? `${config.currencySymbol}${unit_price.toFixed(2)}`
        : `${unit_price.toFixed(2)}${config.currencySymbol}`;
    } else {

      const newExchangeItemIcon = document.createElement("img");
      newExchangeItemIcon.setAttribute('title', await getTranslation(item.exchange_item));
      newExchangeItemIcon.setAttribute('alt', await getTranslation(item.exchange_item));
      exImagePath = `assets/items/${item.exchange_item.toLowerCase()}.png`; // Path to icons
      if (item.own_name !== null && item.exchange_item.startsWith('item.jmmf.')) {
        exImagePath = `assets/items/joshs-more-foods/${item.exchange_item.slice(10).toLowerCase()}.png`;
      }

      newExchangeItemIcon.src = exImagePath;

      if (config.currencySymbolPosition === "before"){
        unitpriceSpan.appendChild(newExchangeItemIcon);
        unitpriceSpan.appendChild(unitpriceSpanText);
      } else {
        unitpriceSpan.appendChild(unitpriceSpanText);
        unitpriceSpan.appendChild(newExchangeItemIcon);
      }
    }

    if (typeof item.is_best_price !== "undefined" && item.is_best_price == true) {
        const bestpriceSpan = document.createElement("span");
        bestpriceSpan.classList.add("bestprice-tag");
        bestpriceSpan.innerHTML = "&#9989;";
        bestpriceSpan.setAttribute('title', 'best price');
        unitPriceCell.appendChild(bestpriceSpan);
        priceCell.classList.add("bestprice");
        unitPriceCell.classList.add("bestprice");
    }

    unitPriceCell.appendChild(unitpriceSpan);

    // stock or demand
    const stockCell = row.insertCell();
    if (isBuyTable) {
      stockCell.textContent = item.buy_limit;
    } else {
      stockCell.textContent = item.stock === 0
        ? 'Sold out'
        : item.stock;
      if (item.stock < 5) {
        stockCell.classList.add('low-stock');
      }
    }
  }
}

window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  var scrollBtn = document.getElementById("btnScroll2Top");
  if (document.body.scrollTop > (window.innerHeight * 0.1) || document.documentElement.scrollTop > (window.innerHeight * 0.1)) {
    scrollBtn.style.display = "block";
    scrollBtn.style.opacity = ".666";
  } else {
    scrollBtn.style.opacity = "0";
    setTimeout(function() {
      scrollBtn.style.display = "none";
    }, 300);
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
// Run fetchData on page load
fetchData();