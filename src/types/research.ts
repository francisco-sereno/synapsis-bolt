// Research workflow types and interfaces

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  methodology: ResearchMethodology;
  design: ResearchDesign;
  phase: ResearchPhase;
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
}

export type ResearchMethodology = 
  | 'quantitative'
  | 'qualitative'
  | 'mixed_methods'
  | 'netnography'
  | 'participatory_action'
  | 'digital_humanities'
  | 'arts_based'
  | 'neuroscientific'
  | 'autoethnography'
  | 'ai_research'
  | 'q_methodology';

export type ResearchPhase = 
  | 'planificacion'
  | 'activo'
  | 'completado'
  | 'pausado'
  | 'design'
  | 'data_collection'
  | 'analysis'
  | 'interpretation'
  | 'reporting';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  permissions: Permission[];
  joinedAt: Date;
  lastActive: Date;
}

export type CollaboratorRole = 
  | 'principal_investigator'
  | 'co_investigator'
  | 'research_assistant'
  | 'data_analyst'
  | 'reviewer'
  | 'viewer';

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface ProjectSettings {
  privacy: 'private' | 'institutional' | 'public';
  dataRetention: number; // years
  autoBackup: boolean;
  aiAssistance: boolean;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: {
    analysisComplete: boolean;
    collaboratorActivity: boolean;
    reportGenerated: boolean;
  };
  push: {
    analysisComplete: boolean;
    collaboratorActivity: boolean;
    reportGenerated: boolean;
  };
}

// Methodology types
export interface MethodologyData {
  problem: string;
  objectives: string[];
  questions: string[];
  hypotheses: string[];
  variables: Variable[];
  design: ResearchDesign;
}

export interface Variable {
  name: string;
  type: 'independent' | 'dependent' | 'control' | 'moderator' | 'mediator';
  dataType: 'categorical' | 'ordinal' | 'interval' | 'ratio';
  operationalDefinition: string;
}

export interface ResearchDesign {
  type: QuantitativeDesign | QualitativeDesign | MixedMethodsDesign;
  approach: 'quantitative' | 'qualitative' | 'mixed';
  temporality: 'cross_sectional' | 'longitudinal';
  setting: 'laboratory' | 'field' | 'online';
}

export type QuantitativeDesign = 
  | 'experimental_pure'
  | 'experimental_quasi'
  | 'experimental_pre'
  | 'non_experimental_descriptive'
  | 'non_experimental_correlational'
  | 'non_experimental_transversal'
  | 'non_experimental_longitudinal';

export type QualitativeDesign = 
  | 'narrative'
  | 'phenomenological'
  | 'grounded_theory'
  | 'ethnographic'
  | 'case_study';

export type MixedMethodsDesign = 
  | 'convergent_parallel'
  | 'ditriac'
  | 'exploratory_sequential'
  | 'explanatory_sequential'
  | 'embedded';

export interface MethodologyInfo {
  id: ResearchMethodology;
  name: string;
  description: string;
  category: 'fundamental' | 'emergent';
  icon: string;
  designs: Array<{
    id: string;
    name: string;
    description: string;
    characteristics: string[];
  }>;
}
// Sample types
export interface SampleData {
  populationSize?: number;
  sampleSize: number;
  samplingMethod: SamplingMethod;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  demographics: DemographicData;
}

export type SamplingMethod = 
  | 'simple_random'
  | 'systematic'
  | 'stratified'
  | 'cluster'
  | 'convenience'
  | 'purposive'
  | 'snowball';

export interface DemographicData {
  ageRange: { min: number; max: number };
  genderDistribution: { [key: string]: number };
  educationLevel: { [key: string]: number };
  other: { [key: string]: Json };
}

// Instrument types
export interface Instrument {
  id: string;
  name: string;
  type: InstrumentType;
  questions: Question[];
  validation: ValidationData;
  metadata: InstrumentMetadata;
}

export type InstrumentType = 
  | 'survey'
  | 'interview_guide'
  | 'observation_checklist'
  | 'scale'
  | 'test';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  validation?: QuestionValidation;
}

export type QuestionType = 
  | 'multiple_choice'
  | 'single_choice'
  | 'likert'
  | 'semantic_differential'
  | 'open_ended'
  | 'yes_no'
  | 'rating'
  | 'ranking';

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  range?: { min: number; max: number };
}

export interface ValidationData {
  contentValidity: {
    cvi: number;
    expertRatings: ExpertRating[];
  };
  reliability: {
    cronbachAlpha?: number;
    testRetest?: number;
    interRater?: number;
  };
  construct: {
    factorAnalysis?: FactorAnalysisResult;
    convergentValidity?: number;
    discriminantValidity?: number;
  };
}

export interface ExpertRating {
  expertId: string;
  ratings: number[];
  comments: string;
  overall: number;
}

export interface FactorAnalysisResult {
  factors: Factor[];
  variance: {
    explained: number;
    cumulative: number;
  };
  adequacy: {
    kmo: number;
    bartlett: number;
  };
}

export interface Factor {
  name: string;
  eigenvalue: number;
  variance: number;
  loadings: { [questionId: string]: number };
}

export interface InstrumentMetadata {
  estimatedTime: number; // minutes
  language: string;
  version: string;
  lastModified: Date;
  status: 'draft' | 'validated' | 'published' | 'archived';
}

// Data collection types
export interface DataCollection {
  id: string;
  instrumentId: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  responses: Response[];
  settings: CollectionSettings;
  analytics: CollectionAnalytics;
}

export interface Response {
  id: string;
  participantId: string;
  answers: { [questionId: string]: Json };
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  startTime: Date;
  endTime: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  completionRate: number;
}

export interface CollectionSettings {
  anonymous: boolean;
  allowMultiple: boolean;
  requireAuth: boolean;
  timeLimit?: number;
  randomizeQuestions: boolean;
  showProgress: boolean;
}

export interface CollectionAnalytics {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  dropoffPoints: { [questionId: string]: number };
  demographics: DemographicData;
}

// Analysis types
export interface AnalysisResult {
  id: string;
  type: AnalysisType;
  datasetId: string;
  parameters: AnalysisParameters;
  results: Json;
  interpretation: string;
  createdAt: Date;
  createdBy: string;
}

export type AnalysisType = 
  | 'descriptive'
  | 'correlation'
  | 't_test'
  | 'anova'
  | 'regression'
  | 'factor_analysis'
  | 'thematic_analysis'
  | 'content_analysis'
  | 'triangulation';

export interface AnalysisParameters {
  variables: string[];
  method?: string;
  significance?: number;
  options?: { [key: string]: Json };
}

// Triangulation types
export interface TriangulationData {
  sources: DataSource[];
  method: TriangulationMethod;
  results: TriangulationResults;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'quantitative' | 'qualitative' | 'mixed';
  data: Json;
  quality: number;
  weight: number;
}

export type TriangulationMethod = 
  | 'methodological'
  | 'data'
  | 'investigator'
  | 'theoretical';

export interface TriangulationResults {
  convergences: Convergence[];
  divergences: Divergence[];
  metaInferences: string[];
  confidence: number;
}

export interface Convergence {
  theme: string;
  sources: string[];
  strength: 'high' | 'medium' | 'low';
  evidence: string;
}

export interface Divergence {
  theme: string;
  sources: string[];
  explanation: string;
  resolution?: string;
}

// Report types
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  template: ReportTemplate;
  sections: ReportSection[];
  metadata: ReportMetadata;
  status: 'draft' | 'review' | 'published';
}

export type ReportType = 
  | 'executive_summary'
  | 'technical_report'
  | 'academic_paper'
  | 'presentation'
  | 'dashboard';

export type ReportTemplate = 
  | 'apa'
  | 'ieee'
  | 'harvard'
  | 'custom';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'table' | 'chart' | 'image';
  order: number;
}

export interface ReportMetadata {
  authors: string[];
  keywords: string[];
  abstract: string;
  wordCount: number;
  pageCount: number;
  createdAt: Date;
  lastModified: Date;
}

// AI Assistant types
export interface AIRequest {
  id: string;
  type: AIRequestType;
  input: Json;
  context?: Json;
  userId: string;
  timestamp: Date;
}

export type AIRequestType = 
  | 'methodology_review'
  | 'instrument_validation'
  | 'data_analysis'
  | 'text_summarization'
  | 'triangulation'
  | 'report_generation'
  | 'peer_review';

export interface AIResponse {
  id: string;
  requestId: string;
  result: Json;
  confidence: number;
  processingTime: number;
  timestamp: Date;
}

// Notification types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
}

export type NotificationType = 
  | 'analysis_complete'
  | 'collaboration_invite'
  | 'data_collection_milestone'
  | 'validation_required'
  | 'report_ready'
  | 'system_update';

// Search types
export interface SearchQuery {
  query: string;
  filters: SearchFilters;
  sort: SearchSort;
  pagination: SearchPagination;
}

export interface SearchFilters {
  dateRange?: { start: Date; end: Date };
  type?: string[];
  module?: string[];
  author?: string[];
  tags?: string[];
}

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface SearchResult {
  id: string;
  title: string;
  type: string;
  module: string;
  content: string;
  relevance: number;
  metadata: Json;
}

// Recommendation types
export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  module: string;
  dismissed: boolean;
  createdAt: Date;
}

export type RecommendationType = 
  | 'optimization'
  | 'warning'
  | 'opportunity'
  | 'insight';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface AnalysisResultToSummarize {
  type: string;
  results: unknown;
  significance: number;
}

export interface InstrumentToTriangulate {
  name: string;
  type: 'quantitative' | 'qualitative';
  results: unknown;
  construct: string;
}

export interface SourceToTriangulate {
  name: string;
  type: 'primary' | 'secondary';
  data: unknown;
  credibility: number;
}

export interface ReportSectionData {
  name: string;
  content: unknown;
  type: 'analysis' | 'findings' | 'methodology' | 'conclusions';
}