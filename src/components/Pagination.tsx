import React from 'react'
import './Pagination.css';

export default function pagination({ postsPerPage, totalPost, paginate }:any) {

    const pageNumbers: number[] = [];

    for(let i = 1; i<= Math.ceil(totalPost/postsPerPage);i++){
        pageNumbers.push(i)
    }

    return (
        <div className="pagination">
            {pageNumbers.map((id: any) => (
                <a onClick={() => paginate(id)}  className={`${id  === paginate ? "active" : null}`} >{id}</a>
            ))}
        </div>
    )
}