document
  .getElementById('submit-button')
  .addEventListener('click', async () => {

    document.getElementById('subscription').innerHTML = '<i class="fab fa-slack fa-stack-1x"></i>';

    let e = document.getElementById('school-select');

    try {
      let response = await fetch('http://localhost:3000/api/user/subscribe', {
        method: 'POST',
        body: {
          school: e.options[e.selectedIndex].value,
          email: document.getElementById('cemail').value
        }
      }).then(async res => await res.json());

      if (response.status === 'ok') {
        document.getElementById('subscription').innerHTML = '<h2>USPESNO STE NAROCENI NA NOVICE</h2>'
      }
    } catch (e) {
      document.getElementById('subscription').innerHTML = '<h2>NEZNANA NAPAKA</h2><p>Prosimo poskusite kasneje!</p>'
    }
});