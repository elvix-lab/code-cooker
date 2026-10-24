---
id: go-001
title: 切片就地过滤与底层数组复用
language: go
difficulty: Easy
topic: 切片与内存模型
isLanguageSpecific: true
tags: 
  - 切片
  - 内存复用
  - Go惯用法
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 切片就地过滤与底层数组复用

## 题目描述
在 Go 语言高并发高性能网络编程中，内存逃逸与堆分配是 GC 压力的主要来源。
请实现一个函数 `FilterEvenInPlace(nums []int) []int`，对切片中的偶数进行过滤保留，**必须严格复用原切片的底层数组**，禁止调用 `make` 分配新的切片内存！

---

## 💡 核心考察点 (Evaluation Points)
- **切片原地复用惯用法 (`s[:0]`)**：通过重置切片长度为 0 但保留原有容量，直接在底层数组上覆盖写入。
- **零内存堆分配 (0 allocs/op)**：避免 GC 标记与垃圾回收开销。
- **Go 切片三要素 (ptr, len, cap)**：深入理解切片头结构体的内部运作机理。

---

## 📋 编码要求 (Requirements)
1. 禁止使用 `make([]int, ...)` 分配新切片。
2. 返回切片的底层指针与输入切片完全一致。
3. 时间复杂度：$O(n)$，空间复杂度：$O(1)$。

---

## 示例

```go
nums := []int{1, 2, 3, 4, 5, 6}
res := FilterEvenInPlace(nums)
// res 为 []int{2, 4, 6}，底层数组指针保持不变
```

---

## 初始代码 (Starter Code)

```go
package main

// FilterEvenInPlace 就地过滤偶数，禁止新分配切片
func FilterEvenInPlace(nums []int) []int {
	// 在此编写你的代码
	return nil
}
```

---

## 示例答案 (Solution)

```go
package main

// FilterEvenInPlace 就地过滤偶数，禁止新分配切片
func FilterEvenInPlace(nums []int) []int {
	result := nums[:0]
	for _, x := range nums {
		if x%2 == 0 {
			result = append(result, x)
		}
	}
	return result
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
Go 语言最经典的原地过滤模式：通过 `nums[:0]` 保留底层数组指针与容量，仅重置长度为 0，随后 `append` 会在安全容量内覆盖旧元素。

---
id: go-002
title: 并发模式: 固定容量 Worker Pool 任务池
language: go
difficulty: Medium
topic: Go 并发实战
isLanguageSpecific: true
tags: 
  - Goroutine
  - Channel
  - Worker Pool
  - 并发模式
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 并发模式: 固定容量 Worker Pool 任务池

## 题目描述
在 Go 后端开发中，不受限制地启动 goroutine 极易造成内存撑爆与上下文切换雪崩。
请实现一个带并发控制的 `RunWorkerPool(numWorkers int, jobs []int, processFn func(int) int) []int`：
1. 启动指定数量的固定 worker goroutine 消费任务通道。
2. 任务处理完成后，将结果回传并正确关闭通道与退出所有 goroutine。
3. 必须通过 `sync.WaitGroup` 进行同步协调，杜绝竞态与协程泄漏。

---

## 💡 核心考察点 (Evaluation Points)
- **谁分配谁关闭原则 (Who sends, closes)**：任务分发方关闭 jobs 通道，结果聚合方等待全部 worker 结束后关闭 results 通道。
- **双 WaitGroup 协同**：正确掌控 worker 退出时机与结果收集退出时机。
- **通道缓冲与并发效率**：利用带有缓冲的 channel 防止投递阻塞。

---

## 📋 编码要求 (Requirements)
1. 所有 worker 必须正常退出，无 goroutine 泄漏。
2. 所有输入任务必须被正确且完整地执行一次。
3. 代码无竞态（通过 `go test -race` 检验）。

---

## 初始代码 (Starter Code)

```go
package main

import (
	"sync"
)

func RunWorkerPool(numWorkers int, jobs []int, processFn func(int) int) []int {
	// 在此编写你的代码
	return nil
}
```

---

## 示例答案 (Solution)

```go
package main

import (
	"sync"
)

func RunWorkerPool(numWorkers int, jobs []int, processFn func(int) int) []int {
	jobsChan := make(chan int, len(jobs))
	resultsChan := make(chan int, len(jobs))
	
	var wg sync.WaitGroup

	// 1. 启动固定数量的 worker
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobsChan {
				resultsChan <- processFn(job)
			}
		}()
	}

	// 2. 发送任务并关闭 jobsChan
	for _, job := range jobs {
		jobsChan <- job
	}
	close(jobsChan)

	// 3. 等待所有 worker 退出后，关闭 resultsChan
	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	// 4. 收集处理结果
	var results []int
	for res := range resultsChan {
		results = append(results, res)
	}

	return results
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
这是 Go 标准库与企业生产级高吞吐流水线最标准的 Worker Pool 范式。
jobsChan 由发送方发送完毕后主动 close，worker 收到关闭信号后调用 wg.Done() 退出。
结果收集协程通过单独的 WaitGroup 等待全部 worker 退出后再 close 结果管道，彻底杜绝死锁。

---
id: go-003
title: 深入 Go 接口: (*MyError)(nil) 判断陷阱
language: go
difficulty: Easy
topic: 语言机制与运行时
isLanguageSpecific: true
tags: 
  - 接口
  - nil判断
  - 类型系统
  - 避坑指南
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 深入 Go 接口: (*MyError)(nil) 判断陷阱

## 题目描述
在 Go 语言中，一个常见却致命的 bug 是将具体的 nil 指针赋给 `error` 接口，导致外部调用者判断 `err != nil` 依然为 `true`。

请阅读并修复给定的返回函数 `ValidateConfig(cfg string) error`，确保在无错误时返回纯粹的 `nil` 接口值，杜绝类型包裹造成的幽灵非空判断。

---

## 💡 核心考察点 (Evaluation Points)
- **Go 接口底层结构 `iface / eface`**：接口内部包含动态类型 (Type) 与具体值 (Data) 两个指针，只有两者皆为 nil 时接口才为 nil。
- **返回 error 的黄金法则**：在确定无错误时，直接 return nil，严禁将具体类型的 nil 指针变量作为 error 返回。

---

## 初始代码 (Starter Code)

```go
package main

type CustomError struct {
	Msg string
}

func (e *CustomError) Error() string {
	return e.Msg
}

// 修复此函数中的 nil 判断陷阱
func ValidateConfig(cfg string) error {
	var err *CustomError = nil
	if cfg == "" {
		err = &CustomError{Msg: "config cannot be empty"}
	}
	// 致命陷阱：此处返回了一个带有 (*CustomError) 类型的接口！
	return err
}
```

---

## 示例答案 (Solution)

```go
package main

type CustomError struct {
	Msg string
}

func (e *CustomError) Error() string {
	return e.Msg
}

// 修复后版本
func ValidateConfig(cfg string) error {
	if cfg == "" {
		return &CustomError{Msg: "config cannot be empty"}
	}
	return nil
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
Go 语言面试经典陷阱！Go 的接口类型底层为一个包含 (tab, data) 的双指针结构体。
当写 `var err *CustomError = nil` 并 `return err` 时，返回给上层的 error 接口被注入了类型信息 `tab = *CustomError`，而 `data = nil`。根据 Go 规范，只要 tab 不为 nil，接口本身就不等于 nil！
修复方式是在无错路径直接显式 `return nil`。
