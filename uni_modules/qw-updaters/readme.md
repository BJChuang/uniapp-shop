# qw-updaters 青梧 客户端检查更新 Vue3
#### 火箭图片是拿的这位仁兄插件的 [插件ID：zhouWei-APPUpdate](https://ext.dcloud.net.cn/plugin?id=1643) 有版权问题联系我更换.

## 如何使用
``` javascript
<template>
	<view class="content">
		<qw-updaters ref="updaters" />
	</view>
</template>
```

- 1、在你要更新的地方，如app 去请求拿取最新版本的数据

- 2、将你得到的数据传入 updaters组件  checkVersion 

``` javascript
{
	name:'在线更新',  // 标题 非必填
	content:'',  // 更新内容  非必填
	version:'1.0.0', // 版本名称  非必填
	version_code:100,// 版本号  必填
	device:'android', // android|ios 暂时非必填
	is_wgt:0, // 是否资源包更新  非必填
	apple_id:'' // IOS 跳转的需要 非必填
	url:'', // 最新包地址
}
```
- 3、执行checkVersion()

``` javascript
// vue3 
const updaters = ref(null)
updaters.value.checkVersion({version_code:100,url:'xxx'})

// vue2
this.$refs.updaters.checkVersion({version_code:100,url:'xxx'})
```

- 4、其他配置信息

``` javascript
const props = defineProps({
	cancelText:{
		type:String,
		default:'暂不升级'
	},
	cancelBg:{
		type:String,
		default:'#fff'
	},
	cancelColor:{
		type:String,
		default:'#666'
	},
	cancelBorderColor:{
		type:String,
		default:'#ddd'
	},
	confirmText:{
		type:String,
		default:'升级更新'
	},
	confirmBg:{
		type:String,
		default:'#dd524d'
	},
	confirmColor:{
		type:String,
		default:'#fff'
	},
	confirmBorderColor:{
		type:String,
		default:'none'
	},
	progressColor:{
		type:String,
		default:'#dd524d'
	},
})
```

- 5、例如

``` javascript
<template>
	<view class="content">
		<qw-updaters ref="updaters" confirmBg="#000" />
	</view>
</template>
```