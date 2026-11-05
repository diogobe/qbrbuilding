import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API route for generating one-paragraph executive summary
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { account, objective, milestones, stakeholders, tone } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({ apiKey });

      const toneGuidance = 
        tone === 'economic' 
          ? 'Focus heavily on financial ROI, capacity hours saved, and cost avoidance.'
          : tone === 'remediation'
          ? 'Focus on transparent problem resolution, risk mitigation safeguards, and restoring metric SLA stability.'
          : 'Focus on strategic executive partnership alignment, C-level sponsorship, and high-impact business outcomes.';

      const prompt = `
You are an executive Customer Success Director writing a high-stakes Executive Business Review (EBR) summary for C-level leadership.

Account Details:
- Company Name: ${account?.companyName || 'Enterprise Partner'}
- Industry: ${account?.industry || 'Enterprise Technology'}
- Partnership Tier: ${account?.accountTier || 'Strategic'} Level
- Business Unit: ${account?.businessUnit || 'Enterprise Operations'}
- Annual Recurring Revenue: $${account?.annualRecurringRevenue?.toLocaleString() || 'N/A'} ARR
- Partnership Governance Health: ${account?.healthScore || 80}/100

Strategic Objective & Performance Indicators:
- Focus Motion: ${objective?.focusType || 'Retention'}
- Partnership Mandate: "${objective?.statement || 'Drive operational scale'}"
- Primary Metric: ${objective?.metricName || 'Operational Efficiency Index'}
- Trajectory: ${objective?.baselineValue || '0'}${objective?.unit || '%'} -> ${objective?.currentValue || '0'}${objective?.unit || '%'} (Target: ${objective?.targetValue || '100'}${objective?.unit || '%'})
- Verified ROI Yield: ${objective?.estimatedRoiImpact || 'Operational capacity savings in progress'}
- Immediate Next Steps: ${objective?.nextSteps || 'Execute scheduled roadmap deliverables'}

Completed Milestones Count: ${milestones?.filter((m: any) => m.status === 'Completed')?.length || 0}
Tone: ${toneGuidance}

Instructions:
1. Write a single, cohesive, high-impact paragraph (exactly 3 to 4 sentences, approx 65 to 85 words).
2. Directly connect customer software adoption and milestone execution to tangible business outcomes and economic yield.
3. Be decision-oriented and executive-ready. Avoid filler phrases, buzzwords, or introductory meta-chatter.
4. Return ONLY the paragraph text.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an executive Customer Success advisor for enterprise B2B reviews. Write concise, metric-grounded paragraphs without preamble or markdown styling.',
          temperature: 0.65,
        },
      });

      if (response.text && response.text.trim()) {
        return res.json({ narrative: response.text.trim() });
      }
    }

    // Heuristic fallback if API key is unconfigured or call fails
    const fallback = generateHeuristicSummary(account, objective, tone, milestones, stakeholders);
    return res.json({ narrative: fallback });
  } catch (err: any) {
    console.error('Error generating executive summary with Gemini:', err);
    const fallback = generateHeuristicSummary(req.body?.account, req.body?.objective, req.body?.tone, req.body?.milestones, req.body?.stakeholders);
    return res.json({ narrative: fallback });
  }
});

function generateHeuristicSummary(account: any, objective: any, tone: string, milestones: any, stakeholders: any) {
  const company = account?.companyName || 'the client';
  const metric = objective?.metricName || 'core operational velocity';
  const baseline = objective?.baselineValue || '0';
  const current = objective?.currentValue || '0';
  const target = objective?.targetValue || '100';
  const unit = objective?.unit || '%';
  const roi = objective?.estimatedRoiImpact || 'measurable cost reduction';
  const unitName = account?.businessUnit || 'enterprise operations';
  const completedCount = milestones?.filter((m: any) => m.status === 'Completed')?.length || 0;
  const sponsor = stakeholders?.find((s: any) => s.role === 'Executive Sponsor');
  const sponsorMention = sponsor ? `Executive Sponsor ${sponsor.name}` : 'executive leadership';

  if (tone === 'economic') {
    return `Over the past review cycle, our partnership with ${company} delivered substantial financial and operational return across ${unitName}, driving ${metric} from ${baseline}${unit} to ${current}${unit} toward our target of ${target}${unit}. This quantitative performance has unlocked an estimated annualized economic yield of ${roi}, supported by ${completedCount} completed roadmap milestones. Moving into the next quarter, our joint priority is scaling this verified capacity yield into adjacent workflows.`;
  }

  if (tone === 'remediation') {
    return `Operating under a proactive remediation focus, our mutual teams addressed critical operational friction points across ${unitName}, advancing ${metric} from ${baseline}${unit} to ${current}${unit}. With governance health index registered at ${account?.healthScore || 70}/100, we have prioritized delivery stabilization and risk mitigation ahead of new footprint expansion. Our immediate mandate focuses on executing scheduled roadmap safeguards to restore baseline consistency and secure long-term partnership health.`;
  }

  // Default: Strategic Leadership
  return `Throughout this strategic reporting cycle, our collaboration with ${company} achieved critical business alignment under the stewardship of ${sponsorMention}, advancing ${metric} from a baseline of ${baseline}${unit} to ${current}${unit} across ${unitName}. This momentum has translated directly into an estimated value yield of ${roi}, validating our ${account?.accountTier || 'Strategic'} partnership model. For the upcoming quarter, our teams are united on executing priority roadmap milestones to compound adoption and cement strategic ROI.`;
}

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
