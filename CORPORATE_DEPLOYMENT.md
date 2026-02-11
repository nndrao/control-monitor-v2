# Corporate Intranet Deployment Guide

This guide explains how to deploy and build this project in corporate environments with restricted internet access and regulated npm repository access.

## Prerequisites

- **Node.js**: Version 20.19.0 or higher (enforced in package.json)
- **npm**: Version 10.x or higher (included with Node.js)
- **Access**: Corporate npm registry or approved proxy configuration

## Quick Start for Corporate Environments

### 1. Configure NPM Registry Access

Copy the example configuration file:
```bash
cp .npmrc.example .npmrc
```

Edit `.npmrc` and configure for your corporate environment (see options below).

### 2. Install Dependencies

```bash
npm ci
```

**Note**: Use `npm ci` instead of `npm install` for reproducible builds using the committed `package-lock.json`.

### 3. Build the Project

```bash
npm run build
```

---

## Configuration Options

### Option A: Corporate NPM Registry (Recommended)

If your organization uses Artifactory, Nexus, Verdaccio, or similar:

**Edit `.npmrc`:**
```ini
registry=https://your-corporate-registry.company.com/repository/npm/
//your-corporate-registry.company.com/repository/npm/:_authToken=YOUR_TOKEN
engine-strict=true
```

**Benefits:**
- All dependencies pre-approved and scanned
- Faster, cached downloads
- Works offline once cached

### Option B: Corporate Proxy

If accessing public npm through a corporate proxy:

**Edit `.npmrc`:**
```ini
proxy=http://proxy.company.com:8080
https-proxy=http://proxy.company.com:8080
noproxy=localhost,127.0.0.1,.company.com
engine-strict=true
```

### Option C: Offline Installation

For completely air-gapped environments:

#### Step 1: Download Dependencies (on internet-connected machine)

```bash
# Install dependencies and generate package-lock.json
npm install

# Create offline bundle
npm pack
npm install --package-lock-only
```

#### Step 2: Bundle for Transfer

```bash
# Create a tarball with node_modules
tar -czf control-monitor-offline-bundle.tar.gz package.json package-lock.json node_modules/
```

#### Step 3: Deploy on Corporate Network

```bash
# Extract bundle
tar -xzf control-monitor-offline-bundle.tar.gz

# Verify and build
npm run build
```

### Option D: Using npm Offline Cache

```bash
# On internet-connected machine, populate cache
npm install --prefer-offline

# Copy npm cache to air-gapped machine
# Windows: %APPDATA%\npm-cache
# Linux/Mac: ~/.npm

# On air-gapped machine, install from cache
npm ci --offline
```

---

## Security Considerations

### Self-Signed Certificates

If your corporate registry uses self-signed certificates:

**Option 1: Add CA Certificate (Recommended)**
```ini
# In .npmrc
cafile=/path/to/corporate-ca-certificate.crt
```

**Option 2: Disable SSL Verification (NOT RECOMMENDED)**
```ini
# In .npmrc
strict-ssl=false
```

**Option 3: Set Environment Variable**
```bash
# Windows
set NODE_EXTRA_CA_CERTS=C:\path\to\corporate-ca-certificate.crt

# Linux/Mac
export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca-certificate.crt
```

### Authentication Methods

#### Token Authentication
```ini
//your-registry.com/repository/npm/:_authToken=YOUR_TOKEN
```

#### Basic Authentication
```bash
# Generate base64 token
echo -n "username:password" | base64

# Add to .npmrc
//your-registry.com/repository/npm/:_auth=BASE64_TOKEN
//your-registry.com/repository/npm/:always-auth=true
```

---

## Reproducible Builds

This project is configured for reproducible builds in corporate environments:

### 1. Lock File Management

- `package-lock.json` is **committed** to version control (removed from .gitignore)
- Always use `npm ci` for installations (not `npm install`)
- Lock file ensures exact dependency versions across all environments

### 2. Node.js Version Enforcement

The project specifies `engine-strict=true` in `.npmrc.example`:
```json
"engines": {
  "node": ">=20.19.0 <21.0.0"
}
```

This ensures all developers and CI/CD systems use compatible Node.js versions.

### 3. No Dynamic Dependencies

- No post-install scripts that download external resources
- All dependencies are from npm registry only
- No git dependencies or external URLs

---

## Build Scripts

```bash
# Development server (requires active npm access for HMR)
npm run dev

# Production build (no external access needed after npm ci)
npm run build

# Type checking
npm run build    # TypeScript compilation is part of build

# Linting
npm run lint

# Preview production build locally
npm run preview
```

---

## Technology Stack (No Babel Dependencies)

This project uses **SWC** instead of Babel for optimal performance:

- **Build Tool**: Vite 6.x (native ESM, no Babel)
- **React Transform**: `@vitejs/plugin-react-swc` (uses SWC, not Babel)
- **TypeScript**: Native TypeScript compiler (tsc)
- **CSS**: PostCSS + Tailwind CSS (no Babel transforms)

**Benefits for Corporate Environments:**
- Faster builds (SWC is 20x faster than Babel)
- Fewer dependencies to audit
- Smaller node_modules footprint
- No Babel configuration complexity

---

## Troubleshooting

### Issue: "npm ci" fails with network errors

**Solution 1**: Increase timeouts in `.npmrc`
```ini
timeout=300000
fetch-retries=5
fetch-retry-maxtimeout=120000
```

**Solution 2**: Use offline mode
```bash
npm ci --prefer-offline
```

### Issue: Certificate errors (SELF_SIGNED_CERT_IN_CHAIN)

**Solution**: Add corporate CA certificate
```bash
# Windows
set NODE_EXTRA_CA_CERTS=C:\path\to\ca-cert.crt

# Or in .npmrc
cafile=/path/to/ca-cert.crt
```

### Issue: Registry authentication fails

**Solution**: Verify token/credentials
```bash
# Test registry access
npm ping --registry=https://your-registry.com/repository/npm/

# Login interactively
npm login --registry=https://your-registry.com/repository/npm/
```

### Issue: "Unsupported platform" errors on Windows

**Solution**: Some packages have optional dependencies for specific platforms. These are safe to ignore if marked as optional:
```bash
npm ci --ignore-scripts
```

### Issue: Build fails with "out of memory"

**Solution**: Increase Node.js memory limit
```bash
# Windows
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Linux/Mac
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## CI/CD Integration

### Sample CI Configuration (GitLab CI)

```yaml
image: node:20.19

cache:
  paths:
    - node_modules/

before_script:
  - cp .npmrc.corporate .npmrc
  - npm ci

build:
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

### Sample CI Configuration (Jenkins)

```groovy
pipeline {
    agent {
        docker {
            image 'node:20.19'
        }
    }
    stages {
        stage('Install') {
            steps {
                sh 'cp .npmrc.corporate .npmrc'
                sh 'npm ci'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

---

## Dependency Audit

All dependencies can be audited using your corporate security tools:

```bash
# NPM audit (if allowed)
npm audit

# Generate dependency list for security review
npm list --production --json > dependencies.json

# Check for known vulnerabilities (if external access allowed)
npm audit --audit-level=moderate
```

**Package Count:**
- Production dependencies: ~65 packages
- Development dependencies: ~15 packages
- Total (including transitive): ~300-400 packages

---

## Support

For corporate deployment issues:

1. Check your organization's npm registry documentation
2. Contact your IT/DevOps team for registry access
3. Verify Node.js version matches requirements (20.19.x)
4. Ensure `package-lock.json` is present and up-to-date

---

## Additional Resources

- [npm Enterprise Documentation](https://docs.npmjs.com/cli/v10/using-npm/registry)
- [Artifactory NPM Registry](https://jfrog.com/help/r/jfrog-artifactory-documentation/npm-registry)
- [Nexus Repository Manager](https://help.sonatype.com/repomanager3/nexus-repository-administration/formats/npm-registry)
- [Vite Build Configuration](https://vitejs.dev/config/)
