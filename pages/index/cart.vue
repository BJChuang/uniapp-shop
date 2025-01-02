<template>
	<view class="qwshop">
		<view class="index_cart" v-if="data.list.length>0">
			<view class="cart_div">
				<view class="cart_list" v-for="(v,k) in data.list" :key="k">
					<view class="store_block">
						<uni-icons class="checkbox" @click="onCheckAllStoreChange(k)" :color="v.checked?'#e11f27':'#ccc'" type="checkbox-filled" size="22"></uni-icons>
						<text class="store_name">{{v.store_name}}</text>
						<text class="store_type">店铺</text>
					</view>
					<view class="order_goods">
						<view class="goods_item" v-for="(vo,index) in v.cart_list" :key="index">
							<view class="goods_check"><uni-icons @click="onCheckChange(k,index)" class="checkbox" :color="vo.checked?'#e11f27':'#ccc'" type="checkbox-filled" size="22"></uni-icons></view>
							<view class="goods_del"><uni-icons @click="cartDel(vo.cart_id)" class="closeempty" color="#666"  type="closeempty" size="20"></uni-icons></view>
							<view class="goods_item_pic"><image :src="R.formatUrl(vo.goods_image)||''" mode="aspectFit" /></view>
							<view class="goods_info">
								<view class="goods_name">{{vo.goods_name}}</view>
								<view class="attr">规格属性: {{vo.sku_name}} </view>
								<view class="goods_price">
									<text class="price">￥{{vo.goods_price}}</text>
									<!-- <text class="num">库存: 20</text> -->
								</view>
								<view class="math_num">
									<uni-number-box :value="vo.buy_num" :min="1" @change="bindChange($event,index,k)"></uni-number-box>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="index_cart_empty">
			<image src="../../static/cart/img_feedback@2x.png" mode="aspectFit"></image>
			<view class="t1">购物车还是空的</view>
			<view class="t2">赶紧买点宝贝慰劳下自己吧</view>
		</view>
		
		<!-- 漂浮 -->
		<view class="pfk" v-if="data.list.length>0">
			<view :class="data.checkAll?'clearall ck':'clearall'" @click="onCheckAllChange">
				<uni-icons class="checkbox" :color="'#fff'" type="checkbox-filled" size="22"></uni-icons>
				<text>全选</text>
			</view>
			
			<text class="btn" @click="buy">去结算</text>
			<view class="price">总额：<text>￥{{data.allPrice}}</text></view>
		</view>
	</view>
</template>

<script setup>
	import Base64 from 'base-64'
	import { reactive } from 'vue'
	import {onLoad,onShow} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	
	const data = reactive({
		list:[],
		checkAll:false,
		allPrice:0.00,
	})
	
	const loadData = ()=>{
		R.get('/Wap/carts').then(res=>{
			data.list = (res.data && res.data.data)?res.data.data:[]
		})
	}
	
	const onCheckChange = (k,index) =>{
		data.list[k]['cart_list'][index].checked = !data.list[k]['cart_list'][index]['checked']
		onCheckConst()
	}
	const onCheckAllStoreChange = (k)=>{
		data.list[k].checked = !data.list[k].checked
		data.list[k].cart_list.forEach(item=>{
			item.checked = data.list[k].checked
		})
		onCheckConst();
	}
	const onCheckAllChange = ()=>{
		let checkAll = !data.checkAll
		data.checkAll = checkAll
		data.list.forEach(item=>{
			item.checked = checkAll
			item.cart_list.forEach(item2=>{
				item2.checked = checkAll
			})
		})
		onCheckConst();
	}
	// 最外层checkbox状态修改 加上统计数据价格商品数量
	const onCheckConst = ()=>{
		data.allPrice = 0
		let all = 0
		data.list.forEach(item=>{
			item.cart_list.forEach(item2=>{
				all++
				if(item2.checked) data.allPrice += item2.buy_num*item2.goods_price
			})
		})
		data.allPrice = R.formatFloat(data.allPrice)
	}
	
	const bindChange = (e,index=-1,k=-1)=>{
		if(index<0) return
		if(data.list[k]['cart_list'][index]['buy_num']!=e){
			let is_type = 1
			if(data.list[k]['cart_list'][index]['buy_num']>e) is_type = 0
			cartEdit(data.list[k]['cart_list'][index]['cart_id'],1,is_type)
		}
		data.list[k]['cart_list'][index]['buy_num'] = e
		onCheckConst();
	}
	
	// 编辑
	const cartEdit = async (id,num,is_type)=>{
		await R.put('/Wap/carts/'+id,{buy_num:num,is_type:is_type})
		loadData()
	}
	// 删除
	const cartDel = (id)=>{
		R.del('/Wap/carts/'+id).then(res=>{
			loadData()
		})
	}
	
	// 立即购买
	const buy = ()=>{
		let params = {
			order:[],
			ifcart:1, // 是否购物车
		};
		if(data.allPrice <= 0){
			return R.toast('请选择商品')
		}
		data.list.forEach(item=>{
			item.cart_list.forEach(item2=>{
				if(item2.checked){
					params.order.push(
						{
							goods_id:item2.goods_id, // 商品ID
							sku_id:item2.sku_id, // SKUid 没有则为0
							buy_num:item2.buy_num, // 购买数量
							cart_id:item2.cart_id, // 购物车ID
						},
					);
				}
			})
		})
		
		let baseObj = JSON.stringify(params);
		var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
		R.nav('/pages/orders/create?params='+basecode)
	}
	
	onShow(()=>{
		loadData()
		uni.$on('carts',()=>{
			loadData()
		})
	})

</script>

<style lang="scss" scoped>
.index_cart{
	position: relative;
}
.index_cart_empty{
	padding-top: 120rpx;
	width: 50%;
	margin:0 auto;
	image{
		width: 100%;
	}
	.t1{
		font-weight: bold;
		text-align: center;
		font-size: $uni-font-size-lg;
	}
	.t2{
		font-size: $uni-font-size-base;
		color: #888;
		text-align: center;
		margin-top: 20rpx;
	}
}
.cart_div{
	padding: 30rpx;
	.order_goods{
		.math_num{margin-top: 20rpx;}
		.checkbox{border:1px solid #fff;border-radius: 50%;box-sizing: border-box;padding: 0;}
		margin-top: 20rpx;
		padding-top: 20rpx;
		.goods_del{position: absolute;right: 0rpx;top:-25rpx}
		.goods_item{margin-bottom: 40rpx;display: flex;position: relative;.goods_check{position: absolute;top:-15rpx;z-index: 9;}}
		.goods_info{
			.goods_price{
				.price{color:$uni-color-error;font-size: $uni-font-size-lg;font-weight: bold;}
				.num{color:#ccc;margin-left: 40rpx;font-size: $uni-font-size-sm;}
			}
			.attr{font-size: $uni-font-size-sm;color:#999;line-height: 60rpx;}
			.goods_name{
				color:#666;
				white-space: nowrap;
				text-overflow:ellipsis;
				overflow: hidden;
				width: 350rpx;
			}
			font-size: $uni-font-size-base;
		}
		.goods_item_pic{margin-right:20rpx;margin-left: 20rpx;flex: 0 0 225rpx;width: 225rpx;height: 225rpx;background-color: #eee;border-radius: 10rpx;image{width: 225rpx;height: 225rpx;border-radius: 10rpx;}}
	}
	.store_block{
		border-bottom: 1px solid #f5f5f5;
		padding-bottom:20rpx ;
		margin-bottom: 20rpx;
		&:after{
			content:'';
			display: block;
			clear: both;
		}
		.checkbox{float: left;}
		.store_name{margin-left: 20rpx;float: left;}
		.store_type{margin-top: 6rpx;float: left;font-size: $uni-font-size-sm;background: $primary;color:#fff;padding: 0 15rpx;border-radius: 8rpx;margin-left: 20rpx;}
	}
	.cart_list{
		background: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	
}
.pfk{
	background: rgba(255, 255, 255, 0.9);
	position: fixed;
	margin:0 10%;
	padding: 0 20rpx;
	width: 80%;
	line-height: 90rpx;
	border-radius: 10rpx;
	bottom: calc(var(--window-bottom) + 30rpx);
	box-shadow: 0 4px 28px 0 rgba(0, 0, 0, 0.3);
	.clearall{.checkbox{float: left;margin-right: 10rpx;}font-size: $uni-font-size-sm;background: #999;color:#fff;border-radius: 40rpx;padding: 0rpx 20rpx;float: left;line-height: 55rpx;margin-top: 20rpx;&.ck{background: $primary;}}
	.price{float: right;margin-right: 20rpx;text{font-weight: bold;color:$uni-color-error;}}
	.btn{float: right;line-height: 60rpx;background: $primary;color:#fff;padding: 0 20rpx;border-radius: 10rpx;font-size: $uni-font-size-base;margin-top: 15rpx;}
	.selectall{
		flex: 1;
	}
}
</style>
