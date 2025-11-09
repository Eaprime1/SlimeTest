// app/hud.js - HUD and dashboard rendering

function getControllerBadge(bundle, index = 0, loadedPolicyInfo) {
    if (bundle.useController && bundle.controller) {
        if (index === 0 && loadedPolicyInfo) {
            return `🤖 ${loadedPolicyInfo.filename.replace('.json', '').substring(0, 12)}`;
        }
        return bundle.controller.constructor.name === "LinearPolicyController" ? "🤖 POLICY" : "🎮 CTRL";
    }
    return "🧠 AI";
}

export function drawHUD(ctx, world, systems) {
    const { CONFIG, inputState, trainingModule } = systems;
    if (!CONFIG.hud.show || inputState.hudDisplayMode === 'hidden') return;
    
    ctx.save();
    
    const baselineY = 10;
    const padding = 14;
    const lineHeight = 16;
    const sectionSpacing = 10;
    
    // Calculate metrics
    const totalAgents = world.bundles.length;
    const aliveCount = world.bundles.filter(b => b.alive).length;
    const totalChi = world.bundles.reduce((sum, b) => sum + b.chi, 0);
    const avgChi = totalAgents ? totalChi / totalAgents : 0;
    const avgFrustration = totalAgents
        ? world.bundles.reduce((sum, b) => sum + b.frustration, 0) / totalAgents
        : 0;
    const avgHunger = totalAgents
        ? world.bundles.reduce((sum, b) => sum + b.hunger, 0) / totalAgents
        : 0;

    let resourceSummary = `${world.resources.length}`;
    let resourceDetails = "";
    if (CONFIG.plantEcology.enabled) {
        if (CONFIG.resourceScaleWithAgents) {
            const spawnPressure = CONFIG.plantEcology.spawnPressure;
            const minResourceMultiplier = spawnPressure?.minResourceMultiplier ?? 1;
            const pressureMultiplier = systems.getSpawnPressureMultiplier(aliveCount, minResourceMultiplier);
            const maxResources = Math.floor(
                clamp(
                    CONFIG.resourceBaseAbundance * pressureMultiplier,
                    CONFIG.resourceScaleMinimum,
                    CONFIG.resourceScaleMaximum
                )
            );
            const pressurePct = Math.round((1 - pressureMultiplier) * 100);
            resourceSummary = `${world.resources.length}/${maxResources}`;
            resourceDetails = `pressure ${pressurePct}%`;
        } else {
            resourceSummary = `${world.resources.length}/${world.carryingCapacity}`;
            resourceDetails = `cap ${world.carryingCapacity}`;
        }
    }

    const hudSections = [];

    // Minimal mode: compact single line
    if (inputState.hudDisplayMode === 'minimal') {
        hudSections.push({
            color: "#88ffff",
            lines: [
                `📊 ${aliveCount}/${totalAgents}  χ:${avgChi.toFixed(1)}  🌿:${resourceSummary}  tick:${systems.globalTick}`
            ]
        });
    } else {
        // Full mode: organized sections
        
        // Section 1: Agent Statistics
        hudSections.push({
            color: "#88ffff",
            lines: [
                `📊 AGENTS`,
                `   alive:   ${aliveCount}/${totalAgents}`,
                `   avg χ:   ${avgChi.toFixed(1)}`,
                `   births:  ${world.totalBirths}`,
                `   avg F/H: ${Math.round(avgFrustration * 100)}% / ${Math.round(avgHunger * 100)}%`
            ]
        });

        // Section 2: Simulation Stats
        const simLines = [
            `⚙️  SIMULATION`,
            `   mode:      ${CONFIG.autoMove ? "AUTO" : "MANUAL"}`,
            `   learning:  ${trainingModule.getLearningMode() === 'train' ? "TRAINING" : "PLAY"}`,
            `   tick:      ${systems.globalTick}`,
            `   χ earned:  ${world.collected}`
        ];
        hudSections.push({
            color: "#00ff88",
            lines: simLines
        });

        // Section 3: Resources
        const resourceLines = [
            `🌿 RESOURCES`,
            `   count:  ${resourceSummary}`
        ];
        if (resourceDetails) {
            resourceLines.push(`   ${resourceDetails}`);
        }
        hudSections.push({
            color: "#ffaa00",
            lines: resourceLines
        });

        // Section 4: Status badges
        hudSections.push({
            type: 'badges',
            color: "#88ddff",
            label: "⚡ STATUS",
            badges: [
                { label: 'Trail', enabled: CONFIG.renderTrail },
                { label: 'Diffusion', enabled: CONFIG.enableDiffusion },
                { label: 'Mitosis', enabled: CONFIG.mitosis.enabled },
                { label: 'Scent', enabled: inputState.showScentGradient },
                { label: 'Fertility', enabled: inputState.showFertility },
                { label: 'Dashboard', enabled: inputState.showAgentDashboard }
            ]
        });
    }

    // Calculate HUD dimensions
    let totalLines = 0;
    let badgeCount = 0;
    hudSections.forEach(section => {
        if (section.type === 'badges') {
            totalLines += 1; // Header line
            badgeCount = section.badges.length;
        } else {
            totalLines += section.lines.length;
        }
    });
    
    const badgeVerticalSpace = badgeCount * 19;
    const hudHeight = padding * 2 + totalLines * lineHeight + (hudSections.length - 1) * sectionSpacing + badgeVerticalSpace;
    const hudWidth = inputState.hudDisplayMode === 'minimal' ? 500 : 175;

    // Draw HUD background
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(baselineY, baselineY, hudWidth, hudHeight);
    ctx.strokeStyle = "rgba(0, 255, 136, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(baselineY, baselineY, hudWidth, hudHeight);

    drawHUDContent(ctx, hudSections, baselineY, padding, lineHeight, sectionSpacing);

    if (inputState.showAgentDashboard) {
        drawAgentDashboard(ctx, world, baselineY, systems);
    }

    ctx.restore();
}

function drawHUDContent(ctx, sections, baselineY, padding, lineHeight, sectionSpacing) {
    let currentY = baselineY + padding + 13;
    
    sections.forEach(section => {
        if (section.type === 'badges') {
            currentY = drawBadgesSection(ctx, section, currentY, baselineY, padding, lineHeight, sectionSpacing);
        } else {
            currentY = drawTextSection(ctx, section, currentY, baselineY, padding, lineHeight, sectionSpacing);
        }
    });
}

function drawBadgesSection(ctx, section, startY, baselineY, padding, lineHeight, sectionSpacing) {
    let currentY = startY;

    // Draw section header
    ctx.fillStyle = section.color;
    ctx.font = "bold 13px ui-mono, monospace";
    addTextShadow(ctx);
    ctx.fillText(section.label, baselineY + padding, currentY);
    removeTextShadow(ctx);

    currentY += lineHeight + 3;

    // Draw badges vertically
    const badgeX = baselineY + padding + 3;
    section.badges.forEach(badge => {
        currentY = drawBadge(ctx, badge.enabled, badge.label, badgeX, currentY);
    });

    return currentY + sectionSpacing;
}

function drawTextSection(ctx, section, startY, baselineY, padding, lineHeight, sectionSpacing) {
    let currentY = startY;
    const lines = section.lines.filter(Boolean);

    ctx.fillStyle = section.color;
    lines.forEach((line, idx) => {
        addTextShadow(ctx);
        
        if (idx === 0) {
            ctx.font = "bold 13px ui-mono, monospace";
        } else {
            ctx.font = "12px ui-mono, monospace";
        }
        
        ctx.fillText(line, baselineY + padding, currentY);
        
        removeTextShadow(ctx);
        currentY += lineHeight;
    });

    return currentY + sectionSpacing;
}

function drawBadge(ctx, enabled, label, x, y) {
    const badgeWidth = 80;
    const badgeHeight = 16;
    
    // Badge background
    ctx.fillStyle = enabled 
        ? "rgba(0, 255, 136, 0.2)" 
        : "rgba(128, 128, 128, 0.15)";
    ctx.fillRect(x, y - 11, badgeWidth, badgeHeight);
    
    // Badge border
    ctx.strokeStyle = enabled 
        ? "rgba(0, 255, 136, 0.5)" 
        : "rgba(128, 128, 128, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y - 11, badgeWidth, badgeHeight);
    
    // Check mark or cross
    ctx.fillStyle = enabled ? "#4dffaa" : "#666";
    ctx.font = "bold 11px ui-mono, monospace";
    ctx.fillText(enabled ? "✓" : "✗", x + 4, y);
    
    // Label
    ctx.fillStyle = enabled ? "#00ff88" : "#888";
    ctx.font = "12px ui-mono, monospace";
    ctx.fillText(label, x + 18, y);
    
    return y + badgeHeight + 3;
}

function addTextShadow(ctx) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
}

function removeTextShadow(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

export function drawAgentDashboard(ctx, world, baselineY = 10, systems) {
    const agents = world.bundles;
    if (!agents.length) return;

    const viewWidth = ctx.canvas.width;
    const viewHeight = ctx.canvas.height;
    const padding = 12;
    const rowHeight = 17;
    const headerHeight = 65;
    const rightMargin = 10;
    
    // Fixed column widths for aligned table layout
    ctx.font = "12px ui-mono, monospace";
    const colWidths = {
        vis: 28,      // "vis/alive" - icons
        id: 36,       // "ID"
        pos: 85,      // "X,Y" position
        chi: 62,      // "χ" with value
        cr: 62,       // "cr" with value
        f: 48,        // "F" with %
        h: 48,        // "H" with %
        sense: 60,    // "sense" with value
        controller: 80 // "controller"
    };
    
    const singleColumnWidth = Object.values(colWidths).reduce((sum, w) => sum + w, 0) + 8;
    const maxRows = Math.max(1, Math.floor((viewHeight - padding * 2 - headerHeight) / rowHeight));
    const maxColumns = Math.max(1, Math.floor((viewWidth - padding * 2 - rightMargin) / singleColumnWidth));

    let columns = 1;
    let rowsPerColumn = Math.ceil(agents.length / columns);
    while (columns < maxColumns && rowsPerColumn > maxRows) {
        columns++;
        rowsPerColumn = Math.ceil(agents.length / columns);
    }

    columns = Math.max(1, Math.min(columns, maxColumns, agents.length || 1));
    rowsPerColumn = Math.max(1, Math.ceil(agents.length / columns));

    // Calculate panel dimensions
    const calculatedWidth = columns * singleColumnWidth + padding * 2;
    const maxWidth = viewWidth - rightMargin - padding;
    const panelWidth = Math.min(maxWidth, calculatedWidth);
    const panelHeight = Math.min(viewHeight - 20, headerHeight + rowsPerColumn * rowHeight + padding * 2);
    const panelX = Math.max(padding, viewWidth - panelWidth - rightMargin);
    const panelY = baselineY;

    ctx.save();
    
    // Draw dashboard background
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = "rgba(0, 255, 136, 0.6)";
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    const titleY = panelY + padding + 15;
    const headerRowY = titleY + 18;

    // Draw title
    ctx.font = "13px ui-mono, monospace";
    ctx.fillStyle = "#00ff88";
    addTextShadow(ctx);
    ctx.fillText(`Agent dashboard (${agents.length})`, panelX + padding, titleY);
    removeTextShadow(ctx);

    // Draw column headers
    drawAgentDashboardHeaders(ctx, columns, colWidths, panelX, padding, headerRowY);

    // Draw agent rows
    drawAgentDashboardRows(ctx, agents, columns, rowsPerColumn, colWidths, panelX, padding, headerRowY + 20);

    // Show truncation notice if needed
    const totalCapacity = rowsPerColumn * columns;
    if (totalCapacity < agents.length) {
        ctx.font = "11px ui-mono, monospace";
        ctx.fillStyle = "#ffaa88";
        addTextShadow(ctx);
        ctx.fillText(
            `showing ${totalCapacity} of ${agents.length} agents`,
            panelX + padding,
            panelY + panelHeight - padding
        );
        removeTextShadow(ctx);
    }

    ctx.restore();
}

function drawAgentDashboardHeaders(ctx, columns, colWidths, panelX, padding, headerRowY) {
    ctx.font = "12px ui-mono, monospace";
    ctx.fillStyle = "#d0ffd8";
    addTextShadow(ctx);

    for (let col = 0; col < columns; col++) {
        let x = panelX + padding + col * (Object.values(colWidths).reduce((sum, w) => sum + w, 0) + 8);
        ctx.fillText("vis", x, headerRowY); x += colWidths.vis;
        ctx.fillText("ID", x, headerRowY); x += colWidths.id;
        ctx.fillText("X,Y", x, headerRowY); x += colWidths.pos;
        ctx.fillText("chi", x, headerRowY); x += colWidths.chi;
        ctx.fillText("credits", x, headerRowY); x += colWidths.cr;
        ctx.fillText("Frust", x, headerRowY); x += colWidths.f;
        ctx.fillText("Hunger", x, headerRowY); x += colWidths.h;
        ctx.fillText("sense", x, headerRowY); x += colWidths.sense;
        ctx.fillText("control", x, headerRowY);
    }

    removeTextShadow(ctx);
}

function drawAgentDashboardRows(ctx, agents, columns, rowsPerColumn, colWidths, panelX, padding, startY) {
    agents.forEach((bundle, index) => {
        const column = Math.floor(index / rowsPerColumn);
        const row = index % rowsPerColumn;
        const rowBaseX = panelX + padding + column * (Object.values(colWidths).reduce((sum, w) => sum + w, 0) + 8);
        const rowY = startY + row * 17;

        ctx.fillStyle = bundle.alive ? systems.getAgentColor(bundle.id, true) : "#777777";
        addTextShadow(ctx);

        let x = rowBaseX;
        ctx.fillText(`${bundle.visible ? "👁" : "🚫"}${bundle.alive ? "✓" : "✗"}`, x, rowY);
        x += colWidths.vis;
        ctx.fillText(`A${bundle.id.toString().padStart(2, "0")}`, x, rowY);
        x += colWidths.id;
        ctx.fillText(`${Math.round(bundle.x)},${Math.round(bundle.y)}`, x, rowY);
        x += colWidths.pos;
        ctx.fillText(`χ${bundle.chi.toFixed(1).padStart(5, " ")}`, x, rowY);
        x += colWidths.chi;
        ctx.fillText(`cr${systems.Ledger.getCredits(bundle.id).toFixed(1).padStart(5, " ")}`, x, rowY);
        x += colWidths.cr;
        ctx.fillText(`F${Math.round(bundle.frustration * 100).toString().padStart(3, " ")}%`, x, rowY);
        x += colWidths.f;
        ctx.fillText(`H${Math.round(bundle.hunger * 100).toString().padStart(3, " ")}%`, x, rowY);
        x += colWidths.h;
        ctx.fillText(`s${Math.round(bundle.currentSensoryRange || 0).toString().padStart(3, " ")}`, x, rowY);
        x += colWidths.sense;
        ctx.fillText(getControllerBadge(bundle, index, systems.loadedPolicyInfo), x, rowY);

        removeTextShadow(ctx);
    });
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}