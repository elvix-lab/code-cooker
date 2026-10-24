import { parseMultiProblemMarkdown } from '@/utils/mdParser';
import type { Problem, LanguageId } from '@/types/problem';

// Dynamically import all language .md files in src/data (typescript.md, go.md, rust.md, etc.)
const mdModules = import.meta.glob<string>('./*.md', {
  query: '?raw',
  eager: true,
  import: 'default',
});

const allProblemsList: Problem[] = [];

// Parse each language's combined markdown file
for (const [filePath, content] of Object.entries(mdModules)) {
  const problems = parseMultiProblemMarkdown(content);
  for (const prob of problems) {
    attachTestHarness(prob);
    allProblemsList.push(prob);
  }
}

function attachTestHarness(problem: Problem) {
  if (problem.id === 'ts-001') {
    problem.testHarness = {
      testCases: [
        { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
        { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' },
        { input: 'nums = [3, 3], target = 6', expected: '[0, 1]' },
      ],
      generateRunner: (code: string) => `
${code}

const tests = [
  { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
  { nums: [3, 2, 4], target: 6, expected: [1, 2] },
  { nums: [3, 3], target: 6, expected: [0, 1] }
];

tests.forEach((t, i) => {
  try {
    const res = twoSum(t.nums, t.target);
    const sortedRes = [...res].sort();
    const sortedExp = [...t.expected].sort();
    const isPass = sortedRes.length === 2 && sortedRes[0] === sortedExp[0] && sortedRes[1] === sortedExp[1];
    if (isPass) {
      console.log(\`[TEST_RESULT:PASS:\${i}]\`);
    } else {
      console.log(\`[TEST_RESULT:FAIL:\${i}] Expected: \${JSON.stringify(t.expected)} | Got: \${JSON.stringify(res)}\`);
    }
  } catch (err) {
    console.log(\`[TEST_RESULT:FAIL:\${i}] Expected: \${JSON.stringify(t.expected)} | Got: Exception: \${err}\`);
  }
});
`,
    };
  } else if (problem.id === 'ts-002') {
    problem.testHarness = {
      testCases: [
        { input: 's = "()"', expected: 'true' },
        { input: 's = "()[]{}"', expected: 'true' },
        { input: 's = "(]"', expected: 'false' },
      ],
      generateRunner: (code: string) => `
${code}
const tests = [
  { s: "()", expected: true },
  { s: "()[]{}", expected: true },
  { s: "(]", expected: false }
];
tests.forEach((t, i) => {
  const res = isValid(t.s);
  if (res === t.expected) {
    console.log(\`[TEST_RESULT:PASS:\${i}]\`);
  } else {
    console.log(\`[TEST_RESULT:FAIL:\${i}] Expected: \${t.expected} | Got: \${res}\`);
  }
});
`,
    };
  } else if (problem.id === 'go-001') {
    problem.testHarness = {
      testCases: [
        { input: 'nums = [1, 2, 3, 4, 5, 6]', expected: '[2 4 6]' },
      ],
      generateRunner: (code: string) => `
${code}
import (
	"fmt"
	"reflect"
)

func main() {
	nums := []int{1, 2, 3, 4, 5, 6}
	res := FilterEvenInPlace(nums)
	if reflect.DeepEqual(res, []int{2, 4, 6}) {
		fmt.Println("[TEST_RESULT:PASS:0]")
	} else {
		fmt.Printf("[TEST_RESULT:FAIL:0] Expected: [2 4 6] | Got: %v\\n", res)
	}
}
`,
    };
  } else if (problem.id === 'py-001') {
    problem.testHarness = {
      testCases: [
        { input: 'append_to(1); append_to(2)', expected: '[2] (独立隔离)' },
      ],
      generateRunner: (code: string) => `
${code}
r1 = append_to(1)
r2 = append_to(2)
if r1 == [1] and r2 == [2]:
    print("[TEST_RESULT:PASS:0]")
else:
    print(f"[TEST_RESULT:FAIL:0] Expected: [1] and [2] | Got: {r1}, {r2}")
`,
    };
  }
}

export const ALL_PROBLEMS: Problem[] = allProblemsList;

export function getProblemsByLanguage(language: LanguageId): Problem[] {
  return ALL_PROBLEMS.filter((p) => p.language === language);
}

export function getProblemById(id: string): Problem | undefined {
  return ALL_PROBLEMS.find((p) => p.id === id);
}
