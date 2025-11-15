# SlimeTest Launcher Guide

Quick reference for launching and working with Essence Engine.

## Quick Start (Fastest Way)

Just want to get the simulation running? Use any of these:

```bash
# Option 1: Direct quickstart script
./quickstart.sh

# Option 2: npm quickstart
npm run quick

# Option 3: Standard npm start
npm start
```

All of these will open the simulation in your browser at http://localhost:3000.

## Interactive Launcher

For more options, use the interactive launcher:

```bash
# Option 1: Direct execution
./launcher.sh

# Option 2: Via npm
npm run launch
```

The launcher provides a menu with options to:
- Start development server
- Run tests (with test suite selection)
- Build for production
- Preview production build
- Browse training data and profiles
- Access documentation

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (opens browser) |
| `npm run dev` | Same as start |
| `npm run quick` | Quickstart - just launch! |
| `npm run launch` | Interactive launcher menu |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |
| `npm run test:all` | Run all system tests |
| `npm run test:movement` | Run movement tests only |
| `npm run test:metabolism` | Run metabolism tests only |

## Browser Controls

Once the simulation is running, press these keys:

| Key | Action |
|-----|--------|
| `SPACE` | Pause/resume simulation |
| `R` | Reset simulation |
| `L` | Open training UI |
| `O` | Open config panel |
| `M` | Toggle mitosis (reproduction) |
| `G` | Toggle scent gradient visualization |
| `P` | Toggle fertility visualization |

See README.md for complete control reference.

## Working with Google Drive Content

If you have training data, policies, or configurations on Google Drive:

1. **Download to appropriate directory:**
   - Training data → `training/snapshots/`
   - Optimized configs → `training/optConfigs/`
   - Analysis results → `training/analysis/`
   - Debug profiles → `profiles/`

2. **Quick download example:**
```bash
# Example: Download a policy file
# (Replace with your actual Google Drive file)
cd training/optConfigs/
# Download your policy JSON from Google Drive
```

3. **Load in simulation:**
   - Press `L` to open training UI
   - Use "Load Policy" button to select downloaded file

## Development Workflow

### Starting a session:
```bash
# 1. Navigate to project
cd /home/user/SlimeTest

# 2. Quick launch
./quickstart.sh

# 3. Browser opens automatically at localhost:3000
```

### Making changes:
```bash
# 1. Edit files in src/ directory
# 2. Vite hot-reloads automatically
# 3. See changes in browser immediately
```

### Running tests after changes:
```bash
# Run relevant tests
npm run test:all

# Or use interactive launcher
./launcher.sh
# Then select option 2 (Run Tests)
```

## Troubleshooting

### Port already in use
```bash
# Kill existing Vite server
pkill -f vite

# Or use different port
vite --port 3001
```

### Dependencies missing
```bash
# Reinstall dependencies
npm install
```

### Browser doesn't open automatically
Manually navigate to: http://localhost:3000

## Directory Quick Reference

```
SlimeTest/
├── src/              # Source code (edit here)
├── docs/             # Documentation
├── training/         # Training data and results
│   ├── snapshots/    # Training snapshots
│   ├── optConfigs/   # Optimized policies
│   └── analysis/     # Analysis results
├── profiles/         # Debug profiles
├── test/             # Test files
└── app.js            # Main entry point
```

## Tips

- **First time:** Just run `./quickstart.sh` to see it work
- **Exploring:** Use `./launcher.sh` for menu of options
- **Development:** Use `npm start` for hot-reload during coding
- **Training:** Press `L` in browser to access training UI
- **Documentation:** See `docs/INDEX.md` for complete guides

Happy simulating! 🚀
