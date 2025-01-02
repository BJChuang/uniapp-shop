<template>
	<view>
		<!-- <button  @tap="masks()">确认收货</button> -->
		
		<!-- 密码框 -->
		<view v-if="data.mask" style="width: 100%;height: 100%;position:fixed;background: rgba(0,0,0,0.4);top: 0;z-index: 9999;overflow: hidden;">
			<view :class="data.bott" class="masks">
				<view style="padding: 5% 3%;">
					<view @tap="maskss()" style="float: left;font-size: 36rpx;margin: 0 0 0 0;font-weight: bold;">×</view>
					<view style="text-align: center;font-size:30rpx;padding-top: 3%;">{{text}}</view>
				</view>
				<view style="display: flex;width: 80%;margin:10% auto;text-align: center;">
					<view v-for="(item , index) in data.pasList" :key='index' style="flex: 1;">
						<view style="width: 80rpx;height: 80rpx;border: 1px solid #ccc;margin: auto;line-height:1;">
							<text v-if="data.passwordArray.length > index" style="font-size:30rpx;position: relative;top: 20rpx;">●</text>
						</view>
					</view>
				</view>
				<view style="display: flex;flex-wrap: wrap;text-align: center;">
					<view style="float: left;" v-for="(num , indexs) in data.numbr " :key='indexs' @tap="passwordBox(num)" hover-class="hover" :hover-stay-time='20' class="password">
						{{num}}
					</view>
					<view @tap="backspace()" class="password" style="background: #EA5455;color: #fff;">删除</view>
					<!-- <view @tap="reset()" class="password" style="background: #09BB07;color: #fff;">重置</view> -->
					<!-- <view @tap="passwordBox(0)" hover-class="hover" :hover-stay-time='20' class="password">0</view> -->
					
				</view>
			</view>
		</view>
	</view>	
</template>

<script setup>
	import { reactive,getCurrentInstance } from 'vue'
	import {onLoad,onShow} from "@dcloudio/uni-app"
	const {proxy} = getCurrentInstance() // 有效  全局
	
	const props = defineProps({
		text:{
			type:String,
			default:'请输入支付密码'
		}
	})
	
	const emits = defineEmits(['password'])
	
	const data = reactive({
		password: '',
		mask: false,
		passwordArray: [],
		bott: '',
		pasList: ['', '', '', '', '', ''],
		numbr: [1, 2, 3, 4, 5, 6, 7, 8, 9,0]
	})
	
	// 密码框
	const passwordBox = (num)=> {
		if (data.passwordArray.length < 6) {
			data.passwordArray.push(num)
		}
		if (data.passwordArray.length == 6) {
			var str = ''
			for (let i = 0; i < data.passwordArray.length; i++) {
				str += data.passwordArray[i];
			}
			console.log(str)
			data.password = str
			data.mask = false
			data.passwordArray = []
			data.bott = ''
			
			emits('password',data.password)
		}
	}
	const reset = ()=> {
		data.passwordArray = []
	}
	const backspace = ()=> {
		data.passwordArray.pop()
	}
	const masks = ()=> {
		data.mask = true
		setTimeout(()=> {
			data.bott = 'bot'
		}, 50)
	}
	const maskss = ()=> {
		data.mask = false
		data.bott = ''
		data.passwordArray = []
	}
	defineExpose({passwordBox,maskss,masks,backspace,reset,data})
</script>


<style>
.password{width: 25%;flex-grow:1;padding: 3%;font-size:40rpx;box-shadow:0px 0px 1rpx #ccc;}
.hover{background: #eee;}
.masks{bottom:-50%;position: fixed;background: #fff;width: 100%;transition:.5s}
.bot{bottom: 0;}
</style>
