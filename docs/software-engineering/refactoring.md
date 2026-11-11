---
title: 重构技巧
description: 从代码异味识别到安全重构：提取函数、卫语句、参数对象、多态替换条件等实战技巧。
---

# 重构技巧

> 重构是在不改变外部行为的前提下，改善代码内部结构。

## 本章目标

学完本章，你应该能够：

- 识别过长函数、重复代码、深嵌套等代码异味。
- 选择合适的重构手法并小步实施。
- 用测试保护重构前后的行为不变。
- 避免把重构做成大爆炸式重写。

## 为什么需要重构

代码不是一次写成的。需求变化、边界补充、性能调整都会让原本清晰的结构逐渐腐化。重构不是“重写”，也不是“闲着没事改代码”，而是一种持续控制复杂度的手段。

重构的直接收益：

- 让代码更容易理解，降低接手成本。
- 降低修改的影响范围，减少“改一处、坏三处”。
- 为新增功能腾出空间，避免在混乱结构上继续堆代码。
- 让测试更有意义，让缺陷更早暴露。

## 重构的前提

| 前提 | 说明 |
| --- | --- |
| 可运行的测试 | 至少覆盖即将改动的核心行为；没有测试时，先补 characterization tests |
| 版本控制 | 每一步都可回退，避免“改坏了却不知道改了什么” |
| 小步提交 | 一次只做一种重构，提交信息说明重构意图 |
| 明确的异味 | 先识别问题，再选择手法，不要为了重构而重构 |
| 不混入行为变化 | 重构提交里不要顺便加需求；行为变化单独提交 |

> 没有测试保障的大规模重构，本质上是在赌博。

## 重构工作流

1. **识别**：找到代码异味，例如过长函数、重复代码、参数过多、嵌套过深。
2. **补测试**：为即将改动的行为补上测试，确认当前行为基线。
3. **小步修改**：一次只应用一种重构手法，保持每一步都可运行。
4. **运行测试**：每完成一小步就运行测试，失败了就立即回退。
5. **提交**：重构与行为变化分开提交，便于 review 和回滚。
6. **回顾**：检查是否真的降低了复杂度，而不是把复杂度挪到了另一个地方。

## 一、先识别代码异味

代码异味是一种“需要进一步调查”的信号，不代表出现某个特征就必须重构。

| 代码异味 | 典型表现 | 首选重构 |
| --- | --- | --- |
| Long Method | 方法过长，注释比代码还多 | Extract Method、Split Phase |
| Large Class | 类承担过多职责，字段和方法都很多 | Extract Class |
| Duplicate Code | 相同逻辑在多个地方重复 | Extract Method、Pull Up Method |
| Long Parameter List | 参数过多，调用时难以记住顺序 | Introduce Parameter Object |
| Deep Nesting | 多层 `if` 嵌套，正常流程难以看清 | Guard Clauses、Decompose Conditional |
| Primitive Obsession | 用基本类型表达复杂概念，例如用 String 表示手机号 | Introduce Value Object |
| Feature Envy | 方法过度依赖另一个类的数据 | Move Method |
| Data Clumps | 一组参数经常一起出现 | Introduce Parameter Object |
| Shotgun Surgery | 修改一个功能要改很多类 | Move Method、集中职责 |
| Divergent Change | 一个类经常因为不同原因被修改 | Extract Class |
| Switch Statements | 大量类型分支，新增类型要改多处 | Replace Conditional with Polymorphism |
| Dead Code | 永远不执行的代码、注释掉的旧实现 | Remove Dead Code |
| Comments Smell | 注释在解释复杂实现，而不是解释原因 | Rename、Extract Method |
| Mysterious Name | 名字无法表达用途，需要看实现才能理解 | Rename |
| Speculative Generality | 为“以后可能用到”提前设计的抽象 | Inline Class、Remove Parameter |
| Message Chains | 长串 `a.getB().getC().getD()` | Hide Delegate、Move Method |
| Middle Man | 类的大部分方法只是转发给另一个对象 | Remove Middle Man |
| Refused Bequest | 子类拒绝继承父类的大部分行为 | Replace Inheritance with Delegation |

## 二、常用重构手法

### 1. 提取函数（Extract Method）

**适用场景**：函数过长；某段逻辑具有独立意义；同一段代码重复出现。

**重构前**

```java
public void createOrder(Order order) {
    if (order.getItems() == null || order.getItems().isEmpty()) {
        throw new IllegalArgumentException("订单不能为空");
    }

    // 创建订单
}
```

**重构后**

```java
public void createOrder(Order order) {
    validateOrder(order);

    // 创建订单
}

private void validateOrder(Order order) {
    if (order.getItems() == null || order.getItems().isEmpty()) {
        throw new IllegalArgumentException("订单不能为空");
    }
}
```

**注意**：提取出来的方法必须有一个能表达其目的的名字。如果只能起出 `doStep1()` 这样的名字，说明这段逻辑可能还没有被真正理解。

**依据**：《重构》《代码整洁之道》

### 2. 内联函数（Inline Method）

**适用场景**：函数过于简单；函数名没有提供额外信息；调用反而增加理解成本。

**重构前**

```java
private boolean isAdult(User user) {
    return user.getAge() >= 18;
}

if (isAdult(user)) {
    // ...
}
```

**重构后**

```java
if (user.getAge() >= 18) {
    // ...
}
```

**注意**：如果 `isAdult` 本身具有明确的业务含义，并且在多个地方使用，那么保留该方法可能更好。内联的目的是减少无意义间接层，不是消灭所有小函数。

**依据**：《重构》

### 3. 提取变量（Extract Variable）

**适用场景**：条件表达式过于复杂；一行代码包含多个业务判断；表达式难以理解。

**重构前**

```java
if (user.getAge() >= 18 &&
    user.getBalance().compareTo(new BigDecimal("100")) >= 0) {
    // ...
}
```

**重构后**

```java
boolean isAdult = user.getAge() >= 18;
boolean hasEnoughBalance =
    user.getBalance().compareTo(new BigDecimal("100")) >= 0;

if (isAdult && hasEnoughBalance) {
    // ...
}
```

**注意**：不要给每个表达式都提取变量。只有当表达式代表一个可以命名的业务概念时，提取才有价值。

**依据**：《重构》

### 4. 以查询替换临时变量（Replace Temp with Query）

**适用场景**：临时变量只用于保存一个可计算的表达式；表达式本身没有副作用。

**重构前**

```java
double basePrice = quantity * itemPrice;
if (basePrice > 1000) {
    return basePrice * 0.95;
}
return basePrice * 0.98;
```

**重构后**

```java
if (basePrice() > 1000) {
    return basePrice() * 0.95;
}
return basePrice() * 0.98;

private double basePrice() {
    return quantity * itemPrice;
}
```

**注意**：查询方法必须是廉价且无副作用的。如果计算成本很高，或者每次调用结果会变化，就不要用这个手法。

**依据**：《重构》

### 5. 用卫语句替换嵌套条件（Replace Nested Conditional with Guard Clauses）

**适用场景**：多层嵌套让正常流程被埋在深处；异常和边界条件很多。

**重构前**

```java
public void purchase(User user) {
    if (user != null) {
        if (user.isActive()) {
            if (user.hasPermission()) {
                if (user.getBalance() > 0) {
                    doPurchase();
                }
            }
        }
    }
}
```

**重构后**

```java
public void purchase(User user) {
    if (user == null) {
        return;
    }
    if (!user.isActive()) {
        return;
    }
    if (!user.hasPermission()) {
        return;
    }
    if (user.getBalance() <= 0) {
        return;
    }

    doPurchase();
}
```

**注意**：卫语句适合处理异常和边界情况；不要把正常业务流程也拆成一堆提前返回，否则读者仍然难以理解主流程。

**依据**：《重构》《代码整洁之道》

### 6. 合并重复条件（Consolidate Conditional Expression）

**适用场景**：多个条件具有相同的处理结果。

**重构前**

```java
if (user == null) {
    return false;
}
if (!user.isActive()) {
    return false;
}
if (!user.hasPermission()) {
    return false;
}
```

**重构后**

```java
if (user == null ||
    !user.isActive() ||
    !user.hasPermission()) {
    return false;
}
```

**注意**：如果这些条件在业务上代表不同含义，分开写可能更清晰。合并的前提是它们确实在表达同一个判断。

**依据**：《重构》

### 7. 分解条件（Decompose Conditional）

**适用场景**：条件表达式复杂，读者需要反复推敲才能理解业务规则。

**重构前**

```java
if (user.getAge() >= 18 &&
    user.isActive() &&
    user.getBalance().compareTo(BigDecimal.ZERO) > 0) {
    // ...
}
```

**重构后**

```java
if (canPurchase(user)) {
    // ...
}

private boolean canPurchase(User user) {
    return isAdult(user)
        && user.isActive()
        && hasBalance(user);
}
```

**注意**：方法名应当表达业务规则，而不是重复条件细节。`canPurchase` 比 `checkAgeAndStatusAndBalance` 更好。

**依据**：《重构》

### 8. 引入参数对象（Introduce Parameter Object）

**适用场景**：多个参数经常一起出现；参数列表过长；参数之间存在业务约束。

**重构前**

```java
public void searchUser(
    String username,
    Integer age,
    String email,
    Integer status
) {}
```

**重构后**

```java
public void searchUser(UserQuery query) {}

public record UserQuery(
    String username,
    Integer age,
    String email,
    Integer status
) {}
```

**注意**：不要为两个简单参数强行创建对象。参数对象的价值在于把一组相关概念聚合起来，并集中校验约束。

**依据**：《重构》

### 9. 用常量替换魔法值（Replace Magic Number with Constant）

**适用场景**：代码中出现没有解释的数字或字符串，且它代表一个业务含义。

**重构前**

```java
if (user.getAge() >= 18) {
    // ...
}
```

**重构后**

```java
private static final int LEGAL_AGE = 18;

if (user.getAge() >= LEGAL_AGE) {
    // ...
}
```

**注意**：`0`、`1`、循环边界等显而易见的数字不需要常量化。只有会变化、需要解释、或出现在多个地方的业务值才值得提取。

**依据**：《重构》《代码整洁之道》

### 10. 移动方法（Move Method）

**适用场景**：某个方法频繁访问另一个类的数据，实际上它更应该属于另一个类。

**重构前**

```java
class OrderService {
    public BigDecimal calculateTotal(Order order) {
        return order.getItems().stream()
            .map(item -> item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

**重构后**

```java
class Order {
    public BigDecimal calculateTotal() {
        return items.stream()
            .map(item -> item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

**注意**：如果计算需要访问仓储、远程服务或复杂的外部规则，把方法硬塞进实体类会造成新的耦合。这时可以考虑领域服务，而不是机械地移动。

**依据**：《重构》

### 11. 用多态替换条件（Replace Conditional with Polymorphism）

**适用场景**：大量 `if-else` 或 `switch` 按类型分支；不同类型具有不同行为；分支持续增加。

**重构前**

```java
public double calculatePrice(String type) {
    if ("VIP".equals(type)) {
        return 80;
    }
    if ("NORMAL".equals(type)) {
        return 100;
    }
    if ("NEW".equals(type)) {
        return 50;
    }
    return 0;
}
```

**重构后**

```java
interface PricingStrategy {
    double calculatePrice();
}

class VipPricing implements PricingStrategy {
    public double calculatePrice() {
        return 80;
    }
}

class NormalPricing implements PricingStrategy {
    public double calculatePrice() {
        return 100;
    }
}
```

**注意**：如果只有两三个简单分支，而且业务规则稳定，普通 `switch` 可能更合适。不要为了使用设计模式而使用设计模式。

**依据**：《重构》《Effective Java》

### 12. 引入空对象（Introduce Null Object）

**适用场景**：某些业务中，空对象具有明确、稳定的默认行为；大量重复的 null 判断让主流程变得嘈杂。

**重构前**

```java
if (logger != null) {
    logger.log("操作成功");
}
```

**重构后**

```java
interface Logger {
    void log(String message);
}

class ConsoleLogger implements Logger {
    public void log(String message) {
        System.out.println(message);
    }
}

class NullLogger implements Logger {
    public void log(String message) {
        // 明确地什么都不做
    }
}
```

**注意**：空对象模式不适合所有 null 场景，尤其不能掩盖本应被处理的数据缺失问题。

**依据**：《重构》

### 13. 拆分阶段（Split Phase）

**适用场景**：一个方法里混合了解析、校验、计算、持久化等多个阶段；各阶段可以独立测试。

**重构前**

```java
public void importOrders(String rawData) {
    // 解析
    // 校验
    // 计算
    // 保存
}
```

**重构后**

```java
public void importOrders(String rawData) {
    List<Order> orders = parseOrders(rawData);
    validateOrders(orders);
    persistOrders(orders);
}
```

**注意**：阶段之间最好通过一个明确的中间数据结构衔接。不要为了拆分而拆分，把简单流程切得支离破碎。

**依据**：《重构》

## 三、重构案例：从长函数到可测试流程

### 重构前

```java
public void settleOrder(Order order) {
    if (order == null ||
        order.getItems() == null ||
        order.getItems().isEmpty()) {
        throw new IllegalArgumentException("订单不能为空");
    }

    User user = userRepository.findById(order.getUserId())
        .orElseThrow(() -> new UserNotFoundException(order.getUserId()));

    BigDecimal total = BigDecimal.ZERO;
    for (OrderItem item : order.getItems()) {
        total = total.add(
            item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
    if (user.isVip()) {
        total = total.multiply(new BigDecimal("0.9"));
    }

    order.setTotal(total);
    order.setStatus(OrderStatus.PAID);
    orderRepository.save(order);

    notificationService.sendPaymentSuccess(user, order);
}
```

这个函数同时承担了校验、加载用户、计算金额、应用折扣、修改订单状态、持久化和通知等职责。

### 第一步：提取校验

```java
private void validateOrder(Order order) {
    if (order == null ||
        order.getItems() == null ||
        order.getItems().isEmpty()) {
        throw new IllegalArgumentException("订单不能为空");
    }
}
```

### 第二步：提取用户加载

```java
private User loadUser(Order order) {
    return userRepository.findById(order.getUserId())
        .orElseThrow(() -> new UserNotFoundException(order.getUserId()));
}
```

### 第三步：把计价逻辑移到独立服务

```java
public class PricingService {
    private static final BigDecimal VIP_DISCOUNT = new BigDecimal("0.9");

    public BigDecimal calculateTotal(Order order, User user) {
        BigDecimal total = order.getItems().stream()
            .map(item -> item.getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (user.isVip()) {
            total = total.multiply(VIP_DISCOUNT);
        }
        return total;
    }
}
```

### 第四步：让订单自己管理状态变化

```java
public class Order {
    public void markPaid(BigDecimal total) {
        this.total = total;
        this.status = OrderStatus.PAID;
    }
}
```

### 重构后

```java
public void settleOrder(Order order) {
    validateOrder(order);
    User user = loadUser(order);
    BigDecimal total = pricingService.calculateTotal(order, user);

    order.markPaid(total);
    orderRepository.save(order);

    notificationService.sendPaymentSuccess(user, order);
}
```

### 这个案例做对了什么

- 每一步都没有改变外部行为。
- 主流程只负责编排，读者可以快速看清业务步骤。
- 计价逻辑可以独立测试，不需要启动数据库或通知服务。
- 订单状态变化由 `Order` 自己管理，避免服务层直接操作内部字段。
- 折扣常量有了明确名字，后续调整不需要在代码里搜索魔法数字。

## 重构的常见误区

- **没有测试就大改**：重构的前提是能验证行为没有变化。
- **把重构和需求混在一起**：review 时无法区分“结构变化”和“行为变化”。
- **一次性重写**：大爆炸式重构难以定位问题，也几乎无法安全回滚。
- **为了模式而模式**：引入策略、工厂、责任链之前，先确认复杂度真的需要它们。
- **只改名字，不改职责**：命名改善了，但类或函数仍然承担过多职责。
- **过度提取微小函数**：每个函数只有一行，读者需要在调用链里来回跳转。
- **忽略性能热点**：重构前没有测量，结果把热点代码拆得更慢。
- **不更新注释和文档**：结构变了，旧注释会变成新的误导。

## 重构 Review 矩阵

| 维度 | 必须回答 | 不满足时怎么办 |
| --- | --- | --- |
| 行为 | 外部行为是否保持不变？ | 先补 characterization tests |
| 范围 | 是否只做一种重构？ | 拆成多个小提交 |
| 测试 | 每一步是否都能运行测试？ | 缩小步长，失败就回退 |
| 命名 | 新名字是否表达职责？ | 重新命名，避免只改表面 |
| 复杂度 | 是否真的降低了理解成本？ | 停止过度提取，必要时内联 |
| 回滚 | 是否可安全回退？ | 用版本控制和检查点 |

## 总结

重构的核心，是在不改变行为的前提下持续改善结构：

- 先识别代码异味，再选择手法，不要为了重构而重构。
- 用测试保护每一步，小步修改、小步验证、小步提交。
- 重构的目标是降低理解成本，而不是增加抽象层。

如果只能记住一件事：没有测试保障的大规模重构，本质上是在赌博。

## 参考与出处

本章的代码异味、重构手法和案例参考并整理了：

- Martin Fowler，《重构：改善既有代码的设计》。
- Robert C. Martin，《代码整洁之道》。

示例结合了当前 Java 工程实践做了改写，不是原文摘录。

## 相关阅读

- [代码规范与工程实践](/software-engineering/code-quality)
- [测试](/software-engineering/testing)
- [Code Review](/software-engineering/code-review)
- [设计模式](/software-engineering/design-patterns)
- [工程实践](/software-engineering/engineering-practice)
