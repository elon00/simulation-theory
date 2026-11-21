/**
 * Real Experimental Laboratory Benchmarks from Peer-Reviewed Physics Literature
 * 2022 Nobel Prize in Physics (Clauser, Aspect, Zeilinger)
 * 
 * STRICT REALITY ONLY: Contains the actual, authentic experimental data recorded in laboratories.
 * Zero mocks, zero simulated numbers.
 */

class RealExperimentalBenchmarks {
    constructor() {
        this.experiments = [
            {
                id: 'clauser-1972',
                leadScientist: 'John F. Clauser & Stuart J. Freedman',
                year: 1972,
                title: 'Experimental Test of Local Hidden-Variable Theories',
                journal: 'Physical Review Letters',
                citation: 'Phys. Rev. Lett. 28, 938 (1972)',
                doi: '10.1103/PhysRevLett.28.938',
                institution: 'University of California, Berkeley & Lawrence Berkeley Laboratory',
                physicalSystem: 'Atomic Calcium Cascade (4p^2 1S0 -> 4s4p 1P1 -> 4s^2 1S0)',
                wavelengths: '551.3 nm (green) and 422.7 nm (violet)',
                analyzerAngles_deg: [22.5, 67.5],
                classicalBellBound: 0.000,
                experimentalValue: 0.050,
                uncertainty: 0.008,
                standardDeviations_sigma: 6.25,
                pValue: 4.1e-10,
                verdict: 'VIOLATION OF LOCAL REALISM (Historical first laboratory verification)'
            },
            {
                id: 'aspect-1982',
                leadScientist: 'Alain Aspect, Jean Dalibard, & Gérard Roger',
                year: 1982,
                title: 'Experimental Test of Bell\'s Inequalities Using Time-Varying Analyzers',
                journal: 'Physical Review Letters',
                citation: 'Phys. Rev. Lett. 49, 1804 (1982)',
                doi: '10.1103/PhysRevLett.49.1804',
                institution: 'Institut d\'Optique Théorique et Appliquée, Université Paris-Sud, Orsay',
                physicalSystem: 'Entangled Photons from Calcium-40 atomic cascade with 50 MHz acoustic-optical switches',
                distanceSeparation_m: 12.0,
                measuredCorrelations: {
                    E_ab: -0.686,
                    E_abPrime: 0.697,
                    E_aPrime_b: -0.672,
                    E_aPrime_bPrime: -0.642
                },
                classicalBellBound: 2.000,
                experimentalCHSH_S: 2.697,
                uncertainty: 0.015,
                standardDeviations_sigma: 46.47,
                pValue: '< 1e-100',
                verdict: 'VIOLATION OF LOCAL REALISM (Locality loophole closed via space-like switching)'
            },
            {
                id: 'zeilinger-1998',
                leadScientist: 'Gregor Weihs, Thomas Jennewein, Christoph Simon, Harald Weinfurter, & Anton Zeilinger',
                year: 1998,
                title: 'Violation of Bell\'s Inequality under Strict Einstein Locality Conditions',
                journal: 'Physical Review Letters',
                citation: 'Phys. Rev. Lett. 81, 5039 (1998)',
                doi: '10.1103/PhysRevLett.81.5039',
                institution: 'University of Innsbruck, Austria',
                physicalSystem: 'Parametric Down-Conversion (BBO Crystal) with physical random number generators',
                distanceSeparation_m: 400.0,
                opticalFiberLength_m: 500.0,
                classicalBellBound: 2.000,
                experimentalCHSH_S: 2.730,
                uncertainty: 0.020,
                standardDeviations_sigma: 36.5,
                pValue: '< 1e-100',
                verdict: 'VIOLATION OF LOCAL REALISM (Strict Einstein locality across 400 m with independent physical RNGs)'
            },
            {
                id: 'delft-2015',
                leadScientist: 'B. Hensen, Ronald Hanson et al.',
                year: 2015,
                title: 'Loophole-free Bell inequality violation using electron spins separated by 1.3 kilometres',
                journal: 'Nature',
                citation: 'Nature 526, 682–686 (2015)',
                doi: '10.1038/nature15759',
                institution: 'Delft University of Technology & Hanson Lab',
                physicalSystem: 'Entangled electron spins in Nitrogen-Vacancy (NV) diamond centers',
                distanceSeparation_m: 1280.0,
                totalTrials: 245,
                classicalBellBound: 2.000,
                experimentalCHSH_S: 2.420,
                uncertainty: 0.200,
                standardDeviations_sigma: 2.10,
                pValue: 0.039,
                verdict: 'LOOPHOLE-FREE VIOLATION (Simultaneously closed locality and detection loopholes)'
            }
        ];
    }

    getAllExperiments() {
        return this.experiments;
    }

    getExperimentById(id) {
        return this.experiments.find(exp => exp.id === id) || null;
    }

    /**
     * Computes the statistical confidence metrics for any experimental measurement:
     * sigma = (S_experimental - S_classical) / uncertainty
     */
    computeStatisticalConfidence(experimentalS, uncertainty, classicalThreshold = 2.0) {
        const delta = experimentalS - classicalThreshold;
        const sigma = delta / uncertainty;
        // Approximation of two-tailed Gaussian p-value
        const pValue = sigma > 37 ? '< 1e-100' : (2.0 * (1.0 - this._gaussianCdf(sigma)));

        return {
            experimentalS,
            classicalThreshold,
            violationMargin: +delta.toFixed(4),
            standardError: uncertainty,
            zScore_sigma: +sigma.toFixed(2),
            pValue,
            statisticallySignificant: sigma >= 5.0, // 5-sigma gold standard in physics
            confidenceLevel: sigma >= 5.0 ? '> 99.99994%' : `${(this._gaussianCdf(sigma) * 100).toFixed(2)}%`
        };
    }

    _gaussianCdf(x) {
        // Abramowitz & Stegun polynomial approximation of standard normal cumulative distribution
        const t = 1.0 / (1.0 + 0.2316419 * Math.abs(x));
        const d = 0.3989422804014327 * Math.exp(-x * x / 2.0);
        const prob = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
        return x > 0 ? (1.0 - prob) : prob;
    }
}

module.exports = RealExperimentalBenchmarks;
