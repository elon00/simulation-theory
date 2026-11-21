/**
 * John Clauser CHSH Inequality Engine (Nobel Prize in Physics 2022)
 * Reference: Clauser, Horne, Shimony, Holt (Phys. Rev. Lett. 23, 880, 1969)
 * Freedman & Clauser (Phys. Rev. Lett. 28, 938, 1972)
 *
 * Implements:
 * 1. Analytical Local Hidden Variable (LHV) proof showing |S_classical| <= 2
 * 2. Exact Quantum State Hilbert Space calculation yielding Tsirelson's bound S_qm = 2*sqrt(2)
 * 3. Angular sweeps comparing Classical Realism bound vs Quantum Non-Locality
 */

const {
    tensorProduct,
    expectationValue,
    measurementOperator,
    getBellStates
} = require('./quantum_mechanics');

class ClauserChshEngine {
    constructor() {
        this.bellStates = getBellStates();
    }

    /**
     * Exact Quantum Correlation E(a, b) = <Psi- | A(a) (x) B(b) | Psi->
     * For entangled photon pairs with linear polarizers: E(a, b) = -cos(2 * (a - b))
     * In Spin-1/2 formulation with angles in radians: E(a, b) = -cos(a - b)
     */
    computeQuantumCorrelation(angleA_deg, angleB_deg, mode = 'photons') {
        const radA = (angleA_deg * Math.PI) / 180.0;
        const radB = (angleB_deg * Math.PI) / 180.0;

        if (mode === 'photons') {
            // Optical polarization (Clauser / Aspect experimental convention)
            return -Math.cos(2.0 * (radA - radB));
        } else {
            // Spin-1/2 particle convention
            const OpA = measurementOperator(radA);
            const OpB = measurementOperator(radB);
            const jointOperator = tensorProduct(OpA, OpB);
            return expectationValue(this.bellStates.psiMinus, jointOperator);
        }
    }

    /**
     * Evaluates the CHSH parameter S for given analyzer angles (in degrees):
     * S = E(a, b) - E(a, b') + E(a', b) + E(a', b')
     */
    evaluateCHSH(a = 0, aPrime = 45, b = 22.5, bPrime = 67.5, mode = 'photons') {
        const E_ab = this.computeQuantumCorrelation(a, b, mode);
        const E_abPrime = this.computeQuantumCorrelation(a, bPrime, mode);
        const E_aPrime_b = this.computeQuantumCorrelation(aPrime, b, mode);
        const E_aPrime_bPrime = this.computeQuantumCorrelation(aPrime, bPrime, mode);

        // Standard CHSH combination: E(a,b) - E(a,b') + E(a',b) + E(a',b')
        // Absolute value taken according to Bell/Clauser theorem
        const S_raw = E_ab - E_abPrime + E_aPrime_b + E_aPrime_bPrime;
        const S_mag = Math.abs(S_raw);

        const classicalLimit = 2.0;
        const tsirelsonBound = 2.0 * Math.SQRT2; // 2.828427...
        const violatesLocalRealism = S_mag > classicalLimit;
        const violationPercentage = ((S_mag - classicalLimit) / classicalLimit) * 100.0;

        return {
            angles: { a, aPrime, b, bPrime },
            correlations: {
                E_ab: +E_ab.toFixed(6),
                E_abPrime: +E_abPrime.toFixed(6),
                E_aPrime_b: +E_aPrime_b.toFixed(6),
                E_aPrime_bPrime: +E_aPrime_bPrime.toFixed(6)
            },
            S: +S_mag.toFixed(6),
            classicalLimit,
            tsirelsonBound: +tsirelsonBound.toFixed(6),
            violatesLocalRealism,
            violationPercentage: +violationPercentage.toFixed(2),
            theoreticalSignificance: violatesLocalRealism
                ? "VIOLATION OF LOCAL REALISM: Nature cannot be described by local hidden variables (Einstein's local realism is rejected)."
                : "COMPLIANT WITH LOCAL REALISM: Within classical Bell bounds for these specific angles."
        };
    }

    /**
     * Mathematical demonstration of Bell-CHSH Theorem for Local Hidden Variables:
     * For all possible local deterministic response functions A(a) in {-1, +1}
     * and B(b) in {-1, +1}, the quantity:
     * C = A(a) * B(b) - A(a) * B(b') + A(a') * B(b) + A(a') * B(b')
     * ALWAYS satisfies |C| <= 2 for every single hidden variable state lambda.
     */
    verifyLocalHiddenVariableBound() {
        const outcomes = [-1, 1];
        const realizations = [];
        let maxVal = -Infinity;
        let minVal = Infinity;

        // Exhaustive verification of all 2^4 = 16 local deterministic assignments
        for (const A_a of outcomes) {
            for (const A_aPrime of outcomes) {
                for (const B_b of outcomes) {
                    for (const B_bPrime of outcomes) {
                        const C = (A_a * B_b) - (A_a * B_bPrime) + (A_aPrime * B_b) + (A_aPrime * B_bPrime);
                        maxVal = Math.max(maxVal, C);
                        minVal = Math.min(minVal, C);
                        realizations.push({
                            A_a, A_aPrime, B_b, B_bPrime,
                            value: C,
                            identity: `A(a)[B(b)-B(b')] + A(a')[B(b)+B(b')] = ${A_a}*(${B_b - B_bPrime}) + ${A_aPrime}*(${B_b + B_bPrime}) = ${C}`
                        });
                    }
                }
            }
        }

        return {
            totalRealizationsTested: realizations.length,
            universalMaximum: maxVal, // Must be +2
            universalMinimum: minVal, // Must be -2
            classicalBoundStrictlyHolds: maxVal <= 2 && minVal >= -2,
            mathematicalProof: "For any numbers in {-1, 1}, either [B(b)-B(b')]=0 and [B(b)+B(b')]=+/-2, or vice versa. Thus A(a)*[B(b)-B(b')] + A(a')*[B(b)+B(b')] = 0 +/- 2 = +/-2 universally."
        };
    }

    /**
     * Generates angular sweep dataset for scientific visualization:
     * Fixes a=0, a'=45, b'=67.5 and sweeps angle b from 0 to 180 degrees.
     * Computes Classical Linear Bound vs Quantum Sine Curve.
     */
    generateAngularSweep(stepDeg = 2.0) {
        const sweepData = [];
        const a = 0;
        const aPrime = 45;
        const bPrime = 67.5;

        for (let b = 0; b <= 180; b += stepDeg) {
            const evalResult = this.evaluateCHSH(a, aPrime, b, bPrime, 'photons');
            // Classical local hidden variable triangular correlation bound
            // Under LHV, E(theta) must be piecewise linear: |E| >= 1 - 4*theta/pi (normalized)
            const angleDiff = Math.abs(a - b);
            const classicalTriangular = 1.0 - (4.0 * (angleDiff % 90)) / 90.0;

            sweepData.push({
                angleB: b,
                quantumS: evalResult.S,
                classicalLimit: 2.0,
                tsirelsonBound: 2.828427,
                violates: evalResult.violatesLocalRealism,
                quantumCorrelation_ab: evalResult.correlations.E_ab,
                classicalCorrelation_ab: +classicalTriangular.toFixed(4)
            });
        }
        return sweepData;
    }
}

module.exports = ClauserChshEngine;
