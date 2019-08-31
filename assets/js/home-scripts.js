document
  .getElementById('subscribe-submit-button')
  .addEventListener('click', async () => {

    let school = document.getElementById('school-select');
    let email = document.getElementById('email');

    document.getElementById('subscription').innerHTML = `<h3>POSILJANJE 🤗</h3>`;

    try {
      let rawResponse = await fetch('/api/user/subscribe', {
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