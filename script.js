const form = document.getElementById('weatherForm');
    const resultDiv = document.getElementById('result');
    const weatherContainer = document.getElementById('weatherContainer');
    const modeToggle = document.getElementById('modeToggle');
    const currentLocationBtn = document.getElementById('currentLocationBtn');

    // Weather fetch logic
    // async function fetchWeather(location) {
    //   resultDiv.textContent = 'Loading...';
    //   const apiKey = 'd8abfc3446fc40ce91952814252108';
    //   const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=yes`;
      
    //   try {
    //     const response = await fetch(url);
    //     if (!response.ok) throw new Error('Location not found.');
    //     const data = await response.json();
    //     const tempC = data.current.temp_c;
    //     const tempF = data.current.temp_f;
    //     resultDiv.innerHTML = `
    //       <strong>${data.location.name}, ${data.location.country}</strong><br>
    //       Temperature: <strong>${tempC}°C</strong> / <strong>${tempF}°F</strong>
    //     `;
    //   } catch (error) {
    //     resultDiv.textContent = 'Error: ' + error.message;
    //   }
    // }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const location = document.getElementById('location').value.trim();
      resultDiv.textContent = 'Loading...';

      if (!location) {
        resultDiv.textContent = 'Please enter a location.';
        return;
      }

      try {
        const apiKey = 'd8abfc3446fc40ce91952814252108';
        const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=yes`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Location not found.');
        }
        const data = await response.json();
        const tempC = data.current.temp_c;
        const tempF = data.current.temp_f;
        resultDiv.innerHTML = `
          <strong>${data.location.name}, ${data.location.country}</strong><br>
          Temperature: <strong>${tempC}°C</strong> / <strong>${tempF}°F</strong>
        `;
      } catch (error) {
        resultDiv.textContent = 'Error: ' + error.message;
      }
    

    // Submit form
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const location = document.getElementById('location').value.trim();
      if (location) fetchWeather(location);
    });

    // Mouse tilt effect
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 50;
      const y = (window.innerHeight / 2 - e.clientY) / 50;
      weatherContainer.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      weatherContainer.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });

    // Dark/Light Mode Toggle
    modeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        modeToggle.textContent = '☀️ Light Mode';
      } else {
        modeToggle.textContent = '🌙 Dark Mode';
      }
    });

    // Geolocation Button
    currentLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      resultDiv.textContent = 'Detecting location...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (error) => {
          resultDiv.textContent = 'Unable to retrieve your location.';
        }
      );

    });

