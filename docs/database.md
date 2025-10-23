# Database Documentation

## Overview

This project uses Prisma ORM with SQLite as the database provider. The database schema supports a freelance marketplace platform with user management, project workflow, and document conversion capabilities.

## Database Connection

The database URL is configured via the `DATABASE_URL` environment variable:

```env
DATABASE_URL="file:./db/custom.db"
```

For development, the database file is stored at `./db/custom.db`.

## Schema Overview

### User Management

- **User**: Core user model supporting CLIENT, DEVELOPER, and ADMIN roles
- **ClientProfile**: Extended profile information for clients
- **DeveloperProfile**: Extended profile information for developers with skills, experience, and portfolio

### Project & Order Management

- **Project**: Project postings with budget, requirements, and technical specifications
- **ProjectTag**: Tags for categorizing projects
- **Bid**: Developer bids/proposals on projects
- **Order**: Confirmed orders linking projects to developers
- **Deliverable**: Work deliverables submitted by developers
- **Review**: User reviews and ratings after project completion

### Financial

- **Payment**: Payment transactions and records
- **Withdrawal**: Developer withdrawal requests

### Conversion Domain (PDF Converter)

The conversion domain handles asynchronous document conversion jobs:

#### ConversionJob

Represents a document conversion request.

**Key Fields:**
- `sourceFileName`: Original filename
- `sourceFilePath`: Path to the source file
- `sourceFileSize`: Size in bytes
- `sourceMimeType`: MIME type of source file
- `outputFormat`: Target conversion format (PDF, DOCX, PPTX, XLSX, HTML, MARKDOWN, TXT, PNG, JPG)
- `status`: Current job status (PENDING, QUEUED, PROCESSING, COMPLETED, FAILED, CANCELLED, EXPIRED)
- `statusReason`: Optional reason for failure or cancellation
- `expiresAt`: When the job and its outputs will be automatically cleaned up
- `startedAt`: When processing began
- `completedAt`: When processing finished

**Indexes:**
- `status`: For efficient job queue queries
- `expiresAt`: For cleanup and expiry tracking

#### ConversionOutputFile

Stores information about generated output files from conversion jobs.

**Key Fields:**
- `jobId`: Reference to parent ConversionJob
- `format`: Output format of this file
- `filePath`: Location of the output file
- `fileSize`: Size in bytes
- `checksum`: File integrity checksum (e.g., SHA-256)

**Indexes:**
- `jobId`: For efficient lookup of job outputs

#### ConversionEvent

Audit trail and status change history for conversion jobs.

**Key Fields:**
- `jobId`: Reference to parent ConversionJob
- `status`: Status at time of event (optional)
- `message`: Human-readable event description
- `metadata`: JSON metadata for additional context

**Indexes:**
- `jobId`: For efficient event history retrieval

### System Configuration

- **SystemConfig**: Key-value store for system-wide settings

## Environment Variables

### Required

- `DATABASE_URL`: Database connection string (default: `file:./db/custom.db`)

### Conversion Feature

- `CONVERSION_STORAGE_PATH`: Base directory for storing conversion files (default: `./storage/conversions`)
- `CONVERSION_EXPIRY_DAYS`: Number of days before conversion outputs expire (default: `7`)
- `CONVERSION_MAX_FILE_SIZE`: Maximum upload file size in bytes (default: `52428800` = 50MB)

## Migrations

### Running Migrations

To create a new migration after schema changes:

```bash
npx prisma migrate dev --name migration_name
```

To apply migrations in production:

```bash
npx prisma migrate deploy
```

### Existing Migrations

- **20251023053847_add_conversion_domain**: Initial migration including all core models and the conversion domain (ConversionJob, ConversionOutputFile, ConversionEvent)

## Prisma Client

### Generate Client

After schema changes, regenerate the Prisma Client:

```bash
npx prisma generate
```

### Usage in Code

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Query conversion jobs
const jobs = await prisma.conversionJob.findMany({
  where: { status: 'PENDING' },
  include: {
    outputs: true,
    events: true
  }
})
```

## Data Management

### Database Studio

To browse and edit data visually:

```bash
npx prisma studio
```

### Seeding

To seed the database with sample data:

```bash
npx prisma db seed
```

### Reset

To reset the database (WARNING: Destroys all data):

```bash
npx prisma migrate reset
```

## Indexing Strategy

Indexes are strategically placed for:

1. **Status tracking**: `conversion_jobs.status` for queue management
2. **Expiry management**: `conversion_jobs.expiresAt` for cleanup jobs
3. **Relationship lookups**: Foreign key indexes on `jobId` fields
4. **Unique constraints**: Ensuring data integrity (e.g., unique user emails, order numbers)

## Best Practices

1. **Always use transactions** for operations that modify multiple related records
2. **Include relations carefully** to avoid N+1 queries
3. **Use select** to limit fields when full models aren't needed
4. **Leverage indexes** for frequently queried fields
5. **Set expiry dates** on ConversionJobs to enable automatic cleanup
6. **Log ConversionEvents** for all significant status changes for audit trail
