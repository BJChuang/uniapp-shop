<template>
	<view class="qwshop">
		<view class="address_list ct30 pd10 br20" v-if="data.list.length>0">
			<uni-swipe-action>
				<uni-swipe-action-item :border="false" :right-options="options"  @click="onClick(v.id)" v-for="(v,k) in data.list||[]" :key="k">
					<view class="list_item">
						<view class="wrapper">
							<view class="address-box">
								<text class="tag" v-if="v.is_default==1">默认</text>
								<text class="address">{{(v.area_info||'-')+' '+(v.address||'-')}}</text>
							</view>
							<view class="u-box">
								<text class="name">{{v.receive_name||'-'}}</text>
								<text class="mobile">{{v.receive_tel||'-'}}</text>
							</view>
						</view>
						<uni-icons class="edit" type="compose" size="22" @click="addAddress('edit', v.id)"></uni-icons>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<z-paging-empty-view v-else></z-paging-empty-view>
		<view class="list_b_btn fixed ct30 pd10"  @click="addAddress('add', 0)">新增地址</view>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const options = reactive([
		{
			text: '删除',
			style: {
				backgroundColor: '#dd524d'
			}
		}
	])

	const data = reactive({
		list:[]
	})
	const onClick = async (id)=>{
		await R.del('/Wap/addresses/'+id)
		uni.$emit('addresses')
		
	}
	const addAddress = (e,id)=>{
		console.log(123)
		R.nav('/pages/users/addresses/edit?id='+id)
	}
	const loadData = async ()=>{
		let res = await R.get('/Wap/addresses?isAll=true')
		if(res.code && res.code == 200) data.list = res.data
	}
	
	onLoad(()=>{
		loadData()
	})
	
	uni.$on('addresses',()=>{
		loadData()
	})
</script>

<style lang="scss" scoped>
.address_list{
	background: #fff;
	margin-top: 30rpx;
	margin-bottom: 80rpx;
	.list_item{
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;;
		background: #fff;
		position: relative;
		width: 100%;
		border-bottom: 1px solid #efefef;
		&:last-child{
			border:none;
		}
		.wrapper{
			display: flex;
			flex-direction: column;
			flex: 1;
			.u-box{
				color:#999;
				font-size: $uni-font-size-base;
				margin-top: 20rpx;
				.name{margin-right: 20rpx;}
			}
		}
		.edit{
			display: flex;
			align-items: center;
			height: 80rpx;
			font-size: 40rpx;
			padding-left: 30rpx;
			margin-right: 60rpx;
		}
		.address-box{
			display: flex;
			align-items: center;
			.tag{
				font-size: 24rpx;
				color: $primary;
				margin-right: 20rpx;
				background: #fffafb;
				border: 1px solid $primary;
				border-radius: 5rpx;
				padding: 4rpx 10rpx;
				min-width: 48rpx;
				line-height: 1;
			}
			.address{
				font-size: 30rpx;
			}
	
		}
	}
}
</style>
