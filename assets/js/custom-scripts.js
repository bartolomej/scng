document
  .getElementById('subscribe-submit-button')
  .addEventListener('click', async () => {

    let school = document.getElementById('school-select');
    let email = document.getElementById('email');

    document.getElementById('subscription').innerHTML = `<div class="loader"></div>`;

    try {
      let rawResponse = await fetch('http://localhost:3000/api/user/subscribe', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          school: school.options[school.selectedIndex].value,
          email: email.value
        })
      });

      let response = await rawResponse.json();

      if (rawResponse.status === 200) {
        document.getElementById('subscription').innerHTML = `<h3>USPESNO STE NAROCENI NA NOVICE: ${response.email} 😇</h3>`
      } else {
        document.getElementById('subscription').innerHTML = `<h3>NAPAKA: ${response.message} 🤕</h3>`
      }
    } catch (e) {
      document.getElementById('subscription').innerHTML = '<h3>NEZNANA NAPAKA 😷</h3><p>Prosimo poskusite kasneje!</p>';
      console.log(e);
    }
});


document
  .getElementById('contact-submit-button')
  .addEventListener('click', async () => {

    let message = document.getElementById('message');
    let email = document.getElementById('email');

    document.getElementById('subscription').innerHTML = `<div class="loader"></div>`;

    try {
      let rawResponse = await fetch('http://localhost:3000/api/user/message', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message.value,
          email: email.value
        })
      });

      let response = await rawResponse.json();

      if (rawResponse.status === 200) {
        document.getElementById('subscription').innerHTML = `<h3>USPESNO STE POSLALI SPOROCILO 😇</h3>`
      } else {
        document.getElementById('subscription').innerHTML = `<h3>NAPAKA: ${response.message} 🤕</h3>`
      }
    } catch (e) {
      document.getElementById('subscription').innerHTML = '<h3>NEZNANA NAPAKA 😷</h3><p>Prosimo poskusite kasneje!</p>';
      console.log(e);
    }
  });