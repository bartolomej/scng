# Client - Server model

Pri katerikoli komunikaciji imamo navadno nekoga, ki bi rad poslal sporocilo 
nekomu in nekoga, ki bi rad prejel sporocilo. Tako se je oblikovala tudi komunikacija
na internetu. Nastala sta dva koncepta: streznik in odjemalec. Streznik je program ki vedno 
tece v ozadju in poslusa za dolocen dogodek imenovan HTTP zahteva (eng. HTTP request). Ko prejme zahtevo, 
streznik izvrsi poljubno programljivo logiko in nato vrne odziv posiljatelju (eng. HTTP response). 
Odjemalec je v tem primeri v vlogi posiljatelja, ki ima lahko namen dostopati do dolocenega vira na strezniku 
ali pa zeli da se izvrsi dolocena poslovna logika (npr. kreiranje bancne transakcije).

![client-server model](https://i.ibb.co/Jyz2vQ6/client-server-model.png)