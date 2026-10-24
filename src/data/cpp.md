---
id: cpp-001
title: 现代 C++: RAII 包装器与移动语义 (Move Semantics)
language: cpp
difficulty: Medium
topic: 现代 C++ 与内存模型
isLanguageSpecific: true
tags: 
  - RAII
  - 智能指针
  - 移动语义
  - 右值引用
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 现代 C++: RAII 包装器与移动语义 (Move Semantics)

## 题目描述
在现代 C++ (C++11/14/17/20) 中，“资源获取即初始化 (RAII)”与“零开销移动语义”是替代手动 new/delete 和深拷贝的核心法则。
请实现一个动态缓冲类 `DynamicBuffer`：
1. 管理一块堆内存 `int* data` 与大小 `size`。
2. 实现构造函数与析构函数（自动 delete[] 防止内存泄漏）。
3. 禁用拷贝构造与拷贝赋值（防止浅拷贝双重释放）。
4. 实现移动构造函数 `DynamicBuffer(DynamicBuffer&& other) noexcept`，实现堆指针的所有权偷取并将原对象置空。

---

## 💡 核心考察点 (Evaluation Points)
- **三/五法则 (Rule of Five)**：自定义了析构函数后，明确管理拷贝与移动行为。
- **移动构造中的所有权转移**：`data = other.data; other.data = nullptr;` 保证原对象析构时不会释放已移交的堆内存。
- **noexcept 关键字**：使标准库容器（如 `std::vector`）在扩容时敢于使用移动构造而非退化为深拷贝。

---

## 初始代码 (Starter Code)

```cpp
#include <iostream>
#include <utility>

class DynamicBuffer {
public:
    int* data;
    size_t size;

    explicit DynamicBuffer(size_t s) : size(s), data(new int[s]) {}

    ~DynamicBuffer() {
        delete[] data;
    }

    // 禁用拷贝
    DynamicBuffer(const DynamicBuffer&) = delete;
    DynamicBuffer& operator=(const DynamicBuffer&) = delete;

    // 请实现移动构造函数
    DynamicBuffer(DynamicBuffer&& other) noexcept {
        // 在此编写你的代码
    }
};
```

---

## 示例答案 (Solution)

```cpp
#include <iostream>
#include <utility>

class DynamicBuffer {
public:
    int* data;
    size_t size;

    explicit DynamicBuffer(size_t s) : size(s), data(new int[s]) {}

    ~DynamicBuffer() {
        delete[] data;
    }

    // 禁用拷贝
    DynamicBuffer(const DynamicBuffer&) = delete;
    DynamicBuffer& operator=(const DynamicBuffer&) = delete;

    // 移动构造函数
    DynamicBuffer(DynamicBuffer&& other) noexcept 
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }
};
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
现代 C++ 的核心基石：通过右值引用与移动语义，在对象转移所有权时仅传递指针，性能开销为 O(1)。
如果不将 other.data 设为 nullptr，当临时对象 other 离开作用域调用析构函数时，`delete[] other.data` 会将已转移出去的内存销毁，导致二次释放崩溃。
声明 `noexcept` 让标准库容器扩容时敢于移动而不是深拷贝。

---
id: cpp-002
title: 基类虚析构函数与对象切片陷阱
language: cpp
difficulty: Easy
topic: 面向对象与多态
isLanguageSpecific: true
tags: 
  - 多态
  - 虚函数表
  - 虚析构
  - 专精题
createdAt: 2026-03-30
author: code-cooker
---

# 基类虚析构函数与对象切片陷阱

## 题目描述
在 C++ 中，当使用基类指针指向派生类动态对象（多态）并调用 `delete basePtr` 时，如果基类的析构函数不是虚函数（virtual），会导致只调用基类析构，派生类中的动态内存无法被释放，造成内存泄漏未定义行为！

请修复给定的类层次声明，为 Base 声明虚析构函数，保证多态销毁时完整调用 Derived 的析构流程。

---

## 💡 核心考察点 (Evaluation Points)
- **虚析构函数规则**：任何作为多态基类的类，其析构函数必须为 `virtual`。
- **虚函数表 (vtable) 动态绑定**：通过 vptr 查表在运行时找到派生类的正确析构函数入口。

---

## 初始代码 (Starter Code)

```cpp
#include <iostream>

class Base {
public:
    // 修复这里的析构函数
    ~Base() {
        std::cout << "Base destroyed" << std::endl;
    }
};

class Derived : public Base {
public:
    int* resource;
    Derived() : resource(new int[100]) {}
    ~Derived() {
        delete[] resource;
        std::cout << "Derived destroyed" << std::endl;
    }
};
```

---

## 示例答案 (Solution)

```cpp
#include <iostream>

class Base {
public:
    virtual ~Base() {
        std::cout << "Base destroyed" << std::endl;
    }
};

class Derived : public Base {
public:
    int* resource;
    Derived() : resource(new int[100]) {}
    ~Derived() override {
        delete[] resource;
        std::cout << "Derived destroyed" << std::endl;
    }
};
```

## 🔍 答案解析

### 1. 整体分析 (Overview)
当且仅当析构函数是 virtual 时，delete 才会通过虚函数表动态分发到子类的析构函数，并在子类析构完成后自动链式调用父类析构。
C++ 遵循零开销原则，若无虚函数则不生成 vptr。但对于多态基类，虚析构是强制性准则。
