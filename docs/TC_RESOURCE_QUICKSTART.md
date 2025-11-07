# Quick Start: TC-Resource Integration

Link Rule 110 cellular automaton to resource spawning for a truly computational living environment!

## 🚀 Quick Setup (Browser Console)

Paste this **complete block** into your browser console (all at once):

```javascript
(async () => {
  // Step 1: Enable TC
  enableTC('rule110');
  
  // Step 2: Register Rule 110 stepper
  const { registerRule110Stepper } = await import('./tc/tcRule110.js');
  const { stepper } = registerRule110Stepper({
    width: 128,
    initializer: 'ether',
    stateKey: 'tc.rule110.state',
    bufferKey: 'tc.rule110.next'
  });
  window.rule110Stepper = stepper;
  
  // Step 3: Import CONFIG and enable TC-Resource integration
  const { CONFIG } = await import('./config.js');
  CONFIG.tcResourceIntegration.enabled = true;
  CONFIG.tcResourceIntegration.mode = 'hybrid';  // 'spatial', 'activity', or 'hybrid'
  CONFIG.tcResourceIntegration.showOverlay = true;  // Show Rule 110 visualization
  
  // Step 4: Reset world to apply
  World.reset();
  
  console.log('✅ TC-Resource integration active!');
  console.log('Resources now spawn based on Rule 110 patterns');
  console.log('Watch the green overlay at top of screen - that\'s Rule 110!');
})();
```

**Note:** Paste the entire block including the `(async () => { ... })();` wrapper.

## 📊 What You'll See

### With `mode: 'spatial'`
- Resources spawn at X coordinates matching **active cells** in Rule 110
- Creates horizontal **resource bands** that follow computational patterns
- Gliders in Rule 110 → moving resource patches
- Agents must track computational structures

### With `mode: 'activity'`
- Rule 110 **density** (% active cells) controls spawn rate
- High activity → more resources (computational "spring")
- Low activity → fewer resources (computational "winter")
- Random positions, but TC-modulated frequency

### With `mode: 'hybrid'` ⭐ RECOMMENDED
- **Both spatial AND activity** effects
- Resources cluster where Rule 110 is active
- Spawn rate varies with global activity
- Most dynamic and interesting!

### With `showOverlay: true`
- Visual bar at top of screen shows Rule 110 state
- Green cells = active (1s)
- Activity percentage indicator
- See the computation driving your environment!

## 🎮 Interactive Examples

### Example 1: Sparse Computational Desert

```javascript
(async () => {
  // Glider initializer creates sparse patterns
  const { registerRule110Stepper } = await import('./tc/tcRule110.js');
  const { stepper } = registerRule110Stepper({
    width: 128,
    initializer: 'glider',
    initializerOptions: { offset: 20 }
  });
  window.rule110Stepper = stepper;
  
  const { CONFIG } = await import('./config.js');
  CONFIG.tcResourceIntegration.enabled = true;
  CONFIG.tcResourceIntegration.mode = 'spatial';
  CONFIG.tcResourceIntegration.showOverlay = true;
  World.reset();
  
  console.log('🌵 Sparse desert mode! Resources follow the glider.');
})();
```

### Example 2: Dense Computational Garden

```javascript
(async () => {
  // Random initializer with high density
  const { registerRule110Stepper } = await import('./tc/tcRule110.js');
  const { stepper } = registerRule110Stepper({
    width: 128,
    initializer: 'random',
    initializerOptions: { density: 0.7, seed: 42 }
  });
  window.rule110Stepper = stepper;
  
  const { CONFIG } = await import('./config.js');
  CONFIG.tcResourceIntegration.enabled = true;
  CONFIG.tcResourceIntegration.mode = 'hybrid';
  CONFIG.tcResourceIntegration.activityInfluence = 0.8;  // Strong modulation
  World.reset();
  
  console.log('🌳 Dense garden mode! Many clustered resources.');
})();
```

### Example 3: Computational Seasons

```javascript
(async () => {
  // Activity mode creates temporal cycles
  const { CONFIG } = await import('./config.js');
  CONFIG.tcResourceIntegration.enabled = true;
  CONFIG.tcResourceIntegration.mode = 'activity';
  CONFIG.tcResourceIntegration.minSpawnMultiplier = 0.2;  // Harsh winters
  CONFIG.tcResourceIntegration.maxSpawnMultiplier = 2.0;  // Abundant springs
  CONFIG.tcResourceIntegration.activityInfluence = 1.0;   // Full effect
  World.reset();
  
  console.log('🌦️ Seasonal mode! Watch spawn rate cycle with TC activity.');
  
  // Watch spawn rate vary as Rule 110 evolves
  window.seasonMonitor = setInterval(() => {
    if (window.rule110Stepper) {
      const activity = window.rule110Stepper.getState().filter(c => c === 1).length / 128;
      console.log(`Activity: ${(activity * 100).toFixed(1)}% → Spawn rate: ${(0.2 + activity * 1.8).toFixed(2)}x`);
    }
  }, 3000);
  
  console.log('Use clearInterval(window.seasonMonitor) to stop monitoring.');
})();
```

## 🔧 Configuration Options

All options in `CONFIG.tcResourceIntegration`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Master switch |
| `mode` | string | 'hybrid' | 'spatial', 'activity', or 'hybrid' |
| `spatialMapping` | boolean | true | Map Rule 110 X → World X |
| `localityRadius` | number | 5 | Cells checked for local patterns |
| `verticalSpread` | number | 0.3 | Y variation (0=flat, 1=full) |
| `activityInfluence` | number | 0.5 | How much activity affects rate |
| `minSpawnMultiplier` | number | 0.5 | Min rate at 0% activity |
| `maxSpawnMultiplier` | number | 1.5 | Max rate at 100% activity |
| `showOverlay` | boolean | false | Show Rule 110 visualization |
| `overlayOpacity` | number | 0.15 | Overlay transparency |
| `overlayHeight` | number | 40 | Overlay bar height (px) |
| `overlayPosition` | string | 'top' | 'top' or 'bottom' |

## 📈 Monitoring TC Activity

```javascript
// Check Rule 110 activity
const activity = window.rule110Stepper.getState().filter(c => c === 1).length / 128;
console.log(`Rule 110 Activity: ${(activity * 100).toFixed(1)}%`);

// Check last resource spawn location
const lastRes = World.resources[World.resources.length - 1];
console.log('Last spawn:', lastRes.tcData);

// Watch activity over time
let logInterval = setInterval(() => {
  const state = window.rule110Stepper.getState();
  const active = state.filter(c => c === 1).length;
  const activity = active / state.length;
  
  // Find resource positions
  const resPositions = World.resources.map(r => Math.floor((r.x / canvasWidth) * 100));
  
  console.log(`TC Activity: ${(activity * 100).toFixed(1)}% | Active cells: ${active}/128`);
  console.log(`Resource X positions: ${resPositions.join(', ')}%`);
}, 5000);

// Stop logging
clearInterval(logInterval);
```

## 🎯 What This Means

### Philosophically:
- **Environment is Turing-complete** - resources emerge from universal computation
- **Agents evolve computational intuition** - must learn to read algorithmic patterns
- **Simulation becomes meta** - life foraging in a thinking world

### Practically:
- **Spatial awareness** - agents learn that resources cluster predictably
- **Temporal patterns** - agents experience computational "seasons"
- **Emergent complexity** - simple rules (Rule 110) create rich environment

### Scientifically:
- **Reproducible** - same seed = same resource patterns
- **Analyzable** - can correlate agent success with TC patterns
- **Tunable** - control how much TC influences environment

## 🐛 Troubleshooting

**Q: Resources aren't spawning in TC patterns**
```javascript
(async () => {
  // Check if enabled
  const { CONFIG } = await import('./config.js');
  console.log('Enabled:', CONFIG.tcResourceIntegration.enabled);
  
  // Check if stepper exists
  console.log('Stepper:', window.rule110Stepper);
  
  // Re-register stepper if needed
  const { registerRule110Stepper } = await import('./tc/tcRule110.js');
  const { stepper } = registerRule110Stepper({
    width: 128,
    initializer: 'ether',
    stateKey: 'tc.rule110.state',
    bufferKey: 'tc.rule110.next'
  });
  window.rule110Stepper = stepper;
  
  // Enable integration
  CONFIG.tcResourceIntegration.enabled = true;
  
  // Reset world
  World.reset();
  
  console.log('✅ TC-Resource reset complete');
})();
```

**Q: Rule 110 seems frozen/not evolving**
```javascript
(async () => {
  const { CONFIG } = await import('./config.js');
  
  // Check TC is enabled
  console.log('TC enabled:', CONFIG.tc.enabled);
  
  // Check update cadence
  console.log('Update cadence:', CONFIG.tc.updateCadence);  // Should be 1
  
  // Re-enable if needed
  enableTC('rule110');
  
  console.log('⚠️ Reload page for full TC initialization');
  setTimeout(() => location.reload(), 2000);  // Reload in 2 seconds
})();
```

**Q: All resources spawning in same spot**
```javascript
(async () => {
  // Rule 110 might be too sparse - try different initializer
  const { registerRule110Stepper } = await import('./tc/tcRule110.js');
  const { stepper } = registerRule110Stepper({
    width: 128,
    initializer: 'random',
    initializerOptions: { density: 0.5, seed: Math.floor(Math.random() * 1000) }
  });
  window.rule110Stepper = stepper;
  World.reset();
  
  console.log('🎲 Random dense pattern applied');
})();
```

**Q: Want to see what's happening**
```javascript
(async () => {
  const { CONFIG } = await import('./config.js');
  
  // Enable overlay
  CONFIG.tcResourceIntegration.showOverlay = true;
  
  // Make it more visible
  CONFIG.tcResourceIntegration.overlayOpacity = 0.3;
  CONFIG.tcResourceIntegration.overlayHeight = 60;
  
  // Add logging to respawn
  if (World.resources.length > 0) {
    const originalRespawn = World.resources[0].respawn;
    World.resources.forEach(r => {
      r.respawn = function() {
        originalRespawn.call(this);
        if (this.tcData) {
          console.log(`🌱 Resource spawned from ${this.tcData.source} at (${Math.floor(this.x)}, ${Math.floor(this.y)})`);
        }
      };
    });
    console.log('✅ Logging enabled for resource spawns');
  }
})();
```

## 🎨 Visual Comparison

### Without TC Integration:
```
Resources: random positions
    🌱      🌱        🌱
 🌱       🌱      🌱     🌱
     🌱       🌱       🌱
```

### With TC Spatial Mode:
```
Resources: follow Rule 110 pattern
Rule110:  █ █ ██  ███ █  ██
Resources: 🌱🌱 🌱🌱  🌱🌱🌱 🌱  🌱🌱
(vertical alignment based on local activity)
```

### With TC Activity Mode:
```
High activity (60%):  many resources everywhere
     🌱 🌱 🌱 🌱 🌱 🌱 🌱
Low activity (15%):   few resources
          🌱        🌱
```

## 🚀 Next Level

Once you have TC-Resource working, try:

1. **Combine with Plant Ecology** - TC + fertility creates dual influence
2. **Add to observations** - let agents sense Rule 110 state
3. **Training experiments** - do agents learn faster with TC patterns?
4. **Custom initializers** - design specific computational environments
5. **Glider tracking** - make resources follow moving structures

See `docs/TC_RESOURCE_INTEGRATION.md` for advanced implementation details!

