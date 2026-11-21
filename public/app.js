/**
 * Simulation Theory — 2022 Nobel Prize in Physics Laboratory Client
 * Grounded 100% in peer-reviewed quantum physics (Aspect, Clauser, Zeilinger).
 * ZERO MOCKS. Real API calls, exact linear algebra, and authentic laboratory datasets.
 */

// DOM Elements: Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// DOM Elements: Clauser CHSH
const angle_a = document.getElementById('angle_a');
const angle_aPrime = document.getElementById('angle_aPrime');
const angle_b = document.getElementById('angle_b');
const angle_bPrime = document.getElementById('angle_bPrime');

const val_a = document.getElementById('val_a');
const val_aPrime = document.getElementById('val_aPrime');
const val_b = document.getElementById('val_b');
const val_bPrime = document.getElementById('val_bPrime');

const sValueEl = document.getElementById('sValue');
const verdictBadge = document.getElementById('verdictBadge');
const val_Eab = document.getElementById('val_Eab');
const val_EabPrime = document.getElementById('val_EabPrime');
const val_EaPrimeB = document.getElementById('val_EaPrimeB');
const val_EaPrimeBPrime = document.getElementById('val_EaPrimeBPrime');
const significanceText = document.getElementById('significanceText');
const btnOptimalAngles = document.getElementById('btnOptimalAngles');
const btnLhvProof = document.getElementById('btnLhvProof');

// Canvases
const sweepCanvas = document.getElementById('sweepCanvas');
const minkowskiCanvas = document.getElementById('minkowskiCanvas');

// Tab 2 & 3 Elements
const aspectSpecsGrid = document.getElementById('aspectSpecsGrid');
const bsmSelect = document.getElementById('bsmSelect');
const swappingResultBox = document.getElementById('swappingResultBox');
const benchmarksList = document.getElementById('benchmarksList');

// -------------------------------------------------------------------
// 1. Tab Navigation
// -------------------------------------------------------------------
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');

        if (targetTab === 'aspect') {
            drawMinkowskiDiagram();
        } else if (targetTab === 'clauser') {
            drawAngularSweep();
        }
    });
});

// -------------------------------------------------------------------
// 2. Clauser CHSH Bell Test Interaction
// -------------------------------------------------------------------
function updateChshCalculations() {
    const a = parseFloat(angle_a.value);
    const aPrime = parseFloat(angle_aPrime.value);
    const b = parseFloat(angle_b.value);
    const bPrime = parseFloat(angle_bPrime.value);

    val_a.textContent = `${a}°`;
    val_aPrime.textContent = `${aPrime}°`;
    val_b.textContent = `${b}°`;
    val_bPrime.textContent = `${bPrime}°`;

    fetch(`/api/nobel/chsh?a=${a}&aPrime=${aPrime}&b=${b}&bPrime=${bPrime}&mode=photons`)
        .then(res => res.json())
        .then(data => {
            sValueEl.textContent = data.S.toFixed(6);
            val_Eab.textContent = data.correlations.E_ab.toFixed(6);
            val_EabPrime.textContent = data.correlations.E_abPrime.toFixed(6);
            val_EaPrimeB.textContent = data.correlations.E_aPrime_b.toFixed(6);
            val_EaPrimeBPrime.textContent = data.correlations.E_aPrime_bPrime.toFixed(6);

            if (data.violatesLocalRealism) {
                verdictBadge.textContent = "VIOLATES LOCAL REALISM";
                verdictBadge.className = "verdict-badge verdict-violation";
                significanceText.textContent = `VIOLATION OF LOCAL REALISM: S = ${data.S.toFixed(4)} exceeds the classical Bell bound of 2.000 by +${data.violationPercentage}%. Nature cannot be explained by local hidden variables.`;
            } else {
                verdictBadge.textContent = "WITHIN CLASSICAL BOUND";
                verdictBadge.className = "verdict-badge verdict-compliant";
                significanceText.textContent = `COMPLIANT WITH LOCAL REALISM: For these specific analyzer settings, S = ${data.S.toFixed(4)} <= 2.0. Shift angles towards Clauser's optimal (0°, 45°, 22.5°, 67.5°) to observe maximal quantum violation.`;
            }

            drawAngularSweep(b);
        })
        .catch(err => console.error("CHSH fetch error:", err));
}

[angle_a, angle_aPrime, angle_b, angle_bPrime].forEach(slider => {
    slider.addEventListener('input', updateChshCalculations);
});

btnOptimalAngles.addEventListener('click', () => {
    angle_a.value = 0;
    angle_aPrime.value = 45;
    angle_b.value = 22.5;
    angle_bPrime.value = 67.5;
    updateChshCalculations();
});

btnLhvProof.addEventListener('click', () => {
    fetch('/api/nobel/chsh/lhv-proof')
        .then(res => res.json())
        .then(data => {
            alert(`John Clauser Local Hidden Variable (LHV) Analytical Proof:\n\nTested all ${data.totalRealizationsTested} possible deterministic assignments:\nMaximum Value: ${data.universalMaximum}\nMinimum Value: ${data.universalMinimum}\n\nProof: ${data.mathematicalProof}`);
        });
});

// -------------------------------------------------------------------
// 3. Angular Sweep Canvas Visualizer
// -------------------------------------------------------------------
function drawAngularSweep(currentB = 22.5) {
    if (!sweepCanvas) return;
    const ctx = sweepCanvas.getContext('2d');
    const W = sweepCanvas.width;
    const H = sweepCanvas.height;

    ctx.clearRect(0, 0, W, H);

    // Padding & Plot dimensions
    const padX = 60;
    const padY = 40;
    const plotW = W - padX - 30;
    const plotH = H - padY - 40;

    // Grid Background
    ctx.strokeStyle = '#1e2638';
    ctx.lineWidth = 1;

    // Horizontal grid & labels (S from 0 to 3.0)
    for (let s = 0; s <= 3.0; s += 0.5) {
        const y = H - padY - (s / 3.0) * plotH;
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(padX + plotW, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '11px JetBrains Mono';
        ctx.textAlign = 'right';
        ctx.fillText(`S=${s.toFixed(1)}`, padX - 8, y + 4);
    }

    // Classical Limit Line at S = 2.0 (Red Dashed)
    const yClassical = H - padY - (2.0 / 3.0) * plotH;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(padX, yClassical);
    ctx.lineTo(padX + plotW, yClassical);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Classical Local Realism Limit (S = 2.0)', padX + 10, yClassical - 8);

    // Tsirelson Bound Line at S = 2*sqrt(2) ~ 2.828 (Gold Dashed)
    const yTsirelson = H - padY - ((2.0 * Math.SQRT2) / 3.0) * plotH;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padX, yTsirelson);
    ctx.lineTo(padX + plotW, yTsirelson);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Tsirelson Quantum Bound (2√2 ≈ 2.828)', padX + 10, yTsirelson - 6);

    // Plot Quantum S(theta) Curve: a=0, a'=45, b'=67.5, b swept from 0 to 180 deg
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const a = 0;
    const aPrime = 45;
    const bPrime = 67.5;

    for (let deg = 0; deg <= 180; deg += 1) {
        const radA = (a * Math.PI) / 180;
        const radAPrime = (aPrime * Math.PI) / 180;
        const radB = (deg * Math.PI) / 180;
        const radBPrime = (bPrime * Math.PI) / 180;

        const E_ab = -Math.cos(2 * (radA - radB));
        const E_abPrime = -Math.cos(2 * (radA - radBPrime));
        const E_aPrime_b = -Math.cos(2 * (radAPrime - radB));
        const E_aPrime_bPrime = -Math.cos(2 * (radAPrime - radBPrime));

        const S = Math.abs(E_ab - E_abPrime + E_aPrime_b + E_aPrime_bPrime);
        const px = padX + (deg / 180) * plotW;
        const py = H - padY - (S / 3.0) * plotH;

        if (deg === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mark current selected B angle
    const curX = padX + (currentB / 180) * plotW;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(curX, padY);
    ctx.lineTo(curX, H - padY);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`Current b = ${currentB}°`, curX, padY - 10);

    // X Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px JetBrains Mono';
    for (let deg = 0; deg <= 180; deg += 45) {
        const px = padX + (deg / 180) * plotW;
        ctx.fillText(`${deg}°`, px, H - padY + 20);
    }
}

// -------------------------------------------------------------------
// 4. Alain Aspect Relativistic Minkowski Diagram
// -------------------------------------------------------------------
function drawMinkowskiDiagram() {
    if (!minkowskiCanvas) return;
    const ctx = minkowskiCanvas.getContext('2d');
    const W = minkowskiCanvas.width;
    const H = minkowskiCanvas.height;

    ctx.clearRect(0, 0, W, H);

    const midX = W / 2;
    const originY = H - 50;

    // Draw Light Cone (45 degree lines representing c)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.beginPath();
    ctx.moveTo(midX, originY);
    ctx.lineTo(midX - 250, originY - 250);
    ctx.lineTo(midX + 250, originY - 250);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(midX - 250, originY - 250);
    ctx.lineTo(midX, originY);
    ctx.lineTo(midX + 250, originY - 250);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#2f3b54';
    ctx.lineWidth = 1;
    // Space axis X
    ctx.beginPath();
    ctx.moveTo(40, originY);
    ctx.lineTo(W - 40, originY);
    ctx.stroke();

    // Time axis ct
    ctx.beginPath();
    ctx.moveTo(midX, originY + 20);
    ctx.lineTo(midX, 20);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Space (X) [Distance L = 12m]', W - 120, originY - 8);
    ctx.fillText('Time (ct)', midX, 15);

    // Calcium Source Event (Origin)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(midX, originY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Photon Emission Source (Calcium-40)', midX, originY + 22);

    // Stations Alice (-L/2 = -6m) and Bob (+L/2 = +6m)
    const aliceX = midX - 200;
    const bobX = midX + 200;
    const detectionY = originY - 180; // 20 ns flight time

    // Photon Worldlines (Speed of Light)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX, originY);
    ctx.lineTo(aliceX, detectionY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(midX, originY);
    ctx.lineTo(bobX, detectionY);
    ctx.stroke();

    // Alice Detection Point
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(aliceX, detectionY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Alice Detector (Angle a)', aliceX, detectionY - 12);

    // Bob Detection Point
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(bobX, detectionY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Bob Detector (Angle b)', bobX, detectionY - 12);

    // Space-like Connection line between Alice and Bob detections (Red Dashed)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(aliceX, detectionY);
    ctx.lineTo(bobX, detectionY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = '12px JetBrains Mono';
    ctx.fillText('Δs² = c²Δt² - Δx² < 0 (SPACE-LIKE SEPARATED)', midX, detectionY - 8);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter';
    ctx.fillText('No signal at speed of light c could connect these measurements', midX, detectionY + 18);
}

function loadAspectData() {
    fetch('/api/nobel/aspect')
        .then(res => res.json())
        .then(data => {
            const exp = data.aspect1982;
            aspectSpecsGrid.innerHTML = `
                <div class="spec-card">
                    <div class="spec-title">Station Separation</div>
                    <div class="spec-val">${exp.setupParameters.totalSeparation_m} m</div>
                    <div class="spec-desc">Total distance between Alice and Bob analyzers</div>
                </div>
                <div class="spec-card">
                    <div class="spec-title">Photon Flight Time</div>
                    <div class="spec-val">${exp.setupParameters.photonFlightTimeToDetector_ns} ns</div>
                    <div class="spec-desc">Time taken for photon to reach detector from central source</div>
                </div>
                <div class="spec-card">
                    <div class="spec-title">Switching Cycle</div>
                    <div class="spec-val">${exp.setupParameters.analyzerSwitchingTime_ns} ns</div>
                    <div class="spec-desc">50 MHz acoustic-optical switcher operates faster than flight time</div>
                </div>
                <div class="spec-card">
                    <div class="spec-title">Relativistic Verdict</div>
                    <div class="spec-val text-emerald">SPACE-LIKE</div>
                    <div class="spec-desc">Locality Loophole Strictly Closed under Einstein Special Relativity</div>
                </div>
            `;
        });
}

// -------------------------------------------------------------------
// 5. Anton Zeilinger Swapping Interaction
// -------------------------------------------------------------------
function updateSwapping() {
    const outcome = bsmSelect.value;
    fetch(`/api/nobel/zeilinger?outcome=${outcome}`)
        .then(res => res.json())
        .then(data => {
            const sw = data.swapping;
            swappingResultBox.innerHTML = `
                <p><strong>Resulting State of Photons (1, 4):</strong> <span class="text-emerald" style="font-family: var(--font-mono); font-size: 1.1rem;">${sw.swappedState.resultingState}</span></p>
                <p class="mt-3"><strong>Fidelity:</strong> ${sw.swappedState.stateFidelity.toFixed(2)} (Maximally Entangled)</p>
                <p class="mt-3" style="color: var(--text-secondary);">${sw.swappedState.consequence}</p>
                <div class="significance-box mt-3">${sw.informationalMeaning}</div>
            `;
        });
}

if (bsmSelect) {
    bsmSelect.addEventListener('change', updateSwapping);
}

// -------------------------------------------------------------------
// 6. Authentic Laboratory Benchmarks Loader
// -------------------------------------------------------------------
function loadBenchmarks() {
    fetch('/api/nobel/benchmarks')
        .then(res => res.json())
        .then(benchmarks => {
            benchmarksList.innerHTML = benchmarks.map(b => `
                <div class="bench-card">
                    <div>
                        <div class="bench-citation">${b.citation} • DOI: ${b.doi}</div>
                        <div class="bench-title">${b.title}</div>
                        <div class="bench-authors">${b.leadScientist} (${b.institution})</div>
                        <div class="bench-details">
                            <strong>System:</strong> ${b.physicalSystem}<br>
                            <strong>Observed Value:</strong> S = ${b.experimentalCHSH_S || b.experimentalValue} ± ${b.uncertainty} (Classical Bound: ${b.classicalBellBound})
                        </div>
                    </div>
                    <div class="bench-stats">
                        <div class="bench-sigma">${b.standardDeviations_sigma}σ</div>
                        <div class="bench-sigma-label">Violation Significance</div>
                        <div style="font-size: 0.72rem; color: var(--accent-cyan); margin-top: 0.3rem;">p-value: ${b.pValue}</div>
                    </div>
                </div>
            `).join('');
        });
}

// -------------------------------------------------------------------
// 7. About & GitHub Copy Handlers
// -------------------------------------------------------------------
function setupCopyRemoteHandler() {
    const copyRemoteBtn = document.getElementById('copyRemoteBtn');
    const remoteCmd = document.getElementById('remoteCmd');
    if (copyRemoteBtn && remoteCmd) {
        copyRemoteBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(remoteCmd.textContent.trim()).then(() => {
                const orig = copyRemoteBtn.textContent;
                copyRemoteBtn.textContent = 'Copied!';
                copyRemoteBtn.style.borderColor = 'var(--accent-emerald)';
                copyRemoteBtn.style.color = 'var(--accent-emerald)';
                setTimeout(() => {
                    copyRemoteBtn.textContent = orig;
                    copyRemoteBtn.style.borderColor = '';
                    copyRemoteBtn.style.color = '';
                }, 2000);
            }).catch(err => console.error("Clipboard copy error:", err));
        });
    }

    const copyContractBtn = document.getElementById('copyContractCodeBtn');
    if (copyContractBtn) {
        copyContractBtn.addEventListener('click', () => {
            fetch('/api/contract/source')
                .then(res => res.json())
                .then(data => {
                    navigator.clipboard.writeText(data.sourceCode).then(() => {
                        const orig = copyContractBtn.textContent;
                        copyContractBtn.textContent = 'Copied to Clipboard!';
                        copyContractBtn.style.borderColor = 'var(--accent-emerald)';
                        copyContractBtn.style.color = 'var(--accent-emerald)';
                        setTimeout(() => {
                            copyContractBtn.textContent = orig;
                            copyContractBtn.style.borderColor = '';
                            copyContractBtn.style.color = '';
                        }, 2000);
                    });
                })
                .catch(err => console.error("Error copying contract code:", err));
        });
    }
}

// -------------------------------------------------------------------
// 8. On-Chain Smart Contract Status
// -------------------------------------------------------------------
function loadContractStatus() {
    const onchainStatus = document.getElementById('onchainStatus');
    const contractAddressRow = document.getElementById('contractAddressRow');
    const contractAddressLink = document.getElementById('contractAddressLink');
    const deployerWalletRow = document.getElementById('deployerWalletRow');
    const deployerWalletSpan = document.getElementById('deployerWalletSpan');

    if (!onchainStatus) return;

    fetch('/api/contract/status')
        .then(res => res.json())
        .then(data => {
            if (data.deployed) {
                onchainStatus.textContent = 'DEPLOYED ON ETHEREUM (Sepolia)';
                onchainStatus.className = 'badge badge-emerald';
                if (contractAddressRow && contractAddressLink) {
                    contractAddressRow.style.display = 'flex';
                    contractAddressLink.textContent = data.contractAddress;
                    contractAddressLink.href = data.etherscanUrl || `https://sepolia.etherscan.io/address/${data.contractAddress}`;
                }
            } else {
                onchainStatus.textContent = 'Ready to Deploy (Run .\\deploy_ethereum.ps1)';
                onchainStatus.className = 'badge badge-gold';
                if (data.deployerWallet && deployerWalletRow && deployerWalletSpan) {
                    deployerWalletRow.style.display = 'flex';
                    deployerWalletSpan.textContent = data.deployerWallet;
                }
            }
        })
        .catch(err => console.error("Error loading contract status:", err));
}

// -------------------------------------------------------------------
// Initial Load
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    updateChshCalculations();
    loadAspectData();
    updateSwapping();
    loadBenchmarks();
    setupCopyRemoteHandler();
    loadContractStatus();
});
