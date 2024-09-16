// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch and render data
  await fetchCryptoData();
});

// Fetch top 10 crypto data from the server and populate the table
async function fetchCryptoData() {
  try {
    // Fetch data from the server
    const response = await fetch("/api/crypto");
    const data = await response.json();

    // Populate the best price and table rows
    populateBestPrice(data[0].last);
    populateTableRows(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Populate the best price in the header
function populateBestPrice(price) {
  const bestPriceElement = document.getElementById("best-price");
  bestPriceElement.textContent = `₹ ${price}`;
}

// Populate the table with crypto data
function populateTableRows(data) {
  const tableBody = document.querySelector("#exchange-table tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  // Loop through each crypto item and create table rows
  data.forEach((item) => {
    const row = `
            <tr>
                <td>${item.name}</td>
                <td>₹ ${item.last}</td>
                <td>₹ ${item.buy}</td>
                <td>₹ ${item.sell}</td>
                <td>${item.volume}</td>
                <td>${item.base_unit}</td>
            </tr>
        `;
    tableBody.innerHTML += row; // Append the row to the table
  });
}
