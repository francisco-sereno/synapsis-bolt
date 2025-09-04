// Prevalidation Service - Expert prompts for instrument validation
export class PrevalidationService {
  private static instance: PrevalidationService;

  private constructor() {}

  public static getInstance(): PrevalidationService {
    if (!PrevalidationService.instance) {
      PrevalidationService.instance = new PrevalidationService();
    }
    return PrevalidationService.instance;
  }

  // ============================================================================
  // QUANTITATIVE INSTRUMENT PREVALIDATION
  // ============================================================================

  /**
   * Cognitive Interview Simulation (Think Aloud Protocol)
   */
  async cognitiveInterviewSimulation(params: {
    instrument: string;
    targetPopulation: string;
    objective: string;
  }): Promise<{
    responses: Array<{
      questionNumber: number;
      interpretation: string;
      retrievalProcess: string;
      judgmentAndResponse: string;
      difficulties: string;
    }>;
    overallExperience: {
      length: string;
      flow: string;
      interest: string;
      recommendations: string[];
    };
  }> {
    const prompt = `Actúa como un participante que pertenece a la siguiente población objetivo: ${params.targetPopulation}. El objetivo de la encuesta es: ${params.objective}.

Voy a proporcionarte un cuestionario. Por favor, realiza un ejercicio de "Entrevista Cognitiva" simulada, siguiendo el protocolo "Think Aloud" (Pensar en Voz Alta). Para cada pregunta, sigue estos 4 pasos:

1. Interpretación: Explica con tus propias palabras qué entiendes que te está preguntando el ítem.
2. Proceso de Recuperación: Describe qué información buscas en tu memoria o cómo procesas la pregunta para formular una respuesta.
3. Juicio y Respuesta: Indica qué opción elegirías y por qué. ¿Las opciones disponibles reflejan adecuadamente tu experiencia o perspectiva?
4. Identificación de Dificultades: Señala cualquier término confuso, instrucción poco clara, lenguaje incómodo, o si te sientes incapaz de responder.

Finalmente, comenta sobre la experiencia general (longitud, flujo, interés).

Aquí está el instrumento:
${params.instrument}`;

    // Simulate AI processing
    await this.delay(3000);

    return {
      responses: [
        {
          questionNumber: 1,
          interpretation: "Entiendo que me preguntan sobre mi nivel general de satisfacción con el uso de tecnología en mi trabajo docente.",
          retrievalProcess: "Pienso en mis experiencias recientes usando plataformas digitales, aplicaciones educativas y herramientas tecnológicas en clase.",
          judgmentAndResponse: "Elegiría 'Satisfecho' porque aunque he tenido dificultades iniciales, ahora veo beneficios claros. Las opciones cubren bien el rango de experiencias.",
          difficulties: "El término 'tecnología educativa' es muy amplio. ¿Se refiere solo a software o incluye hardware como proyectores?"
        }
      ],
      overallExperience: {
        length: "La encuesta se siente de duración apropiada, no excesivamente larga",
        flow: "Las preguntas fluyen lógicamente, aunque algunas transiciones podrían ser más suaves",
        interest: "Los temas son relevantes para mi experiencia diaria como docente",
        recommendations: [
          "Definir mejor el término 'tecnología educativa' al inicio",
          "Incluir ejemplos específicos en preguntas ambiguas",
          "Considerar agregar una pregunta sobre años de experiencia docente"
        ]
      }
    };
  }

  /**
   * Technical Methodological Review and Psychometrics
   */
  async technicalMethodologicalReview(params: {
    instrument: string;
    objective: string;
    targetPopulation: string;
  }): Promise<{
    generalStrengths: string[];
    detailedReview: Array<{
      itemNumber: number;
      originalText: string;
      problemDetected: string;
      improvementSuggestion: string;
    }>;
    finalRecommendations: string[];
    overallScore: number;
  }> {
    const prompt = `Actúa como un experto en diseño de encuestas y psicometría. Revisa el siguiente instrumento cuantitativo diseñado para ${params.objective} dirigido a ${params.targetPopulation}.

Realiza una revisión metodológica exhaustiva, enfocándote en los siguientes criterios técnicos:

1. Claridad y Precisión: Evalúa si los ítems son concisos y libres de ambigüedad.

2. Identificación de Errores Técnicos y Sesgos:
   - Preguntas Dobles (Double-barreled): ¿Hay preguntas que combinen dos ideas distintas?
   - Preguntas Dirigidas (Leading questions): ¿Hay preguntas que sugieran una respuesta deseada?
   - Redacción en Negativo: ¿Se abusa de términos negativos que complican la comprensión?
   - Deseabilidad Social: ¿Hay ítems sensibles que probablemente generen respuestas socialmente aceptables?

3. Escalas de Respuesta: ¿Son apropiadas las escalas? ¿Son las opciones mutuamente excluyentes y exhaustivas?

4. Estructura y Flujo: Evalúa la organización lógica y la claridad de las instrucciones.

Aquí está el instrumento:
${params.instrument}`;

    await this.delay(4000);

    return {
      generalStrengths: [
        "El instrumento aborda de manera integral los aspectos clave del constructo",
        "Las instrucciones son claras y específicas",
        "La estructura lógica facilita la comprensión del participante"
      ],
      detailedReview: [
        {
          itemNumber: 3,
          originalText: "¿Está satisfecho con la capacitación y el soporte técnico recibido?",
          problemDetected: "Pregunta doble (Double-barreled)",
          improvementSuggestion: "Dividir en dos preguntas: una sobre capacitación y otra sobre soporte técnico"
        },
        {
          itemNumber: 7,
          originalText: "¿No considera que la tecnología complica innecesariamente su trabajo?",
          problemDetected: "Redacción en negativo y pregunta dirigida",
          improvementSuggestion: "¿Cómo describiría el impacto de la tecnología en la complejidad de su trabajo?"
        }
      ],
      finalRecommendations: [
        "Incluir preguntas de validación cruzada para detectar respuestas inconsistentes",
        "Balancear ítems positivos y negativos para evitar sesgo de aquiescencia",
        "Realizar prueba piloto con 20-30 participantes antes de la aplicación final"
      ],
      overallScore: 7.8
    };
  }

  // ============================================================================
  // QUALITATIVE INSTRUMENT PREVALIDATION
  // ============================================================================

  /**
   * Depth, Fluency and Openness Analysis
   */
  async depthFluencyAnalysis(params: {
    interviewGuide: string;
    phenomenon: string;
    targetPopulation: string;
  }): Promise<{
    depthPotential: {
      score: number;
      analysis: string;
      suggestions: string[];
    };
    opennessNeutrality: {
      score: number;
      closedQuestions: Array<{
        original: string;
        reformulated: string;
      }>;
    };
    flowTransitions: {
      score: number;
      feedback: string;
      improvements: string[];
    };
    probeQuality: {
      score: number;
      existingProbes: string[];
      suggestedProbes: string[];
    };
  }> {
    const prompt = `Actúa como un experto en metodología cualitativa. Analiza la siguiente guía de entrevista semiestructurada diseñada para explorar ${params.phenomenon} con ${params.targetPopulation}.

Evalúa la guía basándote en los siguientes criterios:

1. Potencial de Profundidad (Elicitación): ¿Las preguntas principales y las sondas (probes) permiten elicitar narrativas ricas y detalladas?

2. Apertura y Neutralidad: Revisa si las preguntas son genuinamente abiertas (preguntas tipo "Cómo", "De qué manera"). Identifica y reformula preguntas cerradas (Sí/No) o que dirijan la respuesta.

3. Fluidez y Transiciones: Analiza el flujo lógico entre los bloques temáticos. ¿Las transiciones son naturales? ¿La estructura permite flexibilidad?

4. Calidad de las Sondas (Probes): ¿Se incluyen suficientes preguntas de seguimiento (ej. "¿Podrías darme un ejemplo?") para profundizar? Sugiere nuevas sondas y reformula preguntas para fomentar mayor profundidad.

Aquí está la guía de entrevista:
${params.interviewGuide}`;

    await this.delay(3500);

    return {
      depthPotential: {
        score: 8.2,
        analysis: "La guía tiene un buen potencial para elicitar narrativas profundas, especialmente en las secciones sobre experiencias personales",
        suggestions: [
          "Incluir más preguntas sobre momentos específicos y críticos",
          "Agregar sondas temporales ('antes/después', 'primera vez que...')",
          "Incorporar preguntas sobre emociones y sentimientos asociados"
        ]
      },
      opennessNeutrality: {
        score: 7.5,
        closedQuestions: [
          {
            original: "¿Considera que la tecnología es útil en su trabajo?",
            reformulated: "¿Cómo describiría el papel de la tecnología en su trabajo diario?"
          },
          {
            original: "¿Ha tenido problemas con las plataformas digitales?",
            reformulated: "¿Podría contarme sobre su experiencia usando plataformas digitales?"
          }
        ]
      },
      flowTransitions: {
        score: 8.0,
        feedback: "El flujo general es lógico y permite flexibilidad. Las transiciones entre bloques temáticos son naturales",
        improvements: [
          "Incluir frases de transición más explícitas entre secciones",
          "Permitir mayor flexibilidad en el orden de los temas según la conversación"
        ]
      },
      probeQuality: {
        score: 6.8,
        existingProbes: [
          "¿Podrías darme un ejemplo?",
          "¿Cómo te hizo sentir eso?"
        ],
        suggestedProbes: [
          "¿Podrías contarme más sobre eso?",
          "¿Qué significó eso para ti?",
          "¿Cómo fue esa experiencia específicamente?",
          "¿Podrías describir un momento concreto cuando...?",
          "¿Qué otros aspectos consideras importantes?"
        ]
      }
    };
  }

  /**
   * Reflexivity and Researcher Bias Review
   */
  async reflexivityBiasReview(params: {
    interviewGuide: string;
    researchObjective: string;
  }): Promise<{
    identifiedAssumptions: string[];
    loadedQuestions: Array<{
      original: string;
      bias: string;
      neutral: string;
    }>;
    framingIssues: Array<{
      issue: string;
      limitation: string;
      suggestion: string;
    }>;
    neutralityRecommendations: string[];
  }> {
    const prompt = `Actúa como un supervisor de investigación cualitativa enfocado en el rigor metodológico y la reflexividad. Revisa la siguiente guía de entrevista diseñada para estudiar ${params.researchObjective}.

Realiza un análisis crítico enfocado en identificar sesgos potenciales y supuestos implícitos:

1. Identificación de Supuestos: ¿Qué preconcepciones o teorías del investigador parecen estar integradas en la redacción de las preguntas?

2. Preguntas Cargadas o con Juicios de Valor: Identifica cualquier pregunta que contenga juicios de valor o que guíe al participante hacia una interpretación específica.

3. Encuadre (Framing): ¿El encuadre de los temas limita la posibilidad de que emerjan perspectivas inesperadas, contradictorias o alternativas?

Recomienda ajustes específicos para reformular las preguntas de manera más neutral y abierta, maximizando la voz del participante y la descripción densa.

Aquí está la guía de entrevista:
${params.interviewGuide}`;

    await this.delay(3000);

    return {
      identifiedAssumptions: [
        "Asume que la tecnología es inherentemente beneficiosa para la educación",
        "Presupone que los docentes han tenido experiencias previas con tecnología educativa",
        "Implica que la resistencia al cambio es necesariamente negativa"
      ],
      loadedQuestions: [
        {
          original: "¿Qué beneficios ha encontrado en el uso de tecnología educativa?",
          bias: "Presupone que existen beneficios",
          neutral: "¿Cómo describiría su experiencia con la tecnología educativa?"
        },
        {
          original: "¿Cómo ha superado las dificultades iniciales con la tecnología?",
          bias: "Asume que hubo dificultades que fueron superadas",
          neutral: "¿Podría contarme sobre su proceso de adaptación a las herramientas tecnológicas?"
        }
      ],
      framingIssues: [
        {
          issue: "Enfoque excesivo en aspectos positivos",
          limitation: "Puede inhibir la expresión de experiencias negativas o críticas",
          suggestion: "Incluir preguntas más neutrales que permitan emergencia de perspectivas críticas"
        },
        {
          issue: "Secuencia que sugiere progresión lineal",
          limitation: "No contempla experiencias no lineales o regresivas",
          suggestion: "Reformular para permitir narrativas más complejas y no lineales"
        }
      ],
      neutralityRecommendations: [
        "Usar preguntas más abiertas que no presuponen direccionalidad",
        "Incluir espacios para perspectivas contradictorias o ambivalentes",
        "Reformular preguntas para maximizar la voz del participante",
        "Evitar términos que impliquen juicios de valor"
      ]
    };
  }

  /**
   * Field Pilot Simulation and Methodological Reflection
   */
  async fieldPilotSimulation(params: {
    interviewGuide: string;
    studyContext: string;
  }): Promise<{
    dynamicsAndRapport: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    informationQuality: {
      richQuestions: string[];
      superficialQuestions: string[];
      recommendations: string[];
    };
    timeManagement: {
      realistic: boolean;
      estimatedDuration: number;
      adjustments: string[];
    };
    anticipatedDifficulties: {
      logistical: string[];
      emotional: string[];
      protocolAdjustments: string[];
    };
    emergentThemes: string[];
  }> {
    const prompt = `Actúa como un investigador de campo que acaba de realizar una prueba piloto utilizando el instrumento proporcionado.

El contexto del estudio es: ${params.studyContext}.

Elabora una reflexión metodológica sobre la usabilidad del instrumento en campo, basada en la simulación de la aplicación. Considera los siguientes puntos:

1. Dinámica y Rapport: ¿Las preguntas iniciales facilitaron un clima de confianza? ¿La conversación fluyó naturalmente?

2. Calidad de la Información Generada: ¿Qué preguntas produjeron las respuestas más ricas y cuáles generaron información superficial?

3. Gestión del Tiempo: ¿Es realista aplicar el instrumento en el tiempo estimado?

4. Dificultades Anticipadas y Ajustes Prácticos: ¿Qué desafíos logísticos o emocionales podrían surgir y cómo debería ajustarse el protocolo?

5. Temas Emergentes: ¿Surgieron temas relevantes no contemplados en la guía que deberían incluirse?

Aquí está la guía de entrevista:
${params.interviewGuide}`;

    await this.delay(3500);

    return {
      dynamicsAndRapport: {
        score: 8.5,
        feedback: "Las preguntas iniciales establecen bien el rapport. El tono conversacional facilita la apertura del participante",
        suggestions: [
          "Incluir una pregunta más personal al inicio para generar confianza",
          "Preparar transiciones más suaves entre temas sensibles"
        ]
      },
      informationQuality: {
        richQuestions: [
          "¿Podría contarme sobre un momento específico cuando...?",
          "¿Cómo describiría esa experiencia?",
          "¿Qué significó eso para usted?"
        ],
        superficialQuestions: [
          "¿Está satisfecho con...?",
          "¿Considera que es importante...?"
        ],
        recommendations: [
          "Convertir preguntas cerradas en narrativas",
          "Incluir más sondas para profundizar en experiencias específicas",
          "Agregar preguntas sobre contexto y antecedentes"
        ]
      },
      timeManagement: {
        realistic: true,
        estimatedDuration: 45,
        adjustments: [
          "Permitir flexibilidad de ±15 minutos según la verbosidad del participante",
          "Preparar versión reducida para participantes con tiempo limitado"
        ]
      },
      anticipatedDifficulties: {
        logistical: [
          "Problemas de conectividad en entrevistas virtuales",
          "Interrupciones en el entorno del participante"
        ],
        emotional: [
          "Temas sensibles sobre fracasos o frustraciones",
          "Resistencia a compartir experiencias negativas"
        ],
        protocolAdjustments: [
          "Incluir protocolo para manejo de emociones intensas",
          "Preparar estrategias de reconducción para participantes evasivos"
        ]
      },
      emergentThemes: [
        "Impacto en la vida personal y familiar",
        "Diferencias generacionales en la adaptación",
        "Rol del apoyo institucional en el proceso"
      ]
    };
  }

  // ============================================================================
  // COMPREHENSIVE CONTENT VALIDATION
  // ============================================================================

  /**
   * Multidisciplinary Expert Panel Simulation
   */
  async expertPanelSimulation(params: {
    instrument: string;
    objective: string;
    targetPopulation: string;
  }): Promise<{
    judge1_thematic: {
      generalComments: string;
      sufficiency: string;
      criticalItems: Array<{
        item: string;
        relevance: number;
        coherence: number;
        comments: string;
      }>;
    };
    judge2_methodological: {
      generalComments: string;
      technicalQuality: string;
      criticalItems: Array<{
        item: string;
        clarity: number;
        coherence: number;
        technical: number;
        comments: string;
      }>;
    };
    judge3_contextual: {
      generalComments: string;
      contextualAdequacy: string;
      criticalItems: Array<{
        item: string;
        clarity: number;
        practicalRelevance: number;
        comments: string;
      }>;
    };
    panelSynthesis: {
      agreements: string[];
      disagreements: string[];
      priorityChanges: string[];
      cviScore: number;
    };
  }> {
    const prompt = `Actúa como un coordinador de un panel de juicio de expertos para la validación de un instrumento de investigación. El objetivo del instrumento es ${params.objective} y la población objetivo es ${params.targetPopulation}.

Simula la evaluación de tres jueces expertos con perfiles distintos sobre el instrumento proporcionado.

Criterios de Evaluación (Estándar): Relevancia, Claridad, Coherencia y Suficiencia.

Perfiles de los Jueces a Simular:

Juez 1: Experto Temático/Disciplinar. Se enfoca en Relevancia, Coherencia y Suficiencia.
Juez 2: Experto Metodológico. Se enfoca en Claridad, Coherencia y corrección técnica.
Juez 3: Experto Contextual/Poblacional. Se enfoca en Claridad (lenguaje apropiado) y Relevancia práctica.

Aquí está el instrumento:
${params.instrument}`;

    await this.delay(5000);

    return {
      judge1_thematic: {
        generalComments: "El instrumento aborda adecuadamente los aspectos centrales del constructo. La cobertura temática es apropiada para los objetivos planteados.",
        sufficiency: "Se considera suficiente para capturar las dimensiones principales, aunque podría beneficiarse de ítems adicionales sobre aspectos contextuales.",
        criticalItems: [
          {
            item: "Ítem 5: Percepción sobre utilidad",
            relevance: 4,
            coherence: 4,
            comments: "Altamente relevante y coherente con el marco teórico"
          },
          {
            item: "Ítem 12: Aspectos técnicos",
            relevance: 3,
            coherence: 3,
            comments: "Relevante pero podría ser más específico al contexto disciplinar"
          }
        ]
      },
      judge2_methodological: {
        generalComments: "La estructura metodológica es sólida. Los ítems están bien construidos técnicamente con algunas excepciones menores.",
        technicalQuality: "Calidad técnica apropiada. Las escalas son consistentes y las instrucciones claras.",
        criticalItems: [
          {
            item: "Ítem 3: Satisfacción general",
            clarity: 4,
            coherence: 4,
            technical: 3,
            comments: "Claro y coherente, pero podría beneficiarse de mayor especificidad"
          },
          {
            item: "Ítem 8: Frecuencia de uso",
            clarity: 3,
            coherence: 4,
            technical: 4,
            comments: "Técnicamente correcto pero las opciones de respuesta podrían ser más precisas"
          }
        ]
      },
      judge3_contextual: {
        generalComments: "El instrumento es apropiado para la población objetivo. El lenguaje es accesible y culturalmente pertinente.",
        contextualAdequacy: "Buena adecuación contextual. Los ítems reflejan la realidad de la población objetivo.",
        criticalItems: [
          {
            item: "Ítem 7: Terminología técnica",
            clarity: 3,
            practicalRelevance: 4,
            comments: "Relevante pero algunos términos técnicos podrían requerir definición"
          },
          {
            item: "Ítem 15: Contexto institucional",
            clarity: 4,
            practicalRelevance: 4,
            comments: "Muy claro y altamente relevante para la población"
          }
        ]
      },
      panelSynthesis: {
        agreements: [
          "El instrumento tiene una estructura lógica apropiada",
          "La mayoría de ítems son relevantes y claros",
          "Las instrucciones son comprensibles"
        ],
        disagreements: [
          "Nivel de especificidad requerido en algunos ítems",
          "Necesidad de definiciones adicionales para términos técnicos"
        ],
        priorityChanges: [
          "Revisar y especificar mejor los ítems 3, 8 y 12",
          "Incluir glosario de términos técnicos",
          "Agregar ítems sobre aspectos contextuales identificados"
        ],
        cviScore: 0.87
      }
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const prevalidationService = PrevalidationService.getInstance();