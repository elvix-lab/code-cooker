---
id: ts-001
title: 两数之和 (Two Sum)
language: typescript
difficulty: Easy
topic: 数组与哈希表
tags: 
  - 数组
  - 哈希表
  - 经典算法
createdAt: 2026-03-30
author: code-cooker
---

# 两数之和 (Two Sum)

## 题目描述
给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。你可以按任意顺序返回答案。

---

## 💡 核心考察点 (Evaluation Points)
- **空间换时间思想**：如何通过哈希表（Map）将双重循环的 $O(n^2)$ 时间复杂度优化到单次遍历的 $O(n)$。
- **边界与异常处理**：数组长度、无解情况、或存在重复数值时的键值覆盖逻辑。
- **TypeScript 类型安全与非空断言**：在获取 Map 结果时合理处理 undefined 与断言操作符 `!`。

---

## 📋 编码要求 (Requirements)
1. **时间复杂度**：必须达到 $O(n)$，不允许使用两层嵌套循环暴力破解。
2. **空间复杂度**：$O(n)$。
3. **函数签名**：`function twoSum(nums: number[], target: number): number[]`

---

## 示例

```typescript
const nums = [2, 7, 11, 15];
const target = 9;
// 返回: [0, 1] 因为 nums[0] + nums[1] == 9
```

---

## 初始代码 (Starter Code)

```typescript
function twoSum(nums: number[], target: number): number[] {
  // 在此编写你的代码
  
}
```

---

## 示例答案 (Solution)

```typescript
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // 1. 创建哈希表，记录 <数值, 下标>
  
  for (let i = 0; i < nums.length; i++) { // 2. 单次遍历数组
    const complement = target - nums[i]; // 3. 计算当前值与目标的差值
    
    if (map.has(complement)) {          // 4. 检查差值是否已在哈希表中
      return [map.get(complement)!, i]; // 5. 若存在，直接返回对应下标
    }
    
    map.set(nums[i], i);                // 6. 若不存在，将当前值存入哈希表
  }
  
  return [];                            // 7. 兜底返回空数组
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
* **核心算法思想**：“空间换时间”（Hash Map Lookup）。
* **为什么不用暴力双循环？**：暴力解法需要两层嵌套 `for` 循环，时间复杂度为 $O(n^2)$，当数据量较大时极易超时。
* **本解法的突破口**：利用哈希表（Map）的 $O(1)$ 级查找特性，将查找过程从“遍历整个数组”变成“查表”，从而把时间复杂度直接优化到 **$O(n)$**。

### 2. 细节解释 (Detailed Breakdown)
* **细节 A：哈希表的键值设计 (`Map<number, number>`)**：Key 存元素数值，Value 存对应下标。
* **细节 B：为什么是“边遍历，边存入”？**：保证在寻找差值 `complement` 时绝不会匹配到当前元素自己。
* **细节 C：非空断言操作符 `!` 的作用**：告知 TS 编译器该 Key 必定存在，避免类型报错。

---
id: ts-002
title: 有效括号 (Valid Parentheses)
language: typescript
difficulty: Easy
topic: 栈与队列
tags: 
  - 栈
  - 字符串
  - 经典算法
createdAt: 2026-03-30
author: code-cooker
---

# 有效括号 (Valid Parentheses)

## 题目描述
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

---

## 💡 核心考察点 (Evaluation Points)
- **后进先出 (LIFO) 结构运用**：利用栈的特性匹配最近的开括号。
- **映射表驱动匹配**：使用字典将闭括号映射至对应开括号，代码精简且易扩展。
- **奇数长度快速剪枝**：奇数长度字符串绝对不可能完全闭合。

---

## 📋 编码要求 (Requirements)
1. **时间复杂度**：$O(n)$，单次扫描。
2. **空间复杂度**：$O(n)$，使用栈存储。
3. **函数签名**：`function isValid(s: string): boolean`

---

## 示例

```typescript
isValid("()"); // 返回 true
isValid("()[]{}"); // 返回 true
isValid("(]"); // 返回 false
```

---

## 初始代码 (Starter Code)

```typescript
function isValid(s: string): boolean {
  // 在此编写你的代码
  
}
```

---

## 示例答案 (Solution)

```typescript
function isValid(s: string): boolean {
  if (s.length % 2 !== 0) return false;
  
  const stack: string[] = [];
  const map: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (map[char]) {
      const top = stack.pop();
      if (top !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
栈是解决成对嵌套匹配问题的标准利器，利用后进先出的特性，保证最内层的括号最先闭合。

### 2. 细节解释 (Detailed Breakdown)
* **细节 A：快速剪枝**：若输入字符串长度为奇数，无论如何搭配都不可能完全成对匹配，直接返回 false。
* **细节 B：映射表解耦**：用右括号作为 Key，对应左括号作为 Value，逻辑清晰。

---
id: ts-003
title: 类型体操: 实现 MyPick<T, K>
language: typescript
difficulty: Easy
topic: TS 类型体操
isLanguageSpecific: true
tags: 
  - 类型系统
  - 映射类型
  - keyof
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 类型体操: 实现 MyPick<T, K>

## 题目描述
不使用 TypeScript 内置的 `Pick<T, K>`，实现一个属于你自己的 `MyPick<T, K>`。

从类型 `T` 中挑选出符合属性键 `K` 的属性，构造一个全新的类型。

---

## 💡 核心考察点 (Evaluation Points)
- **泛型约束 `extends keyof`**：确保传入的键名联合类型必须属于目标对象的有效键集合。
- **映射类型语法 `[P in K]`**：通过属性遍历语法依次映射指定属性名。
- **索引访问类型 `T[P]`**：获取原始对象中对应属性的具体类型。

---

## 📋 编码要求 (Requirements)
1. 完全在类型层实现，无须任何运行时开销。
2. 当键名不在 `keyof T` 中时，产生编译类型错误约束。
3. 代码签名：`type MyPick<T, K extends keyof T> = ...`

---

## 示例

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
};
```

---

## 初始代码 (Starter Code)

```typescript
type MyPick<T, K> = any;

// 验证测试代码
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type Res = MyPick<Todo, 'title' | 'completed'>;
```

---

## 示例答案 (Solution)

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
这是 TypeScript 类型体操的基石题，考察 TypeScript 类型编程最核心的三个原子操作：keyof、extends 约束、in 映射。

---
id: ts-004
title: 类型体操: 深度只读 DeepReadonly<T>
language: typescript
difficulty: Medium
topic: TS 类型体操
isLanguageSpecific: true
tags: 
  - 递归类型
  - 只读修饰符
  - 条件类型
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 类型体操: 深度只读 DeepReadonly<T>

## 题目描述
实现一个通用的 `DeepReadonly<T>`，它将对象的每个属性及其子对象的所有属性都递归地标记为 `readonly`。

注意需要处理函数、基本类型（数字/字符串/布尔值）与嵌套深层对象的区分。

---

## 💡 核心考察点 (Evaluation Points)
- **递归条件类型**：判断属性值是否为对象，若是对象则递归调用 `DeepReadonly`。
- **边界处理（函数与原始类型）**：函数也是 `object`，但函数不应该被当作嵌套属性展开，必须避免解构函数签名。

---

## 初始代码 (Starter Code)

```typescript
type DeepReadonly<T> = any;

// 测试验证
type Test = DeepReadonly<{ a: { b: number } }>;
```

---

## 示例答案 (Solution)

```typescript
type DeepReadonly<T> = T extends Function | boolean | number | string | symbol | null | undefined
  ? T
  : {
      readonly [K in keyof T]: DeepReadonly<T[K]>;
    };
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
通过条件类型判断 T 是否为原始值或函数。若不是，则使用映射类型为当前层每个属性添加 readonly 修饰符，并对子属性递归调用 DeepReadonly。

---
id: ts-005
title: LRU 缓存机制 (LRU Cache in TypeScript)
language: typescript
difficulty: Medium
topic: 设计与数据结构
tags: 
  - 哈希表
  - Map迭代特性
  - 设计模式
createdAt: 2026-03-30
author: code-cooker
---

# LRU 缓存机制 (LRU Cache in TypeScript)

## 题目描述
请你设计并实现一个满足 LRU (最近最少使用) 缓存约束的数据结构。

实现 `LRUCache` 类：
- `LRUCache(int capacity)` 以正整数作为容量 `capacity` 初始化 LRU 缓存
- `get(key: number): number` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 -1。
- `put(key: number, value: number): void` 如果关键字已经存在，则变更其数据值；如果不存在，则向缓存中插入该组 `key-value`。如果插入操作导致关键字数量超过 `capacity`，则应该逐出最久未使用的关键字。

函数 `get` 和 `put` 必须以 $O(1)$ 的平均时间复杂度运行。

---

## 💡 核心考察点 (Evaluation Points)
- **JavaScript Map 的有序性特性**：ES6 Map 按照键值插入的先后顺序迭代，可直接利用 `keys().next().value` 获取最老元素。
- **访问更新策略**：在 `get` 或覆盖 `put` 时，删除已有键并重新写入，使其移动到 Map 末尾成为“最新”。
- **容量溢出逐出**：在容量超标时，剔除首个键值。

---

## 初始代码 (Starter Code)

```typescript
class LRUCache {
  constructor(capacity: number) {
    // 初始化你的缓存
  }

  get(key: number): number {
    // 实现 get
    return -1;
  }

  put(key: number, value: number): void {
    // 实现 put
  }
}
```

---

## 示例答案 (Solution)

```typescript
class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, value);
  }
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
利用 JavaScript ES6 Map 内置维持插入顺序的独特特性，省去了传统语言中维护复杂双向链表的操作。
