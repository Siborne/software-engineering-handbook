---
title: 泛型与类型系统
description: Java 泛型的类型擦除、边界、通配符、类型推断和 API 设计实践。
---

# 泛型与类型系统

> 泛型的价值不是“少写强制转换”，而是把类型约束提前到编译期，并让 API 的意图可以被编译器检查。

## 本章目标

学完本章，你应该能够：

- 解释 Java 泛型与 C#、Kotlin 泛型在运行时行为上的差异。
- 编写泛型类、泛型接口和泛型方法。
- 使用边界和通配符表达 API 的输入输出约束。
- 理解类型擦除、桥方法、堆污染和泛型数组限制。
- 读懂常见框架 API 中的 `? extends` 和 `? super`。
- 在类型安全、灵活性和可读性之间做出取舍。

## 一、没有泛型时的问题

假设需要一个可以存放任意对象的盒子：

```java
public final class ObjectBox {
    private Object value;

    public void set(Object value) {
        this.value = value;
    }

    public Object get() {
        return value;
    }
}
```

使用：

```java
ObjectBox box = new ObjectBox();
box.set("hello");

String text = (String) box.get();
```

问题：

- 类型错误只能在运行时发现。
- 每次取值都要强制转换。
- API 无法表达“这个盒子只装 String”。
- 容易把错误类型放进去，直到后面才爆炸。

泛型版本：

```java
public final class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}
```

使用：

```java
Box<String> box = new Box<>();
box.set("hello");

String text = box.get(); // 不需要强制转换
// box.set(123);         // 编译错误
```

## 二、泛型的基本语法

### 泛型类

```java
public final class Result<T> {
    private final T data;
    private final String message;

    public Result(T data, String message) {
        this.data = data;
        this.message = message;
    }

    public T data() {
        return data;
    }

    public String message() {
        return message;
    }
}
```

`T` 是类型参数，不是具体类型。调用方在使用时决定它是什么。

### 泛型接口

```java
public interface Repository<T, ID> {
    Optional<T> findById(ID id);
    void save(T entity);
    void deleteById(ID id);
}

public final class UserRepository implements Repository<User, Long> {
    @Override
    public Optional<User> findById(Long id) {
        // ...
    }

    @Override
    public void save(User entity) {
        // ...
    }

    @Override
    public void deleteById(Long id) {
        // ...
    }
}
```

泛型接口可以让同一套抽象适用于不同实体，同时保持类型安全。

### 泛型方法

```java
public static <T> T first(List<T> values) {
    if (values.isEmpty()) {
        throw new IllegalArgumentException("values must not be empty");
    }
    return values.get(0);
}
```

类型参数声明在返回类型之前。调用时通常可以推断：

```java
String name = first(List.of("alice", "bob"));
```

### 多个类型参数

```java
public record Pair<L, R>(L left, R right) {
}
```

类型参数命名约定：

- `T`：Type
- `E`：Element
- `K`：Key
- `V`：Value
- `R`：Result
- `ID`：标识类型

类型参数名应该能表达角色，不要使用无意义的 `A`、`B`、`C`。

## 三、边界

默认情况下，类型参数可以是任意引用类型。边界用于限制类型参数：

```java
public static <T extends Comparable<T>> T max(List<T> values) {
    if (values.isEmpty()) {
        throw new IllegalArgumentException("values must not be empty");
    }
    T result = values.get(0);
    for (T value : values) {
        if (value.compareTo(result) > 0) {
            result = value;
        }
    }
    return result;
}
```

`T extends Comparable<T>` 表示 `T` 必须实现 `Comparable<T>`，因此可以调用 `compareTo`。

### 多重边界

```java
public static <T extends Number & Comparable<T>> T maxNumber(List<T> values) {
    // ...
}
```

多重边界中，类最多一个，接口可以有多个。类必须放在第一位。

### 上界与下界

- `T extends Number`：上界，T 是 Number 或子类。
- `? super Integer`：下界，类型是 Integer 或父类。

## 四、通配符

### 为什么需要通配符

泛型默认是不变的：

```java
List<Integer> integers = List.of(1, 2, 3);
// List<Number> numbers = integers; // 编译错误
```

虽然 `Integer` 是 `Number` 的子类，但 `List<Integer>` 不是 `List<Number>` 的子类型。原因是如果允许这样做，就可能把 `Double` 放进一个实际为 `List<Integer>` 的列表。

### `? extends`：生产者

```java
public static double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number number : numbers) {
        total += number.doubleValue();
    }
    return total;
}
```

`List<? extends Number>` 表示“元素是 Number 的某个子类型”的列表：

- 可以读取元素，赋值给 `Number`。
- 不能安全地添加元素，因为编译器不知道实际类型是 `Integer`、`Double` 还是其他子类。

```java
List<? extends Number> numbers = List.of(1, 2, 3);
Number first = numbers.get(0); // 可以
// numbers.add(4);             // 编译错误
```

### `? super`：消费者

```java
public static void addDefaults(List<? super Integer> values) {
    values.add(1);
    values.add(2);
}
```

`List<? super Integer>` 表示“元素类型是 Integer 或 Integer 的父类型”：

- 可以安全地添加 `Integer`。
- 读取出来的元素只能当作 `Object`。

```java
List<? super Integer> values = new ArrayList<Number>();
values.add(1);       // 可以
Object first = values.get(0); // 只能当 Object
```

### PECS 原则

**Producer Extends, Consumer Super**

- 只读取（生产者）用 `? extends T`。
- 只写入（消费者）用 `? super T`。
- 既读又写，通常不要用通配符，直接使用 `T`。

JDK 中的典型例子：

```java
public static <T> void copy(
    List<? super T> dest,
    List<? extends T> src
) {
    for (T item : src) {
        dest.add(item);
    }
}
```

`src` 生产元素，所以用 `extends`；`dest` 消费元素，所以用 `super`。

### 无界通配符

```java
public static int size(List<?> values) {
    return values.size();
}
```

`List<?>` 表示“某种未知类型的列表”，只能读取为 `Object`，不能添加除 `null` 以外的元素。

### 通配符捕获

有时编译器知道两个通配符类型相同，但无法直接表达。可以用辅助方法捕获类型：

```java
public static void swap(List<?> list, int i, int j) {
    swapHelper(list, i, j);
}

private static <T> void swapHelper(List<T> list, int i, int j) {
    T temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp);
}
```

## 五、类型擦除

Java 泛型在编译后会进行类型擦除：

```java
List<String> strings = new ArrayList<>();
List<Integer> integers = new ArrayList<>();
```

运行时，两者的类型都是 `ArrayList`。泛型参数主要用于编译期检查。

### 擦除带来的限制

#### 不能创建类型参数实例

```java
public <T> T create() {
    // return new T(); // 编译错误
}
```

需要工厂：

```java
public <T> T create(Supplier<T> factory) {
    return factory.get();
}
```

#### 不能创建泛型数组

```java
// T[] values = new T[10]; // 编译错误
```

常见替代：

```java
@SuppressWarnings("unchecked")
public <T> T[] createArray(int size) {
    return (T[]) new Object[size];
}
```

但这样做可能产生堆污染，调用方拿到的运行时类型并不是真正的 `T[]`。

更安全的方式是传入 `Class<T>`：

```java
public static <T> T[] createArray(Class<T> type, int size) {
    @SuppressWarnings("unchecked")
    T[] array = (T[]) Array.newInstance(type, size);
    return array;
}
```

#### 不能对泛型参数使用 `instanceof`

```java
// if (value instanceof T) { } // 编译错误
```

可以使用 `Class<T>` 做运行时检查：

```java
public static <T> boolean isType(Object value, Class<T> type) {
    return type.isInstance(value);
}
```

#### 不能重载仅泛型参数不同的方法

```java
// 编译错误：擦除后签名相同
// void print(List<String> values) {}
// void print(List<Integer> values) {}
```

#### 静态成员不能使用类的类型参数

```java
public class Box<T> {
    // private static T value; // 编译错误
}
```

静态成员属于类，而不是某个具体参数化实例。

### 桥方法

考虑：

::: details 展开：桥方法的来源
```java
public interface Box<T> {
    T get();
}

public final class StringBox implements Box<String> {
    @Override
    public String get() {
        return "hello";
    }
}
```
:::

擦除后接口方法是 `Object get()`，实现类是 `String get()`。编译器会生成桥方法，把 `Object get()` 转发到 `String get()`，以保持多态。

桥方法是泛型擦除和多态共同作用的结果，通常不需要手写，但理解它有助于阅读字节码和框架源码。

## 六、堆污染与 `@SafeVarargs`

当运行时类型与编译期泛型信息不一致时，可能发生堆污染：

```java
List<String> strings = new ArrayList<>();
List raw = strings;
raw.add(123);

String value = strings.get(0); // ClassCastException
```

可变参数与泛型组合时也容易出现问题：

```java
@SafeVarargs
public static <T> List<T> listOf(T... values) {
    return List.of(values);
}
```

`@SafeVarargs` 表示方法不会把不安全的元素写入可变参数数组。只能用于 `final` 或 `static` 方法，不能滥用。

## 七、类型推断

### 菱形运算符

```java
Map<String, List<Order>> ordersByUser = new HashMap<>();
```

右侧的 `<>` 让编译器根据左侧推断类型参数，避免重复书写。

### 目标类型推断

```java
List<String> names = List.of("alice", "bob");
Optional<User> user = repository.findByName("alice");
```

编译器会结合方法参数、返回值上下文和赋值目标推断类型。

### `var` 与泛型

```java
var ordersByUser = new HashMap<String, List<Order>>();
```

`var` 不会改变泛型擦除，也不会让运行时保留泛型信息。它只是减少左侧重复。

## 八、泛型 API 设计

### 优先让调用方清楚

不推荐：

```java
public List<?> findUsers();
```

调用方只能把元素当作 `Object`，失去类型信息。

更推荐：

```java
public List<User> findUsers();
```

如果确实需要子类型灵活性，再使用通配符：

```java
public void addAll(List<? super User> target, List<? extends User> source);
```

### 返回通配符要谨慎

返回 `List<? extends User>` 会让调用方难以添加元素，但可以安全读取 `User`。是否使用取决于 API 意图。

### 不要过度泛化

只有真正需要复用类型关系时才引入泛型。一个只处理 `Order` 的方法，不需要为了“看起来高级”写成：

```java
public <T extends Order> void process(T order);
```

除非调用方确实需要保留具体子类型。

## 九、泛型与集合

集合是泛型最常见的应用：

```java
Map<Long, List<Order>> ordersByUser = new HashMap<>();

ordersByUser
    .computeIfAbsent(userId, id -> new ArrayList<>())
    .add(order);
```

阅读集合 API 时注意：

- `Collection<E>` 的元素类型。
- `Map<K, V>` 的键值类型。
- `Comparator<? super T>` 为什么使用下界。
- `Collections.copy(List<? super T>, List<? extends T>)` 的 PECS 设计。

## 十、常见陷阱

::: tip 一句话记住 PECS
只读取用 `? extends T`，只写入用 `? super T`，既读又写通常直接使用 `T`。
:::

| 陷阱 | 后果 | 建议 |
| --- | --- | --- |
| 使用原始类型 `List` | 失去编译期检查 | 使用 `List<Object>` 或具体类型 |
| 认为泛型在运行时保留 | 依赖 `T.class` 失败 | 显式传入 `Class<T>` |
| `List<Integer>` 赋给 `List<Number>` | 编译错误 | 使用通配符或复制 |
| 随意添加 `? extends` 元素 | 编译错误 | 明确生产者/消费者 |
| 泛型数组强制转换 | 堆污染 | 使用 `Array.newInstance` |
| 忽略 unchecked 警告 | 运行时类型错误 | 尽量减少，必要时局部抑制并说明 |
| 通配符嵌套过深 | API 难读 | 先从具体类型开始设计 |
| 用泛型代替业务抽象 | 代码复杂 | 泛型只解决类型关系，不解决职责划分 |

## 十一、练习

1. 实现一个泛型 `Stack<T>`，支持 `push`、`pop`、`peek` 和 `isEmpty`。
2. 实现 `Pair<L, R>`，并提供 `mapLeft` 和 `mapRight` 方法。
3. 写一个泛型方法，接收 `List<? extends Number>`，返回总和。
4. 写一个方法，把 `List<? extends T>` 的元素复制到 `List<? super T>`。
5. 解释为什么不能创建 `new T[10]`，并给出两种替代方案。
6. 构造一个堆污染示例，说明 `ClassCastException` 在什么位置发生。
7. 阅读 `Collections.copy` 和 `Collections.sort` 的签名，解释每个通配符的用途。
8. 设计一个 `Repository<T, ID>` 接口，并用两个实体实现它。
## 总结
学完本章，你应该已经掌握：
.
- 使用泛型类、方法和通配符。
- 理解类型擦除、协变/逆变限制和边界约束。
- 设计类型安全的 API。
如果只能记住一件事：泛型是编译期约束，不是运行时保护。

## 相关阅读

- [语言基础](/programming-language/java/basics)
- [面向对象](/programming-language/java/oop)
- [集合框架](/programming-language/java/collections)
- [反射、注解与代理](/programming-language/java/reflection)
