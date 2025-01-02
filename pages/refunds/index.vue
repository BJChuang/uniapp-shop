<template>
	<view class="order_refund_index">
		<view class="checkbox">
			<radio-group @change="radioChange">
				<text class="uni-title">售后类型：</text>
				<label class="rItem">
					<radio color="#ea1f22" style="transform:scale(0.8)" value="0" :checked="data.params.refund_type==0" /><text>退款</text>
				</label>
				<label class="rItem">
					<radio color="#ea1f22" style="transform:scale(0.8)" value="1" :checked="data.params.refund_type==1" /><text>退换货</text>
				</label>
			</radio-group>
		</view>
		<view class="content">
			<text class="uni-title" style="">售后原因：</text>
			<textarea v-model="data.params.refund_remark" placeholder="输入申请售后原因!" placeholder-style="font-size:30rpx" />
			<view class="error_list">
				<text v-for="(v,k) in data.error_list" :key="k" @click="data.params.refund_remark=v">{{v}}</text>
			</view>
		</view>
		<view class="btn" @click="add()">确认提交</view>
	</view>
</template>

<script setup>
	import { reactive } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import {onLoad,onShow} from "@dcloudio/uni-app"
	
	const data = reactive({
		params:{
			order_id:0,
			refund_type:0,
			refund_remark:'',
		},
		error_list:[
		  '物品破损',
		  '尺码错误',
		  '颜色不对',
		  '其他原因',
		],
	})
	
	const radioChange = (e)=>{
		data.params.refund_type = e.detail.value;
		console.log(e)
	}
	
	const add = ()=>{
		R.post('/Wap/refunds',data.params).then(res=>{
			if(!res.code || res.code == 500){
				return R.toast(res.msg)
			}
			if(res.code && res.code == 500){
				return R.toast(res.msg)
			}
			R.toast('申请成功')
			setTimeout(()=>{
				uni.$emit('orders');
				R.nav('',3)
			},1000)
		})
	}
	
	onLoad((opt)=>{
		data.params.order_id = opt.id
	})
	
</script>

<style lang="scss" scoped>
.order_refund_index{
	
	border-top: 1px solid #efefef;
	.error_list{
		font-size: $uni-font-size-base;
		color:$uni-color-error;
		margin-top: 30rpx;
		text{
			border:1px solid $uni-color-error;
			border-radius: 8rpx;
			margin-right: 20rpx;
			padding: 2rpx 10rpx;
		}
	}
	.content{
		padding: 40rpx;
		margin-top: 10rpx;
		background: #fff;
		textarea{
			font-size: $uni-font-size-base;
			margin-top: 20rpx;
			min-height: 300rpx;
			width: 100%;
			border:1px solid #efefef;
			padding: 10rpx;
			color:#666;
			border-radius: 10rpx;
			box-sizing: border-box;
		}
	}
	.uni-title{
		margin-right: 30rpx;
	}
	.rItem{
		margin-right: 40rpx;
		text{
			margin-left: 20rpx;
			color:#666;
			font-size: $uni-font-size-base;
		}
	}
	.checkbox{
		padding: 40rpx;
		background: #fff;
	}
	.btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 80rpx;
		margin: 80rpx auto 30rpx;
		font-size: $uni-font-size-lg;
		color: #fff;
		background-color: $uni-color-error;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(245, 70, 108, 0.4);
	}
}

</style>
