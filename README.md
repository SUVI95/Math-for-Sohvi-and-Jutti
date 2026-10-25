# Pakkasretki – matematiikka, luvut 6–10

Harjoitussovellus 7. luokan matematiikan kokeeseen (kirjan luvut 6–10, sivut 26–43): kokonaisluvut, lukusuora, itseisarvo, vastaluku ja sulkeiden poistaminen.

- `index.html` – koko sovellus (yksi tiedosto)
- `api/progress.js` – tallentaa Juliuksen ja Sophian edistymisen tietokantaan

## Vercel ja tietokanta

Tarvitaan vain **yksi** ympäristömuuttuja: `DATABASE_URL` (Postgres, esim. Neon).

1. Tuo tämä repo Verceliin (Add New → Project).
2. Vercelissä: **Storage** → **Create Database** → **Neon (Postgres)** → yhdistä projektiin. Vercel lisää `DATABASE_URL`:n automaattisesti.
   Tai lisää se itse: Settings → Environment Variables → `DATABASE_URL` = tietokannan connection string.
3. Tee uusi deploy (Deployments → Redeploy).

Taulu `progress` luodaan automaattisesti ensimmäisellä käyttökerralla.
Testi: avaa `/api/progress?player=Julius`. Vastaus `{"data":null}` tarkoittaa, että yhteys toimii.

Ilman tietokantaa sovellus toimii silti ja tallentaa edistymisen selaimeen.
Kun tietokanta toimii, nimen alla lukee "tallennettu".

Huom: kirjautumista ei ole, joten kuka tahansa linkin tietävä voi valita nimen.
