<template>
	<view class="qwshop">
		<view class="wallet ct30 pd20 br20">
			<view class="title">总余额 ( CN )</view>
			<view class="money_midd">
				<view class="s1">
					<text>￥</text>
					<text>{{data.user.money||'0.00'}}</text>
				</view>
				<view class="s2" @click="R.nav('/pages/users/cashes/form')">
					<text>提现</text>
					<uni-icons type="right" color="#fff" size="12"></uni-icons>
				</view>
			</view>
			<view class="fm">
				<text>冻结资金：{{data.user.frozen_money||'0.00'}}</text>
				<!-- <text class="t2">积分：{{data.user.integral||'0.00'}}</text> -->
			</view>
		</view>
		
		<view class="wallet_list ct30 pd10 br20">
			<uni-list :border="false">
				<uni-list-item showExtraIcon :extraIcon="{type:'wallet-filled',size:22,color:'#e11f27'}" title="余额记录" link to="/pages/users/money/index?is_type=0"  ></uni-list-item>
				<uni-list-item showExtraIcon :extraIcon="{type:'eye-slash-filled',size:22,color:'#009cff'}" title="冻结记录" link to="/pages/users/money/index?is_type=1"  ></uni-list-item>
				<!-- <uni-list-item showExtraIcon :extraIcon="{type:'vip-filled',size:22,color:'#8717f9'}" title="积分记录" link to="/pages/users/money/index?is_type=2"  ></uni-list-item> -->
				<uni-list-item showExtraIcon :extraIcon="{type:'calendar-filled',size:22,color:'#50bc89'}" title="提现记录" link to="/pages/users/cashes/index" ></uni-list-item>
				<uni-list-item showExtraIcon :extraIcon="{type:'refresh-filled',size:22,color:'#ff9000'}" title="TRC20地址" link :to="data.user.check?'/pages/users/check/index':'/pages/users/check/form'"  :rightText="data.user.check?'已设置':'未设置'" ></uni-list-item>
				<uni-list-item showExtraIcon :extraIcon="{type:'locked-filled',size:22,color:'#e13f1f'}" title="修改支付密码" link to="/pages/users/money/edit_pay_password"  ></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup>
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { reactive } from 'vue'
	import {onLoad} from "@dcloudio/uni-app"
	
	const data = reactive({user:{}})
	const loadUser = async ()=>{
		let res = await R.get('/Wap/auth/info',{provider:'users'})
		if(res.code && res.code == 200) data.user = res.data||{}
	}
	
	onLoad(()=>{
		loadUser()
	})
	
	uni.$on('check',()=>{
		loadUser()
	})
	
	uni.$on('users',()=>{
		loadUser()
	})
</script>

<style lang="scss" scoped>
.wallet{
	box-sizing: border-box;
	margin-top: 20rpx;
	color: #fff;
	background: linear-gradient(to left,$primary,$gradient);
	.title{
		font-size: $uni-font-size-base;
		padding-left: 10rpx;
		padding-top: 20rpx;
	}
	.money_midd{
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		.s1{
			font-size: 50rpx;
		}
		.s2{
			font-size: $uni-font-size-base;
			margin-top: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text{
				&:first-child{
					margin-right: 10rpx;
				}
			}
		}
	}
	.fm{
		font-size: $uni-font-size-base;
		margin-left: 10rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		.t2{
			background: rgba(#000, 0.2);
			padding: 6rpx 25rpx;
			border-radius: 10rpx;
			font-size: $uni-font-size-sm;
			margin-left: 30rpx;
		}
	}
}
.wallet_list{
	background: #fff;
	margin-top: 30rpx;
	&.mb30{
		margin-bottom: 30rpx;
	}
}
</style>
