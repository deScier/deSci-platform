# Code Generation Guidelines

Simple patterns for consistent code modifications in chat-based development.

## Core Approach

1. **Analyze First**: Check existing patterns before making changes
2. **Minimal Changes**: Make the smallest modification needed
3. **Follow Conventions**: Use existing naming and structure patterns
4. **Validate**: Test changes work as expected

## Common Chat Patterns

### Pattern 1: File Refactoring
**Example**: "Move types from typing.d.ts to component files"
```
1. View current file structure
2. Identify what needs to move
3. Update target files with new exports
4. Remove old files
5. Fix any import errors
```

### Pattern 2: Component Updates
**Example**: "Add new prop to Button component"
```
1. Check existing component interface
2. Add new prop to type definition
3. Update component implementation
4. Maintain backward compatibility
```

### Pattern 3: Import/Export Changes
**Example**: "Change from inline exports to export statements"
```
1. Find current export pattern
2. Move exports to top of file
3. Update component declarations
4. Verify no compilation errors
```

**Required Pattern**:
- All exports must be at the top of the file (after 'use client' if present)
- No inline exports (avoid `export const Component`)
- Type definitions must be at the bottom of the file
- Use separate export statements: `export { Component, utils };` and `export type { Props, Config };`
- Avoid inline comments that describe code structure (e.g., `// Type definitions`, `// Exports`)

## Typical Chat Workflow

1. **User Request**: "I want to refactor X"
2. **Context Check**: Look at existing files and patterns
3. **Plan**: Break down into simple steps
4. **Execute**: Make changes one file at a time
5. **Verify**: Check for errors and test functionality

## Key Principles

- **One change at a time**: Don't modify multiple unrelated things
- **Follow existing patterns**: Match the codebase style
- **Fix errors immediately**: Address compilation issues as they arise
- **Keep it simple**: Prefer straightforward solutions
- **Export structure**: All exports at top, type definitions at bottom
- **No inline exports**: Use separate export statements instead of `export const`

## What We Actually Do

### File Operations
- View files to understand current structure
- Search for patterns across the codebase
- Update files with precise changes
- Delete obsolete files when needed

### Type Management
- Move type definitions between files
- Update import/export statements
- Maintain type safety throughout changes
- Fix casing and path issues

### Component Refactoring
- Restructure component organization
- Update export patterns
- Maintain component functionality
- Follow established conventions

## Real Examples from Our Chats

### Moving Types
**Request**: "Merge typing.d.ts into component files"
**Actions**: 
- Viewed typing.d.ts to see what types exist
- Updated button.tsx and pill.tsx with type definitions
- Added proper export statements
- Deleted the original typing.d.ts file
- Fixed import path casing issues

### Export Pattern Changes
**Request**: "Move exports to top of files"
**Actions**:
- Changed from `export const Component` to `const Component` + `export { Component }`
- Moved all export statements to file top
- Placed type definitions at bottom of file
- Used pattern: exports at top, implementation in middle, types at bottom
- Maintained component functionality

### Import Fixes
**Request**: "Fix casing in import paths"
**Actions**:
- Updated import paths to match actual file names
- Fixed case sensitivity issues
- Resolved compilation errors

## Quick Reference

### Before Making Changes
- Look at existing files and patterns
- Understand the current structure
- Plan minimal changes needed

### While Making Changes
- Follow existing naming conventions
- Keep changes focused and small
- Fix errors as they appear
- Test functionality works

### Common Issues We Fix
- Import/export path problems
- Type definition organization
- File structure improvements
- Casing and naming consistency
- Export placement (must be at top)
- Type definition placement (must be at bottom)

### File Structure Pattern
```typescript
'use client'; // if needed

export { Component, utils };
export type { Props, Config };

import { ... } from '...';

const Component = () => { ... };
const utils = { ... };

type Props = {
  // ...
};

type Config = {
  // ...
};
```

This reflects the practical, iterative approach we use in our development chats - simple, focused changes that build on existing patterns.