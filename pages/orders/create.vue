<template>
	<view class="qwshop">
		<view class="order_create ct30 pd30 br20">
			<view class="map">
				<uni-list :border="false">
				    <uni-list-item @click="choseAddress" clickable showArrow showExtraIcon :extra-icon="{type:'location-filled',size:'24',color:'#ea1f22'}" :title="data.address_id>0?data.address.receive_name+' '+data.address.receive_tel:'立即前往，添加收货地址'" :note="data.address_id>0?data.address.area_info+' '+data.address.address:''" ></uni-list-item>
				</uni-list>
			</view>
			<image class="mapbg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvVHce/1/deXzuJHSdOM+fhpKMllI2SkTZpV6ULYrCHQGwrf41p/LENVk3QTipSWujKoyot1aQN0FYQQxtsMCS2SVuqsfFYHxBKYQNGV9ouZdA8nDipH4mT+HFf+51rO0pN0japrw9HreLe3Pqc3/me3+f3uFdIvfVuDIAPix1C9oceicFRVQWlvRWCkL1omqb1Of9z9rXZY65rhcO6x5ove19oWkX/RAaSMLOEkg+2Zt0wEcvoWOZzYZnXeWEbzmP7XPs11//LnOiDEY9DkGRwGw5a59QUTM2As+1qiD5v0TUvvC9Bc52KpmDSnju4ic7+CIinNVQoElYtcUM8jx2L1bzwPn14DOrHZ0hzEdxOPJtW16FH45CvuBzyZU22aH7Od9LnU/E0xpMqJG6iZ309qeqYNoA1gTJ4ZdF2zY2pJNSTfYCmkb85+GnO1hIbh+DzQVndaiHYTs3ZGJpifE/DyVnzi+X7pWqen8/i+8kPYUSjEORPCd9XtUKs9Fi+KMxjVzE0n9ZNnIgkYXwK+B5LafC4JKyudcMxD2+LqblGfNcY30VxJsfhcOCJ7xr02ATkluXE96DtmrPvPxFLIUH7zY3vOc0Z39O0oGtqy1DlFIuu+Zx8P/Ffa8/hEBey4rh0uuPWS6S6CRUhyGjG0hcfOWex+c9zXSsE5HmFzseP3H294Sl847VBRGJJQHTwy9wJNKAE7otLfXi2K3hRgeB81+bar8IDEPvFMxi6cxebnMx2cjrnDmiIwUAGDTvugX9de9E1L7R9NK1jc+8gnj8dy2rOKY/JRhgV8Cr405ea0HEBOxajeaHtySPvYvD2bUgdP0lmuzkl7oLl6Wn0wX/Dd1D/xG5bNc/f+7NjY9jyzghlM5QxS/ySOGt+Wlt3WwDXBz22a86gHrqjG7Hnekhz5uciN9NVDEBxXYng87vgEoqveZ7y+XsPE99vOTyAs1SkU+bOT3NKIJHUsIb4/rsL8L0YmrMRffQ3GNn8c6L7BOnu4pW10/xR4nsK9T+5FzWda2fXcEXTfLbtYUrc7joSwguno9kilZfsLNmgtaBcxv7rmudN2i9Fc8YRlsvkr6aOvoeBHxDf//MBzVfGke9p8vVhVN2wAQ1P7rFdczYeO34Wm4+Gsr4mcqzWMqQ5IX5rex3W1pUXX/PCRlwkjpEtDyLy9B8sPxcgLWzFpy7rWlTH3eq66AbUj0fh7lyJhn27oFzVck41mTdgdnU5+3fzbczsqqVwQ14aSuCrhwZoo3UEqCLW6biZJZZZom0e0UhlSiY3rvBjd0cdfLJjTrsXYvN8e5TvPEZ2PYbw9l9CrKqAWFNB+2+W/oiTc2l9BFefC/WPdqPyuxts1/zMlIrbqVB7OZSgaSWrC2eUWHUGcLa2MVrLyho3ftvVhNYq1ye6J8XUnI3JFw8idNdOaB+GIS+vsZhf6gMvsP1OJKGFx1H9o1sQeOSBXOcfc9pQDM3Z2PGvEeykxJ0l7AGaTyux4YKVLpOvs0BO/v0UQf17LdUzwdcskuaFHRo1NIrQxq1I9ByEc2kj+ZwDZsk1z/H9I+L7us+j4fHdUFa2FF3zQtv3DyTwrTcGoVFxXOeWKZEoPeNm+E66b7zSj71r6+ERHXN21C5V85nPmo7I3scRvncfxOoyiP7y0vNdyMZ17X9xmGR+43MPwvvtm23XnPH9h68P4u8U2yuJ7wonvmu0pigValf73XhmfRCt1S5bNbd6QK/0ov+2bhjDE8T3aj58p5hujCehjsZQs+lWLNl5N0RvuS2a5z/T8cLOd8K4/72wxdaAXHq+syGT7sOM7xLxvaOe+F5lu+bqYBjDd25H4s+vQ26ugSBL1lsEC+m4C8fQvMhXZXTa/CR8N96MekrapWCdvc1t+rvn32PY3juYrc7cEjjonFuMYQm97QsBPLSq1v7pKJAPbbwHZ3ueoqCyhJIJStqto8/BdMTh8q1A8PcPo+xrXbbP97ehSXydFWpjU0CZzO8xInM+CqSdTV688OVmBBT7O6DRh/dhYOt20nqSdK+f1RIqdRMqRXgrR90Dm+Dfsdn2+QYpeH7/8CBe+mAsq7nIsevKEjivgv1dQdzYUGH7dMlXe3FmwxZMTRyFgiZkW48mF0/XMYWqm75JfH8IUmPA1tlUMnHv+8T3N3J8d3Hkey6I3re6Djvaam1v/urhswjdsQ2jf/kVJRI1xHdPrh1lltzTWUxXai5H07N74P7KettnPDQyjWtf/ohglyJfl7jz/drP+vDrzgYsLZdtP2PRnz6B/u4t9I+U9cYCH81hddoFuBG4bxNq7v9xSfh+G/H9wKkIwF5JkR38fF3VLb73dDXhpsYS8P0Vxve7MZ14E04EkX2SumDj40Lkjz2LS9x1nZVqcK1rh1L/GaiZDB1GYwGPRi9+sA4r63odGEjAoKTZS0mTwUtoS2sTPioc1jd64KJqNZXRP9EtLFrLT5KQOd6H1JtvQ/SUQ1CUC1Z/tjp5MgXn51bAfc1VpAUVb6pqi+bsqRlrOB0ITSI0kUa1IvF7JcribPbxZnt9BYIeBZm0ap1BO2yHLMOIxjH111chmDocXg9XzZFR4fD74e5cA9GtQEulbLGbfaNMvv4+BfG3hiet9wxlUeDGdDPn68uqXVgVKKezbiBN/HHYoTnrqlORkDx0BHr/ABzVVbknbZysZ3wnRVyda6HU1UIjvpt28p2C+T+GEtYeeEh3jqcdKjl2BcWY65q9UAQb+c6+k3iePnaS+P5Pq8spOJ38fJ09RVI1OFuWo6xtJXSD+J6xh++OHN8PEt8HxtNY4pbAczC+m2Rnh8V3J9Q0Fa4LeG97YQdehj4aoSL9NZiZNMTKStp6g5/x5NsW37vWQaS1WXzPHvjihzYS/lgshbeJ75WySHm7wNXXk8SbK/xutOX4ntHtYRxE0eJn6uARaGf6ie++7GPNxVkf/78AAwCn1+RYqusbZQAAAABJRU5ErkJggg=="></image>
			<view class="goods-section" v-for="(v,k) in data.order" :key="k">
				<view class="g-header">
					<image class="logo" :src="R.formatUrl(v.store_info.store_logo)||''"></image>
					<text class="name">{{v.store_info.store_name||'加载中...'}}</text>
					<text class="chose_coupon" v-if="v.coupons && v.coupons.length>0" @click="data.couponList=v.coupons;data.couponOrderIndex=k;toggleMask('show',k)">{{v.is_coupon?(getCouponName(v.coupons,v.coupon_id)):'选择优惠券'}}</text>
				</view>
				<!-- 商品列表 -->
				<view class="g-item" v-for="(vo,key) in v.goods_list" :key="key">
					<image :src="R.formatUrl(vo.goods_master_image)||''"></image>
					<view class="right">
						<text class="title clamp">{{vo.goods_name||'-'}}</text>
						<text class="spec">{{vo.sku_name||'-'}}</text>
						<view class="price-box">
							<text class="price">￥{{vo.goods_price}}</text>
							<text class="number">x {{vo.buy_num}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 金额明细 -->
			<view class="yt-list">
				<view class="yt-list-cell">
					<text class="cell-tit clamp">商品金额</text>
					<text class="cell-tip">￥{{data.total}}</text>
				</view>
				
						
				<view class="yt-list-cell desc-cell"  style="border-bottom: none;">
					<text class="cell-tit clamp">备注</text>
					<input class="desc" type="text" v-model="data.remark" placeholder="请填写备注信息" placeholder-class="placeholder" />
				</view>
			</view>
			
			<!-- 底部 -->
			<view class="footer">
				<view class="price-content">
					<text>预计付款</text>
					<text class="price-tip">￥</text>
					<text class="price">{{data.total}}</text>
				</view>
				<text class="submit" @click="createOrder">提交订单</text>
			</view>
		</view>
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="data.maskState===0 ? 'none' : data.maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" >
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" @click="coupons_receive(0,0)">
					<view class="con">
						<view class="left">
							<text class="title">不使用优惠券</text>
						</view>
					</view>
				</view>
				<view class="coupon-item" v-for="(item,index) in data.couponList" :key="index" @click="coupons_receive(index,item.id)">
					<view class="con">
						<view class="left">
							<text class="title">{{item.name}}</text>
							<!-- <text class="time"><text v-if="item.use_money>0">满{{item.use_money}}可用</text></text> -->
						</view>
						<view class="right">
							<text class="price" style="color:red">{{item.money}}</text>
						</view>
		
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import Base64 from 'base-64';
	import {onLoad} from "@dcloudio/uni-app"
	import {R} from '@/plugins/http.js' // 请求方式中间件
	const data = reactive({
		maskState: 0, //优惠券面板显示状态
		couponOrderIndex:0,
		couponList:[],
		address_id:0,
		address:{},
		params:{},
		order:[],
		total:0,
		isLoading:false,
		remark:'',
		timers:null,
	})
	//显示优惠券面板
	const toggleMask = (type)=>{
		let timer = type === 'show' ? 10 : 300
		let	state = type === 'show' ? 1 : 0
		data.maskState = 2
		setTimeout(()=>{
			data.maskState = state
		}, timer)
	}
	const coupons_receive = (index,id)=>{
		if(id==0){
			data.order[data.couponOrderIndex].is_coupon = false
		}else{
			data.order[data.couponOrderIndex].is_coupon = true
		}
	}
	const getCouponName = (list,id)=>{
		let name = '选择优惠券'
		list.forEach(item=>{
			if(item.id == id) name = item.name+'(￥'+item.money+')'
		})
		return name
	}

	// 获取地址
	const getAddress = ()=>{
		R.get('addresses/default/get').then(res=> {
			if(res.code == 200){
				data.address_id = res.data.id
				data.address = res.data
			}
		});
	}

	const choseAddress = ()=>{
		if(data.address_id>0){
			R.nav('/pages/users/addresses/index')
		}else{
			R.nav('/pages/users/addresses/edit')
		}
	}
	
	const createOrderBefore = (params)=>{
		data.isLoading = false
		uni.showLoading({
			title:"加载中..."
		})
		R.get('orders/create_order_before',{params:params}).then(res=> {
			if(res.code && res.code == 200){
				res.data.map(item=>{
					item.goods_list.map(item2=>{
						data.total += item2.total;
					})
				})
				data.order = res.data;
				data.isLoading = true
			}else{
				R.toast(res.msg)
				// return R.nav('',3)
			}
		}).finally(()=>{
			uni.$emit('orders')
			uni.hideLoading()
		})
	}
	
	const createOrder = ()=>{
		if(!data.isLoading) R.toast('订单异常无法提交.')
		let coupon_id = [];
		data.order.map(item=>{
			if(item.coupon_id) coupon_id.push(item.coupon_id)
		})
		
		let params = {
			params:data.params,
			address_id:data.address_id,
			coupon_id:coupon_id.join(','),
			remark:data.remark,
		}
		uni.showLoading({
			title:'加载中...'
		});
		
		R.post('orders/create_order',params).then(res=> {
			if(res.code == 200){
				let baseObj = JSON.stringify(res.data)
				var basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
				if(res.data.order_id.length == 0){
					data.timers = setInterval(async ()=>{
						let resp = await R.get('orders/create_order_after',{params:data.params})
						if(resp.code && resp.code == 200){
							if(resp.data.length > 0 ){
								uni.hideLoading()
								resp.data.map(afterItem=>{
									res.data.order_id.push(afterItem.id);
								})
								clearInterval(data.timers)
								baseObj = JSON.stringify(res.data)
								basecode = Base64.encode(unescape(encodeURIComponent(baseObj)))
								R.nav("/pages/orders/pay_order?params="+basecode)
							}
						}
					},500)
				}else{
					uni.hideLoading()
					R.nav("/pages/orders/pay_order?params="+basecode)
				}
				
			}else{
				R.toast(res.msg)
			}
			uni.hideLoading()
		})
	}
	
	onLoad((opt)=>{
		data.params = opt.params
		getAddress()
		createOrderBefore(opt.params)
	})
	
	uni.$on('addresses',()=>{
		getAddress()
	})
</script>

<style lang="scss" scoped>
.order_create{
	background: #fff;
	.mapbg{
		height: 4rpx;
	}
	.goods-section {
		margin-top: 16rpx;
		background: #fff;
		padding-bottom: 1px;
		.chose_coupon{
			font-size: $uni-font-size-base;
			color:$uni-color-error;
			flex: 1;
			text-align: right;
		}
		.g-header {
			display: flex;
			align-items: center;
			height: 84rpx;
			padding: 0 30rpx;
			position: relative;
			border-bottom: 1px solid #efefef;
		}
	
		.logo {
			display: block;
			width: 50rpx;
			height: 50rpx;
			border-radius: 6px;
		}
	
		.name {
			font-size: 30rpx;
			margin-left: 24rpx;
		}
	
		.g-item {
			display: flex;
			margin: 20rpx 30rpx;
	
			image {
				flex-shrink: 0;
				display: block;
				width: 140rpx;
				height: 140rpx;
				border-radius: 6rpx;
			}
	
			.right {
				flex: 1;
				padding-left: 24rpx;
				overflow: hidden;
			}
	
			.title {
				font-size: 30rpx;
				color: #333;
			}
	
			.spec {
				font-size: 26rpx;
				color: #909399;
			}
	
			.price-box {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: #333;
				padding-top: 10rpx;
	
				.price {
					margin-bottom: 4rpx;
					color:#ea1f22;
				}
				.number{
					font-size: 26rpx;
					margin-left: 20rpx;
				}
			}
	
			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16rpx;
		background: #fff;
		
	}
	
	.yt-list-cell {
		display: flex;
		align-items: center;
		margin: 0rpx 30rpx 0rpx 40rpx;
		padding: 20rpx 0;
		line-height: 60rpx;
		position: relative;
		border-bottom: 1px solid #efefef;
		
		.cell-tit {
			flex: 1;
			font-size: 26rpx;
			margin-right: 10rpx;
		}
		.desc {
			flex: 1;
			font-size: 28rpx;
			color: #333;
			text-align: right;
		}
		.cell-tip {
			font-size: 26rpx;
			color: #333;
			
			&.disabled {
				color: #999;
			}
			
			&.active {
				color: $uni-color-error;
			}
			&.red{
				color: $uni-color-error;
			}
		}
	}
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90rpx;
		justify-content: space-between;
		font-size: 30rpx;
		background-color: #fff;
		z-index: 998;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30rpx;
		}
		.price-tip{
			color: $uni-color-error;
			margin-left: 8rpx;
		}
		.price{
			font-size: 36rpx;
			color: $uni-color-error;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280rpx;
			height: 100%;
			color: #fff;
			font-size: 32rpx;
			background-color: $primary;
		}
	}
}
/* 优惠券面板 */
.mask{
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0,0,0,0);
	z-index: 9995;
	transition: .3s;
	
	.mask-content{
		width: 100%;
		min-height: 30vh;
		max-height: 70vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: .3s;
		overflow-y:scroll;
	}
	&.none{
		display: none;
	}
	&.show{
		background: rgba(0,0,0,.4);
		
		.mask-content{
			transform: translateY(0);
		}
	}
}

/* 优惠券列表 */
.coupon-item{
	display: flex;
	flex-direction: column;
	margin: 20rpx 24rpx;
	background: #fff;
	.con{
		display: flex;
		align-items: center;
		position: relative;
		height: 120rpx;
		padding: 0 30rpx;
		&:after{
			position: absolute;
			left: 0;
			bottom: 0;
			content: '';
			width: 100%;
			height: 0;
			border-bottom: 1px dashed #f3f3f3;
			transform: scaleY(50%);
		}
	}
	.left{
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		overflow: hidden;
		height: 100rpx;
	}
	.title{
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10rpx;
	}
	.time{
		font-size: 24rpx;
		color: #999;
	}
	.right{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		height: 100rpx;
	}
	.price{
		font-size: 44rpx;
		&:before{
			content: '￥';
			font-size: 34rpx;
		}
	}
	.tips{
		font-size: 24rpx;
		line-height: 60rpx;
		padding-left: 30rpx;
	}
	.circle{
		position: absolute;
		left: -6rpx;
		bottom: -10rpx;
		z-index: 10;
		width: 20rpx;
		height: 20rpx;
		background: #f3f3f3;
		border-radius: 100px;
		&.r{
			left: auto;
			right: -6rpx;
		}
	}
}
</style>
