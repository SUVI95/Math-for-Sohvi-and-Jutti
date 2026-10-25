# Pakkasretki – matematiikka, luvut 6–10

Harjoitussovellus 7. luokan matematiikan kokeeseen (kirjan luvut 6–10, sivut 26–43): kokonaisluvut, lukusuora, itseisarvo, vastaluku ja sulkeiden poistaminen.

- `index.html` – koko sovellus (yksi tiedosto)
- `api/progress.js` – tallentaa Juliuksen ja Sophian edistymisen tietokantaan

## Vercel ja tietokanta

1. Tuo tämä repo Verceliin (Add New → Project). Asetuksia ei tarvitse muuttaa.
2. Vercelissä: projektin **Storage** → **Create Database** → **Upstash for Redis** (Marketplace) → yhdistä projektiin.
   Vercel lisää ympäristömuuttujat (`KV_REST_API_URL` ja `KV_REST_API_TOKEN` tai `UPSTASH_REDIS_REST_URL` ja `UPSTASH_REDIS_REST_TOKEN`) automaattisesti.
3. Tee uusi deploy (Deployments → Redeploy).

Ilman tietokantaa sovellus toimii silti ja tallentaa edistymisen selaimeen.
Kun tietokanta toimii, nimen alla lukee "tallennettu".

Huom: kirjautumista ei ole, joten kuka tahansa linkin tietävä voi valita nimen.
