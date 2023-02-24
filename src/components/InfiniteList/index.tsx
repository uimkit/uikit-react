import React, { CSSProperties, ReactNode } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

interface RowRenderContext {
	// 渲染的条目索引
	index: number
	// 条目容器样式
	style: CSSProperties
}

interface InfiniteListProps {
	// 数据条目高度
	itemSize: number
	// 数据列表 
	items: any[]
	// 是否上滑加载更多中
	isLoadingMore: boolean
	// 加载更多中提示
	loadingMoreTip?: string
	// 是否下拉刷新中
	isLoadingPrev: boolean
	// 下拉刷新中提示
	loadingPrevTip?: string
	// 是否有更多数据
	hasMore: boolean
	// 没有更多数据提示
	noMoreTip?: string
	// 点击数据条目
	onClick: (item: any, index: number) => void
	// 加载更多
	onLoadMore: () => void
	// 渲染条目
	render: (item: any, index: number) => ReactNode
}

const InfiniteList: React.FC<InfiniteListProps> = ({
	itemSize,
	items,
	isLoadingMore,
	loadingMoreTip,
	isLoadingPrev,
	loadingPrevTip,
	hasMore,
	noMoreTip,
	onLoadMore,
	onClick,
	render,
}) => {
	// 渲染列表条目
	// 如果是下拉刷新中，第一个条目是加载状态，后面的是数据
	// 如果是上滑加载更多中，前面的是数据，最后一个是加载状态
	// 如果全部加载完成，没有更多数据了，前面的是数据，最后是加载完成提示
	const row = ({ index, style }: RowRenderContext): ReactNode => {
		if (isLoadingPrev) {
			// 下拉刷新中
			if (index === 0) {
				// 加载状态
				return (
					<div style={style} >
            loading: {loadingPrevTip}
					</div >
				)
			} else {
				// 数据条目
				const actualIndex = index - 1;
				const item = items[actualIndex];
				return (
					<div style={style} onClick={() => onClick?.(item, actualIndex)}>
						{render(item, actualIndex)}
					</div>
				)
			}

		} else {
			// 上滑加载更多中，或没有更多数据
			if (index < items.length) {
				// 数据条目
				const item = items[index]
				return (
					<div style={style} onClick={() => onClick?.(item, index)}>
						{render(item, index)}
					</div>
				)
			} else {
				// 提示信息
				if (isLoadingMore) {
					// 加载更多
					return (
						<div style={style} >
              loading: {loadingMoreTip}
						</div >
					)
				} else {
					// 没有更多
					return (
						<div style={style} >
              noMoreTip: {noMoreTip}
						</div >
					)
				}
			}
		}
	}

	// 条目是否加载完成，如果有未加载完成的，会触发无限加载
	const isLoaded = idx => {
		if (isLoadingMore || isLoadingPrev) {
			// 在加载中了，不要重复触发加载
			return true;
		} else {
			// 不在加载中，如果还有更多数据，由最后一个条目触发加载
			return idx < items.length || !hasMore;
		}
	}

	return (
		<AutoSizer>
			{({ height, width }) => (
        <InfiniteLoader
					isItemLoaded={isLoaded}
					// 列表条目数量固定多一个，显示加载状态或提示
					itemCount={items.length + 1}
					loadMoreItems={onLoadMore}
				>
					{({ onItemsRendered, ref }) => (
						<FixedSizeList
							height={height}
							width={width}
							itemCount={items.length + 1}
							itemSize={itemSize}
							onItemsRendered={onItemsRendered}
							ref={ref}
						>
							{row}
						</FixedSizeList>
					)}
          
				</InfiniteLoader>
			)
			}
		</AutoSizer >
	)
}

export { InfiniteList }