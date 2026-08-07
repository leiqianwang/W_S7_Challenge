# IntelliJ setup — pizza-api (Spring Boot)

## Open the project

1. **File → Open** → select `W_S7_Challenge/pizza-api` (the folder with `pom.xml`), **not** the React root alone.
2. When prompted, choose **Open as Project** / trust the project.
3. Wait for Maven to import dependencies (progress bar bottom-right).

## JDK

1. **File → Project Structure → Project**
2. Set **SDK** to **Java 21** (or newer; you can use OpenJDK 23 if 21 is not installed).
3. **Language level**: 21
4. **File → Settings → Build, Execution, Deployment → Build Tools → Maven → Runner**
   - Set **JRE** to the same JDK.

## Run on localhost:8080

**Option A — Run configuration (recommended)**

1. Open `src/main/java/com/pizza/api/PizzaApiApplication.java`
2. Click the green gutter arrow → **Run 'PizzaApiApplication'**
3. Or use the pre-made config: **Run → Run… → PizzaApiApplication**

**Option B — Maven**

1. Open the **Maven** tool window (View → Tool Windows → Maven)
2. `pizza-api` → **Plugins** → **spring-boot** → **spring-boot:run**

**Option C — Terminal**

```bash
cd pizza-api
./mvnw.cmd spring-boot:run
```

## Verify

- App: http://localhost:8080  
- H2 console: http://localhost:8080/h2-console  
  - JDBC URL: `jdbc:h2:mem:pizza_db`  
  - User: `sa`  
  - Password: *(leave blank)*

## Dependencies (from start.spring.io)

| Starter | Purpose |
|---------|---------|
| Spring Web (webmvc) | REST / MVC on Tomcat |
| Spring Data JPA | Entity ↔ table mapping |
| H2 Database | In-memory SQL DB + console |
| Validation | Bean Validation for request DTOs (later) |
