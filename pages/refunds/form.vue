<template>
	<view class="order_refund_form">
		<view class="block">
			<view class="item">
				<text class="tit" style="float: left;">售后类型</text>
				<text class="con">
					{{data.info.refund_type==0?'退款':(data.info.refund_type==1?'退换货':'售后结束')}}
				</text>
			</view>
			<view class="item">
				<text class="tit">售后原因</text>
				<text class="con">{{data.info.refund_remark}}</text>
			</view>
			<view class="item">
				<text class="tit" style="float: left;">申请状态</text>
				<view class="con" style="float: left;margin-top: 16rpx;">
					<uni-tag  v-if="data.info.refund_verify==0" style="width: 120rpx;" text="等待审核" inverted type="default"></uni-tag>
					<uni-tag  v-if="data.info.refund_verify==1" style="width: 120rpx;" text="审核成功" inverted type="success"></uni-tag>
					<uni-tag  v-if="data.info.refund_verify==2" style="width: 120rpx;" text="申请拒绝" inverted type="error"></uni-tag>
				</view>
				<view style="clear: both;"></view>
			</view>
			<view class="item" v-if="data.info.refund_type==1">
				<text class="tit" style="float: left;">换货进度</text>
				<view class="con" style="float: left;margin-top: 16rpx;">
<!-- 					<uni-tag  v-if="data.info.refund_verify==0" style="width: 120rpx;" text="等待审核" inverted type="error"></uni-tag>
					<uni-tag  v-if="data.info.refund_verify==1" style="width: 120rpx;" text="审核成功" inverted type="success"></uni-tag>
					<uni-tag  v-if="data.info.refund_verify==2" style="width: 120rpx;" text="申请拒绝" inverted type="error"></uni-tag> -->
					<uni-tag  v-if="data.info.refund_step==0 && data.info.refund_verify==1" style="width: 120rpx;" text="用户发货" inverted type="warning"></uni-tag>
					<uni-tag  v-if="data.info.refund_step==1" style="width: 120rpx;" text="等待发货" inverted type="warning"></uni-tag>
					<uni-tag  v-if="data.info.refund_step==2" style="width: 120rpx;" text="等待确认" inverted type="primary"></uni-tag>
					<uni-tag  v-if="data.info.refund_step==3" style="width: 120rpx;" text="售后完成" inverted type="success"></uni-tag>
				</view>
				<view style="clear: both;"></view>
			</view>
		</view>
		<view class="block" style="margin-top: 5rpx;border-top: none;" v-if="data.info.refund_type==1 && data.info.refund_verify==1 ">
			<view class="item">
				<text class="tit">填写物流</text>
				<view class="con">
					<input style="margin:20rpx 0;border:1px solid #efefef;padding: 10rpx;" type="text" v-model="data.info.delivery_no" placeholder="输入快递单号发货" placeholder-style="font-size:28rpx" />
				</view>
			</view>

		</view>
		<view class="block" style="margin-top: 5rpx;border-top: none;">
			<view class="item" v-if="data.info.refund_verify==2">
				<text class="tit">拒绝原因</text>
				<text class="con">{{data.info.refuse_remark}}</text>
			</view>
			<view class="item" v-if="data.info.re_delivery_no !=''">
				<text class="tit">发货单号</text>
				<text class="con">{{data.info.re_delivery_no}}</text>
			</view>
		</view>
		<view class="btn" v-if="data.info.refund_step==0 && data.info.refund_type==1 && data.info.refund_verify==1" @click="handleSubmit">确定提交</view>
		<view class="btn" v-if="data.info.refund_step==2" @click="handleSubmit2">完成售后</view>
	</view>
</template>

<script setup>
	import { reactive } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import {onLoad,onShow} from "@dcloudio/uni-app"
	
	const data = reactive({
		info:{
		  refund_type:0,
		  order_id:0,
		  delivery_no:'',
		  delivery_code:'yd',
		},
		refund_info:{}
	})
	
	const get_info = ()=>{
		R.get('/Wap/refunds/'+data.info.order_id,{}).then(res=>{
			if(res.code == 200){
				console.log(res.data)
				data.info = res.data;
			}
		})
	}
	
	const handleSubmit = ()=>{
		R.put('/Wap/refunds/' + data.info.order_id,{delivery_no:data.info.delivery_no}).then(res=>{
			if(res.code == 200){
				get_info()
			}
		})
	}
	
	const handleSubmit2 = ()=>{
		R.put('/Wap/refunds/' + data.info.order_id,{refund_step:3}).then(res=>{
			if(res.code == 200){
				get_info()
			}
		})
	}
	
	onLoad((opt)=>{
		data.info.order_id = opt.id
		get_info()
	})
	
</script>

<style lang="scss" scoped>
.order_refund_form{
	.block{
		color:#666;
		background: #fff;
		border-top: 1px solid #efefef;
		padding: 30rpx 40rpx;
		.item{
			line-height: 90rpx;
			.tit{
				margin-right: 30rpx;
				&:after{
					content:'：';
				}
			}
			.con{
				color:#999;
				font-size: $uni-font-size-base;
			}
		}
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
