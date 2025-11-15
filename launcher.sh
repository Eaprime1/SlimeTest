#!/bin/bash

# SlimeTest Launcher
# Simple interactive launcher for Essence Engine

echo "╔════════════════════════════════════════╗"
echo "║     SlimeTest / Essence Engine         ║"
echo "║          Quick Launcher                ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Working Directory: $(pwd)"
echo ""
echo "Available Commands:"
echo ""
echo "  1) Start Development Server (browser auto-opens)"
echo "  2) Run Tests"
echo "  3) Build for Production"
echo "  4) Preview Production Build"
echo "  5) Quick Start (just launch the sim)"
echo ""
echo "  t) Open Training Analysis Directory"
echo "  p) Open Profiles Directory"
echo "  d) Open Documentation"
echo ""
echo "  q) Quit"
echo ""
read -p "Select option [1-5, t/p/d/q]: " choice

case $choice in
  1)
    echo ""
    echo "🚀 Starting Development Server..."
    echo "   Browser will open at http://localhost:3000"
    echo "   Press Ctrl+C to stop"
    echo ""
    npm start
    ;;

  2)
    echo ""
    echo "🧪 Running Tests..."
    echo ""
    echo "Select test suite:"
    echo "  1) All system tests"
    echo "  2) Movement tests"
    echo "  3) Metabolism tests"
    echo "  4) Mitosis tests"
    echo "  5) Resource system tests"
    echo ""
    read -p "Select test [1-5]: " test_choice

    case $test_choice in
      1)
        echo "Running all system tests..."
        node --loader ./test/esm-loader.mjs test/movement.test.js
        node --loader ./test/esm-loader.mjs test/metabolism.test.js
        node --loader ./test/esm-loader.mjs test/mitosis.test.js
        node --loader ./test/esm-loader.mjs test/resourceSystem.test.js
        ;;
      2)
        node --loader ./test/esm-loader.mjs test/movement.test.js
        ;;
      3)
        node --loader ./test/esm-loader.mjs test/metabolism.test.js
        ;;
      4)
        node --loader ./test/esm-loader.mjs test/mitosis.test.js
        ;;
      5)
        node --loader ./test/esm-loader.mjs test/resourceSystem.test.js
        ;;
      *)
        echo "Invalid test selection"
        ;;
    esac
    ;;

  3)
    echo ""
    echo "🔨 Building for Production..."
    npm run build
    echo ""
    echo "✅ Build complete! Output in dist/ directory"
    ;;

  4)
    echo ""
    echo "👀 Previewing Production Build..."
    npm run serve
    ;;

  5)
    echo ""
    echo "🚀 Quick Starting Essence Engine..."
    echo "   Opening browser at http://localhost:3000"
    echo ""
    npm start
    ;;

  t|T)
    echo ""
    echo "📊 Training Analysis Directory:"
    ls -lh training/analysis/ 2>/dev/null || echo "No analysis files found"
    echo ""
    echo "📈 Recent Snapshots:"
    ls -lht training/snapshots/ 2>/dev/null | head -5 || echo "No snapshots found"
    ;;

  p|P)
    echo ""
    echo "🔧 Available Profiles:"
    ls -lh profiles/ 2>/dev/null || echo "No profiles found"
    ;;

  d|D)
    echo ""
    echo "📚 Documentation Structure:"
    echo ""
    echo "Main Guides:"
    ls -1 docs/how-to/*.md 2>/dev/null | head -8 || echo "No guides found"
    echo ""
    echo "For full documentation index, see: docs/INDEX.md"
    ;;

  q|Q)
    echo ""
    echo "👋 Goodbye!"
    exit 0
    ;;

  *)
    echo ""
    echo "❌ Invalid option. Please run ./launcher.sh again."
    exit 1
    ;;
esac
