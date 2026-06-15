# API Client

> Backend API communication layer

This directory contains type-safe functions for all Shipyard API calls. Every component that needs backend data should import from here — never call `fetch` directly in components.

## Usage

```typescript
import { getHealthStatus } from '@/lib/api/client';

const health = await getHealthStatus();
```
