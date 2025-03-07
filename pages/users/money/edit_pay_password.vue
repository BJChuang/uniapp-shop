<template>
	<view class="check_content ">
		<view class="pdbg">
			<view class="identityTwo ct30 br20">
				<view class="list hi-rows">
					<text>新支付密码</text>
					<input type="password" v-model="data.info.pay_password" placeholder="新支付密码" placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list  hi-rows">
					<text>重复支付密码</text>
					<input type="password" v-model="data.info.re_pay_password" placeholder="重复支付密码"
						placeholder-style="color:#D7D7D7" />
				</view>
				
			</view>
		</view>

		<view class="viewBtn" @tap="edit">确定修改</view>

	</view>
</template>

<script setup>
	import { reactive } from 'vue'
	import { R } from '@/plugins/http.js' // 请求方式中间件

	const data = reactive({
		info:{
			pay_password:'',
			re_pay_password:'',
			code:'',
		},
	})
	
	const edit = ()=>{
		if(data.info.pay_password != data.info.re_pay_password){
			return R.toast('两次输入不一致')
		}
		
		R.post('/Wap/auth/edit',{provider:'users',pay_password:data.info.pay_password}).then(res=>{
			if(res.code == 200 && res.data != null){
				R.toast('修改成功')
				setTimeout(()=>{
					R.nav('',3)
				},500)
			}else{
				R.toast(res.msg)
			}
		})
	}

</script>

<style lang="scss" scoped>
	.identityTwo {
		background-color: #fff;
		padding-left: 52rpx;
	}
	.identityTwo .list text {
		color: #222222;
		font-size: 30rpx;
		width: 180rpx;
		
	}
	.identityTwo .list input {
		flex: 1;
		
		// margin-top: 24rpx;
	}
	.identityTwo {
		margin-top: 26rpx;
	}
	.list {
		height: 100rpx;
		line-height: 100rpx;
		align-items: center;
		justify-content: flex-start;
		display: flex;
	}
	.list input {
		font-size: 30rpx;
		padding-left: 70rpx;
	}
	.viewBtn {
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		background: linear-gradient(to left,$primary,$gradient);
		border-radius: 10rpx;
		font-size: 30rpx;
		text-align: center;
		margin: 0 auto;
		margin-top: 60rpx;
	}
</style>
