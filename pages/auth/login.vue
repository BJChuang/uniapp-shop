<template>
	<view class="auth_login">
		<view class="self_head">
			<!-- <view class="left_icon" @click="R.nav('/pages/index/home',1)"><uni-icons color="#fff" size="20" type="arrowleft"></uni-icons></view> -->
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
			<view class="title">登录</view>
			<view class="item">
				<view class="lab"><uni-icons type="person-filled" size="20" color="#333"></uni-icons></view>
				<view class="input">
					<input type="text" v-model="data.params.username" placeholder="请输入您的手机账号" />
				</view>
			</view>
			<view class="item">
				<view class="lab"><uni-icons type="locked-filled" size="20" color="#333"></uni-icons></view>
				<view class="input">
					<input type="password" v-model="data.params.password" placeholder="请输入您的密码" />
				</view>
			</view>
			<view class="login_btn" @click="login">立即登录</view>
			<view class="other">
			
				<text @click="R.nav('/pages/auth/register')">新用户注册</text>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="wechat_login" >
				<view class="wechat_login_cen">
					<uni-icons type="weixin" size="34" color="#42b983"></uni-icons>
					<!-- <button class="con" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号登录</button> -->
					<button class="con" @click="wxlogin">微信快捷登录</button>
				</view>
			</view>
			<!-- #endif -->
		</view>
		
	</view>
</template>

<script setup>
	import { reactive,getCurrentInstance } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import config from "@/plugins/config.js"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	
	const data = reactive({
		params:{
			username:'',
			password:'',
			provider:'users'
		},
	})
	
	const login = ()=>{
		uni.showLoading({
			title:'登录中...'
		})
		R.post('/Wap/login',data.params).then(res=>{
			if(res.code == 200){
				// console.log(res.data.access_token)
				uni.setStorageSync('token',res.data.access_token);
				// sessionStorage.setItem('token',res.data.access_token)
				uni.$emit('users')
				uni.switchTab({
					url:'/pages/index/self'
				})
			}else{
				return R.toast(res.msg);
			}
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	
	const wxlogin = ()=>{
		// #ifdef H5
		console.log(config.path + "/api/oauth/weixin")
		return window.location.href=config.path + "/api/oauth/weixin"
		// #endif
		
		uni.login({
		  provider: 'weixin',
		  success:  (loginRes)=> {
		    // console.log(loginRes.authResult);
			// 获取用户信息
			// #ifdef MP-WEIXIN
			// 小程序登录
			uni.showLoading({
				title:"登录中..."
			})
			R.get("/Wap/openid/code",{device:'mini',payment_name:'wechat',code:loginRes.code},1).then(item=>{
				if(item.code && item.code == 200){
					R.post("oauth/callback/weixinmini",item.data,1).then(res=>{
						uni.setStorageSync('openid',res.data.openid);
						if(res.code && res.code == 200){
							uni.hideLoading()
							uni.setStorageSync('token',res.data.access_token);
							uni.$emit('users')
							uni.switchTab({
								url:'/pages/index/self'
							})
						}else{
							uni.hideLoading()
							return R.toast(res.msg);
						}
					})
				}else{
					uni.hideLoading()
					return R.toast(res.msg);
				}
				
			})
			// #endif
			// #ifndef MP-WEIXIN
			uni.getUserInfo({
			  provider: 'weixin',
			  success:  (infoRes)=> {
				loginRes.authResult.nickname = infoRes.userInfo.nickName
				loginRes.authResult.avatar = infoRes.userInfo.avatarUrl
				this.$http(this.$api.authLogin,loginRes.authResult).then(res=>{
					console.log(res)
					if(res.code== 200){
						R.toast('登陆成功')
						uni.$emit('users')
						uni.setStorageSync('token',res.data.token);
						uni.switchTab({
							url:'/pages/index/self'
						})
					}else{
						R.toast('登录异常')
					}
				})
			  }
			});
			// #endif
			
		  }
		});
	}
	
	const getCode = (code)=>{
		this.$http(this.$api.authLogin,{code:code}).then(ress=>{
			// 获取用户信息
			uni.getUserInfo({
			  provider: 'weixin',
			  success:  (infoRes)=> {
				loginRes.authResult.nickname = infoRes.userInfo.nickName
				loginRes.authResult.openid = res.data.openid
				loginRes.authResult.unionid = res.data.unionid
				this.$http(this.$api.authLogin,loginRes.authResult).then(res=>{
					console.log(res)
					if(res.code== 200){
						R.toast('登陆成功')
						uni.$emit('users')
						uni.setStorageSync('token',res.data.token);
						uni.switchTab({
							url:'/pages/index/self'
						})
					}else{
						R.toast('登录异常')
					}
				})
			  }
			});
		})
	}
	
	// 获取微信小程序手机号
	const getPhoneNumber = (e)=>{
		let {encryptedData,iv,code} = e.detail
		let device = 'mini'
		let payment_name = 'wechat'
		uni.login({
		  provider: 'weixin',
		  success:  (loginRes)=> {
			  uni.showLoading({
			  	title:"微信登录中..."
			  })
			  setTimeout(()=>{
				R.post("/Wap/oauth/callback/weixinminiphone",{encrypted_data:encryptedData,iv,code:loginRes.code,device,payment_name},1).then(res=>{
					uni.setStorageSync('openid',res.data.openid);
					if(res.code && res.code == 200){
						uni.hideLoading()
						uni.setStorageSync('token',res.data.access_token);
						uni.$emit('users')
						uni.switchTab({
							url:'/pages/index/self'
						})
					}else{
						uni.hideLoading()
						return R.toast(res.msg);
					}
				})  
			  },300)
		  }
			
		})
		
		// console.log(e.detail.code)  // 动态令牌
		//     console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
		//     console.log(e.detail.errno)  // 错误码（失败时返回）
	}
	
	const getUserInfo = ()=>{
		uni.login({
		  provider: 'weixin',
		  success:  (loginRes)=> {
		    // console.log(loginRes.code);
			this.getCode(loginRes.code);
		  }
		});
	}
	onLoad(()=>{
		// const token = uni.getStorageSync('token')
		// if(token){
		// 	uni.switchTab({
		// 		url:'/pages/index/home'
		// 	})
		// }
	})
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
	.line{height: 1px;background: #eee;margin:0 100rpx;border-radius: 2rpx;margin-top: 20rpx;}
	.line2{height: 1px;background: #fff;margin:0 100rpx;border-radius: 2rpx;}
	.wechat{
		margin-top: 180rpx;
		.title{text-align: center;color:#666;font-size: $uni-font-size-base;}
		.wechat_icon{
			text-align: center;
			margin-top: 40rpx;
			&.btn{
				width: 80%;
				margin:0 auto;
			}
		}
	}
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
			.input{font-size: $uni-font-size-base;flex: 1;}
		}
		.title{
			margin-bottom: 80rpx;
			font-size: 42rpx;
			font-weight: bold;
			border-bottom: 6rpx solid $primary;
			width: 140rpx;
			padding-bottom: 20rpx;
		}
		background: #fff;
		position: relative;
		z-index:300;
		width:90%;
		margin:0rpx auto 0 auto;
		min-height: 340rpx;
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
		background-repeat: repeat-x;
		background-size: 100% 100%;
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
	
	/* #ifdef MP-WEIXIN */
	.wechat_login{
		display: flex;
		width:60%;
		justify-content: center;
		font-size: 26rpx;
		align-items: center;
		margin: 0 auto;
		border-top: 1px solid #efefef;
		margin-top: 40rpx;
		padding-top: 30rpx;
		text-align: center;
		.wechat_login_cen{
			display: flex;
		}
		.con{
			margin-left:10rpx;
			color: #999;
			background-color: #fff;
			background: #fff;
			font-size: 26rpx;
			padding: 0;
			&:after{
				border: none;
				color: #999;
			}
		}
	}
	/* #endif */
	
}

</style>
