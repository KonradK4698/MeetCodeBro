# MeetCodeBro



## Instrukcja uruchomienia 

1. Zainstaluj niezbędne pliki w folderze głównym komendą ```npm install```
2. Przejdź do pliku **.env**, wprowadź swój klucz prywatny ```PRIV_KEY = "twój klucz"```
2. Wygeneruj klucz publiczny i prywatny wpisując komendę w folderze głównym ```node generateKeypair.js```
3. Zainstaluj [Neo4J](https://neo4j.com/docs/operations-manual/current/installation/) najlepiej w wersji Desktop,
4. Utwórz bazę danych w zainstalowanej aplikacji Neo4J 
5. Przejdź do pliku **.env** w folderze głównym, następnie wprowadź dane do zalogowania się w bazie danych<br/>
```
DB_LOGIN = "login"
DB_PASSWORD = "hasło"
```
6. Przejdź do pliku **db.js** w folderze głównym, i jeżeli potrzeba, zmień port niezbędny do połączenia z bazą danych<br/>
```
const driver = neo4j.driver('neo4j://localhost:PORT, neo4j.auth.basic(process.env.DB_LOGIN, process.env.DB_PASSWORD));
```
7. Uruchom baze danych 
8. Następnie zalecam zainstalować dodatek [nodemon](https://www.npmjs.com/package/nodemon)
9. Posiadając zainstlowany dodatek, w folderze głównym uruchom polecenie ```nodemon app.js```
10. Przejdź do folderu **MeetCodeBroFrontEnd**
11. Uruchom nowy terminal w folderze
12. Zainstaluj niezbędne pliki za pomocą polecenie ```npm install```
13. Po zainstalowaniu niezbędnych plików, uruchom serwer angulara za pomocą polecenia ```ng serve```
14. Przejdź do przeglądarki, wprowadź adres [localhost](http://localhost:4200)
15. Aplikacja powinna działać 
