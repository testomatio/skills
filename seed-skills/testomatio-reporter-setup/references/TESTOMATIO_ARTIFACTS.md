# Testomat.io Artifacts

Upload screenshots, videos, and traces for failed tests to S3-compatible storage.

## Configuration

Set S3 credentials via environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `S3_ACCESS_KEY_ID` | Access key | Yes |
| `S3_SECRET_ACCESS_KEY` | Secret key | Yes |
| `S3_BUCKET` | Bucket name | Yes |
| `S3_REGION` | Bucket region | Yes |
| `S3_ENDPOINT` | Custom S3 provider endpoint | For non-AWS |
| `S3_FORCE_PATH_STYLE` | Enable force path style | For Minio |
| `TESTOMATIO_PRIVATE_ARTIFACTS=1` | Private access mode | No (default: public) |

## Providers

### AWS

```env
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=xxx
S3_REGION=us-west-1
```

### DigitalOcean / Custom S3

```env
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=xxx
S3_REGION=xxx
```

### Minio

```env
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=xxx
S3_FORCE_PATH_STYLE=true
```

### Google Cloud Storage

Enable Interoperability mode in bucket settings, then use:

```env
S3_ENDPOINT=xxx
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=xxx
S3_REGION=xxx
```

## Supported Frameworks

Artifacts are automatically uploaded for:
- Playwright
- CodeceptJS
- Cypress
- WebdriverIO

## Custom Artifacts

Add custom files to any test:

```js
// Attach a local file
global.testomatioArtifacts.push('img/file.png');

// Attach with custom name
global.testomatioArtifacts.push({ name: 'Screenshot', path: 'img/file.png' });
```

Artifacts are uploaded when the test finishes. If S3 is not configured, files are ignored.
