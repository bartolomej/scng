# SCNG services

This is a back-end system for SCNG APP. <br>
You can find front-end mobile app repository [here](https://github.com/bartolomej/scng-mobile).<br>
Documentation website is available [here](https://bartolomej.github.io/scng-api/#/).


### Project setup
1. Clone repo locally `git clone https://github.com/bartolomej/scng-api.git`
2. Install external node modules `npm i`
3. Configure `.env` environment file
4. Run all tests with `jest test`
5. Run application with `npm start`

### App configuration

Instead of hard-coding config into some file that is committed to git, it is a good practise to provide app configuration values is via "environmental variables".

That way you achieve a healthy separation of configuration (the inputs that the app receives) and the application itself.
Read more about "good practises" [here](*https://12factor.net/config).

An example configuration file can be found under `./env.examples`.

### How to configure email service

1. Create a new dummy google account
2. [Disable 2FA auth](https://support.google.com/accounts/answer/1064203?co=GENIE.Platform%3DDesktop&hl=en) so that app can login autonomously without your confirmation
3. Allow access for less secure apps [here](https://myaccount.google.com/lesssecureapps)
3. Provide google account credentials to environmental variables

### Common issue solutions

- [You get `ER_NOT_SUPPORTED_AUTH_MODE` on startup](https://github.com/typeorm/typeorm/issues/2093#issuecomment-574613981)
