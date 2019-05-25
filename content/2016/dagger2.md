---
title: Dagger 2 学习笔记
date: 2016-10-9 08:31:11
categories: android
tags:
- android
---

国庆假期学习了 [Dagger 2][dagger2], 在这里进行一些总结。 Dagger 2 是一个由 Google 工程师开发的依赖注入库，该项目 fork 自在 Square 工作的前 Google 工程师开发的 [Dagger 1][dagger1]。

如果你想了解 Dagger 2 的基本概念和使用方式，推荐看 Codepath 的这篇文章 [Dependency Injection with Dagger 2][codepath_dagger2]。Dagger 2 通过注解 `@Module` 和 `@Provide` 标注提供依赖的类和方法, 通过 `@Inject` 标注请求依赖的实例, 通过 `@Component` 将两者连接起来, 而且提供了其他的一些 Feature。看完这些之后，你可能会有两个问题

1. 为什么要重新开发 Dagger 2, Dagger 1 哪里不好？
2. 我现在知道怎么用了, 但是它是怎么实现的？

第一个问题，在 Google 开发者大会上，Dagger 2 的开发者的演讲 [DAGGER 2 - A New Type of dependency injection][google_dagger2] 中，不仅讲了 Dagger 1的优缺点，还讲了依赖注入如何从 Spring -> Guice -> Dagger 1 -> Dagger 2。 Spring 主要的缺点是繁琐, 那段替代复杂的依赖注入的 XML 和原来的 Java 代码一样丑陋；Guice 的缺点是图错误在运行时才能发现，并且开发者难以调试；Dagger 1 的缺点是，生成的代码丑陋，出错难以调试，并且运行时开销不可忽视；Dagger 2在 Dagger 1 的基础上，解决了性能问题，并且生成的代码更加优雅。

第二个问题，其实在上面提到的 [DAGGER 2 - A New Type of dependency injection][google_dagger2] 的演讲中，Dagger 2 的开发者已经解释了他们是如何设计 Dagger 2 的。但他使用CoffeeMaker 来举例，而我对 CoffeeMaker 并不熟悉，因此每当看到 Heater 和 Pump 的时候就在想它到底是什么，也许我应该好好玩一下公司的咖啡机。相比之下，我更喜欢 [Jake Wharton][jake]的演讲 [Jake Wharton's Devoxx Dagger 2 Talk][jake_dagger2]。

[dagger1]: https://github.com/square/dagger
[dagger2]: https://github.com/google/dagger
[codepath_dagger2]: https://github.com/codepath/android_guides/wiki/Dependency-Injection-with-Dagger-2
[google_dagger2]: https://www.youtube.com/watch?v=oK_XtfXPkqw
[jake]: http://jakewharton.com
[jake_dagger2]: https://www.youtube.com/watch?v=plK0zyRLIP8

<!-- more -->

## Dagger使用

* 时间安排2天, 包含玩一下 dagger 项目中的例子程序
* annotation processors compile-time checks 在编译时检测, 所以运行时很高效
* 简化共享实例的访问
* 易于配置复杂依赖
* 更容易的单元测试和集成测试
* 限定实例, 易于管理实例的生成和销毁


### Creating Singletons

* @Module Dagger 模块, Dagger 在此寻找可以构造某个对象的实例的方法
* @Module 可以用来解决依赖关系, 定义所依赖的对象
* @Provides 提供类的实例的构造方式
* @Singleton 告诉 Dagger 编译器, 在某个周期内, 只能创建一次实例
* @Provides 修饰的方法, 根据参数来实例化某个对象, 而实例提供者, 是某个 @Module 中的一个返回值与参数相同的方法(同样被 @Provides 修饰)
* @Component(modules={AppModule.class, NetModule.class}) 注解组件, 参数注明提供注解的类, 需要为所有需要被注解的类, 写不同的 inject()方法, 如以下代码所示
* Dagger 注解不能修饰父类, 其依赖强类型
* @Component 修饰的接口, 最终会生成一个以 Dagger 开始的一个类, 比如以下代码生成 DaggerNetComponent 类
* 在 Application 中初始化相关 Component
* 在需要注入的类中, 使用已经实例化的 Component, 调用其 inject() 方法


```java
@Singleton
@Component(modules={AppModule.class, NetModule.class})
public interface NetComponent {
   void inject(MainActivity activity);
   // void inject(MyFragment fragment);
   // void inject(MyService service);
}
```

```java
public class MyApp extends Application {

    private NetComponent mNetComponent;

    @Override
    public void onCreate() {
        super.onCreate();

        // Dagger%COMPONENT_NAME%
        mNetComponent = DaggerNetComponent.builder()
                // list of modules that are part of this component need to be created here too
                .appModule(new AppModule(this)) // This also corresponds to the name of your module: %component_name%Module
                .netModule(new NetModule("https://api.github.com"))
                .build();

        // If a Dagger 2 component does not have any constructor arguments for any of its modules,
        // then we can use .create() as a shortcut instead:
        //  mNetComponent = com.codepath.dagger.components.DaggerNetComponent.create();
    }

    public NetComponent getNetComponent() {
       return mNetComponent;
    }
}
```


```java
public class MyActivity extends Activity {
  @Inject OkHttpClient mOkHttpClient;
  @Inject SharedPreferences sharedPreferences;

  public void onCreate(Bundle savedInstance) {
        // assign singleton instances to fields
        // We need to cast to `MyApp` in order to get the right method
        ((MyApp) getApplication()).getNetComponent().inject(this);
    }
}
```


### Qualified types

* @Provides 如果提供了返回一种类型的多种方法, 到到底选择哪一个呢, 就可以通过限定符来指定
* 通过 Dagger 提供的 @Qualifier 注解可以定义限定符, 就像定义 annotation 一样

```java
@Provides @Named("cached")
@Singleton
OkHttpClient provideOkHttpClient(Cache cache) {
    OkHttpClient client = new OkHttpClient();
    client.setCache(cache);
    return client;
}

@Provides @Named("non_cached") @Singleton
OkHttpClient provideOkHttpClient() {
    OkHttpClient client = new OkHttpClient();
    return client;
}

@Inject @Named("cached") OkHttpClient client;
@Inject @Named("non_cached") OkHttpClient client2;

@Qualifier
@Documented
@Retention(RUNTIME)
public @interface DefaultPreferences {
}
```


### Scopes

* Scopes 是用来管理各种 Component 的生命周期的, 或者说是管理其使用范围的
* 可以通过 Dagger 提供的注解 @Scope 来定制自己的 Scope, 但如何实现没有详细说明

```java
@Scope
@Documented
@Retention(value=RetentionPolicy.RUNTIME)
public @interface MyActivityScope
{
}
```


### dependent components or subcomponents

* Component 并非一定要一直存在, 有些 Component 只存在于一个 Activity 的周期之内, 或者等到 User login 之后才能做事
* dependent components 是父类指定可以注入的类, 子Component去按照指定的实现, 父类去掉 inject 函数, 由子类独立实现
* 两个 dependent components 不能享有同一个 Scope, 原因是因为 [循环依赖][4de1e2d4] 还是什么, 暂时看不太懂, 先略过
* 虽然 Dagger 有能力创建 Scoped Component, 但需要开发者来实现与此 Scope 一致的行为, Dagger 并不清楚开发者是怎么实现的。 stackoverflow 上面有相关 [讨论][3b4ce1e6], 详细看完 Scope 之后再细看
* 一个 dependent components [例程][1dd5133e]
* dependent components 继承, subcomponents 组合
* 看过 [Dagger demo][765c133f] 得出结论, Scope 就是个标识, 其规范在哪些范围使用, 范围是什么主要看 Component 是什么时候创建的, 比如有个 ImgurActivityComponent, 其初始化是在 ImgurUploadActivity 的 onCreate 方法内, 这些行为都遵守了 @PerImgurActivity 这个 Scope 的约定, 如果有人在另外的 Activity 中创建 ImgurActivityComponent, 使用其注入了某个类, 开发者可以实现, 但是这个 Scope 就被破坏了。
* 另外可以使用 @Inject 修饰 Constructor, 使其能够被用来注入, 但是什么时候使用 @Inject, 什么时候使用 @Provide 肯定有个优先级的。
* Constructor Injection 的两种方式如下, @Inject 和 @Provide
* Lazy injections


```java
// parent component
@Singleton
@Component(modules={AppModule.class, NetModule.class})
public interface NetComponent {
    // remove injection methods if downstream modules will perform injection

    // downstream components need these exposed
    // the method name does not matter, only the return type
    Retrofit retrofit();
    OkHttpClient okHttpClient();
    SharedPreferences sharedPreferences();
}
```

```java
@Provides MyThing provideMyThing(
		SharedPreferences sp,
		Context context) {

	return new MyThing(sp, context);
}

@PerApp
class MyThing {

	private final SharedPRefs…
	private final Context ...

	@Inject public MyThing(
SharedPreferences sp,
		Context context) {

	}
}
```

```java
@Inject Lazy<SharedPreferences> mLazySharedPrefs;
void onSaveBtnClicked() {
    mLazySharedPrefs.get()
                .edit().putString("status", "lazy...")
                .apply();
}
```

### 相关资料

* [Vince Mi's Codepath Meetup Dagger 2 Slides][04e30037]
* [Jake Wharton's Devoxx Dagger 2 Slides][fb9babb4] Tweeter API 设计
* [Jake Wharton's Devoxx Dagger 2 Talk][e0c679a8] 50分钟
* [Dagger 2 Google Developers Talk][5bf99000] 40分钟
* [Dagger 2: Even sharper, less square][5319257d] 比较 Dagger 1, 指出3缺点
* [Architecting Android Applications with Dagger][arch] dagger 与 android 构架

[5319257d]: https://blog.gouline.net/dagger-2-even-sharper-less-square-b52101863542#.flwjtyxlk "Dagger 2: Even sharper, less square"
[e0c679a8]: https://www.youtube.com/watch?v=plK0zyRLIP8 "Jake Wharton's Devoxx Dagger 2 Talk"
[5bf99000]: https://www.youtube.com/watch?v=oK_XtfXPkqw "Dagger 2 Google Developers Talk"
[fb9babb4]: https://speakerdeck.com/jakewharton/dependency-injection-with-dagger-2-devoxx-2014 "Dependency Injection with Dagger 2 (Devoxx 2014)"
[04e30037]: https://docs.google.com/presentation/d/1bkctcKjbLlpiI0Nj9v0QpCcNIiZBhVsJsJp1dgU5n98/ "Dagger 2 in Android"
[765c133f]: https://github.com/vinc3m1/nowdothis "nowdothis"
[1dd5133e]: https://github.com/codepath/dagger2-example "dagger2-example"
[3b4ce1e6]: http://stackoverflow.com/questions/28411352/what-determines-the-lifecycle-of-a-component-object-graph-in-dagger-2 "讨论"
[4de1e2d4]: https://github.com/google/dagger/issues/107#issuecomment-71073298 "循环依赖"
[b0523a1c]: https://github.com/google/dagger "dagger"
[9470cfc6]: https://github.com/hehonghui/InjectDagger "InjectDagger"
[610f5f80]: https://github.com/codepath/android_guides/wiki/Dependency-Injection-with-Dagger-2 "Dependency Injection with Dagger 2"
[arch]: https://www.youtube.com/watch?v=0XHx9jtxIxU





## 依赖注入, 注解与APT

### 依赖注入

* DI, IoC [经典文章][cca94738] 对比 [Service Locator 模式][8b44206d]
* 三种DI方式
  1. Constructor Injection 是根据某种类型, 调用其一个默认实现的子类, Container 会提供一个配置接口, 并且为一个类返回一个默认实现, 当然主要是通过调用其构造方法, 并且可以配置传参
  2. Setter Injection 是在需要被注入的类中有一个 Setter 方法, 用来设置相关依赖, 在此框架会返回一个默认的实现作为参数, Spring 通过 xml 文件配置类的某一个具体实现
  3. Interface Injection 通过声明接口，框架给出默认实现，并且给出关联相关代码，而实现依赖注入, 但这里的例子没有使用注解, 而是直接使用了 Java Code
* Service Locator 与 Dependency Injection 比较，两者都是为了去耦合，依赖注入难以理解和调试

```java
class MovieLister...
  public MovieLister(MovieFinder finder) {
      this.finder = finder;       
  }

class ColonMovieFinder...
  public ColonMovieFinder(String filename) {
      this.filename = filename;
  }

private MutablePicoContainer configureContainer() {
    MutablePicoContainer pico = new DefaultPicoContainer();
    Parameter[] finderParams =  {new ConstantParameter("movies1.txt")};
    pico.registerComponentImplementation(MovieFinder.class, ColonMovieFinder.class, finderParams);
    pico.registerComponentImplementation(MovieLister.class);
    return pico;
}

public void testWithPico() {
    MutablePicoContainer pico = configureContainer();
    MovieLister lister = (MovieLister) pico.getComponentInstance(MovieLister.class);
    Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
    assertEquals("Once Upon a Time in the West", movies[0].getTitle());
}
```

```java
class MovieLister...
  private MovieFinder finder;
  public void setFinder(MovieFinder finder) {
    this.finder = finder;
  }

class ColonMovieFinder...
  public void setFilename(String filename) {
      this.filename = filename;
  }

<beans>
    <bean id="MovieLister" class="spring.MovieLister">
        <property name="finder">
            <ref local="MovieFinder"/>
        </property>
    </bean>
    <bean id="MovieFinder" class="spring.ColonMovieFinder">
        <property name="filename">
            <value>movies1.txt</value>
        </property>
    </bean>
</beans>

public void testWithSpring() throws Exception {
    ApplicationContext ctx = new FileSystemXmlApplicationContext("spring.xml");
    MovieLister lister = (MovieLister) ctx.getBean("MovieLister");
    Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
    assertEquals("Once Upon a Time in the West", movies[0].getTitle());
}
```

```java
public interface InjectFinder {
  void injectFinder(MovieFinder finder);
}

class MovieLister implements InjectFinder {
  public void injectFinder(MovieFinder finder) {
      this.finder = finder;
  }
}

public interface Injector {
  public void inject(Object target);
}

class ColonMovieFinder implements MovieFinder, Injector {
  public void injectFilename(String filename) {
      this.filename = filename;
  }
  public void inject(Object target) {
    ((InjectFinder) target).injectFinder(this);        
  }
}

class Tester {
  private Container container;

  private void configureContainer() {
   container = new Container();
   registerComponents();
   registerInjectors();
   container.start();
  }

  private void registerComponents() {
    container.registerComponent("MovieLister", MovieLister.class);
    container.registerComponent("MovieFinder", ColonMovieFinder.class);
  }

  private void registerInjectors() {
    container.registerInjector(InjectFinder.class, container.lookup("MovieFinder"));
  }

  public void testIface() {
    configureContainer();
    MovieLister lister = (MovieLister)container.lookup("MovieLister");
    Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
    assertEquals("Once Upon a Time in the West", movies[0].getTitle());
  }
}
```

首先, 这个 InjectFinder 是被注入的那个类需要实现的接口, 名字有点问题, 难以理解。 需要使用 finder 的类实现 InjectFinder 接口, 会自动注入相关类。 registerComponent 是注册类, 可以通过 lookup 获取其实例。

registerInjector 表达一种关系, 谁注入谁的关系, 上面经过 registerInjectors 之后 InjectFinder 与 ColonMovieFinder 就关联起来了, ColonMovieFinder 会注入到 InjectFinder 里面去。


[cca94738]: http://www.martinfowler.com/articles/injection.html "Inversion of Control Containers and the Dependency Injection pattern"
[8b44206d]: http://www.cnblogs.com/gaochundong/archive/2013/04/12/service_locator_pattern.html "Service Locator 模式"



### JSR 330

* JSR 330 - 2009 年发布, Spring 2.5 后支持, 依赖注入的标准
* @Inject 注入顺序为构造器，字段，最后是方法。超类的字段、方法将优先于子类的字段、方法被注入
* @Qualifier 给定的类型 T 与可选的限定器，注入器必须能够注入用户指定的类, 循环依赖, Provider<T> 然后显式调用其 get 方法。
* Provider<T> 一般由注入器实现, 可返回多个实例, 而且打破循环依赖的问题
* @Named 是默认实现的一个限定器, 参数是一个 String 类型, 大多数时候够用
* @Scope 用于标识作用域注解, 重新定义一个新 Scope, 不应该含有属性
* @Singleton 是一个Scope 实现, 对象只创建一次


```java
@java.lang.annotation.Documented
@java.lang.annotation.Retention(RUNTIME)
@javax.inject.Scope
public @interface RequestScoped {}
```


### 注解及APT

* Dagger中, 注解的作用是在编译期间帮助生成代码, 运行时, 与注解已无关系
* [javapoet][28c23bee]及其[详解][b56813df] 用来生成 java 源文件的库
* 内置注解 & 元注解 & 实现注解 & 注解处理器
* 注解是一种语法, 怎么处理注解才是最重要的, 我们可以编写一个类实现注解处理, 也可以使用APT
* 一个编译时注解处理的 [简单实例][08ac140b]及其[详解][eb35688c]
* [APT][6d81d951] 及相关项目 [ViewInject][47945735], 完整用心地讲了具体实现
* @AutoService 可以自动(为 Processor)生成配置信息
* Android Studio 2.2 已经自带 annotationProcessor, 不再需要 APT, 即便不使用 Java 8


```java
// 内置注解
// 方法注解，表示此注解修饰的方法覆盖了父类或是接口的方法
// 如果不是这样，则输出警告
@Override

// 对于此注解所修饰的对象（类、域、方法等）
// 当你使用了它们时编译器将输出“已废弃”警告
@Deprecated

// 关闭警告，通过给此注解的元素赋值
// 可以关闭特定警告
@SuppressWarnings



// 元注解
// 定义注解所能作用的目标，说明该注解能作用于何种对象（类、方法、域……之类）。
@Target

// 定义注解保存级别
// 1.源代码注解，被编译器丢弃
// 2.类注解，class文件中可用，被VM丢弃
// 3.运行时可用，搭配反射
@Retention

// 标志将此注解包含至javadoc中
@Documented

// 说明假如此注解是类注解而且你在父类中使用此注解，那么子类将会继承此注解
@Inherited


// 实现注解
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {
    ElementType[] value() default {ElementType.ANNOTATION_TYPE};
}
```


[08ac140b]: https://github.com/zjutkz/Knight "knight"
[eb35688c]: http://zjutkz.net/2016/04/07/%E4%B8%87%E8%83%BD%E7%9A%84APT%EF%BC%81%E7%BC%96%E8%AF%91%E6%97%B6%E6%B3%A8%E8%A7%A3%E7%9A%84%E5%A6%99%E7%94%A8/ "万能的APT！编译时注解的妙用"
[28c23bee]: https://github.com/square/javapoet "javapoet"
[b56813df]: http://www.jianshu.com/p/95f12f72f69a "javapoet——让你从重复无聊的代码中解放出来"
[6d81d951]: http://blog.csdn.net/a1018875550/article/details/52166916 "Android注解-编译时生成代码 (APT)"
[47945735]: https://github.com/a1018875550/ViewInject/tree/master "ViewInject"



## Dagger 2 源码

* dagger 并不是一个 android project, 而是一个 java project, 构建工具为 maven
* maven 构建工具, 它如何构建, 如何集成, 如何打包 之后再说, 但其所有注解打概念得搞清楚
* 源码 中一大部分是新功能, 新概念, 比如 MultiBindings 支持Set 和 Map的多绑定实现插件式开发; Producer 用来支持异步编程模型, 还是先看文档熟悉一下比较好


### 新概念

* MultiBindings 就是把一些值组成一个集合, 有 set 和 map, @IntoSet 和 @StringKey 等等, 用于实现插件式构架, 稍显复杂
* @ProducerModule, @Produces, @ProductionComponent 是提供异步依赖注入的注解, 类似注解 @Module, @Provides, @Component
* @Produces 返回一个 ListenableFuture<T>, 如果其中 T 被依赖, 并且也被 @Produces 修饰, 可以通过注解 @Production 修饰 Executor 来指定
* 错误处理, 被依赖的 T, 就是 Produced<T>, 如果需要做错误处理, 则在此完成, MultiBindings 和 Lazy execution 同样支持
* 返回 Scope 和相应的 Component 一致  @ProductionScope

```java
@ProducerModule(includes = UserModule.class)
final class UserResponseModule {
  @Produces
  static ListenableFuture<UserData> lookUpUserData(
      User user, UserDataStub stub) {
    return stub.lookUpData(user);
  }

  @Produces
  static Html renderHtml(UserData data, UserHtmlTemplate template) {
    return template.render(data);
  }
}

@Module
final class ExecutorModule {
  @Provides
  @Production
  static Executor executor() {
    return Executors.newCachedThreadPool();
  }
}
```

```java
@Produces
static Html renderHtml(
    Produced<UserData> data,
    UserHtmlTemplate template,
    ErrorHtmlTemplate errorTemplate) {
  try {
    return template.render(data.get());
  } catch (ExecutionException e) {
    return errorTemplate.render("user data failed", e.getCause());
  }
}
```


### ComponentProcessor

* getSupportedOptions, initSteps 和 postRound 来自于 BasicAnnotationProcessor
* [google auto][8d0c2958], 这个项目是用来帮助自动生成代码的
* [google guava][bbefc12b] 是 Google 开源的 Java 库, 在Java标准库上面的一些封装, 让 java 更加优雅, [guava guide][8c55c7d5]
* BasicAnnotationProcessor 中接口 ProcessingStep, ElementName

[8d0c2958]: https://github.com/google/auto "Auto"
[bbefc12b]: https://github.com/google/guava "Google Core Libraries for Java 6+"
[8c55c7d5]: https://github.com/google/guava/wiki "Guava User Guide"


#### BasicAnnotationProcessor.ProcessingStep

```java
// 处理阶段, 每个处理阶段可以处理一些注解的逻辑
public interface ProcessingStep {
    // 返回该阶段需要处理的注解类型
    Set<? extends Class<? extends Annotation>> annotations();

    // 处理注解和被注解的元素, 是 SetMultimap 类型, 说明可以处理多个注解,
    // 同时每个注解可能注释了多个不同的元素
    Set<Element> process(SetMultimap<Class<? extends Annotation>, Element> var1);
}
```


#### BasicAnnotationProcessor.ElementName

```java
// 该类主要用来存放节点名称, 并且区分包节点和类型节点
private static final class ElementName {
    private final BasicAnnotationProcessor.ElementName.Kind kind;
    private final String name;
    // ... 其中一些方法简化, 是一些构造方法和一些比较相关的方法
    private static enum Kind {
        PACKAGE_NAME,
        TYPE_NAME;
    }
}
```


#### BasicAnnotationProcessor 5个变量

* deferredElementNames 未处理的元素
* elementsDeferredBySteps 未处理的元素(按照 ProcessingStep 区分)
* processorName 该 processor 的名称
* elements 所有元素
* messager 用于编译过程中报告错误
* steps 所有处理步骤(ProcessingStep)


#### RoundEnvironment

* 这个注释处理是一轮一轮进行的, RoundEnvironment 代表这一轮的处理环境
* processingOver 表示上一轮处理完成, errorRaised 表示前面有错误发生
* getRootElements 上一轮处理的根元素
* getElementsAnnotatedWith 获取被注解的元素, 有两个重载的方法


#### BasicAnnotationProcessor 处理流程

* init 初始化, 暴露 initSteps 给子类, 让其返回其想要实现的 ProcessingStep
* process 函数先检查了一些状态, 然后通过 deferredElementNames 得到了 deferredElements, 但奇怪的是, deferredElementNames 和 elements 怎么初始化
* 只在 validElements 方法中看到 deferredElementNames 被更改, 说明 deferredElements 来自处理结束, 最可能的是上一步留下的, 未处理的 Elements
* validElements 做了什么呢?
* 下载了代码之后, 看完了头部的注释, 解释了如何处理一个 ProcessingStep, 然后哪些 element 需要延迟处理, 整个逻辑就清晰了。
* BasicAnnotationProcessor 中, 注解处理器会多次调用 process 方法吗？ 如果未处理完成, 应该如何表征, 这是个问题, 后面慢慢弄明白

-- end --


