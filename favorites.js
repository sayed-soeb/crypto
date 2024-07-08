document.addEventListener("DOMContentLoaded", function() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        alert('No favorite coins found.');
        return;
    }

    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${favorites.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false`;

    function showLoading() {
        document.getElementById('loadingShimmer').style.display = 'block';
    }

    function hideLoading() {
        document.getElementById('loadingShimmer').style.display = 'none';
    }

    showLoading();
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            populateFavoritesTable(data);
        })
        .catch(error => console.error('Error fetching the data:', error));

    function populateFavoritesTable(data) {
        const tableBody = document.querySelector("#favoritesTable tbody");
        tableBody.innerHTML = '';
        data.forEach(coin => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${coin.name}</td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price.toLocaleString()}</td>
                <td>$${coin.market_cap.toLocaleString()}</td>
                <td>
                    <button onclick="unlikeCoin('${coin.id}')">Unlike</button>
                    <button onclick="viewDetails('${coin.id}')">View</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.unlikeCoin = function(coinId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(coinId)) {
            favorites = favorites.filter(id => id !== coinId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Coin unliked!');
            location.reload(); // Refresh the page to update the table
        }
    }

    window.viewDetails = function(coinId) {
        window.location.href = `coins.html?id=${coinId}`;
    }
});
