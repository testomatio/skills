---
name: Testomat Allure Adapter Setup
description: Configure Testomat.io reporting for Java projects that already use Allure. Ask the user whether they want to keep existing Allure annotations and only add Testomat.io reporting or replace Allure annotations with native Testomat.io annotations. If they keep Allure add the testomat-allure-adapter dependency for Maven or Gradle.
required_action: true
---

## Purpose

This skill helps configure Testomat.io reporting for Java projects that currently use Allure.

### Input

The skill expects one or more of the following:

* Maven (`pom.xml`) or Gradle (`build.gradle`) build configuration
* Java test source files
* Existing Allure annotations and integrations
* Existing Testomat.io configuration

### What This Skill Does

The skill analyzes the project and helps the user choose one of two integration approaches:

1. **Keep Allure and report results to Testomat.io**

  * Installs and configures the Testomat Allure adapter.
  * Preserves existing Allure annotations and reporting configuration.

2. **Migrate from Allure to Testomat.io**

  * Replaces supported Allure annotations with Testomat.io equivalents.
  * Updates imports and reporting configuration.
  * Handles unsupported Allure annotations according to user preference.
  * Configures required Maven Surefire and AspectJ settings.

### Output

Depending on the selected integration mode, the skill produces:

* Updated Maven or Gradle configuration
* Required Testomat.io dependencies
* Updated test annotations and imports
* Updated attachment and step reporting APIs
* Maven Surefire Plugin configuration updates
* Migration recommendations and user decisions for unsupported annotations

### Expected Result

After applying this skill, the project should be correctly configured to:

* Send test execution results to Testomat.io
* Continue using Allure reporting (adapter mode), or
* Use native Testomat.io annotations and reporting (migration mode)


## Allure Integration Mode

Before configuring the project ask the user which integration approach they want to use:

> Do you want to keep your existing Allure annotations and use Testomat.io only for reporting test results, or would you like to replace Allure annotations with Testomat.io annotations?

### Option 1: Keep Allure and Report to Testomat.io

Use this option if:

* Your project already uses Allure annotations.
* You want to keep existing annotations such as:

    * `@Epic`
    * `@Feature`
    * `@Story`
    * `@Owner`
    * `@Severity`

**Important:** The adapter is intended only for integrating existing Allure-based projects with Testomat.io. It transfers data from Allure to Testomat.io and is not designed to migrate, generate, or synchronize annotations from Testomat.io back to Allure.

In this case install the Testomat Allure Adapter.

#### Maven

```xml
<dependency>
    <groupId>io.testomat</groupId>
    <artifactId>testomat-allure-adapter</artifactId>
    <version><LATEST_STABLE_VERSION></version>
</dependency>
```

#### Gradle

```gradle
implementation 'io.testomat:testomat-allure-adapter:<LATEST_STABLE_VERSION>'
```

### Option 2: Migrate from Allure to Testomat.io

Use this option if:

* You want to stop using Allure annotations.
* You want to use Testomat.io annotations and reporting only.
* You are starting a new project or planning a migration.

In this case migrate the project to the standard Testomat.io reporter.

Remove Allure specific dependencies only when:

1. The user chooses to remove unsupported Allure annotations.
2. No remaining Allure annotations, APIs, listeners, or reporting integrations are detected in the project.

### Supported Replacements

The following Allure annotations currently have Testomat.io equivalents:

```text
@DisplayName → @Title (automatic)
@AllureId → @TestId (automatic)
@TmsLink → @TestId (automatic)
@Attachment → @Artifact (automatic)
@Step → @Step (automatic)
```

### Unsupported Allure Annotations

All other Allure annotations (`@Epic`, `@Feature`, `@Story`, `@Owner`, `@Severity`, `@Description`, `@Issue`, etc.) are not supported at this time and must not be automatically migrated, replaced, or removed.

If unsupported Allure annotations are detected, you must always ask the user how they want to handle them before making any changes.

Ask:

> Unsupported Allure annotations were found. Testomat.io currently does not provide direct replacements for these annotations. Would you like to keep them or remove them?

If the user chooses to keep them:

* Do not remove the annotations.
* Do not remove Allure dependencies from the project.
* Keep the existing Allure configuration intact.

If the user chooses to remove them:

* Remove the unsupported Allure annotations.
* Remove Allure dependencies only after:

    1. The user explicitly chooses to remove unsupported Allure annotations.
    2. No remaining Allure annotations, APIs, listeners, or reporting integrations are detected in the project.
* Continue migration using only supported Testomat.io annotations.

### Automatic Replacements

When the user chooses to migrate from Allure to Testomat.io, perform the following replacements automatically.

#### Replace @DisplayName

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

```java
import io.qameta.allure.AllureId;
```
↓
```java
import io.testomat.core.annotation.TestId;
```

```java
import io.qameta.allure.TmsLink;
```
↓
```java
import io.testomat.core.annotation.TestId;
```

#### Replace @AllureId

```java
@AllureId("a1b2c3d4")
```
↓
```java
@TestId("a1b2c3d4")
```

#### Replace @TmsLink

```java
@TmsLink("k8m2x9q1")
```
↓
```java
@TestId("k8m2x9q1")
```

#### @AllureId and @TmsLink Conflict

If both `@AllureId` and `@TmsLink` are present on the same test:

* Do not perform automatic replacement.
* Inform the user that both annotations would be mapped to `@TestId`.
* Ask which value should be used as the resulting @TestId, since Testomat.io supports only a single @TestId annotation per test.

#### Replace @Step

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

#### Replace @Attachment

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

#### Replace Allure.addAttachment

Replace usages of `Allure.addAttachment`.

The replacement depends on whether `Allure.addAttachment` is called inside a step or outside a step.

If `Allure.addAttachment` is called inside a step, replace it with:

```java
Testomatio.stepArtifact(String pathToFile)
```

If `Allure.addAttachment` is called outside a step, replace it with:

```java
Testomatio.artifact(String pathToFile)
```

### Required Maven Surefire Plugin Configuration

Always check the Maven Surefire Plugin configuration.

If the project uses Maven Surefire Plugin:

- Check whether the plugin already contains an `argLine` configuration.
- If no `argLine` is configured, add the AspectJ javaagent using the version declared in the project's dependencies.
- If an `argLine` already exists, preserve the existing value and append the AspectJ javaagent.
- Do not overwrite or remove existing JVM arguments.

```xml
<argLine>
    -javaagent:"${settings.localRepository}/org/aspectj/aspectjweaver/${aspectj.version}/aspectjweaver-${aspectj.version}.jar"
</argLine>
```
If the version cannot be determined, ask the user before adding the javaagent configuration.
