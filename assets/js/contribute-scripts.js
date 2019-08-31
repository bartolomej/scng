document
  .getElementById('contact-submit-button')
  .addEventListener('click', async () => {

    let message = document.getElementById('message');
    let email = document.getElementById('email');

    document.getElementById('subscription').innerHTML = `<h3>POSILJANJE 🤗</h3>`;

    try {
      let rawResponse = await fetch('/api/user/message', {
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

      console.log(rawResponse)

      let response = await rawResponse.json();

      console.log(response);

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