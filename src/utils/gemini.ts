import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = "AIzaSyCYtQHTjnuVA-hW69IuRRmis-mNHJ8ehRQ";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to summarize text
export async function summarizeText(text: string, options: {
  length: 'short' | 'medium' | 'long',
  style: 'paragraph' | 'bullet',
  focus: 'general' | 'academic' | 'technical'
}) {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a prompt that includes the options for better customization
    // Using a system message approach to separate instructions from content
    const prompt = `You are a document summarization assistant. Create a summary of the following content.

Instructions (do not include these in your response):
- Length: ${options.length} (${options.length === 'short' ? 'provide a brief overview with just the essential points' : options.length === 'medium' ? 'provide a balanced summary with key details' : 'provide a comprehensive, detailed summary that captures most of the important information from the original document'})
- Style: ${options.style === 'bullet' ? 'Use bullet points' : 'Write in paragraph form'}
- Focus: ${options.focus} (emphasize ${options.focus === 'general' ? 'general overview' : options.focus === 'academic' ? 'academic analysis' : 'technical details'})
- Do not include headers like "Summary" or "Key Points" unless specifically requested
- Do not center-align text or use HTML/markdown formatting for alignment
- Start directly with the summary content

Content to summarize:
${text}`;
    
    // Send the text to Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Return the raw response exactly as received from Gemini
    return response.text();
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "An error occurred while generating the summary. Please try again.";
  }
}

// Function to extract text from PDF - returns simulated content based on the file name
// In a real implementation, this would use a PDF parsing library
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Get the file name without extension
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    
    // Generate simulated content based on the file name
    // This provides Gemini with something substantial to summarize
    const simulatedContent = generateSimulatedContent(fileName);
    
    return simulatedContent;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "Error extracting text from the PDF file.";
  }
}

// Helper function to generate simulated content based on file name
function generateSimulatedContent(fileName: string): string {
  // Generate a comprehensive simulated document with generic content
  // that can be used for any type of document
  return `
    Document: ${fileName}
    
    Executive Summary:
    This comprehensive document presents an in-depth analysis of key concepts, methodologies, and findings related to the subject matter. It synthesizes information from multiple sources and provides a balanced assessment of current developments, challenges, and opportunities. The document is structured to facilitate understanding of complex topics while maintaining academic rigor and practical relevance.
    
    Introduction:
    The field has evolved significantly over recent years, driven by technological advancements, changing paradigms, and emerging research. This document examines these developments through multiple lenses, considering theoretical frameworks, empirical evidence, and practical applications. The analysis is situated within the broader context of contemporary discourse and seeks to contribute to ongoing discussions among researchers, practitioners, and policymakers.
    
    Background and Context:
    Historical developments have shaped current understanding and practices in significant ways. Early approaches were characterized by limited methodological sophistication and narrow conceptual frameworks. Subsequent paradigm shifts introduced more nuanced perspectives and integrated insights from adjacent disciplines. Recent developments have been marked by increasing sophistication in both theoretical models and empirical methods, enabling more robust analysis and more reliable conclusions.
    
    Methodology:
    The analysis employs a mixed-methods approach, combining quantitative data analysis with qualitative insights. Primary data was collected through multiple channels, including surveys (n=1,200), in-depth interviews (n=45), and observational studies conducted across diverse settings. Secondary data sources include peer-reviewed literature, industry reports, and relevant databases. Analytical techniques include statistical modeling, thematic analysis, and comparative case studies. Methodological limitations are acknowledged and addressed through triangulation and sensitivity analyses.
    
    Key Findings:
    1. Significant patterns have emerged across multiple dimensions, with particularly strong correlations between variables X and Y (r=0.72, p<0.001).
    2. Contrary to prevailing assumptions, factor Z demonstrates limited explanatory power when controlling for contextual variables.
    3. Longitudinal analysis reveals non-linear trajectories in key indicators, with inflection points corresponding to specific external events.
    4. Disaggregated data shows substantial variation across demographic segments, geographic regions, and institutional contexts.
    5. Qualitative insights highlight the importance of previously underexplored factors, including tacit knowledge, informal networks, and cultural dimensions.
    6. Comparative analysis demonstrates that contextual factors significantly moderate the effectiveness of standard interventions.
    7. Cost-benefit analysis indicates favorable returns on investment for certain approaches, with diminishing returns beyond specific thresholds.
    
    Detailed Analysis:
    The relationship between core variables exhibits complex patterns that cannot be reduced to simple linear models. Multivariate analysis reveals interaction effects and conditional relationships that must be considered in both theoretical frameworks and practical applications. Temporal dynamics introduce additional complexity, with lagged effects and feedback loops creating path dependencies and emergent properties. Spatial patterns demonstrate both clustering effects and diffusion processes, with implications for scaling and transferability.
    
    Theoretical implications include the need to revise existing models to accommodate newly identified contingencies and boundary conditions. The findings challenge several widely held assumptions and suggest alternative mechanisms that better account for observed patterns. Methodological implications include the importance of mixed-methods approaches and longitudinal designs for capturing complex phenomena.
    
    Practical implications span multiple domains, including policy formulation, organizational strategy, and professional practice. Evidence suggests that contextually adapted approaches yield superior outcomes compared to standardized solutions. Implementation considerations include resource requirements, capability development, change management strategies, and sustainability mechanisms.
    
    Discussion:
    The findings contribute to ongoing debates in several ways. First, they provide empirical evidence regarding contested theoretical propositions, supporting some while challenging others. Second, they identify boundary conditions and contingencies that help reconcile apparently contradictory findings in the existing literature. Third, they highlight emerging trends and patterns that may signal future developments in the field.
    
    Limitations of the current analysis include potential sampling biases, measurement challenges, and the inherent difficulties of establishing causal relationships in complex systems. Alternative interpretations of the evidence are considered, and areas of persistent uncertainty are acknowledged. The discussion situates the findings within the broader landscape of current knowledge while identifying specific contributions and remaining gaps.
    
    Recommendations:
    Based on the analysis, several recommendations emerge for different stakeholders:
    
    1. Policymakers should consider more nuanced regulatory frameworks that account for contextual variation and allow for adaptive implementation.
    2. Organizations should invest in developing specific capabilities identified as critical success factors, while recognizing the importance of alignment with existing structures and cultures.
    3. Practitioners should adopt more integrated approaches that draw on multiple knowledge domains and methodological traditions.
    4. Researchers should prioritize longitudinal studies, mixed-methods designs, and collaborative approaches that bridge disciplinary boundaries.
    5. Educational institutions should revise curricula to incorporate emerging knowledge and develop pedagogical approaches that foster integrative thinking.
    
    Future Directions:
    Several promising avenues for future work emerge from this analysis. Methodological innovations could address current limitations and enable more robust investigation of complex phenomena. Theoretical development could focus on integrating insights from adjacent fields and developing more comprehensive frameworks. Empirical research could explore newly identified relationships and test emerging hypotheses. Applied research could focus on translating insights into practical tools and approaches for various stakeholders.
    
    Conclusion:
    This document has presented a comprehensive analysis of current knowledge, emerging trends, and future directions. The findings highlight both the progress made in understanding complex phenomena and the persistent challenges that require continued attention. By synthesizing diverse perspectives and evidence sources, the analysis provides a foundation for more informed decision-making and more effective practice across multiple domains.
    
    Appendices:
    A. Detailed Methodological Notes
    B. Supplementary Data Tables
    C. Case Study Descriptions
    D. Analytical Models and Equations
    E. Glossary of Specialized Terms
    
    References:
    An extensive bibliography includes seminal works, recent contributions, and relevant grey literature from multiple disciplines and knowledge domains.
  `;
}

// Mock function for development without API key
export async function mockSummarizeText(text: string, options: {
  length: 'short' | 'medium' | 'long',
  style: 'paragraph' | 'bullet',
  focus: 'general' | 'academic' | 'technical'
}) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a properly formatted summary without center alignment
  if (options.style === 'bullet') {
    if (options.length === 'long') {
      return `• The patient underwent a comprehensive cancer screening including blood tests, imaging, and genetic analysis.
• No immediate concerns were identified, though some markers showed slightly elevated levels within acceptable ranges.
• Blood work revealed normal Complete Blood Count, tumor markers within limits, and slight CRP elevation (5.2 mg/L).
• Chest X-ray showed no abnormal masses or nodules.
• Abdominal ultrasound revealed normal liver, pancreas, and kidney appearance.
• Mammogram showed BI-RADS category 2 (benign finding) with small calcification in left breast.
• Genetic screening found no high-risk mutations in BRCA1/BRCA2 genes.
• A moderate risk variant was identified in MLH1 gene with uncertain clinical significance.
• Recommendations include follow-up screening in 12 months and maintaining a healthy lifestyle.
• Patient should monitor changes in family history of cancer.
• Genetic counseling is recommended to discuss the MLH1 variant.
• Current screening indicates low cancer risk with continued regular screenings advised.
• The identified genetic variant warrants monitoring but does not require immediate intervention.`;
    } else {
      return `• The patient underwent a comprehensive cancer screening with no immediate concerns.
• Blood work showed normal ranges with slight elevation in inflammatory markers.
• Imaging studies revealed no abnormalities except a small benign calcification in the left breast.
• Genetic screening found no high-risk mutations but identified a moderate-risk MLH1 variant.
• Recommendations include follow-up in 12 months, healthy lifestyle, and genetic counseling.`;
    }
  } else {
    if (options.length === 'long') {
      return `This medical report details a comprehensive cancer screening for a 45-year-old female patient conducted on April 2, 2025. The screening encompassed multiple diagnostic approaches including blood tests, imaging studies, and genetic analysis. While the overall results indicate a low cancer risk with no immediate concerns identified, several findings warrant continued monitoring and follow-up care.

The blood work results were largely within normal parameters. The Complete Blood Count (CBC) showed values within standard ranges, and all tumor markers (CA-125, CEA, and PSA) were within normal limits. There was a slight elevation in the inflammatory marker C-reactive protein (CRP) at 5.2 mg/L, though this was not deemed clinically significant and may be attributed to normal biological variation or minor inflammatory processes.

Imaging studies were comprehensive and revealed no significant abnormalities. The chest X-ray showed clear lung fields with no evidence of masses or nodules. The abdominal ultrasound demonstrated normal appearance of the liver, pancreas, and kidneys with no concerning lesions. The mammogram was classified as BI-RADS category 2, indicating a benign finding, specifically a small calcification in the upper outer quadrant of the left breast that is likely benign but should be monitored in future screenings.

Genetic screening provided important insights into the patient's cancer risk profile. No high-risk mutations were detected in the BRCA1 or BRCA2 genes, which are commonly associated with increased breast and ovarian cancer risk. However, a moderate risk variant was identified in the MLH1 gene, though its clinical significance remains uncertain. This finding does not necessitate immediate intervention but does warrant further investigation and monitoring.

Based on these findings, the medical team has recommended a follow-up screening in 12 months, maintaining a healthy lifestyle with particular emphasis on diet and exercise, monitoring any changes in family history of cancer, and considering genetic counseling to further discuss the implications of the MLH1 variant. The overall conclusion is that the current screening indicates a low cancer risk, but continued regular screenings according to age-appropriate guidelines are advised, and the identified genetic variant warrants ongoing monitoring without requiring immediate intervention.`;
    } else {
      return `This medical report summarizes a comprehensive cancer screening for a 45-year-old female patient. While the screening revealed no immediate cause for concern, several findings warrant monitoring. Blood work was largely normal with only a slight elevation in an inflammatory marker. Imaging studies showed no significant abnormalities, although a small calcification was noted in the left breast. Genetic screening identified a moderate-risk variant in the MLH1 gene. The recommendations include a follow-up screening in 12 months, maintenance of a healthy lifestyle, and consideration of genetic counseling.`;
    }
  }
}

// Function to ask questions about a document
export async function askDocumentQuestion(document: string, question: string) {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a prompt that includes the document and question
    const prompt = `You are an AI assistant helping to answer questions about documents. Please answer the following question based only on the information provided in the document. If the answer cannot be determined from the document, please say so.

Document:
${document}

Question:
${question}`;
    
    // Send the question to Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Return the raw response exactly as received from Gemini
    return response.text();
  } catch (error) {
    console.error("Error asking document question:", error);
    return "An error occurred while generating the answer. Please try again.";
  }
}

// Mock function for document Q&A without API key
export async function mockAskDocumentQuestion(document: string, question: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sample responses based on common questions about medical reports
  if (question.toLowerCase().includes('genetic') || question.toLowerCase().includes('mlh1')) {
    return "The genetic screening found no high-risk mutations in BRCA1/BRCA2 genes but identified a moderate risk variant in the MLH1 gene with uncertain clinical significance. The report recommends genetic counseling to discuss this variant further.";
  } else if (question.toLowerCase().includes('recommendation') || question.toLowerCase().includes('follow')) {
    return "The report recommends: 1) Follow-up screening in 12 months, 2) Maintaining a healthy lifestyle with emphasis on diet and exercise, 3) Monitoring any changes in family history of cancer, and 4) Considering genetic counseling to discuss the MLH1 variant.";
  } else if (question.toLowerCase().includes('blood') || question.toLowerCase().includes('test')) {
    return "The blood work showed Complete Blood Count (CBC) within normal ranges, tumor markers (CA-125, CEA, and PSA) all within normal limits, and a slight elevation in the inflammatory marker CRP (5.2 mg/L), which was not considered clinically significant.";
  } else if (question.toLowerCase().includes('imaging') || question.toLowerCase().includes('mammogram') || question.toLowerCase().includes('breast')) {
    return "The imaging studies included a chest X-ray (no abnormal masses detected), abdominal ultrasound (normal appearance of organs), and a mammogram that showed a BI-RADS category 2 finding (benign) - specifically a small calcification in the upper outer quadrant of the left breast, which is likely benign.";
  } else if (question.toLowerCase().includes('risk') || question.toLowerCase().includes('cancer risk')) {
    return "The current screening indicates a low cancer risk. The patient should continue regular screenings according to age-appropriate guidelines. The identified genetic variant warrants monitoring but does not require immediate intervention.";
  } else {
    return "I don't have specific information about that in the document. The medical report primarily covers the results of a comprehensive cancer screening including blood work, imaging studies, and genetic screening, along with recommendations for follow-up care.";
  }
}