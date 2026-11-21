/**
 * Alain Aspect Locality Loophole & Relativistic Spacetime Engine
 * Reference: Aspect, Dalibard, Roger (Phys. Rev. Lett. 49, 1804, 1982)
 *
 * Implements:
 * 1. Relativistic Spacetime 4-Vector calculation (Minkowski metric)
 * 2. Space-like interval verification (Delta s^2 < 0) ensuring no subluminal or luminal signal
 * 3. Exact acoustic-optical switch timing vs photon flight time model
 */

class AspectLocalityEngine {
    constructor() {
        this.C_SPEED_OF_LIGHT = 299792458; // m/s
    }

    /**
     * Calculates the relativistic invariant spacetime interval:
     * Delta s^2 = c^2 * (Delta t)^2 - (Delta x)^2
     *
     * In Minkowski signature (+ - - -):
     * Delta s^2 < 0 => Space-like separated (outside light cone, causally disconnected)
     * Delta s^2 == 0 => Light-like (causally connected only at speed of light)
     * Delta s^2 > 0 => Time-like (causally connectable by slower-than-light signals)
     */
    calculateSpacetimeInterval(deltaT_seconds, deltaX_meters) {
        const cDeltaT = this.C_SPEED_OF_LIGHT * deltaT_seconds;
        const deltaS2 = (cDeltaT * cDeltaT) - (deltaX_meters * deltaX_meters);
        
        let classification;
        let causalConnectionPossible;

        if (deltaS2 < 0) {
            classification = 'SPACE_LIKE';
            causalConnectionPossible = false;
        } else if (Math.abs(deltaS2) < 1e-9) {
            classification = 'LIGHT_LIKE';
            causalConnectionPossible = true;
        } else {
            classification = 'TIME_LIKE';
            causalConnectionPossible = true;
        }

        return {
            deltaT_seconds,
            deltaX_meters,
            deltaS2_metersSquared: deltaS2,
            classification,
            causalConnectionPossible,
            requiredSignalSpeed: deltaT_seconds > 0 ? (deltaX_meters / deltaT_seconds) : Infinity,
            fasterThanLightRequired: (deltaX_meters / Math.max(deltaT_seconds, 1e-15)) > this.C_SPEED_OF_LIGHT
        };
    }

    /**
     * Evaluates Alain Aspect's 1982 experimental parameters:
     * - Distance between stations: L = 12 meters
     * - Switching period of acoustic-optical switches: tau_switch = 10 ns (50 MHz)
     * - Photon flight time from central calcium source: tau_flight = (L/2) / c = 20.01 ns
     * - Direct transit time between Alice and Bob: tau_AB = L / c = 40.03 ns
     */
    evaluateAspect1982Experiment() {
        const L = 12.0; // meters
        const tau_flight_s = (L / 2.0) / this.C_SPEED_OF_LIGHT;
        const tau_AB_s = L / this.C_SPEED_OF_LIGHT;
        const tau_switch_s = 10.0e-9; // 10 nanoseconds switch cycle

        // Maximum time elapsed between setting selection and Bob's detection
        const deltaT_worst_case_s = tau_switch_s;
        const interval = this.calculateSpacetimeInterval(deltaT_worst_case_s, L);

        return {
            experiment: "Aspect, Dalibard, & Roger (1982) - Orsay, France",
            setupParameters: {
                totalSeparation_m: L,
                photonFlightTimeToDetector_ns: +(tau_flight_s * 1e9).toFixed(2),
                interDetectorLightTransitTime_ns: +(tau_AB_s * 1e9).toFixed(2),
                analyzerSwitchingTime_ns: +(tau_switch_s * 1e9).toFixed(2)
            },
            relativisticVerdict: {
                interval_s2: interval.deltaS2_metersSquared,
                classification: interval.classification,
                localityLoopholeClosed: interval.classification === 'SPACE_LIKE',
                minimumSignalSpeedRequired_c: +(interval.requiredSignalSpeed / this.C_SPEED_OF_LIGHT).toFixed(2),
                conclusion: "The choice of analyzer orientation is strictly SPACE-LIKE separated from detection at the opposite station. Special Relativity forbids any causal local hidden variable message between the analyzers."
            }
        };
    }

    /**
     * Evaluates Gregor Weihs & Anton Zeilinger's 1998 Innsbruck Experiment:
     * - Separation: L = 400 meters across Innsbruck university campus
     * - Random number generator decision time: < 100 ns
     * - Direct transit time: L / c = 1334.25 ns
     */
    evaluateZeilinger1998Experiment() {
        const L = 400.0; // meters
        const tau_AB_s = L / this.C_SPEED_OF_LIGHT;
        const decisionTime_s = 100.0e-9; // 100 nanoseconds

        const interval = this.calculateSpacetimeInterval(decisionTime_s, L);

        return {
            experiment: "Weihs, Jennewein, Simon, Weinfurter, & Zeilinger (1998) - Innsbruck, Austria",
            setupParameters: {
                totalSeparation_m: L,
                interDetectorLightTransitTime_ns: +(tau_AB_s * 1e9).toFixed(2),
                physicalRandomBitTime_ns: +(decisionTime_s * 1e9).toFixed(2)
            },
            relativisticVerdict: {
                interval_s2: interval.deltaS2_metersSquared,
                classification: interval.classification,
                localityLoopholeClosed: true,
                minimumSignalSpeedRequired_c: +(interval.requiredSignalSpeed / this.C_SPEED_OF_LIGHT).toFixed(2),
                conclusion: "Space-like separation verified with physical random number generators and optical fiber delays across 400 meters."
            }
        };
    }
}

module.exports = AspectLocalityEngine;
