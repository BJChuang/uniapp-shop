<template>
	<view class="goods_comment">
		<z-paging ref="paging" use-page-scroll v-model="data.comments" @query="upCallback">
			<!-- 评价 -->
			<view class="comment ct30">
				<view class="comment_content br20" v-if="data.comments.length>0" v-for="(v,k) in data.comments" :key="k">
					<view class="avatar"><image :src="R.formatUrl(v.avatar)||'../../static/auth/default_avatars.png'" mode="aspectFit" /></view>
					<view class="comment_info">
						<view class="nickname">{{v.nickname}}</view>
						<view class="desc">{{v.content}}</view>
						<view class="img" v-if="v.image.length>0">
							<image v-for="(val,index) in v.image" :key="index" :src="R.formatUrl(val)" mode="aspectFit" />
						</view>
						<view class="other">{{v.created_at||'0000-00-00 00:00'}}</view>
						<view v-if="v.reply!=''" class="kfrp">商家: {{v.reply}}</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
	import { reactive,ref } from 'vue'
	import {onLoad,onShow} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const paging = ref(null)
	
	const data = reactive({
		params:{
			page:1,
			per_page:10,
		},
		comments:[],
		goodsId:0,
	})
	
	const loadData = (pageNo, pageSize)=>{
		R.get('/Wap/goods_comments/'+data.goodsId,data.params).then(res=>{
			if(res.code != 200) return paging.value.complete(false)
			paging.value.complete(res.data.data)
		})
	}
	
	const upCallback = (pageNo, pageSize)=>{
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		if(data.goodsId == '' || data.goodsId == 0){
			let timer = setInterval(()=>{
				if(data.goodsId == '' || data.goodsId == 0){
					clearInterval(timer)
					loadData(pageNo, pageSize)
				}
			},500)
			return
		}
		loadData(pageNo, pageSize)
	}
	
	onLoad((opt)=>{
		if(R.isEmpty(opt.id)){
			return R.toast('商品不存在')
		}
		data.goodsId = opt.id
	})
	
</script>

<style lang="scss" scoped>
.goods_comment{
	.comment_content{
		display: flex;
		padding: 20rpx 30rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		.comment_info{
			flex: 1;
			font-size: $uni-font-size-base;
			.nickname{
				margin-bottom: 10rpx;
				background: #eee;
				display: inline-block;
				padding: 6rpx 20rpx;
				color: #333;
				font-size: $uni-font-size-sm;
				border-radius: 10rpx;
			}
			.desc{margin-bottom: 20rpx;color:#666}
			.img{margin-bottom: 20rpx;image{margin-right: 10rpx;background: #eee;width: 130rpx;height: 130rpx;border-radius: 10rpx;}}
			.other{color:#999;font-size: $uni-font-size-sm;}
		}
		.avatar{
			width: 90rpx;
			height:90rpx;
			background: #eee;
			border-radius: 50%;
			flex:0 0 90rpx;
			margin-right: 20rpx;
			image{width: 90rpx;height: 90rpx;border-radius: 50%;}}
		&:after{
			content:'';clear: both;display: block;
		}
	}
}
.kfrp{
	font-size: 24rpx;
	margin-top: 15rpx;
	padding-top: 15rpx;
	color:rgb(127, 96, 68);
	border-top: 1px solid #efefef;
}
</style>
