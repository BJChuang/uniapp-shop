<template>
	<view class="order_pay">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{data.total}}</text>
			<view class="other_price">
				<text v-if="data.order_price>0">订单金额：￥{{data.order_price||0}}</text>
				<text v-if="data.coupon_money>0">优惠：￥{{data.coupon_money||0}}</text>
				<text v-if="data.freight_money>0">运费：￥{{data.freight_money||0}}</text>
			</view>
		</view>
		
		<view class="pay-type-list">
		
			<view class="type-item" @click="changePayType(1)">
				<text class="iconfont qwwechat"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#ea1f22" @click="changePayType(1)" :checked='data.payType == 1' />
				</label>
			</view>
			<!-- 不是小程序都显示支付宝 -->
			<!-- #ifndef MP -->
				<view class="type-item" @click="changePayType(2)">
					<text class="iconfont qwalipay"></text>
					<view class="con">
						<text class="tit">支付宝支付</text>
						<text>推荐使用支付宝支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#ea1f22" @click="changePayType(2)" :checked='data.payType == 2' />
					</label>
				</view>
			<!-- #endif -->
			<view class="type-item" @click="changePayType(3)" v-if="data.order_price>0">
				<text class="iconfont qwmoney"></text>
				<view class="con">
					<text class="tit">余额支付</text>
					<text>可用余额 ¥{{data.userInfo.money}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#ea1f22"  @click="changePayType(3)" :checked='data.payType == 3' />
				</label>
			</view>
		</view>
		
		<view class="list_b_btn ct30 pd10" @click="confirm">确认支付</view>
		
		<put-password :text="data.text" ref="put_password_ref" @password="check" ></put-password>
	</view>
</template>

<script setup>
	// #ifdef H5
	import wx from 'weixin-js-sdk'
	// #endif
	import Base64 from 'base-64';
	import { reactive,ref } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	
	import putPassword from '@/components/put_password';
	const put_password_ref = ref(null)
	const data = reactive({
		payType: 1,
		userInfo:{
			money:0.00,
		},
		params:'',
		order_price:0.00,
		total:0.00,
		freight_money:0.00,
		coupon_money:0.00,
		text:'支付密码，默认1-6',
		pay_password:'',
	})
	
	const put_password = ()=>{
		put_password_ref.value.masks();
	}
	const loadUser = async ()=>{
		let res = await R.get('auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.userInfo = res.data
	}
	// 订单建立前预览商品信息
	const createOrderBefore = ()=>{
		uni.showLoading({
			title:"加载中..."
		})
		R.get('orders/create_order_after',{params:data.params}).then(res=> {
			if(res.code && res.code == 200){
				res.data.map(item=>{
					data.order_price += parseFloat(item.order_price);
					data.total += parseFloat(item.total_price);
					data.freight_money += parseFloat(item.freight_money);
					data.coupon_money += parseFloat(item.coupon_money);
				})
				data.order_price = R.formatFloat(data.order_price)
				data.total = R.formatFloat(data.total)
				data.freight_money = R.formatFloat(data.freight_money)
			}else{
				R.toast(res.msg)
				// return R.nav('',3)
			}
		}).finally(()=>{
			uni.hideLoading()
		})
	}
	const check = (e)=> data.pay_password = e
	const pay = (payment_name)=>{
		let device = 'wap'
		// 判断是否在app
		// #ifdef APP-PLUS
		device = 'app'
		// #endif
		
		// 是否是微信小程序
		// #ifdef MP-WEIXIN
		device = 'mini'
		// #endif
		
		// 是否是H5
		// #ifdef H5
		// 判断是否是微信游览器
		let ua = window.navigator.userAgent.toLowerCase()
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			device = 'mp'
		}else{
			device = 'wap'
		}
		// #endif
		let rawStr = Base64.decode(data.params)
		let params = JSON.parse(rawStr);
		let order_id = params.order_id.join(',');
		let sendData = {order_id:order_id,payment_name:payment_name,device:device};
		if(payment_name == 'balance') sendData.pay_password = data.pay_password
		if(device == 'mp' || device == 'mini') sendData.openid = uni.getStorageSync('openid')
		if(device == 'mp' && R.isEmpty(sendData.openid)) return R.toast('请先前往首页授权体验完整功能');
		
		uni.showLoading({
			title:'支付中...'
		})
		R.post('orders/pay',sendData).then(res=>{
			if(res.code == 200){
				if(payment_name != 'balance'){
					// #ifdef APP-PLUS
					uni.requestPayment({
						provider: payment_name,
						orderInfo: res.data, //微信、支付宝订单数据
						success: ()=> {
							return R.nav('/pages/orders/success');
						},
						fail: (err)=> {
							R.toast('fail:' + JSON.stringify(err));
						}
					});
					return;
					// #endif
					// #ifdef MP
					uni.requestPayment({
						provider: payment_name,
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success: ()=> {
							return R.nav('/pages/orders/success');
						},
						fail: (err)=> {
							R.toast('fail:' + JSON.stringify(err));
						}
					});
					return;
					// #endif
					// #ifdef H5
					// 支付宝外部游览器支付
					if(device == 'wap' && payment_name=="alipay"){
						const div = document.createElement('div') // 创建div
						div.innerHTML = res.data // 将返回的form 放入div
						document.body.appendChild(div)
						document.forms[0].submit()
						return
					}
					// 微信外部游览器支付
					if(device == 'wap' && payment_name=="wechat"){
						window.open(res.data,"_blank")
						return
					}
					
					wx.config({
					  debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
					  appId: res.data.appId, // 必填，公众号的唯一标识
					  timestamp: res.data.timeStamp, // 必填，生成签名的时间戳
					  nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
					  signature: res.data.signature,// 必填，签名
					  jsApiList: ['chooseWXPay'] // 必填，需要使用的 JS 接口列表
					});
					wx.ready(function(){  
						wx.chooseWXPay({
						  timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信 jssdk 中的所有使用 timestamp 字段均为小写。但最新版的支付后台生成签名使用的 timeStamp 字段名需大写其中的 S 字符
						  nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
						  package: res.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						  signType: res.data.signType, // 微信支付V3的传入 RSA ,微信支付V2的传入格式与V2统一下单的签名格式保持一致
						  paySign: res.data.paySign, // 支付签名
						  success: function (res) {
							// 支付成功后的回调函数
							R.nav('/pages/orders/success');
						  },
						
						});
					});
					
					return;
					// #endif
				}
				return R.nav('/pages/orders/success');
			}else{
				R.toast(res.msg);
			}
		}).finally(()=>{
			uni.$emit('orders')
			uni.hideLoading()
		})
		
	}
	
	const confirm = ()=>{
		let payType = 'wechat';
		if(data.payType==1){
			payType = 'wechat';
		}
		if(data.payType == 2){
			payType = 'alipay'
		}
		if(data.payType==3){
			payType = 'balance'
		}
		pay(payType);
	}
	
	//选择支付方式
	const changePayType = (type)=> {
		console.log(type)
		data.payType = type;
		if(type==3) return put_password()
	}
	
	onLoad((opt)=>{
		data.params = opt.params
		createOrderBefore()
		loadUser();
	})
</script>

<style lang="scss" scoped>
.order_pay{
	border-top: 1px solid #efefef;
	background-color: #fff;
	height: 100%;
	padding-top: 40rpx;
	.price-box {
		background-color: #fff;
		height: 385rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #909399;
		.other_price{
			margin-top: 30rpx;
			display: flex;
			width: 100%;
			font-size: 24rpx;
			border-top:1px solid #f1f1f1;
			border-bottom:1px solid #f1f1f1;
			line-height: 80rpx;
			flex-direction: row;
			text-align: center;
			text{
				flex: 1;
				border-right: 1px solid #f1f1f1;
				&:last-child{
					border-right: none;
				}
			}
		}
		.price{
			font-size: 60rpx;
			color: #303133;
			margin-top: 32rpx;
			&:before{
				content: '￥';
				font-size: 40rpx;
			}
		}
	}
	
	.pay-type-list {
		margin-top: 20rpx;
		padding-bottom: 40rpx;
		background-color: #fff;
		border-top: 1px solid #efefef;
		
		.type-item{
			height: 120rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60rpx;
			padding-left: 60rpx;
			font-size: 30rpx;
			position:relative;
			border-bottom: 1px solid #efefef;
		}
		
		.iconfont{
			width: 100rpx;
			font-size: 52rpx;
		}
		.qwmoney {
			color: #fe8e2e;
		}
		.qwwechat {
			color: #36cb59;
		}
		.qwalipay {
			color: #01aaef;
		}
		.tit{
			font-size: $uni-font-size-lg;
			color: #333;
			margin-bottom: 4rpx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-sm;
			color: #999;
		}
	}

}
</style>
