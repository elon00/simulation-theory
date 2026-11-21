/**
 * Simulation Theory — 2022 Nobel Prize in Physics Scientific Server
 * Built on native Node.js (http, fs, path, url)
 * ZERO MOCKS. Pure Scientific Computation & Historic Benchmark Delivery.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ClauserChshEngine = require('./core/clauser_chsh');
const AspectLocalityEngine = require('./core/aspect_locality');
const ZeilingerEntanglementEngine = require('./core/zeilinger_entanglement');
const RealExperimentalBenchmarks = require('./core/real_experimental_benchmarks');
const SimulationTheoryAnalysis = require('./core/simulation_theory_analysis');

const clauserEngine = new ClauserChshEngine();
const aspectEngine = new AspectLocalityEngine();
const zeilingerEngine = new ZeilingerEntanglementEngine();
const benchmarks = new RealExperimentalBenchmarks();
const simAnalysis = new SimulationTheoryAnalysis();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
    const pathname = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // ---------------------------------------------------------
    // Scientific API Endpoints (2022 Nobel Prize in Physics)
    // ---------------------------------------------------------

    // 1. CHSH Inequality Evaluation
    if (pathname === '/api/nobel/chsh') {
        const a = parseFloat(query.a !== undefined ? query.a : 0);
        const aPrime = parseFloat(query.aPrime !== undefined ? query.aPrime : 45);
        const b = parseFloat(query.b !== undefined ? query.b : 22.5);
        const bPrime = parseFloat(query.bPrime !== undefined ? query.bPrime : 67.5);
        const mode = query.mode || 'photons';

        const result = clauserEngine.evaluateCHSH(a, aPrime, b, bPrime, mode);
        return sendJSON(res, 200, result);
    }

    // 2. CHSH Angular Sweep for Real Plotting
    if (pathname === '/api/nobel/chsh/sweep') {
        const step = parseFloat(query.step || 2.0);
        const sweepData = clauserEngine.generateAngularSweep(step);
        return sendJSON(res, 200, sweepData);
    }

    // 3. Clauser LHV Analytical Proof
    if (pathname === '/api/nobel/chsh/lhv-proof') {
        const proof = clauserEngine.verifyLocalHiddenVariableBound();
        return sendJSON(res, 200, proof);
    }

    // 4. Alain Aspect Locality Loophole & Relativistic Spacetime Engine
    if (pathname === '/api/nobel/aspect') {
        const aspect1982 = aspectEngine.evaluateAspect1982Experiment();
        const zeilinger1998 = aspectEngine.evaluateZeilinger1998Experiment();
        return sendJSON(res, 200, { aspect1982, zeilinger1998 });
    }

    // 5. Anton Zeilinger Entanglement Swapping & GHZ State Engine
    if (pathname === '/api/nobel/zeilinger') {
        const outcome = query.outcome || 'psiMinus';
        const swapping = zeilingerEngine.simulateEntanglementSwapping(outcome);
        const ghz = zeilingerEngine.evaluateGHZTheorem();
        return sendJSON(res, 200, { swapping, ghz });
    }

    // 6. Real Peer-Reviewed Experimental Benchmarks
    if (pathname === '/api/nobel/benchmarks') {
        const allExperiments = benchmarks.getAllExperiments();
        return sendJSON(res, 200, allExperiments);
    }

    // 7. Simulation Theory & Informational Reality Analysis
    if (pathname === '/api/nobel/simulation-analysis') {
        const classicalSim = simAnalysis.evaluateClassicalSimulationHypothesis();
        const informational = simAnalysis.evaluateInformationalReality();
        return sendJSON(res, 200, { classicalSim, informational });
    }

    // ---------------------------------------------------------
    // Static Frontend File Delivery
    // ---------------------------------------------------------
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        return res.end('Access denied');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`⚛️ Simulation Theory scientific server active on http://localhost:${PORT}`);
    });
}

module.exports = server;
