# CLAUDE.md - AI Assistant Guide for Essence Engine

**Last Updated:** 2025-11-15
**Project:** Essence Engine
**Version:** 1.0.0

This document provides comprehensive guidance for AI assistants (Claude and other LLMs) working with the Essence Engine codebase. It explains the project structure, development workflows, key conventions, and important considerations when making changes.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Key Architectural Patterns](#key-architectural-patterns)
4. [Development Workflows](#development-workflows)
5. [Coding Conventions](#coding-conventions)
6. [Testing Requirements](#testing-requirements)
7. [Documentation Standards](#documentation-standards)
8. [Common Tasks](#common-tasks)
9. [Important Gotchas](#important-gotchas)
10. [Configuration Management](#configuration-management)
11. [Where to Find Things](#where-to-find-things)

---

## Project Overview

**Essence Engine** is a browser-based simulation engine for exploring emergent behaviors in intelligent agent swarms.

### What It Does
- Simulates resource-seeking agents ("bundles") in a dynamic 2D environment
- Features reinforcement learning using Cross-Entropy Method (CEM)
- Includes plant-based ecology with fertility mechanics
- Supports agent reproduction via mitosis
- Enables multi-agent cooperation through signal fields
- Provides interactive user participation mode
- Contains experimental Turing-complete computation substrate (Rule 110)

### Tech Stack
- **Runtime:** Browser (Chrome, Firefox, Safari)
- **Build Tool:** Vite 4.5.0
- **Rendering:** PixiJS 7.4.3
- **Module System:** ES Modules
- **Language:** Modern JavaScript (ES2020+)
- **Testing:** Node.js with custom ESM loader

### Project Scale
- **Main Entry Point:** `app.js` (2,214 lines)
- **Configuration:** `config.js` (1,761 lines)
- **Core Source:** `src/` directory (~16,203 lines)
- **Total Codebase:** ~20,000+ lines of JavaScript

---

## Repository Structure

```
/home/user/SlimeTest/
├── src/                        # Modular source code (PREFERRED for new code)
│   ├── core/                   # Core simulation systems
│   │   ├── world.js            # World state container and factory (292 lines)
│   │   ├── simulationLoop.js   # Deterministic tick orchestration (171 lines)
│   │   ├── bundle.js           # Agent class factory with dependency injection
│   │   ├── resource.js         # Resource/plant class factory (272 lines)
│   │   ├── training.js         # Training orchestration module (1,198 lines)
│   │   ├── sensing.js          # Agent perception system (63 lines)
│   │   ├── metricsTracker.js   # Performance metrics collection (374 lines)
│   │   └── stateIO.js          # State snapshot system (207 lines)
│   │
│   ├── systems/                # Pure function behavior systems
│   │   ├── movement.js         # Agent movement mechanics (89 lines)
│   │   ├── metabolism.js       # Energy consumption (5 lines)
│   │   ├── mitosis.js          # Agent reproduction (178 lines)
│   │   ├── resourceSystem.js   # Resource collection logic (129 lines)
│   │   ├── participation.js    # User guidance system (1,309 lines)
│   │   ├── steering.js         # Steering behaviors (125 lines)
│   │   └── decay.js            # Decay mechanics (90 lines)
│   │
│   ├── ui/                     # Browser-specific interface code
│   │   ├── canvasManager.js    # DPR-aware canvas sizing (61 lines)
│   │   └── inputManager.js     # Keyboard/input handling (160 lines)
│   │
│   ├── utils/                  # Shared utilities
│   │   ├── math.js             # Math utilities (clamp, etc.)
│   │   └── color.js            # Color conversion utilities
│   │
│   └── index.js                # Compatibility bridge (DO NOT ADD NEW LOGIC)
│
├── app.js                      # Main entry point (legacy, being refactored)
├── config.js                   # Global configuration (ALL tunables go here)
├── index.html                  # Browser entry point
├── vite.config.js              # Vite build configuration
│
├── docs/                       # Comprehensive documentation
│   ├── INDEX.md                # Documentation central index
│   ├── how-to/                 # User-facing guides
│   │   ├── TRAINING_GUIDE.md
│   │   ├── MULTI_AGENT_GUIDE.md
│   │   ├── DEBUG_MODE_GUIDE.md
│   │   ├── PARTICIPATION_GUIDE.md
│   │   └── [...]
│   ├── architecture/           # Technical documentation
│   │   ├── TECHNICAL_DOC.md
│   │   ├── LEARNING_SYSTEM.md
│   │   └── [...]
│   └── archive/                # Historical documentation
│
├── test/                       # Unit and integration tests
│   ├── esm-loader.mjs          # Custom ESM loader for Node
│   ├── metabolism.test.js
│   ├── movement.test.js
│   ├── mitosis.test.js
│   └── [...]
│
├── tc/                         # Turing Completeness features
│   ├── docs/                   # TC documentation
│   └── [...]
│
├── training/                   # Training data and snapshots
│   ├── snapshots/              # Baseline metrics
│   ├── optConfigs/             # Optimized configurations
│   └── analysis/               # Training analysis
│
├── profiles/                   # Debug and testing profiles
├── schemas/                    # JSON schemas for validation
├── analysis/                   # Training analysis and reports
└── Past runs/                  # Historical training results

# Root-level support files (legacy, coexist with src/)
├── learner.js                  # CEM learner implementation (274 lines)
├── controllers.js              # Controller interfaces (221 lines)
├── rewards.js                  # Reward tracking system (352 lines)
├── plantEcology.js             # Fertility grid system (387 lines)
├── signalField.js              # Multi-channel signal system (433 lines)
├── scentGradient.js            # Gradient navigation system (288 lines)
├── trainingUI.js               # Training interface (944 lines)
└── observations.js             # Observation vector building (264 lines)
```

### Current Refactoring Status

**Migration in Progress:** The codebase is being refactored from monolithic `app.js` to modular `src/` structure.

- ✅ **Completed:** Core systems (world, simulation loop, training) moved to `src/core/`
- ✅ **Completed:** Pure function systems moved to `src/systems/`
- ✅ **Completed:** Browser-specific code moved to `src/ui/`
- 🚧 **In Progress:** Some legacy systems still in root (Trail, signalField, plantEcology, etc.)
- ⚠️ **Important:** `src/index.js` provides backward compatibility bridge

---

## Key Architectural Patterns

### 1. Factory Pattern with Dependency Injection

**Pattern:** Classes are created via factory functions that accept a context object with dependencies.

```javascript
// Example from src/core/bundle.js
export function createBundleClass(context) {
  const { PIXI, Trail, getWorld, config } = context;

  class Bundle {
    constructor(x, y, chi) {
      // Implementation uses injected dependencies
    }
  }

  return Bundle;
}
```

**Why:** Enables testing with mock dependencies, avoids circular dependencies, supports lazy initialization.

**When Adding New Modules:** Follow this pattern for any class that needs shared services.

### 2. Phase-Based Simulation Loop

**Pattern:** Simulation runs in discrete phases (capture → update → render).

```javascript
// From src/core/simulationLoop.js
performSimulationStep({
  dt,
  mode,
  beginTick,
  phases: [capturePhase, updatePhase, renderPhase],
  endTick,
  onError
})
```

**Why:** Ensures deterministic execution, separates concerns, makes debugging easier.

**When Modifying Simulation:** Understand which phase your change affects.

### 3. Pure System Functions

**Pattern:** Systems are pure functions with no side effects.

```javascript
// Example from src/systems/metabolism.js
export function computeMetabolicCost(dt, isMoving, config) {
  const baseCost = config.baseCost * dt;
  const moveCost = isMoving ? config.movementCost * dt : 0;
  return baseCost + moveCost;
}
```

**Why:** Makes testing trivial, enables determinism, supports parallel execution.

**When Adding New Systems:** Always prefer pure functions in `src/systems/`.

### 4. Callback Pattern for Late Binding

**Pattern:** Use callbacks like `getWorld()` to reference objects created later.

```javascript
// Avoids circular dependencies
const getWorld = () => globalWorld; // Set after world is created
const context = { getWorld, /* ... */ };
```

**Why:** Breaks circular dependency chains, enables deferred initialization.

**When You See This:** Don't try to replace with direct imports.

### 5. Configuration Centralization

**Pattern:** ALL tunable parameters live in `config.js`.

```javascript
// config.js
export const CONFIG = {
  startChi: 50,
  plantRegenRate: 0.1,
  sensing: {
    baseRange: 30,
    extendedRange: 60
  },
  // ... 1,761 lines of configuration
};
```

**Why:** Single source of truth, keeps core code clean, enables runtime tweaking.

**When Adding Features:** Add configuration parameters to `config.js`, never hardcode.

---

## Development Workflows

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (opens browser on http://localhost:3000)
npm start
# OR
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run serve
```

### Running Tests

```bash
# Run individual test file
node --loader ./test/esm-loader.mjs test/metabolism.test.js

# Run multiple tests
node --loader ./test/esm-loader.mjs test/movement.test.js
node --loader ./test/esm-loader.mjs test/mitosis.test.js
```

**Required Test Suites Before PR:**

1. **System unit tests** - All tests in `test/` for systems you modified
2. **Determinism tests** - `test/test-rule110.js` and `test/test-tape.js` if touching TC features
3. **Adaptive reward smoke** - `test/test-adaptive-rewards.js` if modifying rewards
4. **Browser sanity** - Manual testing of UI changes

### Git Workflow

**Current Branch:** `claude/claude-md-mi0vm88874qg4cl0-014uFo6H8Lr3fCLRLz3TfPAB`

```bash
# Check status
git status

# Stage changes
git add <files>

# Commit with descriptive message
git commit -m "feat: Add new feature
- Detail 1
- Detail 2"

# Push to remote (ALWAYS use -u for feature branches)
git push -u origin claude/claude-md-mi0vm88874qg4cl0-014uFo6H8Lr3fCLRLz3TfPAB
```

**Commit Message Style:**
- Study recent commits: `git log --oneline -10`
- Use conventional format: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Be concise but descriptive

---

## Coding Conventions

### 1. ES Modules and Named Exports

✅ **DO:**
```javascript
export function computeMetabolicCost(dt, isMoving, config) { /* ... */ }
export const DEFAULT_CONFIG = { /* ... */ };
```

❌ **DON'T:**
```javascript
module.exports = { computeMetabolicCost }; // CJS syntax
export default function() { /* ... */ };   // Prefer named exports
```

### 2. Dependency Injection

✅ **DO:**
```javascript
export function createWorld(context) {
  const { Trail, Bundle, Resource, config } = context;
  // Use injected dependencies
}
```

❌ **DON'T:**
```javascript
import { Trail } from './trail.js'; // Singleton import
export function createWorld() {
  // Hard dependency on Trail
}
```

### 3. Pure Functions for Systems

✅ **DO:**
```javascript
// src/systems/movement.js
export function updatePosition(bundle, dt, config) {
  return {
    x: bundle.x + bundle.vx * dt,
    y: bundle.y + bundle.vy * dt
  };
}
```

❌ **DON'T:**
```javascript
export function updatePosition(bundle, dt, config) {
  bundle.x += bundle.vx * dt; // Mutation
  console.log("Moving..."); // Side effect
}
```

### 4. Browser Concerns Isolation

✅ **DO:**
```javascript
// src/ui/inputManager.js
export function initializeInputManager(canvas, handlers) {
  window.addEventListener('keydown', handlers.onKeyDown);
}
```

❌ **DON'T:**
```javascript
// src/systems/movement.js
export function updatePosition(bundle) {
  if (window.keyPressed['w']) { /* ... */ } // Browser dependency in system
}
```

### 5. Configuration Management

✅ **DO:**
```javascript
// config.js
export const CONFIG = {
  newFeature: {
    enabled: false,
    parameter: 42
  }
};

// your-module.js
export function doSomething(config) {
  if (config.newFeature.enabled) { /* ... */ }
}
```

❌ **DON'T:**
```javascript
// your-module.js
const ENABLED = false; // Hardcoded tunable
```

### 6. Respect Compatibility Bridge

✅ **DO:**
```javascript
// Add new feature in src/core/myFeature.js
export function createMyFeature(context) { /* ... */ }

// Update src/index.js to export it
export { createMyFeature } from './core/myFeature.js';
```

❌ **DON'T:**
```javascript
// app.js
function myNewFeature() { /* ... */ } // Adding logic to legacy file
```

---

## Testing Requirements

### Test File Structure

```javascript
// test/movement.test.js
import { updatePosition } from '../src/systems/movement.js';

console.log('Testing updatePosition...');

const bundle = { x: 0, y: 0, vx: 10, vy: 5 };
const result = updatePosition(bundle, 1.0, {});

if (result.x === 10 && result.y === 5) {
  console.log('✓ Position updated correctly');
} else {
  console.error('✗ Test failed');
  process.exit(1);
}
```

### Running Tests

```bash
# Individual test
node --loader ./test/esm-loader.mjs test/metabolism.test.js

# All system tests (manually run each)
node --loader ./test/esm-loader.mjs test/movement.test.js
node --loader ./test/esm-loader.mjs test/mitosis.test.js
node --loader ./test/esm-loader.mjs test/resourceSystem.test.js
```

### Testing Checklist

When adding/modifying a system:

- [ ] Create or update test in `test/`
- [ ] Test runs successfully with ESM loader
- [ ] Test covers success paths and error handling
- [ ] Test is deterministic (no random failures)
- [ ] Manual browser testing if UI changes

---

## Documentation Standards

### ORMD Schema

All documentation uses **ORMD 0.1** (Open Research Metadata) schema:

```markdown
<!-- ormd:0.1 -->
---
title: "Your Document Title"
authors: ["Your Name"]
dates:
  created: '2025-11-15T00:00:00Z'
  updated: '2025-11-15T00:00:00Z'
status: "complete" # or "draft", "in-progress", "deprecated"
description: "Brief description of the document"
---

# Your Document Title

Content goes here...
```

### Documentation Locations

| Type | Location | Purpose |
|------|----------|---------|
| User guides | `docs/how-to/` | How to use features |
| Technical docs | `docs/architecture/` | How systems work internally |
| API reference | `docs/api/` | Module/function documentation |
| Legacy docs | `docs/archive/` | Historical documentation |
| TC docs | `tc/docs/` | Turing completeness features |

### Updating Documentation

**Treat docs as part of the feature.** When you change code:

1. Update affected guides in `docs/how-to/` or `docs/architecture/`
2. Update `docs/INDEX.md` if adding new docs
3. Move outdated docs to `docs/archive/` with migration notes
4. Reference doc updates in commit message

**Example commit message:**
```
feat: Add new sensing mode

- Implement extended sensing with configurable range
- Add keyboard toggle (S key)
- Update sensing system to support dual modes

Docs: Updated SENSING_GUIDE.md and TECHNICAL_DOC.md
```

---

## Common Tasks

### Adding a New System

1. **Create the system file:**
   ```bash
   # Create pure function system
   touch src/systems/myNewSystem.js
   ```

2. **Implement as pure function:**
   ```javascript
   // src/systems/myNewSystem.js
   export function processMyFeature(bundle, dt, config) {
     // Pure logic here
     return result;
   }
   ```

3. **Add configuration:**
   ```javascript
   // config.js
   export const CONFIG = {
     // ... existing config
     myNewSystem: {
       enabled: false,
       parameter1: 10,
       parameter2: 0.5
     }
   };
   ```

4. **Create test:**
   ```javascript
   // test/myNewSystem.test.js
   import { processMyFeature } from '../src/systems/myNewSystem.js';

   console.log('Testing myNewSystem...');
   // Add test cases
   ```

5. **Integrate into simulation:**
   ```javascript
   // src/core/simulationLoop.js or app.js
   import { processMyFeature } from './systems/myNewSystem.js';

   // In update phase:
   if (config.myNewSystem.enabled) {
     bundles.forEach(b => processMyFeature(b, dt, config));
   }
   ```

6. **Document:**
   - Create `docs/how-to/MY_NEW_SYSTEM_GUIDE.md`
   - Update `docs/INDEX.md`
   - Update `docs/architecture/TECHNICAL_DOC.md`

### Adding a Configuration Parameter

1. **Add to config.js:**
   ```javascript
   export const CONFIG = {
     // ... existing config
     newParameter: 42,

     // Or nested:
     existingSection: {
       newSubParameter: 0.5
     }
   };
   ```

2. **Use in code:**
   ```javascript
   export function myFunction(config) {
     const value = config.newParameter;
     // Use value
   }
   ```

3. **Document in relevant guide:**
   ```markdown
   ## Configuration

   - `newParameter` (number, default: 42): Description of what it does
   ```

### Adding a UI Control

1. **Create UI module (if needed):**
   ```javascript
   // src/ui/myControl.js
   export function initializeMyControl(canvas, handlers) {
     // DOM manipulation only
     canvas.addEventListener('click', handlers.onClick);
   }
   ```

2. **Add keyboard binding:**
   ```javascript
   // src/ui/inputManager.js
   export function initializeInputManager(canvas, handlers) {
     window.addEventListener('keydown', (e) => {
       if (e.key === 'n') handlers.onToggleMyFeature();
       // ... existing keys
     });
   }
   ```

3. **Update README.md controls table:**
   ```markdown
   | Key | Action |
   |-----|--------|
   | `N` | Toggle my new feature. |
   ```

4. **Test in browser:**
   - `npm start`
   - Press the new key
   - Verify behavior

### Debugging Simulation Issues

1. **Enable debug logging:**
   ```javascript
   // In config.js
   export const CONFIG = {
     debug: {
       enabled: true,
       logLevel: 'verbose'
     }
   };
   ```

2. **Use browser DevTools:**
   - F12 to open console
   - Add breakpoints in Sources tab
   - Use `debugger;` statement in code

3. **Check simulation state:**
   ```javascript
   // In browser console
   console.log(world.bundles);
   console.log(world.resources);
   console.log(CONFIG);
   ```

4. **Use debug profiles:**
   ```bash
   # Load debug profile with specific configuration
   # See profiles/ directory for examples
   ```

### Running Training

1. **Start simulation:**
   ```bash
   npm start
   ```

2. **Open training UI:**
   - Press `L` key in browser

3. **Start training:**
   - Click "Start Training" button
   - Watch generations evolve
   - Monitor performance metrics

4. **Save trained policy:**
   - Click "Save Policy" button
   - Policy saved to `training/optConfigs/`

5. **Analyze results:**
   - See `training/analysis/` for metrics
   - Use Policy Analyzer (see `docs/how-to/POLICY_ANALYZER_GUIDE.md`)

---

## Important Gotchas

### 1. Don't Add Logic to Legacy Files

❌ **NEVER add new features to:**
- `app.js` (legacy entry point)
- `src/index.js` (compatibility bridge only)

✅ **ALWAYS add new features to:**
- `src/core/` for orchestration
- `src/systems/` for mechanics
- `src/ui/` for browser interface

### 2. Circular Dependency Traps

**Problem:** Direct imports can create circular dependencies.

**Solution:** Use factory pattern with dependency injection:

```javascript
// ❌ DON'T
import { World } from './world.js';
import { Bundle } from './bundle.js'; // Circular!

// ✅ DO
export function createBundleClass(context) {
  const { getWorld } = context; // Callback
  // ...
}
```

### 3. Browser vs. Node Compatibility

**Problem:** Some browser APIs don't exist in Node.

**Solution:**
- Keep browser code in `src/ui/`
- Use feature detection: `if (typeof window !== 'undefined')`
- Use custom ESM loader for tests: `--loader ./test/esm-loader.mjs`

### 4. PixiJS DPR (Device Pixel Ratio)

**Problem:** Canvas rendering looks blurry on high-DPI displays.

**Solution:** Use `src/ui/canvasManager.js`:

```javascript
import { initializeCanvasManager } from './src/ui/canvasManager.js';

const { width, height } = initializeCanvasManager(canvas);
// Canvas is now properly sized for device DPR
```

### 5. State Mutation in Systems

**Problem:** Mutating state in pure functions breaks determinism.

**Solution:** Always return new objects:

```javascript
// ❌ DON'T
export function updateBundle(bundle) {
  bundle.x += 10; // Mutation!
  return bundle;
}

// ✅ DO
export function updateBundle(bundle) {
  return { ...bundle, x: bundle.x + 10 };
}
```

### 6. Configuration Changes Don't Persist

**Problem:** Runtime config changes are lost on page reload.

**Solution:**
- For permanent changes, edit `config.js`
- For experiments, use debug profiles in `profiles/`
- For trained policies, save to `training/optConfigs/`

### 7. TC Features Require Manual Enable

**Problem:** Turing Complete features disabled by default.

**Solution:**

```javascript
// config.js
export const CONFIG = {
  tc: {
    enabled: true, // Enable TC features
    rule110: {
      enabled: true
    }
  }
};
```

### 8. Test Files Need ESM Loader

**Problem:** Node doesn't support ES modules in tests by default.

**Solution:**

```bash
# Always use custom loader
node --loader ./test/esm-loader.mjs test/myTest.js
```

---

## Configuration Management

### Configuration Sections

`config.js` is organized into logical sections:

1. **Physics & Core**
   - `startChi`: Initial energy for agents
   - `decay`: Decay rates for trails/signals
   - `speedLimit`: Maximum agent speed

2. **Plant Ecology**
   - `plantRegenRate`: Resource regeneration speed
   - `fertility`: Soil quality mechanics
   - `carryingCapacity`: Max resources per area

3. **Agent Behavior**
   - `sensing.baseRange`: Default sensing distance
   - `sensing.extendedRange`: Enhanced sensing distance
   - `metabolism`: Energy consumption rates

4. **Mitosis**
   - `mitosis.enabled`: Enable/disable reproduction
   - `mitosis.threshold`: Energy needed to split
   - `mitosis.maxPopulation`: Population cap

5. **Learning**
   - `cem.populationSize`: Number of policy candidates
   - `cem.eliteRatio`: Top performers to keep
   - `cem.mutationRate`: Policy exploration rate

6. **Adaptive Rewards**
   - `adaptiveRewards.enabled`: Dynamic reward scaling
   - `adaptiveRewards.emaAlpha`: Smoothing factor

7. **Participation**
   - `participation.enabled`: Interactive user guidance
   - `participation.forceStrength`: Influence magnitude

8. **TC (Turing Completeness)**
   - `tc.enabled`: Enable computational substrate
   - `tc.rule110.enabled`: Cellular automaton

9. **Signal Fields**
   - `signalField.channels`: Communication channels
   - `signalField.propagation`: Signal spread mechanics

### Finding Configuration

**To find a specific parameter:**

```bash
# Search config.js for keyword
grep -n "sensing" config.js
grep -n "mitosis" config.js
```

**To understand parameter impact:**

1. Check parameter name and section
2. Search codebase for usage: `grep -r "config.sensing" src/`
3. Read relevant documentation in `docs/`

---

## Where to Find Things

### "I need to understand how X works"

| Feature | Primary Code | Documentation | Tests |
|---------|-------------|---------------|-------|
| Agent movement | `src/systems/movement.js` | `docs/architecture/TECHNICAL_DOC.md` | `test/movement.test.js` |
| Energy/metabolism | `src/systems/metabolism.js` | `docs/architecture/TECHNICAL_DOC.md` | `test/metabolism.test.js` |
| Reproduction | `src/systems/mitosis.js` | `docs/architecture/MITOSIS_IMPLEMENTATION.md` | `test/mitosis.test.js` |
| Resource collection | `src/systems/resourceSystem.js` | `docs/how-to/PLANT_ECOLOGY_GUIDE.md` | `test/resourceSystem.test.js` |
| Agent sensing | `src/core/sensing.js` | `docs/architecture/SENSING_REBALANCE.md` | `test/sensing.test.js` |
| Training system | `src/core/training.js` | `docs/architecture/LEARNING_SYSTEM.md` | `test/test-adaptive-rewards.js` |
| Signal fields | `signalField.js` (root) | `docs/architecture/SIGNAL_FIELD_SYSTEM_OVERVIEW.md` | N/A |
| Plant ecology | `plantEcology.js` (root) | `docs/how-to/PLANT_ECOLOGY_GUIDE.md` | N/A |
| Scent gradients | `scentGradient.js` (root) | `docs/architecture/GRADIENT_IMPLEMENTATION_SUMMARY.md` | N/A |
| User participation | `src/systems/participation.js` | `docs/how-to/PARTICIPATION_GUIDE.md` | N/A |
| Keyboard controls | `src/ui/inputManager.js` | `README.md` | Manual testing |
| Simulation loop | `src/core/simulationLoop.js` | `docs/architecture/TECHNICAL_DOC.md` | N/A |

### "I need to modify X"

| Task | Files to Edit | Related Docs |
|------|--------------|--------------|
| Add new agent behavior | `src/systems/` + `config.js` | `CONTRIBUTING.md` |
| Change UI controls | `src/ui/inputManager.js` + `README.md` | `docs/how-to/` |
| Tune simulation parameters | `config.js` | Relevant `docs/how-to/` guide |
| Add training metric | `src/core/metricsTracker.js` | `docs/architecture/LEARNING_SYSTEM.md` |
| Modify rendering | `app.js` (PIXI code) | `docs/architecture/TECHNICAL_DOC.md` |
| Add debug profile | `profiles/` | `docs/how-to/DEBUG_MODE_GUIDE.md` |
| Create new system | `src/systems/` + test | `CONTRIBUTING.md` |

### "Where are the examples of X?"

| Example Type | Location |
|--------------|----------|
| Pure function system | `src/systems/metabolism.js` (simplest) |
| Complex system | `src/systems/participation.js` |
| Factory pattern | `src/core/world.js` |
| Dependency injection | `src/core/bundle.js` |
| Test suite | `test/movement.test.js` |
| Documentation | `docs/how-to/TRAINING_GUIDE.md` |
| Configuration section | `config.js` (search for `mitosis`) |
| UI module | `src/ui/inputManager.js` |

---

## Project-Specific Terminology

Learn the lingo to understand code and docs:

| Term | Meaning |
|------|---------|
| **Bundle** | An agent in the simulation (resource-seeking entity) |
| **Chi (χ)** | Energy or life force that agents consume and collect |
| **Ledger** | Credit tracking system for agents |
| **Links** | Connections between agents |
| **Trail** | Visual history of agent movement |
| **Fertility** | Soil quality affecting resource regeneration |
| **Mitosis** | Agent reproduction by splitting |
| **CEM** | Cross-Entropy Method (learning algorithm) |
| **Episode** | Single training run from start to termination |
| **Generation** | Set of policy candidates in one learning iteration |
| **Elite** | Top-performing policies selected for next generation |
| **Policy** | Agent behavior parameters (learned weights) |
| **Observation** | Sensor inputs that agent receives |
| **Action** | Output decisions agent makes (movement, signals) |
| **Reward** | Performance metric for learning (chi collected) |
| **Signal Field** | Multi-channel communication system for agents |
| **Participation** | Interactive user guidance mode |
| **TC** | Turing Completeness features (Rule 110, tape machines) |
| **ORMD** | Open Research Metadata (documentation schema) |

---

## When You're Stuck

### Debug Checklist

1. **Check recent commits:** `git log --oneline -20`
2. **Search documentation:** `grep -r "your-topic" docs/`
3. **Search codebase:** `grep -r "your-function" src/`
4. **Check configuration:** Look in `config.js` for related parameters
5. **Run tests:** `node --loader ./test/esm-loader.mjs test/related-test.js`
6. **Check browser console:** F12 → Console tab
7. **Read CONTRIBUTING.md:** Project conventions and architecture
8. **Check docs/INDEX.md:** Central documentation hub

### Common Error Patterns

**"Cannot find module"**
- Check import path is correct
- Ensure file exists at expected location
- Verify extension is `.js` for ES modules

**"Circular dependency detected"**
- Use factory pattern with dependency injection
- Use callbacks like `getWorld()` for late binding
- Refactor to break the cycle

**"window is not defined" (in tests)**
- Use custom ESM loader: `node --loader ./test/esm-loader.mjs`
- Keep browser code in `src/ui/`
- Add feature detection: `if (typeof window !== 'undefined')`

**"Tests pass but browser fails"**
- Check browser console for errors
- Verify PixiJS context is properly initialized
- Check canvas DPR handling

**"Config changes don't work"**
- Verify you're editing `config.js`, not a snapshot
- Hard refresh browser (Ctrl+Shift+R)
- Check if feature has separate `enabled` flag

---

## Quick Reference Commands

```bash
# Development
npm start                    # Start dev server
npm run build                # Production build
npm run serve                # Preview production build

# Testing
node --loader ./test/esm-loader.mjs test/FILE.test.js  # Run test

# Git
git status                   # Check status
git log --oneline -10        # Recent commits
git diff                     # See changes

# Search
grep -r "term" src/          # Search source code
grep -r "term" docs/         # Search documentation
grep -n "term" config.js     # Search config (with line numbers)

# File operations
find src/ -name "*.js"       # Find all JS files in src/
ls -lah docs/how-to/         # List how-to guides
```

---

## Final Notes for AI Assistants

### General Principles

1. **Read before writing:** Always explore existing code patterns before implementing
2. **Follow established patterns:** Use factory pattern, pure functions, dependency injection
3. **Test your changes:** Create or update tests for modified systems
4. **Document everything:** Update docs alongside code changes
5. **Keep it modular:** Add new code to `src/`, not legacy files
6. **Respect configuration:** Use `config.js` for all tunables
7. **Maintain backward compatibility:** Don't break existing functionality

### Before Making Changes

- [ ] Read relevant documentation in `docs/`
- [ ] Study similar existing code
- [ ] Understand the architectural pattern
- [ ] Check if configuration already exists
- [ ] Verify tests exist for related code

### After Making Changes

- [ ] Run relevant tests
- [ ] Update or create tests
- [ ] Update documentation
- [ ] Update `docs/INDEX.md` if needed
- [ ] Commit with descriptive message
- [ ] Note doc changes in commit message

### Code Review Self-Check

- [ ] No new logic in `app.js` or `src/index.js`
- [ ] Pure functions have no side effects
- [ ] Browser code isolated to `src/ui/`
- [ ] Dependencies injected via context
- [ ] Configuration centralized in `config.js`
- [ ] Tests pass with ESM loader
- [ ] Documentation updated
- [ ] Follows existing naming conventions

---

**Remember:** This is an active research project exploring emergent behaviors. The codebase values modularity, testability, and scientific exploration. When in doubt, follow the patterns in `src/systems/` and consult `CONTRIBUTING.md`.

**Happy coding! 🚀**
