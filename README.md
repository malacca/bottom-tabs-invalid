[React Navigation](https://reactnavigation.org/) `createBottomTabNavigator` 导航器的一个分支，该分支起源于一个 [需求](https://github.com/react-navigation/react-navigation/pull/8155)，默认的 `@react-navigation/bottom-tabs` 已无法满足需求，但改动又比较大，干脆拉出来一个分支。改动：

 - 移除了原版的 `tabBarOptions` 属性，将 `tabBarOptions` 属性合并到 `options` 中了，即支持在任意 Screen 设置原 `tabBarOptions` 支持的属性

 - 默认支持了 badge 角标功能

 - 支持在 TabBar 中插入自定义组件


安装方式与原版相同（无需再安装原版了）

`yarn add @malacca/bottom-tabs`


由于 `@react-navigation/bottom-tabs` 依赖 `@react-navigation/native`，且不匹配的版本可能无法运行，可以在 [package.json](package.json) 中查看当前版本所需的 `@react-navigation/native` 最低版本。

使用方式与原版相同，如：

```
import { createBottomTabNavigator } from '@malacca/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator
    initialRouteName={String}
    backBehavior={String}
    lazy={}
    tabBar={}

    screenOptions={}
    injectTabs=[]
>
  <Tab.Screen
      name={String}
      listeners={}
      component={}
      initialParams={}

      options={}
  />
</Tab.Navigator>
```

# 一、 属性说明

与原版相同，作用如下：

- ` initialRouteName` ：载入时显示的页面
-  `backBehavior` ：在 Tab 界面时， 响应 android 物理返回键的方式
    - initialRoute: 返回到 initialRouteName 定义的页面
    - order: 跳转到前一个 tab 页面
    - history: 跳转到上次浏览的 tab 页面
    - none: 不监听
- `lazy`：是否懒加载页面，在进入 tab 页面时才开始渲染（默认 true）
- `tabBar`：自定义 Bottom Tab Bar 组件
- `screenOptions` 是 `Screen.options` 的默认配置，二者属性值完全相同，下面会说明
-  `injectTabs` 向 tabBar 注入自定义按钮。

说明：`screenOptions`、`injectTabs`、`Screen.options` 属性仅针对默认 `tabBar`，若自定义 `tabBar`，在自定义的 `tabBar` 组件中也可以获取这些配置，但具体作用由自定义 `tabBar` 决定。

# 二、screenOptions  / Screen.options

设置方式

```
options || screenOptions = {
    activeOpacity, activeTintColor, activeBackgroundColor, ........
}

// 或通过函数返回
options || screenOptions = { ({route, navigation}) => {
    return {
       activeOpacity, activeTintColor, activeBackgroundColor, ........
    }
}}
```

以下属性为原版的 `tabBarOptions` 支持属性，现在将其转移到了 `options` 中，这些属性无论是在 `Navigator.screenOptions` 或 `Screen.options` 中定义，都将影响整个 TabBar；比如在某一个 `Screen.options` 定义 `props.showIcon=false`，那么 TabBar 上的所有 Tab 都不再显示 Icon 图标，而不是仅仅是所属 Screen 的 Tab 隐藏 Icon；支持原版所有属性 + 额外增加的几个配置项

### `activeTintColor`
 处于激活状态的 Tab 字体颜色

### `activeBackgroundColor`
处于激活状态的 Tab 背景颜色

### `inactiveTintColor`
未激活的 Tab 字体颜色

### `inactiveBackgroundColor`
未激活的 Tab 背景颜色

### `showLabel`
是否显示 Tab 中的文字

### `allowFontScaling`
是否允许文字随系统字体大小进行缩放，默认为 true

### `showIcon`
是否显示 Tab 中的图标

### `adaptive`
默认情况下，Tab 中的图标/文字为上下排列；如果屏幕宽度大于 768 （如平板）或手机处于横屏状态，Tab 的图标/文字排列方式将自动转为左右排列；可使用 `adaptive=false` 关闭该特性

### `labelPosition`
强制指定 Tab 中图标/文字的排列方式，若设置，则 `adaptive` 属性失效，可用值：
  - below-icon - 上下排列
  - beside-icon - 左右排列

### `keyboardHidesTabBar`
是否在弹出键盘时隐藏 TabBar，默认为 false

### `safeAreaInset`
安全区域设置，默认为 `{ bottom: 'always', top: 'never' }`；可用属性有 `top | bottom | left | right`，可用设置有 `'always' | 'never'`

### `style`
自定义 TabBar 样式

### `tabStyle`
自定义 Tab 样式

### `labelStyle`
自定义 Tab 中的文字所在的 View 容器的样式

### `badgeStyle`
自定义 Tab 中文字角标样式

### `dotStyle`
自定义 Tab 中圆点角标样式

### `activeOpacity`
按下 Tab 时的透明度，android/iOS 通用，默认为 1（即无效果 ）

### `rippleColor`
按下 Tab 时的水波纹颜色，该属性仅在 Android API level 21+ 生效，若不符合条件，将自动降级，使用 `activeOpacity` 属性


----TabBar props End---

以下属性为 Tab 属性，一般在 `Screen.options` 中设置，仅针对当前 Screen 的 Tab；但对于支持设置为函数的属性也可以在 `Navigator.screenOptions` 中设置，只需根据参数返回不同 Tab 属性即可。

### `tabBarIcon`
Tab 中的 Icon 图标，属性值必须为 `Function`，其中 route 结构参见 [官方文档](https://reactnavigation.org/docs/route-prop)

```
tabBarIcon=({
    index: number,  // Tab 序号
    route: Route,  // Tab 所属 Screen 的 route
    focused: boolean,  //  当前是否处于激活状态
    color: string,  // 当前颜色（根据 focused 返回的 activeTintColor 或 inactiveTintColor）
    size: number, // 图标大小（由排列方式的不同[上下/左右]返回的推荐值）
}) => {
    
    // 需返回一个 react native 组件
    return ReactElement;
}
```

### `tabBarLabel`
Tab 中的 文字，可直接指定为 string；也可设置为 `Function`

```
tabBarLabel=({
    index: number,  // Tab 序号
    route: Route,  // Tab 所属 Screen 的 route
    focused: boolean,  //  当前是否处于激活状态
    color: string,  // 当前颜色（根据 focused 返回的 activeTintColor 或 inactiveTintColor）
    showIcon: boolean,   // 当前 Tab 是否显示 icon
    beside: boolean,   // 当前 Tab 是否为图标/文字左右排列
}) => {
   
    // 返回 文字 或 react native 组件
    return string || ReactElement;
}
```

### `badge`

角标，支持直接设置为以下属性，也支持通过 `Function` 返回:
  - null: 不显示角标
  - Number(0): 显示为圆点角标
  - number|string: 显示为文字角标
  - ReactElement: react native 组件

```
badge=({
    index: number,  // Tab 序号
    route: Route,  // Tab 所属 Screen 的 route
    showIcon:bool, // 当前是否显示 icon 图标
    badgeStyle:Style, // 自定义的文字角标样式
    dotStyle:Style, // 自定义的圆点角标样式
}) => {
     return null | number | string | ReactElement
}
```

### `tabBarButton`
Tab 组件，包裹  `tabBarIcon` 、 `tabBarLabel`、`badge` 的父组件，类型为 `Function` 或 `RN Component`

```
tabBarButton = (props) => {
   return <TouchableOpacity {...props} />
}
```

### `title`
标题，仅支持 string，若 Tab Navigator 嵌套在 Stack Navigator 中，会作为标题栏的 title fallback；同时也作为 `tabBarLabel` 的 fallback

### `tabBarVisible`
隐藏 TabBar，当前 Tab 引导进入的页面不想显示 TabBar 可设置为 true，需自行在页面中给予返回的导航按钮。

### `tabBarAccessibilityLabel`
辅助功能标签，当用户点击选项卡时，屏幕阅读器会读取该内容；若没有设置 `tabBarLabel` 或 `showLabel=false`，建议设置该项

### `tabBarTestID`
当前 Tab 的测试 ID

### `unmountOnBlur`
当所属 Screen 被切换走，是否卸载 Screen 组件，再次进入时重建；这样会清除之前的状态，默认为 false


### 额外说明：

- TabBar 在 “图标/文字上下排列” 时，style.height=50
- 在 “左右排列” 时，style.height=40
- `options` 中自定义的 `style` 属性可以通过 `style.height` 重置 “图标/文字上下排列” 的高度；另外支持一个不符合规范的 `style.landHeight` 同时设置 “左右排列” 时的高度。
- TabBar 的实际高度为  style.height + safeAreaInset.bottom

# 三、injectTabs

有时，需要在 TabBar 显示一些其他导航元素，比如添加一个 Tab 按钮，点击打开另外一个 stack 页面，或弹出一个互动窗口等；仅靠 Tab.Screen 定义就无能为力了，所以新增一个 `injectTabs`，可以注入自定义的 Tab 到 TabBar 中。定义方式如下

```js
injectTabs={[
      {
          // 插入位置
          index:number,  

          // 插入组件
          tabButton: ReactComponent || (({ beside })  => ReactComponent) 
      }

      // 可注入多个
      ......
]}


// 举例
injectTabs={[
  {
      index:3,

      // 直接指定为组件
      // 注意: tabButton 是在数组中, 所以需要指定 key 属性
      tabButton: <View key="xxx" style={{
            flex:1,
            alignItems: 'center',
            justifyContent:"center"
       }><TouchableOpacity style={{
            width:40,
            height:40,
            backgroundColor:'red'
       }} onPress={() => {
           console.log('inject')
       }}/></View>

       // 或通过函数返回
       // beside: 当前 TabBar 的图标/文字 是否为左右排列
       tabButton: ({beside}) => {
           return (<View key="xxx" style={{
                flex:1,
                alignItems: 'center',
                justifyContent:"center"
            }><TouchableOpacity style={{
                width:40,
                height: beside ? 30 : 40,
                backgroundColor:'red'
            }} onPress={() => {
                console.log('inject')
            }}/></View>)
        }
   },

   .....
]}

```
