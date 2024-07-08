document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const coinId = params.get('id');
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;
    const chartApiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`;

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
            displayCoinDetails(data);
        })
        .catch(error => console.error('Error fetching the data:', error));

    function displayCoinDetails(data) {
        document.getElementById('coinName').textContent = data.name;
        document.getElementById('coinImage').src = data.image.large;
        document.getElementById('coinDescription').textContent = data.description.en;
        document.getElementById('rank').textContent = data.market_cap_rank;
        document.getElementById('price').textContent = data.market_data.current_price.usd.toLocaleString();
        document.getElementById('marketCap').textContent = data.market_data.market_cap.usd.toLocaleString();
        fetchChart(chartApiUrl);
    }

    document.getElementById('timeRange').addEventListener('change', function(e) {
        const days = e.target.value === '24h' ? 1 : e.target.value === '30d' ? 30 : 90;
        fetchChart(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    });

    function fetchChart(url) {
        showLoading();
        fetch(url)
            .then(response => response.json())
            .then(data => {
                hideLoading();
                renderChart(data);
            })
            .catch(error => console.error('Error fetching the data:', error));
    }

    function renderChart(data) {
        const ctx = document.getElementById('priceChart').getContext('2d');
        const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
        const prices = data.prices.map(price => price[1]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price (USD)',
                    data: prices,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    pointStyle: 'rectRot'  // Set the point style here
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true  // Use point style for legend
                        }
                    }
                }
            }
        });
    }
});
