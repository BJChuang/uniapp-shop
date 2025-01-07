<template>
	<view class="auth_login">
		<view class="self_head">
			<view class="left_icon" @click="R.nav('',3)"><uni-icons color="#fff" size="20" type="arrowleft"></uni-icons></view>
			<view class="index_title">
				amazon - Mall
			</view>
			<view class="index_subtit">
				<text class="cntit">拥有属于自己的线上商城平台</text>
				<text class="entit">A PLATFORM FULL OF IMAGINATION</text>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="input_main app">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
			<view class="input_main">
		<!-- #endif -->
			<view class="title">找回密码</view>
			<view class="item">
				<view class="lab"><uni-icons type="person-filled" size="20" color="#333"></uni-icons></view>
				<view class="input">
					<input type="text" v-model="data.params.username" placeholder="请输入您的手机账号" />
				</view>
			</view>
			<view class="item">
				<view class="lab"><uni-icons type="locked-filled" size="20" color="#333"></uni-icons></view>
				<view class="input">
					<input type="password" v-model="data.params.password" placeholder="请输入您的新密码" />
				</view>
			</view>
			<view class="item">
				<view class="lab"><uni-icons type="locked-filled" size="20" color="#333"></uni-icons></view>
				<view class="input">
					<input type="password" v-model="data.params.re_password" placeholder="请再次输入您的新密码" />
				</view>
			</view>
			<view class="item">
				<view class="lab"><uni-icons type="email-filled" size="20" color="#333"></uni-icons></view>
				<view class="input sms">
					<input type="number" v-model="data.params.code" placeholder="验证码" />
					<view :class="data.wait?'send ck':'send'" @click="sendSms()">{{data.text}}</view>
				</view>
			</view>
			<view class="login_btn" @click="login">修改密码</view>
			
			<view class="other">
				<text @click="R.nav('/pages/auth/login')">已有账号，立即登录</text>
			</view>
		
		</view>

	</view>
</template>

<script setup>
	import { reactive,getCurrentInstance } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	
	const data = reactive({
		params:{
			provider:'users'
		},
		num:0,
		text:'发送验证码',
		wait:false,
	})
	
	const sendSms = ()=>{
		if(data.wait){
			return R.toast('请不要频繁发送短信')
		}
		R.post('/Wap/sms',{phone:data.params.username,name:'forget_password'}).then(res=>{
			if(res.code==200){
				data.num = 60;
				data.wait = true;
				let obj = setInterval(()=>{
					data.num--
					data.text = data.num+'s';
					console.log(data.text)
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
	const login = ()=>{
		if(data.params.password != data.params.re_password){
			return R.toast('两次密码输入不一致');
		}
		R.post('/Wap/forget_password',{type:'phone',...data.params}).then(res=>{
			if(res.code == 200){
				uni.$emit('users')
				uni.setStorageSync('token',res.data.access_token);
				// sessionStorage.setItem('token',res.data.access_token)
				uni.switchTab({
					url:'/pages/index/self'
				})
			}else{
				return R.toast(res.msg);
			}
		})
		
	}
	
</script>

<style lang="scss">
page{
	background: linear-gradient(to left,$primary,$gradient);
	background-size: 100% 100%;
	height: 100%;
	width: 100%;
}
</style>
<style lang="scss" scoped>
.auth_login{
	position: relative;
	height: 100%;
	.input_main{
		.other{
			display: flex;
			color:#999;
			font-size: $uni-font-size-base;
			margin-top: 20rpx;
			text{
				&:last-child{text-align: right;}
				flex: 1;
			}
		}
		.login_btn{
			width: 100%;
			text-align: center;
			border-radius: 30rpx;
			background: linear-gradient(to left,$primary,$gradient);
			color:#fff;
			line-height: 90rpx;
		}
		.item{
			margin-bottom: 60rpx;
			border-bottom: 1px solid #eee;
			padding-bottom: 15rpx;
			display: flex;
			.lab{flex: 0 0 80rpx;}
			.input{
				&.sms{
					display: flex;
					.send{
						flex: 0 0 160rpx;border-left: 1px solid #eee;padding-left: 20rpx;padding-right: 20rpx;text-align: center;
						&.ck{
							color:#999;
						}
					}
				}
				font-size: $uni-font-size-base;flex: 1;
			}
		}
		.title{
			margin-bottom: 80rpx;
			font-size: 42rpx;
			font-weight: bold;
			border-bottom: 6rpx solid $primary;
			width: 190rpx;
			padding-bottom: 20rpx;
		}
		background: #fff;
		position: relative;
		z-index:300;
		width:90%;
		margin:0rpx auto 0 auto;  
		min-height: 400rpx;
		border-radius: 30rpx;
		padding: 30rpx 30rpx 80rpx 30rpx;
		box-sizing: border-box;
	}
	.self_head{
		.index_title{
			padding-top: 130rpx;
			height: 92rpx;
			font-size: 52rpx;
			// font-family: BWCKKT, BWCKKT-Bold;
			text-align: CENTER;
			color: #ffffff;
			line-height: 92rpx;
			letter-spacing: 4rpx;
			image{
				height: 100%;
			}
		}
		.index_subtit{
			margin-top: 30rpx;
			margin-bottom: 20rpx;
			font-size: 26rpx;
			text-align: center;
			display:flex;
			flex-direction:column;
			.cntit{
				color:#fff;
				letter-spacing: 14rpx;
				font-size: 26rpx;
			}
			.entit{
				color:#fff;
				transform: scale(0.85);
			}
		}
		.title{
			text-align: center;
			padding-top: 140rpx;
			image{width: 400rpx;height: 130rpx;}
			display: block;
		}
		.desc{
			text-align: center;
			margin-top: 30rpx;
		}
		// background: #7F6044;
		padding-top: calc(var(--status-bar-height));
		min-height: 380rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		border-radius: 0 0 30% 30%;
		color:#fff;
		.left_icon{
			position: absolute;background: rgba(#000, 0.4);border-radius: 50%;width: 70rpx;height: 70rpx;text-align: center;box-sizing: border-box;
			padding-top: 12rpx;
			left:40rpx;top:calc(var(--status-bar-height) + 40rpx);
		}
		// box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
	}
}

</style>
