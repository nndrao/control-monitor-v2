# Corporate Intranet Quick Start

**5-minute setup guide for deploying in corporate environments with restricted npm access**

## Prerequisites Checklist

- [ ] Node.js 20.19.0+ installed
- [ ] Corporate npm registry URL (or proxy details)
- [ ] Authentication credentials (if required)
- [ ] CA certificate (if using self-signed certs)

---

## Setup Steps

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd control-monitor-v2
```

### Step 2: Configure NPM Registry

Copy and edit the npm configuration:
```bash
cp .npmrc.example .npmrc
```

**Edit `.npmrc` with your settings:**

#### Option A: Corporate Registry
```ini
registry=https://your-registry.company.com/repository/npm/
//your-registry.company.com/repository/npm/:_authToken=YOUR_TOKEN
engine-strict=true
```

#### Option B: Corporate Proxy
```ini
proxy=http://proxy.company.com:8080
https-proxy=http://proxy.company.com:8080
engine-strict=true
```

#### Option C: Self-Signed Certificate
```ini
cafile=C:\path\to\corporate-ca.crt
# OR disable SSL (not recommended)
# strict-ssl=false
```

### Step 3: Install Dependencies

**Use `npm ci` for reproducible builds:**
```bash
npm ci
```

**Common issues:**

- **Certificate errors?** Add CA cert to `.npmrc` (see Step 2, Option C)
- **Timeout errors?** Increase timeout in `.npmrc`:
  ```ini
  timeout=300000
  fetch-retries=5
  ```
- **Network errors?** Try offline mode:
  ```bash
  npm ci --prefer-offline
  ```

### Step 4: Build Project

```bash
npm run build
```

Output will be in `dist/` folder.

---

## Verification

Run these commands to verify setup:

```bash
# Check Node.js version (should be 20.19.x)
node --version

# Verify npm can reach registry
npm ping --registry=YOUR_REGISTRY_URL

# Test build
npm run build

# Check output
dir dist
```

---

## Offline Installation (Air-Gapped)

If you cannot access npm registries at all:

### On Internet-Connected Machine:
```bash
# Install and bundle
npm install
tar -czf control-monitor-bundle.tar.gz package.json package-lock.json node_modules/
```

### On Corporate Machine:
```bash
# Extract and build
tar -xzf control-monitor-bundle.tar.gz
npm run build
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `SELF_SIGNED_CERT_IN_CHAIN` | Add `cafile=path/to/cert.crt` to `.npmrc` |
| `ENOTFOUND` registry | Check proxy settings in `.npmrc` |
| `401 Unauthorized` | Verify `_authToken` in `.npmrc` |
| `Engine not supported` | Upgrade to Node.js 20.19.0+ |
| Slow installs | Add `fetch-retries=5` to `.npmrc` |

---

## Support

For detailed instructions, see [CORPORATE_DEPLOYMENT.md](./CORPORATE_DEPLOYMENT.md)

For npm configuration reference, see [.npmrc.example](./.npmrc.example)
