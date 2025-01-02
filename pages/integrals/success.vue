<template>
	<view class="order_pay_success">
		<uni-icons type="checkbox-filled" color="rgb(9, 187, 7)" size="60"></uni-icons>
		<text class="tit">支付成功</text>
		
		<view class="btn-group">
			<navigator url="/pages/integrals/orders" open-type="redirect" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/home" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>


<style lang="scss" scoped>
	page{height: 100%;background: #fff;}
.order_pay_success{
	padding-top: 100rpx;
	border-top: 1px solid #efefef;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.tit{
		margin-top: 40rpx;
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $uni-font-size-base;
		color: #fff;
		background-color: $primary;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #efefef;
		}
	}
}
</style>
