---
title: 面向对象
description: 从类、对象、封装、继承和组合出发，理解 Java 对象模型与可维护的业务设计。
---

# 面向对象

> 面向对象不是“把代码塞进类里”，而是用对象边界表达业务概念、约束变化方向，并降低修改成本。

## 本章目标

学完本章，你应该能够：

- 解释类、对象、引用和实例之间的关系。
- 用封装保护对象的不变量。
- 在继承和组合之间做出合理选择。
- 理解多态、动态分派和接口的作用。
- 正确实现 `equals`、`hashCode`、`toString` 和不可变对象。
- 识别贫血模型、继承滥用和对象生命周期问题。

## 一、类与对象

类描述一类对象的共同结构和行为，对象是类在运行时的一个实例：

```java
public final class Order {
    private final long id;
    private OrderStatus status;

    public Order(long id) {
        if (id <= 0) {
            throw new IllegalArgumentException("id must be positive");
        }
        this.id = id;
        this.status = OrderStatus.CREATED;
    }

    public void pay() {
        if (status != OrderStatus.CREATED) {
            throw new IllegalStateException("only created order can be paid");
        }
        status = OrderStatus.PAID;
    }
}
```

这个类不只是“数据 + 方法”的容器，它还在维护一条业务规则：只有创建状态的订单才能支付。

### 对象包含什么

对象通常包含：

- **身份**：对象在内存中的引用，以及业务上的唯一标识。
- **状态**：字段的当前值。
- **行为**：对象可以执行的操作。
- **不变量**：对象在任何合法状态下都必须满足的约束。

例如订单对象的不变量可能是：

- 金额不能为负数。
- 已取消订单不能再支付。
- 已支付订单不能直接修改金额。

面向对象设计的核心之一，就是把这些不变量放进对象内部，而不是散落在各个 service 中。

## 二、封装

封装不是简单地把字段改成 `private`，而是控制外部代码能如何观察和修改对象。

### 访问控制

| 修饰符 | 同类 | 同包 | 子类 | 其他 |
| --- | --- | --- | --- | --- |
| `private` | 是 | 否 | 否 | 否 |
| 包私有（无修饰符） | 是 | 是 | 否 | 否 |
| `protected` | 是 | 是 | 是 | 否 |
| `public` | 是 | 是 | 是 | 是 |

原则：

- 字段优先使用 `private`。
- 只暴露必要的构造器和方法。
- 返回可变对象时考虑防御性复制。
- 不要为了让测试方便而破坏封装。

### 不变量由对象维护

```java
public final class Money {
    private final BigDecimal amount;
    private final String currency;

    public Money(BigDecimal amount, String currency) {
        if (amount == null || amount.signum() < 0) {
            throw new IllegalArgumentException("amount must not be negative");
        }
        if (currency == null || currency.isBlank()) {
            throw new IllegalArgumentException("currency must not be blank");
        }
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("currency mismatch");
        }
        return new Money(amount.add(other.amount), currency);
    }
}
```

外部代码不能创建负金额，也不能直接把两个币种相加。规则只在一个地方维护。

### 防御性复制

```java
public final class Team {
    private final List<String> members;

    public Team(List<String> members) {
        this.members = List.copyOf(members);
    }

    public List<String> members() {
        return members;
    }
}
```

如果直接保存传入的集合，调用方之后修改集合会影响对象内部状态。如果直接返回内部集合，外部也能绕过封装修改它。

## 三、构造器与初始化

### 构造器的作用

构造器负责把对象从“已分配内存”变成“满足不变量的合法对象”：

```java
public class User {
    private final String username;
    private final String email;

    public User(String username, String email) {
        this.username = requireText(username, "username");
        this.email = requireText(email, "email");
    }

    private static String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " must not be blank");
        }
        return value;
    }
}
```

构造器抛异常时，对象不会被成功创建。调用方不应拿到一个“半初始化”的对象。

### 初始化顺序

创建一个子类对象时，大致顺序是：

1. 父类静态字段和静态初始化块。
2. 子类静态字段和静态初始化块。
3. 父类实例字段和实例初始化块。
4. 父类构造器。
5. 子类实例字段和实例初始化块。
6. 子类构造器。

示例：

::: details 展开：完整初始化顺序示例
```java
class Parent {
    static { System.out.println("parent static"); }
    { System.out.println("parent instance"); }

    Parent() {
        System.out.println("parent constructor");
    }
}

class Child extends Parent {
    static { System.out.println("child static"); }
    { System.out.println("child instance"); }

    Child() {
        System.out.println("child constructor");
    }
}
```

输出顺序：

```text
parent static
child static
parent instance
parent constructor
child instance
child constructor
```
:::

理解初始化顺序，可以解释为什么在父构造器中调用可被子类重写的方法很危险：子类字段可能还没有初始化。

### `this` 与 `super`

```java
public final class Admin extends User {
    private final Set<String> permissions;

    public Admin(String username, String email, Set<String> permissions) {
        super(username, email);
        this.permissions = Set.copyOf(permissions);
    }
}
```

- `this(...)` 调用同类其他构造器。
- `super(...)` 调用父类构造器。
- 传统 Java 要求它们必须是构造器的第一条语句。
- Java 25 的灵活构造器允许在显式 `super(...)` / `this(...)` 前执行不引用当前对象的校验或计算语句。

### 构造器重载

```java
public Order(long id) {
    this(id, List.of());
}

public Order(long id, List<OrderItem> items) {
    this.id = id;
    this.items = List.copyOf(items);
}
```

重载构造器应避免大量重复校验。可以集中到一个主构造器，其余构造器只负责提供默认值。

## 四、继承

继承表达“is-a”关系：

```java
public abstract class Account {
    private final String owner;
    private BigDecimal balance;

    protected Account(String owner) {
        this.owner = owner;
        this.balance = BigDecimal.ZERO;
    }

    public void deposit(BigDecimal amount) {
        requirePositive(amount);
        balance = balance.add(amount);
    }

    public abstract BigDecimal withdrawLimit();
}

public final class SavingsAccount extends Account {
    @Override
    public BigDecimal withdrawLimit() {
        return new BigDecimal("10000");
    }
}
```

继承的代价：

- 子类依赖父类的实现细节。
- 父类修改可能破坏子类。
- 继承层次过深时，理解和测试成本上升。
- Java 只支持单继承，但可以通过接口组合能力。

### 不要把继承当成代码复用

如果两个类只是共享一段实现，但不存在真正的“is-a”关系，优先使用组合：

```java
public final class OrderService {
    private final PaymentGateway paymentGateway;
    private final OrderRepository orderRepository;

    public OrderService(
        PaymentGateway paymentGateway,
        OrderRepository orderRepository
    ) {
        this.paymentGateway = paymentGateway;
        this.orderRepository = orderRepository;
    }
}
```

组合让依赖关系显式，也更容易替换和测试。

### 里氏替换原则

子类对象应该能够替换父类对象，而不破坏调用方的预期：

```java
Account account = new SavingsAccount();
account.deposit(new BigDecimal("100"));
```

如果 `SavingsAccount` 拒绝所有存款，或者改变了 `deposit` 的基本语义，就违反了里氏替换原则。

### 继承中的方法调用

```java
class Parent {
    void render() {
        System.out.println("parent");
    }
}

class Child extends Parent {
    @Override
    void render() {
        System.out.println("child");
    }
}
```

Java 方法调用默认是动态分派：运行时根据对象的实际类型选择重写方法。字段访问不是多态的，字段在编译期按引用类型解析。

## 五、多态

多态让调用方依赖稳定接口，而不依赖具体实现：

```java
public interface PaymentGateway {
    PaymentResult pay(PaymentCommand command);
}

public final class AlipayGateway implements PaymentGateway {
    @Override
    public PaymentResult pay(PaymentCommand command) {
        // 调用支付宝
        return PaymentResult.success();
    }
}

public final class OrderService {
    private final PaymentGateway gateway;

    public OrderService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public PaymentResult pay(Order order) {
        return gateway.pay(PaymentCommand.from(order));
    }
}
```

`OrderService` 不知道支付渠道的具体实现，只依赖 `PaymentGateway`。新增微信支付时，不需要修改订单服务。

### 多态的前提

- 有继承或接口实现关系。
- 子类重写父类方法。
- 通过父类或接口引用调用方法。
- 运行时根据实际对象类型分派。

多态不等于“写一个接口再随便加一个实现”。接口应该表达稳定的能力边界，而不是为了形式上的解耦。

## 六、抽象类与接口

### 抽象类

抽象类适合表达“共享部分实现和状态”的基类：

```java
public abstract class AbstractImporter {
    public final ImportResult importFile(Path path) {
        validate(path);
        List<Row> rows = read(path);
        return save(rows);
    }

    protected abstract List<Row> read(Path path);

    protected abstract ImportResult save(List<Row> rows);
}
```

模板方法模式可以把固定流程放在父类，把变化点留给子类。

### 接口

接口适合表达能力：

```java
public interface Auditable {
    AuditRecord toAuditRecord();
}

public interface Cacheable<K, V> {
    Optional<V> get(K key);
    void put(K key, V value);
}
```

Java 8 之后，接口可以包含 `default` 和 `static` 方法：

```java
public interface Named {
    String name();

    default String displayName() {
        return name().strip();
    }
}
```

默认方法适合提供兼容性扩展，但不应把大量状态和复杂逻辑塞进接口。

### 接口冲突

如果一个类实现的两个接口提供同名默认方法，编译器会要求显式解决：

```java
public class Both implements A, B {
    @Override
    public void run() {
        A.super.run();
    }
}
```

这说明默认方法并不是“无成本的多继承”。

## 七、`Object` 的核心方法

### `equals`

`equals` 应表达逻辑相等：

```java
@Override
public boolean equals(Object other) {
    if (this == other) {
        return true;
    }
    if (!(other instanceof User user)) {
        return false;
    }
    return username.equals(user.username);
}
```

`equals` 契约：

- 自反：`x.equals(x)` 为 `true`。
- 对称：`x.equals(y)` 与 `y.equals(x)` 一致。
- 传递：`x.equals(y)` 且 `y.equals(z)`，则 `x.equals(z)`。
- 一致：对象未变化时，多次调用结果一致。
- 非空：`x.equals(null)` 为 `false`。

### `hashCode`

如果重写 `equals`，必须同时重写 `hashCode`：

```java
@Override
public int hashCode() {
    return Objects.hash(username);
}
```

相等的对象必须有相同的哈希值；不相等的对象可以有相同哈希值。`HashMap`、`HashSet` 依赖这个契约。

### `toString`

`toString` 应该提供调试和日志所需的可读信息：

```java
@Override
public String toString() {
    return "User{username='%s'}".formatted(username);
}
```

不要把密码、令牌、身份证号等敏感信息放进 `toString`。

### `record` 自动生成

```java
public record UserKey(String username) {
}
```

`record` 自动生成基于组件的 `equals`、`hashCode` 和 `toString`，适合不可变值对象。

## 八、不可变对象

不可变对象创建后状态不再变化，天然线程安全，也更容易推理。

### 不可变类的基本做法

```java
public final class UserProfile {
    private final String username;
    private final List<String> roles;

    public UserProfile(String username, List<String> roles) {
        this.username = username;
        this.roles = List.copyOf(roles);
    }

    public String username() {
        return username;
    }

    public List<String> roles() {
        return roles;
    }

    public UserProfile withRoles(List<String> newRoles) {
        return new UserProfile(username, newRoles);
    }
}
```

关键点：

- 类声明为 `final`，防止子类破坏不可变性。
- 字段声明为 `private final`。
- 不提供修改状态的方法。
- 对可变输入和输出做防御性复制。
- 修改操作返回新对象，而不是修改原对象。

### 不可变的边界

不可变对象适合值对象、配置、事件和并发共享数据。它不适合需要频繁更新的大型对象图，因为每次修改都会产生新对象。

## 九、嵌套类

### 静态嵌套类

```java
public final class Order {
    public static final class Item {
        private final String productId;
        private final int quantity;

        public Item(String productId, int quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
    }
}
```

静态嵌套类不持有外部类实例，适合表达与外部类相关但独立的类型。

### 内部类

```java
public final class Outer {
    private int value;

    public final class Inner {
        public int current() {
            return value;
        }
    }
}
```

内部类隐式持有外部类引用。如果内部类对象生命周期超过外部类，可能导致内存泄漏。大多数场景优先使用静态嵌套类。

### 匿名类与 Lambda

```java
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("run");
    }
};

Runnable shorter = () -> System.out.println("run");
```

Lambda 适合函数式接口。需要状态、多个方法或复杂生命周期时，使用普通类或匿名类。

## 十、枚举

枚举表达有限集合：

```java
public enum OrderStatus {
    CREATED,
    PAID,
    CANCELLED;

    public boolean canPay() {
        return this == CREATED;
    }
}
```

枚举比字符串常量更安全：

- 编译期限制取值范围。
- 可以携带字段和方法。
- `switch` 可以使用穷尽性检查。
- 序列化和单例语义更可控。

不要把外部协议中会变化的开放值集合硬编码成枚举；枚举适合稳定的业务状态。

## 十一、设计原则

### 单一职责

一个类应该只有一个引起它变化的原因：

```java
// 不推荐：同时负责业务计算、持久化和通知
public class OrderService {
    public void createOrder() {}
    public void saveToDatabase() {}
    public void sendEmail() {}
}
```

更好的做法是把持久化、通知和业务编排拆成不同协作者。

### 开闭原则

对扩展开放，对修改关闭。新增支付方式时，优先新增实现，而不是在 `if/else` 中不断修改已有代码。

### 依赖倒置

高层业务依赖抽象，底层实现依赖抽象：

```java
public interface OrderRepository {
    void save(Order order);
}
```

业务服务依赖 `OrderRepository`，而不是直接依赖 MyBatis Mapper 或 JDBC。

### 接口隔离

不要设计一个大而全的接口：

```java
// 不推荐
public interface UserService {
    void create();
    void delete();
    void export();
    void sendEmail();
}
```

按使用方拆成更小的能力接口，减少不必要的实现负担。

## 十二、常见陷阱

::: warning 优先检查这三类问题
业务规则是否散落在 Service 中？继承是否只是为了复用代码？`equals` 和 `hashCode` 是否成对重写？
:::

| 陷阱 | 后果 | 改进 |
| --- | --- | --- |
| 贫血模型，所有逻辑都在 Service | 业务规则分散、难复用 | 把不变量放进领域对象 |
| 为了复用而继承 | 父类变化破坏子类 | 优先组合 |
| 公开可变字段 | 外部绕过校验 | `private` + 方法 |
| 返回内部可变集合 | 封装失效 | 返回不可变副本 |
| 重写 `equals` 不重写 `hashCode` | 集合行为异常 | 同时重写 |
| 可变对象作为 Map key | 无法查回 | 使用不可变 key |
| 构造器中调用可重写方法 | 子类未初始化 | 避免在构造器调用可重写方法 |
| 内部类持有外部引用 | 内存泄漏 | 优先静态嵌套类 |
| 用字符串表示有限状态 | 非法值进入系统 | 使用枚举 |
| 过度使用设计模式 | 代码复杂、难理解 | 先解决真实变化 |

## 十三、练习

1. 设计一个 `BankAccount` 类，保证余额不能为负，并实现存款、取款和转账。
2. 用组合重构一个通过继承复用日志和缓存逻辑的类。
3. 实现一个不可变 `Address` 值对象，包含防御性复制和 `with` 方法。
4. 设计 `PaymentGateway` 接口和两个实现，在不修改订单服务的前提下新增支付方式。
5. 解释为什么在父类构造器中调用可重写方法可能出错，并写一个示例。
6. 用枚举表达订单状态，并实现合法状态迁移。
7. 为一个类实现 `equals`、`hashCode` 和 `toString`，然后放入 `HashSet` 验证行为。
## 总结
学完本章，你应该已经掌握：
.
- 封装、继承、多态和组合的取舍。
- 初始化顺序、final/static 语义。
- 用接口和组合替代过度继承。
如果只能记住一件事：优先组合，继承只在真正的 is-a 关系里使用。

## 相关阅读

- [语言基础](/programming-language/java/basics)
- [泛型与类型系统](/programming-language/java/generics)
- [设计模式](/software-engineering/design-patterns)
- [DDD](/software-engineering/ddd)
- [代码规范与工程实践](/software-engineering/code-quality)
