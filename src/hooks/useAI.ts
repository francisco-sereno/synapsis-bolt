import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';

// Custom hook for AI service integration
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAIFunction = useCallback(async <T>(
    aiFunction: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiFunction();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Methodology functions
  const reviewMethodology = useCallback(async (data: {
    problem: string;
    questions: string;
    objectives: string;
    hypotheses?: string;
  }) => {
    return executeAIFunction(() => aiService.methodologicalAssistant(data));
  }, [executeAIFunction]);

  const calculateSampleSize = useCallback((params: {
    populationSize?: number;
    confidenceLevel: number;
    marginError: number;
    expectedProportion?: number;
  }) => {
    return aiService.sampleSizeCalculator(params);
  }, []);

  // Instrument functions
  const generateInstrumentFromDocument = useCallback(async (document: File) => {
    return executeAIFunction(() => aiService.generateTemplateFromDocument(document));
  }, [executeAIFunction]);

  const generateInstrumentFromCode = useCallback(async (code: string) => {
    return executeAIFunction(() => aiService.generateTemplateFromCode(code));
  }, [executeAIFunction]);

  const validateInstrument = useCallback(async (instrument: {
    questions: Array<{
      text: string;
      type: string;
      options?: string[];
    }>;
  }) => {
    return executeAIFunction(() => aiService.validateInstrument(instrument));
  }, [executeAIFunction]);

  const basicValidateInstrument = useCallback(async (instrument: {
    questions: Array<{
      text: string;
      type: string;
      options?: string[];
    }>;
  }) => {
    return executeAIFunction(() => aiService.basicInstrumentValidation(instrument));
  }, [executeAIFunction]);

  const analyzeExpertJudgment = useCallback((expertRatings: Array<{
    expertId: string;
    itemRatings: Array<{
      itemId: string;
      relevance: number;
      clarity: number;
      coherence: number;
    }>;
    overallComments: string;
  }>) => {
    return aiService.analyzeExpertJudgment(expertRatings);
  }, []);

  const calculateCVI = useCallback((expertRatings: Array<{
    expertId: string;
    itemRatings: number[];
  }>) => {
    return aiService.contentValidityIndex(expertRatings);
  }, []);

  // Data collection functions
  const transcribeAudio = useCallback(async (audioFile: File) => {
    return executeAIFunction(() => aiService.transcribeAudio(audioFile));
  }, [executeAIFunction]);

  const extractTextFromDocument = useCallback(async (file: File) => {
    return executeAIFunction(() => aiService.extractTextFromDocument(file));
  }, [executeAIFunction]);

  // Analysis functions
  const performDescriptiveAnalysis = useCallback(async (data: number[]) => {
    return executeAIFunction(() => aiService.descriptiveAnalysis(data));
  }, [executeAIFunction]);

  const performCorrelationAnalysis = useCallback(async (variables: Array<{
    name: string;
    data: number[];
  }>) => {
    return executeAIFunction(() => aiService.correlationAnalysis(variables));
  }, [executeAIFunction]);

  const performTTest = useCallback(async (group1: number[], group2: number[]) => {
    return executeAIFunction(() => aiService.tTest(group1, group2));
  }, [executeAIFunction]);

  const calculateCronbachAlpha = useCallback((items: number[][]) => {
    return aiService.cronbachAlpha(items);
  }, []);

  const identifyTrends = useCallback(async (data: Array<{
    timestamp: string;
    values: Record<string, number>;
  }>) => {
    return executeAIFunction(() => aiService.identifyTrends(data));
  }, [executeAIFunction]);

  // Interpretation functions
  const summarizeText = useCallback(async (text: string, maxLength?: number) => {
    return executeAIFunction(() => aiService.summarizeText(text, maxLength));
  }, [executeAIFunction]);

  const summarizeFindings = useCallback(async (analysisResults: Array<{
    type: string;
    results: any;
    significance: number;
  }>) => {
    return executeAIFunction(() => aiService.summarizeFindings(analysisResults));
  }, [executeAIFunction]);

  const triangulateFindings = useCallback(async (sources: Array<{
    type: 'quantitative' | 'qualitative' | 'mixed';
    findings: string[];
    confidence: number;
  }>) => {
    return executeAIFunction(() => aiService.triangulateFindings(sources));
  }, [executeAIFunction]);

  const triangulateInstruments = useCallback(async (instruments: Array<{
    name: string;
    type: 'quantitative' | 'qualitative';
    results: any;
    construct: string;
  }>) => {
    return executeAIFunction(() => aiService.triangulateInstruments(instruments));
  }, [executeAIFunction]);

  const triangulateSources = useCallback(async (sources: Array<{
    name: string;
    type: 'primary' | 'secondary';
    data: any;
    credibility: number;
  }>) => {
    return executeAIFunction(() => aiService.triangulateSources(sources));
  }, [executeAIFunction]);

  const generateReport = useCallback(async (data: {
    title: string;
    sections: Array<{
      name: string;
      content: any;
      type: 'analysis' | 'findings' | 'methodology' | 'conclusions';
    }>;
    template: 'executive' | 'academic' | 'technical';
  }) => {
    return executeAIFunction(() => aiService.generateReport(data));
  }, [executeAIFunction]);

  const performPeerReview = useCallback(async (manuscript: {
    title: string;
    abstract: string;
    content: string;
    references: string[];
  }) => {
    return executeAIFunction(() => aiService.peerReview(manuscript));
  }, [executeAIFunction]);

  return {
    loading,
    error,
    // Methodology
    reviewMethodology,
    calculateSampleSize,
    // Instruments
    generateInstrumentFromDocument,
    generateInstrumentFromCode,
    validateInstrument,
    basicValidateInstrument,
    analyzeExpertJudgment,
    calculateCVI,
    // Data Collection
    transcribeAudio,
    extractTextFromDocument,
    // Analysis
    performDescriptiveAnalysis,
    performCorrelationAnalysis,
    performTTest,
    calculateCronbachAlpha,
    identifyTrends,
    // Interpretation
    summarizeText,
    summarizeFindings,
    triangulateFindings,
    triangulateInstruments,
    triangulateSources,
    generateReport,
    performPeerReview
  };
};