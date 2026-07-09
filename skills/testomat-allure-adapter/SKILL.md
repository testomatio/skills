---
name: Testomat Allure Adapter Setup
description: Configure Testomat.io reporting for Java projects that already use Allure. Ask the user whether they want to keep existing Allure annotations and only add Testomat.io reporting or replace Allure annotations with native Testomat.io annotations. If they keep Allure add the testomat-allure-adapter dependency for Maven or Gradle.
required_action: true
---

# Testomat Allure Adapter

Configure Testomat.io reporting for Java projects that already use Allure. Two modes: keep Allure and add the adapter, or migrate to native Testomat.io annotations.

Before configuring the project, ask the user which mode they want:

> Do you want to keep your existing Allure annotations and use Testomat.io only for reporting test results, or would you like to replace Allure annotations with Testomat.io annotations?

## Option 1: Keep Allure and Report to Testomat.io

Use this option if:

* The project already uses Allure annotations.
* The user wants to keep annotations such as `@Epic`, `@Feature`, `@Story`, `@Owner`, `@Severity`.

**The adapter only transfers data from Allure to Testomat.io. It does not migrate, generate, or synchronize annotations from Testomat.io back to Allure.**

Install the Testomat Allure Adapter.

### Maven

```xml
<dependency>
    <groupId>io.testomat</groupId>
    <artifactId>testomat-allure-adapter</artifactId>
    <version><LATEST_STABLE_VERSION></version>
</dependency>
```

### Gradle

```gradle
implementation 'io.testomat:testomat-allure-adapter:<LATEST_STABLE_VERSION>'
```

## Option 2: Migrate from Allure to Testomat.io

Use this option if:

* The user wants to stop using Allure annotations.
* The user wants Testomat.io annotations and reporting only.
* The project is new or a migration is planned.

Migrate the project to the standard Testomat.io reporter.

**Remove Allure dependencies only when both conditions hold:**

1. The user explicitly chose to remove unsupported Allure annotations.
2. No Allure annotations, APIs, listeners, or reporting integrations remain in the project.

### Supported Replacements

Apply these automatically:

```text
@DisplayName → @Title (automatic)
@AllureId → @TestId (automatic)
@TmsLink → @TestId (automatic)
@Attachment → @Artifact (automatic)
@Step → @Step (automatic)
```

### Unsupported Allure Annotations

All other Allure annotations (`@Epic`, `@Feature`, `@Story`, `@Owner`, `@Severity`, `@Description`, `@Issue`, etc.) have no Testomat.io equivalent. **Never migrate, replace, or remove them automatically.**

If any are detected, ask:

> Unsupported Allure annotations were found. Testomat.io currently does not provide direct replacements for these annotations. Would you like to keep them or remove them?

If the user keeps them:

* Leave the annotations, Allure dependencies, and Allure configuration intact.

If the user removes them:

* Remove the unsupported annotations.
* Continue migration using only supported Testomat.io annotations.
* Remove Allure dependencies only per the conditions above.

### Replace @DisplayName

```java
@DisplayName("Login test")
```
↓
```java
@Title("Login test")
```

```java
import org.junit.jupiter.api.DisplayName;
```
↓
```java
import io.testomat.core.annotation.Title;
```

### Replace @AllureId

```java
@AllureId("a1b2c3d4")
```
↓
```java
@TestId("a1b2c3d4")
```

```java
import io.qameta.allure.AllureId;
```
↓
```java
import io.testomat.core.annotation.TestId;
```

### Replace @TmsLink

```java
@TmsLink("k8m2x9q1")
```
↓
```java
@TestId("k8m2x9q1")
```

```java
import io.qameta.allure.TmsLink;
```
↓
```java
import io.testomat.core.annotation.TestId;
```

### @AllureId and @TmsLink Conflict

If both are present on the same test:

* **Do not replace automatically.**
* Both map to `@TestId`, and Testomat.io supports only one `@TestId` per test.
* Ask the user which value to use.

### Replace @Step

```java
import io.qameta.allure.Step;
```
↓
```java
import io.testomat.core.annotation.Step;
```

```java
@io.qameta.allure.Step
```
↓
```java
@io.testomat.core.annotation.Step
```

### Replace @Attachment

```java
import io.qameta.allure.Attachment;
```
↓
```java
import io.testomat.core.annotation.Artifact;
```

```java
@Attachment
```
↓
```java
@Artifact
```

### Replace Allure.step

Analyze all detected `Allure.step(...)` overloads before replacing anything.

Supported replacements:

```java
Allure.step(String name)
```
↓
```java
Testomatio.step(String name, () -> {})
```

```java
Allure.step(String name, Status status)
```
↓
```java
Testomatio.step(String name, () -> {})
```
The `Status` value is dropped: `Testomatio.step(...)` does not support step status overrides.

```java
Allure.step(ThrowableContextRunnableVoid<StepContext> runnable)
```
↓
```java
Testomatio.step("", () -> { /* original runnable body */ })
```

```java
Allure.step(String name, ThrowableContextRunnableVoid<StepContext> runnable)
```
↓
```java
Testomatio.step(String name, () -> { /* original runnable body */ })
```

```java
Allure.step(String name, ThrowableRunnableVoid runnable)
```
↓
```java
Testomatio.step(String name, () -> { /* original runnable body */ })
```

Rules:

* Preserve the original step name whenever available.
* Move the original runnable body into the `Runnable` argument of `Testomatio.step(...)`.

Overloads that return a value are NOT supported, because `Testomatio.step(String stepDescription, Runnable function)` does not return a value:

```java
Allure.step(String name, ThrowableRunnable<T> runnable)
```

```java
Allure.step(ThrowableContextRunnable<T, StepContext> runnable)
```

```java
Allure.step(String name, ThrowableContextRunnable<T, StepContext> runnable)
```

If return-value overloads are detected, ask:

> Some Allure.step(...) usages return a value and cannot be migrated automatically because Testomatio.step(...) does not support return values. How would you like to proceed?

Options:

1. Replace supported overloads and keep unsupported overloads unchanged.
2. Skip Allure.step migration entirely and keep all existing usages.

If the user chooses option 1:

* Replace supported overloads.
* Leave return-value overloads unchanged.
* Inform the user which usages require manual migration.

If the user chooses option 2:

* Leave all `Allure.step(...)` usages unchanged.

**While any `Allure.step(...)` usages remain, keep Allure dependencies in the project.**

### Replace Allure.addAttachment

* Inside a step, replace with `Testomatio.stepArtifact(String pathToFile)`.
* Outside a step, replace with `Testomatio.artifact(String pathToFile)`.

### Required Maven Surefire Plugin Configuration

Always check the Maven Surefire Plugin configuration. If the project uses it:

* If no `argLine` is configured, add the AspectJ javaagent using the version declared in the project's dependencies.
* If an `argLine` exists, preserve the existing value and append the javaagent. **Do not overwrite or remove existing JVM arguments.**
* If the AspectJ version cannot be determined, ask the user before adding the javaagent.

```xml
<argLine>
    -javaagent:"${settings.localRepository}/org/aspectj/aspectjweaver/${aspectj.version}/aspectjweaver-${aspectj.version}.jar"
</argLine>
```
