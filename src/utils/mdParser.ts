import fm from 'front-matter';
import { marked } from 'marked';
import type { Problem, LanguageId, Difficulty } from '@/types/problem';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  try {
    return marked.parse(markdown) as string;
  } catch (err) {
    console.error('Failed to parse markdown:', err);
    return markdown;
  }
}

interface FrontMatterAttributes {
  id?: string;
  title?: string;
  language?: string;
  difficulty?: string;
  tags?: string[];
  topic?: string;
  createdAt?: string;
  author?: string;
  isLanguageSpecific?: boolean;
}

export function parseProblemMarkdown(content: string): Problem {
  const parsed = fm<FrontMatterAttributes>(content);
  const attrs = parsed.attributes;
  const body = parsed.body;

  // Extract sections by ##
  const sections: Record<string, string> = {};
  const sectionRegex = /^##\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  const headings: { title: string; start: number }[] = [];

  while ((match = sectionRegex.exec(body)) !== null) {
    headings.push({
      title: match[1].trim(),
      start: match.index + match[0].length,
    });
  }

  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];
    const next = headings[i + 1];
    const sectionText = next
      ? body.substring(current.start, body.lastIndexOf('\n## ', next.start)).trim()
      : body.substring(current.start).trim();

    sections[current.title] = sectionText;
  }

  const extractCode = (str?: string): string => {
    if (!str) return '';
    const codeMatch = str.match(/```[a-zA-Z0-9_-]*\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : str.trim();
  };

  // Evaluation points
  const evalKey = Object.keys(sections).find(k => k.includes('核心考察点') || k.includes('Evaluation'));
  const evaluationPoints: string[] = [];
  if (evalKey && sections[evalKey]) {
    sections[evalKey].split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        evaluationPoints.push(trimmed.substring(2));
      }
    });
  }

  // Requirements
  const reqKey = Object.keys(sections).find(k => k.includes('编码要求') || k.includes('Requirements'));
  const requirements: string[] = [];
  if (reqKey && sections[reqKey]) {
    sections[reqKey].split('\n').forEach(line => {
      const trimmed = line.trim();
      if (/^\d+\.\s+/.test(trimmed)) {
        requirements.push(trimmed.replace(/^\d+\.\s+/, ''));
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        requirements.push(trimmed.substring(2));
      }
    });
  }

  // Description
  const descKey = Object.keys(sections).find(k => k.includes('题目描述') || k.includes('Description'));
  const description = descKey ? sections[descKey] : body.split('##')[0] || body;

  // Examples
  const exampleKey = Object.keys(sections).find(k => k.includes('示例') || k.includes('Example'));
  const examples: string[] = [];
  if (exampleKey && sections[exampleKey]) {
    examples.push(sections[exampleKey]);
  }

  // Starter code & solution
  const starterKey = Object.keys(sections).find(k => k.includes('初始代码') || k.includes('Starter'));
  const starterCode = extractCode(starterKey ? sections[starterKey] : '');

  const solutionKey = Object.keys(sections).find(k => k.includes('示例答案') || k.includes('Solution'));
  const solutionCode = extractCode(solutionKey ? sections[solutionKey] : '');

  // Analysis
  const analysisKey = Object.keys(sections).find(k => k.includes('答案解析') || k.includes('Analysis'));
  const analysisText = analysisKey ? sections[analysisKey] : '';

  const breakdowns: { title: string; content: string }[] = [];
  const subRegex = /^###\s+(.+)$/gm;
  let subMatch: RegExpExecArray | null;
  const subHeadings: { title: string; start: number }[] = [];

  while ((subMatch = subRegex.exec(analysisText)) !== null) {
    subHeadings.push({
      title: subMatch[1].trim(),
      start: subMatch.index + subMatch[0].length,
    });
  }

  for (let i = 0; i < subHeadings.length; i++) {
    const cur = subHeadings[i];
    const nxt = subHeadings[i + 1];
    const text = nxt
      ? analysisText.substring(cur.start, analysisText.lastIndexOf('\n### ', nxt.start)).trim()
      : analysisText.substring(cur.start).trim();
    breakdowns.push({ title: cur.title, content: text });
  }

  return {
    id: attrs.id || 'p-001',
    title: attrs.title || '题目',
    language: (attrs.language ? attrs.language.toLowerCase() : 'typescript') as LanguageId,
    difficulty: (attrs.difficulty || 'Easy') as Difficulty,
    tags: Array.isArray(attrs.tags) ? attrs.tags : ['基础'],
    topic: attrs.topic || '通用算法',
    createdAt: attrs.createdAt || '2026-03-30',
    author: attrs.author || 'code-cooker',
    isLanguageSpecific: !!attrs.isLanguageSpecific,
    description,
    evaluationPoints: evaluationPoints.length > 0 ? evaluationPoints : ['算法逻辑与边界处理'],
    requirements: requirements.length > 0 ? requirements : ['时间复杂度符合题目要求'],
    examples,
    starterCode,
    solutionCode,
    solutionAnalysis: {
      overview: analysisText ? analysisText.split('\n###')[0].trim() : '最优解法时间与空间复杂度。',
      breakdowns: breakdowns.length > 0 ? breakdowns : [{ title: '思路分析', content: analysisText || '核心解法与边界处理' }],
      complexity: {
        time: 'O(n)',
        space: 'O(n)',
      },
    },
    rawMarkdown: content,
  };
}

/**
 * Parses a combined markdown file containing multiple problems separated by YAML front-matters.
 */
export function parseMultiProblemMarkdown(fileContent: string): Problem[] {
  // Normalize line endings
  const content = fileContent.replace(/\r\n/g, '\n').trim();
  if (!content) return [];

  // Split content by occurrences of `---\nid:` or `---\n# ` boundary
  const problemChunks = content
    .split(/\n(?=---\s*\n\s*id:)/g)
    .map(c => c.trim())
    .filter(Boolean);

  const results: Problem[] = [];
  for (const chunk of problemChunks) {
    try {
      const prob = parseProblemMarkdown(chunk);
      if (prob.id && prob.title) {
        results.push(prob);
      }
    } catch (err) {
      console.warn('Failed to parse problem chunk:', err);
    }
  }

  return results;
}
