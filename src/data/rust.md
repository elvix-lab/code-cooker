---
id: rs-001
title: 所有权转移: 反转单向链表 (Option<Box<ListNode>>)
language: rust
difficulty: Medium
topic: 所有权与智能指针
isLanguageSpecific: true
tags: 
  - 所有权
  - Box
  - Option
  - 模式匹配
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 所有权转移: 反转单向链表 (Option<Box<ListNode>>)

## 题目描述
在 Rust 中，常规双指针或 raw pointer 容易触发借用检查器错误。
请利用 Rust 独特的所有权移动机制与 `take()` 方法，实现一个反转单向链表的函数：
```rust
pub fn reverse_list(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>>
```
不得使用 unsafe 块，完全通过安全 Rust (Safe Rust) 与所有权转移实现。

---

## 💡 核心考察点 (Evaluation Points)
- **所有权所有者唯一性与 `Option::take()`**：取出节点所有权并就地留下 None，解决自借用冲突。
- **堆内存盒子 `Box<T>` 的转移语义**：在迭代中顺畅将当前节点的 `next` 指向之前的 `prev`。
- **Safe Rust 内存无泄漏保证**：脱离 C/C++ 悬挂指针和野指针风险。

---

## 📋 编码要求 (Requirements)
1. 严禁使用 `unsafe` 关键字。
2. 时间复杂度：$O(n)$，空间复杂度：$O(1)$ 原地反转。
3. 完整维护链表所有权闭环。

---

## 初始代码 (Starter Code)

```rust
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        ListNode { next: None, val }
    }
}

pub fn reverse_list(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    // 在此编写你的代码
    None
}
```

---

## 示例答案 (Solution)

```rust
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        ListNode { next: None, val }
    }
}

pub fn reverse_list(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    
    while let Some(mut node) = head {
        head = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    
    prev
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
Rust 链表问题的精髓在于如何优雅地“转移所有权”。直接访问 `node.next` 会试图把已借用结构体内部的字段移动出来，编译器会报 `cannot move out of borrowed content`。
使用 `Option::take()` 可以在不违背借用规则的前提下取出所有权并安全置空。

---
id: rs-002
title: 并发同步: Arc<Mutex<T>> 多线程安全累加器
language: rust
difficulty: Medium
topic: 并发编程
isLanguageSpecific: true
tags: 
  - Arc
  - Mutex
  - 多线程
  - Send/Sync
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 并发同步: Arc<Mutex<T>> 多线程安全累加器

## 题目描述
在 Rust 中，多线程并发共享状态受到 `Send` 与 `Sync` trait 的严格保护。
请实现函数 `parallel_sum(chunks: Vec<Vec<i32>>) -> i32`：
1. 使用 `Arc<Mutex<i32>>` 安全共享总和计数器。
2. 派发线程分别计算子切片的和并安全累加至全局锁保护的计数器。
3. 主线程等待所有子线程计算完成并返回最终数值。

---

## 💡 核心考察点 (Evaluation Points)
- **Arc (Atomically Reference Counted)**：跨线程安全共享不可变所有权。
- **Mutex 与 RAII LockGuard**：lock() 自动获取锁，离开作用域时自动 Drop 释放锁。
- **move 闭包捕获**：将 Arc 副本的所有权移动至新开辟的 thread 中。

---

## 初始代码 (Starter Code)

```rust
use std::sync::{Arc, Mutex};
use std::thread;

pub fn parallel_sum(chunks: Vec<Vec<i32>>) -> i32 {
    // 在此编写你的代码
    0
}
```

---

## 示例答案 (Solution)

```rust
use std::sync::{Arc, Mutex};
use std::thread;

pub fn parallel_sum(chunks: Vec<Vec<i32>>) -> i32 {
    let total = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for chunk in chunks {
        let total_clone = Arc::clone(&total);
        let handle = thread::spawn(move || {
            let chunk_sum: i32 = chunk.into_iter().sum();
            let mut lock = total_clone.lock().unwrap();
            *lock += chunk_sum;
        });
        handles.push(handle);
    }

    for h in handles {
        h.join().unwrap();
    }

    let result = *total.lock().unwrap();
    result
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
这是 Rust 并发编程的经典黄金拍档模式：`Arc` 解决多线程跨域所有权共享，`Mutex` 解决共享数据的内部可变性与并发写互斥。
`Arc::clone` 仅增加原子引用计数值，不开辟新内存，速度极快。
