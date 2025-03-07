<template>
	<view class="cash_out">
		<view class="pdbg">
			<view class="item">
				<text class="t1">TRC20</text>
				<text class="t2 t3">{{data.checkInfo.trc20address||'-'}}</text>
				<!-- <view class="t3" @click="R.nav('/pages/users/check/form?edit=true')"> <uni-icons type="compose"></uni-icons> </view> -->
			</view>
			<!-- <view class="item">
				<text class="t1">提现银行</text>
				<text class="t2">{{data.checkInfo.bank_name||'-'}}</text>
			</view>
			<view class="item">
				<text class="t1">银行卡号</text>
				<text class="t2">{{data.checkInfo.bank_no||'-'}}</text>
			</view> -->
			
	<!-- 		<view class="item">
				<text class="t1">验证码</text>
				<input class="t2" type="text"  v-model="data.code" placeholder="请输入验证码" placeholder-style="font-size:28rpx" />
				<view :class="data.wait?'send ck':'send'" @click="sendSms()">{{data.text}}</view>
			</view>
			 -->
			<!-- <view class="item">
				<text class="t1">支付密码</text>
				<input class="t2" type="password" v-model="data.pay_password" placeholder="请输入6位支付密码" placeholder-style="font-size:28rpx" />
			</view> -->
		</view>
		
		<view class="cash_input">
			<view class="cash_money_text">提现金额</view>
			<view class="cash_money">
				<text>￥</text>
				<input type="number" v-model="data.money" :placeholder="data.info.money" />
			</view>
			<view class="now">
				<text class="t1">账号余额:￥{{data.userInfo.money||'0.00'}}</text>
				<text class="t2">提现收取手续费 {{data.userInfo.cash_rate||'0.00'}} %</text>
			</view>
		</view>
		
		<view class="log-out-btn" @click="addCash">
			确定提现
		</view>
		
	</view>
</template>

<script setup>
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { reactive,ref } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	const bok = ref(true)
	const data = reactive({
		info:{},
		checkInfo:{},
		userInfo:{},
		money:0,
		pay_password:'',
		num:0,
		text:'发送验证码',
		wait:false,
		code:'',
		pay_password:''
	})
	
	const sendSms = ()=>{
		if(data.wait){
			return R.toast('请不要频繁发送短信')
		}
		R.post('/Wap/sms',{phone:data.userInfo.phone,name:'cash'}).then(res=>{
			if(res.code==200){
				data.num = 60;
				data.wait = true;
				let obj = setInterval(()=>{
					data.num--
					data.text = data.num+'s';
					if(data.num<1){
						clearInterval(obj);
						data.num = 0
						data.text = '发送验证码';
						data.wait = false
					}
				},1000);
			}else{
				return R.toast(res.msg)
			}
		})
	}
	
	const addCash = (e)=>{
		console.log(bok.value)
		if(!bok.value) return false
		bok.value = false
		uni.showLoading({
			mask:true
		})
		R.post('/Wap/users/cashes',{money:data.money,trc20address:data.checkInfo.trc20address,pay_password:data.pay_password}).then(res=>{
			
			if(res.code == 200 && res.data != null){
				uni.$emit('users')
				R.toast(res.msg)
				R.nav('',3)
				loadData()
				
				
			}else{
				R.toast(res.msg)
				
				
			}
			uni.hideLoading()
			setTimeout(()=>{
				
				bok.value = true
				
			},1500)
		}).catch((err)=>{
			setTimeout(()=>{
				
				bok.value = true
				
			},1500)
		})
	}
	
	// 获取身份是否认证
	const loadData = ()=>{
		R.get('/Wap/users/cashes/show/0',{}).then(res=>{
			if(res.code == 200 && res.data != null){
				data.userInfo = res.data
				data.checkInfo = res.data.user_check
				// 去掉实名验证
				if(res.data.user_check == null){
					R.nav('/pages/users/check/form')
				}
			}else{
				R.nav('/pages/users/check/form')
			}
		})
	}
	
	onLoad(()=>{
		uni.$on('check',()=>{
			loadData()
		})
		loadData()
	})
	
</script>

<style lang="scss">
.pdbg{
	margin:0 30rpx;
	padding: 10rpx;
	background: #fff;
	border-radius: 15rpx;
}
.cash_out{
	border-top: none;
	font-size: 28rpx;
	.log-out-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 90rpx;
		margin: 60rpx auto;
		color: #fff;
		background-color: $primary;
		border-radius: 10rpx;
		// box-shadow: 1px 2px 5px rgba(219, 40, 43, 0.4);	
	}
	.cash_input{
		margin:20rpx 30rpx;
		border-radius: 15rpx;
		background-color: #fff;
		padding: 30rpx;
		.cash_money_text{
			font-size: 30rpx;
			color:#999;
			margin-bottom: 30rpx;
		}
		.cash_money{
			text{
				font-size: 60rpx;
				float: left;
			}
			input{
				float: left;
				font-size: 34rpx;
				line-height: 70rpx;
				height: 70rpx;
				border-bottom: 1px solid #f1f1f1;
			}
			&:after{
				content:'';
				display: block;
				clear: both;
			}
		}
		.now{
			margin-top: 20rpx;
			.t1{
				float: left;
				color:#999;
			}
			.t2{
				float: right;
				color:$primary;
			}
			
			&:after{
				content:'';
				display: block;
				clear: both;
			}
		}
	}
	.item{
		border-bottom: 1px solid #f1f1f1;
		line-height: 50rpx;
		box-sizing: border-box;
		padding: 30rpx;
		display: flex;
		background-color: #fff;
		position: relative;
		&:last-child{
			border: none;
		}
		.t1{margin-right: 20rpx;flex:0 0 120rpx;}
		.t2{color:#999;}
		.t3{
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			display: inline-block;
		}
	}
	.send{
		flex: 0 0 140rpx;border-left: 1px solid #eee;padding-left: 20rpx;padding-right: 20rpx;text-align: center;
		&.ck{
			color:#999;
		}
	}
}
</style>
