---
id: jv-001
title: 集合框架底层: LinkedHashMap 打造 LRU 缓存
language: java
difficulty: Medium
topic: 集合框架与底层机制
isLanguageSpecific: true
tags: 
  - LinkedHashMap
  - accessOrder
  - LRU
  - 集合框架
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 集合框架底层: LinkedHashMap 打造 LRU 缓存

## 题目描述
在 Java 后端面试与高频架构设计中，`LinkedHashMap` 是标准库中极其巧妙的双向链表+哈希表复合结构。
请继承 `LinkedHashMap<K, V>` 实现一个固定容量的 `LRUCache<K, V>`：
1. 构造函数初始化固定容量 `capacity`。
2. 启用 `accessOrder = true` 访问顺序模式。
3. 重写保护方法 `removeEldestEntry(Map.Entry<K, V> eldest)` 达到自动逐出最久未使用的效果。

---

## 💡 核心考察点 (Evaluation Points)
- **LinkedHashMap 的构造参数 `accessOrder`**：默认为 false（插入顺序），设为 true 时，每次 `get` 或 `put` 都会把被访问节点移动至链表双向尾端。
- **钩子方法 `removeEldestEntry` 回调机制**：每次插入新节点后，HashMap 底层会自动调用此方法，返回 true 时即触发首节点驱逐。
- **工业级复用与最少代码设计**：体现标准库设计的精炼之美。

---

## 📋 编码要求 (Requirements)
1. 继承 `java.util.LinkedHashMap`。
2. 在容量达到指定上限时，新键的插入必须淘汰最旧键。
3. 时间复杂度：$O(1)$，空间复杂度：$O(capacity)$。

---

## 初始代码 (Starter Code)

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        // 在此编写构造逻辑与 accessOrder 配置
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        // 在此编写逐出规则
        return false;
    }
}
```

---

## 示例答案 (Solution)

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
Java 语言中最优雅的 LRU 实现方案。JDK 标准库 LinkedHashMap 在 Entry 节点中维护了 `before` 与 `after` 双向指针。
通过 `super(capacity, 0.75f, true)`，将迭代顺序切换为“访问顺序”。当执行 `get(key)` 时，内部执行 `afterNodeAccess` 将当前 Entry 从双向链表中拆除并挂到尾部。
在 `put` 写入完毕后，LinkedHashMap 判断 `removeEldestEntry` 返回值；当为 true 时调用 `removeNode` 删除头部最老节点。

---
id: jv-002
title: JUC 异步流: CompletableFuture 多任务并行与聚合
language: java
difficulty: Medium
topic: JUC 并发编程
isLanguageSpecific: true
tags: 
  - CompletableFuture
  - 异步非阻塞
  - thenCombine
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# JUC 异步流: CompletableFuture 多任务并行与聚合

## 题目描述
在微服务高并发网关中，经常需要同时异步请求多个远程微服务，并将返回结果合并。
请使用 `CompletableFuture` 实现函数：
```java
public static CompletableFuture<String> aggregateUserData(String userId)
```
1. 异步获取用户基本信息（返回 `"Profile:" + userId`）。
2. 异步获取用户订单数量（返回 `"Orders:5"`）。
3. 待两项皆完成后，将其合并返回为 `"Profile:userId | Orders:5"`。

---

## 💡 核心考察点 (Evaluation Points)
- **CompletableFuture.supplyAsync**：提交任务至 ForkJoinPool 异步线程池。
- **thenCombine / thenCombineAsync**：将两个独立的 Future 双路合并为单结果，无需阻塞调用 get()。
- **避免主线程同步阻塞**：全流程异步响应式设计。

---

## 初始代码 (Starter Code)

```java
import java.util.concurrent.CompletableFuture;

public class UserAggregator {
    public static CompletableFuture<String> aggregateUserData(String userId) {
        // 在此编写你的代码
        return null;
    }
}
```

---

## 示例答案 (Solution)

```java
import java.util.concurrent.CompletableFuture;

public class UserAggregator {
    public static CompletableFuture<String> aggregateUserData(String userId) {
        CompletableFuture<String> profileFuture = CompletableFuture.supplyAsync(() -> "Profile:" + userId);
        CompletableFuture<String> ordersFuture = CompletableFuture.supplyAsync(() -> "Orders:5");

        return profileFuture.thenCombine(ordersFuture, (profile, orders) -> profile + " | " + orders);
    }
}
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
CompletableFuture 是 Java 8 引入的异步编程利器，提供函数式响应链。
当需要精确聚合两个已知类型的 Future 时，`thenCombine` 提供了类型安全的双输入 BiFunction，避免了阻塞式的 `.get()`。
