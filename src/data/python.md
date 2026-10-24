---
id: py-001
title: Python 数据模型: 规避可变默认参数陷阱
language: python
difficulty: Easy
topic: 数据模型与运行时
isLanguageSpecific: true
tags: 
  - 默认参数
  - 可变对象
  - Pythonic
  - 避坑指南
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# Python 数据模型: 规避可变默认参数陷阱

## 题目描述
在 Python 中，函数的默认参数在函数**定义时**（即模块加载时）被求值并绑定到函数对象上，且仅绑定一次。
如果默认参数是可变对象（如 `[]` 或 `{}`），连续多次调用会在同一个对象上累积状态，引发隐蔽的生产 Bug！

请修复 `append_to(element, target_list=[])` 函数，使用 Pythonic 的标准做法，保证每次不传 `target_list` 时都独立生成一个全新的空列表。

---

## 💡 核心考察点 (Evaluation Points)
- **函数默认参数的绑定生命周期**：默认参数存储在函数的 `__defaults__` 元组属性中，并非每次调用动态创建。
- **Pythonic 惯用法 `target_list is None`**：以不可变的 `None` 作为占位哨兵值，在函数体内部动态判定并初始化。

---

## 初始代码 (Starter Code)

```python
# 修复此具有严重隐患的代码
def append_to(element, target_list=[]):
    target_list.append(element)
    return target_list
```

---

## 示例答案 (Solution)

```python
def append_to(element, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(element)
    return target_list
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
将默认值指定为不可变的 None，并在函数体执行时动态判断 `if target_list is None: target_list = []`，使得每一次默认调用都获得全新的独立对象。

---
id: py-002
title: 惰性求值: 生成器管道 (Generator Pipeline)
language: python
difficulty: Medium
topic: 生成器与迭代协议
isLanguageSpecific: true
tags: 
  - 生成器
  - yield
  - 惰性求值
  - 内存优化
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 惰性求值: 生成器管道 (Generator Pipeline)

## 题目描述
在处理海量日志数据或大数据流时，把整个数据集装载进内存会导致 OOM（内存溢出）。
请使用 Python 生成器函数与 `yield` 语法构建一个数据处理流水线：
1. `integers(start)`：生成无限递增整数序列的生成器。
2. `evens(stream)`：过滤接收到的整数流，仅产出偶数。
3. `squares(stream)`：对接收到的数字流计算平方。
4. `take(n, stream)`：从流中截取前 `n` 个元素组成普通列表返回。

---

## 💡 核心考察点 (Evaluation Points)
- **生成器状态暂停与恢复**：`yield` 让函数在产出值后保留局部变量堆栈，直到下一次 `next()` 被唤起。
- **零内存膨胀流式处理**：管道中的每个元素按需逐个向下流动，空间复杂度始终恒定为 $O(1)$。

---

## 📋 编码要求 (Requirements)
1. 数据源必须能够支持潜在的无限流。
2. 严禁在生成器函数内部构造完整列表。

---

## 初始代码 (Starter Code)

```python
def integers(start=1):
    # 生成递增无限整数流
    pass

def evens(stream):
    # 仅产出偶数
    pass

def squares(stream):
    # 产出平方数
    pass

def take(n, stream):
    # 取前 n 个数返回列表
    pass
```

---

## 示例答案 (Solution)

```python
def integers(start=1):
    curr = start
    while True:
        yield curr
        curr += 1

def evens(stream):
    for num in stream:
        if num % 2 == 0:
            yield num

def squares(stream):
    for num in stream:
        yield num * num

def take(n, stream):
    result = []
    for _ in range(n):
        result.append(next(stream))
    return result
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
生成器管道是 Python 函数式流处理的经典范式。只有最下游的 `take` 索要一个数字时，上游才会推进一步并产出一个值，中途零临时列表内存消耗。

---
id: py-003
title: 高阶函数: 带参重试装饰器 (@retry & @wraps)
language: python
difficulty: Medium
topic: 装饰器与闭包
isLanguageSpecific: true
tags: 
  - 装饰器
  - functools.wraps
  - 闭包
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 高阶函数: 带参重试装饰器 (@retry & @wraps)

## 题目描述
在编写网络抓取或 RPC 调用时，偶发性异常需要自动重试机制。
请编写一个带参数的函数装饰器 `retry(max_attempts=3)`：
1. 当被装饰的函数抛出异常时，自动捕获并重试，最多执行 `max_attempts` 次。
2. 若在尝试次数内成功返回结果，则直接返回。
3. 若超过尝试次数仍然失败，将最后的异常重新向外抛出。
4. 必须使用 `functools.wraps` 保留被装饰函数的原始元数据。

---

## 💡 核心考察点 (Evaluation Points)
- **三层闭包结构**：最外层接收装饰器参数，中间层接收目标函数，最内层包装执行逻辑。
- **元数据保持 `functools.wraps`**：防止被装饰函数的函数名变成 "wrapper"，避免反射与调试破坏。

---

## 初始代码 (Starter Code)

```python
import functools

def retry(max_attempts=3):
    # 在此实现你的带参装饰器
    pass
```

---

## 示例答案 (Solution)

```python
import functools

def retry(max_attempts=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
            if last_exception:
                raise last_exception
        return wrapper
    return decorator
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
带参装饰器是 Python 中闭包概念最典型的实践，三层嵌套结构各自承担了参数传递、函数包装与运行时执行控制。
`@functools.wraps` 保留 `__name__` 和元信息。
