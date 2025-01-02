<template>
	<view class="order_comment">
		<view class="order_goods_info">
			<view class="order_img">
				<image :src="R.formatUrl(data.goodsInfo.goods_image)" mode="aspectFit"></image>
			</view>
			
			<view class="order_goods_info2">
				<view class="title">{{data.goodsInfo.goods_name||''}}</view>
				<view class="price">￥{{data.orderInfo.total_price||'0.00'}}</view>
			</view>
		</view>
		
		<view class="order_comment_star">
			<view class="goods">
				<text>综合评分</text>
				<uni-rate :value="data.comment.score" @change="(e)=>star_change(e,'score')" :size="18"  />
			</view>
			<view class="goods">
				<text>产品相符</text>
				<uni-rate :value="data.comment.agree" @change="(e)=>star_change(e,'agree')" :size="18"  />
			</view>
			<view class="goods">
				<text>服务态度</text>
				<uni-rate :value="data.comment.service" @change="(e)=>star_change(e,'service')" :size="18"  />
			</view>
			<view class="goods">
				<text>发货速度</text>
				<uni-rate :value="data.comment.speed" @change="(e)=>star_change(e,'speed')" :size="18"  />
			</view>
		</view>
		
		<view class="order_comment_content">
			<view class="content">
				<textarea style="min-height: 120rpx;" v-model="data.comment.content" auto-height placeholder="请输入您对该产品的评价!" />
			</view>
			
			<view class="order_comment_img">
				<upload-img :url="data.uploadUrl" :length="4" :count="4" @uploadSuccess="upload_success"></upload-img>
			</view>
		</view>
		
		<view class="btn" @click="add_comment">提交评论</view>
	</view>
</template>

<script setup>
	import { reactive,ref } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import {onLoad,onShow} from "@dcloudio/uni-app"
	
	import config from "@/plugins/config.js";
	import uploadImg from '@/components/upload-images.vue'
	
	const data = reactive({
		id:0,
		uploadUrl:'',
		info:{},
		comment:{
			order_id:0,
			score:5,
			agree:5,
			service:5,
			speed:5,
			content:'',
			image:[],
		},
		orderInfo:{},
		goodsInfo:{},
	})
	

	const loadData = ()=>{
		R.get('orders/get_order_info/'+data.id).then(res=>{
			data.orderInfo = res.data
			data.goodsInfo = res.data.order_goods[0]
		})
	}
	const add_comment = ()=>{
		R.post('orders/comment',data.comment).then(res=>{
			if(res.code && res.code == 200){
				uni.$emit('orders');
				R.nav("/pages/orders/index")
			}else{
				R.toast(res.msg)
			}
			
		})
	}
	const upload_success = (e)=>{
		data.comment.image = [];
		e.map(item=>{
			data.comment.image.push(item.src)
		})
	}
	const star_change = (e,name)=>{
		data.comment[name] = e.value
		console.log(data.comment)
	}
	
	onLoad((opt)=>{
		data.uploadUrl = config.requestUrl+'uploads';
		data.id = opt.id;
		data.comment.order_id = opt.id;
		loadData();
	})
	
</script>

<style lang="scss" scoped>

.order_comment{
	font-size: 28rpx;
	.btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 80rpx;
		margin: 80rpx auto 30rpx;
		font-size: $uni-font-size-lg;
		color: #fff;
		background-color: $primary;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(245, 70, 108, 0.4);
	}
	.order_comment_content{
		padding:30rpx;
		background-color: #fff;
		border-top: 1px solid #f1f1f1;
		textarea{
			font-size: $uni-font-size-base;
		}
		.order_comment_img{
			margin-top: 30rpx;
		}
	}
	.order_comment_star{
		padding:30rpx;
		background-color: #fff;
		margin-top: 20rpx;
		.goods{
			font-size: $uni-font-size-lg;
			color:#666;
			margin-bottom: 20rpx;
			text{
				float: left;
				margin-right: 40rpx;
			}
			
			&:after{
				content:'';
				display: block;
				clear: both;
			}
			&:last-child{
				margin-bottom: 0;
			}
		}
	}
	.order_goods_info{
		padding:30rpx;
		background-color: #fff;
		display: flex;
		width: 100%;
		.order_img{
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			background-color: #f5f5f5;
			margin-right: 20rpx;
			image{
				display: block;
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
			}
		}
		.order_goods_info2{
			flex-direction: column;
			overflow: hidden;
			flex:1 ;
			.title{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.price{
				margin-top: 20rpx;
				color:$uni-color-error;
			}
		}
	}
}
</style>
