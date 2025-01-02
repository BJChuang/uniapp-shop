<template>
	<view class="qwshop">
		<view class="index_category">
			<view class="category_item">
				<scroll-view scroll-y="true" >
					<view class="category_class">
						<text :class="k==data.index?'category_class_text ck':'category_class_text'" v-for="(v,k) in data.list" :key="k" @click="data.index=k">{{v.name}}</text>
					</view>
				</scroll-view>
			</view>
			<view class="category_item">
				<!-- #ifdef APP -->
				<scroll-view scroll-y="true" :style="{height:data.viewHeight+'px'}">
				<!-- #endif -->
				<!-- #ifdef H5 || MP -->
				<scroll-view scroll-y="true">
				<!-- #endif -->
					<view class="category_class_thr" v-for="(v,k) in (data.list[data.index]?data.list[data.index].children:[])" :key="k">
						<view class="tit" v-if="v.children && v.children.length>0">{{v.name||'-'}}</view>
						<view class="category_block" v-if="v.children && v.children.length>0">
							<view class="category_block_item" v-for="(vo,key) in (v.children||[])" :key="key"  @click="R.nav('/pages/goods/index?class_id='+vo.id)">
								<view class="category_img"><image :src="R.formatUrl(vo.thumb)||''" mode="aspectFill"></image></view>
								<view class="category_t1">{{vo.name||'-'}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from 'vue'
	import {R} from '@/plugins/http.js' // 请求方式中间件
	import { onLoad,onShow } from "@dcloudio/uni-app"
	const data = reactive({
		viewHeight:0,
		listHeight:0,
		index:0,
		list:[],
	})
	
	const getData = ()=>{
		R.get('/Wap/classes').then(res=>{
			data.list = res.data;
		})
	}
	
	const getViewHeight = ()=>{
		uni.getSystemInfo({
			success:(res)=>{
				data.viewHeight = res.windowHeight
			}
		})
	}
	
	onShow(()=>{
		let class_id = uni.getStorageSync('class_id')
		if(class_id && parseInt(class_id)>0){
			data.index = class_id;
			uni.removeStorageSync('class_id')
		}
	})
	onLoad(()=>{
		getViewHeight()
		getData()
	})
	
</script>

<style lang="scss" scoped>
.qwshop{
	height: 100%;
}
.index_category{
	display: flex;
	height: 100%;
	border-top: 1px solid #efefef;
	.category_item{
		display: flex;
		&:first-child{
			height: 100%;
			width: 60rpx;
			flex: 0 1 180rpx;
			background: uni-bg-color-grey;
		}
		&:last-child{
			background: #fff;
			flex: 1;
			height: 100%;
		}
		.category_class{
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			padding-top: 40rpx;
			.category_class_text{
				display: flex;
				font-size: $uni-font-size-base;
				padding: 5rpx 20rpx;
				margin:0rpx auto;
				margin-bottom: 40rpx;
				&.ck{
					border-radius: 20rpx;
					color: #fff;
					background: linear-gradient(to right,$primary,$gradient2);
				}
			}
		}
		.category_class_thr{
			box-sizing: border-box;
			padding: 0 30rpx;
			.tit{
				font-size: $uni-font-size-base;
				font-weight: bold;
				margin-bottom: 20rpx;
				padding-top: 30rpx;
			}
			.category_block{
				display: flex;
				flex-wrap: wrap;
				.category_block_item{
					flex: 0 1 120rpx;
					margin-right: 60rpx;
					margin-bottom: 40rpx;
					// padding-right: 20rpx;
					&:nth-child(3n){
						margin-right: 0;
					}
					.category_img{
						width: 120rpx;
						height: 120rpx;
						margin:0 auto;
						background-color: #efefef;
						border-radius: $block-radius;
						image{
							width: 100%;
							height: 100%;
							border-radius: $block-radius;
						}
					}
					.category_t1{
						text-align: center;
						margin-top: 20rpx;
						font-size: $uni-font-size-sm;
					}
				}
			}
		}
	}
}
</style>
