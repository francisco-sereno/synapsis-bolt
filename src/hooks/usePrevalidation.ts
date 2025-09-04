import { useState, useCallback } from 'react';
import { prevalidationService } from '../services/prevalidationService';

// Custom hook for prevalidation service integration
export const usePrevalidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executePrevalidationFunction = useCallback(async <T>(
    prevalidationFunction: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await prevalidationFunction();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Quantitative instrument prevalidation
  const runCognitiveInterview = useCallback(async (params: {
    instrument: string;
    targetPopulation: string;
    objective: string;
  }) => {
    return executePrevalidationFunction(() => 
      prevalidationService.cognitiveInterviewSimulation(params)
    );
  }, [executePrevalidationFunction]);

  const runTechnicalReview = useCallback(async (params: {
    instrument: string;
    objective: string;
    targetPopulation: string;
  }) => {
    return executePrevalidationFunction(() => 
      prevalidationService.technicalMethodologicalReview(params)
    );
  }, [executePrevalidationFunction]);

  // Qualitative instrument prevalidation
  const runDepthAnalysis = useCallback(async (params: {
    interviewGuide: string;
    phenomenon: string;
    targetPopulation: string;
  }) => {
    return executePrevalidationFunction(() => 
      prevalidationService.depthFluencyAnalysis(params)
    );
  }, [executePrevalidationFunction]);

  const runReflexivityReview = useCallback(async (params: {
    interviewGuide: string;
    researchObjective: string;
  }) => {
    return executePrevalidationFunction(() => 
      prevalidationService.reflexivityBiasReview(params)
    );
  }, [executePrevalidationFunction]);

  const runFieldPilotSimulation = useCallback(async (params: {
    interviewGuide: string;
    studyContext: string;
  }) => {
    return executePrevalidationFunction(() => 
      prevalidationService.fieldPilotSimulation(params)
    );
  }, [executePrevalidationFunction]);

  // Comprehensive validation
  const runExpertPanelSimulation = useCallback(async (params: {
    instrument: string;
    objective: string;
    targetPopulation: string;
  }) => {
    return executePrevalidationFunction(() => 
      prevalidationService.expertPanelSimulation(params)
    );
  }, [executePrevalidationFunction]);

  return {
    loading,
    error,
    // Quantitative prevalidation
    runCognitiveInterview,
    runTechnicalReview,
    // Qualitative prevalidation
    runDepthAnalysis,
    runReflexivityReview,
    runFieldPilotSimulation,
    // Comprehensive validation
    runExpertPanelSimulation
  };
};