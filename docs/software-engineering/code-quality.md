---
title: 代码规范与工程实践
description: 一套跨语言的代码质量准则：命名、函数、注释、异常、测试、Java 专项与 Code Review 清单。
---

# 代码规范与工程实践

> 代码首先是写给人看的，其次才是交给机器执行的。

这份手册不替代具体语言的语法书。它把《代码整洁之道》《Effective Java》《代码大全》《重构》《软件工程：Google 工程实践》和 Google Style Guides 中的工程思想，整理成一套可以落地、可以 review、也可以跨语言迁移的规则。

## 本章目标

学完本章，你应该能够：

- 用 MUST / SHOULD / MAY 判断规则的优先级。
- 应用命名、函数、注释、异常和测试规范。
- 识别 Java 高频坑和跨语言编码差异。
- 用 Code Review 清单把规范落到日常开发。

## 怎么使用这份手册

每条规则包含四个部分：

- **等级**：必须（MUST）、应该（SHOULD）、建议（MAY）。
- **语言**：规则适用的语言；没有特别标注时，默认跨语言。
- **理由**：为什么这条规则值得遵守。
- **依据**：主要来源书籍或规范。

| 等级 | 含义 | 落地方式 |
| --- | --- | --- |
| 必须（MUST） | 强制遵守，违反通常会导致错误、明显不一致或维护风险 | 写入 linter、formatter、CI 或团队硬性规范 |
| 应该（SHOULD） | 强烈推荐，除非有明确理由，否则应遵守 | 写入 Code Review 清单 |
| 建议（MAY） | 视场景选择，不是教条 | 根据项目阶段、团队规模、性能要求判断 |

> 规范的目的不是让所有人写出完全一样的代码，而是降低理解成本、减少低级错误，并让代码在变化中保持可控。

## 一、基本原则

| 原则 | 一句话解释 |
| --- | --- |
| 可读性优先 | 代码首先是写给人看的，其次才是交给机器执行的 |
| 简单优先 | 不要为了展示技术而引入不必要的复杂性 |
| 明确优先 | 明确表达意图，避免隐晦的实现方式 |
| 单一职责 | 一个函数、类、模块应当有明确且单一的职责 |
| 避免重复 | 相同的业务逻辑不应在多个地方重复实现 |
| 面向变化 | 设计时考虑未来可能发生的变化，但不要提前实现变化 |
| 可测试性 | 代码应当便于测试，而不是只能靠运行整个程序验证 |
| 一致性 | 同一个项目应当遵循统一的编码风格 |

核心思想：

> 优秀的代码不只是能够正确运行，更应该容易理解、容易修改、容易扩展。

## 二、命名规范

命名是最便宜的文档。一个好的名字可以让读者不需要跳转到定义，也不需要阅读实现。

### 2.1 类型与接口

#### R1 类名使用 PascalCase

`[必须-MUST] [Java / TypeScript / Python / Kotlin / Rust / C#]`

```java
// 反例
public class user_service {}
public class userservice {}

// 正例
public class UserService {}
public class OrderRepository {}
```

**理由**：统一的大驼峰形式可以让读者快速识别类型；这也是主流语言社区的共同约定。

**依据**：Google Java Style Guide、《Effective Java》

#### R2 类名必须具有明确的业务含义

`[必须-MUST] [Java / TypeScript / Python / Go]`

```java
// 反例
public class Data {}
public class Manager {}
public class Handler {}

// 正例
public class UserRepository {}
public class OrderManager {}
public class PaymentHandler {}
```

**理由**：类名应当表达它代表的业务对象或职责，而不是使用过于宽泛的名称。

> `Manager`、`Handler`、`Util` 不是绝对禁止。如果它们确实是职责的一部分，可以使用；但如果只是用来掩盖模糊职责，就应该重新命名或拆分。

**依据**：《代码整洁之道》《代码大全》

#### R3 接口名称应表达能力或抽象概念

`[应该-SHOULD] [Java / Kotlin / C#]`

```java
// 推荐
public interface PaymentService {}
public interface UserRepository {}
public interface CacheProvider {}

// 不推荐
public interface IPaymentService {}
public interface IUserRepository {}
```

**理由**：Java 的类型系统已经能够表达“这是一个接口”，`I` 前缀通常只会增加噪音。

**依据**：Google Java Style Guide、《Effective Java》

### 2.2 方法命名

#### R4 方法名使用 lowerCamelCase

`[必须-MUST] [Java / TypeScript / JavaScript / Kotlin]`

```java
// 反例
public void CreateUser() {}
public void create_user() {}

// 正例
public void createUser() {}
public void deleteUser() {}
```

**理由**：统一方法命名规范，降低阅读成本。

**依据**：Google Java Style Guide、《Effective Java》

#### R5 方法名应表达具体行为

`[应该-SHOULD] [所有语言]`

```java
// 反例
public void handle() {}
public void process() {}
public void execute() {}

// 正例
public void validateUser() {}
public void calculateTotalPrice() {}
public void sendNotification() {}
```

**理由**：看到方法名就应该能够大致理解它的用途，而不是必须阅读实现。

**依据**：《代码整洁之道》《代码大全》

#### R6 布尔变量和方法使用具有判断含义的名称

`[应该-SHOULD] [Java / TypeScript / JavaScript / Kotlin]`

```java
// 推荐
boolean isActive;
boolean hasPermission;
boolean canPurchase;

boolean isUserValid();
boolean hasEnoughBalance();

// 不推荐
boolean active;
boolean permission;
boolean check();
```

**理由**：布尔名称应当能够自然地表达一个真假判断。

**依据**：《代码整洁之道》《代码大全》

### 2.3 变量命名

#### R7 变量名必须具有明确含义

`[必须-MUST] [所有语言]`

```java
// 反例
int a = 100;
int b = 200;
String s = "admin";

// 正例
int userCount = 100;
int orderCount = 200;
String username = "admin";
```

**理由**：变量名称是代码的第一层文档。

**依据**：《代码整洁之道》《代码大全》

#### R8 避免无意义的缩写

`[应该-SHOULD] [所有语言]`

```java
// 反例
int usrCnt;
String ordInf;
double prc;

// 正例
int userCount;
String orderInformation;
double price;
```

广泛使用的缩写可以保留，例如 `userId`、`httpRequest`、`url`、`jsonData`。

**理由**：减少理解代码所需要的上下文。

**依据**：《代码整洁之道》《代码大全》

#### R9 集合变量应体现复数含义

`[应该-SHOULD] [所有语言]`

```java
// 反例
List<User> user;
List<Order> data;

// 正例
List<User> users;
List<Order> orders;
```

**理由**：通过变量名称区分单个对象和对象集合。

**依据**：《代码整洁之道》

#### R10 常量必须使用具有明确含义的名称

`[应该-SHOULD] [Java / Python / TypeScript / Rust / Kotlin]`

```java
// 推荐
private static final int MAX_RETRY_COUNT = 3;
private static final long DEFAULT_TIMEOUT_MILLIS = 5000L;

// 不推荐
private static final int a = 3;
private static final int x = 5000;
```

**理由**：常量应当能够直接说明自身的业务含义。

> 只提取有业务含义的魔法值。循环里的 `0`、`1`，或者显而易见的数组下标，不需要为了“常量化”而增加噪音。

**依据**：Google Java Style Guide、《Effective Java》

## 三、函数设计

函数是代码质量最容易被感知的地方。一个函数是否清晰，通常决定了这段代码是否容易修改。

### 3.1 单一职责

#### R11 一个函数只承担一个明确的职责

`[必须-MUST] [所有语言]`

```java
// 反例：注册流程里混入了太多职责
public void registerUser(User user) {
    validateUser(user);
    saveUser(user);
    sendEmail(user);
    createDefaultSettings(user);
    updateStatistics(user);
}

// 正例：主流程只负责编排
public void registerUser(User user) {
    validateUser(user);
    User savedUser = saveUser(user);
    initializeUser(savedUser);
    sendWelcomeEmail(savedUser);
}

private void initializeUser(User user) {
    createDefaultSettings(user);
    updateStatistics(user);
}
```

**理由**：降低函数复杂度，减少修改时的影响范围，提高复用性和可测试性。

> 单一职责不意味着一个函数只能有一行代码，也不意味着必须无限拆分。关键在于函数是否具有统一、明确的目的。

**依据**：《代码整洁之道》《代码大全》

#### R12 控制函数长度，避免过长方法

`[应该-SHOULD] [所有语言]`

```java
// 反例：主流程被实现细节淹没
public void processOrder(Order order) {
    // 1. 参数校验
    // 2. 查询用户
    // 3. 查询商品
    // 4. 检查库存
    // 5. 计算金额
    // 6. 扣减库存
    // 7. 创建订单
    // 8. 发送通知
    // 9. 更新统计
}

// 正例：主流程体现业务步骤
public void processOrder(Order order) {
    validateOrder(order);
    User user = loadUser(order);
    checkInventory(order);
    BigDecimal total = calculateTotal(order, user);
    Order savedOrder = createOrder(order, user, total);
    notificationService.sendOrderCreated(savedOrder);
}
```

**理由**：让函数的主体体现业务流程，而不是被具体实现细节淹没。

**依据**：《代码整洁之道》《代码大全》

### 3.2 参数设计

#### R13 尽量减少函数参数数量

`[应该-SHOULD] [所有语言]`

```java
// 反例
public void createUser(
    String username,
    String password,
    String email,
    String phone,
    String address,
    Integer age
) {}

// 正例
public void createUser(UserCreateRequest request) {}
```

**理由**：减少调用复杂度，避免参数顺序错误，也便于后续增加字段。

> 参数对象不是万能药。如果只有两个参数，直接传递通常更清晰；只有当参数经常一起出现，或数量已经影响可读性时，才值得引入参数对象。

**依据**：《代码整洁之道》《代码大全》

#### R14 避免使用布尔参数控制函数行为

`[应该-SHOULD] [所有语言]`

```java
// 反例：true 究竟代表什么？
sendMessage(user, true);

// 正例
sendEmailNotification(user);
sendSmsNotification(user);

// 如果确实需要统一入口
sendNotification(user, NotificationType.EMAIL);
```

**理由**：避免调用者必须阅读函数内部实现才能理解参数含义。

**依据**：《代码整洁之道》

### 3.3 返回值设计

#### R15 函数应具有明确的返回语义

`[应该-SHOULD] [所有语言]`

```java
// 反例：0、1、2 分别代表什么？
public int processUser(User user) {
    return 1;
}

// 正例
public UserStatus processUser(User user) {
    return UserStatus.ACTIVE;
}

public boolean isUserValid(User user) {
    return true;
}
```

**理由**：返回值应当具有清晰的业务含义，而不是依赖调用方记住一组魔法数字。

**依据**：《代码整洁之道》《Effective Java》

#### R16 不要用 null 表示多种不同的业务状态

`[应该-SHOULD] [Java / Kotlin / TypeScript]`

```java
// 反例
public User findUser(Long id) {
    return null;
}

// 正例
public Optional<User> findUser(Long id) {
    return Optional.empty();
}
```

**理由**：明确表达“可能不存在”的结果，减少空指针问题。

> `Optional` 更适合作为可能缺失的返回值，而不是无条件用于字段、方法参数或集合元素。

**依据**：《Effective Java》

## 四、代码结构与设计

### 4.1 避免重复

#### R17 相同的业务逻辑不得在多个位置重复实现

`[必须-MUST] [所有语言]`

```java
// 反例
public void createUser() {
    if (username == null || username.isEmpty()) {
        throw new IllegalArgumentException();
    }
}

public void updateUser() {
    if (username == null || username.isEmpty()) {
        throw new IllegalArgumentException();
    }
}

// 正例
private void validateUsername(String username) {
    if (username == null || username.isBlank()) {
        throw new IllegalArgumentException("用户名不能为空");
    }
}

public void createUser() {
    validateUsername(username);
}

public void updateUser() {
    validateUsername(username);
}
```

**理由**：降低维护成本，避免同一逻辑出现不同实现；修复问题时只需要修改一个地方。

**依据**：《代码整洁之道》《重构》

### 4.2 避免过度设计

#### R18 不要为尚未出现的需求提前引入复杂架构

`[应该-SHOULD] [所有语言]`

只有一个简单的商品查询功能，却设计出十几个接口、多层抽象工厂、复杂的策略注册机制和多个没有实际意义的中间层，这就是过度设计。

更合理的做法是：先解决当前明确存在的问题；当第二个、第三个真实用例出现时，再根据变化方向进行抽象。

**理由**：过度设计会增加理解成本和维护成本，而且提前抽象的方向很可能是错的。

**依据**：《代码大全》《软件工程：Google 工程实践》

#### R19 优先组合而不是盲目继承

`[应该-SHOULD] [Java / TypeScript / C# / C++]`

```java
// 反例
class AdminUser extends NormalUser {}
class VipUser extends NormalUser {}
class GuestUser extends NormalUser {}

// 正例
class User {
    private final UserRole role;
    private final Permission permission;
}
```

**理由**：降低继承关系带来的耦合，避免复杂的继承体系；组合通常更容易替换和测试。

**依据**：《Effective Java》

#### R20 优先使用不可变对象

`[应该-SHOULD] [Java / Kotlin / TypeScript / Rust]`

```java
public record UserInfo(
    Long id,
    String username,
    String email
) {}
```

**理由**：减少状态变化，降低并发问题，提高程序可预测性。

> `record` 只保证引用不可变；如果字段本身是可变集合或可变对象，仍然需要在构造时做防御性拷贝。

**依据**：《Effective Java》《代码整洁之道》

### 4.3 控制复杂度

#### R21 避免过深的条件嵌套

`[应该-SHOULD] [所有语言]`

```java
// 反例
if (user != null) {
    if (user.isActive()) {
        if (user.hasPermission()) {
            if (user.getBalance() > 0) {
                purchase();
            }
        }
    }
}

// 正例：卫语句
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

purchase();
```

**理由**：减少嵌套层级，提前处理异常情况，让正常业务流程更加清晰。

**依据**：《重构》《代码整洁之道》

#### R22 避免复杂的三元表达式

`[应该-SHOULD] [所有语言]`

```java
// 反例
String result = user == null ? "未知" :
    user.isActive() ? "正常" :
    user.isLocked() ? "锁定" : "异常";

// 正例
String result;
if (user == null) {
    result = "未知";
} else if (user.isActive()) {
    result = "正常";
} else if (user.isLocked()) {
    result = "锁定";
} else {
    result = "异常";
}
```

**理由**：可读性优先于代码行数。简单的三元表达式可以保留，例如 `String label = active ? "启用" : "停用";`。

**依据**：《代码整洁之道》

## 五、注释规范

### 5.1 注释解释原因

#### R23 注释应解释为什么，而不是重复代码做了什么

`[应该-SHOULD] [所有语言]`

```java
// 反例
// 将用户年龄设置为 18
user.setAge(18);

// 正例
// 未成年用户不允许开通该服务，因此这里使用最低年龄阈值。
if (user.getAge() < MINIMUM_SERVICE_AGE) {
    throw new ServiceNotAllowedException();
}
```

**理由**：代码本身应该能够说明“做了什么”，注释应该补充代码无法直接表达的约束、背景和取舍。

**依据**：《代码整洁之道》《代码大全》

#### R24 复杂算法必须提供必要的注释

`[应该-SHOULD] [所有语言]`

```java
// Fisher-Yates 洗牌：从后向前交换，保证每种排列概率相同。
for (int i = players.length - 1; i > 0; i--) {
    int j = random.nextInt(i + 1);
    Player temp = players[i];
    players[i] = players[j];
    players[j] = temp;
}
```

**理由**：复杂算法的实现细节不一定能够通过简单阅读立即理解。

**依据**：《代码整洁之道》《代码大全》

#### R25 修改代码时同步维护相关注释

`[必须-MUST] [所有语言]`

```java
// 反例
// 最多重试 3 次
private static final int MAX_RETRY_COUNT = 5;

// 正例
// 最多重试 5 次
private static final int MAX_RETRY_COUNT = 5;
```

**理由**：过时注释比没有注释更危险，它会主动误导读者。

**依据**：《代码整洁之道》

## 六、异常与错误处理

### 6.1 不要吞掉异常

#### R26 不允许静默吞掉异常

`[必须-MUST] [Java / Python / TypeScript / Go]`

```java
// 反例
try {
    saveUser(user);
} catch (Exception e) {
}

// 正例
try {
    userRepository.save(user);
} catch (DataAccessException e) {
    log.error("保存用户失败，userId={}", user.getId(), e);
    throw new UserSaveException("用户保存失败", e);
}
```

**理由**：异常被吞掉后，问题很难追踪，可能导致数据不一致。

> 如果当前层无法处理异常，就带上上下文继续抛出；不要为了“让程序继续跑”而隐藏错误。

**依据**：《Effective Java》《代码整洁之道》

### 6.2 使用具体异常

#### R27 使用具体异常，而不是随意抛出通用异常

`[应该-SHOULD] [Java / Python / TypeScript]`

```java
// 不推荐
throw new RuntimeException("用户不存在");

// 推荐
throw new UserNotFoundException(id);
```

**理由**：让异常本身表达具体的错误原因，调用方才能做出正确的处理决策。

> 不要为每一种错误都创建一个异常类。按照“调用方需要如何区分和处理”来设计异常类型。

**依据**：《Effective Java》

### 6.3 异常用于异常情况

#### R28 不要使用异常处理正常业务流程

`[应该-SHOULD] [Java / Python / TypeScript / Go]`

```java
// 反例
try {
    return legacyUserClient.getUser(id);
} catch (UserNotFoundException e) {
    return null;
}

// 正例
return userRepository.findById(id)
    .orElseThrow(() -> new UserNotFoundException(id));
```

**理由**：异常应该用于处理异常情况，而不是代替普通条件判断。可预期的“不存在”可以用 `Optional`、结果类型或明确的状态表达。

**依据**：《Effective Java》

## 七、集合与数据处理

### 7.1 面向接口编程

#### R29 优先使用接口类型声明集合

`[应该-SHOULD] [Java / Kotlin]`

```java
// 不推荐
ArrayList<User> users = new ArrayList<>();

// 推荐
List<User> users = new ArrayList<>();
```

**理由**：面向接口编程，降低对具体实现的依赖；需要 `ArrayList` 特有方法时再使用具体类型。

**依据**：《Effective Java》

### 7.2 避免循环内的重复成本

#### R30 不要在循环中重复执行可以提前完成的高成本操作

`[应该-SHOULD] [所有语言]`

```java
// 反例：循环内逐条查询，典型的 N+1 问题
for (Order order : orders) {
    User user = userRepository.findById(order.getUserId())
        .orElseThrow();
    order.setUserName(user.getName());
}

// 正例：先批量查询，再在内存中匹配
Set<Long> userIds = orders.stream()
    .map(Order::getUserId)
    .collect(Collectors.toSet());

Map<Long, User> usersById = userRepository.findAllById(userIds).stream()
    .collect(Collectors.toMap(User::getId, Function.identity()));

for (Order order : orders) {
    User user = usersById.get(order.getUserId());
    order.setUserName(user.getName());
}
```

**理由**：循环内的远程调用、数据库查询和重复计算会被放大成明显的性能问题。

> Java 标准集合的 `size()` 通常是 O(1)，不要为了省一次 `size()` 调用而牺牲可读性。真正应该关注的是循环内的远程调用、重复计算和 N+1 查询。

**依据**：《Effective Java》《软件工程：Google 工程实践》

### 7.3 避免不必要的对象创建

#### R31 避免不必要的对象创建

`[应该-SHOULD] [Java / C# / Go]`

```java
// 反例
for (int i = 0; i < 10000; i++) {
    String message = new String("Hello");
}

// 正例
String message = "Hello";
for (int i = 0; i < 10000; i++) {
    // 使用 message
}
```

**理由**：减少不必要的内存分配，同时避免用隐蔽的写法绕过语言本身的优化。

> 不要为了微小的性能收益牺牲清晰度。先测量，再优化；大多数业务代码的可读性比一次对象分配更重要。

**依据**：《Effective Java》《代码大全》

## 八、测试规范

### 8.1 测试保护重构

#### R32 重要业务逻辑必须具有对应的测试

`[必须-MUST] [所有语言]`

```java
@Test
void shouldRejectBlankUsername() {
    assertThrows(
        IllegalArgumentException.class,
        () -> userService.createUser(new UserCreateRequest("", "password"))
    );
}
```

**理由**：降低修改引入回归问题的风险，验证业务逻辑正确性，也为后续重构提供安全保障。

**依据**：《代码整洁之道》《重构》《软件工程：Google 工程实践》

#### R33 测试名称应描述测试场景和预期结果

`[应该-SHOULD] [所有语言]`

```java
// 不推荐
@Test
void test1() {}

// 推荐
@Test
void shouldReturnEmptyWhenUserDoesNotExist() {}
```

**理由**：测试代码本身也是项目文档。

**依据**：《代码整洁之道》

#### R34 测试应当相互独立

`[应该-SHOULD] [所有语言]`

测试不应该依赖其他测试的执行顺序，也不应该依赖无法控制的外部状态。

**理由**：保证测试结果稳定、可重复，避免“单独运行通过、全量运行失败”的问题。

**依据**：《软件工程：Google 工程实践》

## 九、Java 专项规范

### 9.1 类型与数据

#### R35 使用泛型，避免原始类型

`[必须-MUST] [Java]`

```java
// 反例
List users = new ArrayList();

// 正例
List<User> users = new ArrayList<>();
```

**理由**：把类型错误从运行时提前到编译期，并让代码意图更明确。

**依据**：《Effective Java》

#### R36 优先使用枚举表示固定集合

`[应该-SHOULD] [Java / TypeScript / Kotlin / Rust]`

```java
// 反例
int status = 1;

// 正例
public enum OrderStatus {
    PENDING,
    PAID,
    CANCELLED
}
```

**理由**：枚举比整数常量更具类型安全性和可读性。

**依据**：《Effective Java》

#### R37 使用 BigDecimal 处理精确金额

`[应该-SHOULD] [Java]`

```java
// 反例
double price = 0.1 + 0.2;

// 正例
BigDecimal price = new BigDecimal("0.1")
    .add(new BigDecimal("0.2"));
```

**理由**：`double` 无法精确表示十进制小数，金额计算容易出现精度问题。

> 不要使用 `new BigDecimal(double)`，它会把二进制浮点误差原样带入；优先使用字符串构造或 `BigDecimal.valueOf`。

**依据**：《Effective Java》

### 9.2 资源与状态

#### R38 优先使用 try-with-resources 管理资源

`[应该-SHOULD] [Java]`

```java
// 反例
FileInputStream input = null;
try {
    input = new FileInputStream("test.txt");
    // 读取文件
} finally {
    if (input != null) {
        input.close();
    }
}

// 正例
try (FileInputStream input = new FileInputStream("test.txt")) {
    // 读取文件
}
```

**理由**：减少样板代码，避免资源泄漏，并正确处理关闭时的异常。

**依据**：《Effective Java》

#### R39 谨慎使用静态方法和静态可变状态

`[应该-SHOULD] [Java / Kotlin / C#]`

```java
// 反例
public class UserManager {
    public static List<User> users = new ArrayList<>();
}

// 正例
public class UserManager {
    private final List<User> users = new ArrayList<>();
}
```

**理由**：静态可变状态容易造成全局耦合、并发问题和测试困难。

**依据**：《Effective Java》《代码整洁之道》

## 十、跨语言编码风格

不同语言有不同的官方规范和社区惯例，不应该强行统一所有语法风格。

| 语言 | 类型/类 | 函数/方法 | 变量 | 常量 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Java | PascalCase | camelCase | camelCase | UPPER_SNAKE_CASE | 包名全小写 |
| Python | PascalCase | snake_case | snake_case | UPPER_SNAKE_CASE | 模块和包使用 snake_case |
| TypeScript | PascalCase | camelCase | camelCase | 模块级 UPPER_SNAKE_CASE，局部 camelCase | 类型和接口使用 PascalCase |
| JavaScript | PascalCase（类） | camelCase | camelCase | UPPER_SNAKE_CASE（项目约定） | 避免使用 `var` |
| Go | 导出 PascalCase / 未导出 camelCase | 同上 | camelCase | PascalCase 或 camelCase，不使用 UPPER_SNAKE | 大小写控制可见性 |
| C++ | PascalCase（Google 风格） | PascalCase（Google 风格） | snake_case | `kPascalCase` | 以项目 `clang-format` 为准 |
| Rust | PascalCase | snake_case | snake_case | UPPER_SNAKE_CASE | 模块和文件名使用 snake_case |
| Kotlin | PascalCase | camelCase | camelCase | UPPER_SNAKE_CASE（`const val`） | 普通 `val` 使用 camelCase |
| Lua | 视项目而定 | snake_case（常见） | snake_case（常见） | UPPER_SNAKE_CASE（常见） | 避免污染全局变量 |

### 10.1 遵循目标语言规范

#### R40 遵循目标语言的官方或主流风格指南

`[必须-MUST] [所有语言]`

例如：

- Java：Google Java Style Guide、项目 Checkstyle 规则。
- Python：PEP 8、Ruff、Black。
- TypeScript：Google TypeScript Style Guide、项目 ESLint 配置。
- Go：`gofmt`、`go vet`、Effective Go。
- Rust：`rustfmt`、Clippy。
- Kotlin：Kotlin Coding Conventions、ktlint。
- C++：项目 `.clang-format`、Google C++ Style Guide。
- Lua：项目 StyLua 配置。

**理由**：统一格式可以显著减少 Code Review 中的噪音，让讨论集中在设计和正确性上。

**依据**：Google Style Guides、《软件工程：Google 工程实践》

#### R41 不要把一种语言的惯用法生搬到另一种语言

`[应该-SHOULD] [所有语言]`

例如：

- Go 用标识符大小写控制可见性，而不是 `public/private`。
- Python 用下划线命名表达社区惯例，而不是照搬 Java 的 camelCase。
- Rust 用 `Result` 和 `?` 表达可恢复错误，而不是到处抛异常。
- TypeScript 的类型只在编译期存在，运行时数据仍然需要校验。
- Java 的 `Optional` 不适合无条件用于字段、参数和集合元素。

**理由**：跨语言迁移的是工程思想，不是语法形式。遵循目标语言的惯用法，代码才更容易被当地开发者维护。

**依据**：《Effective Java》、Effective Python、Effective TypeScript、100 Go Mistakes

#### R42 能用工具检查的规范，不要只写在文档里

`[应该-SHOULD] [团队]`

格式、命名、未使用变量、空 `catch`、原始类型等问题，应该尽量交给 formatter、linter 和 CI 检查。

**理由**：规范不落到工具，最终会变成口头约定；工具检查比人工记忆更稳定。

**依据**：《软件工程：Google 工程实践》

### 10.2 跨语言常见陷阱

| 语言 | 常见陷阱 | 建议 |
| --- | --- | --- |
| Java | 原始类型、`Optional` 滥用、可变静态状态、`equals/hashCode` 不一致 | 用泛型；`Optional` 只用于可能缺失的返回值；优先不可变对象 |
| Python | 可变默认参数、用 `is` 比较值、过宽的 `except`、缺少类型标注 | 用 `None` 并在函数内初始化；用 `==` 比较值；捕获具体异常 |
| TypeScript | `any` 泛滥、运行时数据未校验、忽略 `strictNullChecks` | 开启 `strict`；在边界用 zod 等工具做运行时校验 |
| JavaScript | `var`、隐式类型转换、回调地狱 | 用 `const/let`；显式转换；使用 `async/await` |
| Go | 忽略 `error`、goroutine 泄漏、`context` 传递不当 | 每个 `error` 都处理；用 `context` 控制生命周期；做并发压测 |
| Rust | 生产代码滥用 `unwrap()`、不必要的 `clone()`、硬拼生命周期 | 用 `?` 和自定义错误；先理解所有权再优化 |
| Kotlin | 平台类型、滥用 `!!`、可变 `data class` | 边界处显式判空；避免 `!!`；优先 `val` |
| C++ | 裸指针和手动 `new`、未定义行为、缺少 `const` | 用 RAII 和智能指针；开启警告；保持 const correctness |
| Lua | 全局变量污染、遗漏 `nil` 判断、表共享引用 | 用 `local`；明确 `nil` 语义；注意深拷贝 |

## 十一、Code Review 清单

### 命名

- [ ] 类名是否能表达业务对象或职责？
- [ ] 方法名是否明确表达行为？
- [ ] 变量名是否具有实际意义？
- [ ] 是否存在无意义缩写？
- [ ] 集合变量是否使用复数？

### 函数

- [ ] 函数是否只承担一个明确职责？
- [ ] 是否存在过长的方法？
- [ ] 是否存在过多参数？
- [ ] 是否存在复杂嵌套？
- [ ] 返回值是否具有明确含义？

### 结构

- [ ] 是否存在重复代码？
- [ ] 是否存在不必要的抽象或过度设计？
- [ ] 类的职责是否清晰？
- [ ] 模块之间是否存在不必要的耦合？
- [ ] 是否优先使用了组合而不是继承？

### 异常

- [ ] 是否正确处理异常？
- [ ] 是否存在空 `catch`？
- [ ] 是否滥用 `null`？
- [ ] 错误信息是否能够帮助定位问题？
- [ ] 是否保留了原始异常信息？

### 测试

- [ ] 是否覆盖重要业务逻辑？
- [ ] 是否考虑边界条件？
- [ ] 是否考虑异常情况？
- [ ] 测试是否相互独立？
- [ ] 是否会影响已有功能？

### 可维护性

- [ ] 是否存在过时注释？
- [ ] 是否存在无用代码？
- [ ] 是否存在魔法数字？
- [ ] 是否能够让其他开发者快速理解？
- [ ] 是否可以通过命名或拆分减少注释？

## 十二、推荐学习顺序

建议按照以下顺序学习，不要一次性试图掌握所有规范。

| 阶段 | 学习内容 | 核心资源 | 学习目标 |
| --- | --- | --- | --- |
| 第一阶段 | 命名、注释、格式、函数设计 | 《代码整洁之道》、Google Style Guides | 写出易读的代码 |
| 第二阶段 | 语言编码规范 | Google Style Guides | 形成统一编码习惯 |
| 第三阶段 | Java 最佳实践 | 《Effective Java》 | 掌握 Java 高质量编码方式 |
| 第四阶段 | 软件构建与复杂度管理 | 《代码大全》 | 理解如何构建可靠的软件 |
| 第五阶段 | 代码异味与重构 | 《重构》 | 学会改善现有代码 |
| 第六阶段 | 工程实践 | 《软件工程：Google 工程实践》 | 理解大型项目的工程要求 |
| 第七阶段 | 跨语言实践 | Effective Python、Effective TypeScript、100 Go Mistakes、Effective Modern C++、Effective Rust、Effective Kotlin、Programming in Lua | 把工程思想迁移到其他语言 |
| 第八阶段 | 代码设计与架构 | SOLID、DDD、设计模式 | 设计可演进的系统 |

如果时间有限，优先吃透三本：《代码整洁之道》《Effective Java》《重构》。

## 十三、最终原则

写代码时，请始终记住：

- 不要让别人猜测你的代码想做什么。
- 不要为了减少代码行数而牺牲可读性。
- 不要让一个函数承担过多职责。
- 不要让一个类成为所有业务逻辑的集合。
- 不要重复实现相同的业务规则。
- 不要为了设计模式而设计模式。
- 不要为了未来可能出现的需求过度设计。
- 不要忽略异常处理和边界条件。
- 不要在没有测试保障的情况下贸然进行大规模重构。
- 不要认为代码能够运行就意味着代码质量合格。

> 真正优秀的程序员，不只是能够编写代码，还应该能够持续改善代码。

## 十四、值得掌握的工程思想

| 概念 | 核心思想 | 主要学习资源 |
| --- | --- | --- |
| SOLID | 单一职责、开闭、里氏替换、接口隔离、依赖倒置 | 《代码整洁之道》 |
| DRY | Don't Repeat Yourself，避免重复 | 《程序员修炼之道》 |
| KISS | Keep It Simple, Stupid，保持简单 | 《代码大全》 |
| YAGNI | You Aren't Gonna Need It，不要实现尚未需要的功能 | 《程序员修炼之道》 |
| SoC | Separation of Concerns，关注点分离 | 《代码大全》 |
| LoD | Law of Demeter，迪米特法则，少知道一点 | 《代码整洁之道》 |
| Composition over Inheritance | 优先组合而不是继承 | 《Effective Java》 |
| Fail Fast | 尽早发现错误，不要带着错误状态继续运行 | 《代码大全》 |

可以把代码能力分成三个层次：

| 层次 | 解决的问题 | 典型实践 |
| --- | --- | --- |
| 代码规范（Coding Style） | 怎么命名、怎么缩进、怎么组织函数、怎么写注释 | formatter、linter、Code Review |
| 代码设计（Code Design） | 类怎么划分、职责怎么分配、如何减少耦合、如何设计接口 | SOLID、设计模式、重构 |
| 软件工程（Software Engineering） | 如何测试、如何重构、如何 review、如何管理依赖、如何保证长期可维护 | 测试、CI/CD、Code Review、可观测性 |

## 总结

这份手册可以压缩成三句话：

- 规则先分级：MUST 管正确性和一致性，SHOULD 管可维护性，MAY 管优化空间。
- 规范要落地：能交给 formatter、linter 和 CI 的，不要靠人工记忆。
- 判断先于规则：规范是默认值，不是教条；偏离时要能说出理由。

如果只能记住一件事：先让命名、函数边界和异常处理可读，再追求更高级的设计。

## 相关阅读

- [重构技巧](/software-engineering/refactoring)
- [测试](/software-engineering/testing)
- [Code Review](/software-engineering/code-review)
- [工程实践](/software-engineering/engineering-practice)
- [设计模式](/software-engineering/design-patterns)
- [DDD](/software-engineering/ddd)
- [架构](/software-engineering/architecture)
- [Google Style Guides](https://google.github.io/styleguide/)
