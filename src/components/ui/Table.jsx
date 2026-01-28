'use client';
import { useState, useMemo, useEffect } from 'react'
import { IconButton, Button, Dropdown, Icon, CheckBox } from '../'
import { chevronLeftIcon, chevronRightIcon, arrowDownShortIcon } from '../../assets/img/icons'

const Table = ({
    secondary = false,
    hideHead = false,
    items = [],
    columns = [],
    rowActions = null,
    defaultSortBy = '',
    defaultSortOrder = 'asc',
    selectable = false,
    selectedItems = [],
    setSelectedItems = null,
    limit = 15,
    noPagination = false,
    rowKey = (item) => item._id,
    renderRow = null,
    onClick = null,
    rowClassName = '',
    emptyText = 'No results found',
}) => {
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState(defaultSortBy)
    const [sortOrder, setSortOrder] = useState(defaultSortOrder)

    const totalPages = Math.ceil(items.length / limit)

    useEffect(() => {
        setPage(1)
    }, [items])

    const handleSort = (field) => {
        if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
        setSortBy(field)
        setSortOrder('asc')
        }
    }

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
        const aValue = a[sortBy] ?? ''
        const bValue = b[sortBy] ?? ''
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }
        return sortOrder === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue))
        })
    }, [items, sortBy, sortOrder])

    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = window.innerWidth < 800 ? 3 : 5
        let startPage = Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
        for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
        }
        return pageNumbers
    }

    const pageItems = 
    noPagination ? sortedItems :
    sortedItems.slice((page - 1) * limit, page * limit)

    return (
        <>
        <div className="overflow-y-auto flex flex-1 overflow-x-auto overflow-y-sm-auto">
            <div className="flex flex-col w-100">
                <table
                    className="w-100"
                    style={{
                        borderCollapse: 'collapse',
                        textIndent: 0,
                    }}
                >
                    {hideHead ? null :
                    <thead>
                        <tr className={`${secondary ? "" : "border-top"}`}>
                            {selectable && (
                                <th className={`${secondary ? ' bg-secondary border-radius-left' : ''} border-bottom border-secondary`}
                                    style={{ width: '20px' }}
                                >
                                    <CheckBox
                                        type="brand"
                                        onClick={() => {
                                            if (selectedItems.length) {
                                                setSelectedItems([])
                                            } else {
                                                setSelectedItems(pageItems.map(item => item._id))
                                            }
                                        }}
                                        className="p-3"
                                        checked={selectedItems.length}
                                        uncheck={selectedItems.length}
                                    />
                                </th>
                            )}
                            {columns.map((col, i, arr) => (
                                <th
                                    key={`item-${i}`}
                                    className={`fs-12 text-start p-3${secondary ? ` bg-secondary ${i === 0 ? ' border-radius-left' : arr.length - 1 === i ? " border-radius-right" : ''}` : " border-bottom border-secondary"}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                <div className={`flex text-nowrap ${col.sortable ? 'pointer' : ''} gap-1 align-center`}>
                                    {col.name}
                                    {sortBy === col.key && col.sortable && (
                                    <span
                                        className={`transition-duration ${
                                        sortOrder === 'asc' ? '' : 'transform-rotate-180'
                                        }`}
                                    >
                                        <Icon icon={arrowDownShortIcon} size="xs" />
                                    </span>
                                    )}
                                </div>
                                </th>
                            ))}
                            {rowActions && <th className="p-3 text-start border-bottom border-secondary"></th>}
                        </tr>
                    </thead>
                    }
                    <tbody>
                        {pageItems.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (rowActions ? 1 : 0) + (selectable ? 1 : 0)} className="text-center py-3 py-sm-2 text-secondary">
                                <div className="border border-radius border-secondary py-6 border-dashed fs-12">
                                    {emptyText}
                                </div>
                            </td>
                        </tr>
                        ) : (
                        pageItems.map((item, index) => (
                            <tr key={`${index}-item`} className={`${selectedItems.includes(item._id) ? " bg-tertiary" : ""} display-on-hover-parent border-bottom${onClick ? " pointer" : ""}${rowClassName ? ` ${rowClassName(item)}` : ' bg-tertiary-hover border-secondary'}`}>
                            {selectable && (
                                <td className={`${secondary ? ' bg-secondary border-radius-left' : ''}`}
                                    style={{ width: '20px' }}
                                >
                                    <CheckBox
                                        checked={selectedItems.includes(item?._id)}
                                        className="p-3"
                                        type="brand"
                                        onClick={() => {
                                            if (setSelectedItems) {
                                                if (selectedItems.includes(item._id)) {
                                                    setSelectedItems(selectedItems.filter(id => id !== item._id))
                                                } else {
                                                    setSelectedItems([...selectedItems, item._id])
                                                }
                                            }
                                        }}
                                    />
                                </td>
                            )}
                            {columns.map((col, i) => (
                                <td key={`${i}-column`} className={`${col.className ? `${col.className}` : 'p-3'}${col.onClick ? ' pointer' : ''}`}
                                    onClick={(e) => {
                                        onClick ? onClick(item) : null
                                        if (col.onClick) {
                                            e.stopPropagation()
                                            col.onClick(item)
                                        }
                                    }}
                                >
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            {rowActions && (
                                <td className="px-3">
                                    <div className="flex justify-end">
                                        {rowActions(item)}
                                    </div>
                                </td>
                            )}
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {noPagination ? null :
        <>
        {/* Pagination */}
        <div className={`flex justify-between align-center gap-3 py-3 px-sm-0 text-secondary sticky-bottom-sm bg-main`}>
            <span className="fs-12 px-3 col-3 px-sm-0">
                { selectable && selectedItems.length > 0 ?
                <span className="text-brand">{selectedItems.length} selected • <span className="weight-500 fs-12 pointer text-underlined"
                    onClick={() => setSelectedItems([])}
                >Deselect</span></span> :
                `${items?.length} results` }
            </span>
            {/* Paginator */}
            <div className="flex gap-2 align-center col-6 justify-center">
                {items?.length === 0 || items?.length <= limit ? null :
                <>
                {!items?.length ? null :
                    <IconButton
                        icon={chevronLeftIcon}
                        variant="text"
                        size="sm"
                        onClick={() => {setPage(page - 1); window.scrollTo(0, 0)}}
                        disabled={page === 1}
                    />
                }
                {getPageNumbers().map((p) => (
                    <Button
                        key={`${p}-page`}
                        label={p}
                        type={page === p ? 'brand' : 'secondary'}
                        size="sm"
                        className="px-3 flex-shrink-0"
                        borderRadius="lg"
                        onClick={() => {setPage(p); window.scrollTo(0, 0)}}
                        variant={page === p ? 'default' : 'text'}
                    />
                ))}
                {!items?.length ? null :
                    <IconButton
                        icon={chevronRightIcon}
                        variant="text"
                        size="sm"
                        onClick={() => {setPage(page + 1); window.scrollTo(0, 0)}}
                        disabled={page === totalPages || items?.length === 0}
                    />
                }
                </>
                }
            </div>
            <span className="fs-12 px-3 col-3 flex justify-end px-sm-0">
                {page} of {totalPages}
            </span>
        </div>
        </>
        }
        </>
    )
}

export default Table