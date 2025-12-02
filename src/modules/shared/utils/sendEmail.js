/* eslint-disable no-undef */
export function sendWelcomeEmail(to, name) {
  Email.send({
    SecureToken: '762901e1-f151-4ce7-b017-8785bbc28096',
    To: to,
    From: 'info@khuska-web.com',
    Subject: '¡Bienvenido a Khuska!',
    Body: 'Un gran abrazo para darte la bienvenida ' + name + ', ¡Ahora eres parte de nuestra familia Khuska!'
  }).then((message) => console.log(message));
}
