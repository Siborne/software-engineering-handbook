---
title: 反射、注解与代理
description: Class 对象、反射调用、运行时注解、JDK 动态代理和框架底层机制。
---

# 反射、注解与代理

> 框架的“自动”和“魔法”，大多来自三件事：读取元数据、在运行时创建对象、在方法调用前后插入逻辑。

## 本章目标

学完本章，你应该能够：

- 理解 `Class` 对象和类加载的关系。
- 使用反射读取字段、方法和构造器。
- 理解反射的访问控制、模块限制和性能成本。
- 定义并读取运行时注解。
- 使用 JDK 动态代理实现横切逻辑。
- 读懂 Spring、Jackson、MyBatis 等框架的常见底层套路。
- 判断什么时候应该使用反射，什么时候应该避免。

## 一、`Class` 对象

每个已加载的类在 JVM 中都有一个 `Class` 对象，它描述这个类的元数据：

```java
Class<User> type = User.class;
```

也可以从对象获取：

```java
User user = new User();
Class<?> type = user.getClass();
```

或者通过类名加载：

```java
Class<?> type = Class.forName("com.example.User");
```

`Class` 对象是反射的入口。通过它可以获得：

- 类名、包名、修饰符。
- 父类和实现的接口。
- 字段、方法、构造器。
- 注解。
- 泛型签名。

### 类加载与 `Class`

`Class.forName` 默认会触发类初始化：

```java
Class.forName("com.example.Driver");
```

如果只想加载类而不初始化：

```java
Class.forName("com.example.Driver", false, classLoader);
```

这解释了为什么 JDBC 驱动、插件系统和 SPI 经常需要显式加载类。

## 二、反射的基本操作

### 创建对象

```java
Class<User> type = User.class;
User user = type.getDeclaredConstructor(String.class)
    .newInstance("alice");
```

需要无参构造器时：

```java
User user = type.getDeclaredConstructor().newInstance();
```

反射创建对象会绕过编译期检查，因此构造器不存在、参数不匹配或构造器抛异常都会在运行时暴露。

### 读取和修改字段

```java
Class<User> type = User.class;
Field field = type.getDeclaredField("username");
field.setAccessible(true);

Object value = field.get(user);
field.set(user, "bob");
```

区别：

- `getField` / `getFields`：只能访问 `public` 字段，包括继承来的。
- `getDeclaredField` / `getDeclaredFields`：访问当前类声明的所有字段，不包括继承来的。

### 调用方法

```java
Method method = type.getDeclaredMethod("rename", String.class);
method.setAccessible(true);
Object result = method.invoke(user, "bob");
```

`invoke` 的返回类型是 `Object`，基本类型会被装箱。方法抛出的异常会被包装成 `InvocationTargetException`，需要通过 `getCause()` 获取真实异常。

### 访问私有成员

```java
field.setAccessible(true);
```

它表示尝试关闭 Java 访问检查，但并不意味着一定成功。Java 9 模块系统之后，如果目标包没有对当前模块开放，可能抛出 `InaccessibleObjectException`。

::: warning `setAccessible(true)` 不是万能钥匙
它会破坏封装，并可能受模块系统限制。迁移到新 JDK 时，优先寻找公开 API，而不是长期依赖 `--add-opens`。
:::

可以通过模块描述符开放：

```java
open module com.example.app {
    requires java.sql;
}
```

或使用 `--add-opens`，但这通常是迁移期的兼容手段，不应作为长期设计。

## 三、反射的代价

反射很强大，但不是免费的：

- 编译期无法检查方法名、参数和返回类型。
- 运行时查找和调用比直接调用慢。
- 访问检查、装箱和异常包装带来额外开销。
- 破坏封装后，代码更难理解和维护。
- 与模块系统、AOT 编译和 GraalVM 原生镜像存在兼容问题。

### 缓存反射结果

不要在循环中反复查找：

```java
// 不推荐
for (Object item : items) {
    item.getClass().getMethod("getId").invoke(item);
}

// 推荐：提前缓存
Method getId = itemType.getMethod("getId");
for (Object item : items) {
    getId.invoke(item);
}
```

框架通常会缓存 `Class`、`Method`、`Field`、构造器和注解元数据。

## 四、注解

注解是附加在代码上的元数据：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Timed {
    String value() default "";
}
```

使用：

```java
public final class OrderService {
    @Timed("createOrder")
    public void createOrder() {
        // ...
    }
}
```

读取：

```java
Method method = OrderService.class.getMethod("createOrder");
Timed timed = method.getAnnotation(Timed.class);
if (timed != null) {
    System.out.println(timed.value());
}
```

### 元注解

| 元注解 | 作用 |
| --- | --- |
| `@Retention` | 注解保留到源码、字节码还是运行时 |
| `@Target` | 注解可以标注在哪些元素上 |
| `@Documented` | 是否出现在 Javadoc 中 |
| `@Inherited` | 子类是否继承父类注解 |
| `@Repeatable` | 是否允许重复标注 |

保留策略：

- `SOURCE`：编译期可见，编译后丢弃，适合代码生成和检查。
- `CLASS`：保留在字节码中，但运行时默认不可见。
- `RUNTIME`：运行时可通过反射读取，框架最常用。

### 注解不是逻辑

注解本身不会执行。真正让它生效的是：

- 编译期注解处理器。
- 运行时反射扫描。
- 框架启动时的类路径扫描。
- AOP 代理或字节码增强。

例如 `@Transactional` 之所以生效，是因为 Spring 创建了代理，并在方法调用前后管理事务，而不是注解本身有魔力。

## 五、JDK 动态代理

JDK 动态代理可以在运行时为接口生成代理对象：

::: details 展开：JDK 动态代理示例
```java
public interface UserService {
    User findById(long id);
}
```

```java
UserService target = new UserServiceImpl();

UserService proxy = (UserService) Proxy.newProxyInstance(
    UserService.class.getClassLoader(),
    new Class<?>[]{UserService.class},
    (proxyObject, method, args) -> {
        long start = System.nanoTime();
        try {
            return method.invoke(target, args);
        } finally {
            long cost = System.nanoTime() - start;
            System.out.println(method.getName() + " cost=" + cost);
        }
    }
);
```
:::

代理对象实现同一接口，调用会先进入 `InvocationHandler`，再由处理器决定是否调用目标方法、何时调用、是否修改参数或返回值。

### 动态代理的用途

- 事务管理。
- 日志和耗时统计。
- 权限校验。
- 远程调用。
- 缓存。
- 重试和熔断。

### JDK 代理的限制

JDK 动态代理只能代理接口，不能直接代理类。Spring 在目标类没有接口时，可能使用 CGLIB 生成子类代理。

代理也不是没有代价：

- 增加调用层级。
- 可能影响调试和堆栈。
- 自调用可能绕过代理。
- final 类/方法可能无法代理。

## 六、框架中的反射

### Spring 依赖注入

Spring 需要：

- 扫描类路径。
- 读取 `@Component`、`@Service` 等注解。
- 通过构造器或字段注入依赖。
- 创建代理实现 AOP。

这些步骤都依赖类加载、反射和注解元数据。

### Jackson

Jackson 需要：

- 读取字段、getter、setter 和构造器。
- 读取 `@JsonProperty` 等注解。
- 反射创建对象并赋值。
- 处理泛型类型和继承关系。

### MyBatis

MyBatis 需要：

- 读取 Mapper 接口。
- 解析 SQL 和参数映射。
- 通过动态代理生成 Mapper 实现。
- 把结果集反射或通过元数据映射成对象。

理解这些机制后，框架报错通常可以还原为：

- 类没有被扫描到。
- 注解缺失或保留策略不对。
- 构造器/方法签名不匹配。
- 泛型信息在运行时被擦除。
- 代理没有生效。

## 七、什么时候使用反射

适合：

- 编写框架、容器、序列化工具。
- 实现插件系统和 SPI。
- 通用测试工具和断言库。
- 需要根据配置动态加载实现。

不适合：

- 普通业务代码。
- 可以用接口和多态解决的场景。
- 为了绕过访问控制而滥用 `setAccessible`。
- 对性能敏感的循环。

优先选择：

1. 直接调用。
2. 接口和多态。
3. 工厂或注册表。
4. 反射。

## 八、常见陷阱

::: warning 反射问题优先检查三处
方法名和参数签名是否完全匹配？模块是否开放了目标包？代理调用是否绕过了 AOP 代理？
:::

| 陷阱 | 后果 | 建议 |
| --- | --- | --- |
| 反射方法名写错 | 运行时 `NoSuchMethodException` | 增加测试和启动校验 |
| 忘记缓存 `Method` | 性能下降 | 缓存元数据 |
| `setAccessible` 破坏封装 | 兼容性和安全问题 | 优先公开 API |
| 模块未开放 | `InaccessibleObjectException` | 使用 `open module` 或迁移 API |
| 注解保留策略错误 | 运行时读不到 | 框架注解通常用 `RUNTIME` |
| JDK 代理代理类 | `IllegalArgumentException` | 代理接口或使用其他机制 |
| 自调用绕过代理 | 事务/缓存不生效 | 通过代理对象调用 |
| 反射异常未拆包 | 看不到真实原因 | 检查 `InvocationTargetException` |
| 依赖反射访问 JDK 内部 | 新版本升级失败 | 使用标准 API |

## 九、练习

1. 写一个方法，接收任意对象，打印它的类名、字段和方法。
2. 用反射创建一个带参数构造器的对象，并调用一个方法。
3. 定义一个 `@Timed` 注解，用动态代理统计接口方法耗时。
4. 读取一个类上的自定义注解，并输出注解属性。
5. 解释 `getFields` 和 `getDeclaredFields` 的区别。
6. 构造一个 `InvocationTargetException`，并取出真实异常。
7. 阅读 Spring 或 MyBatis 的一段源码，找出其中的反射和代理调用。
## 总结
学完本章，你应该已经掌握：
.
- 使用 Class、Method、Field 和动态代理。
- 理解反射的性能和封装风险。
- 在框架、测试、序列化场景中安全使用反射。
如果只能记住一件事：反射是框架工具，不是业务代码的默认选择。

## 相关阅读

- [面向对象](/programming-language/java/oop)
- [泛型与类型系统](/programming-language/java/generics)
- [Java 新特性](/programming-language/java/new-features)
- [Spring](/backend/spring)
