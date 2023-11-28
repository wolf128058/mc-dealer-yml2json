const dummyImagePath = 'assets/items/air.png'; // Path to dummy icon
const romanNumerals = {1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };
var selectedLanguage = null;
let config = {};
let translations = {};
let availableImages = [];

async function setSimpleThFont() {
  const style = document.createElement("style");
  style.textContent = "th { font-family: sans-serif; }";

  const head = document.head || document.getElementsByTagName("head")[0];
  if (head) {
    head.appendChild(style);
  }
}

async function fetchConfig() {
  try {
    const response = await fetch('assets/config.json');
    return await response.json();
  } catch (error) {
    console.error('Error retrieving configuration data:', error);
    return {};
  }
}

async function showTranslationMenu(languages2offer) {
  const langContainer = document.getElementById("languages-container");
  const langSelect = document.createElement("select");
  langSelect.setAttribute("id", "language-select");
  langSelect.addEventListener("change", changeLanguage);

  languages2offer.forEach(lang => {
    let langOption = document.createElement("option");
    langOption.setAttribute("value", lang);
    langOption.textContent = lang;
    langSelect.append(langOption);
  });
  langContainer.append(langSelect);
}

async function loadTranslations(iso2alpha) {
  try {
    const response = await fetch("assets/translations_" + iso2alpha + ".json");
    translations = await response.json();
  } catch (error) {
    console.error("Error reading translation list:", error);
    translations = {};
  }

  if (iso2alpha === "cn") {
    setSimpleThFont();
  }
}

async function changeLanguage() {
  const selectElement = document.getElementById("language-select");
  const selectedLanguage = selectElement.value;
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  document.cookie = `preferredLanguage=${selectedLanguage}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  window.location.reload();
}

async function checkLanguageCookie(defaultLanguage) {
  const cookies = document.cookie.split(";");
  let preferredLanguage = null;

  cookies.forEach(cookie => {
    const [name, value] = cookie.split("=");
    if (name.trim() === "preferredLanguage") {
      preferredLanguage = value;
    }
  });

  const selectElement = document.getElementById("language-select");
  if (preferredLanguage) {
    selectElement.value = preferredLanguage;
    selectedLanguage = preferredLanguage;
  } else {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    document.cookie = `preferredLanguage=${defaultLanguage}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
    selectElement.value = defaultLanguage;
    selectedLanguage = defaultLanguage;
  }
}

// Translation
async function getTranslation(text) {
  if (Object.keys(translations).length === 0) {
    await loadTranslations(selectedLanguage);
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
    showTranslationMenu(config.offerLanguages);
    checkLanguageCookie(config.defaultLanguage);
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
      if (shop.shop_type == 'ADMIN') {
        shopOwner.textContent = `by ${shop.owner_name} 🤖`;
      } else {
        shopOwner.textContent = `by ${shop.owner_name}`;
      }
      shopInfo.appendChild(shopOwner);

      shopContainer.appendChild(shopInfo);

      const shopLocation = document.createElement('div');
      shopLocation.classList.add('shop-location');
      shopLocation.textContent = `🚩 ${shop.location.x.toFixed(0)}, ${shop.location.y.toFixed(0)}, ${shop.location.z.toFixed(0)} @ ${shop.location.world}`;

      shopInfo.appendChild(shopLocation);

      // Sales table
      if (Object.keys(shop.offers).length > 0) {
        const sellTableContainer = document.createElement('div');
        sellTableContainer.classList.add('table-container');

        const sellTableTitle = document.createElement('h2');
        sellTableTitle.classList.add('selling-title');
        sellTableTitle.innerHTML = await getTranslation('MCDEALER_HEADLINE_SELLING');
        sellTableContainer.appendChild(sellTableTitle);

        const sellTable = document.createElement('table');
        await setupTable(sellTable, shop.offers, false, shop.shop_type);
        sellTableContainer.appendChild(sellTable);
        shopContainer.appendChild(sellTableContainer);
      }

      // Purchase table
      if (Object.keys(shop.demands).length > 0) {
        const buyTableContainer = document.createElement('div');
        buyTableContainer.classList.add('table-container');

        const buyTableTitle = document.createElement('h2');
        buyTableTitle.classList.add('buying-title');
        buyTableTitle.innerHTML = await getTranslation('MCDEALER_HEADLINE_BUYING');
        buyTableContainer.appendChild(buyTableTitle);

        const buyTable = document.createElement('table');
        await setupTable(buyTable, shop.demands, true, shop.shop_type);
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
async function setupTable(table, items, isBuyTable, shopType) {
  // Table header
  const headerRow = table.insertRow();
  let headers = [];
  if (isBuyTable) {
    headers = [
      await getTranslation('MCDEALER_HEADLINE_ITEM'),
      await getTranslation('MCDEALER_HEADLINE_AMOUNT'),
      await getTranslation('MCDEALER_HEADLINE_PRICE'),
      await getTranslation('MCDEALER_HEADLINE_UNIT_PRICE'),
      await getTranslation('MCDEALER_HEADLINE_DEMAND'),
        ];
  } else {
    headers = [
      await getTranslation('MCDEALER_HEADLINE_ITEM'),
      await getTranslation('MCDEALER_HEADLINE_AMOUNT'),
      await getTranslation('MCDEALER_HEADLINE_PRICE'),
      await getTranslation('MCDEALER_HEADLINE_UNIT_PRICE'),
      await getTranslation('MCDEALER_HEADLINE_STOCK'),
        ];
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
    if (shopType !== 'ADMIN') {
      if (isBuyTable) {
        stockCell.textContent = item.buy_limit;
      } else {
        stockCell.textContent = item.stock === 0
          ? await getTranslation('MCDEALER_LABEL_SOLD_OUT')
          : item.stock;
        if (item.stock < 5) {
          stockCell.classList.add('low-stock');
        }
      }
    } else {
      stockCell.textContent = '∞';
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