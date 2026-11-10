---
title: Java 并发
description: 从 Java 内存模型到线程池、锁、并发集合和虚拟线程，建立可验证的线程安全思维。
---

# Java 并发

> 并发问题最危险的地方，不是代码立刻报错，而是它在大多数时候看起来都正确。

## 本章目标

学完本章，你应该能够：

- 从原子性、可见性和有序性判断一段并发代码是否安全。
- 选择合适的同步工具：锁、volatile、原子类或并发容器。
- 配置可观测、可关闭、有背压的线程池。
- 使用线程转储和日志定位死锁、线程泄漏和积压。

## 为什么需要并发

并发主要用于两类场景：

- **提高吞吐**：一个线程等待 I/O 时，其他线程继续处理请求。
- **降低延迟**：把可以并行的任务拆开同时执行。

但并发不是免费的：

- 共享可变状态会产生竞态条件。
- 线程切换、锁竞争和上下文切换会增加开销。
- 错误更难复现，日志和调试成本更高。
- 线程池配置不当可能导致积压、OOM 或服务雪崩。

并发编程的目标不是“到处加线程”，而是用尽可能简单的模型获得必要的吞吐，同时保证正确性。

## 并发与并行

| 概念 | 含义 |
| --- | --- |
| 并发（Concurrency） | 多个任务在重叠的时间段内推进，不一定同时执行 |
| 并行（Parallelism） | 多个任务在同一时刻真正同时执行，通常依赖多核 CPU |

单核 CPU 也可以并发执行多个线程，只是通过时间片切换制造“同时进行”的效果。

## 线程的生命周期

Java 线程在 `Thread.State` 中定义了六种状态：

| 状态 | 含义 | 常见触发 |
| --- | --- | --- |
| `NEW` | 已创建，尚未启动 | `new Thread(...)` |
| `RUNNABLE` | 可运行或正在运行 | `start()` 之后 |
| `BLOCKED` | 等待监视器锁 | `synchronized` 竞争 |
| `WAITING` | 无限期等待 | `Object.wait()`、`join()`、`LockSupport.park()` |
| `TIMED_WAITING` | 限时等待 | `sleep`、带超时的 `wait` / `join` |
| `TERMINATED` | 已结束 | `run()` 正常返回或抛出未捕获异常 |

注意：

- `RUNNABLE` 不代表一定正在占用 CPU，它可能正在等待操作系统调度。
- `BLOCKED` 特指等待 `synchronized` 监视器锁；等待 `ReentrantLock` 时通常处于 `WAITING` 或 `TIMED_WAITING`。
- 线程结束后不能再次 `start()`。
- `interrupt()` 不是强制终止线程，而是设置中断标志，具体行为由线程代码决定。

```java
Thread worker = new Thread(() -> {
    while (!Thread.currentThread().isInterrupted()) {
        doWork();
    }
}, "order-worker");

worker.start();
worker.interrupt();
worker.join();
```

守护线程不会阻止 JVM 退出，但不适合执行必须可靠完成的任务。业务线程通常应使用非守护线程或显式线程池管理。

## 线程安全的三要素

一段共享可变状态的代码要保证线程安全，通常需要同时考虑：

### 原子性

一个操作要么全部完成，要么完全不发生，不能被其他线程看到中间状态。

```java
private int count = 0;

public void increment() {
    count++; // 不是原子操作
}
```

`count++` 至少包含读取、加一、写回三个步骤。两个线程可能同时读到相同的旧值，导致更新丢失。

### 可见性

一个线程对共享变量的修改，其他线程是否能及时看到。

```java
private boolean running = true;

public void stop() {
    running = false;
}

public void loop() {
    while (running) {
        // 可能永远看不到 running 的变化
    }
}
```

没有同步措施时，JIT 和 CPU 缓存可能让循环线程长期读取旧值。

### 有序性

编译器和 CPU 可能在不改变单线程语义的前提下重排指令。多线程环境下，重排可能导致意料之外的执行顺序。

Java 内存模型（JMM）通过 `happens-before` 规则定义哪些操作之间必须保持可见性和顺序。

## Java 内存模型与 happens-before

`happens-before` 是判断可见性的核心规则。常见关系包括：

- **程序顺序规则**：同一线程内，前面的操作先于后面的操作。
- **监视器锁规则**：对同一个锁的解锁先于后续加锁。
- **volatile 规则**：对 `volatile` 变量的写先于后续对该变量的读。
- **线程启动规则**：`Thread.start()` 之前的操作对子线程可见。
- **线程终止规则**：线程中的所有操作先于其他线程检测到该线程结束。
- **传递性**：如果 A 先于 B，B 先于 C，则 A 先于 C。

理解 `happens-before` 比背诵“主内存/工作内存”模型更实用，因为它能直接解释代码是否正确。

## volatile：可见性，不是原子性

`volatile` 保证：

- 写入对其他线程可见。
- 禁止特定类型的指令重排。

它不保证复合操作的原子性：

```java
private volatile int count = 0;

public void increment() {
    count++; // 仍然不是线程安全
}
```

正确做法：

```java
private final AtomicInteger count = new AtomicInteger();

public void increment() {
    count.incrementAndGet();
}
```

适合使用 `volatile` 的场景：

- 一个线程写、多个线程读的状态标志。
- 安全发布不可变对象。
- 双重检查锁中的单例引用。

### 双重检查锁

::: details 展开：双重检查锁实现
```java
public final class ConfigHolder {
    private static volatile ConfigHolder instance;

    private ConfigHolder() {
    }

    public static ConfigHolder getInstance() {
        if (instance == null) {
            synchronized (ConfigHolder.class) {
                if (instance == null) {
                    instance = new ConfigHolder();
                }
            }
        }
        return instance;
    }
}
```
:::

这里的 `volatile` 不能省略，否则其他线程可能看到“对象引用已赋值，但构造尚未完成”的中间状态。

## synchronized

`synchronized` 同时提供：

- 互斥：同一时刻只有一个线程持有监视器锁。
- 可见性：解锁前的修改对后续获取同一把锁的线程可见。
- 可重入：同一线程可以重复获取同一把锁。

```java
public final class Counter {
    private int count;

    public synchronized void increment() {
        count++;
    }

    public synchronized int get() {
        return count;
    }
}
```

锁对象的选择很重要：

```java
// 不推荐：锁住 String 常量，可能与其他代码共享同一对象
synchronized ("lock") {
}

// 不推荐：锁住可能为 null 的对象
synchronized (lock) {
}

// 推荐：使用专用、私有、final 的锁对象
private final Object lock = new Object();
```

不要锁住 `Integer`、`String` 等可能被缓存或共享的对象，也不要锁住公开可见的对象，否则外部代码可能无意中参与同一把锁的竞争。

## Lock 与 Condition

`ReentrantLock` 提供比 `synchronized` 更灵活的能力：

- 可中断加锁。
- 可尝试加锁。
- 可设置公平锁。
- 可以绑定多个 `Condition`。

```java
private final ReentrantLock lock = new ReentrantLock();

public void transfer(Account from, Account to, BigDecimal amount) {
    lock.lock();
    try {
        from.withdraw(amount);
        to.deposit(amount);
    } finally {
        lock.unlock();
    }
}
```

`unlock()` 必须放在 `finally` 中，否则异常会导致锁永久泄漏。

### 用 Condition 实现等待/通知

```java
private final ReentrantLock lock = new ReentrantLock();
private final Condition notEmpty = lock.newCondition();
private final Deque<Task> tasks = new ArrayDeque<>();

public Task take() throws InterruptedException {
    lock.lock();
    try {
        while (tasks.isEmpty()) {
            notEmpty.await();
        }
        return tasks.removeFirst();
    } finally {
        lock.unlock();
    }
}

public void put(Task task) {
    lock.lock();
    try {
        tasks.addLast(task);
        notEmpty.signal();
    } finally {
        lock.unlock();
    }
}
```

等待条件时使用 `while` 而不是 `if`，因为线程被唤醒后条件可能再次不满足（虚假唤醒或其他线程抢先消费）。

## 锁的实现与优化

`synchronized` 在字节码层面通常对应 `monitorenter` 和 `monitorexit`。现代 JVM 会结合轻量级锁、自旋和锁消除等机制优化；早期 JDK 曾使用偏向锁，但现代版本已经移除。不要根据某个版本的对象头细节做业务设计，重点理解成本模型：

- 无竞争时，获取锁通常很快。
- 高竞争时，线程会阻塞、唤醒和切换，吞吐下降。
- 锁内执行 I/O、远程调用或大量计算，会显著扩大临界区。
- 锁的粒度、顺序和持有时间，比“用不用锁”更影响性能。

### 缩小临界区

```java
// 不推荐：锁内执行远程调用
synchronized (lock) {
    Result result = remoteService.call();
    cache.put(key, result);
}

// 推荐：只在共享状态更新时加锁
Result result = remoteService.call();
synchronized (lock) {
    cache.put(key, result);
}
```

### 读写锁

`ReentrantReadWriteLock` 适合读多写少、读操作较重的场景：

```java
private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

public User find(long id) {
    lock.readLock().lock();
    try {
        return users.get(id);
    } finally {
        lock.readLock().unlock();
    }
}

public void update(User user) {
    lock.writeLock().lock();
    try {
        users.put(user.id(), user);
    } finally {
        lock.writeLock().unlock();
    }
}
```

读写锁并不总是比 `synchronized` 快：

- 读锁获取也有成本。
- 写锁可能饥饿。
- 数据量小、临界区短时，简单互斥锁可能更合适。

`StampedLock` 提供乐观读，适合读多写少且能接受重试的场景，但它不是可重入锁，API 也更复杂。

### 有序加锁

多把锁场景应定义全局顺序：

```java
if (from.id() < to.id()) {
    lock(from);
    lock(to);
} else {
    lock(to);
    lock(from);
}
```

固定顺序可以避免循环等待，从根源上降低死锁概率。

## 原子类与 CAS

`java.util.concurrent.atomic` 提供了无锁原子操作：

```java
AtomicInteger count = new AtomicInteger();
count.incrementAndGet();

AtomicReference<Status> status = new AtomicReference<>(Status.NEW);
status.compareAndSet(Status.NEW, Status.RUNNING);
```

`compareAndSet(expected, update)` 基于 CAS（Compare-And-Swap）：只有当前值等于期望值时才更新。

### CAS 的问题

- **ABA 问题**：值从 A 变成 B 又变回 A，CAS 仍可能成功。必要时使用 `AtomicStampedReference`。
- **自旋成本**：高竞争下 CAS 可能反复失败，消耗 CPU。
- **只能保护单个变量**：多个变量的原子更新需要锁或其他机制。

高并发计数场景可以使用 `LongAdder`，它通过分散热点减少竞争：

```java
LongAdder requests = new LongAdder();
requests.increment();
long total = requests.sum();
```

`LongAdder` 适合统计，不适合需要立即读取精确值并基于该值做业务判断的场景。

## 线程池

### 为什么不能直接 `new Thread()`

每次创建线程都有成本：

- 操作系统线程创建和销毁开销。
- 线程数量不可控。
- 缺少队列、拒绝策略和统一监控。
- 难以优雅关闭。

### ThreadPoolExecutor 的核心参数

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    4,                              // corePoolSize
    8,                              // maximumPoolSize
    60, TimeUnit.SECONDS,           // keepAliveTime
    new ArrayBlockingQueue<>(200),  // workQueue
    new CustomThreadFactory(),
    new ThreadPoolExecutor.CallerRunsPolicy()
);
```

| 参数 | 作用 |
| --- | --- |
| `corePoolSize` | 常驻核心线程数 |
| `maximumPoolSize` | 最大线程数 |
| `keepAliveTime` | 超出核心数的空闲线程存活时间 |
| `workQueue` | 任务排队队列 |
| `threadFactory` | 线程命名、异常处理等 |
| `handler` | 队列满且线程达到上限时的拒绝策略 |

执行顺序：

1. 线程数小于核心数，创建核心线程。
2. 核心线程已满，任务进入队列。
3. 队列已满，创建非核心线程，直到达到最大线程数。
4. 仍无法接收，执行拒绝策略。

这个顺序意味着：**如果使用无界队列，最大线程数可能永远不会生效**，任务会持续堆积直到 OOM。

### 常见拒绝策略

| 策略 | 行为 | 适用场景 |
| --- | --- | --- |
| `AbortPolicy` | 抛出 `RejectedExecutionException` | 默认，明确失败 |
| `CallerRunsPolicy` | 由提交任务的线程执行 | 降低提交速度，形成背压 |
| `DiscardPolicy` | 静默丢弃 | 很少适合核心业务 |
| `DiscardOldestPolicy` | 丢弃最旧任务 | 允许丢失旧任务的场景 |

核心业务通常不应静默丢弃任务。至少需要记录指标、告警或返回明确的失败结果。

### 线程池配置原则

- CPU 密集型任务：线程数接近 CPU 核心数。
- I/O 密集型任务：可高于核心数，但必须结合下游容量和队列长度。
- 不要使用无界队列。
- 给线程起有意义的名称，便于排查。
- 为线程池增加监控：活跃线程数、队列长度、完成任务数、拒绝次数。
- 关闭时使用 `shutdown()`，必要时配合 `awaitTermination()`。

```java
executor.shutdown();
if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
    executor.shutdownNow();
}
```

## 线程池监控与容量规划

线程池不是配置完就可以忘记的基础设施。至少需要监控：

- 当前线程数、活跃线程数、最大线程数。
- 队列长度和剩余容量。
- 已完成任务数。
- 拒绝任务数。
- 任务等待时间和执行时间。
- 线程池关闭状态。

```java
ThreadPoolExecutor pool = (ThreadPoolExecutor) executor;

int active = pool.getActiveCount();
int size = pool.getPoolSize();
int queued = pool.getQueue().size();
long completed = pool.getCompletedTaskCount();
```

这些值适合做指标，不适合作为精确业务判断。

### 容量估算

一个粗略的并发需求可以用 Little's Law 理解：

```text
并发数 ≈ 吞吐量 × 平均处理时间
```

例如每秒处理 500 个请求，平均每个请求耗时 200ms：

```text
并发数 ≈ 500 × 0.2 = 100
```

这只是起点。还要考虑峰值、下游容量、超时、重试和队列策略。不要只根据 CPU 核心数机械配置线程池。

### 隔离不同依赖

不要让所有远程调用共享一个线程池：

- 支付服务慢，不应拖垮用户查询。
- 文件导出不应占满核心 API 线程。
- 不同下游应有独立超时、并发上限和熔断策略。

这种隔离通常称为舱壁模式（Bulkhead）。

## CompletableFuture

`CompletableFuture` 用于组合异步任务：

```java
CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(
    () -> userClient.load(userId),
    ioExecutor
);

CompletableFuture<List<Order>> ordersFuture = CompletableFuture.supplyAsync(
    () -> orderClient.listByUser(userId),
    ioExecutor
);

UserProfile profile = userFuture
    .thenCombine(ordersFuture, UserProfile::new)
    .exceptionally(ex -> UserProfile.empty(userId))
    .join();
```

注意事项：

- 阻塞型 I/O 不要默认使用 `ForkJoinPool.commonPool()`，应传入专用线程池。
- 明确异常处理：`exceptionally`、`handle`、`whenComplete` 语义不同。
- 避免在异步链中吞掉异常。
- 不要无限嵌套 `thenApply`，复杂流程应拆成可测试的方法。
- 给异步任务设置超时，避免请求无限等待。

## ForkJoinPool 与并行流

`ForkJoinPool` 使用工作窃取（work stealing）执行可拆分的任务：

::: details 展开：RecursiveTask 示例
```java
public final class SumTask extends RecursiveTask<Long> {
    private final long[] values;
    private final int start;
    private final int end;

    @Override
    protected Long compute() {
        if (end - start <= 10_000) {
            long sum = 0;
            for (int i = start; i < end; i++) {
                sum += values[i];
            }
            return sum;
        }

        int middle = (start + end) / 2;
        SumTask left = new SumTask(values, start, middle);
        SumTask right = new SumTask(values, middle, end);
        left.fork();
        long rightResult = right.compute();
        long leftResult = left.join();
        return leftResult + rightResult;
    }
}
```
:::

注意事项：

- `ForkJoinPool.commonPool()` 默认并行度通常与 CPU 核心数相关。
- 任务中阻塞 I/O 会占用工作线程，降低整个池的吞吐。
- 并行流并不自动适合所有场景。
- 任务拆分过细会增加调度成本。
- 共享可变状态会破坏并行正确性。

并行流适合无副作用、可分割、CPU 密集且数据量足够大的计算。数据库查询、HTTP 调用和文件 I/O 应先考虑专用线程池或异步模型。

## 虚拟线程

::: warning 虚拟线程不是 CPU 加速器
虚拟线程主要解决大量阻塞式 I/O 的线程成本问题。CPU 密集型任务仍受核心数限制，数据库连接池和下游服务也不会因为虚拟线程而自动扩容。
:::

Java 21 正式引入虚拟线程。它适合大量阻塞式 I/O 任务，例如 HTTP 调用、数据库访问和文件读取。

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    Future<String> result = executor.submit(() -> remoteService.call());
    System.out.println(result.get());
}
```

也可以直接创建：

```java
Thread thread = Thread.ofVirtual()
    .name("order-worker")
    .start(() -> handleOrder(orderId));
```

虚拟线程不是“让 CPU 计算变快”的工具：

- I/O 阻塞时，虚拟线程可以被卸载，让底层载体线程继续工作。
- CPU 密集型任务仍受核心数限制。
- 不要池化虚拟线程。它们很轻量，通常按任务创建。
- 旧版本 JDK 中，`synchronized` 阻塞可能钉住载体线程；Java 24 的 JEP 491 已改善这一问题。使用较新 JDK 时仍需关注本地方法、类加载等可能造成 pinning 的场景。

## 死锁、活锁与饥饿

### 死锁

两个或多个线程互相等待对方持有的锁：

::: details 展开：死锁示例
```java
// 线程 1
synchronized (accountA) {
    synchronized (accountB) {
    }
}

// 线程 2
synchronized (accountB) {
    synchronized (accountA) {
    }
}
```
:::

预防方式：

- 固定锁获取顺序。
- 使用 `tryLock` 设置超时。
- 缩小锁粒度，避免锁内调用外部服务。
- 尽量避免嵌套锁。

### 活锁

线程没有阻塞，但不断重试、互相让步，导致任务无法推进。解决办法通常是引入随机退避、限制重试次数或调整协作策略。

### 饥饿

某些线程长期得不到 CPU、锁或队列资源。常见原因包括不公平锁、线程优先级滥用、任务队列被高优先级任务占满。

### 排查死锁

```bash
jps
jstack <pid>
jcmd <pid> Thread.print
```

线程转储中如果出现 `Found one Java-level deadlock`，通常可以直接看到互相等待的线程和锁对象。

## 线程安全策略

按优先级考虑：

1. **不可变**：对象创建后不再变化，天然线程安全。
2. **线程封闭**：状态只属于单个线程，例如方法局部变量、`ThreadLocal`。
3. **无共享**：通过消息传递或任务拆分避免共享可变状态。
4. **同步**：使用锁、原子类或并发容器保护共享状态。

### ThreadLocal

```java
private static final ThreadLocal<RequestContext> CONTEXT =
    ThreadLocal.withInitial(RequestContext::new);
```

`ThreadLocal` 适合保存请求级上下文，但在线程池中必须清理：

```java
try {
    CONTEXT.set(context);
    handle();
} finally {
    CONTEXT.remove();
}
```

否则线程被复用时，旧数据可能泄漏到下一个请求。

## 常见陷阱

::: warning 并发问题优先排查四个信号
CPU 空转、线程数持续上涨、队列积压、请求延迟升高。分别检查死循环、线程泄漏、无界队列和锁竞争。
:::

| 陷阱 | 后果 | 处理方式 |
| --- | --- | --- |
| `volatile` 修饰计数器 | 丢失更新 | 使用 `AtomicInteger` 或锁 |
| 在锁内调用远程服务 | 锁持有时间过长 | 把 I/O 移到锁外 |
| 使用无界线程池队列 | 内存堆积、OOM | 设置有界队列和拒绝策略 |
| `SimpleDateFormat` 共享 | 解析结果错乱 | 使用 `DateTimeFormatter` |
| `ConcurrentHashMap` 先查后改 | 复合操作竞态 | 使用 `compute`、`merge` |
| 线程池中使用 `ThreadLocal` 不清理 | 数据串请求、内存泄漏 | `finally` 中 `remove` |
| 锁住 `String` 或包装类型 | 意外共享锁对象 | 使用专用锁对象 |
| 认为虚拟线程能加速 CPU 计算 | 性能不及预期 | CPU 任务使用有界平台线程池 |
| 忽略异步任务异常 | 失败无感知 | 使用 `exceptionally` 或统一异常处理 |
| 线程池没有优雅关闭 | 发布时任务丢失 | `shutdown` + 超时 + 监控 |

## 练习

以下练习的目标不是复述 API，而是把并发问题变成可观察、可验证的实验。建议每完成一项都记录线程数、吞吐和失败模式。

1. 写一个非线程安全计数器，用多线程复现丢失更新，再用 `synchronized`、`AtomicInteger` 和 `LongAdder` 分别修复。
2. 用 `volatile` 实现一个停止标志，并解释为什么不能用于计数。
3. 配置一个有界线程池，模拟队列满后的拒绝策略，记录拒绝次数。
4. 使用 `BlockingQueue` 实现生产者-消费者，支持优雅停止。
5. 构造一个死锁，用 `jstack` 找到它，再通过固定锁顺序修复。
6. 比较平台线程和虚拟线程执行大量阻塞任务时的线程数量和吞吐。
7. 使用 `CompletableFuture` 并行调用两个远程服务，并处理其中一个失败的情况。
## 总结

并发不是多开线程，而是在吞吐、延迟和正确性之间建立可验证的边界。学完本章，你应该能够解释一段并发代码是否正确，判断失败时先看内存可见性、锁竞争、队列积压还是下游容量。如果只能记住一件事：先保证可见性和互斥，再谈性能。

## 相关阅读

- [Java 集合](/programming-language/java/collections)
- [JVM](/programming-language/java/jvm)
- [Java 新特性](/programming-language/java/new-features)
- [系统设计：限流](/system-design/rate-limiting)
